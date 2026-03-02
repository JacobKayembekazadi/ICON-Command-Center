import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateDaysLeft = (stock: number, salesLast30Days: number) => {
  if (salesLast30Days === 0) return 999;
  const dailySales = salesLast30Days / 30;
  return Math.round(stock / dailySales);
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
