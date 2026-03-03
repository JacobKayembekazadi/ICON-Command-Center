import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ background: '#080808', color: '#AAAAAA' }}>
      <Sidebar />
      {/* Desktop: offset for sidebar. Mobile: offset for top bar + bottom nav */}
      <main className="md:pl-52 min-h-screen pt-[calc(52px+env(safe-area-inset-top))] md:pt-0 pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
