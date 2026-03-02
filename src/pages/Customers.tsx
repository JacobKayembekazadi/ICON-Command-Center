import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { InsightPanel } from '@/components/dashboard/InsightPanel';
import { storage } from '@/lib/storage';
import { Customer } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Users, UserCheck, UserX, Crown, AlertTriangle } from 'lucide-react';

export const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setCustomers(storage.getCustomers());
  }, []);

  const segments = {
    VIP: customers.filter(c => c.segment === 'VIP'),
    Active: customers.filter(c => c.segment === 'Active'),
    AtRisk: customers.filter(c => c.segment === 'At Risk'),
    Churned: customers.filter(c => c.segment === 'Churned'),
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Customer Intelligence</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-l-4 border-l-[#00D9FF]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">VIP Customers</p>
                <h3 className="text-2xl font-bold text-white mt-1">{segments.VIP.length}</h3>
              </div>
              <Crown className="w-5 h-5 text-[#00D9FF]" />
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <h3 className="text-2xl font-bold text-white mt-1">{segments.Active.length}</h3>
              </div>
              <UserCheck className="w-5 h-5 text-green-500" />
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">At Risk</p>
                <h3 className="text-2xl font-bold text-white mt-1">{segments.AtRisk.length}</h3>
              </div>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Churned</p>
                <h3 className="text-2xl font-bold text-white mt-1">{segments.Churned.length}</h3>
              </div>
              <UserX className="w-5 h-5 text-red-500" />
            </div>
          </Card>
        </div>

        <InsightPanel 
          context="Customer Segmentation: Analyze churn risk and VIP retention opportunities." 
          data={{ 
            vipCount: segments.VIP.length, 
            riskCount: segments.AtRisk.length, 
            riskCustomers: segments.AtRisk.slice(0, 5) 
          }} 
        />

        <Card title="Recent Customer Activity">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#1a1f3a] text-gray-200 font-medium border-b border-[#2d3548]">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Segment</th>
                  <th className="px-6 py-4">Total Spent</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3548]">
                {customers.slice(0, 10).map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#2d3548]/50">
                    <td className="px-6 py-4 font-medium text-white">{customer.name}</td>
                    <td className="px-6 py-4">{customer.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        customer.segment === 'VIP' ? 'success' :
                        customer.segment === 'At Risk' ? 'warning' :
                        customer.segment === 'Churned' ? 'danger' : 'neutral'
                      }>
                        {customer.segment}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">{formatCurrency(customer.totalSpent)}</td>
                    <td className="px-6 py-4">{customer.orderCount}</td>
                    <td className="px-6 py-4">{new Date(customer.lastOrderDate).toLocaleDateString()}</td>
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

