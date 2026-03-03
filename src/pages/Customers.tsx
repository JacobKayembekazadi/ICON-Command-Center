import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { fetchReviews, fetchInsight } from '@/lib/liveData';
import { Star, TrendingUp, TrendingDown, MessageSquare, Sparkles, RefreshCw, ExternalLink, Info } from 'lucide-react';

const StarRating = ({ stars, size = 'sm' }: { stars: number; size?: 'sm' | 'lg' }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} className={`${size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} ${s <= stars ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
    ))}
  </div>
);

export const Customers = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const rev = await fetchReviews();
        setData(rev);
        const ig = await fetchInsight('inventory', {
          trustScore: rev.overview.trustScore,
          totalReviews: rev.overview.totalReviews,
          sentiment: rev.sentiment,
          topPraise: rev.topPraiseThemes.slice(0, 3).map((t: any) => t.theme),
          topComplaints: rev.topComplaintThemes.slice(0, 3).map((t: any) => t.theme),
        });
        setInsight(ig);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#00D9FF] animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading customer intelligence...</p>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Customer Intelligence</h1>
            <p className="text-sm text-gray-400 mt-1">
              <span className="inline-flex items-center gap-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full px-2 py-0.5">
                Manually sourced
              </span>
              {' · '}
              <a href={data?.trustpilotUrl} target="_blank" rel="noopener noreferrer"
                className="text-[#00D9FF] hover:underline inline-flex items-center gap-1 text-xs">
                Trustpilot profile <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{data?.sourceNote}</span>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 border-l-4 border-l-amber-400">
            <p className="text-gray-400 text-sm mb-2">TrustScore</p>
            <p className="text-3xl font-bold text-white">{data?.overview?.trustScore}</p>
            <StarRating stars={data?.overview?.starRating || 4} />
          </Card>
          <Card className="p-5 border-l-4 border-l-[#00D9FF]">
            <p className="text-gray-400 text-sm mb-2">Total Reviews</p>
            <p className="text-3xl font-bold text-white">{data?.overview?.totalReviews?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{data?.overview?.ratingLabel}</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-green-500">
            <p className="text-gray-400 text-sm mb-2">Positive Sentiment</p>
            <p className="text-3xl font-bold text-white">{data?.sentiment?.positive}%</p>
            <p className="text-xs text-gray-500 mt-1">of all reviews</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-purple-500">
            <p className="text-gray-400 text-sm mb-2">NPS Estimate</p>
            <p className="text-3xl font-bold text-white">{data?.sentiment?.npsEstimate}</p>
            <p className="text-xs text-gray-500 mt-1">{data?.sentiment?.npsLabel} (industry avg: 30)</p>
          </Card>
        </div>

        {/* AI Insight */}
        {insight && (
          <Card className="p-5 border border-[#00D9FF]/20 bg-[#00D9FF]/5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#00D9FF]" />
              <h3 className="text-sm font-medium text-[#00D9FF]">Gemini Customer Intelligence</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{insight}</p>
          </Card>
        )}

        {/* Rating distribution */}
        <Card title="Rating Distribution">
          <div className="space-y-3 mt-2">
            {data?.distribution?.slice().reverse().map((d: any) => (
              <div key={d.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16 shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-gray-400 text-sm">{d.stars}</span>
                </div>
                <div className="flex-1 h-3 bg-[#2d3548] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ 
                      width: `${d.percentage}%`,
                      backgroundColor: d.stars >= 4 ? '#22c55e' : d.stars === 3 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
                <span className="text-gray-400 text-sm w-16 text-right">{d.percentage}% ({d.count})</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Praise themes */}
          <Card title="Top Praise Themes">
            <div className="space-y-3 mt-2">
              {data?.topPraiseThemes?.map((t: any, i: number) => (
                <div key={i} className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm font-medium">{t.theme}</span>
                    </div>
                    <span className="text-green-400 text-xs">{t.mentions} mentions</span>
                  </div>
                  <p className="text-gray-400 text-xs italic">"{t.example}"</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Complaint themes */}
          <Card title="Top Complaint Themes">
            <div className="space-y-3 mt-2">
              {data?.topComplaintThemes?.map((t: any, i: number) => (
                <div key={i} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-white text-sm font-medium">{t.theme}</span>
                    </div>
                    <span className="text-red-400 text-xs">{t.mentions} mentions</span>
                  </div>
                  <p className="text-gray-400 text-xs italic">"{t.example}"</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent reviews */}
        <Card title="Recent Reviews">
          <div className="space-y-3 mt-2">
            {data?.recentReviews?.map((r: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#1a1f3a] rounded-lg">
                <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating stars={r.stars} />
                    <span className="text-gray-500 text-xs">{r.country} · {r.date}</span>
                  </div>
                  <p className="text-gray-300 text-sm">"{r.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Key insights */}
        <Card title="Analyst Insights">
          <div className="space-y-3 mt-2">
            {data?.keyInsights?.map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#1a1f3a] rounded-lg">
                <div className="w-6 h-6 rounded-full bg-[#00D9FF]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#00D9FF] text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-gray-300 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};
