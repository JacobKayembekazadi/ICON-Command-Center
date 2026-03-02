import { Product, Order, Customer, AdPlatform } from './types';

// Helper to generate random date within last X days
const randomDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  return date.toISOString();
};

export const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const categories = ['Trousers', 'Jeans', 'Tops', 'Jackets', 'Shoes'] as const;

  // 1. Critical reorder needed: Stock < 10, Sales > 50
  products.push(
    { id: 'p1', name: 'Signature Cargo Pants', sku: 'TR-001', price: 89, stock: 5, category: 'Trousers', salesLast30Days: 120 },
    { id: 'p2', name: 'Essential Black Tee', sku: 'TP-001', price: 45, stock: 8, category: 'Tops', salesLast30Days: 85 },
    { id: 'p3', name: 'Slim Fit Jeans Blue', sku: 'JN-001', price: 95, stock: 2, category: 'Jeans', salesLast30Days: 60 }
  );

  // 2. Low stock warning: Stock < 20, Sales > 30
  products.push(
    { id: 'p4', name: 'Everyday Hoodie Grey', sku: 'TP-002', price: 75, stock: 15, category: 'Tops', salesLast30Days: 45 },
    { id: 'p5', name: 'Chino Pants Beige', sku: 'TR-002', price: 85, stock: 12, category: 'Trousers', salesLast30Days: 35 },
    { id: 'p6', name: 'Denim Jacket', sku: 'JK-001', price: 120, stock: 18, category: 'Jackets', salesLast30Days: 32 },
    { id: 'p7', name: 'White Sneakers', sku: 'SH-001', price: 110, stock: 14, category: 'Shoes', salesLast30Days: 40 },
    { id: 'p8', name: 'Striped Polo', sku: 'TP-003', price: 55, stock: 19, category: 'Tops', salesLast30Days: 38 }
  );

  // 3. Slow movers: Sales < 5
  products.push(
    { id: 'p9', name: 'Neon Green Socks', sku: 'AC-001', price: 15, stock: 100, category: 'Tops', salesLast30Days: 2 },
    { id: 'p10', name: 'Formal Loafers', sku: 'SH-002', price: 150, stock: 50, category: 'Shoes', salesLast30Days: 1 }
  );

  // 4. Healthy stock levels (remaining 40 products)
  for (let i = 11; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    products.push({
      id: `p${i}`,
      name: `${category} Item ${i}`,
      sku: `${category.substring(0, 2).toUpperCase()}-0${i}`,
      price: Math.floor(Math.random() * 100) + 30,
      stock: Math.floor(Math.random() * 100) + 30,
      category,
      salesLast30Days: Math.floor(Math.random() * 30) + 5,
    });
  }

  return products;
};

export const generateOrders = (): Order[] => {
  const orders: Order[] = [];
  const now = new Date();

  // Generate 100+ orders over 90 days
  // Declining trend in last 14 days
  for (let i = 0; i < 90; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Base order count per day
    let dailyOrders = Math.floor(Math.random() * 5) + 2;

    // Declining trend in last 14 days (i < 14)
    if (i < 14) {
      dailyOrders = Math.max(0, dailyOrders - 2); // Reduce orders
    }

    for (let j = 0; j < dailyOrders; j++) {
      orders.push({
        id: `ord-${i}-${j}`,
        date: date.toISOString(),
        amount: Math.floor(Math.random() * 200) + 50,
        customerId: `cust-${Math.floor(Math.random() * 50)}`,
        status: Math.random() > 0.1 ? 'completed' : 'cancelled',
      });
    }
  }
  return orders;
};

export const generateCustomers = (): Customer[] => {
  const customers: Customer[] = [];

  // 1. VIP Customers (> $1000 spent)
  for (let i = 0; i < 5; i++) {
    customers.push({
      id: `cust-vip-${i}`,
      email: `vip${i}@example.com`,
      name: `VIP User ${i}`,
      totalSpent: Math.floor(Math.random() * 2000) + 1200,
      orderCount: Math.floor(Math.random() * 20) + 10,
      lastOrderDate: randomDate(10),
      segment: 'VIP',
    });
  }

  // 2. Churn Risk (No order > 60 days, > $500 LTV)
  for (let i = 0; i < 8; i++) {
    customers.push({
      id: `cust-risk-${i}`,
      email: `risk${i}@example.com`,
      name: `Risk User ${i}`,
      totalSpent: Math.floor(Math.random() * 500) + 500,
      orderCount: Math.floor(Math.random() * 10) + 5,
      lastOrderDate: randomDate(90), // Could be 60-90 days ago
      segment: 'At Risk',
    });
  }

  // 3. New Customers (First order < 30 days)
  for (let i = 0; i < 10; i++) {
    customers.push({
      id: `cust-new-${i}`,
      email: `new${i}@example.com`,
      name: `New User ${i}`,
      totalSpent: Math.floor(Math.random() * 150) + 50,
      orderCount: 1,
      lastOrderDate: randomDate(20),
      segment: 'Active',
    });
  }

  // 4. Remaining customers
  for (let i = 0; i < 27; i++) {
    customers.push({
      id: `cust-reg-${i}`,
      email: `user${i}@example.com`,
      name: `User ${i}`,
      totalSpent: Math.floor(Math.random() * 400) + 100,
      orderCount: Math.floor(Math.random() * 5) + 2,
      lastOrderDate: randomDate(45),
      segment: 'Active',
    });
  }

  return customers;
};

export const generateAdPlatforms = (): AdPlatform[] => {
  return [
    {
      platform: 'Google',
      spend: 15000,
      revenue: 67500,
      roas: 4.5,
      impressions: 250000,
      clicks: 12500,
    },
    {
      platform: 'Meta',
      spend: 12000,
      revenue: 25200,
      roas: 2.1, // Declining
      impressions: 400000,
      clicks: 8000,
    },
    {
      platform: 'TikTok',
      spend: 3000,
      revenue: 18600,
      roas: 6.2, // Opportunity
      impressions: 150000,
      clicks: 5000,
    },
  ];
};
