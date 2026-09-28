'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { mockReportApi, mockBiopsyApi, mockPatientApi, mockUserApi } from '@/lib/utils/mock-api';
import { Report, Biopsy, Patient, User } from '@/lib/types';
import { Button } from '@/app/components/ui/Button';
import { Skeleton } from '@/app/components/ui/Skeleton';
import { ReportPDFPreview } from '@/app/components/reports/ReportPDFPreview';

export default function ReportPDFPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [biopsy, setBiopsy] = useState<Biopsy | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [approver, setApprover] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReportData();
  }, [reportId]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load report
      const reportData = await mockReportApi.getById(reportId);
      if (!reportData) {
        setError('Report not found');
        return;
      }
      setReport(reportData);

      // Load biopsy
      const biopsyData = await mockBiopsyApi.getById(reportData.biopsyId);
      if (!biopsyData) {
        setError('Associated biopsy not found');
        return;
      }
      setBiopsy(biopsyData);

      // Load patient
      const patientData = await mockPatientApi.getById(biopsyData.patientId);
      if (!patientData) {
        setError('Patient not found');
        return;
      }
      setPatient(patientData);

      // Load author
      if (reportData.authorId) {
        const authorData = await mockUserApi.getById(reportData.authorId);
        setAuthor(authorData);
      }

      // Load approver
      if (reportData.approvalHistory && reportData.approvalHistory.length > 0) {
        const approvalRecord = reportData.approvalHistory[0];
        const approverData = await mockUserApi.getById(approvalRecord.reviewerId);
        setApprover(approverData);
      }
    } catch (err) {
      console.error('Failed to load report data:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.push(`/dashboard/reports/${reportId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !report || !biopsy || !patient) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-4">
          {error || 'Failed to load report data'}
        </div>
        <Button variant="secondary" onClick={handleClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Report
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleClose}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PDF Preview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Report for biopsy {biopsy.labCode}
          </p>
        </div>
      </div>

      {/* PDF Preview Component */}
      <ReportPDFPreview
        report={report}
        biopsy={biopsy}
        patient={patient}
        author={author || undefined}
        approver={approver || undefined}
        onClose={handleClose}
      />
    </div>
  );
}
