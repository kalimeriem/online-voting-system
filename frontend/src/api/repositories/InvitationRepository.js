import api from "../httpClient";

export const invitationRepository = {
  async sendInvitation(email, departmentId) {
    const res = await api.post("/invitations", { email, departmentId });
    return res.data.data;
  },

  async listInvitations() {
    const res = await api.get("/invitations");
    return res.data.data;
  },

  async respondToInvitation(invitationId, accept) {
    const res = await api.post("/invitations/respond", {
      invitationId,
      accept,
    });
    return res.data.data;
  },
};

