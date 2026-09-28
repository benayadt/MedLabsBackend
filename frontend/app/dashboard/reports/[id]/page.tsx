'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  User, 
  Calendar, 
  CheckCircle,
  XCircle,
  Clock,
  History,
  TestTube,
  FileDown
} from 'lucide-react';
import { mockReportApi, mockBiopsyApi, mockPatientApi, mockUserApi } from '@/lib/utils/mock-api';
import { Report, Biopsy, Patient, User as UserType } from '@/lib/types';
import { useCurrentUser } from '@/lib/store/user-store';
import { canEditReport, canApproveReport } from '@/lib/utils/permissions';
import { Button } from '@/app/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '@/app/components/ui/Card';
import { StatusBadge } from '@/app/components/shared/StatusBadge';
import { Skeleton } from '@/app/components/ui/Skeleton';
import { PatientInfoCompact } from '@/app/components/patients/PatientInfo';
import { StructuredReportViewer } from '@/app/components/reports/StructuredReportEditor';
import { ReportApprovalCard } from '@/app/components/reports/ReportApproval';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const reportId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [biopsy, setBiopsy] = useState<Biopsy | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [author, setAuthor] = useState<UserType | null>(null);
  const [reviewers, setReviewers] = useState<Record<string, UserType>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReportData();
  }, [reportId]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const reportData = await mockReportApi.getById(reportId);
      
      if (!reportData) {
        setError('Report not found');
        return;
      }

      setReport(reportData);

      // Load related data in parallel
      const [biopsyData, authorData] = await Promise.all([
        mockBiopsyApi.getById(reportData.biopsyId),
        mockUserApi.getById(reportData.authorId)
      ]);

      setBiopsy(biopsyData);
      setAuthor(authorData);

      if (biopsyData) {
        const patientData = await mockPatientApi.getById(biopsyData.patientId);
        setPatient(patientData);
      }

      // Load reviewers and modifiers for history displays
      if (reportData.approvalHistory || reportData.versions) {
        const userIds = new Set<string>();
        
        reportData.approvalHistory?.forEach(approval => {
          userIds.add(approval.reviewerId);
        });
        
        reportData.versions.forEach(version => {
          userIds.add(version.modifiedBy);
        });

        const usersData = await Promise.all(
          Array.from(userIds).map(async id => {
            const user = await mockUserApi.getById(id);
            return { id, user };
          })
        );

        const usersMap: Record<string, UserType> = {};
        usersData.forEach(({ id, user }) => {
          if (user) usersMap[id] = user;
        });
        
        setReviewers(usersMap);
      }
    } catch (err) {
      setError('Failed to load report data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (report) {
      router.push(`/dashboard/reports/${report.id}/edit`);
    }
  };

  const handleApprove = async (comments: string) => {
    if (!currentUser || !report) return;
    
    await mockReportApi.approve(report.id, currentUser.id, comments);
    
    // Reload report data to show updated status
    await loadReportData();
  };

  const handleReject = async (comments: string) => {
    if (!currentUser || !report) return;
    
    await mockReportApi.reject(report.id, currentUser.id, comments);
    
    // Reload report data to show updated status
    await loadReportData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-4">
          {error || 'Report not found'}
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
            onClick={() => biopsy ? router.push(`/dashboard/biopsies/${biopsy.id}`) : router.push('/dashboard/biopsies')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Report - Version {report.currentVersion}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {biopsy ? `Biopsy ${biopsy.labCode}` : 'Report Details'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={report.status} />
          <Button
            variant="secondary"
            onClick={() => router.push(`/dashboard/reports/${report.id}/preview`)}
          >
            <FileDown className="w-4 h-4 mr-2" />
            View PDF
          </Button>
          {currentUser && report && canEditReport(currentUser, report) && (
            <Button onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Report
            </Button>
          )}
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              <FileText className="w-5 h-5 inline mr-2" />
              Report Information
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Author</label>
                <p className="text-base text-gray-900 mt-1">
                  {author ? author.name : 'Loading...'}
                </p>
                {author && (
                  <p className="text-sm text-gray-600">{author.role}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {format(new Date(report.createdAt), 'PPP')}
                </p>
                <p className="text-sm text-gray-600">
                  {format(new Date(report.createdAt), 'p')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Last Updated
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {format(new Date(report.updatedAt), 'PPP')}
                </p>
                <p className="text-sm text-gray-600">
                  {format(new Date(report.updatedAt), 'p')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Version</label>
                <p className="text-base text-gray-900 mt-1">
                  {report.currentVersion} of {report.versions.length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Biopsy Information */}
        {biopsy && (
          <Card>
            <CardHeader>
              <CardTitle>
                <TestTube className="w-5 h-5 inline mr-2" />
                Biopsy Information
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Lab Code</label>
                  <p className="text-base text-gray-900 mt-1 font-mono">{biopsy.labCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Specimen Type</label>
                  <p className="text-base text-gray-900 mt-1">{biopsy.specimenType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date Received</label>
                  <p className="text-base text-gray-900 mt-1">
                    {format(new Date(biopsy.dateReceived), 'PPP')}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`/dashboard/biopsies/${biopsy.id}`)}
                >
                  View Biopsy Details
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Patient Information */}
        {patient && (
          <Card>
            <CardHeader>
              <CardTitle>
                <User className="w-5 h-5 inline mr-2" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardBody>
              <PatientInfoCompact patient={patient} className="flex-col items-start gap-2" />
              <Button
                variant="secondary"
                size="sm"
                className="w-full mt-4"
                onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
              >
                View Patient History
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Report Approval Card - Show for pending approval status */}
      {report.status === 'pending-approval' && currentUser && canApproveReport(currentUser) && (
        <ReportApprovalCard
          reportId={report.id}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Approval History */}
      {report.approvalHistory && report.approvalHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <History className="w-5 h-5 inline mr-2" />
              Approval History
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {report.approvalHistory.map((approval, index) => {
                const reviewer = reviewers[approval.reviewerId];
                return (
                  <div key={index} className="flex items-start gap-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex-shrink-0 mt-1">
                      {approval.action === 'approved' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 capitalize">
                          {approval.action}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(approval.timestamp), 'PPP p')}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        By {reviewer ? reviewer.name : 'Unknown'}
                      </p>
                      {approval.comments && (
                        <div className="mt-2 bg-gray-50 rounded p-3">
                          <p className="text-sm text-gray-700">{approval.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Version History */}
      {report.versions.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <History className="w-5 h-5 inline mr-2" />
              Version History ({report.versions.length})
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {report.versions.slice().reverse().map((version) => {
                const modifier = reviewers[version.modifiedBy];
                return (
                  <div 
                    key={version.versionNumber} 
                    className={`border-l-4 pl-4 py-2 ${
                      version.versionNumber === report.currentVersion 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          Version {version.versionNumber}
                        </span>
                        {version.versionNumber === report.currentVersion && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {format(new Date(version.modifiedAt), 'PP p')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Modified by {modifier ? modifier.name : 'Unknown'}
                    </p>
                    {version.changes && (
                      <p className="text-sm text-gray-700 mt-1 italic">
                        {version.changes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Report Content */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Report Content
        </h2>
        <StructuredReportViewer
          sections={{
            findings: report.findings,
            diagnosis: report.diagnosis,
            recommendations: report.recommendations
          }}
        />
      </div>
    </div>
  );
}
