import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/inventory', label: 'Inventory' },
    { to: '/revenue', label: 'Revenue' },
    { to: '/customers', label: 'Customers' },
    { to: '/ads', label: 'Ads' },
  ];

  return (
    <aside className="w-52 fixed inset-y-0 left-0 flex flex-col z-40" style={{ background: '#080808', borderRight: '1px solid #1A1A1A' }}>
      <div className="px-6 pt-8 pb-6" style={{ borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", color: '#C9A84C', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.05em' }}>
          ICON
        </div>
        <div style={{ color: '#444444', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '2px' }}>
          Command Center
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => cn(
              "block px-3 py-2.5 transition-all duration-150",
              isActive
                ? "border-l-2 border-[#C9A84C] text-white pl-2.5"
                : "border-l-2 border-transparent text-[#555555] hover:text-[#AAAAAA] pl-2.5"
            )}
            style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' }}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-5" style={{ borderTop: '1px solid #1A1A1A' }}>
        <div style={{ color: '#333333', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Sloe Labs
        </div>
      </div>
    </aside>
  );
};
