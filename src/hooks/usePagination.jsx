import { useState, useEffect } from 'react';

export const usePagination = (items, itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculer le nombre total de pages
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  
  // S'assurer que la page courante est valide et réinitialiser quand les données changent
  useEffect(() => {
    // Reset à la page 1 quand les données changent
    if (items.length === 0) {
      setCurrentPage(1);
    }
    // Ajuster la page courante si elle dépasse le nouveau nombre total de pages
    else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [items.length, currentPage, totalPages]);
  
  // Obtenir les éléments de la page courante
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Helper pour générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Afficher toutes les pages si leur nombre est inférieur au maximum
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour les pages avec ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const paginate = (pageNumber) => {
    if (pageNumber === '...') return;
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
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
    setCurrentPage,
    maxPage: totalPages,
    paginate,
    nextPage,
    prevPage,
    getPageNumbers,
    totalItems: items.length
  };
};
