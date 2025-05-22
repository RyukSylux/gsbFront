import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const setSecureStorage = (token, expiresIn, rememberMe) => {
  // Toujours stocker le token dans sessionStorage pour la session courante
  sessionStorage.setItem('token', token);
  
  if (rememberMe) {
    localStorage.setItem('refreshToken', token);
    const expirationDate = new Date(Date.now() + expiresIn * 1000).getTime();
    const encodedExpiration = btoa(expirationDate.toString());
    localStorage.setItem('tokenExp', encodedExpiration);
    localStorage.setItem('rememberMe', 'true');
  }
};

const clearTokens = () => {
  sessionStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExp');
  localStorage.removeItem('rememberMe');
};

const getValidToken = () => {
  // D'abord essayer le token de session
  let token = sessionStorage.getItem('token');
  
  // Si pas de token de session, vérifier le refresh token
  if (!token) {
    const refreshToken = localStorage.getItem('refreshToken');
    const encodedExp = localStorage.getItem('tokenExp');
    
    if (refreshToken && encodedExp) {
      try {
        const expiration = parseInt(atob(encodedExp));
        if (Date.now() < expiration) {
          token = refreshToken;
          // Restaurer le token dans la session
          sessionStorage.setItem('token', token);
        } else {
          clearTokens(); // Nettoyer si expiré
        }
      } catch (error) {
        clearTokens(); // Nettoyer si erreur de décodage
      }
    }
  }
  
  return token;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = getValidToken();
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
      clearTokens();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

const handleApiError = (error) => {
  let errorMessage = 'Une erreur est survenue';

  // Si le token est expiré, nettoyer le stockage local
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('rememberMe');
  }

  throw new Error(errorMessage);
};

export const authAPI = {
  clearTokens,
  
  login: async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        rememberMe
      });
      
      const { token, expiresIn, user } = response.data;
      setSecureStorage(token, expiresIn, rememberMe);
      return user;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCurrentUser: async () => {
    const token = getValidToken();
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Vérifier si le payload est valide
      if (payload && payload.id) {
        return payload;
      }
      return null;
    } catch (error) {
      clearTokens();
      return null;
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
