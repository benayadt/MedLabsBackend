// Mock data for users with different roles.
//
// Roles match the Keycloak realm roles defined in MedLabsBackend's
// keycloak/realm/medlabs-realm.json: ADMIN, PATHOLOGIST, LAB_TECHNICIAN.
// PATHOLOGIST merges the previous "reporting doctor" / "approving doctor"
// distinction into a single role that can both author and approve reports.
export type UserRole = 'ADMIN' | 'PATHOLOGIST' | 'LAB_TECHNICIAN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialization?: string;
}

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medlabs.com',
    role: 'PATHOLOGIST',
    specialization: 'Anatomical Pathology'
  },
  {
    id: 'u2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@medlabs.com',
    role: 'PATHOLOGIST',
    specialization: 'Anatomical Pathology'
  },
  {
    id: 'u3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@medlabs.com',
    role: 'PATHOLOGIST',
    specialization: 'Pathology'
  },
  {
    id: 'u4',
    name: 'John Smith',
    email: 'john.smith@medlabs.com',
    role: 'LAB_TECHNICIAN'
  },
  {
    id: 'u5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@medlabs.com',
    role: 'ADMIN'
  }
];

// Helper function to get user by id
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Helper function to get users by role
export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};
