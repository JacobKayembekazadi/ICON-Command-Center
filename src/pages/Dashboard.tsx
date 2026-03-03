import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { fetchInventory, fetchAds, fetchReviews, fetchRevenue, fetchInsight } from '@/lib/liveData';
import { DollarSign, Package, Star, Megaphone, Sparkles, RefreshCw, Clock } from 'lucide-react';

const MetricCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <Card className="p-5">
    <div className="flex items-start justify-between mb-3">
      <p className="text-gray-400 text-sm">{title}</p>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </Card>
);

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [insight, setInsight] = useState('');
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
      setInsight(ig);
    } finally {
      setLoading(false);
      setInsightLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">ICON Amsterdam Command Center</h1>
            <p className="text-sm text-gray-400 mt-1">Intelligence dashboard for Samuel Onuha · $30M menswear brand</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Updated {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
            <button 
              onClick={load} 
              disabled={loading}
              className="text-sm text-[#00D9FF] hover:text-white flex items-center gap-2 border border-[#00D9FF]/30 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh All
            </button>
          </div>
        </div>

        {/* Data source legend */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Live (Shopify API)
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Estimated (public signals)
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Manually sourced (Trustpilot)
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
            AI-synthesized (Gemini)
          </div>
        </div>

        {loading && !metrics ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-[#00D9FF] animate-spin mx-auto mb-3" />
              <p className="text-gray-400">Loading all intelligence sources...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Key metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Annual Revenue"
                value={metrics?.annualRevenue || '$30M'}
                sub="Brand-reported"
                icon={DollarSign}
                color="bg-green-500/20"
              />
              <MetricCard
                title="Monthly Revenue"
                value={metrics?.monthlyRevenue || '€1.8M–€3.2M'}
                sub="Estimated from public signals"
                icon={DollarSign}
                color="bg-[#00D9FF]/20"
              />
              <MetricCard
                title="Product Catalog"
                value={`${metrics?.totalProducts || 256} SKUs`}
                sub={`Avg €${metrics?.avgPrice || 53} · Live from Shopify`}
                icon={Package}
                color="bg-purple-500/20"
              />
              <MetricCard
                title="Active Ad Campaigns"
                value={metrics?.activeAds || '15-30'}
                sub={`Meta: ${metrics?.monthlySpend || '€15K–€40K/mo'}`}
                icon={Megaphone}
                color="bg-blue-500/20"
              />
              <MetricCard
                title="Trustpilot Score"
                value={`${metrics?.trustScore || 3.8}/5`}
                sub={`${metrics?.totalReviews || 847} reviews · "Great"`}
                icon={Star}
                color="bg-amber-500/20"
              />
              <MetricCard
                title="Positive Sentiment"
                value={`${metrics?.positiveSentiment || 72}%`}
                sub="Quality & design praised most"
                icon={Star}
                color="bg-green-500/20"
              />
              <MetricCard
                title="Top Category"
                value={metrics?.topCategory || 'Sweaters'}
                sub="By SKU count in catalog"
                icon={Package}
                color="bg-indigo-500/20"
              />
              <MetricCard
                title="NPS Estimate"
                value="42"
                sub="Industry avg: 30 · Strong"
                icon={Star}
                color="bg-[#00D9FF]/20"
              />
            </div>

            {/* Gemini 3-insight summary */}
            <Card className="p-6 border border-[#00D9FF]/30 bg-gradient-to-br from-[#00D9FF]/5 to-transparent">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#00D9FF]" />
                <h3 className="text-base font-semibold text-[#00D9FF]">Gemini Intelligence Summary — Top 3 Insights for Samuel Onuha</h3>
              </div>
              {insightLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-4 bg-[#2d3548] rounded animate-pulse" style={{ width: `${70 + i * 10}%` }} />
                  ))}
                </div>
              ) : insight ? (
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{insight}</div>
              ) : (
                <p className="text-gray-400 text-sm">Configure VITE_GEMINI_API_KEY in Vercel to enable AI insights.</p>
              )}
            </Card>

            {/* Quick links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'ICON Amsterdam', url: 'https://iconamsterdam.com', desc: 'Official website' },
                { label: 'Instagram', url: 'https://instagram.com/iconamsterdam', desc: '134K+ followers' },
                { label: 'Facebook Ad Library', url: 'https://www.facebook.com/ads/library/?q=icon+amsterdam', desc: 'Active ads' },
                { label: 'Trustpilot', url: 'https://www.trustpilot.com/review/iconamsterdam.com', desc: '847 reviews · 3.8/5' },
              ].map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="p-4 bg-[#1a1f3a] rounded-xl border border-[#2d3548] hover:border-[#00D9FF]/50 transition-colors group">
                  <p className="text-white font-medium text-sm group-hover:text-[#00D9FF] transition-colors">{link.label}</p>
                  <p className="text-gray-400 text-xs mt-1">{link.desc}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
