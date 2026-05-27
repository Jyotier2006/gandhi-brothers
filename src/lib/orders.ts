import { google } from "googleapis";
import type { OrderRecord } from "./types";

/**
 * ============================================================================
 * REQUIRED GOOGLE SHEET SETUP:
 * 1. Create a new Google Sheet.
 * 2. Rename the first tab/sheet to exactly: "Orders"
 * 3. Add the following header fields in Row 1 (A through P):
 *    Order ID, Created At, Customer Name, Email, Phone, Address, City, State,
 *    Pincode, Items, Subtotal, Delivery, Total, Razorpay Order ID,
 *    Razorpay Payment ID, Email Sent
 * 4. Create a Google Cloud Project -> APIs & Services -> Enable Google Sheets API.
 * 5. Create Credentials -> Service Account -> Generate JSON key.
 * 6. SHARE the Google Sheet with the Service Account email generated in step 5
 *    (grant "Editor" permissions).
 * 7. Copy the configuration details to your `.env` file:
 *    GOOGLE_SHEETS_CLIENT_EMAIL="..."
 *    GOOGLE_SHEETS_PRIVATE_KEY="..."
 *    GOOGLE_SHEETS_SPREADSHEET_ID="..."
 * ============================================================================
 */

function buildAuth() {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!email || !privateKey || !spreadsheetId) {
    throw new Error(
      "Google Sheets credentials not configured. Please check environment variables."
    );
  }
  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return { auth, spreadsheetId };
}

export async function saveOrderToSheet(order: OrderRecord): Promise<void> {
  const { auth, spreadsheetId } = buildAuth();
  const sheets = google.sheets({ version: "v4", auth });

  // Format cart items beautifully for the spreadsheet cell
  const itemsText = order.items
    .map((i) => `${i.name} ×${i.quantity} @₹${i.price}`)
    .join(" | ");

  const rowData = [
    order.id ?? "",                   // A: Order ID
    order.createdAt ?? "",            // B: Created At
    order.customer?.name ?? "",       // C: Customer Name
    order.customer?.email ?? "",      // D: Email
    order.customer?.phone ?? "",      // E: Phone
    order.customer?.address ?? "",    // F: Address
    order.customer?.city ?? "",       // G: City
    order.customer?.state ?? "",      // H: State
    order.customer?.pincode ?? "",    // I: Pincode
    itemsText,                        // J: Items Summary
    order.subtotal ?? "",             // K: Subtotal
    order.delivery ?? "",             // L: Delivery
    order.total ?? "",                // M: Total
    order.razorpay_order_id ?? "",    // N: Razorpay Order ID
    order.razorpay_payment_id ?? "",  // O: Razorpay Payment ID
    order.emailSent ? "TRUE" : "FALSE", // P: Email Sent
    order.paidAt ?? "",               // Q: Paid At
    order.shiprocketOrderId ?? "",    // R: Shiprocket Order ID
    order.shipmentId ?? "",           // S: Shipment ID
    order.awbCode ?? "",              // T: AWB Code
    order.courierName ?? "",          // U: Courier Name
    order.labelUrl ?? "",             // V: Label URL
    order.shippingError ?? "",        // W: Shipping Error
    order.emailError ?? "",           // X: Email Error
    order.fulfillmentDone ? "TRUE" : "FALSE", // Y: Fulfillment Done
    order.handling ?? "",             // Z: Handling & packaging
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Orders!A:Z",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [rowData] },
  });
}

/**
 * Fetch an order by Razorpay Order ID
 */
export async function getOrder(razorpayOrderId: string): Promise<OrderRecord | null> {
  const { auth, spreadsheetId } = buildAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Orders!A:Y",
  });

  const rows = res.data.values ?? [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[13] === razorpayOrderId) { // Index 13 is column N (Razorpay Order ID)
      // Reconstruct order
      return {
        id: row[0],
        createdAt: row[1],
        customer: {
          name: row[2],
          email: row[3],
          phone: row[4],
          address: row[5],
          city: row[6],
          state: row[7],
          pincode: row[8],
        },
        items: [], // We don't need details of items for the webhook flow, just basic info
        subtotal: parseFloat(row[10] || "0"),
        delivery: parseFloat(row[11] || "0"),
        total: parseFloat(row[12] || "0"),
        razorpay_order_id: row[13],
        razorpay_payment_id: row[14],
        emailSent: row[15] === "TRUE",
        paidAt: row[16],
        shiprocketOrderId: row[17],
        shipmentId: row[18],
        awbCode: row[19],
        courierName: row[20],
        labelUrl: row[21],
        shippingError: row[22],
        emailError: row[23],
        fulfillmentDone: row[24] === "TRUE",
      };
    }
  }
  return null;
}

/** Reconstruct a full OrderRecord from a sheet row (columns A..Y), parsing the
 *  free-text items cell (J) back into line items. */
