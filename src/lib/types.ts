// ── Product ─────────────────────────────────────────────────────────────────

/** Shape of a product returned from the Sheet-backed catalogue. */
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price: number | null;
  category: string;
  images: string[];
  image: string;
  stock: number;
  featured: boolean;
  created_at: string;
  /** Auto-derived from category + pack_size by weight.ts — no Sheet column needed. */
  weight_grams?: number;
  sku?: string;
  pack_size?: string;
};

/** A group of pack-size variants under a single base product name. */
export type ProductGroup = {
  /** Display name without pack size, e.g. "Ashwagandha Churna" */
  baseName: string;
  category: string;
  /** Image of the first/default variant */
  image: string;
  /** Slug of the first/default variant (used for "View details" link) */
  slug: string;
  featured: boolean;
  /** All pack-size variants of this product */
  variants: Product[];
  /** Total units sold across all pack sizes (from the Orders sheet). 0 if no sales/data. */
  unitsSold?: number;
  /** True when this is among the top sellers catalogue-wide (drives the "Bestseller" badge). */
  bestseller?: boolean;
};


// ── Cart ───────────────────────────────────────────────────────────────────

/** A single line-item in the shopping cart. */
export type CartItem = {
  /** Product id (matches Product.id) */
  productId: string;
  slug: string;
  name: string;
  /** Effective selling price at the time the item was added (discount_price ?? price). */
  price: number;
  image: string;
  quantity: number;
  /** Maximum orderable quantity — mirrors Product.stock. */
  stock: number;
};

// ── Checkout ───────────────────────────────────────────────────────────────

/** Shipping / billing address captured at checkout. */
export type CheckoutAddress = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

// ── Orders ─────────────────────────────────────────────────────────────────

/** A single product snapshot within a saved order. */
export type OrderLineItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

/**
 * The full order record written to Google Sheets after successful
 * Razorpay payment verification.
 */
export type OrderRecord = {
  /** UUID generated server-side at the time of order creation. */
  id: string;
  /** ISO-8601 timestamp of when the order was placed. */
  createdAt: string;
  customer: CheckoutAddress;
  items: OrderLineItem[];
  /** Sum of (price × quantity) for all items, in INR. */
  subtotal: number;
  /** Delivery charge in INR (0 for free delivery, fixed otherwise). */
  delivery: number;
  /** Combined "Handling & packaging": ₹30/kg packaging + 5% website fee. */
  handling?: number;
  /** subtotal + delivery + handling */
  total: number;
  /** Razorpay order id returned from /api/razorpay/create-order. */
  razorpay_order_id: string;
  /** Razorpay payment id returned by the client after successful payment. */
  razorpay_payment_id?: string;
  paymentStatus?: string;
  paidAt?: string;
  shiprocketOrderId?: string;
  shipmentId?: string;
  awbCode?: string;
  courierName?: string;
  labelUrl?: string;
  shippingError?: string;
  emailSent?: boolean;
  emailError?: string;
  fulfillmentDone?: boolean;
};
