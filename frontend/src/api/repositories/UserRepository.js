import api from "../httpClient";

export const userRepository = {
  async getProfile() {
    const res = await api.get("/users/profile");
    return res.data.data;
  },

  async getDashboard() {
    const res = await api.get("/users/dashboard");
    return res.data.data;
  },
};
