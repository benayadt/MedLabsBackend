import { Biopsy, mockBiopsies } from '../mock-data/biopsies';
import { Report, mockReports } from '../mock-data/reports';
import { Patient, mockPatients } from '../mock-data/patients';
import { User, mockUsers } from '../mock-data/users';

// Storage keys
const STORAGE_KEYS = {
  BIOPSIES: 'anapath-biopsies',
  REPORTS: 'anapath-reports',
  PATIENTS: 'anapath-patients',
  USERS: 'anapath-users',
} as const;

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Mock storage layer using localStorage
 */
export const mockStorage = {
  // ============= BIOPSIES =============
  
  getBiopsies: (): Biopsy[] => {
    if (!isBrowser) return mockBiopsies;
    const stored = localStorage.getItem(STORAGE_KEYS.BIOPSIES);
    return stored ? JSON.parse(stored) : mockBiopsies;
  },
  
  getBiopsyById: (id: string): Biopsy | undefined => {
    const biopsies = mockStorage.getBiopsies();
    return biopsies.find(b => b.id === id);
  },
  
  saveBiopsy: (biopsy: Biopsy): void => {
    if (!isBrowser) return;
    const biopsies = mockStorage.getBiopsies();
    const index = biopsies.findIndex(b => b.id === biopsy.id);
    
    if (index >= 0) {
      biopsies[index] = biopsy;
    } else {
      biopsies.push(biopsy);
    }
    
    localStorage.setItem(STORAGE_KEYS.BIOPSIES, JSON.stringify(biopsies));
  },
  
  deleteBiopsy: (id: string): void => {
    if (!isBrowser) return;
    const biopsies = mockStorage.getBiopsies();
    const filtered = biopsies.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BIOPSIES, JSON.stringify(filtered));
  },
  
  // ============= REPORTS =============
  
  getReports: (): Report[] => {
    if (!isBrowser) return mockReports;
    const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return stored ? JSON.parse(stored) : mockReports;
  },
  
  getReportById: (id: string): Report | undefined => {
    const reports = mockStorage.getReports();
    return reports.find(r => r.id === id);
  },
  
  getReportsByBiopsyId: (biopsyId: string): Report[] => {
    const reports = mockStorage.getReports();
    return reports.filter(r => r.biopsyId === biopsyId);
  },
  
  saveReport: (report: Report): void => {
    if (!isBrowser) return;
    const reports = mockStorage.getReports();
    const index = reports.findIndex(r => r.id === report.id);
    
    if (index >= 0) {
      reports[index] = report;
    } else {
      reports.push(report);
    }
    
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  },
  
  deleteReport: (id: string): void => {
    if (!isBrowser) return;
    const reports = mockStorage.getReports();
    const filtered = reports.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filtered));
  },
  
  // ============= PATIENTS =============
  
  getPatients: (): Patient[] => {
    if (!isBrowser) return mockPatients;
    const stored = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return stored ? JSON.parse(stored) : mockPatients;
  },
  
  getPatientById: (id: string): Patient | undefined => {
    const patients = mockStorage.getPatients();
    return patients.find(p => p.id === id);
  },
  
  savePatient: (patient: Patient): void => {
    if (!isBrowser) return;
    const patients = mockStorage.getPatients();
    const index = patients.findIndex(p => p.id === patient.id);
    
    if (index >= 0) {
      patients[index] = patient;
    } else {
      patients.push(patient);
    }
    
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  },
  
  // ============= USERS =============
  
  getUsers: (): User[] => {
    if (!isBrowser) return mockUsers;
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : mockUsers;
  },
  
  getUserById: (id: string): User | undefined => {
    const users = mockStorage.getUsers();
    return users.find(u => u.id === id);
  },
  
  // ============= UTILITY =============
  
  resetData: (): void => {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.BIOPSIES);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
  },
  
  resetToDefaults: (): void => {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.BIOPSIES, JSON.stringify(mockBiopsies));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(mockReports));
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(mockPatients));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  },
  
  clearAll: (): void => {
    if (!isBrowser) return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

/**
 * Generate a unique ID for new entities
 */
export const generateId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Get current ISO timestamp
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
