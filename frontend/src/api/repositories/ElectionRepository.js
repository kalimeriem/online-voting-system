import api from "../httpClient";

const elections = [
  {
    id: 1,
    title: 'Student Council President 2024',
    description: 'Annual election for student council president position',
    status: 'Active',
      eligibleVoters: [
        ...require('../repositories/DepartmentRepository').getDepartmentMembers(3),
        { email: 'custom1@example.com', name: 'Custom Voter 1' },
        { email: 'custom2@example.com', name: 'Custom Voter 2' },
        { email: 'test@gmail.com', name: 'Test User' },
      ],
      voters: 41,
      department: 'Students',
    startDate: '2024-01-15',
    endDate: '2024-01-23',
    hasVoted: false,
    creator: 'john@example.com',
    candidates: [
      { name: 'Alice Johnson', description: 'Focus on student activities', votes: 25 },
      { name: 'Bob Smith', description: 'Improve facilities', votes: 20 }
    ]
  },
  {
    id: 2,
    title: 'Class Representative 2024',
    description: 'Election for class representative',
    status: 'Upcoming',
      eligibleVoters: [
        ...require('../repositories/DepartmentRepository').getDepartmentMembers(1),
        { email: 'custom3@example.com', name: 'Custom Voter 3' }
      ],
      voters: 3,
      department: 'ENSIA School',
    startDate: '2024-12-01',
    endDate: '2024-12-10',
    hasVoted: false,
    creator: 'manager1@ensia.edu',
    candidates: [
      { name: 'Eve Member', description: 'Support class events', votes: 0 },
      { name: 'Frank Student', description: 'Promote inclusivity', votes: 0 }
    ]
  },
  {
    id: 3,
    title: 'Sports Committee Head 2024',
    description: 'Election for head of the sports committee',
    status: 'Completed',
      eligibleVoters: [
        ...require('../repositories/DepartmentRepository').getDepartmentMembers(2),
        { email: 'custom4@example.com', name: 'Custom Voter 4' }
      ],
      voters: 25,
      department: 'Teachers',
    startDate: '2024-09-01',
    endDate: '2024-09-15',
    hasVoted: true,
    creator: 'manager2@teachers.edu',
    candidates: [
      { name: 'Grace Lee', description: 'Focus on sports', votes: 20 },
      { name: 'Henry Brown', description: 'Improve facilities', votes: 15 }
    ]
  },
  {
    id: 4,
    title: 'Cultural Secretary 2024',
    description: 'Election for cultural secretary position',
    status: 'Active',
      eligibleVoters: [
        ...require('../repositories/DepartmentRepository').getDepartmentMembers(3),
        { email: 'custom5@example.com', name: 'Custom Voter 5' }
      ],
      voters: 50,
      department: 'Students',
    startDate: '2024-11-20',
    endDate: '2024-11-30',
    hasVoted: false,
    creator: 'john@example.com',
    candidates: [
      { name: 'Ivy Green', description: 'Focus on cultural events', votes: 25 },
      { name: 'Jack Miller', description: 'Improve facilities', votes: 20 }
    ]
  },
  {
    id: 5,
    title: 'Library Committee Member 2024',
    description: 'Election for library committee member',
    status: 'Upcoming',
      eligibleVoters: [
        { email: 'custom6@example.com', name: 'Custom Voter 6' }
      ],
      voters: 0,
      department: 'Library',
    startDate: '2024-12-10',
    endDate: '2024-12-20',
    hasVoted: false,
    creator: 'manager1@ensia.edu',
    candidates: [
      { name: 'Katie Wilson', description: 'Focus on library services', votes: 0 },
      { name: 'Leo Martinez', description: 'Improve facilities', votes: 0 }
    ]
  },
  {
    id: 6,
    title: 'Test Election 2024',
    description: 'Test election for user functionality',
    status: 'Active',
    eligibleVoters: [
      { email: 'test@gmail.com', name: 'Test User' },
      { email: 'john@example.com', name: 'John Doe' },
      { email: 'alice@example.com', name: 'Alice Smith' }
    ],
    voters: 0,
    department: 'Engineering',
    startDate: '2024-12-01',
    endDate: '2024-12-15',
    hasVoted: false,
    creator: 'test@gmail.com',
    candidates: [
      { name: 'Alice Johnson', description: 'Innovation focus', votes: 0 },
      { name: 'Bob Wilson', description: 'Team collaboration', votes: 0 }
    ]
  },
  {
    id: 7,
    title: 'Department Head Election 2024',
    description: 'Choose the new department head for Computer Science',
    status: 'Active',
    eligibleVoters: [
      { email: 'test@gmail.com', name: 'Test User' },
      { email: 'alice@example.com', name: 'Alice Smith' },
      { email: 'bob@example.com', name: 'Bob Johnson' },
      { email: 'carol@example.com', name: 'Carol Davis' }
    ],
    voters: 0,
    department: 'Computer Science',
    startDate: '2024-12-01',
    endDate: '2024-12-20',
    hasVoted: false,
    creator: 'admin@university.edu',
    candidates: [
      { name: 'Dr. Sarah Chen', description: 'Research excellence focus', votes: 0 },
      { name: 'Dr. Michael Rodriguez', description: 'Student engagement priority', votes: 0 },
      { name: 'Dr. Emily Thompson', description: 'Industry partnerships', votes: 0 }
    ]
  }
];

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
    const res = await api.get("/elections");
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
      startDate: electionData.startDate,
      endDate: electionData.endDate,
      departmentId: electionData.department ? parseInt(electionData.department) : null,
      candidateNames: electionData.candidates ? electionData.candidates.map(c => c.name) : [],
      participantIds: electionData.customVoters ? [] : undefined
    });
    return res.data.data;
  } catch (err) {
    console.error("Failed to create election:", err);
    return null;
  }
};

export const castVoteAPI = async (electionId, candidateId) => {
  try {
    const res = await api.post(`/votes`, {
      electionId: parseInt(electionId),
      candidateId: parseInt(candidateId)
    });
    return res.data.data;
  } catch (err) {
    console.error("Failed to cast vote:", err);
    return null;
  }
};