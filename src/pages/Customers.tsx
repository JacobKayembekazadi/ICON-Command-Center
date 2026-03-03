import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { fetchReviews, fetchInsight } from '@/lib/liveData';
import { RefreshCw, ExternalLink, Info } from 'lucide-react';

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', borderLeft: '2px solid #C9A84C', paddingLeft: '12px', marginBottom: '16px' }}>
    {children}
  </h2>
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
              Customer Intelligence
            </h1>
            <p style={{ fontSize: '11px', color: '#444444', marginTop: '4px' }}>
              Manual sourcing ·{' '}
              <a href={data?.trustpilotUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C', textDecoration: 'none' }}>
                Trustpilot profile
              </a>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', padding: '12px 16px', fontSize: '12px', color: '#888888' }}>
          <Info style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1, color: '#C9A84C' }} />
          <span>{data?.sourceNote}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: '#1A1A1A' }}>
          {[
            { label: 'TrustScore', value: data?.overview?.trustScore, sub: data?.overview?.ratingLabel || 'Great' },
            { label: 'Total Reviews', value: data?.overview?.totalReviews?.toLocaleString(), sub: 'Verified reviews' },
            { label: 'Positive Sentiment', value: `${data?.sentiment?.positive}%`, sub: 'of all reviews' },
            { label: 'NPS Estimate', value: data?.sentiment?.npsEstimate, sub: `${data?.sentiment?.npsLabel} (avg: 30)` },
          ].map((m, i) => (
            <div key={i} style={{ background: '#111111', borderTop: '1px solid #C9A84C', padding: '20px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', marginBottom: '8px' }}>{m.label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 300, color: '#F5F5F5' }}>{m.value}</p>
              <p style={{ fontSize: '11px', color: '#444444', marginTop: '4px' }}>{m.sub}</p>
            </div>
          ))}
        </div>

        {insight && (
          <div style={{ background: '#111111', border: '1px solid #1A1A1A', borderLeft: '2px solid #C9A84C', padding: '20px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>ICON Customer Intelligence</p>
            <p style={{ color: '#AAAAAA', fontSize: '13px', lineHeight: 1.7 }}>{insight}</p>
          </div>
        )}

        <div>
          <SectionHeader>Rating Distribution</SectionHeader>
          <div style={{ background: '#111111', border: '1px solid #1A1A1A', padding: '20px' }}>
            {data?.distribution?.slice().reverse().map((d: any) => (
              <div key={d.stars} className="flex items-center gap-4 mb-3">
                <span style={{ color: '#555555', fontSize: '12px', width: 40, flexShrink: 0 }}>{d.stars} star</span>
                <div style={{ flex: 1, height: 2, background: '#1A1A1A', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${d.percentage}%`,
                    background: d.stars >= 4 ? '#C9A84C' : d.stars === 3 ? '#888888' : '#333333',
                    transition: 'width 0.7s ease',
                  }} />
                </div>
                <span style={{ color: '#444444', fontSize: '11px', width: 80, textAlign: 'right', flexShrink: 0 }}>{d.percentage}% ({d.count})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <SectionHeader>Top Praise Themes</SectionHeader>
            <div style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
              {data?.topPraiseThemes?.map((t: any, i: number) => (
                <div key={i} className="px-5 py-4" style={{ borderBottom: '1px solid #1A1A1A' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ color: '#F5F5F5', fontSize: '12px' }}>{t.theme}</span>
                    <span style={{ color: '#C9A84C', fontSize: '11px' }}>{t.mentions} mentions</span>
                  </div>
                  <p style={{ color: '#555555', fontSize: '11px', fontStyle: 'italic' }}>"{t.example}"</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader>Top Complaint Themes</SectionHeader>
            <div style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
              {data?.topComplaintThemes?.map((t: any, i: number) => (
                <div key={i} className="px-5 py-4" style={{ borderBottom: '1px solid #1A1A1A' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ color: '#F5F5F5', fontSize: '12px' }}>{t.theme}</span>
                    <span style={{ color: '#888888', fontSize: '11px' }}>{t.mentions} mentions</span>
                  </div>
                  <p style={{ color: '#555555', fontSize: '11px', fontStyle: 'italic' }}>"{t.example}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionHeader>Recent Reviews</SectionHeader>
          <div style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
            {data?.recentReviews?.map((r: any, i: number) => (
              <div key={i} className="px-5 py-4" style={{ borderBottom: '1px solid #1A1A1A' }}>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ color: '#C9A84C', fontSize: '12px' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                  <span style={{ color: '#444444', fontSize: '11px' }}>{r.country} · {r.date}</span>
                </div>
                <p style={{ color: '#AAAAAA', fontSize: '13px', lineHeight: 1.6 }}>"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader>Analyst Insights</SectionHeader>
          <div style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
            {data?.keyInsights?.map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4" style={{ borderBottom: '1px solid #1A1A1A' }}>
                <span style={{ color: '#C9A84C', fontSize: '11px', fontWeight: 500, width: 20, flexShrink: 0 }}>0{i + 1}</span>
                <p style={{ color: '#AAAAAA', fontSize: '13px', lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
