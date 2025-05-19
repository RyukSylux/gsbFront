import React, { useState } from 'react';
import { authAPI } from '../services/api';

const getStatusColor = (status) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'not paid':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'paid':
      return 'Payé';
    case 'pending':
      return 'En attente';
    case 'not paid':
      return 'Non payé';
    default:
      return status;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  // Si la date est déjà au format DD/MM/YYYY, on la retourne telle quelle
  if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) return dateString;
  
  // Sinon on la convertit
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const TableRow = ({ customer, showUserInfo, onBillClick, isSelected, onSelect, onBillDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = () => {
    onBillClick(customer);
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(e.target.checked);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        setIsDeleting(true);
        await authAPI.deleteBill(customer._id);
        if (onBillDeleted) {
          onBillDeleted();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression de la facture');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <tr 
      className={`text-sm hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-indigo-50' : ''}`}
      onClick={handleClick}
    >
      {showUserInfo && (
        <>
          <td className="py-4 px-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={isSelected}
                onChange={handleCheckboxChange}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-medium">{customer.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <div className="font-medium">{customer.name}</div>
                </div>
              </div>
            </div>
          </td>
          <td className="py-4 px-4 text-gray-600">{customer.email}</td>
        </>
      )}
      <td className="py-4 px-4 text-gray-600">{String(customer.description).padStart(4, '0')}</td>
      <td className="py-4 px-4 text-gray-600">{formatDate(customer.date)}</td>
      <td className="py-4 px-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
          {getStatusLabel(customer.status)}
        </span>
      </td>
      <td className="py-4 px-4 text-gray-600">{customer.amount} €</td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-2">
          <button 
            className="text-gray-400 hover:text-gray-600"
            title="Voir les détails"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          {showUserInfo && (
            <button
              className="text-red-400 hover:text-red-600 disabled:opacity-50"
              title="Supprimer la facture"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
