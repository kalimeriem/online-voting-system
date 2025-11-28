const elections = [
  {
    id: 1,
    title: 'Student Council President 2024',
    description: 'Annual election for student council president position',
    status: 'Active',
    students: 41,
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
    students: 30,
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
    students: 25,
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
    students: 50,
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
    students: 20,
    startDate: '2024-12-10',
    endDate: '2024-12-20',
    hasVoted: false,
    creator: 'manager1@ensia.edu',
    candidates: [
      { name: 'Katie Wilson', description: 'Focus on library services', votes: 0 },
      { name: 'Leo Martinez', description: 'Improve facilities', votes: 0 }
    ]
  }
];

export const getElections = () => elections;
export const addElection = (election) => { elections.push(election); };
export const createElection = (election, creatorEmail) => {
  const newId = elections.length ? Math.max(...elections.map(e => e.id)) + 1 : 1;
  elections.push({ ...election, id: newId, creator: creatorEmail });
};
export const getStats = () => {
  const activeElections = elections.filter(e => e.status.toLowerCase() === 'active').length;
  const upcoming = elections.filter(e => e.status.toLowerCase() === 'upcoming').length;
  const completed = elections.filter(e => e.status.toLowerCase() === 'completed').length;
  return { activeElections, upcoming, completed };
};
