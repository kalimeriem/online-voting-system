import api from "./api";

export function getMyDepartments() {
  return api.get("/departments");
}
