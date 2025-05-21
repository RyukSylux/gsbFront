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

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    try {      const response = await api.post('/login', { email, password });
      
      if (response.data.token) {
        // Décodage du token JWT (partie payload)
        const payload = JSON.parse(atob(response.data.token.split('.')[1]));
        
        return {
          token: response.data.token,
          user: payload // Les informations utilisateur sont déjà dans le token
        };
      }
      throw new Error('Token non reçu');
    } catch (error) {      throw error.response?.data || error;
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Aucun token trouvé');    // Décodage du token JWT pour obtenir les informations utilisateur
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      throw new Error('Token invalide');
    }
  },

  getAllUsers: async () => {    try {
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
      }      const response = await api.put(`/users/${currentEmail}`, transformedData);
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
    } catch (error) {      throw error;
    }
  },

  getBills: async () => {
    try {
      const response = await api.get('/bills');
      return response.data;
    } catch (error) {      throw error.response?.data || error.message;
    }
  },

  getBillProof: async (billId) => {
    try {
      const response = await api.get(`/bills/${billId}/proof`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {      throw error.response?.data || error.message;
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
    } catch (error) {      throw error.response?.data || error.message;
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
    } catch (error) {      throw error.response?.data || error.message;
    }
  },deleteBill: async (billId) => {
    if (!billId) {
      throw new Error('ID de facture manquant');
    }

    try {
      const response = await api.delete(`/bills/${billId}`);
      if (!response.data) {
        throw new Error('Réponse invalide du serveur');
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteManyBills: async (billIds) => {
    if (!Array.isArray(billIds) || billIds.length === 0) {
      throw new Error('La liste des IDs de factures est invalide');
    }

    // Vérifier que tous les IDs sont valides
    if (billIds.some(id => !id)) {
      throw new Error('Certains IDs de factures sont invalides');
    }

    try {
      const response = await api.delete('/bills/many', {
        data: {
          ids: billIds
        }
      });

      // Vérifier que la suppression a réussi
      if (response.status !== 200) {
        throw new Error(`La suppression multiple a échoué avec le statut ${response.status}`);
      }

      return {
        ...response.data,
        success: true,
        deletedCount: billIds.length
      };
    } catch (error) {
      console.error('Erreur lors de la suppression multiple des factures:', error);
      throw {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        billIds
      };
    }
  }
};

export default api;
