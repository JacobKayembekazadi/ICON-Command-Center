import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { fetchAds, fetchInsight } from '@/lib/liveData';
import { RefreshCw, ExternalLink, Info } from 'lucide-react';

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', borderLeft: '2px solid #C9A84C', paddingLeft: '12px', marginBottom: '16px' }}>
    {children}
  </h2>
);

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
              Ad Intelligence
            </h1>
            <p style={{ fontSize: '11px', color: '#444444', marginTop: '4px' }}>
              Estimated · Public signals ·{' '}
              <a href={data?.adLibraryUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C', textDecoration: 'none' }}>
                Facebook Ad Library
              </a>
            </p>
          </div>
          <button onClick={load} style={{ fontSize: '11px', color: '#C9A84C', border: '1px solid #C9A84C', padding: '6px 14px', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'transparent', cursor: 'pointer' }} className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', padding: '12px 16px', fontSize: '12px', color: '#888888' }}>
          <Info style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1, color: '#C9A84C' }} />
          <span>{data?.sourceNote}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px" style={{ background: '#1A1A1A' }}>
          {[
            { label: 'Active Ads (est.)', value: data?.overview?.estimatedActiveAds },
            { label: 'Monthly Spend (est.)', value: data?.overview?.estimatedMonthlySpend },
            { label: 'Est. CPM', value: data?.estimatedMetrics?.estimatedCPM },
            { label: 'Estimated ROAS', value: data?.estimatedMetrics?.estimatedROAS },
          ].map((m, i) => (
            <div key={i} style={{ background: '#111111', borderTop: '1px solid #C9A84C', padding: '20px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', marginBottom: '8px' }}>{m.label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 300, color: '#F5F5F5', fontVariantNumeric: 'tabular-nums' }}>{m.value}</p>
            </div>
          ))}
        </div>

        {(insight || insightLoading) && (
          <div style={{ background: '#111111', border: '1px solid #1A1A1A', borderLeft: '2px solid #C9A84C', padding: '20px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>ICON Ad Intelligence</p>
            {insightLoading ? (
              <div style={{ height: 14, background: '#1A1A1A', width: '60%' }} className="animate-pulse" />
            ) : (
              <p style={{ color: '#AAAAAA', fontSize: '13px', lineHeight: 1.7 }}>{insight}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <SectionHeader>Platform Distribution</SectionHeader>
            <div style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
              {data?.platforms?.map((p: any) => (
                <div key={p.platform} className="px-5 py-4" style={{ borderBottom: '1px solid #1A1A1A' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: '#F5F5F5', fontSize: '12px', fontWeight: 500 }}>{p.platform}</span>
                    <span style={{ color: '#C9A84C', fontSize: '13px', fontWeight: 500 }}>{p.estimatedShare}%</span>
                  </div>
                  <div style={{ height: 2, background: '#1A1A1A', overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', background: '#C9A84C', width: `${p.estimatedShare}%`, transition: 'width 0.7s ease' }} />
                  </div>
                  <div className="flex justify-between" style={{ fontSize: '11px', color: '#444444' }}>
                    <span>{p.estimatedSpend}</span>
                    <span>{p.formats?.join(' · ')}</span>
                  </div>
                  {p.note && <p style={{ fontSize: '11px', color: '#555555', marginTop: '4px', fontStyle: 'italic' }}>{p.note}</p>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader>Creative Themes</SectionHeader>
            <div style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
              {data?.creativeThemes?.map((t: any, i: number) => (
                <div key={i} className="px-5 py-4" style={{ borderBottom: '1px solid #1A1A1A' }}>
                  <div className="flex justify-between items-start mb-1">
                    <span style={{ color: '#F5F5F5', fontSize: '12px', fontWeight: 500 }}>{t.theme}</span>
                    <span style={{
                      fontSize: '10px', padding: '2px 8px', letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: t.frequency === 'High' ? '#C9A84C' : '#666666',
                      border: `1px solid ${t.frequency === 'High' ? '#C9A84C' : '#333333'}`,
                    }}>{t.frequency}</span>
                  </div>
                  <p style={{ color: '#555555', fontSize: '11px', marginTop: '4px' }}>{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionHeader>Ad Intelligence Summary</SectionHeader>
          <div style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
            {data?.intelligence?.map((item: string, i: number) => (
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
