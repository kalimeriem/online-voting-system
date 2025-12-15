import api from "../httpClient";

// Mock elections fallback (should not be used if backend API is working)
const elections = [];

export const getElections = () => elections;
export const addElection = (election) => { elections.push(election); };
export const createElection = (election, creatorEmail) => {
  const newId = elections.length ? Math.max(...elections.map(e => e.id)) + 1 : 1;
  
  const creatorUser = { email: creatorEmail, name: 'Creator' };
  const eligibleVoters = election.eligibleVoters || [];
  
  if (!eligibleVoters.some(v => v.email === creatorEmail)) {
    eligibleVoters.push(creatorUser);
  }
  
  const newElection = {
    ...election,
    id: newId,
    creator: election.creator || creatorEmail,
    eligibleVoters: eligibleVoters,
    hasVoted: false,
    voters: election.voters || 0,
  };
  elections.push(newElection);
  return newElection;
};

export const getStats = () => {
  const activeElections = elections.filter(e => e.status.toLowerCase() === 'active').length;
  const upcoming = elections.filter(e => e.status.toLowerCase() === 'upcoming').length;
  const completed = elections.filter(e => e.status.toLowerCase() === 'completed').length;
  return { activeElections, upcoming, completed };
};

export const getElectionsFromAPI = async () => {
  try {
    const res = await api.get("/elections/all");
    return res.data.data || [];
  } catch (err) {
    console.error("Failed to fetch elections from API:", err);
    return getElections();
  }
};

export const createElectionAPI = async (electionData) => {
  try {
    const res = await api.post("/elections", {
      title: electionData.title,
      description: electionData.description,
      startDate: new Date(electionData.startDate),
      endDate: new Date(electionData.endDate),
      departmentId: electionData.department ? parseInt(electionData.department) : undefined,
      candidateNames: electionData.candidates ? electionData.candidates.map(c => c.name) : [],
      voterEmails: electionData.customVoters && electionData.customVoters.length > 0 ? electionData.customVoters : []
    });
    return res.data.data;
  } catch (err) {
    console.error("Failed to create election:", err);
    throw err;
  }
};

export const castVoteAPI = async (electionId, candidateId) => {
  try {
    console.log("Casting vote with:", { electionId: parseInt(electionId), candidateId: parseInt(candidateId) });
    const res = await api.post(`/votes`, {
      electionId: parseInt(electionId),
      candidateId: parseInt(candidateId)
    });
    return res.data.data;
  } catch (err) {
    console.error("Failed to cast vote:", err);
    if (err.response?.data?.message) {
      console.error("Server error message:", err.response.data.message);
      throw new Error(err.response.data.message);
    }
    throw err;
  }
};

export const getElectionResults = async (electionId) => {
  try {
    const res = await api.get(`/votes/${electionId}/results`);
    return res.data.data || [];
  } catch (err) {
    console.error("Failed to fetch election results:", err);
    return [];
  }
};

export const getUserVote = async (electionId) => {
  try {
    const res = await api.get(`/votes/${electionId}/user-vote`);
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch user vote:", err);
    return null;
  }
};

export const addVotersToElection = async (electionId, emails) => {
  try {
    const res = await api.post(`/elections/${electionId}/add-voters`, { emails });
    return res.data.data;
  } catch (err) {
    console.error("Failed to add voters:", err);
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw err;
  }
};

export const addCandidateToElection = async (electionId, candidateData) => {
  try {
    const res = await api.post(`/elections/${electionId}/add-candidate`, candidateData);
    return res.data.data;
  } catch (err) {
    console.error("Failed to add candidate:", err);
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw err;
  }
};
