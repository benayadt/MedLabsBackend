// Mock data for biopsies

export type BiopsyStatus = 
  | 'received' 
  | 'in-analysis' 
  | 'report-drafted' 
  | 'pending-approval' 
  | 'approved' 
  | 'rejected' 
  | 'completed';

export interface Biopsy {
  id: string;
  labCode: string;
  patientId: string;
  dateTaken: string;
  dateReceived: string;
  source: {
    type: 'hospital' | 'laboratory' | 'clinic' | 'other';
    name: string;
    location?: string;
  };
  sender: {
    name: string;
    title: string;
    contact?: string;
  };
  specimenType: string;
  status: BiopsyStatus;
  assignedTo?: string; // userId
  notes?: string;
}

export const mockBiopsies: Biopsy[] = [
  {
    id: 'b1',
    labCode: 'AP-2026-001',
    patientId: 'p1',
    dateTaken: '2026-01-02',
    dateReceived: '2026-01-03',
    source: {
      type: 'hospital',
      name: 'City General Hospital',
      location: 'Oncology Department'
    },
    sender: {
      name: 'Dr. Richard Stevens',
      title: 'Oncologist',
      contact: 'richard.stevens@citygeneral.com'
    },
    specimenType: 'Lung tissue',
    status: 'pending-approval',
    assignedTo: 'u3'
  },
  {
    id: 'b2',
    labCode: 'AP-2026-002',
    patientId: 'p2',
    dateTaken: '2026-01-03',
    dateReceived: '2026-01-04',
    source: {
      type: 'clinic',
      name: 'Downtown Medical Clinic'
    },
    sender: {
      name: 'Dr. Amanda Lee',
      title: 'General Practitioner'
    },
    specimenType: 'Skin lesion',
    status: 'in-analysis',
    assignedTo: 'u4'
  },
  {
    id: 'b3',
    labCode: 'AP-2026-003',
    patientId: 'p3',
    dateTaken: '2025-12-28',
    dateReceived: '2025-12-30',
    source: {
      type: 'hospital',
      name: 'Regional Medical Center',
      location: 'Surgery'
    },
    sender: {
      name: 'Dr. Thomas Wright',
      title: 'Surgeon'
    },
    specimenType: 'Colon polyp',
    status: 'approved',
    assignedTo: 'u3'
  },
  {
    id: 'b4',
    labCode: 'AP-2026-004',
    patientId: 'p4',
    dateTaken: '2026-01-04',
    dateReceived: '2026-01-05',
    source: {
      type: 'laboratory',
      name: 'EastSide Labs'
    },
    sender: {
      name: 'Dr. Patricia Moore',
      title: 'Lab Director'
    },
    specimenType: 'Breast tissue',
    status: 'received',
    assignedTo: 'u4'
  },
  {
    id: 'b5',
    labCode: 'AP-2026-005',
    patientId: 'p2',
    dateTaken: '2025-12-20',
    dateReceived: '2025-12-22',
    source: {
      type: 'hospital',
      name: 'City General Hospital',
      location: 'Dermatology'
    },
    sender: {
      name: 'Dr. Amanda Lee',
      title: 'Dermatologist'
    },
    specimenType: 'Skin biopsy',
    status: 'completed',
    assignedTo: 'u3'
  }
];

// Helper function to get biopsy by id
export const getBiopsyById = (id: string): Biopsy | undefined => {
  return mockBiopsies.find(biopsy => biopsy.id === id);
};

// Helper function to get biopsies by patient id
export const getBiopsiesByPatientId = (patientId: string): Biopsy[] => {
  return mockBiopsies.filter(biopsy => biopsy.patientId === patientId);
};

// Helper function to get biopsies by status
export const getBiopsiesByStatus = (status: BiopsyStatus): Biopsy[] => {
  return mockBiopsies.filter(biopsy => biopsy.status === status);
};

// Helper function to get biopsies assigned to a user
export const getBiopsiesByAssignee = (userId: string): Biopsy[] => {
  return mockBiopsies.filter(biopsy => biopsy.assignedTo === userId);
};
