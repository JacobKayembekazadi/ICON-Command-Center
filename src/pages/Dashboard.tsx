import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { InsightPanel } from '@/components/dashboard/InsightPanel';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { DataUploader } from '@/components/data/DataUploader';
import { DollarSign, ShoppingBag, Users, AlertTriangle } from 'lucide-react';
import { storage } from '@/lib/storage';
import { formatCurrency } from '@/lib/utils';

export const Dashboard = () => {
  const [data, setData] = useState<{
    revenue: number;
    orders: number;
    customers: number;
    lowStock: number;
    revenueTrend: any[];
    categoryData: any[];
  } | null>(null);

  useEffect(() => {
    const products = storage.getProducts();
    const orders = storage.getOrders();
    const customers = storage.getCustomers();

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, ord) => sum + ord.amount, 0);
    const lowStockCount = products.filter(p => p.stock < 20).length;
    
    // Prepare chart data
    const revenueByDate = orders.reduce((acc: any, order) => {
      const date = order.date.split('T')[0];
      acc[date] = (acc[date] || 0) + order.amount;
      return acc;
    }, {});

    const revenueTrend = Object.entries(revenueByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const categoryCounts = products.reduce((acc: any, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.salesLast30Days;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

    setData({
      revenue: totalRevenue,
      orders: orders.length,
      customers: customers.length,
      lowStock: lowStockCount,
      revenueTrend,
      categoryData
    });
  }, []);

  if (!data) return null;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <select className="bg-[#1a1f3a] border border-[#2d3548] text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D9FF]">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option selected>Last 90 Days</option>
          </select>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Revenue" 
            value={formatCurrency(data.revenue)} 
            change={12.5} 
            trend="up" 
            icon={DollarSign} 
          />
          <MetricCard 
            title="Total Orders" 
            value={data.orders.toString()} 
            change={8.2} 
            trend="up" 
            icon={ShoppingBag} 
          />
          <MetricCard 
            title="Active Customers" 
            value={data.customers.toString()} 
            change={-2.4} 
            trend="down" 
            icon={Users} 
          />
          <MetricCard 
            title="Low Stock Alerts" 
            value={data.lowStock.toString()} 
            icon={AlertTriangle} 
            trend="neutral"
          />
        </div>

        {/* AI Insight */}
        <InsightPanel 
          context="Dashboard Overview: Analyze revenue trends and inventory risks." 
          data={{ revenue: data.revenue, lowStock: data.lowStock, trend: data.revenueTrend.slice(-14) }} 
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={data.revenueTrend} />
          </div>
          <div>
            <CategoryPieChart data={data.categoryData} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataUploader />
          {/* Placeholder for another widget or recent activity */}
        </div>
      </div>
    </Layout>
  );
};
