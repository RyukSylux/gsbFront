import React, { useState } from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableControls from './TableControls';
import Pagination from './Pagination';
import { usePagination } from '../hooks/usePagination';
import { authAPI } from '../services/api';

const EmptyState = ({ isAdmin }) => (
  <div className="text-center py-12">
    <div className="mx-auto w-24 h-24 mb-4">
      <svg className="w-full h-full text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {isAdmin ? "Aucune facture disponible" : "Vous n'avez pas encore de facture"}
    </h3>
    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
      {isAdmin 
        ? "Il n'y a actuellement aucune facture dans le système." 
        : "Vos factures apparaîtront ici une fois qu'elles seront créées."}
    </p>
  </div>
);

const CustomersTable = ({ customers, isAdmin, onBillClick, onNewBill, onBillsDeleted }) => {
  const [selectedBills, setSelectedBills] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    currentItems: currentCustomers,
    currentPage,
    maxPage,
    paginate,
    nextPage,
    prevPage,
    getPageNumbers,
    totalItems
  } = usePagination(customers, 5);

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
        await authAPI.deleteManyBills(selectedBills);
        setSelectedBills([]);
        if (onBillsDeleted) {
          onBillsDeleted();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression des factures:', error);
        alert('Une erreur est survenue lors de la suppression des factures');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <TableControls
        onNewBill={onNewBill}
        selectedCount={selectedBills.length}
        onDeleteSelected={handleDeleteSelected}
        isDeleting={isDeleting}
        showActions={customers.length > 0}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {!customers || customers.length === 0 ? (
          <EmptyState isAdmin={isAdmin} />
        ) : (
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <TableHeader
                  showUserInfo={isAdmin}
                  onSelectAll={handleSelectAllBills}
                  isAllSelected={
                    currentCustomers.length > 0 &&
                    currentCustomers.every(bill => selectedBills.includes(bill._id))
                  }
                />
                <tbody className="divide-y divide-gray-200">
                  {currentCustomers.map(customer => (
                    <TableRow
                      key={customer._id}
                      customer={customer}
                      showUserInfo={isAdmin}
                      onBillClick={onBillClick}
                      isSelected={selectedBills.includes(customer._id)}
                      onSelect={(isSelected) => handleSelectBill(customer._id, isSelected)}
                      onBillDeleted={onBillsDeleted}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            
            {maxPage > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  maxPage={maxPage}
                  onPageChange={paginate}
                  onNextPage={nextPage}
                  onPrevPage={prevPage}
                  getPageNumbers={getPageNumbers}
                  totalItems={totalItems}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersTable;
