import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { fetchInventory, fetchInsight } from '@/lib/liveData';
import { RefreshCw, ExternalLink, Package } from 'lucide-react';

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', borderLeft: '2px solid #C9A84C', paddingLeft: '12px', marginBottom: '16px' }}>
    {children}
  </h2>
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
      setInsightLoading(true);
      const ig = await fetchInsight('inventory', { totalProducts: inv.totalProducts, typeBreakdown: inv.typeBreakdown, stats: inv.stats });
      setInsight(ig);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setInsightLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const typeCategories = data ? Object.entries(data.typeBreakdown as Record<string, any>).sort((a: any, b: any) => b[1].count - a[1].count) : [];
  const pieData = typeCategories.map(([name, d]: any) => ({ name, value: d.count }));
  const filteredProducts = filter === 'All' ? (data?.products || []) : (data?.products || []).filter((p: any) => p.type === filter);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin" style={{ color: '#C9A84C' }} />
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 500, color: '#F5F5F5' }}>
              Inventory Intelligence
            </h1>
            <p style={{ fontSize: '11px', color: '#444444', marginTop: '4px' }}>
              Live · iconamsterdam.com · Updated {data?.fetchedAt ? new Date(data.fetchedAt).toLocaleTimeString() : '—'}
            </p>
          </div>
          <button onClick={load} style={{ fontSize: '11px', color: '#C9A84C', border: '1px solid #C9A84C', padding: '6px 14px', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'transparent', cursor: 'pointer' }} className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px 16px', color: '#ef4444', fontSize: '12px' }}>{error}</div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: '#1A1A1A' }}>
          {[
            { label: 'Total SKUs', value: data?.totalProducts, sub: 'Active catalog' },
            { label: 'Avg Price', value: `€${data?.stats?.avgPrice}`, sub: 'Mid-premium' },
            { label: 'New Arrivals', value: data?.stats?.newArrivalsCount, sub: 'Last 30 days' },
            { label: 'On Sale', value: data?.stats?.onSaleCount, sub: 'Items discounted' },
          ].map(m => (
            <div key={m.label} style={{ background: '#111111', borderTop: '1px solid #C9A84C', padding: '20px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', marginBottom: '8px' }}>{m.label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 300, color: '#F5F5F5' }}>{m.value}</p>
              <p style={{ fontSize: '11px', color: '#444444', marginTop: '4px' }}>{m.sub}</p>
            </div>
          ))}
        </div>

        {(insight || insightLoading) && (
          <div style={{ background: '#111111', border: '1px solid #1A1A1A', borderLeft: '2px solid #C9A84C', padding: '20px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>ICON Inventory Intelligence</p>
            {insightLoading ? (
              <div style={{ height: 14, background: '#1A1A1A', width: '60%' }} className="animate-pulse" />
            ) : (
              <p style={{ color: '#AAAAAA', fontSize: '13px', lineHeight: 1.7 }}>{insight}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Category Breakdown" className="lg:col-span-1">
            <div className="space-y-0">
              {typeCategories.slice(0, 10).map(([type, d]: any) => (
                <div key={type} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #1A1A1A' }}>
                  <div>
                    <span style={{ color: '#F5F5F5', fontSize: '12px' }}>{type}</span>
                    <span style={{ color: '#444444', fontSize: '11px', marginLeft: '8px' }}>avg €{d.avgPrice}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 60, height: 2, background: '#1A1A1A', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#C9A84C', width: `${(d.count / (data?.totalProducts || 1)) * 100}%` }} />
                    </div>
                    <span style={{ color: '#555555', fontSize: '11px', width: 24, textAlign: 'right' }}>{d.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <CategoryPieChart data={pieData} />

            <Card title="Product Catalog">
              <div className="flex gap-2 flex-wrap mb-4">
                {['All', ...typeCategories.slice(0, 6).map(([t]: any) => t)].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{
                      fontSize: '10px', padding: '4px 10px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                      background: filter === f ? '#C9A84C' : 'transparent',
                      color: filter === f ? '#080808' : '#555555',
                      border: `1px solid ${filter === f ? '#C9A84C' : '#222222'}`,
                    }}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                {filteredProducts.slice(0, 20).map((p: any) => (
                  <a key={p.id} href={`https://iconamsterdam.com/products/${p.handle}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 group transition-colors"
                    style={{ background: '#111111', borderBottom: '1px solid #1A1A1A', textDecoration: 'none' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.title} style={{ width: 40, height: 40, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 40, height: 40, background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package style={{ width: 16, height: 16, color: '#444444' }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p style={{ color: '#F5F5F5', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="group-hover:text-[#C9A84C] transition-colors">{p.title}</p>
                      <p style={{ color: '#444444', fontSize: '11px' }}>{p.type}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p style={{ color: '#F5F5F5', fontSize: '12px' }}>€{p.price}</p>
                      {p.compareAtPrice && <p style={{ color: '#444444', fontSize: '11px', textDecoration: 'line-through' }}>€{p.compareAtPrice}</p>}
                    </div>
                  </a>
                ))}
              </div>
              <p style={{ color: '#444444', fontSize: '11px', marginTop: '12px', textAlign: 'center' }}>
                {Math.min(filteredProducts.length, 20)} of {filteredProducts.length} products
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};
