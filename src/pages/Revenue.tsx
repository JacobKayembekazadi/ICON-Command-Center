import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { fetchRevenue, fetchInsight } from '@/lib/liveData';
import { RefreshCw, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', borderLeft: '2px solid #C9A84C', paddingLeft: '12px', marginBottom: '16px' }}>
    {children}
  </h2>
);

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
        <RefreshCw className="w-6 h-6 animate-spin" style={{ color: '#C9A84C' }} />
      </div>
    </Layout>
  );

  const trendData = data?.monthlyTrend?.map((m: any) => ({
    month: m.month.replace(' 2025', '').replace(' 2026', ''),
    low: m.low / 1_000_000,
    high: m.high / 1_000_000,
  })) || [];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 500, color: '#F5F5F5' }}>
            Revenue Intelligence
          </h1>
          <p style={{ fontSize: '11px', color: '#444444', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Estimated · Public signal triangulation
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', padding: '12px 16px', fontSize: '12px', color: '#888888' }}>
          <Info style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1, color: '#C9A84C' }} />
          <span>{data?.methodology}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: '#1A1A1A' }}>
          {[
            { label: data?.annualRevenueEstimate?.label, value: data?.annualRevenueEstimate?.value, sub: `Source: ${data?.annualRevenueEstimate?.source}` },
            { label: 'Monthly Revenue (est.)', value: data?.monthlyEstimates?.totalRevenue?.label, sub: `Online: ${data?.monthlyEstimates?.onlineRevenue?.label}` },
            { label: 'Estimated ROAS', value: data?.monthlyEstimates?.estimatedROAS?.value, sub: data?.monthlyEstimates?.estimatedROAS?.note },
          ].map((m, i) => (
            <div key={i} style={{ background: '#111111', borderTop: '1px solid #C9A84C', padding: '24px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', marginBottom: '10px' }}>{m.label}</p>
              <p style={{ fontSize: '2rem', fontWeight: 300, color: '#F5F5F5', fontVariantNumeric: 'tabular-nums' }}>{m.value}</p>
              <p style={{ fontSize: '11px', color: '#444444', marginTop: '6px' }}>{m.sub}</p>
            </div>
          ))}
        </div>

        {insight && (
          <div style={{ background: '#111111', border: '1px solid #1A1A1A', borderLeft: '2px solid #C9A84C', padding: '20px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>Gemini Revenue Analysis</p>
            <p style={{ color: '#AAAAAA', fontSize: '13px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{insight}</p>
          </div>
        )}

        <div>
          <SectionHeader>Monthly Revenue Trend (€M)</SectionHeader>
          <div style={{ background: '#111111', border: '1px solid #1A1A1A', padding: '24px', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{ fill: '#444444', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#444444', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}M`} />
                <Tooltip contentStyle={{ background: '#111111', border: '1px solid #C9A84C', color: '#F5F5F5', borderRadius: 0 }}
                  labelStyle={{ color: '#F5F5F5' }}
                  formatter={(v: any, name: string) => [`€${v}M`, name === 'high' ? 'High estimate' : 'Low estimate']} />
                <Bar dataKey="low" fill="#333333" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" fill="#C9A84C" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <SectionHeader>Revenue by Category (estimated)</SectionHeader>
          <div style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
            {data?.revenueDrivers?.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-6 px-6 py-4" style={{ borderBottom: '1px solid #1A1A1A' }}>
                <div style={{ width: 120, flexShrink: 0 }}>
                  <p style={{ color: '#F5F5F5', fontSize: '12px' }}>{d.category}</p>
                  <p style={{ color: '#444444', fontSize: '11px' }}>avg €{d.avgPrice}</p>
                </div>
                <div className="flex-1">
                  <div style={{ height: 2, background: '#1A1A1A', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#C9A84C', width: `${d.share}%` }} />
                  </div>
                  <p style={{ color: '#444444', fontSize: '11px', marginTop: '4px' }}>{d.rationale}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: '#C9A84C', fontSize: '13px', fontWeight: 500 }}>{d.share}%</p>
                  <p style={{ color: '#444444', fontSize: '11px' }}>{d.monthlyEstimate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader>Public Signals Used</SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: '#1A1A1A' }}>
            {data?.signals?.map((s: any, i: number) => (
              <div key={i} style={{ background: '#111111', padding: '16px 20px' }}>
                <div className="flex items-start justify-between gap-4">
                  <p style={{ color: '#C9A84C', fontSize: '12px', fontWeight: 500 }}>{s.signal}</p>
                  <p style={{ color: '#F5F5F5', fontSize: '12px', fontWeight: 500, flexShrink: 0 }}>{s.value}</p>
                </div>
                <p style={{ color: '#AAAAAA', fontSize: '11px', marginTop: '4px' }}>{s.implication}</p>
                <p style={{ color: '#444444', fontSize: '11px', marginTop: '2px' }}>Source: {s.source}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader>Analyst Insights</SectionHeader>
          <div style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
            {data?.keyInsights?.map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4" style={{ borderBottom: '1px solid #1A1A1A' }}>
                <span style={{ color: '#C9A84C', fontSize: '11px', fontWeight: 500, width: 20, flexShrink: 0, paddingTop: 1 }}>0{i + 1}</span>
                <p style={{ color: '#AAAAAA', fontSize: '13px', lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
