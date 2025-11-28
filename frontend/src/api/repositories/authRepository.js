import { httpClient } from "../httpClient";

export const authRepository = {
  login: (email, password) => {
    return httpClient.post("/login", { email, password });
  },

  register: (fullName, email, password) => {
    return httpClient.post("/register", { fullName, email, password });
  }
};