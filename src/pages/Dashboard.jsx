import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CustomersTable from '../components/CustomersTable';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Données de test (à remplacer par des données réelles de l'API)
  const allCustomers = [
    { 
      id: 1, 
      name: 'Lily-Rose Chedjou', 
      username: '@lilyrose',
      email: 'lilyrose@gmail.com', 
      date: '15 mai 2025', 
      status: 'Payé', 
      amount: '100,14 €',
      userId: 1
    },
    { 
      id: 2, 
      name: 'Catherine Dubois', 
      username: '@catherine', 
      email: 'catherine@dubois.fr', 
      date: '15 mai 2025', 
      status: 'Payé', 
      amount: '96,32 €',
      userId: 2
    },
    { 
      id: 3, 
      name: 'Florence Martin', 
      username: '@florence', 
      email: 'florence@gmail.com', 
      date: '14 mai 2025', 
      status: 'Payé', 
      amount: '104,24 €',
      userId: 1
    },
    { 
      id: 4, 
      name: 'Marc Bernard', 
      username: '@marc', 
      email: 'marc@bernard.fr', 
      date: '14 mai 2025', 
      status: 'Payé', 
      amount: '88,48 €',
      userId: 3
    },
    { 
      id: 5, 
      name: 'Lucie Meyer', 
      username: '@lucie', 
      email: 'lucie@meyer.fr', 
      date: '14 mai 2025', 
      status: 'Payé', 
      amount: '96,32 €',
      userId: 2
    },
  ];

  // Filtrer les factures selon le rôle de l'utilisateur
  const customers = user?.role === 'admin' 
    ? allCustomers 
    : allCustomers.filter(customer => customer.userId === user?.id);

  const pageTitle = user?.role === 'admin' 
    ? "Toutes les factures" 
    : "Mes factures";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Header 
              onMenuClick={() => setSidebarOpen(true)} 
              pageTitle={pageTitle}
              userName={user?.name}
            />
            <CustomersTable customers={customers} isAdmin={user?.role === 'admin'} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
