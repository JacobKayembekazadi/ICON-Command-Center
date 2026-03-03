// Live data fetching utilities for ICON Amsterdam dashboard

export async function fetchInventory() {
  const res = await fetch('/api/inventory');
  if (!res.ok) throw new Error(`Inventory API error: ${res.status}`);
  return res.json();
}

export async function fetchAds() {
  const res = await fetch('/api/ads');
  if (!res.ok) throw new Error(`Ads API error: ${res.status}`);
  return res.json();
}

export async function fetchReviews() {
  const res = await fetch('/api/reviews');
  if (!res.ok) throw new Error(`Reviews API error: ${res.status}`);
  return res.json();
}

export async function fetchRevenue() {
  const res = await fetch('/api/revenue');
  if (!res.ok) throw new Error(`Revenue API error: ${res.status}`);
  return res.json();
}

export async function fetchInsight(type: string, data: any): Promise<string> {
  try {
    const res = await fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });
    if (!res.ok) return 'AI insight unavailable.';
    const json = await res.json();
    return json.insight || 'AI insight unavailable.';
  } catch {
    return 'AI insight unavailable.';
  }
}

export function formatEUR(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `€${(value / 1_000).toFixed(0)}K`;
  return `€${value}`;
}
