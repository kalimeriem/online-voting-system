import api from "./api";

export function getActiveElections() {
  return api.get("/elections", {
    params: { status: "ACTIVE" }
  });
}
