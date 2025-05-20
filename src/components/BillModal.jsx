import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const BillModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    status: '',
    proof: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (initialData) {
      console.log('BillModal: Données reçues:', initialData);
      setFormData({
        description: initialData.description || '',
        amount: initialData.amount || '',
        status: initialData.status || 'pending',
        proof: initialData.proof || null
      });
    }
  }, [initialData]);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'proof' && files?.length) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !isEditing) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const billData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        status: formData.status
      };

      // Ajout du justificatif uniquement s'il a été modifié
      if (formData.proof instanceof File) {
        billData.proof = formData.proof;
      }

      await authAPI.updateBill(initialData._id, billData);
      setIsEditing(false);
      setSuccess('Facture mise à jour avec succès');
      if (onSave) {
        onSave();
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la facture:', err);
      setError(err.response?.data?.message || err.message || 'Une erreur est survenue lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div 
        className="fixed inset-0 bg-black/75"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <div 
          className="bg-white rounded-lg w-full max-w-lg shadow-xl relative max-h-[95vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* En-tête fixe */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">
                Détails de la facture
              </h2>
              <div className="flex items-center space-x-2">
                {isAdmin && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Zone de défilement */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            <form id="billForm" onSubmit={handleSubmit} className="space-y-4">
              {initialData?.proof && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justificatif
                  </label>
                  <div className="relative h-32 sm:h-48 w-full overflow-hidden rounded-lg border border-gray-300">
                    {initialData.proof.endsWith('.pdf') ? (
                      <div className="flex items-center justify-center h-full bg-gray-50">
                        <a
                          href={initialData.proof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Ouvrir le PDF
                        </a>
                      </div>
                    ) : (
                      <img
                        src={initialData.proof}
                        alt="Justificatif de la facture"
                        className="h-full w-full object-contain"
                      />
                    )}
                    <a
                      href={initialData.proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 bg-white rounded-md shadow-sm px-2 py-1 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 border border-gray-300"
                    >
                      Voir en plein écran
                    </a>
                  </div>
                  {isEditing && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Changer le justificatif
                      </label>
                      <input
                        type="file"
                        name="proof"
                        onChange={handleChange}
                        className="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-1.5 file:px-3
                          file:rounded-md file:border-0
                          file:text-xs file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100"
                        accept="image/*,.pdf"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                      required
                    />
                  ) : (
                    <input
                      type="text"
                      value={initialData?.description || ''}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
                      disabled
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                      required
                      step="0.01"
                    />
                  ) : (
                    <input
                      type="text"
                      value={`${initialData?.amount || 0} €`}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
                      disabled
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formatDate(initialData?.date)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  {isEditing ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                    >
                      <option value="pending">En attente</option>
                      <option value="paid">Payé</option>
                      <option value="not paid">Non payé</option>
                    </select>
                  ) : (
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(initialData?.status)}`}>
                        {getStatusLabel(initialData?.status)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isAdmin && (
                <div className="py-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Utilisateur
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-medium">
                        {initialData?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{initialData?.name}</div>
                      <div className="text-sm text-gray-500 truncate">{initialData?.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Pied de page fixe avec les boutons */}
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
            <div className="flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    form="billForm"
                    onClick={handleSubmit}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillModal;