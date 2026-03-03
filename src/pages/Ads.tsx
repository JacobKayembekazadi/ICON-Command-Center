import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { fetchAds, fetchInsight } from '@/lib/liveData';
import { Megaphone, Eye, DollarSign, TrendingUp, Sparkles, RefreshCw, ExternalLink, Info } from 'lucide-react';

export const Ads = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const ads = await fetchAds();
      setData(ads);
      setInsightLoading(true);
      const ig = await fetchInsight('ads', ads);
      setInsight(ig);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setInsightLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#00D9FF] animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading ad intelligence...</p>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Ad Intelligence</h1>
            <p className="text-sm text-gray-400 mt-1">
              <span className="inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5">
                Estimated · Public signals
              </span>
              {' · '}
              <a href={data?.adLibraryUrl} target="_blank" rel="noopener noreferrer"
                className="text-[#00D9FF] hover:underline inline-flex items-center gap-1 text-xs">
                View Facebook Ad Library <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
          <button onClick={load} className="text-sm text-[#00D9FF] hover:text-white flex items-center gap-2 border border-[#00D9FF]/30 rounded-lg px-3 py-1.5 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{data?.sourceNote}</span>
        </div>

        {/* Overview metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-4 h-4 text-blue-400" />
              <p className="text-gray-400 text-xs">Active Ads (est.)</p>
            </div>
            <p className="text-2xl font-bold text-white">{data?.overview?.estimatedActiveAds}</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <p className="text-gray-400 text-xs">Monthly Spend (est.)</p>
            </div>
            <p className="text-xl font-bold text-white">{data?.overview?.estimatedMonthlySpend}</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <p className="text-gray-400 text-xs">Est. CPM</p>
            </div>
            <p className="text-2xl font-bold text-white">{data?.estimatedMetrics?.estimatedCPM}</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#00D9FF]" />
              <p className="text-gray-400 text-xs">Estimated ROAS</p>
            </div>
            <p className="text-2xl font-bold text-white">{data?.estimatedMetrics?.estimatedROAS}</p>
          </Card>
        </div>

        {/* AI Insight */}
        {(insight || insightLoading) && (
          <Card className="p-5 border border-[#00D9FF]/20 bg-[#00D9FF]/5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#00D9FF]" />
              <h3 className="text-sm font-medium text-[#00D9FF]">Gemini Ad Intelligence</h3>
            </div>
            {insightLoading ? (
              <div className="h-4 bg-[#2d3548] rounded animate-pulse w-3/4" />
            ) : (
              <p className="text-gray-300 text-sm leading-relaxed">{insight}</p>
            )}
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform breakdown */}
          <Card title="Platform Distribution">
            <div className="space-y-4 mt-2">
              {data?.platforms?.map((p: any) => (
                <div key={p.platform} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-white font-medium">{p.platform}</span>
                    </div>
                    <span className="text-[#00D9FF] font-bold">{p.estimatedShare}%</span>
                  </div>
                  <div className="h-2 bg-[#2d3548] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" 
                      style={{ width: `${p.estimatedShare}%`, backgroundColor: p.color }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{p.estimatedSpend}</span>
                    <span>{p.formats.join(' · ')}</span>
                  </div>
                  <p className="text-xs text-gray-400 italic">{p.note}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Creative themes */}
          <Card title="Creative Themes">
            <div className="space-y-3 mt-2">
              {data?.creativeThemes?.map((t: any, i: number) => (
                <div key={i} className="p-3 bg-[#1a1f3a] rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-white text-sm font-medium">{t.theme}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      t.frequency === 'High' ? 'bg-green-500/20 text-green-400' :
                      t.frequency === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>{t.frequency}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{t.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Key intelligence */}
        <Card title="Ad Intelligence Summary">
          <div className="space-y-3 mt-2">
            {data?.intelligence?.map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#1a1f3a] rounded-lg">
                <div className="w-6 h-6 rounded-full bg-[#00D9FF]/20 flex items-center justify-center shrink-0 mt-0.5">
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
