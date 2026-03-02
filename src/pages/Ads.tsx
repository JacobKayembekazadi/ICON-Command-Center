import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { ROASBarChart } from '@/components/charts/ROASBarChart';
import { InsightPanel } from '@/components/dashboard/InsightPanel';
import { storage } from '@/lib/storage';
import { AdPlatform } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Megaphone, MousePointer, Eye, DollarSign, TrendingUp } from 'lucide-react';

export const Ads = () => {
  const [platforms, setPlatforms] = useState<AdPlatform[]>([]);

  useEffect(() => {
    setPlatforms(storage.getAds());
  }, []);

  const totalSpend = platforms.reduce((sum, p) => sum + p.spend, 0);
  const totalRevenue = platforms.reduce((sum, p) => sum + p.revenue, 0);
  const avgRoas = totalRevenue / totalSpend;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Ad Intelligence</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                <Megaphone className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-gray-400 text-sm font-medium">Total Ad Spend</h3>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalSpend)}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg mr-3">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-400 text-sm font-medium">Ad Revenue</h3>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg mr-3">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-gray-400 text-sm font-medium">Average ROAS</h3>
            </div>
            <p className="text-2xl font-bold text-white">{avgRoas.toFixed(2)}x</p>
          </Card>
        </div>

        <InsightPanel 
          context="Ad Performance Analysis: Evaluate ROAS by platform and suggest budget allocation." 
          data={{ platforms }} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ROASBarChart data={platforms} />
          
          <Card title="Platform Performance">
            <div className="space-y-6">
              {platforms.map((platform) => (
                <div key={platform.platform} className="flex items-center justify-between p-4 bg-[#2d3548]/30 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      platform.platform === 'Google' ? 'bg-blue-500' :
                      platform.platform === 'Meta' ? 'bg-blue-700' : 'bg-black border border-white'
                    }`} />
                    <div>
                      <h4 className="font-medium text-white">{platform.platform} Ads</h4>
                      <div className="flex space-x-4 text-xs text-gray-400 mt-1">
                        <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {platform.impressions.toLocaleString()}</span>
                        <span className="flex items-center"><MousePointer className="w-3 h-3 mr-1" /> {platform.clicks.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">ROAS: {platform.roas}x</div>
                    <div className="text-xs text-gray-400">Spend: {formatCurrency(platform.spend)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

