import React from 'react';

const TableHeader = ({ showUserInfo, onSelectAll, isAllSelected }) => {
  return (
    <thead className="bg-gray-50">
      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <th className="px-6 py-3">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="rounded border-gray-300 text-[#2B84C3] focus:ring-[#2B84C3]"
          />
        </th>
        {showUserInfo && (
          <>
            <th className="px-6 py-3">Nom</th>
            <th className="px-6 py-3">Email</th>
          </>
        )}
        <th className="px-6 py-3">Description</th>
        <th className="px-6 py-3">Date</th>
        <th className="px-6 py-3">Statut</th>
        <th className="px-6 py-3">Montant</th>
        <th className="px-6 py-3 text-right">Actions</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
