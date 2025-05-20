import React from 'react';

const Pagination = ({ currentPage, maxPage, onPageChange, onPrevPage, onNextPage, totalItems }) => {
  const itemsPerPage = 5;
  const start = totalItems === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  const pages = Array.from({ length: maxPage }, (_, i) => i + 1);

  const renderPageButtons = () => {
    const shouldShowPage = (page) => {
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        if (maxPage <= 3) return true;
        if (page === 1 || page === maxPage) return true;
        return page === currentPage;
      }

      if (maxPage <= 7) return true;
      if (page === 1 || page === maxPage) return true;
      
      if (currentPage <= 4) {
        return page <= 5;
      } else if (currentPage >= maxPage - 3) {
        return page >= maxPage - 4;
      } else {
        return Math.abs(currentPage - page) <= 2;
      }
    };    const renderDots = (key) => (
      <span key={key} className="relative inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-700">
        ...
      </span>
    );

    const renderedPages = [];
    let previousPage = 0;

    pages.forEach(page => {
      if (shouldShowPage(page)) {
        if (page - previousPage > 1) {
          renderedPages.push(renderDots(`dots-${page}`));
        }
        renderedPages.push(
          <button
            key={page}
            onClick={() => onPageChange(page)}            className={`relative inline-flex items-center justify-center w-8 h-8 text-sm font-medium transition-colors border-l-0 border-r-0 rounded-none
              ${currentPage === page
                ? "z-10 bg-[#2B84C3] text-white hover:bg-[#2472A8] ring-1 ring-[#2B84C3]"
                : "bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-300"}`}
          >
            {page}
          </button>
        );
        previousPage = page;
      }
    });

    return renderedPages;
  };

  return (    <div className="bg-white px-4 py-4 border-t border-gray-200 sm:px-6">      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">          <p className="text-sm text-gray-700">
            <span className="font-medium text-[#2B84C3]">{start}</span>
            {' '}-{' '}
            <span className="font-medium text-[#2B84C3]">{end}</span>
            {' '}sur{' '}
            <span className="font-medium text-[#2B84C3]">{totalItems}</span>
            {' '}facture{totalItems > 1 ? 's' : ''}
          </p>
          <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
            Page {currentPage} sur {maxPage}
          </div>
        </div>        <nav className="isolate inline-flex items-center" aria-label="Pagination">
          <button            onClick={onPrevPage}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-l border-r-0 rounded-r-none transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed ring-1 ring-gray-300'
                : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-300'
            }`}
          >
            <span className="sr-only">Précédent</span>
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {renderPageButtons()}          <button            onClick={onNextPage}
            disabled={currentPage === maxPage}
            className={`relative inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-r border-l-0 rounded-l-none transition-colors ${
              currentPage === maxPage
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed ring-1 ring-gray-300'
                : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-300'
            }`}
          >
            <span className="sr-only">Suivant</span>
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
