/**
 * Sheet-backed product catalogue.
 *
 * Reads columns A:L from the Products tab (NO weight column needed).
 * Weight is auto-derived from category + pack_size at load time using
 * src/lib/weight.ts rules.
 *
 * Sheet column layout (header row 3):
 *   A: SKU Code | B: Product Name | C: Slug | D: Section | E: Category
 *   F: Pack Size | G: MRP | H: Discount Price | I: Stock | J: Featured
 *   K: Status | L: Note
 */

import { google } from 'googleapis';
import type { Product, ProductGroup } from './types';
import { deriveWeightGrams } from './weight';
import { stripPackSize } from './utils';
import { getSalesTally, getBestsellerNames } from './sales';
import fs from 'node:fs';
import path from 'node:path';

const SHEET_NAME = 'Products';
const RANGE = `${SHEET_NAME}!A1:Z`;

const CACHE_TTL_MS = 60 * 1000;
let cache: { data: Product[]; expiresAt: number } | null = null;

function getSheetsClient() {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) {
    throw new Error('Google Sheets credentials not configured');
  }
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

function rowToProduct(row: any[], headerMap: Map<string, number>): Product | null {
  const getField = (name: string) => headerMap.has(name) ? row[headerMap.get(name)!] : undefined;

  const status = getField('Status');
  if (status !== 'Active') return null;

  const skuCode = getField('SKU Code');
  const sku = getField('sku');
  const name = getField('Product Name');
  const slug = getField('Slug');
  const section = getField('Section');
  const category = getField('Category');
  const packSize = getField('Pack Size');
  const mrp = getField('MRP (₹)');
  const discount = getField('Discount Price (₹)');
  const stock = getField('Stock (units)');
  const featured = getField('Featured');

  if (!skuCode || !name || !slug || !category) return null;

  const priceNum = Number(mrp);
  if (!Number.isFinite(priceNum) || priceNum <= 0) return null;

  const discountNum = Number(discount);
  const stockNum = Math.max(0, Math.floor(Number(stock) || 0));

  // Auto-derive weight from category + pack size — no Sheet column needed
  const weightGrams = deriveWeightGrams(String(category), String(packSize || ''));

  // Check whether a PNG exists for this slug; fall back to SVG placeholder.
  const pngPath = path.join(process.cwd(), 'public', 'products', `${slug}.png`);
  const hasPng = fs.existsSync(pngPath);
  const ext = hasPng ? 'png' : 'svg';
  const baseName = hasPng ? slug : String(slug).replace(/-\d+(?:g|ml|cap|tabs)$/, '');

  return {
    id: String(skuCode),
    name: `${name} (${packSize})`,
    slug: String(slug),
    description: '',
    price: priceNum,
    discount_price:
      Number.isFinite(discountNum) && discountNum > 0 && discountNum < priceNum
        ? discountNum
        : null,
    category: String(category),
    images: [`/products/${baseName}.${ext}`],
    image: `/products/${baseName}.${ext}`,
    stock: stockNum,
    featured: featured === 'Yes',
    created_at: new Date().toISOString(),
    sku_code: String(skuCode),
    sku: sku ? String(sku) : undefined,
    pack_size: String(packSize || ''),
    section: String(section || ''),
    weight_grams: weightGrams,
  } as Product & {
    sku_code: string;
    pack_size: string;
    section: string;
    weight_grams: number;
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured');
  }

  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: RANGE,
    });
    const rows = res.data.values ?? [];
    
    if (rows.length < 2) return [];

    const headers = rows[0];
    const headerMap = new Map<string, number>();
    headers.forEach((h, i) => {
      let key = String(h).trim();
      // Fix potential encoding corruption of the ₹ symbol from Sheets API
      if (key.startsWith('MRP')) key = 'MRP (₹)';
      if (key.startsWith('Discount Price')) key = 'Discount Price (₹)';
      headerMap.set(key, i);
    });

    const expectedHeaders = [
      "SKU Code", "sku", "Product Name", "Slug", "Section", "Category", 
      "Pack Size", "MRP (₹)", "Discount Price (₹)", "Stock (units)", "Featured", "Status", "Note"
    ];
    for (const h of expectedHeaders) {
      if (!headerMap.has(h)) {
        console.warn(`[products] Warning: Header "${h}" not found in Sheet.`);
      }
    }

    const dataRows = rows.slice(1);
    const products = dataRows
      .map((row) => rowToProduct(row, headerMap))
      .filter((p): p is Product => p !== null);

    cache = { data: products, expiresAt: now + CACHE_TTL_MS };
    return products;
  } catch (err) {
    console.error('Failed to fetch products from Sheet:', err);
    return cache?.data ?? [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.id === id);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => ids.includes(p.id));
}

export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
  const all = await getAllProducts();
  const featured = all.filter((p) => p.featured);
  return limit ? featured.slice(0, limit) : featured;
}

export async function getCategories(): Promise<string[]> {
  const all = await getAllProducts();
  return Array.from(new Set(all.map((p) => p.category)));
}

export type SearchParams = {
  q?: string;
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
};

