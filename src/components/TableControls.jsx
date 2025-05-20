import React from 'react';

const TableControls = ({ selectedCount, onSelectAll, onDeleteSelected, isDeleting = false, showActions = true, onNewBill }) => {
  const handleSelectAllChange = (e) => {
    if (onSelectAll) {
      onSelectAll(e.target.checked);
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-b border-gray-200">
      {/* Contrôles de sélection et suppression */}
      {showActions && (
        <div className="flex items-center gap-3 min-w-0 flex-wrap">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              onChange={handleSelectAllChange}
              className="rounded border-gray-300 text-[#2B84C3] focus:ring-[#2B84C3]"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">Tout sélectionner</span>
          </div>

          {selectedCount > 0 && (
            <button
              type="button"
              onClick={onDeleteSelected}
              disabled={isDeleting}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Suppression...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="whitespace-nowrap">
                    Supprimer ({selectedCount})
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Bouton Nouvelle Facture */}
      {onNewBill && (
        <button
          type="button"
          onClick={onNewBill}
          className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B84C3] hover:bg-[#2472A8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B84C3] whitespace-nowrap shrink-0"
        >
          <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nouvelle Facture</span>
        </button>
      )}
    </div>
  );
};

export default TableControls;
