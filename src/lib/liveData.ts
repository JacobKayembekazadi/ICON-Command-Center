// Live data fetching utilities for ICON Amsterdam dashboard
// Cache: 5 minute TTL — data fetched once per session, instant page switches

const CACHE_TTL = 5 * 60 * 1000;

interface CacheEntry { data: any; ts: number; }
const cache: Record<string, CacheEntry> = {};

async function cachedFetch(key: string, url: string, opts?: RequestInit) {
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < CACHE_TTL) return cache[key].data;
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  const data = await res.json();
  cache[key] = { data, ts: now };
  return data;
}

export async function fetchInventory() { return cachedFetch('inventory', '/api/inventory'); }
export async function fetchAds() { return cachedFetch('ads', '/api/ads'); }
export async function fetchReviews() { return cachedFetch('reviews', '/api/reviews'); }
export async function fetchRevenue() { return cachedFetch('revenue', '/api/revenue'); }

export async function fetchInsight(type: string, data: any): Promise<string> {
  const key = `insight_${type}`;
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < CACHE_TTL) return cache[key].data;
  try {
    const res = await fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });
    if (!res.ok) return 'AI insight unavailable.';
    const json = await res.json();
    const insight = json.insight || 'AI insight unavailable.';
    cache[key] = { data: insight, ts: now };
    return insight;
  } catch {
    return 'AI insight unavailable.';
  }
}

export function invalidateCache() { Object.keys(cache).forEach(k => delete cache[k]); }

export function formatEUR(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `€${(value / 1_000).toFixed(0)}K`;
  return `€${value}`;
}
