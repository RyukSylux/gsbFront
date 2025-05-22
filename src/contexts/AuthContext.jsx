import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', err);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      setError(null);
      const userData = await authAPI.login(email, password, rememberMe);
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    authAPI.clearTokens(); // Utilisation de la fonction clearTokens de l'API
    setUser(null);
    setIsAdmin(false);
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteUser = async (email) => {
    try {
      await authAPI.deleteUser(email);
      setError(null);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateUser = async (email, userData) => {
    try {
      const updatedUser = await authAPI.updateUser(email, userData);
      setError(null);
      return updatedUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    error,
    register,
    deleteUser,
    updateUser,
    loading,
    login,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export default AuthContext;
