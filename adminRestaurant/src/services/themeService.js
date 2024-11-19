import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const themeService = {
  async saveTheme(themeData) {
    try {
      const response = await axios.post(`${API_URL}/api/theme`, themeData);
      return response.data;
    } catch (error) {
      console.error('Error saving theme:', error);
      throw error;
    }
  },

  async getTheme() {
    try {
      const response = await axios.get(`${API_URL}/api/theme`);
      return response.data;
    } catch (error) {
      console.error('Error getting theme:', error);
      throw error;
    }
  },

  async updateTheme(themeData) {
    try {
      const response = await axios.put(`${API_URL}/api/theme`, themeData);
      return response.data;
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  }
};
