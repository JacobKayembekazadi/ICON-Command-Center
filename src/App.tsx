import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { Inventory } from '@/pages/Inventory';
import { Revenue } from '@/pages/Revenue';
import { Customers } from '@/pages/Customers';
import { Ads } from '@/pages/Ads';
import { InstallPrompt } from '@/components/InstallPrompt';

function App() {
  return (
    <Router>
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/ads" element={<Ads />} />
      </Routes>
    </Router>
  );
}

export default App;
