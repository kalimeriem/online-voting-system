import apiClient from '../client';

export const authRepository = {
  register: async (email, password, name) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  verifyEmail: async (email, code) => {
    const response = await apiClient.post('/auth/verify-email', {
      email,
      code,
    });
    return response.data;
  },

  resendCode: async (email) => {
    const response = await apiClient.post('/auth/resend-code', {
      email,
    });
    return response.data;
  },
};