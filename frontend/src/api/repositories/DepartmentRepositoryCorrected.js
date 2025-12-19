import api from "../httpClient";

export const departmentRepository = {
  async getDepartments() {
    const res = await api.get("/departments");
    return res.data.data;
  },

  async createDepartment(name, description) {
    const res = await api.post("/departments", { name, description });
    return res.data.data;
  },
};
