// Mock data for patients

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  medicalRecordNumber: string;
  gender: 'M' | 'F' | 'Other';
}

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    firstName: 'James',
    lastName: 'Wilson',
    dateOfBirth: '1975-03-15',
    medicalRecordNumber: 'MRN-001234',
    gender: 'M'
  },
  {
    id: 'p2',
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: '1982-07-22',
    medicalRecordNumber: 'MRN-001235',
    gender: 'F'
  },
  {
    id: 'p3',
    firstName: 'Robert',
    lastName: 'Brown',
    dateOfBirth: '1968-11-30',
    medicalRecordNumber: 'MRN-001236',
    gender: 'M'
  },
  {
    id: 'p4',
    firstName: 'Jennifer',
    lastName: 'Taylor',
    dateOfBirth: '1990-05-08',
    medicalRecordNumber: 'MRN-001237',
    gender: 'F'
  }
];

// Helper function to get patient by id
export const getPatientById = (id: string): Patient | undefined => {
  return mockPatients.find(patient => patient.id === id);
};

// Helper function to get patient full name
export const getPatientFullName = (patient: Patient): string => {
  return `${patient.firstName} ${patient.lastName}`;
};
