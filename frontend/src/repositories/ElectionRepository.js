const elections = [
  {
    id: 1,
    title: 'Student Council President 2024',
    description: 'Annual election for student council president position',
    status: 'Active',
    students: 41,
    startDate: '2024-01-15',
    endDate: '2024-01-23',
    hasVoted: false
  },
  {
    id: 2,
    title: 'Class Representative 2024',
    description: 'Election for class representative',
    status: 'Upcoming',
    students: 30,
    startDate: '2024-12-01',
    endDate: '2024-12-10',
    hasVoted: false
  },
  {
    id: 3,
    title: 'Sports Committee Head 2024',
    description: 'Election for head of the sports committee',
    status: 'Completed',
    students: 25,
    startDate: '2024-09-01',
    endDate: '2024-09-15',
    hasVoted: true
  },
  {
    id: 4,
    title: 'Cultural Secretary 2024',
    description: 'Election for cultural secretary position',
    status: 'Active',
    students: 50,
    startDate: '2024-11-20',
    endDate: '2024-11-30',
    hasVoted: false
  },
  {
    id: 5,
    title: 'Library Committee Member 2024',
    description: 'Election for library committee member',
    status: 'Upcoming',
    students: 20,
    startDate: '2024-12-10',
    endDate: '2024-12-20',
    hasVoted: false
  }
];

export const getElections = () => elections;
export const addElection = (election) => { elections.push(election); };
export const createElection = (election) => {
  const newId = elections.length ? Math.max(...elections.map(e => e.id)) + 1 : 1;
  elections.push({ ...election, id: newId });
};
export const getStats = () => {
  const activeElections = elections.filter(e => e.status.toLowerCase() === 'active').length;
  const upcoming = elections.filter(e => e.status.toLowerCase() === 'upcoming').length;
  const completed = elections.filter(e => e.status.toLowerCase() === 'completed').length;
  return { activeElections, upcoming, completed };
};
