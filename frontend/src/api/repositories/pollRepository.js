import apiClient from '../client';

export const pollRepository = {
  createPoll: async (pollData) => {
    const response = await apiClient.post('/polls', pollData);
    return response.data;
  },

  getMyPolls: async () => {
    const response = await apiClient.get('/polls/my-polls');
    return response.data;
  },

  getPollStats: async (pollId) => {
    const response = await apiClient.get(`/polls/${pollId}/stats`);
    return response.data;
  },

  getPollByUrl: async (uniqueUrl) => {
    const response = await apiClient.get(`/polls/url/${uniqueUrl}`);
    return response.data;
  },

  deletePoll: async (pollId) => {  // NEW METHOD
    const response = await apiClient.delete(`/polls/${pollId}`);
    return response.data;
  },
  
  addVoters: async (pollId, emails) => {
    const response = await apiClient.put(`/polls/${pollId}/voters`, { emails });
    return response.data;
  },
};
