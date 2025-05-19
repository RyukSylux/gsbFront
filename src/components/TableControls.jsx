import React from 'react';

const TableControls = ({ selectedCount, onSelectAll, onDeleteSelected, isDeleting }) => {
  const handleSelectAllChange = (e) => {
    if (onSelectAll) {
      onSelectAll(e.target.checked);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          onChange={handleSelectAllChange}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-sm text-gray-600">Tout sélectionner</span>
      </div>

      {selectedCount > 0 && (
        <button
          onClick={onDeleteSelected}
          disabled={isDeleting}
          className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Suppression...
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer ({selectedCount})
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default TableControls;
