import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Instance Axios configurée pour la stratégie hybride (Cookies + Headers)
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token dans le header (Fallback Mac/Safari)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/signin') {
            window.location.href = '/signin';
        }
    }
    return Promise.reject(error);
  }
);

const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
  throw new Error(errorMessage);
};

export const authAPI = {
  login: async (email, password, rememberMe = false) => {
    try {
      const response = await api.post('/login', {
        email,
        password,
        rememberMe
      });
      
      // Stockage du token en fallback pour Mac/Safari
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data.user;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem('token');
      await api.post('/login/logout');
    } catch (error) {
      console.warn('Erreur lors de la déconnexion serveur:', error);
    }
  },

  getCurrentUser: async () => {
    try {
      // On tente d'abord de récupérer via le cookie (plus sûr)
      const response = await api.get('/login/me');
      return response.data;
    } catch (error) {
      // Si le cookie a échoué mais qu'on a un token local (cas Safari)
      const localToken = localStorage.getItem('token');
      if (localToken) {
        try {
          const payload = JSON.parse(atob(localToken.split('.')[1]));
          return payload;
        } catch (e) {
          localStorage.removeItem('token');
          return null;
        }
      }
      return null;
    }
  },

  getAllUsers: async () => {    
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
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
      const transformedData = {};
      if (userData.name) transformedData.name = userData.name;
      if (userData.description) transformedData.description = userData.description;
      if (userData.role) transformedData.role = userData.role;

      if (userData.email && userData.email !== currentEmail) {
        transformedData.newEmail = userData.email;
      }

      if (userData.newPassword) {
        transformedData.newPassword = userData.newPassword;
        if (userData.currentPassword) {
          transformedData.currentPassword = userData.currentPassword;
        }
      }

      const response = await api.put(`/users/${currentEmail}`, transformedData);
      return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
  },

  deleteUser: async (email) => {
      const response = await api.delete(`/users/${email}`);
      return response.data;
  },

  getBills: async () => {
    try {
      const response = await api.get('/bills');
      return response.data;
    } catch (error) {      
      throw error.response?.data || error.message;
    }
  },

  getBillProof: async (billId) => {
    try {
      const response = await api.get(`/bills/${billId}/proof`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
  },

  createBill: async (billData) => {
    try {
      const formData = new FormData();
      formData.append('metadata', JSON.stringify(billData.metadata));
      if (billData.proof) {
        formData.append('proof', billData.proof);
      }

      const response = await api.post('/bills', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
  },

  updateBill: async (billId, billData) => {
    try {
      const formData = new FormData();
      const metadata = {
        description: billData.description,
        amount: billData.amount,
        status: billData.status,
        type: billData.type,
        date: billData.date
      };
      formData.append('metadata', JSON.stringify(metadata));
      if (billData.proof instanceof File) {
        formData.append('proof', billData.proof);
      }

      const response = await api.put(`/bills/${billId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
  },

  deleteBill: async (billId) => {
    try {
      const response = await api.delete(`/bills/${billId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteManyBills: async (billIds) => {
    try {
      const response = await api.delete('/bills/many', {
        data: { ids: billIds }
      });
      return {
        ...response.data,
        success: true,
        deletedCount: billIds.length
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  analyzeReceipt: async (file) => {
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      const response = await api.post('/bills/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return {
        description: response.data.description || '',
        amount: response.data.amount || '',
      };
    } catch (error) {
      return { description: '', amount: '' };
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/bills/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;