function rowToOrderRecord(row: any[]): OrderRecord {
  const items = String(row[9] ?? "")
    .split(" | ")
    .map((itemStr: string) => {
      const [namePart, rest] = itemStr.split(" ×");
      const qtyPart = rest ? rest.split(" @")[0] : "1";
      return {
        name: (namePart ?? "").trim(),
        quantity: parseInt(qtyPart, 10) || 1,
        price: 0,
        slug: "",
        productId: "",
        image: "",
      };
    })
    .filter((item: any) => item.name);

  return {
    id: row[0],
    createdAt: row[1],
    customer: {
      name: row[2],
      email: row[3],
      phone: row[4],
      address: row[5],
      city: row[6],
      state: row[7],
      pincode: row[8],
    },
    items,
    subtotal: parseFloat(row[10] || "0"),
    delivery: parseFloat(row[11] || "0"),
    total: parseFloat(row[12] || "0"),
    razorpay_order_id: row[13],
    razorpay_payment_id: row[14],
    emailSent: row[15] === "TRUE",
    paidAt: row[16],
    shiprocketOrderId: row[17],
    shipmentId: row[18],
    awbCode: row[19],
    courierName: row[20],
    labelUrl: row[21],
    shippingError: row[22],
    emailError: row[23],
    fulfillmentDone: row[24] === "TRUE",
    handling: row[25] !== undefined && row[25] !== "" ? Number(row[25]) || 0 : undefined,
  };
}

/**
 * Fetch an order by internal GB Order ID
 */
export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  const { auth, spreadsheetId } = buildAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Orders!A:Y",
  });

  const rows = res.data.values ?? [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === orderId) return rowToOrderRecord(rows[i]);
  }
  return null;
}

/**
 * All orders placed by a given customer email, newest first. Powers the
 * "My Orders" account page and the verified-buyer review check. Returns an
 * empty array (never throws) when Sheets is unavailable.
 */
export async function getOrdersByEmail(email: string): Promise<OrderRecord[]> {
  if (!email) return [];
  try {
    const { auth, spreadsheetId } = buildAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Orders!A:Y",
    });
    const rows = res.data.values ?? [];
    const target = email.trim().toLowerCase();
    const out: OrderRecord[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && String(row[3] ?? "").trim().toLowerCase() === target) {
        out.push(rowToOrderRecord(row));
      }
    }
    out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return out;
  } catch (err) {
    console.warn("[orders] getOrdersByEmail failed (non-fatal):", err);
    return [];
  }
}

/**
 * Updates an order in the sheet. Finds the row by razorpay_order_id and updates all fields.
 */
export async function updateOrderInSheet(order: OrderRecord): Promise<void> {
  const { auth, spreadsheetId } = buildAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Orders!A:N",
  });

  const rows = res.data.values ?? [];
  let targetRowIndex = -1;
  
  console.log('[orders] searching for order', { razorpay_order_id: order.razorpay_order_id, internalId: order.id });
  console.log('[orders] found rows:', rows.length);

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const internalId = row[0] ?? "";
    const razorpayId = row[13] ?? "";
    
    // Search by razorpay_order_id first
    if (order.razorpay_order_id && razorpayId === order.razorpay_order_id) {
      targetRowIndex = i + 1; // 1-indexed
      break;
    } 
    // If not found above, matches internal orderId
    else if (order.id && internalId === order.id) {
      targetRowIndex = i + 1;
      break;
    }
  }

  if (targetRowIndex === -1) {
    console.error(`[orders] Order not found in sheet for update:`, { razorpay_order_id: order.razorpay_order_id, internalId: order.id });
    return; // NON-FATAL
  }

  const itemsText = order.items
    ? order.items.map((i) => `${i.name} ×${i.quantity} @₹${i.price}`).join(" | ")
    : undefined;

  // We are rewriting the row. If itemsText is undefined, we use an empty string or whatever is there, but since we fetched the order, items might be empty array. We should not overwrite items with empty if we don't have it.
  // Actually, we can just update specific columns or the whole row. Let's do selective update or whole row but maintain items.
  // Wait, if getOrder returns items: [], updating the whole row clears J (items).
  // Let's modify getOrder to NOT fill items, and here we just update specific columns!
  
  // It's safer to just update columns O to Y (14 to 24).
  const rowData = [
    order.razorpay_payment_id ?? "",  // O: Razorpay Payment ID
    order.emailSent ? "TRUE" : "FALSE", // P: Email Sent
    order.paidAt ?? "",               // Q: Paid At
    order.shiprocketOrderId ?? "",    // R: Shiprocket Order ID
    order.shipmentId ?? "",           // S: Shipment ID
    order.awbCode ?? "",              // T: AWB Code
    order.courierName ?? "",          // U: Courier Name
    order.labelUrl ?? "",             // V: Label URL
    order.shippingError ?? "",        // W: Shipping Error
    order.emailError ?? "",           // X: Email Error
    order.fulfillmentDone ? "TRUE" : "FALSE", // Y: Fulfillment Done
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Orders!O${targetRowIndex}:Y${targetRowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [rowData] },
  });
}

/**
 * Looks up the "Email Sent" flag (column P) for a given razorpay_order_id.
 * Returns true if already sent (idempotency check before sending emails).
 * Returns false if not found or flag is not "TRUE".
 */
export async function getOrderEmailSentFlag(razorpayOrderId: string): Promise<boolean> {
  const order = await getOrder(razorpayOrderId);
  return order?.emailSent ?? false;
}

/**
 * Sets the "Email Sent" flag (column P) to TRUE for the row matching razorpayOrderId.
 */
export async function markOrderEmailSent(razorpayOrderId: string): Promise<void> {
  const order = await getOrder(razorpayOrderId);
  if (order) {
    order.emailSent = true;
    await updateOrderInSheet(order);
  }
}

