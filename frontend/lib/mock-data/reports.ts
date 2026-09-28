// Mock data for reports

export type ReportStatus = 'draft' | 'pending-approval' | 'approved' | 'rejected';

export interface ReportVersion {
  versionNumber: number;
  content: string;
  modifiedBy: string;
  modifiedAt: string;
  changes?: string;
}

export interface Report {
  id: string;
  biopsyId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  status: ReportStatus;
  currentVersion: number;
  versions: ReportVersion[];
  findings: string;
  diagnosis: string;
  recommendations: string;
  approvalHistory?: {
    reviewerId: string;
    action: 'approved' | 'rejected';
    comments: string;
    timestamp: string;
  }[];
}

export const mockReports: Report[] = [
  {
    id: 'r1',
    biopsyId: 'b1',
    authorId: 'u3',
    createdAt: '2026-01-03T10:30:00Z',
    updatedAt: '2026-01-04T14:20:00Z',
    status: 'pending-approval',
    currentVersion: 2,
    versions: [
      {
        versionNumber: 1,
        content: 'Initial findings documented...',
        modifiedBy: 'u3',
        modifiedAt: '2026-01-03T10:30:00Z'
      },
      {
        versionNumber: 2,
        content: 'Updated with additional microscopic analysis...',
        modifiedBy: 'u3',
        modifiedAt: '2026-01-04T14:20:00Z',
        changes: 'Added detailed microscopic examination results'
      }
    ],
    findings: `<h2>Gross Examination</h2>
<p>The specimen consists of a wedge of lung tissue measuring 3.5 x 2.0 x 1.5 cm. The pleural surface is smooth and glistening. On sectioning, there is a firm, white-tan nodule measuring 1.2 cm in greatest dimension located 0.5 cm from the nearest resection margin.</p>

<h2>Microscopic Examination</h2>
<p>Sections show lung parenchyma with a well-circumscribed nodular lesion. The lesion is composed of atypical cells arranged in glandular patterns with occasional papillary formations. The cells show moderate nuclear atypia with hyperchromasia and irregular nuclear contours. Mitotic figures are present (8 per 10 high-power fields).</p>

<p>The surrounding lung tissue shows mild chronic inflammation and focal areas of fibrosis. No lymphovascular invasion is identified. The pleural surface is uninvolved.</p>`,
    diagnosis: `<h2>Diagnosis</h2>
<p><strong>Lung, wedge resection:</strong></p>
<ul>
<li>Adenocarcinoma, moderately differentiated</li>
<li>Size: 1.2 cm</li>
<li>Margins: Clear of tumor (closest margin 0.5 cm)</li>
<li>Lymphovascular invasion: Not identified</li>
<li>Pleural involvement: Absent</li>
</ul>`,
    recommendations: `<h2>Recommendations</h2>
<p>Clinical correlation and staging workup recommended. Suggest multidisciplinary team discussion for further management planning.</p>

<p>Immunohistochemical studies are being performed and will be reported as an addendum.</p>`
  },
  {
    id: 'r2',
    biopsyId: 'b3',
    authorId: 'u3',
    createdAt: '2025-12-30T09:15:00Z',
    updatedAt: '2025-12-31T16:45:00Z',
    status: 'approved',
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        content: 'Complete pathology report...',
        modifiedBy: 'u3',
        modifiedAt: '2025-12-30T09:15:00Z'
      }
    ],
    findings: `<h2>Gross Examination</h2>
<p>The specimen consists of a polypoid fragment of tissue measuring 0.8 x 0.6 x 0.4 cm with a smooth surface.</p>

<h2>Microscopic Examination</h2>
<p>Sections show colonic mucosa with a pedunculated polyp. The polyp shows tubular architecture lined by dysplastic epithelium. The dysplasia is characterized by hyperchromatic, elongated nuclei with loss of nuclear polarity, but there is no invasion through the muscularis mucosae.</p>`,
    diagnosis: `<h2>Diagnosis</h2>
<p><strong>Colon, polypectomy:</strong></p>
<ul>
<li>Tubular adenoma with low-grade dysplasia</li>
<li>Margins: Clear</li>
<li>No evidence of high-grade dysplasia or malignancy</li>
</ul>`,
    recommendations: `<h2>Recommendations</h2>
<p>Complete removal achieved. Recommend follow-up colonoscopy per standard surveillance guidelines for adenomatous polyps.</p>`,
    approvalHistory: [
      {
        reviewerId: 'u1',
        action: 'approved',
        comments: 'Report is complete and accurate. Approved for release.',
        timestamp: '2025-12-31T16:45:00Z'
      }
    ]
  },
  {
    id: 'r3',
    biopsyId: 'b5',
    authorId: 'u3',
    createdAt: '2025-12-22T11:00:00Z',
    updatedAt: '2025-12-23T10:30:00Z',
    status: 'approved',
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        content: 'Dermatology pathology report...',
        modifiedBy: 'u3',
        modifiedAt: '2025-12-22T11:00:00Z'
      }
    ],
    findings: `<h2>Gross Examination</h2>
<p>The specimen consists of an elliptical fragment of skin measuring 0.5 x 0.4 x 0.2 cm with a raised, pigmented lesion.</p>

<h2>Microscopic Examination</h2>
<p>Sections show skin with a compound melanocytic nevus. The lesion is symmetric and well-circumscribed. Nevus cells are present in nests within the epidermis and dermis. No cytologic atypia is identified. The lesion is completely excised.</p>`,
    diagnosis: `<h2>Diagnosis</h2>
<p><strong>Skin, excisional biopsy:</strong></p>
<ul>
<li>Compound melanocytic nevus, benign</li>
<li>Margins: Clear</li>
<li>No evidence of malignancy</li>
</ul>`,
    recommendations: `<h2>Recommendations</h2>
<p>No further treatment required. Complete excision achieved. Routine dermatologic follow-up as clinically indicated.</p>`,
    approvalHistory: [
      {
        reviewerId: 'u2',
        action: 'approved',
        comments: 'Benign lesion, completely excised. Report approved.',
        timestamp: '2025-12-23T10:30:00Z'
      }
    ]
  }
];

// Helper function to get report by id
export const getReportById = (id: string): Report | undefined => {
  return mockReports.find(report => report.id === id);
};

// Helper function to get reports by biopsy id
export const getReportsByBiopsyId = (biopsyId: string): Report[] => {
  return mockReports.filter(report => report.biopsyId === biopsyId);
};

// Helper function to get reports by status
export const getReportsByStatus = (status: ReportStatus): Report[] => {
  return mockReports.filter(report => report.status === status);
};

// Helper function to get reports by author
export const getReportsByAuthor = (authorId: string): Report[] => {
  return mockReports.filter(report => report.authorId === authorId);
};

// Helper function to get pending approval reports
export const getPendingApprovalReports = (): Report[] => {
  return mockReports.filter(report => report.status === 'pending-approval');
};
