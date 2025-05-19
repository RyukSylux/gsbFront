import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CustomersTable from '../components/CustomersTable';
import UsersTable from '../components/UsersTable';
import BillModal from '../components/BillModal';
import NewBillModal from '../components/NewBillModal';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billsError, setBillsError] = useState(null);
  const [billsLoading, setBillsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

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

  // Charger les factures
  const fetchBills = async () => {
    setBillsLoading(true);
    try {
      const billsData = await authAPI.getBills(isAdmin ? null : user?.id);
      console.log('Factures reçues:', billsData);
      setCustomers(billsData);
    } catch (err) {
      console.error('Erreur lors du chargement des factures:', err);
      setBillsError('Impossible de charger les factures');
    } finally {
      setBillsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [user, isAdmin]);

  const handleUserDeleted = (deletedEmail) => {
    setUsers(prevUsers => prevUsers.filter(user => user.email !== deletedEmail));
  };

  const handleBillClick = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedBill(null);
    setIsModalOpen(false);
  };

  const handleBillSaved = () => {
    fetchBills();
    handleModalClose();
  };

  const handleNewBill = () => {
    setIsNewBillModalOpen(true);
  };

  const handleNewBillModalClose = () => {
    setIsNewBillModalOpen(false);
  };

  const handleNewBillSaved = () => {
    fetchBills();
    handleNewBillModalClose();
  };

  const handleBillsDeleted = () => {
    fetchBills();
  };

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
                    <UsersTable users={users} onUserDeleted={handleUserDeleted} />
                  )}
                </div>
                
                <div className="mb-4">
                  <h2 className="text-lg font-medium">Toutes les factures</h2>
                </div>
              </>
            )}
            
            {billsError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {billsError}
              </div>
            )}
            
            {billsLoading ? (
              <div className="text-center py-4">Chargement des factures...</div>
            ) : (
              <CustomersTable 
                customers={customers} 
                isAdmin={isAdmin} 
                onBillClick={handleBillClick}
                onNewBill={handleNewBill}
                onBillsDeleted={handleBillsDeleted}
              />
            )}
          </div>
        </div>
      </main>

      <BillModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleBillSaved}
        initialData={selectedBill}
      />

      <NewBillModal
        isOpen={isNewBillModalOpen}
        onClose={handleNewBillModalClose}
        onSave={handleNewBillSaved}
      />
    </div>
  );
};

export default Dashboard;
