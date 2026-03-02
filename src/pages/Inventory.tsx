import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InsightPanel } from '@/components/dashboard/InsightPanel';
import { storage } from '@/lib/storage';
import { Product } from '@/lib/types';
import { calculateDaysLeft, formatCurrency } from '@/lib/utils';
import { Download, Filter, AlertTriangle } from 'lucide-react';

export const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product | 'daysLeft'; direction: 'asc' | 'desc' }>({ key: 'stock', direction: 'asc' });

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  const handleSort = (key: keyof Product | 'daysLeft') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aValue: any = a[sortConfig.key as keyof Product];
    let bValue: any = b[sortConfig.key as keyof Product];

    if (sortConfig.key === 'daysLeft') {
      aValue = calculateDaysLeft(a.stock, a.salesLast30Days);
      bValue = calculateDaysLeft(b.stock, b.salesLast30Days);
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredProducts = filter === 'All' 
    ? sortedProducts 
    : sortedProducts.filter(p => p.category === filter);

  const getStatus = (stock: number, sales: number) => {
    const daysLeft = calculateDaysLeft(stock, sales);
    if (daysLeft < 7) return 'critical';
    if (daysLeft < 14) return 'low';
    return 'healthy';
  };

  const exportCSV = () => {
    const headers = ['Name', 'SKU', 'Stock', 'Price', 'Category', 'Sales (30d)', 'Days Left', 'Status'];
    const rows = filteredProducts.map(p => [
      p.name,
      p.sku,
      p.stock,
      p.price,
      p.category,
      p.salesLast30Days,
      calculateDaysLeft(p.stock, p.salesLast30Days),
      getStatus(p.stock, p.salesLast30Days)
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const criticalItems = products.filter(p => getStatus(p.stock, p.salesLast30Days) === 'critical');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Inventory Intelligence</h1>
          <div className="flex space-x-3">
            <select 
              className="bg-[#1a1f3a] border border-[#2d3548] text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Trousers">Trousers</option>
              <option value="Jeans">Jeans</option>
              <option value="Tops">Tops</option>
              <option value="Jackets">Jackets</option>
              <option value="Shoes">Shoes</option>
            </select>
            <Button variant="secondary" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <InsightPanel 
          context="Inventory Analysis: Identify reorder needs and slow movers." 
          data={{ criticalItems: criticalItems.map(p => ({ name: p.name, stock: p.stock, sales: p.salesLast30Days })) }} 
        />

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#1a1f3a] text-gray-200 font-medium border-b border-[#2d3548]">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>Product Name</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('sku')}>SKU</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('stock')}>Stock</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('price')}>Price</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('category')}>Category</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('daysLeft')}>Days Left</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3548]">
                {filteredProducts.map((product) => {
                  const daysLeft = calculateDaysLeft(product.stock, product.salesLast30Days);
                  const status = getStatus(product.stock, product.salesLast30Days);
                  
                  return (
                    <tr key={product.id} className="hover:bg-[#2d3548]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                      <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-[#2d3548] text-xs">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 font-mono">{daysLeft > 999 ? '>999' : daysLeft}</td>
                      <td className="px-6 py-4">
                        <Badge variant={status === 'critical' ? 'danger' : status === 'low' ? 'warning' : 'success'}>
                          {status === 'critical' ? 'Critical' : status === 'low' ? 'Low Stock' : 'Healthy'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
