import api from "./api";

export function getDashboardStats() {
  return api.get("/users/dashboard");
}
