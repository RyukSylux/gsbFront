import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier le token au chargement
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Récupérer les informations utilisateur du token
        const userData = await authAPI.getCurrentUser();
        console.log('Initial user data:', userData);
        setUser(userData);
      } catch (err) {
        console.error('Auth init error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const { token, user: userData } = await authAPI.login(email, password);
      console.log('Login successful:', { token, userData });
      
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la connexion';
      console.error('Login error:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // Vérifier si l'utilisateur est admin en utilisant le rôle décodé du token
  const isAdmin = user?.role === 'admin';
  console.log('Current user role:', user?.role);
  console.log('Is admin?', isAdmin);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      loading, 
      error,
      isAdmin 
    }}>
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
