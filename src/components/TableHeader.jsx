import React from 'react';

const TableHeader = () => {
  return (
    <thead className="bg-gray-50">
      <tr className="text-left text-sm text-gray-500">
        <th className="py-3 px-4">Client</th>
        <th className="py-3 px-4">Email</th>
        <th className="py-3 px-4">Date</th>
        <th className="py-3 px-4">Statut</th>
        <th className="py-3 px-4">Montant</th>
        <th className="py-3 px-4"></th>
      </tr>
    </thead>
  );
};

export default TableHeader;
