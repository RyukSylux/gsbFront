import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
  const { isAdmin } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation du mot de passe si changé
    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
        showNotification('Le mot de passe doit contenir au moins 8 caractères', 'error');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError('Les mots de passe ne correspondent pas');
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
      }
      // Vérifier le mot de passe actuel seulement si non admin
      if (!isAdmin && !formData.currentPassword) {
        setError('Le mot de passe actuel est requis pour changer le mot de passe');
        showNotification('Le mot de passe actuel est requis', 'error');
        return;
      }
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email !== user.email ? formData.email : undefined,
        role: formData.role
      };

      // Ajouter le nouveau mot de passe si fourni
      if (formData.newPassword) {
        updateData.newPassword = formData.newPassword;
        // Ajouter le mot de passe actuel seulement si non admin
        if (!isAdmin && formData.currentPassword) {
          updateData.currentPassword = formData.currentPassword;
        }
      }
      
      // Appeler onSave et attendre le résultat
      await onSave(updateData);
      showNotification('Utilisateur mis à jour avec succès', 'success');
      
      // Réinitialiser le formulaire et fermer le modal
      setFormData({
        name: '',
        email: '',
        role: 'user',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      onClose();
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[9999] bg-black bg-opacity-75" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Modifier l'utilisateur</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">Rôle</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                  <option value="commercial">Commercial </option>
                </select>
              </div>

              <div className="border-t border-gray-200 my-4 pt-4">
                <h3 className="font-medium text-gray-700 mb-2">Changer le mot de passe (optionnel)</h3>
                
                {!isAdmin && (
                  <div className="mb-4">
                    <label className="block font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserModal;
