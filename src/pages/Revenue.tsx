import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { InsightPanel } from '@/components/dashboard/InsightPanel';
import { Card } from '@/components/ui/Card';
import { storage } from '@/lib/storage';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

export const Revenue = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const orders = storage.getOrders();
    const products = storage.getProducts();

    // Revenue Trend
    const revenueByDate = orders.reduce((acc: any, order) => {
      const date = order.date.split('T')[0];
      acc[date] = (acc[date] || 0) + order.amount;
      return acc;
    }, {});
    const revenueTrend = Object.entries(revenueByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Category Performance
    const categoryRevenue = products.reduce((acc: any, product) => {
      acc[product.category] = (acc[product.category] || 0) + (product.salesLast30Days * product.price);
      return acc;
    }, {});
    const categoryData = Object.entries(categoryRevenue).map(([name, value]) => ({ name, value }));

    // Top Products
    const topProducts = [...products]
      .sort((a, b) => (b.salesLast30Days * b.price) - (a.salesLast30Days * a.price))
      .slice(0, 5);

    // KPI
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const avgOrderValue = totalRevenue / orders.length;

    setData({ revenueTrend, categoryData, topProducts, totalRevenue, avgOrderValue });
  }, []);

  if (!data) return null;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Revenue Intelligence</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex items-center p-6">
            <div className="p-3 bg-[#00D9FF]/10 rounded-lg mr-4">
              <DollarSign className="w-6 h-6 text-[#00D9FF]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Revenue (90d)</p>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(data.totalRevenue)}</h3>
            </div>
          </Card>
          <Card className="flex items-center p-6">
            <div className="p-3 bg-green-500/10 rounded-lg mr-4">
              <ShoppingCart className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg. Order Value</p>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(data.avgOrderValue)}</h3>
            </div>
          </Card>
          <Card className="flex items-center p-6">
            <div className="p-3 bg-purple-500/10 rounded-lg mr-4">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Growth Rate</p>
              <h3 className="text-2xl font-bold text-white">+12.5%</h3>
            </div>
          </Card>
        </div>

        <InsightPanel 
          context="Revenue Analysis: Evaluate trends, category performance, and top sellers." 
          data={data} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={data.revenueTrend} />
          <CategoryPieChart data={data.categoryData} />
        </div>

        <Card title="Top Performing Products">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#1a1f3a] text-gray-200 font-medium border-b border-[#2d3548]">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Sales (30d)</th>
                  <th className="px-6 py-4">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3548]">
                {data.topProducts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-[#2d3548]/50">
                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4">{p.category}</td>
                    <td className="px-6 py-4">{formatCurrency(p.price)}</td>
                    <td className="px-6 py-4">{p.salesLast30Days}</td>
                    <td className="px-6 py-4 text-[#00D9FF] font-medium">
                      {formatCurrency(p.salesLast30Days * p.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
