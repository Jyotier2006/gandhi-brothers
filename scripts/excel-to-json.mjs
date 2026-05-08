import XLSX from "xlsx";
import fs from "node:fs";
import path from "node:path";

const EXCEL_PATH = path.join(process.cwd(), "src", "data", "products.xlsx");
const JSON_PATH = path.join(process.cwd(), "src", "data", "products.json");

if (!fs.existsSync(EXCEL_PATH)) {
  console.error("❌ Excel file not found at src/data/products.xlsx");
  console.log("If this is intended, no conversion is necessary.");
  process.exit(0);
}

try {
  // Read workbook
  const workbook = XLSX.readFile(EXCEL_PATH);
  
  // Take first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
  
  const processedRows = rawRows.map((row) => {
    // Basic structural validation
    if (!row.id || !row.name || !row.category || !row.price || !row.image || row.stock === "") {
      throw new Error(`Row missing required fields: ${JSON.stringify(row)}`);
    }

    const price = Number(row.price);
    const discount_price = row.discount_price ? Number(row.discount_price) : null;
    const stock = Number(row.stock);
    
    // Coerce featured flag
    const featuredRaw = String(row.featured).toLowerCase().trim();
    const featured = featuredRaw === "true" || featuredRaw === "1" || featuredRaw === "yes";

    // Dynamic slug generation if missing
    let slug = row.slug ? String(row.slug).trim() : "";
    if (!slug) {
      slug = String(row.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    return {
      id: String(row.id),
      name: String(row.name).trim(),
      slug,
      category: String(row.category).trim(),
      price,
      discount_price,
      image: String(row.image).trim(),
      description: row.description ? String(row.description).trim() : "",
      stock,
      featured,
    };
  });

  fs.writeFileSync(JSON_PATH, JSON.stringify(processedRows, null, 2), "utf-8");
  console.log(`✅ Successfully converted ${processedRows.length} rows to products.json`);
} catch (error) {
  console.error("❌ Failed to process Excel file:", error);
  process.exit(1);
}
