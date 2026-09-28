'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  User, 
  Building2,
  TestTube,
  ClipboardList,
  Plus
} from 'lucide-react';
import { mockBiopsyApi, mockReportApi, mockPatientApi } from '@/lib/utils/mock-api';
import { Biopsy, Report, Patient } from '@/lib/types';
import { useCurrentUser } from '@/lib/store/user-store';
import { canCreateReport, canEditBiopsy } from '@/lib/utils/permissions';
import { Button } from '@/app/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '@/app/components/ui/Card';
import { StatusBadge } from '@/app/components/shared/StatusBadge';
import { Spinner } from '@/app/components/ui/Spinner';
import { Skeleton } from '@/app/components/ui/Skeleton';
import { PatientInfo } from '@/app/components/patients/PatientInfo';

export default function BiopsyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const biopsyId = params.id as string;

  const [biopsy, setBiopsy] = useState<Biopsy | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBiopsyData();
  }, [biopsyId]);

  const loadBiopsyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const biopsyData = await mockBiopsyApi.getById(biopsyId);
      
      if (!biopsyData) {
        setError('Biopsy not found');
        return;
      }

      setBiopsy(biopsyData);
      
      // Fetch patient and reports in parallel
      const [patientData, reportsData] = await Promise.all([
        mockPatientApi.getById(biopsyData.patientId),
        mockReportApi.getByBiopsyId(biopsyId)
      ]);

      setPatient(patientData);
      setReports(reportsData);
    } catch (err) {
      setError('Failed to load biopsy data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = () => {
    router.push(`/dashboard/reports/create?biopsyId=${biopsyId}`);
  };

  const handleViewReport = (reportId: string) => {
    router.push(`/dashboard/reports/${reportId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !biopsy) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-4">
          {error || 'Biopsy not found'}
        </div>
        <Button variant="secondary" onClick={() => router.push('/dashboard/biopsies')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Biopsies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/biopsies')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Biopsy {biopsy.labCode}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Received {format(new Date(biopsy.dateReceived), 'PPP')}
            </p>
          </div>
        </div>
        <StatusBadge status={biopsy.status} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Specimen Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                <TestTube className="w-5 h-5 inline mr-2" />
                Specimen Information
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-base text-gray-900 mt-1">{biopsy.specimenType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-base text-gray-900 mt-1 capitalize">
                    {biopsy.status.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date Taken</label>
                  <p className="text-base text-gray-900 mt-1">
                    {format(new Date(biopsy.dateTaken), 'PPP')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date Received</label>
                  <p className="text-base text-gray-900 mt-1">
                    {format(new Date(biopsy.dateReceived), 'PPP')}
                  </p>
                </div>
                {biopsy.notes && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-base text-gray-700 mt-1">{biopsy.notes}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Patient Information */}
          {patient ? (
            <PatientInfo patient={patient} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  <User className="w-5 h-5 inline mr-2" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-gray-500">Loading patient information...</p>
              </CardBody>
            </Card>
          )}

          {/* Associated Reports */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  <FileText className="w-5 h-5 inline mr-2" />
                  Reports ({reports.length})
                </CardTitle>
                {currentUser && canCreateReport(currentUser) && (
                  <Button
                    size="sm"
                    onClick={handleCreateReport}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create Report
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No reports available for this biopsy</p>
                  {currentUser && canCreateReport(currentUser) && (
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={handleCreateReport}
                    >
                      Create First Report
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => handleViewReport(report.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              Report v{report.currentVersion}
                            </h3>
                            <StatusBadge status={report.status} />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Created {format(new Date(report.createdAt), 'PPP')}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              Updated {format(new Date(report.updatedAt), 'PP')}
                            </span>
                            {report.status === 'approved' && report.approvalHistory && report.approvalHistory.length > 0 && (
                              <span className="text-green-600 font-medium">
                                Approved {format(new Date(report.approvalHistory[report.approvalHistory.length - 1].timestamp), 'PP')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Source Info & Actions */}
        <div className="space-y-6">
          {/* Source Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Building2 className="w-5 h-5 inline mr-2" />
                Source Information
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Source Type</label>
                  <p className="text-base text-gray-900 mt-1 capitalize">
                    {biopsy.source.type}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Source Name</label>
                  <p className="text-base text-gray-900 mt-1">{biopsy.source.name}</p>
                </div>
                {biopsy.source.location && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-base text-gray-900 mt-1">{biopsy.source.location}</p>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <label className="text-sm font-medium text-gray-500">Sender</label>
                  <p className="text-base text-gray-900 mt-1">{biopsy.sender.name}</p>
                  <p className="text-sm text-gray-600">{biopsy.sender.title}</p>
                  {biopsy.sender.contact && (
                    <p className="text-sm text-gray-600 mt-1">{biopsy.sender.contact}</p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
          {currentUser && canEditBiopsy(currentUser, biopsy) && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => router.push(`/dashboard/biopsies/${biopsyId}/edit`)}
                  >
                    Edit Biopsy
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => router.push(`/dashboard/patients/${biopsy.patientId}`)}
                  >
                    View Patient History
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Received</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(biopsy.dateReceived), 'PPp')}
                    </p>
                  </div>
                </div>
                {biopsy.status !== 'received' && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {biopsy.status.replace('-', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">Current status</p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
