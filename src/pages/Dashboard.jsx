import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CustomersTable from '../components/CustomersTable';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const customers = [
    { id: 1, name: 'Lily-Rose Chedjou', username: '@lilyrose', email: 'lilyrose@gmail.com', date: 'Jan 16, 2025', status: 'Paid', amount: '$100.14' },
    { id: 2, name: 'Caitlyn King', username: '@caitlynk', email: 'hi@caitlynking.com', date: 'Jan 16, 2025', status: 'Paid', amount: '$96.32' },
    { id: 3, name: 'Fleur Cook', username: '@fleur_cook', email: 'fleurcook@icloud.com', date: 'Jan 15, 2025', status: 'Paid', amount: '$104.24' },
    { id: 4, name: 'Marco Kelly', username: '@marcokelly', email: 'marco@marcokelly.co', date: 'Jan 14, 2025', status: 'Paid', amount: '$88.48' },
    { id: 5, name: 'Lulu Meyers', username: '@lulu_meyers', email: 'lulu@lulumeyers.com', date: 'Jan 14, 2025', status: 'Paid', amount: '$96.32' },
    { id: 6, name: 'Mikey Lawrence', username: '@mikeylawrence', email: 'm.lawrence@gmail.com', date: 'Jan 14, 2025', status: 'Paid', amount: '$107.10' },
    { id: 7, name: 'Freya Browning', username: '@freya_b', email: 'hey@freyabrowning.com', date: 'Jan 14, 2025', status: 'Paid', amount: '$82.04' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <CustomersTable customers={customers} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
