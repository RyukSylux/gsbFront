import React from 'react';

const Pagination = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 mt-4">
      <button className="text-sm text-gray-600 flex items-center order-2 sm:order-1">
        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Précédent
      </button>
      <div className="flex space-x-2 order-1 sm:order-2 overflow-x-auto">
        {[1, 2, 3, '...', 8, 9, 10].map((page, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded-lg text-sm ${
              page === 1 ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button className="text-sm text-gray-600 flex items-center order-3">
        Suivant
        <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