export async function searchProducts(params: SearchParams): Promise<Product[]> {
  let result = await getAllProducts();

  if (params.q) {
    const needle = params.q.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(needle));
  }
  if (params.category) {
    result = result.filter((p) => p.category === params.category);
  }
  const eff = (p: Product) =>
    p.discount_price && p.discount_price < p.price ? p.discount_price : p.price;
  if (params.min) {
    const min = Number(params.min);
    if (Number.isFinite(min)) result = result.filter((p) => eff(p) >= min);
  }
  if (params.max) {
    const max = Number(params.max);
    if (Number.isFinite(max)) result = result.filter((p) => eff(p) <= max);
  }

  switch (params.sort) {
    case 'price-asc':
      result = [...result].sort((a, b) => eff(a) - eff(b));
      break;
    case 'price-desc':
      result = [...result].sort((a, b) => eff(b) - eff(a));
      break;
  }

  return result;
}

export function invalidateProductCache() {
  cache = null;
}

// ── Grouped products ──────────────────────────────────────────────────────

function groupProducts(products: Product[]): ProductGroup[] {
  const map = new Map<string, Product[]>();

  for (const p of products) {
    const baseName = stripPackSize(p.name);
    if (!map.has(baseName)) {
      map.set(baseName, []);
    }
    map.get(baseName)!.push(p);
  }

  const groups: ProductGroup[] = [];
  for (const [baseName, variants] of map) {
    // Sort variants by price ascending so cheapest is first
    variants.sort((a, b) => {
      const aPrice = a.discount_price && a.discount_price < a.price ? a.discount_price : a.price;
      const bPrice = b.discount_price && b.discount_price < b.price ? b.discount_price : b.price;
      return aPrice - bPrice;
    });

    const first = variants[0];
    groups.push({
      baseName,
      category: first.category,
      image: first.image,
      slug: first.slug,
      featured: variants.some((v) => v.featured),
      variants,
    });
  }

  return groups;
}

/**
 * Resolve the full pack-size group that a given slug belongs to, plus the
 * specific variant the slug points at. Powers the product detail page's
 * pack-size selector.
 */
export async function getProductGroupBySlug(
  slug: string
): Promise<{ group: ProductGroup; current: Product } | undefined> {
  const all = await getAllProducts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return undefined;

  const baseName = stripPackSize(current.name);
  const eff = (p: Product) =>
    p.discount_price && p.discount_price < p.price ? p.discount_price : p.price;

  const variants = all
    .filter((p) => stripPackSize(p.name) === baseName)
    .sort((a, b) => eff(a) - eff(b));

  const group: ProductGroup = {
    baseName,
    category: current.category,
    image: current.image,
    slug: current.slug,
    featured: variants.some((v) => v.featured),
    variants,
  };

  return { group, current };
}

/**
 * Related products for the detail page. Prefers other base products in the
 * same category, then fills from the wider catalogue. Never returns other
 * pack-size variants of the same product.
 */
export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await getAllProducts();
  const baseName = stripPackSize(product.name);
  const seenBase = new Set<string>([baseName]);
  const related: Product[] = [];

  const pushDistinct = (pool: Product[]) => {
    for (const p of pool) {
      if (related.length >= limit) break;
      const bn = stripPackSize(p.name);
      if (seenBase.has(bn)) continue;
      seenBase.add(bn);
      related.push(p);
    }
  };

  pushDistinct(all.filter((p) => p.category === product.category));
  if (related.length < limit) pushDistinct(all);

  return related;
}

export async function searchGroupedProducts(params: SearchParams): Promise<ProductGroup[]> {
  let products = await getAllProducts();

  if (params.q) {
    const needle = params.q.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(needle));
  }
  if (params.category) {
    products = products.filter((p) => p.category === params.category);
  }

  const eff = (p: Product) =>
    p.discount_price && p.discount_price < p.price ? p.discount_price : p.price;

  if (params.min) {
    const min = Number(params.min);
    if (Number.isFinite(min)) products = products.filter((p) => eff(p) >= min);
  }
  if (params.max) {
    const max = Number(params.max);
    if (Number.isFinite(max)) products = products.filter((p) => eff(p) <= max);
  }

  const groups = groupProducts(products);

  // ── Best-seller signal from real orders (empty Maps when no sales/data) ──
  const [tally, bestsellerNames] = await Promise.all([
    getSalesTally(),
    getBestsellerNames(8),
  ]);
  for (const g of groups) {
    g.unitsSold = tally.get(g.baseName) ?? 0;
    g.bestseller = bestsellerNames.has(g.baseName);
  }

  // Most-sold first; tie-break (incl. the all-zero "no sales yet" case) keeps a
  // stable, sensible order: featured products, then alphabetical.
  const byBestselling = (a: ProductGroup, b: ProductGroup) => {
    const diff = (b.unitsSold ?? 0) - (a.unitsSold ?? 0);
    if (diff !== 0) return diff;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.baseName.localeCompare(b.baseName);
  };

  switch (params.sort) {
    case 'price-asc':
      groups.sort((a, b) => eff(a.variants[0]) - eff(b.variants[0]));
      break;
    case 'price-desc':
      groups.sort((a, b) => eff(b.variants[0]) - eff(a.variants[0]));
      break;
    case 'latest':
      // Keep natural catalogue (sheet) order.
      break;
    case 'bestselling':
    default:
      // Default ordering across the shop is best-sellers first.
      groups.sort(byBestselling);
      break;
  }

  return groups;
}
