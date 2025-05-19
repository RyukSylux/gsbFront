import React, { useState } from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableControls from './TableControls';
import Pagination from './Pagination';
import { usePagination } from '../hooks/usePagination';
import { authAPI } from '../services/api';

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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <div className="flex items-center space-x-4">
                <TableControls 
                  selectedCount={selectedBills.length}
                  onSelectAll={(isSelected) => handleSelectAllBills(isSelected)}
                  onDeleteSelected={handleDeleteSelected}
                  isDeleting={isDeleting}
                />
              </div>
            )}
            <div className="text-sm text-gray-500">
              Affichage de {Math.min((currentPage - 1) * 5 + 1, totalItems)} à {Math.min(currentPage * 5, totalItems)} sur {totalItems} factures
            </div>
          </div>
          <button
            onClick={onNewBill}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Nouvelle facture
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <TableHeader showUserInfo={isAdmin} />
            <tbody className="divide-y divide-gray-200">
              {currentCustomers.map((customer) => (
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

        <Pagination 
          currentPage={currentPage}
          maxPage={maxPage}
          getPageNumbers={getPageNumbers}
          onPageChange={paginate}
          onPrevPage={prevPage}
          onNextPage={nextPage}
        />
      </div>
    </div>
  );
};

export default CustomersTable;
