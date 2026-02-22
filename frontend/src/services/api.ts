import axios from 'axios';
import { authService } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const chatService = {
  async *streamMessage(message: string, sessionId: string = 'default-session') {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message, session_id: sessionId }),
    });

    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value);
      }
    }
  },

  async getHistory(sessionId: string) {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/chat/history/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  async getSessions() {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/chat/sessions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  async deleteHistory(sessionId: string) {
    const token = authService.getToken();
    const response = await axios.delete(`${API_URL}/chat/history/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  async uploadDocument(file: File, scope: 'global' | 'session', sessionId?: string) {
    const token = authService.getToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('scope', scope);
    if (scope === 'session' && sessionId) {
      formData.append('session_id', sessionId);
    }

    const response = await axios.post(`${API_URL}/rag/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
};
