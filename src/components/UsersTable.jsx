import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EditUserModal from './EditUserModal';
import ConfirmModal from './ConfirmModal';

const UsersTable = ({ users, onUsersListChanged }) => {
  const { deleteUser, updateUser } = useAuth();
  const [deletingUser, setDeletingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setDeletingUser(userToDelete.email);
      await deleteUser(userToDelete.email);
      if (onUsersListChanged) {
        onUsersListChanged({ type: 'delete', user: userToDelete });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setErrorMessage(error.message || 'Une erreur est survenue lors de la suppression');
      setShowErrorModal(true);
    } finally {
      setDeletingUser(null);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };
  const handleSave = async (updatedData) => {
    try {
      const oldEmail = editingUser.email; // Sauvegarde de l'ancien email
      const updatedUser = await updateUser(oldEmail, updatedData);
      if (onUsersListChanged) {
        onUsersListChanged({ 
          type: 'update',
          user: updatedUser,
          oldEmail: oldEmail // On passe l'ancien email pour pouvoir identifier l'utilisateur à mettre à jour
        });
      }
      setEditingUser(null); // Fermer le modal
      return updatedUser;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setErrorMessage(error.message || 'Une erreur est survenue lors de la mise à jour');
      setShowErrorModal(true);
      throw error;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-500">
                  <th className="py-3 px-4">Nom</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Rôle</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Date de création</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="text-sm hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-indigo-600 font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {user.description || 'Aucune description'}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Modifier l'utilisateur"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={deletingUser === user.email}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Supprimer l'utilisateur"
                        >
                          {deletingUser === user.email ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete?.name} ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        type="danger"
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <ConfirmModal
        isOpen={showErrorModal}
        title="Erreur"
        message={errorMessage}
        onConfirm={() => setShowErrorModal(false)}
        onCancel={() => setShowErrorModal(false)}
        type="warning"
        confirmText="OK"
      />
    </>
  );
};

export default UsersTable;
