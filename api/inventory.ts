import type { VercelRequest, VercelResponse } from '@vercel/node';

const SHOPIFY_BASE = 'https://iconamsterdam.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');

  try {
    const response = await fetch(`${SHOPIFY_BASE}/products.json?limit=250`, {
      headers: { 'User-Agent': UA }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json() as any;
    
    const products = (data.products || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      type: p.product_type || 'Other',
      price: parseFloat(p.variants?.[0]?.price || '0'),
      compareAtPrice: parseFloat(p.variants?.[0]?.compare_at_price || '0') || null,
      image: p.images?.[0]?.src || null,
      handle: p.handle,
      tags: Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? p.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      availableVariants: (p.variants || []).filter((v: any) => v.available !== false).length,
      totalVariants: (p.variants || []).length || 1,
      publishedAt: p.published_at,
      vendor: p.vendor,
    }));

    const typeBreakdown: Record<string, { count: number; avgPrice: number; items: string[] }> = {};
    for (const p of products) {
      const type = p.type || 'Other';
      if (!typeBreakdown[type]) typeBreakdown[type] = { count: 0, avgPrice: 0, items: [] };
      typeBreakdown[type].count++;
      typeBreakdown[type].avgPrice += p.price;
      if (typeBreakdown[type].items.length < 3) typeBreakdown[type].items.push(p.title);
    }
    for (const type of Object.keys(typeBreakdown)) {
      typeBreakdown[type].avgPrice = Math.round(typeBreakdown[type].avgPrice / typeBreakdown[type].count);
    }

    const prices = products.map((p: any) => p.price).filter((p: number) => p > 5);
    const avgPrice = prices.length > 0 ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length : 0;

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const newArrivals = products.filter((p: any) => new Date(p.publishedAt).getTime() > thirtyDaysAgo);
    const onSale = products.filter((p: any) => p.compareAtPrice && p.compareAtPrice > p.price);

    res.json({
      source: 'live',
      fetchedAt: new Date().toISOString(),
      totalProducts: products.length,
      products: products.slice(0, 50),
      typeBreakdown,
      stats: {
        avgPrice: Math.round(avgPrice),
        minPrice: prices.length > 0 ? Math.min(...prices) : 0,
        maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
        onSaleCount: onSale.length,
        newArrivalsCount: newArrivals.length,
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message, source: 'error' });
  }
}
