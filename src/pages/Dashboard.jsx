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
import { TableLoadingScreen, NoDataScreen } from '../components/LoadingScreen';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billsError, setBillsError] = useState(null);
  const [billsLoading, setBillsLoading] = useState(false);  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isServerAwake, setIsServerAwake] = useState(true);
  // Charger la liste des utilisateurs si admin
  useEffect(() => {
    const fetchUsers = async () => {
      if (isAdmin) {
        setLoading(true);
        try {
          const usersData = await authAPI.getAllUsers();
          setUsers(usersData);
          setError(null);
        } catch (err) {
          if (err.message?.includes('Network') || err.message?.includes('Failed to fetch')) {
            setError('Le serveur est en cours de réveil. Veuillez patienter quelques secondes...');
            setIsServerAwake(false);
          } else {
            setError('Impossible de charger la liste des utilisateurs');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [isAdmin]);
  // Optimiser fetchBills avec useCallback pour éviter les re-rendus inutiles
  const fetchBills = useCallback(async () => {
    try {
      setBillsLoading(true);
      setBillsError(null);
      const bills = await authAPI.getBills();
      setCustomers(bills);
      setIsServerAwake(true);
    } catch (err) {
      if (err.message?.includes('Network') || err.message?.includes('Failed to fetch')) {
        setBillsError('Le serveur est en cours de réveil. Veuillez patienter quelques secondes...');
        setIsServerAwake(false);
      } else {
        setBillsError('Erreur lors du chargement des factures');
      }
    } finally {
      setBillsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  // Effet pour recharger les données si le serveur était endormi
  useEffect(() => {
    if (!isServerAwake) {
      const retryTimeout = setTimeout(() => {
        fetchBills();
        if (isAdmin) {
          const fetchUsers = async () => {
            try {
              const usersData = await authAPI.getAllUsers();
              setUsers(usersData);
              setError(null);
              setIsServerAwake(true);
            } catch (err) {
              // Ne pas mettre à jour l'erreur ici pour éviter les messages en boucle
            }
          };
          fetchUsers();
        }
      }, 5000); // Réessayer après 5 secondes

      return () => clearTimeout(retryTimeout);
    }
  }, [isServerAwake, isAdmin, fetchBills]);

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
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h2>
                  </div>
                  {loading ? (
                    <div className="p-6">
                      <TableLoadingScreen />
                    </div>
                  ) : error ? (
                    <div className="p-6 text-center">
                      <div className="text-red-600 mb-4">{error}</div>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="p-6">
                      <NoDataScreen message="Aucun utilisateur trouvé" />
                    </div>
                  ) : (
                    <UsersTable 
                      users={users}
                      onUsersListChanged={handleUsersListChanged}
                    />
                  )}
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
