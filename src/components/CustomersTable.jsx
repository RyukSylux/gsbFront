import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableControls from './TableControls';
import Pagination from './Pagination';
import { usePagination } from '../hooks/usePagination';

const CustomersTable = ({ customers, isAdmin }) => {
  const {
    currentItems: currentCustomers,
    currentPage,
    maxPage,
    paginate,
    nextPage,
    prevPage,
    getPageNumbers,
    totalItems
  } = usePagination(customers, 5); // 5 éléments par page

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          {isAdmin && <TableControls />}
          <div className="text-sm text-gray-500">
            Affichage de {Math.min((currentPage - 1) * 5 + 1, totalItems)} à {Math.min(currentPage * 5, totalItems)} sur {totalItems} factures
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <TableHeader showUserInfo={isAdmin} />
            <tbody className="divide-y divide-gray-200">
              {currentCustomers.map((customer) => (
                <TableRow 
                  key={customer.id} 
                  customer={customer} 
                  showUserInfo={isAdmin}
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
