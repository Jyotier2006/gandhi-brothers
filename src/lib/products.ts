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
import type { Product } from './types';
import { deriveWeightGrams } from './weight';

const SHEET_NAME = 'Products';
const RANGE = `${SHEET_NAME}!A4:L`;

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

function rowToProduct(row: any[]): Product | null {
  const [
    skuCode, name, slug, section, category, packSize,
    mrp, discount, stock, featured, status, _note,
  ] = row;

  if (status !== 'Active') return null;
  if (!skuCode || !name || !slug || !category) return null;

  const priceNum = Number(mrp);
  if (!Number.isFinite(priceNum) || priceNum <= 0) return null;

  const discountNum = Number(discount);
  const stockNum = Math.max(0, Math.floor(Number(stock) || 0));

  // Auto-derive weight from category + pack size — no Sheet column needed
  const weightGrams = deriveWeightGrams(String(category), String(packSize || ''));

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
    images: [`/products/${String(slug).replace(/-\d+g$/, '')}.svg`],
    image: `/products/${String(slug).replace(/-\d+g$/, '')}.svg`,
    stock: stockNum,
    featured: featured === 'Yes',
    created_at: new Date().toISOString(),
    sku_code: String(skuCode),
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
    const products = rows
      .map(rowToProduct)
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
