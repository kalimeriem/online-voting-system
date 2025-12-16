import api from "../httpClient";

export const departmentRepository = {
  async getDepartments() {
    const res = await api.get("/departments");
    return res.data.data;
  },
};
