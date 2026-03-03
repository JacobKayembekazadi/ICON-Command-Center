import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { fetchInventory, fetchInsight } from '@/lib/liveData';
import { Package, TrendingUp, Tag, Sparkles, RefreshCw, ExternalLink } from 'lucide-react';

const LIVE_BADGE = (
  <span className="inline-flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5">
    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
    Live data
  </span>
);

const EST_BADGE = (
  <span className="inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5">
    Live via Shopify API
  </span>
);

export const Inventory = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<string>('');
  const [insightLoading, setInsightLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState('All');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const inv = await fetchInventory();
      setData(inv);
      
      // Fetch Gemini insight
      setInsightLoading(true);
      const ig = await fetchInsight('inventory', {
        totalProducts: inv.totalProducts,
        typeBreakdown: inv.typeBreakdown,
        stats: inv.stats,
      });
      setInsight(ig);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setInsightLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const typeCategories = data ? Object.entries(data.typeBreakdown as Record<string, any>)
    .sort((a: any, b: any) => b[1].count - a[1].count) : [];

  const pieData = typeCategories.map(([name, d]: any) => ({ name, value: d.count }));

  const filteredProducts = filter === 'All'
    ? (data?.products || [])
    : (data?.products || []).filter((p: any) => p.type === filter);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#00D9FF] animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Fetching live catalog from iconamsterdam.com...</p>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Inventory Intelligence</h1>
            <p className="text-sm text-gray-400 mt-1">
              {LIVE_BADGE} {' '}
              <a href="https://iconamsterdam.com/collections/all" target="_blank" rel="noopener noreferrer" 
                className="text-[#00D9FF] hover:underline inline-flex items-center gap-1">
                iconamsterdam.com <ExternalLink className="w-3 h-3" />
              </a>
              {' · '} Updated {data?.fetchedAt ? new Date(data.fetchedAt).toLocaleTimeString() : '—'}
            </p>
          </div>
          <button onClick={load} className="text-sm text-[#00D9FF] hover:text-white flex items-center gap-2 border border-[#00D9FF]/30 rounded-lg px-3 py-1.5 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">{error}</div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-[#00D9FF]" />
              <p className="text-gray-400 text-sm">Total SKUs</p>
            </div>
            <p className="text-2xl font-bold text-white">{data?.totalProducts}</p>
            <p className="text-xs text-gray-500 mt-1">Active catalog</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Tag className="w-5 h-5 text-green-400" />
              <p className="text-gray-400 text-sm">Avg Price</p>
            </div>
            <p className="text-2xl font-bold text-white">€{data?.stats?.avgPrice}</p>
            <p className="text-xs text-gray-500 mt-1">Mid-premium positioning</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <p className="text-gray-400 text-sm">New Arrivals</p>
            </div>
            <p className="text-2xl font-bold text-white">{data?.stats?.newArrivalsCount}</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Tag className="w-5 h-5 text-amber-400" />
              <p className="text-gray-400 text-sm">On Sale</p>
            </div>
            <p className="text-2xl font-bold text-white">{data?.stats?.onSaleCount}</p>
            <p className="text-xs text-gray-500 mt-1">Items discounted</p>
          </Card>
        </div>

        {/* AI Insight */}
        {(insight || insightLoading) && (
          <Card className="p-5 border border-[#00D9FF]/20 bg-[#00D9FF]/5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#00D9FF]" />
              <h3 className="text-sm font-medium text-[#00D9FF]">Gemini Inventory Intelligence</h3>
            </div>
            {insightLoading ? (
              <div className="h-4 bg-[#2d3548] rounded animate-pulse w-3/4" />
            ) : (
              <p className="text-gray-300 text-sm leading-relaxed">{insight}</p>
            )}
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category breakdown */}
          <Card title="Category Breakdown" className="lg:col-span-1">
            <div className="space-y-2 mt-2">
              {typeCategories.slice(0, 10).map(([type, d]: any) => (
                <div key={type} className="flex items-center justify-between py-2 border-b border-[#2d3548]/50 last:border-0">
                  <div>
                    <span className="text-white text-sm font-medium">{type}</span>
                    <span className="text-gray-500 text-xs ml-2">avg €{d.avgPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-[#2d3548] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#00D9FF] rounded-full"
                        style={{ width: `${(d.count / (data?.totalProducts || 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs w-8 text-right">{d.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pie chart + product list */}
          <div className="lg:col-span-2 space-y-6">
            <CategoryPieChart data={pieData} />

            {/* Product grid */}
            <Card title="Product Catalog">
              <div className="flex gap-2 flex-wrap mb-4">
                {['All', ...typeCategories.slice(0, 6).map(([t]: any) => t)].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      filter === f 
                        ? 'bg-[#00D9FF] text-black border-[#00D9FF]' 
                        : 'border-[#2d3548] text-gray-400 hover:border-[#00D9FF]/50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {filteredProducts.slice(0, 20).map((p: any) => (
                  <a
                    key={p.id}
                    href={`https://iconamsterdam.com/products/${p.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#1a1f3a] rounded-lg hover:bg-[#2d3548]/50 transition-colors group"
                  >
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-[#2d3548] rounded flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate group-hover:text-[#00D9FF] transition-colors">{p.title}</p>
                      <p className="text-gray-400 text-xs">{p.type}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white text-sm font-bold">€{p.price}</p>
                      {p.compareAtPrice && <p className="text-gray-500 text-xs line-through">€{p.compareAtPrice}</p>}
                    </div>
                  </a>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-3 text-center">
                Showing {Math.min(filteredProducts.length, 20)} of {filteredProducts.length} products · 
                <a href="https://iconamsterdam.com/collections/all" target="_blank" rel="noopener noreferrer" className="text-[#00D9FF] ml-1 hover:underline">
                  View full catalog ↗
                </a>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};
