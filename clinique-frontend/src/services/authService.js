import api from './api';

export const authService = {
  async login(email, password) {
    // CORRECTION : Supprimer le /api en double
    const response = await api.post('/auth/login', { // ← SUPPRIMER /api
      email, 
      password 
    });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData); // ← SUPPRIMER /api
    return response.data;
  },

  async verifyToken() {
    const response = await api.get('/auth/me'); // ← SUPPRIMER /api
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData); // ← SUPPRIMER /api
    return response.data;
  }
};