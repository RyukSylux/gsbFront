import React, { useState, useEffect } from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableControls from './TableControls';
import Pagination from './Pagination';
import { usePagination } from '../hooks/usePagination';
import { authAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { TableLoadingScreen } from '../components/LoadingScreen';

const CustomersTable = ({ customers = [], isAdmin, onBillClick, onNewBill, onBillsDeleted, loading, error }) => {
  const [selectedBills, setSelectedBills] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showNotification } = useNotification();

  const {
    currentItems: currentCustomers,
    currentPage,
    setCurrentPage,
    maxPage,
    paginate,
    nextPage,
    prevPage,
  } = usePagination(customers, 5);

  // Réinitialiser la sélection quand les factures changent
  useEffect(() => {
    setSelectedBills([]);
  }, [customers]);

  const handleBillDeleted = () => {
    // Si c'est la dernière facture de la page et qu'on n'est pas sur la première page
    if (currentCustomers.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
    
    // Désélectionner toutes les factures
    setSelectedBills([]);
    
    // Notifier le parent pour recharger les données
    if (onBillsDeleted) {
      onBillsDeleted();
    }
  };

  const handleSelectBill = (billId, isSelected) => {
    setSelectedBills(prev => 
      isSelected 
        ? [...prev, billId]
        : prev.filter(id => id !== billId)
    );
  };

  const handleSelectAllBills = (isSelected) => {
    setSelectedBills(isSelected ? currentCustomers.map(bill => bill._id) : []);
  };

  const handleDeleteSelected = async () => {
    if (!selectedBills.length) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedBills.length} facture(s) ?`)) {
      try {
        setIsDeleting(true);
        const result = await authAPI.deleteManyBills(selectedBills);
        
        // Vérifier le résultat de la suppression multiple
        if (!result || !result.success) {
          throw new Error('La suppression multiple a échoué');
        }
        
        showNotification(`${selectedBills.length} facture(s) supprimée(s) avec succès`, 'success');
        setSelectedBills([]);
        if (onBillsDeleted) {
          // Forcer un petit délai pour s'assurer que le backend a bien fini le traitement
          setTimeout(() => {
            onBillsDeleted();
          }, 100);
        }
      } catch (error) {
        showNotification(error.message || 'Une erreur est survenue lors de la suppression des factures', 'error');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  const handleRowClick = (bill) => {
    if (onBillClick) {
      onBillClick(bill);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <TableLoadingScreen message="Chargement des factures..."/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={onNewBill}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B84C3] hover:bg-[#2472A8]"
        >
          Nouvelle Facture
        </button>
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 text-gray-400">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune facture</h3>
        <p className="mt-1 text-sm text-gray-500">Commencez par créer une nouvelle facture.</p>
        <div className="mt-6">
          <button
            onClick={onNewBill}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B84C3] hover:bg-[#2472A8]"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle Facture
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TableControls
        onNewBill={onNewBill}
        selectedCount={selectedBills.length}
        onSelectAll={handleSelectAllBills}
        onDeleteSelected={handleDeleteSelected}
        isDeleting={isDeleting}
        showActions={customers.length > 0}
      />

      <div className="relative bg-white shadow sm:rounded-lg">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <TableHeader
                  showUserInfo={isAdmin}
                  onSelectAll={handleSelectAllBills}
                  isAllSelected={selectedBills.length > 0 && selectedBills.length === currentCustomers.length}
                />
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCustomers.map((bill, index) => {
                    // Calculer l'index global de la facture
                    const globalIndex = (currentPage - 1) * 5 + index; // 5 est itemsPerPage
                    return (
                      <TableRow
                        key={bill._id}
                        customer={bill}
                        globalIndex={globalIndex}
                        showUserInfo={isAdmin}
                        onBillClick={handleRowClick}
                        isSelected={selectedBills.includes(bill._id)}
                        onSelect={(isSelected) => handleSelectBill(bill._id, isSelected)}
                        onBillDeleted={handleBillDeleted}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>        
        <Pagination
          currentPage={currentPage}
          maxPage={Math.max(1, maxPage)}
          paginate={paginate}
          nextPage={nextPage}
          prevPage={prevPage}
          totalItems={customers.length}
          itemLabel="factures"
        />
      </div>
    </div>
  );
};

export default CustomersTable;
