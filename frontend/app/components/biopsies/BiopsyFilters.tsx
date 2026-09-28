'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { BiopsyStatus } from '@/lib/mock-data/biopsies';
import { Button } from '@/app/components/ui/Button';

interface BiopsyFiltersProps {
  onFilterChange: (filters: { status?: BiopsyStatus; searchTerm?: string }) => void;
  currentStatus?: BiopsyStatus;
  currentSearchTerm?: string;
}

export const BiopsyFilters: React.FC<BiopsyFiltersProps> = ({
  onFilterChange,
  currentStatus,
  currentSearchTerm = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(currentSearchTerm);
  const [selectedStatus, setSelectedStatus] = useState<BiopsyStatus | 'all'>(currentStatus || 'all');

  const statuses: { value: BiopsyStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'received', label: 'Received' },
    { value: 'in-analysis', label: 'In Analysis' },
    { value: 'report-drafted', label: 'Report Drafted' },
    { value: 'pending-approval', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
  ];

  const handleStatusChange = (status: BiopsyStatus | 'all') => {
    setSelectedStatus(status);
    onFilterChange({
      status: status === 'all' ? undefined : status,
      searchTerm,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange({
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      searchTerm: value,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    onFilterChange({ status: undefined, searchTerm: '' });
  };

  const hasActiveFilters = selectedStatus !== 'all' || searchTerm !== '';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by lab code, patient name, or specimen type..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusChange(status.value)}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${selectedStatus === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Filters active
          </span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};
