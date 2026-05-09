/**
 * Shiprocket API client.
 *
 * Authenticates with email+password to fetch a JWT token (valid 10 days).
 * Token cached in-memory for 9 days to avoid repeated logins.
 *
 * Used by /api/shipping/quote to fetch courier rates for a (pincode, weight) pair.
 *
 * Environment variables required:
 *   SHIPROCKET_EMAIL              your Shiprocket login email
 *   SHIPROCKET_PASSWORD           your Shiprocket login password
 *   SHIPROCKET_PICKUP_PINCODE     your pickup pincode (default: 362001)
 */

const SR_BASE = 'https://apiv2.shiprocket.in/v1/external';

// Token cache (in-memory, fine for serverless since Next.js keeps the function warm)
let cachedToken: { token: string; expiresAt: number } | null = null;
const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000; // 9 days

// Quote cache (5 minutes) — keyed by pincode+weight
const quoteCache = new Map<string, { quote: ShippingQuote; expiresAt: number }>();
const QUOTE_TTL_MS = 5 * 60 * 1000;

export type CourierOption = {
  courier_name: string;
  rate: number;
  estimated_delivery_days: number;
  cod: number; // 0 = prepaid only, 1 = COD available
};

export type ShippingQuote = {
  serviceable: boolean;
  rate: number;            // average of top-3 cheapest, in rupees
  estimatedDays: number;   // rounded average ETA
  couriers: CourierOption[]; // top 3 used for rate
};

async function getToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email || !password) {
    throw new Error('Shiprocket credentials not configured');
  }

  const res = await fetch(`${SR_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '(no body)');
    console.error(`[shiprocket] auth failed ${res.status}:`, errBody);
    throw new Error(`Shiprocket auth failed: ${res.status} — ${errBody}`);
  }

  const json = await res.json();
  if (!json.token) {
    throw new Error('Shiprocket auth returned no token');
  }

  cachedToken = { token: json.token, expiresAt: now + TOKEN_TTL_MS };
  return json.token;
}

/**
 * Get a shipping quote for delivery to a pincode for a given weight.
 *
 * Strategy: ask Shiprocket for serviceability, take the 3 cheapest non-COD
 * couriers, average their rates, return that as our charge to customer.
 *
 * Why average-of-top-3 instead of cheapest: protects against one courier
 * temporarily changing prices or going offline. The 3rd cheapest is usually
 * within ₹15-20 of the cheapest, so customer cost is similar but more stable.
 */
export async function getShippingQuote(
  deliveryPincode: string,
  weightKg: number
): Promise<ShippingQuote> {
  const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || '362001';

  // Shiprocket bills minimum 0.5kg
  const billableWeight = Math.max(0.5, weightKg);

  const cacheKey = `${deliveryPincode}|${billableWeight.toFixed(2)}`;
  const now = Date.now();
  const cached = quoteCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.quote;
  }

  const token = await getToken();

  const params = new URLSearchParams({
    pickup_postcode: pickupPincode,
    delivery_postcode: deliveryPincode,
    weight: billableWeight.toString(),
    cod: '0', // prepaid only
  });

  const res = await fetch(
    `${SR_BASE}/courier/serviceability/?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Shiprocket serviceability failed: ${res.status}`);
  }

  const json = await res.json();

  // Response shape: { data: { available_courier_companies: [...] } }
  const couriers = (json?.data?.available_courier_companies ?? []) as Array<{
    courier_name: string;
    rate: number;
    estimated_delivery_days: string;
    cod: number;
  }>;

  if (couriers.length === 0) {
    const quote: ShippingQuote = {
      serviceable: false,
      rate: 0,
      estimatedDays: 0,
      couriers: [],
    };
    quoteCache.set(cacheKey, { quote, expiresAt: now + QUOTE_TTL_MS });
    return quote;
  }

  // Sort by rate, take cheapest 3
  const sorted = [...couriers].sort((a, b) => a.rate - b.rate);
  const top3 = sorted.slice(0, 3).map((c) => ({
    courier_name: c.courier_name,
    rate: c.rate,
    estimated_delivery_days: parseInt(c.estimated_delivery_days, 10) || 5,
    cod: c.cod,
  }));

  // Average rate (rounded UP to nearest rupee — never undercharge)
  const avgRate = Math.ceil(
    top3.reduce((sum, c) => sum + c.rate, 0) / top3.length
  );
  const avgDays = Math.round(
    top3.reduce((sum, c) => sum + c.estimated_delivery_days, 0) / top3.length
  );

  const quote: ShippingQuote = {
    serviceable: true,
    rate: avgRate,
    estimatedDays: avgDays,
    couriers: top3,
  };

  quoteCache.set(cacheKey, { quote, expiresAt: now + QUOTE_TTL_MS });
  return quote;
}

/**
 * Helper for callers who only have product weights in grams.
 */
export function totalCartWeightKg(items: { weightGrams: number; quantity: number }[]): number {
  const totalGrams = items.reduce((sum, i) => sum + i.weightGrams * i.quantity, 0);
  // Add 50g for packaging (bubble wrap, outer bag, label)
  return (totalGrams + 50) / 1000;
}

// ── Order Creation & Full Fulfillment Flow ───────────────────────────────────

export async function createShiprocketOrder(order: any) {
  const token = await getToken();
  
  const pickup_location = process.env.SHIPROCKET_PICKUP_LOCATION || "Primary";
  // Format items
  const order_items = order.items && order.items.length > 0 
    ? order.items.map((i: any) => ({
        name: i.name || "Assorted Items",
        sku: i.sku || i.productId || "UNKNOWN",
        units: i.quantity || i.qty || 1,
        selling_price: i.price || (order.amount || order.total || 0),
        hsn: i.hsn || ""
      }))
    : [{
        name: "Assorted Products",
        sku: "ASSORTED",
        units: 1,
        selling_price: order.amount || order.total || 1,
        hsn: ""
      }];

  const payload = {
    order_id: order.id,
    order_date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().slice(0,5),
    pickup_location,
    billing_customer_name: order.customer?.name || "Customer",
    billing_last_name: "",
    billing_address: order.customer?.address || "Address",
    billing_address_2: order.customer?.address2 || "",
    billing_city: order.customer?.city || "City",
    billing_pincode: order.customer?.pincode || "000000",
    billing_state: order.customer?.state || "State",
    billing_country: "India",
    billing_email: order.customer?.email || "email@example.com",
    billing_phone: order.customer?.phone || "0000000000",
    shipping_is_billing: true,
    order_items,
    payment_method: "Prepaid",
    sub_total: order.amount || order.total,
    length: order.dimensions?.length || 15,
    breadth: order.dimensions?.breadth || 15,
    height: order.dimensions?.height || 10,
    weight: order.dimensions?.weight || 0.5
  };

  const res = await fetch(`${SR_BASE}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Shiprocket createOrder failed: ${JSON.stringify(json)}`);
  }
  
  console.log('[shiprocket] createOrder response:', JSON.stringify(json, null, 2));
  
  return { 
    shipment_id: json.shipment_id, 
    order_id: json.order_id, 
    status: json.status,
    status_code: json.status_code
  };
}

export async function assignAWB(shipment_id: number) {
  if (!shipment_id) {
    throw new Error('assignAWB called without shipment_id');
  }
  
  const token = await getToken();
  const res = await fetch(`${SR_BASE}/courier/assign/awb`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ shipment_id: shipment_id })
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Shiprocket assignAWB HTTP ${res.status}: ${JSON.stringify(json)}`);
  }
  
  if (json.awb_assign_status === 0) {
    // No courier available — log but don't throw, return partial result
    console.warn('[shiprocket] no courier available', json);
    return { awb_code: null, courier_name: null, error: json.message || 'No courier available' };
  }
  
  return { 
    awb_code: json.response?.data?.awb_code, 
    courier_name: json.response?.data?.courier_name, 
    courier_company_id: json.response?.data?.courier_company_id 
  };
}

