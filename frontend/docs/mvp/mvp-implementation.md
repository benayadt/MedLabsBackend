# Anapath MVP - Implementation Plan

**Related Documents:**
- [User Stories & Tasks](./mvp-user-stories.md)
- [MedLabs Design Document](../design/medlabs-design.md)

## Overview

This document outlines the implementation plan for a rapid MVP (Minimum Viable Product) of Anapath to demonstrate core functionality to the client. The MVP will use **mocked data** to simulate backend functionality while showcasing the complete user experience.

**Timeline Goal:** Rapid development for client demonstration  
**Approach:** Frontend-only implementation with realistic mock data

---

## MVP Scope

### Core Features to Implement

1. **Biopsy List View**
   - Display all biopsies with key information
   - Filter by status
   - Search functionality
   - Clickable rows to view details

2. **Biopsy Detail View**
   - Complete biopsy information
   - Patient details
   - Source and sender information
   - Associated reports
   - Action buttons based on user role

3. **Report Creation/Editing**
   - Rich text editor for report content
   - Structured sections (findings, diagnosis, recommendations)
   - Save draft functionality
   - Submit for approval

4. **Report Review & Approval**
   - View report with metadata
   - Edit capability (for approving doctors)
   - Approve/Reject actions with comments
   - Status indicators

5. **Patient History View**
   - List of all biopsies for a patient
   - Chronological timeline
   - Quick access to reports

6. **PDF Preview**
   - Preview report in PDF format
   - Download capability
   - Professional layout with branding

7. **Role Simulation**
   - Toggle between user roles to demonstrate permissions
   - Visual indicators of current role
   - Permission-based UI changes

---

## Technical Stack

### Frontend Framework
- **Next.js 14+** (already in project)
- **React 18+**
- **TypeScript**
- **Tailwind CSS** (for styling)

### Key Libraries to Add

```json
{
  "dependencies": {
    "@tiptap/react": "^2.x",           // Rich text editor
    "@tiptap/starter-kit": "^2.x",      // Editor extensions
    "react-pdf": "^7.x",                // PDF preview
    "@react-pdf/renderer": "^3.x",      // PDF generation
    "date-fns": "^3.x",                 // Date formatting
    "zustand": "^4.x",                  // State management (lightweight)
    "lucide-react": "^0.x"              // Icons
  }
}
```

---

## Mock Data Structure

### 1. Users Mock Data

```typescript
// lib/mock-data/users.ts

export type UserRole = 'lab-worker' | 'reporting-doctor' | 'approving-doctor' | 'administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialization?: string;
}

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medlabs.com',
    role: 'approving-doctor',
    specialization: 'Anatomical Pathology'
  },
  {
    id: 'u2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@medlabs.com',
    role: 'approving-doctor',
    specialization: 'Anatomical Pathology'
  },
  {
    id: 'u3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@medlabs.com',
    role: 'reporting-doctor',
    specialization: 'Pathology'
  },
  {
    id: 'u4',
    name: 'John Smith',
    email: 'john.smith@medlabs.com',
    role: 'lab-worker'
  },
  {
    id: 'u5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@medlabs.com',
    role: 'administrator'
  }
];
```

### 2. Patients Mock Data

```typescript
// lib/mock-data/patients.ts

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  medicalRecordNumber: string;
  gender: 'M' | 'F' | 'Other';
}

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    firstName: 'James',
    lastName: 'Wilson',
    dateOfBirth: '1975-03-15',
    medicalRecordNumber: 'MRN-001234',
    gender: 'M'
  },
  {
    id: 'p2',
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: '1982-07-22',
    medicalRecordNumber: 'MRN-001235',
    gender: 'F'
  },
  {
    id: 'p3',
    firstName: 'Robert',
    lastName: 'Brown',
    dateOfBirth: '1968-11-30',
    medicalRecordNumber: 'MRN-001236',
    gender: 'M'
  },
  {
    id: 'p4',
    firstName: 'Jennifer',
    lastName: 'Taylor',
    dateOfBirth: '1990-05-08',
    medicalRecordNumber: 'MRN-001237',
    gender: 'F'
  }
];
```

### 3. Biopsies Mock Data

