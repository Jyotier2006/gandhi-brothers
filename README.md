# Gandhi Brothers Store

A modern, high-performance Next.js 15 e-commerce platform built for Gandhi Brothers — an FDCA-licensed Ayurvedic manufacturer based in Junagadh, Gujarat. This storefront utilizes a Serverless architecture paired with a local JSON product catalogue (eliminating expensive database hosting), integrates securely with Razorpay for handling dynamic checkouts, and automatically persists verified orders to Google Sheets via secure Service Account JWT authentication. Deployable directly to Vercel.

## What's in here

```
.
├── data/
│   ├── products.json       # Source of truth for product catalogue
│   ├── products.xlsx       # Optional spreadsheet for easy editing
│   └── README.md
├── scripts/
│   └── excel-to-json.mjs   # Conversion script
├── src/
│   ├── app/                # Next.js 15 App Router pages & API routes
│   ├── components/         # Reusable ShadCN and local React components
│   └── lib/                # Zustand cart store, utility functions, types
└── package.json            # Dependencies and scripts
```

---

## Local setup

1. Run standard dependency installation:
```bash
npm install
```

2. *(Optional)* Setup Data: Edit `src/data/products.xlsx` and run `npm run data:convert` to generate your initial database. Alternatively, you can edit `src/data/products.json` directly.

3. **Razorpay setup:**
   - Sign up at [https://dashboard.razorpay.com](https://dashboard.razorpay.com)
   - Navigate to Settings → API Keys → Generate Test Key
   - Copy Key Id (`rzp_test_...`) and Key Secret

4. **Google Sheets setup:**
   - Create a new Google Sheet, and add a tab called exactly "Orders"
   - Match the first header row: `Order ID` | `Created At` | `Customer Name` | `Email` | `Phone` | `Address` | `City` | `State` | `Pincode` | `Items` | `Subtotal` | `Delivery` | `Total` | `Razorpay Order ID` | `Razorpay Payment ID`
   - Create a service account at [https://console.cloud.google.com](https://console.cloud.google.com) → IAM & Admin → Service Accounts
   - **Enable the Google Sheets API** specifically for this Google Cloud base project
   - Create a JSON key for the service account, and download it
   - Share the target Google Sheet with your new service account email (giving it **Editor** permissions)
   - Extract the spreadsheet ID directly from the sheet URL (between `/d/` and `/edit`)
   - From the JSON key, copy `client_email` and `private_key` into your environment variables.

5. Duplicate the environment variables template and configure it:
```bash
cp .env.example .env.local
```
*Note: For `GOOGLE_SHEETS_PRIVATE_KEY`, paste the entire private key including BEGIN/END lines and `\n` line breaks — ensure the entire string is wrapped in double quotes.*

6. Start the local Next.js development server:
```bash
npm run dev
```
Access the application at [http://localhost:3000](http://localhost:3000).

---

## Razorpay test cards

| Network | Number | Code / Instructions |
| ----------- | ----------- | ----------- |
| Visa | `4111 1111 1111 1111` | Any future date, Any 3-digit CVV |
| Mastercard | `5267 3181 8797 5449` | Any future date, Any 3-digit CVV |
| Test UPI | `success@razorpay` | Complete via standard simulator flow |

For a comprehensive list of specific failure triggers, visit [Razorpay Test Card Documentation](https://razorpay.com/docs/payments/payments/test-card-details/).

---

## Deploy to Vercel

1. Push your initialized repository: `git push origin main`.
2. Navigate to [https://vercel.com](https://vercel.com) → Add New → Project → import the repo.
3. Framework Preset: **Next.js** (auto-detected). Root Directory: `./`.
4. Copy over all 7 secure environment variables (ensure they apply to Production, Preview, and Development). 
   - *Note: For `GOOGLE_SHEETS_PRIVATE_KEY` on Vercel, paste the key sequentially with literal `\n` strings (Vercel natively handles them, and our code parses back using `.replace(/\\n/g, '\n')`).*
5. Deploy. The first build typically takes ~2 minutes.
6. After a successful deploy, set `NEXT_PUBLIC_SITE_URL` to the assigned Vercel URL and trigger a redeployment.
7. **Going live:** Complete Razorpay KYC, switch to live keys (`rzp_live_...`), seamlessly update environment variables on Vercel, and route Custom Domains via Project → Settings → Domains → add `gandhibrothers.co.in`.

---

## Security model

- The central `RAZORPAY_KEY_SECRET` is only ever read on isolated server instances (`api` routes). The PUBLIC key (`NEXT_PUBLIC_RAZORPAY_KEY_ID`) is universally the only Razorpay value exposed.
- The `create-order` endpoint completely ignores client-supplied subtotal pricing — actively re-fetching from `products.json` and recomputing server-side.
- The critical `verify-payment` logic strictly validates the `HMAC-SHA256` signature leveraging `RAZORPAY_KEY_SECRET`. The order record is effectively persisted **ONLY** after this local signature securely verifies.
- Appended Google Sheets write-flows execute server-side mapped uniquely utilizing a service account JWT. Service account credentials never transmit outwards.
- The internal manual sync route (`/api/orders/save`) is heavily gated explicitly by a custom `INTERNAL_API_SECRET` header parameter.

---

## Updating the catalogue

When stock configurations change, edit `src/data/products.xlsx` in your spreadsheet editor, then:
```bash
npm run data:convert
```
Commit both files and push. Vercel will automatically redeploy the new catalogue.

*Alternatively:* Easily edit `src/data/products.json` directly using a text editor. Slugs must be consistently unique kebab-case patterns. Image URLs must leverage HTTPS and verify against any whitelists configured in `next.config.js`.

---

## Compliance note

**Gandhi Brothers** operates exclusively as an FDCA-licensed Ayurvedic manufacturer (Licence GA/2079, Form 25D). This immediate storefront prototype does NOT publicly vend/permit Bhasma or Rasaushadhi products. Furthermore, any scheduled Asava-Arishta products align completely with domestic-India-only constraints. 

A static pharmaceutical advisory: *"Ayurvedic medicine. Use under medical supervision."* renders reliably within the persistent site footer and on every individual product detail grid context.

---

## Known gaps for v2

- **No GST invoice PDF:** Build a server action that synchronously generates invoices from the OrderRecord and buffers directly inside Vercel Blob.
- **No COD option:** Razorpay technically supports offline routing; you would skip the signature integration layer mapping the checkout directly with `payment_status=pending_cod`.
- **No email/SMS notifications:** Wire Resend, NodeMailer, or AWS SES into `verify-payment` automatically firing right after the successful Sheets write.
- **No static PIN-code-based delivery estimation:** Map directly into Shiprocket's serviceability API checks.
- **English UI exclusively:** Complete Gujarati localization structural foundations can be augmented universally leveraging `next-intl`.
- **Administrative Interfaces:** Complete admin functionality requires direct Google Sheet editing workflows. No distinct standalone web-based management UI exists immediately in this build matrix.
