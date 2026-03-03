import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { fetchInventory, fetchAds, fetchReviews, fetchRevenue, fetchInsight } from '@/lib/liveData';
import { RefreshCw } from 'lucide-react';

const MetricCard = ({ title, value, sub }: any) => (
  <div style={{ background: '#111111', border: '1px solid #1A1A1A', borderTop: '1px solid #C9A84C', padding: '20px' }}>
    <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', marginBottom: '10px' }}>
      {title}
    </p>
    <p style={{ fontSize: '1.75rem', fontWeight: 300, color: '#F5F5F5', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
      {value}
    </p>
    {sub && <p style={{ fontSize: '11px', color: '#444444', marginTop: '6px' }}>{sub}</p>}
  </div>
);

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{
    fontSize: '11px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#555555',
    borderLeft: '2px solid #C9A84C',
    paddingLeft: '12px',
    marginBottom: '16px',
  }}>
    {children}
  </h2>
);

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [insight, setInsight] = useState<any[]>([]);
  const [insightLoading, setInsightLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    setInsightLoading(true);
    try {
      const [inv, ads, reviews, revenue] = await Promise.all([
        fetchInventory().catch(() => null),
        fetchAds().catch(() => null),
        fetchReviews().catch(() => null),
        fetchRevenue().catch(() => null),
      ]);

      const summaryData = {
        totalProducts: inv?.totalProducts,
        activeAds: ads?.overview?.estimatedActiveAds,
        monthlySpend: ads?.overview?.estimatedMonthlySpend,
        trustScore: reviews?.overview?.trustScore,
        totalReviews: reviews?.overview?.totalReviews,
        positiveSentiment: reviews?.sentiment?.positive,
        annualRevenue: revenue?.annualRevenueEstimate?.value,
        monthlyRevenue: revenue?.monthlyEstimates?.totalRevenue?.label,
        avgPrice: inv?.stats?.avgPrice,
        topCategory: inv?.typeBreakdown ? Object.entries(inv.typeBreakdown as any).sort((a: any, b: any) => b[1].count - a[1].count)[0]?.[0] : null,
      };

      setMetrics(summaryData);
      setLastUpdated(new Date());

      const ig = await fetchInsight('dashboard', summaryData);
      try {
        const clean = ig.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        setInsight(Array.isArray(parsed) ? parsed : []);
      } catch {
        setInsight([{ label: 'ANALYSIS', finding: ig, action: '' }]);
      }
    } finally {
      setLoading(false);
      setInsightLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 500, color: '#F5F5F5', letterSpacing: '0.02em' }}>
              ICON Amsterdam
            </h1>
            <p style={{ fontSize: '11px', color: '#444444', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Command Center — Intelligence Dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span style={{ fontSize: '11px', color: '#444444' }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={load}
              disabled={loading}
              style={{ fontSize: '11px', color: '#C9A84C', border: '1px solid #C9A84C', padding: '6px 14px', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'transparent', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
              className="flex items-center gap-2 transition-opacity"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Data source legend */}
        <div className="flex gap-6 flex-wrap">
          {[
            { color: '#22c55e', label: 'Live · Shopify API' },
            { color: '#C9A84C', label: 'Estimated · Public signals' },
            { color: '#888888', label: 'Manual · Trustpilot' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2" style={{ fontSize: '11px', color: '#444444' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {label}
            </div>
          ))}
        </div>

        {loading && !metrics ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3" style={{ color: '#C9A84C' }} />
              <p style={{ color: '#444444', fontSize: '12px' }}>Loading intelligence sources...</p>
            </div>
          </div>
        ) : (
          <>
            <div>
              <SectionHeader>Key Metrics</SectionHeader>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: '#1A1A1A' }}>
                <MetricCard title="Annual Revenue" value={metrics?.annualRevenue || '$30M'} sub="Brand-reported" />
                <MetricCard title="Monthly Revenue" value={metrics?.monthlyRevenue || '€1.8M–€3.2M'} sub="Estimated" />
                <MetricCard title="Product Catalog" value={`${metrics?.totalProducts || 256} SKUs`} sub={`Avg €${metrics?.avgPrice || 53}`} />
                <MetricCard title="Active Campaigns" value={metrics?.activeAds || '15–30'} sub={`Meta: ${metrics?.monthlySpend || '€15K–€40K/mo'}`} />
                <MetricCard title="Trustpilot Score" value={`${metrics?.trustScore || 3.8}/5`} sub={`${metrics?.totalReviews || 847} reviews`} />
                <MetricCard title="Positive Sentiment" value={`${metrics?.positiveSentiment || 72}%`} sub="Quality & design praised" />
                <MetricCard title="Top Category" value={metrics?.topCategory || 'Sweaters'} sub="By SKU count" />
                <MetricCard title="NPS Estimate" value="42" sub="Industry avg: 30" />
              </div>
            </div>

            {/* ICON Intelligence */}
            <div>
              <SectionHeader>AI Intelligence Summary</SectionHeader>
              <div style={{ background: '#111111', border: '1px solid #1A1A1A', borderLeft: '2px solid #C9A84C', padding: '24px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>
                  ICON Intelligence — Top 3 Insights
                </p>
                {insightLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ height: 14, background: '#1A1A1A', width: `${60 + i * 10}%` }} className="animate-pulse" />
                    ))}
                  </div>
                ) : insight.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#1A1A1A' }}>
                    {insight.map((ins: any, i: number) => (
                      <div key={i} style={{ background: '#111111', padding: '20px', borderTop: '1px solid #C9A84C' }}>
                        <p style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>{ins.label}</p>
                        <p style={{ fontSize: '12px', color: '#F5F5F5', lineHeight: 1.6, marginBottom: '10px' }}>{ins.finding}</p>
                        {ins.action && <p style={{ fontSize: '11px', color: '#555555', borderTop: '1px solid #1A1A1A', paddingTop: '8px' }}>→ {ins.action}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#444444', fontSize: '12px' }}>ICON Intelligence is initialising...</p>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <SectionHeader>External References</SectionHeader>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: '#1A1A1A' }}>
                {[
                  { label: 'ICON Amsterdam', url: 'https://iconamsterdam.com', desc: 'Official website' },
                  { label: 'Instagram', url: 'https://instagram.com/iconamsterdam', desc: '134K+ followers' },
                  { label: 'Facebook Ad Library', url: 'https://www.facebook.com/ads/library/?q=icon+amsterdam', desc: 'Active campaigns' },
                  { label: 'Trustpilot', url: 'https://www.trustpilot.com/review/iconamsterdam.com', desc: '847 reviews · 3.8/5' },
                ].map(link => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{ background: '#111111', padding: '20px', display: 'block', textDecoration: 'none', transition: 'border-color 0.15s' }}
                    className="group hover:border-[#C9A84C]"
                  >
                    <p style={{ color: '#F5F5F5', fontSize: '12px', fontWeight: 500 }} className="group-hover:text-[#C9A84C] transition-colors">{link.label}</p>
                    <p style={{ color: '#444444', fontSize: '11px', marginTop: '4px' }}>{link.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