```typescript
// lib/mock-data/biopsies.ts

export type BiopsyStatus = 
  | 'received' 
  | 'in-analysis' 
  | 'report-drafted' 
  | 'pending-approval' 
  | 'approved' 
  | 'rejected' 
  | 'completed';

export interface Biopsy {
  id: string;
  labCode: string;
  patientId: string;
  dateTaken: string;
  dateReceived: string;
  source: {
    type: 'hospital' | 'laboratory' | 'clinic' | 'other';
    name: string;
    location?: string;
  };
  sender: {
    name: string;
    title: string;
    contact?: string;
  };
  specimenType: string;
  status: BiopsyStatus;
  assignedTo?: string; // userId
  notes?: string;
}

export const mockBiopsies: Biopsy[] = [
  {
    id: 'b1',
    labCode: 'AP-2026-001',
    patientId: 'p1',
    dateTaken: '2026-01-02',
    dateReceived: '2026-01-03',
    source: {
      type: 'hospital',
      name: 'City General Hospital',
      location: 'Oncology Department'
    },
    sender: {
      name: 'Dr. Richard Stevens',
      title: 'Oncologist',
      contact: 'richard.stevens@citygeneral.com'
    },
    specimenType: 'Lung tissue',
    status: 'pending-approval',
    assignedTo: 'u3'
  },
  {
    id: 'b2',
    labCode: 'AP-2026-002',
    patientId: 'p2',
    dateTaken: '2026-01-03',
    dateReceived: '2026-01-04',
    source: {
      type: 'clinic',
      name: 'Downtown Medical Clinic'
    },
    sender: {
      name: 'Dr. Amanda Lee',
      title: 'General Practitioner'
    },
    specimenType: 'Skin lesion',
    status: 'in-analysis',
    assignedTo: 'u4'
  },
  {
    id: 'b3',
    labCode: 'AP-2026-003',
    patientId: 'p3',
    dateTaken: '2025-12-28',
    dateReceived: '2025-12-30',
    source: {
      type: 'hospital',
      name: 'Regional Medical Center',
      location: 'Surgery'
    },
    sender: {
      name: 'Dr. Thomas Wright',
      title: 'Surgeon'
    },
    specimenType: 'Colon polyp',
    status: 'approved',
    assignedTo: 'u3'
  },
  {
    id: 'b4',
    labCode: 'AP-2026-004',
    patientId: 'p4',
    dateTaken: '2026-01-04',
    dateReceived: '2026-01-05',
    source: {
      type: 'laboratory',
      name: 'EastSide Labs'
    },
    sender: {
      name: 'Dr. Patricia Moore',
      title: 'Lab Director'
    },
    specimenType: 'Breast tissue',
    status: 'received',
    assignedTo: 'u4'
  }
];
```

### 4. Reports Mock Data

```typescript
// lib/mock-data/reports.ts

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
  }
];
```

---

## File Structure

```
app/
├── (dashboard)/
│   ├── layout.tsx                    # Dashboard layout with navigation
│   ├── biopsies/
│   │   ├── page.tsx                  # Biopsy list view
│   │   └── [id]/
│   │       └── page.tsx              # Biopsy detail view
│   ├── reports/
│   │   ├── new/
│   │   │   └── page.tsx              # Create new report
│   │   └── [id]/
│   │       ├── page.tsx              # View/edit report
│   │       └── preview/
│   │           └── page.tsx          # PDF preview
│   └── patients/
│       └── [id]/
│           └── page.tsx              # Patient history view
├── components/
│   ├── biopsies/
│   │   ├── BiopsyList.tsx
│   │   ├── BiopsyCard.tsx
│   │   ├── BiopsyFilters.tsx
│   │   └── BiopsyStatusBadge.tsx
│   ├── reports/
│   │   ├── ReportEditor.tsx          # Rich text editor component
│   │   ├── ReportViewer.tsx
│   │   ├── ReportApproval.tsx        # Approval/rejection UI
│   │   └── ReportPDFPreview.tsx
│   ├── patients/
│   │   ├── PatientInfo.tsx
│   │   └── PatientTimeline.tsx
│   ├── shared/
│   │   ├── RoleSimulator.tsx         # Toggle between roles
│   │   ├── StatusBadge.tsx
│   │   └── DateDisplay.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       └── Badge.tsx
├── lib/
│   ├── mock-data/
│   │   ├── users.ts
│   │   ├── patients.ts
│   │   ├── biopsies.ts
│   │   └── reports.ts
│   ├── store/
│   │   └── user-store.ts             # Current user state (role simulation)
│   ├── utils/
│   │   ├── permissions.ts            # Permission checking utilities
│   │   ├── date-helpers.ts
│   │   └── pdf-generator.ts
│   └── types/
│       └── index.ts                  # Shared TypeScript types
└── styles/
    └── editor.css                     # Custom styles for text editor
```

