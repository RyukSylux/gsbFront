import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableControls from './TableControls';
import Pagination from './Pagination';

const CustomersTable = ({ customers }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <TableControls />
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <TableHeader />
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <TableRow key={customer.id} customer={customer} />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination />
      </div>
    </div>
  );
};

export default CustomersTable;
