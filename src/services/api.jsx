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
  },  updateUser: async (currentEmail, userData) => {
    try {
      // On crée un nouvel objet avec les données transformées
      const transformedData = {};

      // Ajout des champs s'ils sont présents
      if (userData.name) transformedData.name = userData.name;
      if (userData.description) transformedData.description = userData.description;
      if (userData.role) transformedData.role = userData.role;

      // Gestion spéciale de l'email (transformation en newEmail)
      if (userData.email && userData.email !== currentEmail) {
        transformedData.newEmail = userData.email;
      }      // Gestion du mot de passe
      if (userData.newPassword) {
        transformedData.newPassword = userData.newPassword;
        // On n'ajoute le mot de passe actuel que s'il est fourni
        if (userData.currentPassword) {
          transformedData.currentPassword = userData.currentPassword;
        }
      }

      console.log('Données envoyées pour mise à jour:', transformedData);
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
      console.error('Erreur lors de la récupération des factures:', error);
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
      console.error('Erreur lors de la récupération du justificatif:', error);
      throw error.response?.data || error.message;
    }
  },

  createBill: async (billData) => {
    try {
      const formData = new FormData();
      
      // On ajoute les metadata en JSON
      formData.append('metadata', JSON.stringify(billData.metadata));

      // On ajoute le fichier proof
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
      console.error('Erreur lors de la création de la facture:', error);
      throw error.response?.data || error.message;
    }
  },

  updateBill: async (billId, billData) => {
    try {
      const formData = new FormData();
      
      // On crée l'objet metadata
      const metadata = {
        description: billData.description,
        amount: billData.amount,
        status: billData.status,
        type: billData.type,
        date: billData.date
      };

      // On ajoute les metadata en JSON
      formData.append('metadata', JSON.stringify(metadata));

      // Si on a un nouveau fichier proof
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
      console.error('Erreur lors de la mise à jour de la facture:', error);
      throw error.response?.data || error.message;
    }
  },

  deleteBill: async (billId) => {
    try {
      const response = await api.delete(`/bills/${billId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la facture:', error);
      throw error.response?.data || error.message;
    }
  },

  deleteManyBills: async (billIds) => {
    try {
      const response = await api.delete('/bills/many', {
        data: {
          ids: billIds
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression multiple des factures:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default api;
