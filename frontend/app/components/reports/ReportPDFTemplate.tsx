import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Report, Biopsy, Patient, User } from '@/lib/types';

// Register fonts (using default fonts for simplicity)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
    { src: 'Helvetica-Oblique', fontStyle: 'italic' },
  ],
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  labInfo: {
    flex: 1,
  },
  labName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  labAddress: {
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    marginTop: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
  },
  metadataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  metadataItem: {
    width: '50%',
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  metadataValue: {
    fontSize: 11,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  contentBlock: {
    marginBottom: 12,
  },
  contentTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
  },
  contentText: {
    fontSize: 10,
    color: '#1f2937',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  approvalSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0fdf4',
    borderRadius: 4,
  },
  approvalTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 10,
  },
  approvalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approvalBlock: {
    flex: 1,
  },
  approvalLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  approvalValue: {
    fontSize: 10,
    color: '#1f2937',
  },
  signatureLine: {
    marginTop: 30,
    borderTop: 1,
    borderTopColor: '#9ca3af',
    paddingTop: 5,
    width: 200,
  },
  signatureText: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#6b7280',
  },
  pageNumber: {
    fontSize: 8,
    color: '#6b7280',
  },
  statusBadge: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: '4 8',
    borderRadius: 3,
    textTransform: 'uppercase',
  },
  statusApproved: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  versionInfo: {
    fontSize: 9,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});

interface ReportPDFTemplateProps {
  report: Report;
  biopsy: Biopsy;
  patient: Patient;
  author?: User;
  approver?: User;
}

// Helper to strip HTML tags from rich text
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
};

// Helper to get status color
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'approved':
      return styles.statusApproved;
    case 'pending-approval':
      return styles.statusPending;
    default:
      return styles.statusPending;
  }
};

export const ReportPDFTemplate = ({
  report,
  biopsy,
  patient,
  author,
  approver,
}: ReportPDFTemplateProps) => {
  const approvalRecord = report.approvalHistory?.[0];
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.labInfo}>
              <Text style={styles.labName}>ANAPATH LABORATORIES</Text>
              <Text style={styles.labAddress}>
                123 Medical Center Drive{'\n'}
                Casablanca, Morocco 20250{'\n'}
                Tel: +212 5XX-XXXXXX | Fax: +212 5XX-XXXXXX{'\n'}
                Email: contact@anapath.ma
              </Text>
            </View>
            <View>
              <Text style={[styles.statusBadge, getStatusStyle(report.status)]}>
                {report.status.replace('-', ' ')}
              </Text>
            </View>
          </View>
          <Text style={styles.reportTitle}>ANATOMIC PATHOLOGY REPORT</Text>
        </View>

        {/* Patient Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.metadataGrid}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Patient Name</Text>
              <Text style={styles.metadataValue}>
                {patient.firstName} {patient.lastName}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Medical Record Number</Text>
              <Text style={styles.metadataValue}>{patient.medicalRecordNumber}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Date of Birth</Text>
              <Text style={styles.metadataValue}>
                {format(new Date(patient.dateOfBirth), 'PP')}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Gender</Text>
              <Text style={styles.metadataValue}>
                {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}
              </Text>
            </View>
          </View>
        </View>

        {/* Specimen Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specimen Information</Text>
          <View style={styles.metadataGrid}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Laboratory Code</Text>
              <Text style={styles.metadataValue}>{biopsy.labCode}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Specimen Type</Text>
              <Text style={styles.metadataValue}>{biopsy.specimenType}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Date Taken</Text>
              <Text style={styles.metadataValue}>
                {format(new Date(biopsy.dateTaken), 'PP')}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Date Received</Text>
              <Text style={styles.metadataValue}>
                {format(new Date(biopsy.dateReceived), 'PP')}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Referring Physician</Text>
              <Text style={styles.metadataValue}>
                {biopsy.sender.name || 'Not specified'}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Source</Text>
              <Text style={styles.metadataValue}>
                {biopsy.source.name} ({biopsy.source.type})
              </Text>
            </View>
          </View>
        </View>

        {/* Report Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Content</Text>

          {/* Findings */}
          {report.findings && (
            <View style={styles.contentBlock}>
              <Text style={styles.contentTitle}>CLINICAL FINDINGS</Text>
              <Text style={styles.contentText}>{stripHtml(report.findings)}</Text>
            </View>
          )}

          {/* Diagnosis */}
          {report.diagnosis && (
            <View style={styles.contentBlock}>
              <Text style={styles.contentTitle}>DIAGNOSIS</Text>
              <Text style={styles.contentText}>{stripHtml(report.diagnosis)}</Text>
            </View>
          )}

          {/* Recommendations */}
          {report.recommendations && (
            <View style={styles.contentBlock}>
              <Text style={styles.contentTitle}>RECOMMENDATIONS</Text>
              <Text style={styles.contentText}>{stripHtml(report.recommendations)}</Text>
            </View>
          )}
        </View>

        {/* Report Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Information</Text>
          <View style={styles.metadataGrid}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Report ID</Text>
              <Text style={styles.metadataValue}>{report.id}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Version</Text>
              <Text style={styles.metadataValue}>v{report.currentVersion}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Created Date</Text>
              <Text style={styles.metadataValue}>
                {format(new Date(report.createdAt), 'PPp')}
              </Text>
            </View>
            {report.updatedAt !== report.createdAt && (
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Last Modified</Text>
                <Text style={styles.metadataValue}>
                  {format(new Date(report.updatedAt), 'PPp')}
                </Text>
              </View>
            )}
            {author && (
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Authored By</Text>
                <Text style={styles.metadataValue}>{author.name}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Approval Section */}
        {report.status === 'approved' && approvalRecord && (
          <View style={styles.approvalSection}>
            <Text style={styles.approvalTitle}>✓ APPROVED</Text>
            <View style={styles.approvalGrid}>
              <View style={styles.approvalBlock}>
                <Text style={styles.approvalLabel}>Approved By</Text>
                <Text style={styles.approvalValue}>
                  {approver?.name || 'Unknown'}
                </Text>
              </View>
              <View style={styles.approvalBlock}>
                <Text style={styles.approvalLabel}>Approval Date</Text>
                <Text style={styles.approvalValue}>
                  {format(new Date(approvalRecord.timestamp), 'PPp')}
                </Text>
              </View>
            </View>
            {approvalRecord.comments && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.approvalLabel}>Comments</Text>
                <Text style={styles.approvalValue}>{approvalRecord.comments}</Text>
              </View>
            )}
            <View style={styles.signatureLine}>
              <Text style={styles.signatureText}>Digital Signature</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            This is a confidential medical report. Unauthorized distribution is prohibited.
          </Text>
          <Text 
            style={styles.pageNumber} 
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};
