import { Product, Order, Customer, AdPlatform } from './types';
import { generateProducts, generateOrders, generateCustomers, generateAdPlatforms } from './demoData';

const KEYS = {
  PRODUCTS: 'icon_products',
  ORDERS: 'icon_orders',
  CUSTOMERS: 'icon_customers',
  ADS: 'icon_ads',
};

export const storage = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    if (data) return JSON.parse(data);
    const initial = generateProducts();
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(initial));
    return initial;
  },
  
  getOrders: (): Order[] => {
    const data = localStorage.getItem(KEYS.ORDERS);
    if (data) return JSON.parse(data);
    const initial = generateOrders();
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(initial));
    return initial;
  },

  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(KEYS.CUSTOMERS);
    if (data) return JSON.parse(data);
    const initial = generateCustomers();
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(initial));
    return initial;
  },

  getAds: (): AdPlatform[] => {
    const data = localStorage.getItem(KEYS.ADS);
    if (data) return JSON.parse(data);
    const initial = generateAdPlatforms();
    localStorage.setItem(KEYS.ADS, JSON.stringify(initial));
    return initial;
  },

  reset: () => {
    localStorage.removeItem(KEYS.PRODUCTS);
    localStorage.removeItem(KEYS.ORDERS);
    localStorage.removeItem(KEYS.CUSTOMERS);
    localStorage.removeItem(KEYS.ADS);
    window.location.reload();
  }
};
