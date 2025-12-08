// src/services/authService.js
import api from './api';

export const authService = {
  // 🔹 Connexion + stockage auto
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const user = response.data;

    // ✅ Stocker dans localStorage
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  // 🔹 Déconnexion
  logout() {
    localStorage.removeItem('user');
    // Optionnel : appeler une API de déconnexion si vous utilisez des sessions
  },

  // 🔹 Récupérer l'utilisateur connecté (sans appel API)
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 🔹 Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  // --- Autres méthodes existantes ---
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async verifyToken() {
    const response = await api.get('/auth/me');
    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user)); // Met à jour le cache
    return user;
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData);
    const updatedUser = response.data;
    localStorage.setItem('user', JSON.stringify(updatedUser)); // Met à jour
    return updatedUser;
  }
};