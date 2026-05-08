# Gandhi Brothers Catalogue Data

The products data powers the entire e-commerce frontend. This is a file-based, serverless data layer. 

- `products.json` is the **source of truth** read by the app at runtime. Do NOT delete this file.
- `products.xlsx` is an **OPTIONAL convenience file** for editing in Excel, LibreOffice, or Google Sheets. It is not used at runtime.

## Editing the Catalogue

We highly recommend maintaining the catalogue using Excel:
1. Open `src/data/products.xlsx` in Excel.
2. Edit rows or add new SKUs.
3. Save the file.
4. Run `npm run data:convert` in the terminal entirely to regenerate `products.json`.
5. Commit and push both files to Vercel.

If you don't have Excel, you may simply edit `products.json` directly using any text or code editor.

## Expected Excel Headers (Row 1)
Your Excel file must exactly match these headers:
`id` | `name` | `slug` | `category` | `price` | `discount_price` | `image` | `description` | `stock` | `featured`

### Data Types:
- **category**: Should strictly be one of `Churna`, `Capsule`, `Arishta`, or `Taila`.
- **price**, **discount_price**, **stock**: Numbers.
- **featured**: `TRUE`/`FALSE`.
- **slug**: Kebab-case uniquely identifying string (e.g. `triphala-churna`). If left blank, the script will auto-generate one from the name.
