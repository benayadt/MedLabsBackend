'use client';

import React, { useEffect, useState } from 'react';
import { Biopsy, BiopsyStatus } from '@/lib/mock-data/biopsies';
import { Patient } from '@/lib/mock-data/patients';
import { BiopsyCard } from './BiopsyCard';
import { BiopsyFilters } from './BiopsyFilters';
import { mockBiopsyApi } from '@/lib/utils/mock-api';
import { mockStorage } from '@/lib/utils/mock-storage';
import { LoadingOverlay } from '@/app/components/ui/Spinner';
import { SkeletonCard } from '@/app/components/ui/Skeleton';

interface BiopsyListProps {
  initialBiopsies?: Biopsy[];
}

export const BiopsyList: React.FC<BiopsyListProps> = ({ initialBiopsies }) => {
  const [biopsies, setBiopsies] = useState<Biopsy[]>(initialBiopsies || []);
  const [filteredBiopsies, setFilteredBiopsies] = useState<Biopsy[]>([]);
  const [isLoading, setIsLoading] = useState(!initialBiopsies);
  const [filters, setFilters] = useState<{ status?: BiopsyStatus; searchTerm?: string }>({});

  useEffect(() => {
    if (!initialBiopsies) {
      loadBiopsies();
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [biopsies, filters]);

  const loadBiopsies = async () => {
    try {
      setIsLoading(true);
      const data = await mockBiopsyApi.getAll();
      setBiopsies(data);
    } catch (error) {
      console.error('Error loading biopsies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...biopsies];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(b => b.status === filters.status);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(b => {
        const patient = mockStorage.getPatientById(b.patientId);
        const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
        
        return (
          b.labCode.toLowerCase().includes(searchLower) ||
          b.specimenType.toLowerCase().includes(searchLower) ||
          patientName.includes(searchLower)
        );
      });
    }

    setFilteredBiopsies(filtered);
  };

  const handleFilterChange = (newFilters: { status?: BiopsyStatus; searchTerm?: string }) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <BiopsyFilters
        onFilterChange={handleFilterChange}
        currentStatus={filters.status}
        currentSearchTerm={filters.searchTerm}
      />

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredBiopsies.length} of {biopsies.length} biopsies
      </div>

      {/* Biopsy Grid */}
      {filteredBiopsies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No biopsies found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBiopsies.map((biopsy) => {
            const patient = mockStorage.getPatientById(biopsy.patientId);
            if (!patient) return null;
            
            return (
              <BiopsyCard
                key={biopsy.id}
                biopsy={biopsy}
                patient={patient}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
