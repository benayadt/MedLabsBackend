'use client';

import { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download, Printer, Mail, X } from 'lucide-react';
import { Report, Biopsy, Patient, User } from '@/lib/types';
import { Button } from '@/app/components/ui/Button';
import { Card, CardBody } from '@/app/components/ui/Card';
import { ReportPDFTemplate } from './ReportPDFTemplate';

interface ReportPDFPreviewProps {
  report: Report;
  biopsy: Biopsy;
  patient: Patient;
  author?: User;
  approver?: User;
  onClose?: () => void;
}

export const ReportPDFPreview = ({
  report,
  biopsy,
  patient,
  author,
  approver,
  onClose,
}: ReportPDFPreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generatePDF();
    
    // Cleanup URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [report, biopsy, patient]);

  const generatePDF = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate PDF blob
      const blob = await pdf(
        <ReportPDFTemplate
          report={report}
          biopsy={biopsy}
          patient={patient}
          author={author}
          approver={approver}
        />
      ).toBlob();

      // Create object URL
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setError('Failed to generate PDF preview');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await pdf(
        <ReportPDFTemplate
          report={report}
          biopsy={biopsy}
          patient={patient}
          author={author}
          approver={approver}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Report_${biopsy.labCode}_${report.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      alert('Failed to download PDF');
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
    }
  };

  const handleEmail = () => {
    // Simulated email functionality
    alert('Email functionality would be integrated here.\n\nIn production, this would:\n- Open email compose dialog\n- Attach the PDF\n- Pre-fill recipient and subject');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating PDF preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
            <Button onClick={generatePDF} variant="primary">
              Try Again
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">PDF Preview</h3>
              <span className="text-sm text-gray-500">
                Report {biopsy.labCode} - v{report.currentVersion}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEmail}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* PDF Viewer */}
      {pdfUrl && (
        <Card>
          <CardBody className="p-0">
            <div className="w-full" style={{ height: '800px' }}>
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
