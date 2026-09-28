// Centralized type definitions for the Anapath MVP

// Import types from mock data files
import type { User, UserRole } from '../mock-data/users';
import type { Patient } from '../mock-data/patients';
import type { Biopsy, BiopsyStatus } from '../mock-data/biopsies';
import type { Report, ReportStatus, ReportVersion } from '../mock-data/reports';

// Re-export for convenience
export type { User, UserRole } from '../mock-data/users';
export type { Patient } from '../mock-data/patients';
export type { Biopsy, BiopsyStatus } from '../mock-data/biopsies';
export type { Report, ReportStatus, ReportVersion } from '../mock-data/reports';

// Utility types
export type WithId<T> = T & { id: string };

export type Timestamp = string; // ISO 8601 format

export type WithTimestamps<T> = T & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter and sort types
export interface BiopsyFilters {
  status?: BiopsyStatus;
  patientId?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface ReportFilters {
  status?: ReportStatus;
  authorId?: string;
  biopsyId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  order: SortOrder;
}

// Permission types
export type PermissionAction = 
  | 'view-biopsy'
  | 'create-biopsy'
  | 'edit-biopsy'
  | 'delete-biopsy'
  | 'view-report'
  | 'create-report'
  | 'edit-own-report'
  | 'edit-any-report'
  | 'approve-report'
  | 'reject-report'
  | 'view-patient-history'
  | 'manage-users'
  | 'configure-system';

// Form types
export interface BiopsyFormData {
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
  assignedTo?: string;
  notes?: string;
}

export interface ReportFormData {
  biopsyId: string;
  findings: string;
  diagnosis: string;
  recommendations: string;
}

export interface ApprovalFormData {
  reportId: string;
  action: 'approved' | 'rejected';
  comments: string;
}

// Component prop types
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Timestamp;
  read: boolean;
}

// Statistics types
export interface DashboardStats {
  totalBiopsies: number;
  pendingApproval: number;
  inAnalysis: number;
  completedThisWeek: number;
  completedThisMonth: number;
  averageTurnaroundDays: number;
}

export interface UserStats {
  assignedBiopsies: number;
  pendingReports: number;
  reportsCreated: number;
  reportsApproved: number;
}
