import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ background: '#080808', color: '#AAAAAA' }}>
      <Sidebar />
      <main className="pl-52 min-h-screen">
        <div className="max-w-6xl mx-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
