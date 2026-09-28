import { User, UserRole } from '../mock-data/users';
import { Report } from '../mock-data/reports';
import { Biopsy } from '../mock-data/biopsies';

// Roles are aligned with the backend's Keycloak realm roles: ADMIN,
// PATHOLOGIST, LAB_TECHNICIAN. PATHOLOGIST merges the previous
// "reporting doctor" (author) and "approving doctor" (reviewer)
// distinction into a single role that can both author and approve
// reports, since the backend does not currently model that split.

/**
 * Check if a user can create a new report
 */
export const canCreateReport = (user: User | null): boolean => {
  if (!user) return false;
  
  // Lab technicians and pathologists can create reports
  return ['LAB_TECHNICIAN', 'PATHOLOGIST'].includes(user.role);
};

/**
 * Check if a user can edit a specific report
 */
export const canEditReport = (user: User | null, report: Report): boolean => {
  if (!user) return false;
  
  // Pathologists can edit any report during the review/approval process
  if (user.role === 'PATHOLOGIST') {
    return true;
  }
  
  // Authors can edit their own reports if not yet approved
  if (report.authorId === user.id && report.status !== 'approved') {
    return true;
  }
  
  return false;
};

/**
 * Check if a user can approve or reject reports
 */
export const canApproveReport = (user: User | null): boolean => {
  if (!user) return false;
  
  // Only pathologists can approve/reject reports
  return user.role === 'PATHOLOGIST';
};

/**
 * Check if a user can view a report (all users can view)
 */
export const canViewReport = (user: User | null, report: Report): boolean => {
  if (!user) return false;
  
  // All authenticated users can view reports
  return true;
};

/**
 * Check if a user can delete a biopsy
 */
export const canDeleteBiopsy = (user: User | null): boolean => {
  if (!user) return false;
  
  // Only administrators can delete biopsies
  return user.role === 'ADMIN';
};

/**
 * Check if a user can create a new biopsy
 */
export const canCreateBiopsy = (user: User | null): boolean => {
  if (!user) return false;
  
  // Lab technicians, pathologists, and administrators can create biopsies
  return ['LAB_TECHNICIAN', 'PATHOLOGIST', 'ADMIN'].includes(user.role);
};

/**
 * Check if a user can edit a biopsy
 */
export const canEditBiopsy = (user: User | null, biopsy: Biopsy): boolean => {
  if (!user) return false;
  
  // Administrators can edit any biopsy
  if (user.role === 'ADMIN') return true;
  
  // Lab technicians and pathologists can edit biopsies if not completed/approved
  if (['LAB_TECHNICIAN', 'PATHOLOGIST'].includes(user.role)) {
    return !['approved', 'completed'].includes(biopsy.status);
  }
  
  return false;
};

/**
 * Check if a user can view patient history
 */
export const canViewPatientHistory = (user: User | null): boolean => {
  if (!user) return false;
  
  // All authenticated users can view patient history
  return true;
};

/**
 * Check if a user can manage other users (create, edit, delete)
 */
export const canManageUsers = (user: User | null): boolean => {
  if (!user) return false;
  
  // Only administrators can manage users
  return user.role === 'ADMIN';
};

/**
 * Check if a user can configure the approving doctors group
 */
export const canConfigureApprovers = (user: User | null): boolean => {
  if (!user) return false;
  
  // Only administrators can configure approving doctors
  return user.role === 'ADMIN';
};

/**
 * Check if a user can access system settings
 */
export const canAccessSettings = (user: User | null): boolean => {
  if (!user) return false;
  
  // Only administrators can access system settings
  return user.role === 'ADMIN';
};

/**
 * Check if a user can modify a report that's pending approval
 * (Only pathologists during review)
 */
export const canModifyPendingReport = (user: User | null, report: Report): boolean => {
  if (!user || report.status !== 'pending-approval') return false;
  
  // Only pathologists can modify reports during approval
  return user.role === 'PATHOLOGIST';
};

/**
 * Check if a user is the author of a report
 */
export const isReportAuthor = (user: User | null, report: Report): boolean => {
  if (!user) return false;
  return report.authorId === user.id;
};

/**
 * Get all permissions for a user role
 */
export const getRolePermissions = (role: UserRole): string[] => {
  const permissions: Record<UserRole, string[]> = {
    'LAB_TECHNICIAN': [
      'view-biopsy',
      'create-biopsy',
      'edit-biopsy',
      'view-report',
      'create-report',
      'edit-own-report',
      'view-patient-history',
    ],
    'PATHOLOGIST': [
      'view-biopsy',
      'create-biopsy',
      'edit-biopsy',
      'view-report',
      'create-report',
      'edit-own-report',
      'edit-any-report',
      'approve-report',
      'reject-report',
      'view-patient-history',
    ],
    'ADMIN': [
      'view-biopsy',
      'create-biopsy',
      'edit-biopsy',
      'delete-biopsy',
      'view-report',
      'create-report',
      'edit-own-report',
      'view-patient-history',
      'manage-users',
      'configure-system',
    ],
  };
  
  return permissions[role] || [];
};

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  const rolePermissions = getRolePermissions(user.role);
  return rolePermissions.includes(permission);
};

/**
 * Get user-friendly role name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    'LAB_TECHNICIAN': 'Laboratory Technician',
    'PATHOLOGIST': 'Pathologist',
    'ADMIN': 'Administrator',
  };
  
  return roleNames[role] || role;
};

/**
 * Get role color for UI display
 */
export const getRoleColor = (role: UserRole): string => {
  const roleColors: Record<UserRole, string> = {
    'LAB_TECHNICIAN': 'blue',
    'PATHOLOGIST': 'purple',
    'ADMIN': 'red',
  };
  
  return roleColors[role] || 'gray';
};
