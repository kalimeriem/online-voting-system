const departments = [
  {
    id: 1,
    name: 'ENSIA School',
    type: 'Main school department',
    private: false,
    members: [
      { email: 'manager1@ensia.edu', username: 'manager1', name: 'Alice Manager', role: 'manager' },
      { email: 'john@example.com', username: 'john', name: 'John Doe', role: 'manager' },
      { email: 'member1@ensia.edu', username: 'member1', name: 'Bob Member', role: 'member' },
      { email: 'member2@ensia.edu', username: 'member2', name: 'Carol Member', role: 'member' }
    ]
  },
  {
    id: 2,
    name: 'Teachers',
    type: 'Teaching staff department',
    private: true,
    members: [
      { email: 'manager2@teachers.edu', username: 'manager2', name: 'David Manager', role: 'manager' },
      { email: 'member3@teachers.edu', username: 'member3', name: 'Eve Member', role: 'member' }
    ]
  },
  {
    id: 3,
    name: 'Students',
    type: 'Student body',
    private: false,
    members: [
      { email: 'student1@school.edu', username: 'student1', name: 'Frank Student', role: 'member' },
      { email: 'student2@school.edu', username: 'student2', name: 'Grace Student', role: 'member' }
    ]
  },
  {
    id: 4,
    name: 'Staff',
    type: 'Administrative staff',
    private: true,
    members: [
      { email: 'staff1@school.edu', username: 'staff1', name: 'Heidi Staff', role: 'manager' },
      { email: 'staff2@school.edu', username: 'staff2', name: 'Ivan Staff', role: 'member' }
    ]
  }
];

export const getDepartments = () => departments;
export const getDepartmentMembers = (deptId) => {
  const dept = departments.find(d => d.id === deptId);
  return dept ? dept.members : [];
};
export const addDepartmentMember = (deptId, member) => {
  const dept = departments.find(d => d.id === deptId);
  if (dept) dept.members.push(member);
};