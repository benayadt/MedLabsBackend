'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar,
  FileText,
  TestTube,
  Clock,
  ExternalLink
} from 'lucide-react';
import { mockPatientApi, mockBiopsyApi, mockReportApi } from '@/lib/utils/mock-api';
import { Patient, Biopsy, Report } from '@/lib/types';
import { Button } from '@/app/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '@/app/components/ui/Card';
import { StatusBadge } from '@/app/components/shared/StatusBadge';
import { Skeleton } from '@/app/components/ui/Skeleton';
import { PatientInfo } from '@/app/components/patients/PatientInfo';

interface BiopsyWithReports {
  biopsy: Biopsy;
  reports: Report[];
}

export default function PatientHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [biopsiesWithReports, setBiopsiesWithReports] = useState<BiopsyWithReports[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatientHistory();
  }, [patientId]);

  const loadPatientHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const patientData = await mockPatientApi.getById(patientId);
      
      if (!patientData) {
        setError('Patient not found');
        return;
      }

      setPatient(patientData);

      // Get all biopsies for this patient
      const biopsies = await mockBiopsyApi.getByPatientId(patientId);
      
      // Get reports for each biopsy
      const biopsiesWithReportsData = await Promise.all(
        biopsies.map(async (biopsy) => {
          const reports = await mockReportApi.getByBiopsyId(biopsy.id);
          return { biopsy, reports };
        })
      );

      // Sort by date received (newest first)
      biopsiesWithReportsData.sort((a, b) => 
        new Date(b.biopsy.dateReceived).getTime() - new Date(a.biopsy.dateReceived).getTime()
      );

      setBiopsiesWithReports(biopsiesWithReportsData);
    } catch (err) {
      setError('Failed to load patient history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-4">
          {error || 'Patient not found'}
        </div>
        <Button variant="secondary" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const totalBiopsies = biopsiesWithReports.length;
  const totalReports = biopsiesWithReports.reduce((sum, item) => sum + item.reports.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient History</h1>
            <p className="text-sm text-gray-500 mt-1">
              Complete medical history and test results
            </p>
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <PatientInfo patient={patient} />

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TestTube className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Biopsies</p>
                <p className="text-2xl font-bold text-gray-900">{totalBiopsies}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Most Recent</p>
                <p className="text-base font-semibold text-gray-900">
                  {totalBiopsies > 0 
                    ? format(new Date(biopsiesWithReports[0].biopsy.dateReceived), 'PP')
                    : 'No records'
                  }
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Medical History Timeline
        </h2>

        {biopsiesWithReports.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No biopsy records found</p>
                <p className="text-gray-500 text-sm mt-2">
                  This patient has no biopsy history in the system
                </p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-6">
            {biopsiesWithReports.map(({ biopsy, reports }) => (
              <Card key={biopsy.id}>
                <CardBody>
                  {/* Biopsy Header */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <TestTube className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Biopsy {biopsy.labCode}
                        </h3>
                        <StatusBadge status={biopsy.status} />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500">Specimen Type</label>
                          <p className="text-sm text-gray-900 mt-1">{biopsy.specimenType}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Date Taken</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {format(new Date(biopsy.dateTaken), 'PP')}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Date Received</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {format(new Date(biopsy.dateReceived), 'PP')}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Source</label>
                          <p className="text-sm text-gray-900 mt-1 capitalize">{biopsy.source.type}</p>
                        </div>
                      </div>
                      {biopsy.notes && (
                        <div className="mt-3">
                          <label className="text-xs font-medium text-gray-500">Notes</label>
                          <p className="text-sm text-gray-700 mt-1">{biopsy.notes}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/dashboard/biopsies/${biopsy.id}`)}
                      className="ml-4"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>

                  {/* Associated Reports */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Associated Reports ({reports.length})
                    </h4>
                    
                    {reports.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">No reports available for this biopsy</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {reports.map((report) => (
                          <div
                            key={report.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium text-gray-900">
                                    Report v{report.currentVersion}
                                  </span>
                                  <StatusBadge status={report.status} />
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Created {format(new Date(report.createdAt), 'PP')}
                                  </span>
                                  {report.updatedAt !== report.createdAt && (
                                    <span>
                                      Updated {format(new Date(report.updatedAt), 'PP')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/reports/${report.id}`);
                              }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
