import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Dashboard', icon: '⬡' },
  { to: '/inventory', label: 'Inventory', icon: '◫' },
  { to: '/revenue', label: 'Revenue', icon: '◈' },
  { to: '/customers', label: 'Customers', icon: '◉' },
  { to: '/ads', label: 'Ads', icon: '◎' },
];

export const Sidebar = () => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 fixed inset-y-0 left-0 flex-col z-40" style={{ background: '#080808', borderRight: '1px solid #1A1A1A' }}>
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
          <div style={{ color: '#333333', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Powered by Sloe OS</div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
        style={{
          background: 'rgba(8,8,8,0.95)',
          borderTop: '1px solid #1A1A1A',
          backdropFilter: 'blur(12px)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          height: 'calc(56px + env(safe-area-inset-bottom))',
        }}
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-150",
              isActive ? "text-[#C9A84C]" : "text-[#444444]"
            )}
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>{link.icon}</span>
            <span style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mobile top bar */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center px-5"
        style={{
          background: 'rgba(8,8,8,0.95)',
          borderBottom: '1px solid #1A1A1A',
          backdropFilter: 'blur(12px)',
          paddingTop: 'env(safe-area-inset-top)',
          height: 'calc(52px + env(safe-area-inset-top))',
        }}
      >
        <span style={{ fontFamily: "'Playfair Display', serif", color: '#C9A84C', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.05em' }}>ICON</span>
        <span style={{ color: '#333', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', marginLeft: '8px', marginTop: '2px' }}>Command Center</span>
      </header>
    </>
  );
};
