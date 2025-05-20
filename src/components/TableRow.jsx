import React, { useState } from 'react';
import { authAPI } from '../services/api';
import ConfirmModal from './ConfirmModal';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const handleClick = (e) => {
    // N'ouvrir la modale que si on ne clique pas sur un bouton ou une checkbox
    if (!e.target.closest('button') && !e.target.closest('input[type="checkbox"]')) {
      console.log('Clic sur la ligne de facture:', customer);
      if (onBillClick) {
        onBillClick(customer);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(e.target.checked);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await authAPI.deleteBill(customer._id);
      if (onBillDeleted) {
        onBillDeleted();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="w-10 px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            className="rounded border-gray-300 text-[#2B84C3] focus:ring-[#2B84C3]"
          />
        </td>
        {showUserInfo && (
          <>
            <td className="w-56 px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-medium">
                    {customer.name ? customer.name.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">{customer.name}</div>
              </div>
            </td>
            <td className="w-56 px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500 truncate">{customer.email}</div>
            </td>
          </>
        )}
        <td className="w-64 px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900 truncate max-w-xs">{customer.description}</div>
        </td>
        <td className="w-32 px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{formatDate(customer.date)}</div>
        </td>
        <td className="w-32 px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
            {getStatusLabel(customer.status)}
          </span>
        </td>
        <td className="w-24 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {customer.amount ? `${customer.amount}€` : '-'}
        </td>
        <td className="w-24 px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-3">
            <div className="relative inline-block">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Clic sur l\'icône œil de la facture:', customer);
                  onBillClick(customer);
                }}
                className="text-[#2B84C3] hover:text-[#2472A8] relative group"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-10 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 z-50">
                  Voir les détails
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              </button>
            </div>
            <div className="relative inline-block">
              <button
                type="button"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 relative group"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-10 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 z-50">
                  Supprimer
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              </button>
            </div>
          </div>
        </td>
      </tr>
      {showDeleteConfirm && (
        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Supprimer la facture"
          message="Êtes-vous sûr de vouloir supprimer cette facture ?"
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          type="danger"
        />
      )}
    </>
  );
};

export default TableRow;
