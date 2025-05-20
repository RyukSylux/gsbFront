import React from 'react';

const Pagination = ({ currentPage, maxPage, onPageChange, onPrevPage, onNextPage, totalItems }) => {
  const pages = Array.from({ length: maxPage }, (_, i) => i + 1);
  const itemsPerPage = 5;
  const start = ((currentPage - 1) * itemsPerPage) + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

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
    };

    const renderDots = (key) => (
      <span key={key} className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-700">
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
            onClick={() => onPageChange(page)}
            className={`relative inline-flex items-center min-w-[2rem] px-2 py-2 text-sm font-medium transition-colors
              ${currentPage === page
                ? "z-10 bg-[#2B84C3] text-white hover:bg-[#2472A8]"
                : "bg-white text-gray-700 hover:bg-gray-50"}`}
          >
            {page}
          </button>
        );
        previousPage = page;
      }
    });

    return renderedPages;
  };

  return (
    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-[#2B84C3]">{start}</span>
            {' '}-{' '}
            <span className="font-medium text-[#2B84C3]">{end}</span>
            {' '}<span className="hidden sm:inline">sur</span>{' '}
            <span className="font-medium text-[#2B84C3]">{totalItems}</span>
            {' '}facture{totalItems > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-gray-500">
            Page {currentPage} sur {maxPage}
          </p>
        </div>

        <nav className="isolate inline-flex space-x-1" aria-label="Pagination">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Précédent</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {renderPageButtons()}

          <button
            onClick={onNextPage}
            disabled={currentPage === maxPage}
            className="relative inline-flex items-center px-2 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Suivant</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