---

## Implementation Steps

### Phase 1: Setup & Foundation (Day 1)

1. **Install Dependencies**
   ```bash
   npm install @tiptap/react @tiptap/starter-kit react-pdf @react-pdf/renderer date-fns zustand lucide-react
   npm install -D @types/react-pdf
   ```

2. **Create Mock Data Files**
   - `lib/mock-data/users.ts`
   - `lib/mock-data/patients.ts`
   - `lib/mock-data/biopsies.ts`
   - `lib/mock-data/reports.ts`

3. **Create Type Definitions**
   - `lib/types/index.ts` - Centralized types

4. **Setup State Management**
   - `lib/store/user-store.ts` - Zustand store for current user/role

5. **Create Permission Utilities**
   - `lib/utils/permissions.ts` - Helper functions for role-based access

### Phase 2: Core Components (Days 1-2)

1. **Dashboard Layout**
   - Navigation sidebar
   - Role indicator
   - Quick stats

2. **Biopsy Components**
   - List view with filters
   - Detail view
   - Status badges

3. **Report Components**
   - Rich text editor setup
   - Report viewer
   - Version comparison

4. **UI Components**
   - Buttons, Cards, Modals
   - Status badges
   - Loading states

### Phase 3: Main Features (Days 2-3)

1. **Biopsy List & Detail Pages**
   - Display all biopsies
   - Filter and search
   - Navigate to details

2. **Report Creation/Editing**
   - Rich text editor integration
   - Auto-save (to localStorage for demo)
   - Submit for approval

3. **Report Approval Workflow**
   - Review interface
   - Approve/reject actions
   - Comment system

4. **Patient History**
   - Timeline view
   - All biopsies for patient
   - Quick report access

### Phase 4: PDF & Polish (Day 3)

1. **PDF Generation**
   - Report template
   - Professional styling
   - Preview component

2. **Role Simulation**
   - Toggle between users
   - Visual role indicator
   - Permission-based UI

3. **Polish & Demo Prep**
   - Responsive design
   - Loading states
   - Error handling
   - Smooth transitions

---

## Key Features Demo Flow

### Demo Scenario 1: Laboratory Worker Creates Report

1. Login as "John Smith" (Lab Worker)
2. View biopsy list → Click "AP-2026-004"
3. Click "Create Report"
4. Use rich text editor to document findings
5. Save draft
6. Submit for approval
7. Show that worker cannot approve own report

### Demo Scenario 2: Approving Doctor Reviews Report

1. Switch to "Dr. Sarah Johnson" (Approving Doctor)
2. View notifications/pending approvals
3. Click on pending report for "AP-2026-001"
4. Review report content
5. Make minor edits to improve clarity
6. Add approval comments
7. Approve report
8. Show that report is now locked

### Demo Scenario 3: View Patient History

1. Navigate to patient "James Wilson"
2. Show timeline of all biopsies
3. Click on previous biopsy
4. View historical report
5. Show continuity of care

### Demo Scenario 4: PDF Export

1. Open approved report
2. Click "Preview PDF"
3. Show professional formatting
4. Download PDF
5. Show branding and signatures

---

## Mock Data Behavior

### Local Storage Simulation

Since there's no backend, use browser localStorage to persist changes during the demo:

```typescript
// lib/utils/mock-storage.ts

export const mockStorage = {
  // Save updated data
  saveBiopsy: (biopsy: Biopsy) => {
    const biopsies = JSON.parse(localStorage.getItem('biopsies') || '[]');
    const index = biopsies.findIndex((b: Biopsy) => b.id === biopsy.id);
    if (index >= 0) {
      biopsies[index] = biopsy;
    } else {
      biopsies.push(biopsy);
    }
    localStorage.setItem('biopsies', JSON.stringify(biopsies));
  },
  
  // Load data with fallback to mock
  getBiopsies: (): Biopsy[] => {
    const stored = localStorage.getItem('biopsies');
    return stored ? JSON.parse(stored) : mockBiopsies;
  },
  
  // Reset to original mock data
  resetData: () => {
    localStorage.clear();
  }
};
```

### Simulated Delays

Add realistic delays to simulate API calls:

