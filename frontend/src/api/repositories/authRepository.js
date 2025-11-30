import api from "../httpClient";

export const authRepository = {
  async register(name, email, password) {
    try {
      const res = await api.post("/auth/register", { name, email, password });

      return {
        user: res.data.data.user,
        token: res.data.data.token
      };

    } catch (err) {
      throw formatBackendError(err);
    }
  },

  async login(email, password) {
    try {
      const res = await api.post("/auth/login", { email, password });

      return {
        user: res.data.data.user,
        token: res.data.data.token
      };

    } catch (err) {
      throw formatBackendError(err);
    }
  },
};

function formatBackendError(err) {
  if (err.response?.status === 400 && err.response.data?.errors) {
    return {
      fieldErrors: err.response.data.errors,
    };
  }

  if (err.response?.status === 401) {
    return new Error("Invalid email or password");
  }

  return new Error("Server error, please try again later.");
}
