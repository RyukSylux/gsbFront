import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserSettingsPage = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const validatePasswordForm = () => {
    /*   if (formData.newPassword && formData.newPassword.length < 8) {
          setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
          return false;
        }*/
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    if (!formData.currentPassword) {
      setError('Veuillez entrer votre mot de passe actuel');
      return;
    }

    setLoading(true);
    try {
      await authAPI.updateUser(user.email, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess('Mot de passe mis à jour avec succès');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!formData.newEmail) {
      setError('Veuillez entrer une nouvelle adresse email');
      return;
    }

    setLoading(true);    try {
      const updatedUser = await authAPI.updateUser(user.email, {
        newEmail: formData.newEmail,
        // On conserve les autres champs de l'utilisateur
        name: user.name,
        role: user.role
      });
      setSuccess('Email mis à jour avec succès');
      await login(updatedUser.email, formData.currentPassword);
      setFormData(prev => ({
        ...prev,
        newEmail: ''
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} className="z-30" />
      
      <div className="flex-1 flex overflow-hidden pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} className="z-20" />
        
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Paramètres du compte</h2>
                
                {error && (
                  <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                    {success}
                  </div>
                )}

                <div className="space-y-6 sm:space-y-8">
                  {/* Section Email */}
                  <form onSubmit={handleUpdateEmail} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Changer l'adresse email</h3>
                    <div>
                      <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Nouvelle adresse email
                      </label>
                      <input
                        type="email"
                        name="newEmail"
                        id="newEmail"
                        value={formData.newEmail}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#2B84C3] focus:ring-[#2B84C3] sm:text-sm"
                        placeholder="exemple@email.com"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B84C3] hover:bg-[#2472A8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B84C3] disabled:opacity-50"
                    >
                      {loading ? 'Mise à jour...' : 'Mettre à jour l\'email'}
                    </button>
                  </form>

                  {/* Section Mot de passe */}
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Changer le mot de passe</h3>
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#2B84C3] focus:ring-[#2B84C3] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#2B84C3] focus:ring-[#2B84C3] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#2B84C3] focus:ring-[#2B84C3] sm:text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B84C3] hover:bg-[#2472A8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B84C3] disabled:opacity-50"
                    >
                      {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer className="z-10" />
    </div>
  );
};

export default UserSettingsPage;
