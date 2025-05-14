import React from 'react';

const TableControls = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <div className="flex items-center space-x-2">
        <input type="checkbox" className="rounded border-gray-300 text-purple-600" />
        <span className="text-sm text-gray-600">Customer</span>
      </div>
      <div className="w-full sm:w-auto">
        <input
          type="search"
          placeholder="Search"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        />
      </div>
    </div>
  );
};

export default TableControls;