export async function schedulePickup(shipment_id: number) {
  const token = await getToken();
  const res = await fetch(`${SR_BASE}/courier/generate/pickup`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ shipment_id: [shipment_id] })
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Shiprocket schedulePickup failed: ${JSON.stringify(json)}`);
  }
  return json;
}

export async function generateLabel(shipment_id: number) {
  const token = await getToken();
  const res = await fetch(`${SR_BASE}/courier/generate/label`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ shipment_id: [shipment_id] })
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Shiprocket generateLabel failed: ${JSON.stringify(json)}`);
  }
  return { label_url: json.label_url };
}

export async function directShip(order: any) {
  const result: {
    shiprocketOrderId?: string;
    shipmentId?: number;
    awbCode?: string;
    courierName?: string;
    labelUrl?: string;
    error?: string;
  } = {};

  try {
    const created = await createShiprocketOrder(order);
    
    if (!created.shipment_id) {
      console.error('[shiprocket] no shipment_id returned', created);
      return { error: 'Shiprocket order created but no shipment_id', shiprocketOrderId: created.order_id };
    }
    
    result.shiprocketOrderId = created.order_id;
    result.shipmentId = created.shipment_id;

    const awb = await assignAWB(created.shipment_id);
    result.awbCode = awb.awb_code;
    result.courierName = awb.courier_name;

    await schedulePickup(created.shipment_id);

    const label = await generateLabel(created.shipment_id);
    result.labelUrl = label.label_url;
  } catch (e: any) {
    console.error('[shiprocket] directShip error:', e);
    result.error = e.message || String(e);
  }

  return result;
}
