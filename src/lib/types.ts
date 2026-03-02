export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: 'Trousers' | 'Jeans' | 'Tops' | 'Jackets' | 'Shoes';
  salesLast30Days: number;
}

export interface Order {
  id: string;
  date: string;
  amount: number;
  customerId: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  segment: 'VIP' | 'Active' | 'At Risk' | 'Churned';
}

export interface AdPlatform {
  platform: 'Google' | 'Meta' | 'TikTok';
  spend: number;
  revenue: number;
  roas: number;
  impressions: number;
  clicks: number;
}
