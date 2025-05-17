import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        // Décodage du token JWT (partie payload)
        const payload = JSON.parse(atob(response.data.token.split('.')[1]));
        console.log('Token payload:', payload);
        
        return {
          token: response.data.token,
          user: payload // Les informations utilisateur sont déjà dans le token
        };
      }
      throw new Error('Token non reçu');
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Aucun token trouvé');

    // Décodage du token JWT pour obtenir les informations utilisateur
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Current user from token:', payload);
      return payload;
    } catch (error) {
      console.error('Token decode error:', error);
      throw new Error('Token invalide');
    }
  },

  getAllUsers: async () => {
    try {
      console.log('Fetching all users...');
      const response = await api.get('/users');
      console.log('Users response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get users error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateUser: async (currentEmail, userData) => {
    try {
      // Transformer password en newPassword si présent
      const transformedData = { ...userData };
      if (transformedData.password) {
        transformedData.newPassword = transformedData.password;
        delete transformedData.password;
      }
      if (transformedData.email) {
        transformedData.newEmail = transformedData.email;
        delete transformedData.email;
      }

      const response = await api.put(`/users/${currentEmail}`, transformedData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Cette adresse email est déjà utilisée');
      } else if (error.response?.status === 404) {
        throw new Error('Utilisateur non trouvé');
      } else if (error.response?.status === 400) {
        throw new Error('Données invalides');
      } else {
        throw new Error('Une erreur est survenue lors de la mise à jour');
      }
    }
  },

  deleteUser: async (email) => {
    try {
      const response = await api.delete(`/users/${email}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error.response?.data);
      throw error;
    }
  },

  getBills: async () => {
    try {
      const response = await api.get('/bills');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;
