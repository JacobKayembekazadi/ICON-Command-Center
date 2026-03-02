import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, TrendingUp, Users, Megaphone, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const links = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/inventory', icon: Package, label: 'Inventory' },
    { to: '/revenue', icon: TrendingUp, label: 'Revenue' },
    { to: '/customers', icon: Users, label: 'Customers' },
    { to: '/ads', icon: Megaphone, label: 'Ads' },
  ];

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-[#0A0E27] border-r border-[#2d3548] flex flex-col z-40">
      <div className="h-16 flex items-center px-6 border-b border-[#2d3548]">
        <div className="w-8 h-8 bg-[#00D9FF] rounded-lg mr-3 flex items-center justify-center">
          <span className="font-bold text-[#0A0E27]">I</span>
        </div>
        <span className="font-bold text-xl tracking-tight">ICON<span className="text-[#00D9FF]">.CC</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-[#00D9FF]/10 text-[#00D9FF]" 
                : "text-gray-400 hover:bg-[#1a1f3a] hover:text-white"
            )}
          >
            <link.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2d3548]">
        <div className="flex items-center px-4 py-3 text-gray-400 hover:text-white cursor-pointer transition-colors">
          <Settings className="w-5 h-5 mr-3" />
          <span className="font-medium">Settings</span>
        </div>
        <div className="mt-4 px-4">
          <div className="text-xs text-gray-600">v1.0.0 • Stable</div>
        </div>
      </div>
    </aside>
  );
};
