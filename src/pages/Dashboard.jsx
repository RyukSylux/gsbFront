import React, { useState, useEffect } from 'react';
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
    console.log('Ouverture de la modale de nouvelle facture');
    setIsNewBillModalOpen(true);
  };

  const handleBillSaved = () => {
    console.log('Facture sauvegardée, rafraîchissement des données');
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

  const handleBillsDeleted = () => {
    console.log('Factures supprimées, rafraîchissement des données');
    fetchBills();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex overflow-hidden">
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
                </div>                <div className="p-4">
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
