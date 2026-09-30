'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Patient } from '@/lib/mock-data/patients';
import { patientApi } from '@/lib/api/patients';
import { Card } from '@/app/components/ui/Card';
import { Spinner } from '@/app/components/ui/Spinner';

export function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await patientApi.getAllPatients();
        setPatients(data);
      } catch (err) {
        setError('Failed to load patients');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border border-red-200 p-4">
        <p className="text-red-800">{error}</p>
      </Card>
    );
  }

  if (patients.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">No patients found</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Date of Birth
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Medical Record #
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {patient.firstName} {patient.lastName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {patient.medicalRecordNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    href={`/dashboard/patients/${patient.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
