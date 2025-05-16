import { useState } from 'react';

export const usePagination = (items, itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const maxPage = Math.ceil(items.length / itemsPerPage);
  
  // Obtenir les éléments de la page courante
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const MAX_VISIBLE_PAGES = 5;
    
    if (maxPage <= MAX_VISIBLE_PAGES) {
      // Si on a moins de pages que le maximum visible, on les affiche toutes
      for (let i = 1; i <= maxPage; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Sinon, on affiche les premières pages, ... , et les dernières pages
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(maxPage);
      } else if (currentPage >= maxPage - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = maxPage - 3; i <= maxPage; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(maxPage);
      }
    }
    
    return pageNumbers;
  };

  const paginate = (pageNumber) => {
    if (pageNumber === '...') return;
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < maxPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    currentItems,
    currentPage,
    maxPage,
    paginate,
    nextPage,
    prevPage,
    getPageNumbers,
    totalItems: items.length
  };
};
