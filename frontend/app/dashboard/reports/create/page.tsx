'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Save, Send, FileText, TestTube, User, AlertCircle } from 'lucide-react';
import { mockBiopsyApi, mockReportApi, mockPatientApi } from '@/lib/utils/mock-api';
import { Biopsy, Patient } from '@/lib/types';
import { useCurrentUser } from '@/lib/store/user-store';
import { canCreateReport } from '@/lib/utils/permissions';
import { Button } from '@/app/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '@/app/components/ui/Card';
import { Skeleton } from '@/app/components/ui/Skeleton';
import { PatientInfoCompact } from '@/app/components/patients/PatientInfo';
import { StructuredReportEditor, ReportSections } from '@/app/components/reports/StructuredReportEditor';

function CreateReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useCurrentUser();
  const biopsyId = searchParams.get('biopsyId');

  const [biopsy, setBiopsy] = useState<Biopsy | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [reportSections, setReportSections] = useState<ReportSections>({
    findings: '',
    diagnosis: '',
    recommendations: ''
  });

  useEffect(() => {
    // Check permissions
    if (!currentUser || !canCreateReport(currentUser)) {
      router.push('/dashboard/biopsies');
      return;
    }

    if (!biopsyId) {
      setError('No biopsy specified');
      setLoading(false);
      return;
    }

    loadBiopsyData();
  }, [biopsyId, currentUser, router]);

  const loadBiopsyData = async () => {
    if (!biopsyId) return;

    try {
      setLoading(true);
      setError(null);

      const biopsyData = await mockBiopsyApi.getById(biopsyId);
      
      if (!biopsyData) {
        setError('Biopsy not found');
        return;
      }

      setBiopsy(biopsyData);

      const patientData = await mockPatientApi.getById(biopsyData.patientId);
      setPatient(patientData);
    } catch (err) {
      setError('Failed to load biopsy data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentUser || !biopsyId) return;

    try {
      setSaving(true);
      
      const newReport = await mockReportApi.create({
        biopsyId,
        authorId: currentUser.id,
        findings: reportSections.findings,
        diagnosis: reportSections.diagnosis,
        recommendations: reportSections.recommendations
      });

      // Navigate to the report detail page
      router.push(`/dashboard/reports/${newReport.id}`);
    } catch (err) {
      console.error('Error saving draft:', err);
      setError('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!currentUser || !biopsyId) return;

    // Validate that all sections have content
    if (!reportSections.findings.trim() || !reportSections.diagnosis.trim()) {
      setError('Findings and Diagnosis sections are required');
      return;
    }

    try {
      setSaving(true);
      
      const newReport = await mockReportApi.create({
        biopsyId,
        authorId: currentUser.id,
        findings: reportSections.findings,
        diagnosis: reportSections.diagnosis,
        recommendations: reportSections.recommendations
      });

      // Submit for approval
      await mockReportApi.submitForApproval(newReport.id);

      // Navigate to the report detail page
      router.push(`/dashboard/reports/${newReport.id}`);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Failed to submit report');
    } finally {
      setSaving(false);
    }
  };

  const handleAutoSave = async () => {
    // Auto-save is handled by the StructuredReportEditor
    // This could be extended to save to localStorage or backend
    console.log('Auto-saving report...');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error && !biopsy) {
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

  if (!currentUser || !canCreateReport(currentUser)) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-4">
          You don't have permission to create reports
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
            onClick={() => router.push(`/dashboard/biopsies/${biopsyId}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Report</h1>
            <p className="text-sm text-gray-500 mt-1">
              {biopsy ? `For biopsy ${biopsy.labCode}` : 'New report'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            onClick={handleSubmitForApproval}
            disabled={saving}
          >
            <Send className="w-4 h-4 mr-2" />
            {saving ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && biopsy && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Context Information */}
      {biopsy && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biopsy Information */}
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
                {biopsy.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-sm text-gray-700 mt-1">{biopsy.notes}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                <User className="w-5 h-5 inline mr-2" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardBody>
              {patient ? (
                <PatientInfoCompact patient={patient} />
              ) : (
                <p className="text-gray-500">Loading patient information...</p>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Report Editor */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Report Content
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete all sections below. Findings and Diagnosis are required before submitting for approval.
          </p>
        </div>

        <StructuredReportEditor
          initialSections={reportSections}
          onChange={setReportSections}
          onSave={handleAutoSave}
          autoSave={false}
          showSaveButton={false}
        />
      </div>

      {/* Action Buttons (Bottom) */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/biopsies/${biopsyId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            onClick={handleSubmitForApproval}
            disabled={saving}
          >
            <Send className="w-4 h-4 mr-2" />
            {saving ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CreateReportPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    }>
      <CreateReportContent />
    </Suspense>
  );
}
