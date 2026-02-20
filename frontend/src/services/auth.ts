import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const authService = {
  async signup(email, password) {
    const response = await axios.post(`${API_URL}/auth/signup`, { email, password });
    return response.data;
  },

  async login(email, password) {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  },

  getUser() {
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
