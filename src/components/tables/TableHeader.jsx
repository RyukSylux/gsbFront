import React, { useState } from 'react';

const FilterDropdown = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="absolute mt-2 right-0 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-2 z-50">
        {children}
      </div>
    </>
  );
};

const TableHeader = ({ showUserInfo, onSelectAll, isAllSelected, filters, onFilterChange }) => {
  const [openFilter, setOpenFilter] = useState(null);

  const handleFilterClick = (filterName) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const handleFilterChange = (field, value) => {
    onFilterChange(field, value);
  };

  const renderFilterButton = (label, filterName) => (
    <div className="flex items-center space-x-1 relative">
      <span>{label}</span>
      <button
        onClick={() => handleFilterClick(filterName)}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>
    </div>
  );

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
            <th className="px-6 py-3 relative">
              {renderFilterButton('Nom', 'name')}
              <FilterDropdown isOpen={openFilter === 'name'} onClose={() => setOpenFilter(null)}>
                <input
                  type="text"
                  value={filters.name || ''}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  placeholder="Filtrer par nom..."
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                />
              </FilterDropdown>
            </th>
            <th className="px-6 py-3 relative">
              {renderFilterButton('Email', 'email')}
              <FilterDropdown isOpen={openFilter === 'email'} onClose={() => setOpenFilter(null)}>
                <input
                  type="text"
                  value={filters.email || ''}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  placeholder="Filtrer par email..."
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                />
              </FilterDropdown>
            </th>
          </>
        )}
        <th className="px-6 py-3 relative">Description</th>
        <th className="px-6 py-3 relative">
          {renderFilterButton('Date', 'date')}
          <FilterDropdown isOpen={openFilter === 'date'} onClose={() => setOpenFilter(null)}>
            <input
              type="date"
              value={filters.date || ''}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            />
          </FilterDropdown>
        </th>          <th className="px-6 py-3 relative whitespace-nowrap">
          {renderFilterButton('Créer le', 'createdAt')}
          <FilterDropdown isOpen={openFilter === 'createdAt'} onClose={() => setOpenFilter(null)}>
            <input
              type="date"
              value={filters.createdAt ? new Date(filters.createdAt).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                handleFilterChange('createdAt', date ? date.toISOString() : '');
              }}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            />
          </FilterDropdown>
        </th>
        <th className="px-6 py-3 relative">
          {renderFilterButton('Statut', 'status')}
          <FilterDropdown isOpen={openFilter === 'status'} onClose={() => setOpenFilter(null)}>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="paid">Payé</option>
              <option value="not paid">Non payé</option>
            </select>
          </FilterDropdown>
        </th>
        <th className="px-6 py-3 relative">
          {renderFilterButton('Montant', 'amount')}
          <FilterDropdown isOpen={openFilter === 'amount'} onClose={() => setOpenFilter(null)}>
            <div className="space-y-2">
              <input
                type="number"
                value={filters.minAmount || ''}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                placeholder="Montant minimum"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="number"
                value={filters.maxAmount || ''}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                placeholder="Montant maximum"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </FilterDropdown>
        </th>
        <th className="px-6 py-3">Actions</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
