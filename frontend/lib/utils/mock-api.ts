import { mockStorage, generateId, getCurrentTimestamp } from './mock-storage';
import { Biopsy, BiopsyStatus } from '../mock-data/biopsies';
import { Report, ReportStatus, ReportVersion } from '../mock-data/reports';
import { Patient } from '../mock-data/patients';
import { User } from '../mock-data/users';

/**
 * Simulated delay to mimic API calls
 */
const mockDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock API for biopsies
 */
export const mockBiopsyApi = {
  getAll: async (): Promise<Biopsy[]> => {
    await mockDelay();
    return mockStorage.getBiopsies();
  },
  
  getById: async (id: string): Promise<Biopsy | null> => {
    await mockDelay();
    const biopsy = mockStorage.getBiopsyById(id);
    return biopsy || null;
  },
  
  getByPatientId: async (patientId: string): Promise<Biopsy[]> => {
    await mockDelay();
    const biopsies = mockStorage.getBiopsies();
    return biopsies.filter(b => b.patientId === patientId);
  },
  
  getByStatus: async (status: BiopsyStatus): Promise<Biopsy[]> => {
    await mockDelay();
    const biopsies = mockStorage.getBiopsies();
    return biopsies.filter(b => b.status === status);
  },
  
  create: async (biopsyData: Omit<Biopsy, 'id' | 'labCode'>): Promise<Biopsy> => {
    await mockDelay();
    
    // Generate unique lab code
    const biopsies = mockStorage.getBiopsies();
    const year = new Date().getFullYear();
    const nextNumber = biopsies.filter(b => b.labCode.startsWith(`AP-${year}`)).length + 1;
    const labCode = `AP-${year}-${String(nextNumber).padStart(3, '0')}`;
    
    const newBiopsy: Biopsy = {
      ...biopsyData,
      id: generateId('b'),
      labCode,
    };
    
    mockStorage.saveBiopsy(newBiopsy);
    return newBiopsy;
  },
  
  update: async (id: string, updates: Partial<Biopsy>): Promise<Biopsy | null> => {
    await mockDelay();
    const biopsy = mockStorage.getBiopsyById(id);
    
    if (!biopsy) return null;
    
    const updatedBiopsy = { ...biopsy, ...updates };
    mockStorage.saveBiopsy(updatedBiopsy);
    return updatedBiopsy;
  },
  
  updateStatus: async (id: string, status: BiopsyStatus): Promise<Biopsy | null> => {
    return mockBiopsyApi.update(id, { status });
  },
  
  delete: async (id: string): Promise<boolean> => {
    await mockDelay();
    mockStorage.deleteBiopsy(id);
    return true;
  },
};

/**
 * Mock API for reports
 */
