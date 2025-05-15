import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CustomersTable from '../components/CustomersTable';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const customers = [
    { id: 1, name: 'Lily-Rose Chedjou', username: '@lilyrose', email: 'lilyrose@gmail.com', date: '15 mai 2025', status: 'Payé', amount: '100,14 €' },
    { id: 2, name: 'Catherine Dubois', username: '@catherine', email: 'catherine@dubois.fr', date: '15 mai 2025', status: 'Payé', amount: '96,32 €' },
    { id: 3, name: 'Florence Martin', username: '@florence', email: 'florence@gmail.com', date: '14 mai 2025', status: 'Payé', amount: '104,24 €' },
    { id: 4, name: 'Marc Bernard', username: '@marc', email: 'marc@bernard.fr', date: '14 mai 2025', status: 'Payé', amount: '88,48 €' },
    { id: 5, name: 'Lucie Meyer', username: '@lucie', email: 'lucie@meyer.fr', date: '14 mai 2025', status: 'Payé', amount: '96,32 €' },
    { id: 6, name: 'Michel Laurent', username: '@michel', email: 'm.laurent@gmail.com', date: '14 mai 2025', status: 'Payé', amount: '107,10 €' },
    { id: 7, name: 'François Petit', username: '@francois', email: 'francois@petit.fr', date: '14 mai 2025', status: 'Payé', amount: '82,04 €' },
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
