import apiClient from '../client';

export const voteRepository = {
  requestOTP: async (email, pollId) => {
    const response = await apiClient.post('/votes/request-otp', {
      email,
      pollId,
    });
    return response.data;
  },

  castVote: async (pollId, optionId, voterEmail, otp, wantsResult, recaptchaToken) => {  // 🆕 Add recaptchaToken
    const response = await apiClient.post('/votes/cast', {
      pollId,
      optionId,
      voterEmail,
      otp,
      wantsResult,
      recaptchaToken,  // 🆕 Include token
    });
    return response.data;
  },

  getResults: async (pollId) => {
    const response = await apiClient.get(`/votes/results/${pollId}`);
    return response.data;
  },
};
