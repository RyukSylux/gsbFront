import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CustomersTable from '../components/CustomersTable';
import UsersTable from '../components/UsersTable';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('Current user:', user);
  console.log('Is admin?', isAdmin);

  // Charger la liste des utilisateurs si admin
  useEffect(() => {
    const fetchUsers = async () => {
      if (isAdmin) {
        console.log('Utilisateur est admin, chargement des utilisateurs...');
        setLoading(true);
        try {
          const usersData = await authAPI.getAllUsers();
          console.log('Données utilisateurs reçues:', usersData);
          setUsers(usersData);
        } catch (err) {
          console.error('Erreur lors du chargement des utilisateurs:', err);
          setError('Impossible de charger la liste des utilisateurs');
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Utilisateur n\'est pas admin');
      }
    };

    fetchUsers();
  }, [isAdmin]);

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
              pageTitle={isAdmin ? "Tableau de bord administrateur" : "Mes factures"}
              userName={user?.name}
            />

            {isAdmin && (
              <>
                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-4">Liste des utilisateurs</h2>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}
                  {loading ? (
                    <div className="text-center py-4">Chargement des utilisateurs...</div>
                  ) : (
                    <UsersTable users={users} />
                  )}
                </div>
                
                <h2 className="text-lg font-medium mb-4">Toutes les factures</h2>
              </>
            )}
            
            <CustomersTable customers={customers} isAdmin={isAdmin} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
