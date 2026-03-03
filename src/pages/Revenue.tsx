import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { fetchRevenue, fetchInsight } from '@/lib/liveData';
import { DollarSign, TrendingUp, BarChart3, Sparkles, RefreshCw, Info, Instagram } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const formatM = (n: number) => `€${(n / 1_000_000).toFixed(1)}M`;

export const Revenue = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const rev = await fetchRevenue();
        setData(rev);
        const ig = await fetchInsight('revenue', {
          annualRevenue: rev.annualRevenueEstimate.value,
          monthlyEstimate: rev.monthlyEstimates.totalRevenue.label,
          topDriver: rev.revenueDrivers[0],
          signals: rev.signals.map((s: any) => `${s.signal}: ${s.value}`),
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
          <p className="text-gray-400">Synthesizing revenue intelligence...</p>
        </div>
      </div>
    </Layout>
  );

  const trendData = data?.monthlyTrend?.map((m: any) => ({
    month: m.month.replace(' 2025', '').replace(' 2026', ''),
    low: m.low / 1_000_000,
    high: m.high / 1_000_000,
    note: m.note,
  })) || [];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Revenue Intelligence</h1>
            <p className="text-sm text-gray-400 mt-1">
              <span className="inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5">
                Estimated · Public signal triangulation
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{data?.methodology}</span>
        </div>

        {/* Hero metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border border-green-500/30 bg-green-500/5">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-400" />
              <p className="text-gray-400 text-sm">{data?.annualRevenueEstimate?.label}</p>
            </div>
            <p className="text-4xl font-bold text-white">{data?.annualRevenueEstimate?.value}</p>
            <p className="text-xs text-gray-400 mt-2">Source: {data?.annualRevenueEstimate?.source}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#00D9FF]" />
              <p className="text-gray-400 text-sm">Monthly Revenue (est.)</p>
            </div>
            <p className="text-3xl font-bold text-white">{data?.monthlyEstimates?.totalRevenue?.label}</p>
            <p className="text-xs text-gray-500 mt-2">Online: {data?.monthlyEstimates?.onlineRevenue?.label}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <p className="text-gray-400 text-sm">Estimated ROAS</p>
            </div>
            <p className="text-3xl font-bold text-white">{data?.monthlyEstimates?.estimatedROAS?.value}</p>
            <p className="text-xs text-gray-500 mt-2">{data?.monthlyEstimates?.estimatedROAS?.note}</p>
          </Card>
        </div>

        {/* AI Insight */}
        {insight && (
          <Card className="p-5 border border-[#00D9FF]/20 bg-[#00D9FF]/5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#00D9FF]" />
              <h3 className="text-sm font-medium text-[#00D9FF]">Gemini Revenue Analysis</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{insight}</p>
          </Card>
        )}

        {/* Revenue trend chart */}
        <Card title="Estimated Monthly Revenue Trend (€M)">
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #2d3548', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(v: any, name: string) => [`€${v}M`, name === 'high' ? 'High estimate' : 'Low estimate']}
                />
                <Bar dataKey="low" fill="#1d4ed8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="high" fill="#00D9FF" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Blue = low estimate · Cyan = high estimate</p>
        </Card>

        {/* Revenue drivers */}
        <Card title="Revenue by Category (estimated)">
          <div className="space-y-4 mt-2">
            {data?.revenueDrivers?.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-28 shrink-0">
                  <p className="text-white text-sm font-medium">{d.category}</p>
                  <p className="text-gray-500 text-xs">avg €{d.avgPrice}</p>
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-[#2d3548] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00D9FF] rounded-full" style={{ width: `${d.share}%` }} />
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{d.rationale}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[#00D9FF] font-bold text-sm">{d.share}%</p>
                  <p className="text-gray-400 text-xs">{d.monthlyEstimate}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Public signals */}
        <Card title="Public Signals Used">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {data?.signals?.map((s: any, i: number) => (
              <div key={i} className="p-3 bg-[#1a1f3a] rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[#00D9FF] text-sm font-medium">{s.signal}</p>
                  <p className="text-white text-sm font-bold shrink-0">{s.value}</p>
                </div>
                <p className="text-gray-400 text-xs mt-1">{s.implication}</p>
                <p className="text-gray-600 text-xs mt-1">Source: {s.source}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Key insights */}
        <Card title="Analyst Insights">
          <div className="space-y-3 mt-2">
            {data?.keyInsights?.map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#1a1f3a] rounded-lg">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <span className="text-green-400 text-xs font-bold">{i + 1}</span>
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
