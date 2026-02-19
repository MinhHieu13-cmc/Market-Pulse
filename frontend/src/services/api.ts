import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const chatService = {
  async sendMessage(message: string) {
    const response = await axios.post(`${API_URL}/chat/`, { message });
    return response.data;
  },
};