```typescript
// lib/utils/mock-api.ts

export const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  getBiopsies: async () => {
    await mockDelay();
    return mockStorage.getBiopsies();
  },
  
  updateBiopsy: async (biopsy: Biopsy) => {
    await mockDelay();
    mockStorage.saveBiopsy(biopsy);
    return biopsy;
  }
};
```

---

## UI/UX Considerations

### Color Scheme for Status

```css
/* Biopsy/Report Status Colors */
.status-received { @apply bg-blue-100 text-blue-800; }
.status-in-analysis { @apply bg-yellow-100 text-yellow-800; }
.status-report-drafted { @apply bg-purple-100 text-purple-800; }
.status-pending-approval { @apply bg-orange-100 text-orange-800; }
.status-approved { @apply bg-green-100 text-green-800; }
.status-rejected { @apply bg-red-100 text-red-800; }
.status-completed { @apply bg-gray-100 text-gray-800; }
```

### Role-Based Color Indicators

```css
.role-lab-worker { @apply border-l-4 border-blue-500; }
.role-reporting-doctor { @apply border-l-4 border-purple-500; }
.role-approving-doctor { @apply border-l-4 border-green-500; }
.role-administrator { @apply border-l-4 border-red-500; }
```

### Responsive Breakpoints

- Mobile: 640px (simplified view)
- Tablet: 768px (two-column layout)
- Desktop: 1024px+ (full dashboard)

---

## Demo Data Highlights

### Statistics to Display

- **Total Biopsies**: 4
- **Pending Approval**: 1
- **In Analysis**: 1
- **Completed This Week**: 2
- **Average Turnaround Time**: 2.5 days

### Notifications/Alerts

- "1 report pending your approval" (for Approving Doctors)
- "Report AP-2026-001 submitted for approval" (for Report Author)
- "Report AP-2026-003 approved by Dr. Sarah Johnson"

---

## Testing Checklist

### Functionality Tests

- [ ] Biopsy list displays all records
- [ ] Filters work correctly
- [ ] Biopsy detail shows complete information
- [ ] Report creation saves to localStorage
- [ ] Rich text editor functions properly
- [ ] Role toggle changes available actions
- [ ] Permissions are enforced in UI
- [ ] Approval workflow completes
- [ ] PDF preview generates correctly
- [ ] Patient history shows all biopsies
- [ ] Data persists across page refreshes

### UI/UX Tests

- [ ] Responsive on mobile, tablet, desktop
- [ ] All buttons have hover states
- [ ] Loading states display during delays
- [ ] Error messages are clear
- [ ] Success confirmations appear
- [ ] Navigation is intuitive
- [ ] Color scheme is consistent
- [ ] Typography is readable

---

## Client Presentation Tips

### Setup Before Demo

1. Clear localStorage to start fresh
2. Load initial mock data
3. Open in incognito/private window
4. Have multiple tabs ready for role switching
5. Prepare specific scenarios

### Key Points to Emphasize

1. **Complete Workflow**: From biopsy receipt to report approval
2. **Role-Based Access**: Different capabilities per user type
3. **Audit Trail**: Version history and approval tracking
4. **Professional Output**: PDF generation for reports
5. **Patient-Centric**: Complete history view
6. **User-Friendly**: Intuitive interface, rich text editing

### Questions to Anticipate

- "Can we integrate with our existing system?" → Yes, architecture allows for API integration
- "What about data security?" → Designed with HIPAA compliance in mind (explain encryption, audit logs)
- "Can we customize report templates?" → Yes, extensible template system
- "How long to implement with real backend?" → 2-3 weeks for basic API integration
- "Can we add more user roles?" → Yes, permission system is flexible

---

## Next Steps After MVP Approval

1. **Backend Development**
   - Design database schema
   - Create REST/GraphQL API
   - Implement authentication

2. **Replace Mock Data**
   - Connect to real API endpoints
   - Implement proper state management
   - Add optimistic updates

3. **Enhanced Features**
   - Email notifications
   - Advanced search
   - Analytics dashboard
   - Bulk operations

4. **Production Preparation**
   - Security audit
   - Performance optimization
   - Automated testing
   - Deployment pipeline

---

## Appendix: Quick Start Commands

```bash
# Install all dependencies
npm install

# Run development server
npm run dev

# Build for production demo
npm run build

# Start production server
npm start

# Reset mock data (add custom script)
npm run reset-demo
```

---

**Document Version:** 1.0  
**Last Updated:** January 5, 2026  
**Status:** Ready for Implementation
