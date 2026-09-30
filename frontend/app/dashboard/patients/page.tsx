'use client';

import React from 'react';
import { PatientList } from '@/app/components/patients/PatientList';

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="mt-2 text-sm text-gray-600">
            View all patients in the system
          </p>
        </div>
      </div>

      {/* Patient List */}
      <PatientList />
    </div>
  );
}
