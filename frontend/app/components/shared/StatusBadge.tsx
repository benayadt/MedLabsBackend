import React from 'react';
import { Badge } from '../ui/Badge';
import { BiopsyStatus } from '@/lib/mock-data/biopsies';
import { ReportStatus } from '@/lib/mock-data/reports';

interface StatusBadgeProps {
  status: BiopsyStatus | ReportStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: BiopsyStatus | ReportStatus) => {
    const configs: Record<string, { variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray', label: string }> = {
      // Biopsy statuses
      'received': { variant: 'info', label: 'Received' },
      'in-analysis': { variant: 'warning', label: 'In Analysis' },
      'report-drafted': { variant: 'purple', label: 'Report Drafted' },
      'pending-approval': { variant: 'warning', label: 'Pending Approval' },
      'approved': { variant: 'success', label: 'Approved' },
      'rejected': { variant: 'danger', label: 'Rejected' },
      'completed': { variant: 'gray', label: 'Completed' },
      // Report statuses
      'draft': { variant: 'default', label: 'Draft' },
    };

    return configs[status] || { variant: 'default', label: status };
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};
