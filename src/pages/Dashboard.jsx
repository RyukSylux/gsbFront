import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CustomersTable from '../components/CustomersTable';
import UsersTable from '../components/UsersTable';
import BillModal from '../components/BillModal';
import NewBillModal from '../components/NewBillModal';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billsError, setBillsError] = useState(null);
  const [billsLoading, setBillsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Charger la liste des utilisateurs si admin
  useEffect(() => {
    const fetchUsers = async () => {      if (isAdmin) {
        setLoading(true);
        try {
          const usersData = await authAPI.getAllUsers();
          setUsers(usersData);
        } catch (err) {
          setError('Impossible de charger la liste des utilisateurs');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [isAdmin]);

  // Optimiser fetchBills avec useCallback pour éviter les re-rendus inutiles
  const fetchBills = useCallback(async () => {
    try {      setLoading(true);
      setError(null);
      const bills = await authAPI.getBills();
      setCustomers(bills);
    } catch (err) {
      setError('Erreur lors du chargement des factures');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const handleUsersListChanged = (change) => {
    if (change.type === 'delete') {
      setUsers(prevUsers => prevUsers.filter(user => user.email !== change.user.email));
    } else if (change.type === 'update') {
      setUsers(prevUsers => prevUsers.map(user => 
        // Si l'email correspond à l'ancien email de l'utilisateur
        user.email === change.oldEmail ? change.user : user
      ));
    }
  };

  const handleBillClick = (bill) => {
    console.log('Ouverture de la facture:', bill);
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedBill(null);
    setIsModalOpen(false);
  };
  const handleNewBill = () => {
    setIsNewBillModalOpen(true);
  };

  const handleBillSaved = () => {
    fetchBills();
    handleModalClose();
  };

  const handleNewBillModalClose = () => {
    setIsNewBillModalOpen(false);
  };

  const handleNewBillSaved = () => {
    fetchBills();
    handleNewBillModalClose();
  };
  const handleBillsDeleted = useCallback(async () => {
    await fetchBills();
  }, [fetchBills]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex overflow-hidden pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 overflow-x-auto">
          <main className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Section Gestion des Utilisateurs pour Admin */}
              {isAdmin && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h2>
                  </div>
                  <UsersTable 
                    users={users}
                    loading={loading}
                    error={error}
                    onUsersListChanged={handleUsersListChanged}
                  />
                </div>
              )}

              {/* Section Gestion des Factures */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Gestion des Factures</h2>
                </div>
                <div className="p-4">
                  <CustomersTable 
                    customers={customers}
                    isAdmin={isAdmin}
                    onBillClick={handleBillClick}
                    onNewBill={handleNewBill}
                    onBillsDeleted={handleBillsDeleted}
                    loading={billsLoading}
                    error={billsError}
                  />
                </div>
              </div>              {/* Modales */}
              {isModalOpen && selectedBill && (
                <BillModal
                  isOpen={isModalOpen}
                  initialData={selectedBill}
                  onClose={handleModalClose}
                  onSave={handleBillSaved}
                />
              )}

              {isNewBillModalOpen && (
                <NewBillModal
                  isOpen={isNewBillModalOpen}
                  onClose={() => setIsNewBillModalOpen(false)}
                  onSave={() => {
                    fetchBills();
                    setIsNewBillModalOpen(false);
                  }}
                />
              )}
            </div>
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
