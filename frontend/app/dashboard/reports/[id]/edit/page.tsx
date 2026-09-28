'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Save, Send, FileText, TestTube, User, AlertCircle, History } from 'lucide-react';
import { mockReportApi, mockBiopsyApi, mockPatientApi, mockUserApi } from '@/lib/utils/mock-api';
import { Report, Biopsy, Patient, User as UserType } from '@/lib/types';
import { useCurrentUser } from '@/lib/store/user-store';
import { canEditReport } from '@/lib/utils/permissions';
import { Button } from '@/app/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '@/app/components/ui/Card';
import { StatusBadge } from '@/app/components/shared/StatusBadge';
import { Skeleton } from '@/app/components/ui/Skeleton';
import { PatientInfoCompact } from '@/app/components/patients/PatientInfo';
import { StructuredReportEditor, ReportSections } from '@/app/components/reports/StructuredReportEditor';

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const reportId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [biopsy, setBiopsy] = useState<Biopsy | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [author, setAuthor] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [reportSections, setReportSections] = useState<ReportSections>({
    findings: '',
    diagnosis: '',
    recommendations: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

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

      // Check permissions
      if (!currentUser || !canEditReport(currentUser, reportData)) {
        setError('You do not have permission to edit this report');
        return;
      }

      setReport(reportData);
      
      // Initialize report sections with existing content
      setReportSections({
        findings: reportData.findings,
        diagnosis: reportData.diagnosis,
        recommendations: reportData.recommendations
      });

      // Load related data
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
    } catch (err) {
      setError('Failed to load report data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionsChange = (newSections: ReportSections) => {
    setReportSections(newSections);
    
    // Check if there are changes from original
    if (report) {
      const changed = 
        newSections.findings !== report.findings ||
        newSections.diagnosis !== report.diagnosis ||
        newSections.recommendations !== report.recommendations;
      setHasChanges(changed);
    }
  };

  const handleSaveChanges = async () => {
    if (!currentUser || !report) return;

    try {
      setSaving(true);
      setError(null);
      
      const updatedReport = await mockReportApi.update(report.id, {
        findings: reportSections.findings,
        diagnosis: reportSections.diagnosis,
        recommendations: reportSections.recommendations
      });

      if (updatedReport) {
        // Add version entry if content changed
        const versionedReport = await mockReportApi.addVersion(
          updatedReport.id,
          currentUser.id,
          'Report content updated'
        );
        
        setReport(versionedReport || updatedReport);
        setHasChanges(false);
      }
      
      // Navigate to the report detail page
      router.push(`/dashboard/reports/${report.id}`);
    } catch (err) {
      console.error('Error saving changes:', err);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!currentUser || !report) return;

    // Validate that required sections have content
    if (!reportSections.findings.trim() || !reportSections.diagnosis.trim()) {
      setError('Findings and Diagnosis sections are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Save changes first
      const updatedReport = await mockReportApi.update(report.id, {
        findings: reportSections.findings,
        diagnosis: reportSections.diagnosis,
        recommendations: reportSections.recommendations
      });

      if (updatedReport) {
        // Add version entry
        const versionedReport = await mockReportApi.addVersion(
          updatedReport.id,
          currentUser.id,
          'Report submitted for approval'
        );

        // Submit for approval
        await mockReportApi.submitForApproval(updatedReport.id);
      }

      // Navigate to the report detail page
      router.push(`/dashboard/reports/${report.id}`);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Failed to submit report');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
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

  if (error && !report) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
        <Button variant="secondary" onClick={() => router.push('/dashboard/biopsies')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Biopsies
        </Button>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Report</h1>
            <p className="text-sm text-gray-500 mt-1">
              {biopsy ? `Biopsy ${biopsy.labCode}` : 'Report Details'} • Version {report.currentVersion}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={report.status} />
          {hasChanges && (
            <span className="text-sm text-orange-600 font-medium">
              • Unsaved changes
            </span>
          )}
          <Button
            variant="secondary"
            onClick={handleSaveChanges}
            disabled={saving || !hasChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          {report.status === 'draft' && (
            <Button
              onClick={handleSubmitForApproval}
              disabled={saving}
            >
              <Send className="w-4 h-4 mr-2" />
              {saving ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && report && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Info Banner */}
      {report.status !== 'draft' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-800 font-medium">Note</p>
            <p className="text-blue-700 text-sm mt-1">
              This report has status "{report.status}". Editing will create a new version.
            </p>
          </div>
        </div>
      )}

      {/* Context Information */}
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
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-base text-gray-900 mt-1">
                  {format(new Date(report.createdAt), 'PPP')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-base text-gray-900 mt-1">
                  {format(new Date(report.updatedAt), 'PPP')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <History className="w-4 h-4" />
                  Version
                </label>
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
            </CardBody>
          </Card>
        )}
      </div>

      {/* Report Editor */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Edit Report Content
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Make your changes below. Findings and Diagnosis are required before submitting for approval.
          </p>
        </div>

        <StructuredReportEditor
          initialSections={reportSections}
          onChange={handleSectionsChange}
          autoSave={false}
          showSaveButton={false}
        />
      </div>

      {/* Action Buttons (Bottom) */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        <Button
          variant="ghost"
          onClick={handleCancel}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleSaveChanges}
            disabled={saving || !hasChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          {report.status === 'draft' && (
            <Button
              onClick={handleSubmitForApproval}
              disabled={saving}
            >
              <Send className="w-4 h-4 mr-2" />
              {saving ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