export const mockReportApi = {
  getAll: async (): Promise<Report[]> => {
    await mockDelay();
    return mockStorage.getReports();
  },
  
  getById: async (id: string): Promise<Report | null> => {
    await mockDelay();
    const report = mockStorage.getReportById(id);
    return report || null;
  },
  
  getByBiopsyId: async (biopsyId: string): Promise<Report[]> => {
    await mockDelay();
    return mockStorage.getReportsByBiopsyId(biopsyId);
  },
  
  getByStatus: async (status: ReportStatus): Promise<Report[]> => {
    await mockDelay();
    const reports = mockStorage.getReports();
    return reports.filter(r => r.status === status);
  },
  
  getPendingApproval: async (): Promise<Report[]> => {
    return mockReportApi.getByStatus('pending-approval');
  },
  
  create: async (reportData: {
    biopsyId: string;
    authorId: string;
    findings: string;
    diagnosis: string;
    recommendations: string;
  }): Promise<Report> => {
    await mockDelay();
    
    const now = getCurrentTimestamp();
    const newReport: Report = {
      id: generateId('r'),
      ...reportData,
      createdAt: now,
      updatedAt: now,
      status: 'draft',
      currentVersion: 1,
      versions: [
        {
          versionNumber: 1,
          content: 'Initial report created',
          modifiedBy: reportData.authorId,
          modifiedAt: now,
        },
      ],
    };
    
    mockStorage.saveReport(newReport);
    return newReport;
  },
  
  update: async (id: string, updates: Partial<Report>): Promise<Report | null> => {
    await mockDelay();
    const report = mockStorage.getReportById(id);
    
    if (!report) return null;
    
    const updatedReport = {
      ...report,
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    
    mockStorage.saveReport(updatedReport);
    return updatedReport;
  },
  
  addVersion: async (
    id: string,
    modifiedBy: string,
    changes?: string
  ): Promise<Report | null> => {
    await mockDelay();
    const report = mockStorage.getReportById(id);
    
    if (!report) return null;
    
    const newVersion: ReportVersion = {
      versionNumber: report.currentVersion + 1,
      content: `Version ${report.currentVersion + 1} changes`,
      modifiedBy,
      modifiedAt: getCurrentTimestamp(),
      changes,
    };
    
    const updatedReport = {
      ...report,
      currentVersion: newVersion.versionNumber,
      versions: [...report.versions, newVersion],
      updatedAt: getCurrentTimestamp(),
    };
    
    mockStorage.saveReport(updatedReport);
    return updatedReport;
  },
  
  submitForApproval: async (id: string): Promise<Report | null> => {
    await mockDelay();
    const report = mockStorage.getReportById(id);
    
    if (!report) return null;
    
    const updatedReport = {
      ...report,
      status: 'pending-approval' as ReportStatus,
      updatedAt: getCurrentTimestamp(),
    };
    
    mockStorage.saveReport(updatedReport);
    
    // Also update biopsy status
    await mockBiopsyApi.updateStatus(report.biopsyId, 'pending-approval');
    
    return updatedReport;
  },
  
  approve: async (id: string, reviewerId: string, comments: string): Promise<Report | null> => {
    await mockDelay();
    const report = mockStorage.getReportById(id);
    
    if (!report) return null;
    
    const approvalRecord = {
      reviewerId,
      action: 'approved' as const,
      comments,
      timestamp: getCurrentTimestamp(),
    };
    
    const updatedReport = {
      ...report,
      status: 'approved' as ReportStatus,
      approvalHistory: [...(report.approvalHistory || []), approvalRecord],
      updatedAt: getCurrentTimestamp(),
    };
    
    mockStorage.saveReport(updatedReport);
    
    // Also update biopsy status
    await mockBiopsyApi.updateStatus(report.biopsyId, 'approved');
    
    return updatedReport;
  },
  
  reject: async (id: string, reviewerId: string, comments: string): Promise<Report | null> => {
    await mockDelay();
    const report = mockStorage.getReportById(id);
    
    if (!report) return null;
    
    const rejectionRecord = {
      reviewerId,
      action: 'rejected' as const,
      comments,
      timestamp: getCurrentTimestamp(),
    };
    
    const updatedReport = {
      ...report,
      status: 'draft' as ReportStatus,
      approvalHistory: [...(report.approvalHistory || []), rejectionRecord],
      updatedAt: getCurrentTimestamp(),
    };
    
    mockStorage.saveReport(updatedReport);
    
    // Also update biopsy status back to report-drafted
    await mockBiopsyApi.updateStatus(report.biopsyId, 'report-drafted');
    
    return updatedReport;
  },
  
  delete: async (id: string): Promise<boolean> => {
    await mockDelay();
    mockStorage.deleteReport(id);
    return true;
  },
};

/**
 * Mock API for patients
 */
export const mockPatientApi = {
  getAll: async (): Promise<Patient[]> => {
    await mockDelay();
    return mockStorage.getPatients();
  },
  
  getById: async (id: string): Promise<Patient | null> => {
    await mockDelay();
    const patient = mockStorage.getPatientById(id);
    return patient || null;
  },
  
  create: async (patientData: Omit<Patient, 'id'>): Promise<Patient> => {
    await mockDelay();
    const newPatient: Patient = {
      ...patientData,
      id: generateId('p'),
    };
    
    mockStorage.savePatient(newPatient);
    return newPatient;
  },
  
  update: async (id: string, updates: Partial<Patient>): Promise<Patient | null> => {
    await mockDelay();
    const patient = mockStorage.getPatientById(id);
    
    if (!patient) return null;
    
    const updatedPatient = { ...patient, ...updates };
    mockStorage.savePatient(updatedPatient);
    return updatedPatient;
  },
};

/**
 * Mock API for users
 */
export const mockUserApi = {
  getAll: async (): Promise<User[]> => {
    await mockDelay();
    return mockStorage.getUsers();
  },
  
  getById: async (id: string): Promise<User | null> => {
    await mockDelay();
    const user = mockStorage.getUserById(id);
    return user || null;
  },
  
  getByRole: async (role: User['role']): Promise<User[]> => {
    await mockDelay();
    const users = mockStorage.getUsers();
    return users.filter(u => u.role === role);
  },
};

/**
 * Reset all data to defaults
 */
export const resetDemoData = async (): Promise<void> => {
  await mockDelay(200);
  mockStorage.resetToDefaults();
};
