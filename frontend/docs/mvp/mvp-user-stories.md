# Anapath MVP - User Stories & Implementation Tasks

**Related Documents:**
- [MVP Implementation Plan](./mvp-implementation.md)
- [MedLabs Design Document](../design/medlabs-design.md)

---

## Overview

This document breaks down the MVP implementation into actionable user stories organized by development phases. Each story includes acceptance criteria, technical tasks, and estimated effort.

**Total Estimated Time:** 3 days  
**Team Size:** 1-2 developers  

---

## Phase 1: Setup & Foundation (Day 1 - Morning)

### Story 1.1: Project Dependencies Setup
**As a** developer  
**I want to** install all required dependencies  
**So that** I have the necessary tools to build the MVP

**Acceptance Criteria:**
- [ ] All npm packages installed successfully
- [ ] No dependency conflicts
- [ ] TypeScript types available for all packages

**Technical Tasks:**
```bash
npm install @tiptap/react @tiptap/starter-kit react-pdf @react-pdf/renderer date-fns zustand lucide-react
npm install -D @types/react-pdf
```

**Estimated Effort:** 15 minutes

---

### Story 1.2: Mock Data Structure
**As a** developer  
**I want to** create comprehensive mock data files  
**So that** I can simulate real data without a backend

**Acceptance Criteria:**
- [ ] Users mock data with all 4 roles defined
- [ ] Patients mock data with realistic information
- [ ] Biopsies mock data with various statuses
- [ ] Reports mock data with rich text content
- [ ] All data properly typed with TypeScript

**Technical Tasks:**
1. Create `lib/mock-data/users.ts`
   - Define `UserRole` type
   - Define `User` interface
   - Export `mockUsers` array with 5 users

2. Create `lib/mock-data/patients.ts`
   - Define `Patient` interface
   - Export `mockPatients` array with 4 patients

3. Create `lib/mock-data/biopsies.ts`
   - Define `BiopsyStatus` type
   - Define `Biopsy` interface
   - Export `mockBiopsies` array with 4+ biopsies

4. Create `lib/mock-data/reports.ts`
   - Define `ReportStatus` type
   - Define `Report` and `ReportVersion` interfaces
   - Export `mockReports` array with 2+ reports including HTML content

**Files to Create:**
- `lib/mock-data/users.ts`
- `lib/mock-data/patients.ts`
- `lib/mock-data/biopsies.ts`
- `lib/mock-data/reports.ts`

**Estimated Effort:** 1 hour

---

### Story 1.3: Type Definitions
**As a** developer  
**I want to** centralize all TypeScript type definitions  
**So that** types are consistent across the application

**Acceptance Criteria:**
- [ ] All types exported from single location
- [ ] No circular dependencies
- [ ] Types are reusable across components

**Technical Tasks:**
1. Create `lib/types/index.ts`
2. Re-export all types from mock data files
3. Add utility types (e.g., `WithId`, `Timestamp`)

**Files to Create:**
- `lib/types/index.ts`

**Estimated Effort:** 15 minutes

---

### Story 1.4: State Management Setup
**As a** developer  
**I want to** implement state management for user/role simulation  
**So that** users can switch roles during the demo

**Acceptance Criteria:**
- [ ] Zustand store created for current user
- [ ] Store includes role switching functionality
- [ ] Store persists to localStorage
- [ ] Type-safe state access

**Technical Tasks:**
1. Create `lib/store/user-store.ts`
2. Define store interface with:
   - `currentUser: User | null`
   - `setCurrentUser: (user: User) => void`
   - `clearUser: () => void`
3. Add localStorage persistence middleware
4. Create hook: `useCurrentUser()`

**Files to Create:**
- `lib/store/user-store.ts`

**Estimated Effort:** 30 minutes

---

### Story 1.5: Permission Utilities
**As a** developer  
**I want to** create permission checking utilities  
**So that** I can easily enforce role-based access control

**Acceptance Criteria:**
- [ ] Functions to check user permissions
- [ ] Role-based access rules defined
- [ ] Easy to use in components

**Technical Tasks:**
1. Create `lib/utils/permissions.ts`
2. Implement functions:
   - `canCreateReport(user: User): boolean`
   - `canEditReport(user: User, report: Report): boolean`
   - `canApproveReport(user: User): boolean`
   - `canViewReport(user: User, report: Report): boolean`
   - `canDeleteBiopsy(user: User): boolean`

**Files to Create:**
- `lib/utils/permissions.ts`

**Estimated Effort:** 30 minutes

---

### Story 1.6: Mock Storage Layer
**As a** developer  
**I want to** implement localStorage-based data persistence  
**So that** changes persist during the demo session

**Acceptance Criteria:**
- [ ] Data saves to localStorage
- [ ] Data loads with fallback to mock data
- [ ] Reset functionality to restore initial state
- [ ] Simulated API delays for realism

**Technical Tasks:**
1. Create `lib/utils/mock-storage.ts`
2. Implement CRUD operations for each entity
3. Add localStorage get/set wrappers

4. Create `lib/utils/mock-api.ts`
5. Add delay simulation (500ms default)
6. Wrap storage calls with async/await

**Files to Create:**
- `lib/utils/mock-storage.ts`
- `lib/utils/mock-api.ts`

**Estimated Effort:** 45 minutes

---

## Phase 2: Core Components (Day 1 - Afternoon to Day 2 - Morning)

### Story 2.1: UI Component Library
**As a** developer  
**I want to** create reusable UI components  
**So that** the interface is consistent and maintainable

**Acceptance Criteria:**
- [ ] Button component with variants (primary, secondary, danger)
- [ ] Card component for content containers
- [ ] Modal component for dialogs
- [ ] Badge component for status indicators
- [ ] All components properly typed and styled with Tailwind

**Technical Tasks:**
1. Create `app/components/ui/Button.tsx`
   - Variants: primary, secondary, danger, ghost
   - Sizes: sm, md, lg
   - Loading state

2. Create `app/components/ui/Card.tsx`
   - Header, body, footer sections
   - Optional padding variants

3. Create `app/components/ui/Modal.tsx`
   - Backdrop overlay
   - Close button
   - Escape key handling

4. Create `app/components/ui/Badge.tsx`
   - Color variants for different statuses
   - Size variants

**Files to Create:**
- `app/components/ui/Button.tsx`
- `app/components/ui/Card.tsx`
- `app/components/ui/Modal.tsx`
- `app/components/ui/Badge.tsx`

**Estimated Effort:** 1.5 hours

---

### Story 2.2: Status Badge Components
**As a** user  
**I want to** see visual indicators for biopsy and report statuses  
**So that** I can quickly understand the current state

**Acceptance Criteria:**
- [ ] Different colors for each status
- [ ] Readable labels
- [ ] Consistent styling across app

**Technical Tasks:**
1. Create `app/components/shared/StatusBadge.tsx`
2. Implement status-to-color mapping:
   - received → blue
   - in-analysis → yellow
   - report-drafted → purple
   - pending-approval → orange
   - approved → green
   - rejected → red
   - completed → gray

**Files to Create:**
- `app/components/shared/StatusBadge.tsx`

**Estimated Effort:** 30 minutes

---

### Story 2.3: Role Simulator Component
**As a** demo presenter  
**I want to** easily switch between user roles  
**So that** I can demonstrate different permission levels

**Acceptance Criteria:**
- [ ] Dropdown or toggle to select user
- [ ] Shows current user name and role
- [ ] Visible on all pages
- [ ] Updates immediately when changed

**Technical Tasks:**
1. Create `app/components/shared/RoleSimulator.tsx`
2. Display current user info
3. Dropdown with all mock users
4. Use Zustand store to update current user
5. Add visual role indicator (color-coded border)

**Files to Create:**
- `app/components/shared/RoleSimulator.tsx`

**Estimated Effort:** 45 minutes

---

### Story 2.4: Dashboard Layout
**As a** user  
**I want to** a consistent layout with navigation  
**So that** I can easily access different sections

**Acceptance Criteria:**
- [ ] Sidebar navigation with links
- [ ] Header with role simulator
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] Active route highlighting

**Technical Tasks:**
1. Create `app/(dashboard)/layout.tsx`
2. Add sidebar with navigation links:
   - Dashboard
   - Biopsies
   - Patients
   - Settings (admin only)
3. Add header with:
   - Logo/title
   - Role simulator
   - User info
4. Implement responsive menu for mobile

**Files to Create:**
- `app/(dashboard)/layout.tsx`

**Estimated Effort:** 1 hour

---

### Story 2.5: Biopsy List Component
**As a** user  
**I want to** view all biopsies in a list  
**So that** I can browse and select biopsies to work on

**Acceptance Criteria:**
- [ ] Displays all biopsies in table/card format
- [ ] Shows key information: lab code, patient, date, status
- [ ] Clickable rows navigate to detail page
- [ ] Responsive design

**Technical Tasks:**
1. Create `app/components/biopsies/BiopsyList.tsx`
2. Fetch biopsies from mock API
3. Display in responsive table/cards
4. Add loading state
5. Handle empty state

**Files to Create:**
- `app/components/biopsies/BiopsyList.tsx`

**Estimated Effort:** 1 hour

---

### Story 2.6: Biopsy Filters
**As a** user  
**I want to** filter biopsies by status and search  
**So that** I can quickly find specific biopsies

**Acceptance Criteria:**
- [ ] Filter by status (dropdown or tabs)
- [ ] Search by lab code or patient name
- [ ] Real-time filtering
- [ ] Clear filters button

**Technical Tasks:**
1. Create `app/components/biopsies/BiopsyFilters.tsx`
2. Add status filter dropdown/tabs
3. Add search input with debouncing
4. Emit filter changes to parent component
5. Show active filter count

**Files to Create:**
- `app/components/biopsies/BiopsyFilters.tsx`

**Estimated Effort:** 45 minutes

---

### Story 2.7: Biopsy Card Component
**As a** user  
**I want to** see biopsy information in a clear format  
**So that** I can quickly scan important details

**Acceptance Criteria:**
- [ ] Shows lab code, patient, date, status
- [ ] Visual status indicator
- [ ] Clickable to view details
- [ ] Responsive card layout

**Technical Tasks:**
1. Create `app/components/biopsies/BiopsyCard.tsx`
2. Display biopsy information
3. Add status badge
4. Add click handler for navigation
5. Style with Tailwind

**Files to Create:**
- `app/components/biopsies/BiopsyCard.tsx`

**Estimated Effort:** 30 minutes

---

## Phase 3: Main Features (Day 2 - Afternoon to Day 3 - Morning)

### Story 3.1: Biopsy List Page
**As a** user  
**I want to** access a page showing all biopsies  
**So that** I can manage my workload

**Acceptance Criteria:**
- [ ] Page displays biopsy list component
- [ ] Filters work correctly
- [ ] Search functionality works
- [ ] Navigation to details works
- [ ] Shows loading state while fetching

**Technical Tasks:**
1. Create `app/(dashboard)/biopsies/page.tsx`
2. Fetch biopsies from mock API
3. Integrate BiopsyList component
4. Integrate BiopsyFilters component
5. Add page header with title and stats
6. Implement filter and search logic

**Files to Create:**
- `app/(dashboard)/biopsies/page.tsx`

**Estimated Effort:** 1 hour

---

### Story 3.2: Biopsy Detail Page
**As a** user  
**I want to** view complete biopsy information  
**So that** I can see all details and associated reports

**Acceptance Criteria:**
- [ ] Displays all biopsy fields
- [ ] Shows patient information
- [ ] Lists associated reports
- [ ] Action buttons based on role
- [ ] "Create Report" button visible when appropriate

**Technical Tasks:**
1. Create `app/(dashboard)/biopsies/[id]/page.tsx`
2. Fetch biopsy by ID from mock API
3. Fetch patient information
4. Fetch associated reports
5. Create `app/components/biopsies/BiopsyDetail.tsx`
6. Display all information in organized sections
7. Add action buttons with permission checks
8. Add "Create Report" button

**Files to Create:**
- `app/(dashboard)/biopsies/[id]/page.tsx`
- `app/components/biopsies/BiopsyDetail.tsx`

**Estimated Effort:** 1.5 hours

---

### Story 3.3: Patient Info Component
**As a** user  
**I want to** see patient information clearly  
**So that** I can verify patient identity

**Acceptance Criteria:**
- [ ] Displays patient demographics
- [ ] Shows medical record number
- [ ] Formatted dates
- [ ] Privacy-conscious display

**Technical Tasks:**
1. Create `app/components/patients/PatientInfo.tsx`
2. Display patient name, MRN, DOB, gender
3. Format dates using date-fns
4. Add card/section styling

**Files to Create:**
- `app/components/patients/PatientInfo.tsx`

**Estimated Effort:** 30 minutes

---

### Story 3.4: Rich Text Report Editor
**As a** lab worker or doctor  
**I want to** create and edit reports with rich text formatting  
**So that** I can properly document findings

**Acceptance Criteria:**
- [ ] Rich text editor with formatting toolbar
- [ ] Sections: Findings, Diagnosis, Recommendations
- [ ] Auto-save to localStorage
- [ ] Save and Submit buttons
- [ ] Character counter (optional)

**Technical Tasks:**
1. Create `app/components/reports/ReportEditor.tsx`
2. Integrate TipTap editor
3. Configure extensions (bold, italic, lists, headings)
4. Create custom toolbar
5. Implement structured sections
6. Add auto-save functionality (every 30 seconds)
7. Add manual save and submit actions
8. Create `styles/editor.css` for custom styling

**Files to Create:**
- `app/components/reports/ReportEditor.tsx`
- `styles/editor.css`

**Estimated Effort:** 2 hours

---

### Story 3.5: Create Report Page
**As a** lab worker or doctor  
**I want to** create a new report for a biopsy  
**So that** I can document my findings

**Acceptance Criteria:**
- [ ] Editor loads with empty template
- [ ] Can save draft
- [ ] Can submit for approval
- [ ] Redirects after submission
- [ ] Shows confirmation message

**Technical Tasks:**
1. Create `app/(dashboard)/reports/new/page.tsx`
2. Accept biopsyId as query parameter
3. Integrate ReportEditor component
4. Implement save draft function
5. Implement submit for approval function
6. Update biopsy status after submission
7. Show success toast/message
8. Redirect to biopsy detail page

**Files to Create:**
- `app/(dashboard)/reports/new/page.tsx`

**Estimated Effort:** 1 hour

---

### Story 3.6: Report Viewer Component
**As a** user  
**I want to** view reports in a readable format  
**So that** I can review findings and diagnoses

**Acceptance Criteria:**
- [ ] Displays HTML content properly
- [ ] Shows report metadata (author, dates, status)
- [ ] Shows version history
- [ ] Read-only mode
- [ ] Permission-based edit button

**Technical Tasks:**
1. Create `app/components/reports/ReportViewer.tsx`
2. Render HTML content safely
3. Display metadata section
4. Show version history
5. Add edit button (permission-based)
6. Style with proper typography

**Files to Create:**
- `app/components/reports/ReportViewer.tsx`

**Estimated Effort:** 1 hour

---

### Story 3.7: Report View/Edit Page
**As a** user  
**I want to** view and optionally edit a report  
**So that** I can review or modify findings

**Acceptance Criteria:**
- [ ] Displays report content
- [ ] Edit mode for authorized users
- [ ] View-only mode for others
- [ ] Version history visible
- [ ] Back navigation

**Technical Tasks:**
1. Create `app/(dashboard)/reports/[id]/page.tsx`
2. Fetch report by ID from mock API
3. Check permissions to determine mode (view/edit)
4. Use ReportViewer for view mode
5. Use ReportEditor for edit mode
6. Implement mode toggle for approving doctors
7. Add navigation breadcrumbs

**Files to Create:**
- `app/(dashboard)/reports/[id]/page.tsx`

**Estimated Effort:** 1 hour

---

### Story 3.8: Report Approval Component
**As an** approving doctor  
**I want to** approve or reject reports  
**So that** I can control report finalization

**Acceptance Criteria:**
- [ ] Shows only to approving doctors
- [ ] Approve button with optional comments
- [ ] Reject button with required comments
- [ ] Confirmation dialog
- [ ] Updates report status immediately

**Technical Tasks:**
1. Create `app/components/reports/ReportApproval.tsx`
2. Show only when user has approval permission
3. Add approve button with comment textarea
4. Add reject button with required comment field
5. Show confirmation modal
6. Update report status via mock API
7. Update biopsy status
8. Show success message
9. Redirect after action

**Files to Create:**
- `app/components/reports/ReportApproval.tsx`

**Estimated Effort:** 1.5 hours

---

### Story 3.9: Patient History Page
**As a** user  
**I want to** view all biopsies for a patient  
**So that** I can see the complete medical history

**Acceptance Criteria:**
- [ ] Lists all biopsies for patient
- [ ] Chronological timeline view
- [ ] Click to view biopsy details
- [ ] Shows report status for each
- [ ] Patient info header

**Technical Tasks:**
1. Create `app/(dashboard)/patients/[id]/page.tsx`
2. Fetch patient by ID
3. Fetch all biopsies for patient
4. Create `app/components/patients/PatientTimeline.tsx`
5. Display biopsies in timeline format
6. Add navigation to biopsy details
7. Show patient info at top

**Files to Create:**
- `app/(dashboard)/patients/[id]/page.tsx`
- `app/components/patients/PatientTimeline.tsx`

**Estimated Effort:** 1.5 hours

---

## Phase 4: PDF & Polish (Day 3 - Afternoon)

### Story 4.1: PDF Template Component
**As a** developer  
**I want to** create a PDF template for reports  
**So that** reports can be exported professionally

**Acceptance Criteria:**
- [ ] Professional layout with header/footer
- [ ] Laboratory branding area
- [ ] Report content rendered properly
- [ ] Metadata displayed (dates, authors, approval)
- [ ] Digital signature placeholder

**Technical Tasks:**
1. Create `app/components/reports/ReportPDFTemplate.tsx`
2. Use @react-pdf/renderer components
3. Design header with logo and lab info
4. Design report content sections
5. Add footer with page numbers
6. Style with PDF-compatible styles
7. Add approval signature section

**Files to Create:**
- `app/components/reports/ReportPDFTemplate.tsx`

**Estimated Effort:** 1.5 hours

---

### Story 4.2: PDF Preview Component
**As a** user  
**I want to** preview reports as PDF before downloading  
**So that** I can verify the output

**Acceptance Criteria:**
- [ ] Renders PDF in browser
- [ ] Download button
- [ ] Email button (simulated)
- [ ] Print button
- [ ] Close/back navigation

**Technical Tasks:**
1. Create `app/components/reports/ReportPDFPreview.tsx`
2. Integrate react-pdf viewer
3. Generate PDF blob from template
4. Add download functionality
5. Add print functionality
6. Add simulated email button (shows toast)
7. Style viewer container

**Files to Create:**
- `app/components/reports/ReportPDFPreview.tsx`

**Estimated Effort:** 1 hour

---

### Story 4.3: PDF Preview Page
**As a** user  
**I want to** access a dedicated page for PDF preview  
**So that** I can view the full PDF

**Acceptance Criteria:**
- [ ] Full-screen PDF viewer
- [ ] Download and print buttons
- [ ] Back to report button
- [ ] Loading state

**Technical Tasks:**
1. Create `app/(dashboard)/reports/[id]/preview/page.tsx`
2. Fetch report data
3. Integrate ReportPDFPreview component
4. Add navigation controls
5. Handle loading and error states

**Files to Create:**
- `app/(dashboard)/reports/[id]/preview/page.tsx`

**Estimated Effort:** 30 minutes

---

### Story 4.4: Dashboard Home Page
**As a** user  
**I want to** see an overview dashboard  
**So that** I can quickly understand my workload

**Acceptance Criteria:**
- [ ] Statistics cards (total biopsies, pending, completed)
- [ ] Recent activity list
- [ ] Quick actions
- [ ] Role-specific content

**Technical Tasks:**
1. Create `app/(dashboard)/page.tsx`
2. Calculate statistics from mock data
3. Create stat cards component
4. List recent biopsies
5. Show pending approvals for approving doctors
6. Add quick action buttons
7. Make responsive

**Files to Create:**
- `app/(dashboard)/page.tsx`

**Estimated Effort:** 1 hour

---

### Story 4.5: Responsive Design Polish
**As a** user  
**I want to** use the app on any device  
**So that** I can work from desktop, tablet, or mobile

**Acceptance Criteria:**
- [ ] Mobile responsive (320px+)
- [ ] Tablet responsive (768px+)
- [ ] Desktop optimized (1024px+)
- [ ] Touch-friendly buttons on mobile
- [ ] Readable text on all screen sizes

**Technical Tasks:**
1. Review all components for responsive design
2. Adjust Tailwind breakpoints as needed
3. Test on mobile, tablet, desktop viewports
4. Add mobile menu for navigation
5. Optimize spacing and typography
6. Test touch interactions

**Files to Update:**
- All component files

**Estimated Effort:** 2 hours

---

### Story 4.6: Loading States & Transitions
**As a** user  
**I want to** see loading indicators and smooth transitions  
**So that** I understand when the app is processing

**Acceptance Criteria:**
- [ ] Loading spinners during data fetch
- [ ] Skeleton loaders for lists
- [ ] Smooth page transitions
- [ ] Button loading states

**Technical Tasks:**
1. Add loading states to all async operations
2. Create loading spinner component
3. Create skeleton loader components
4. Add transitions to page changes
5. Disable buttons during submission

**Files to Create:**
- `app/components/ui/Spinner.tsx`
- `app/components/ui/Skeleton.tsx`

**Estimated Effort:** 1 hour

---

### Story 4.7: Error Handling & Messages
**As a** user  
**I want to** see clear error messages and success confirmations  
**So that** I know when actions succeed or fail

**Acceptance Criteria:**
- [ ] Toast notifications for success/error
- [ ] Error boundaries for React errors
- [ ] Friendly error messages
- [ ] Form validation messages

**Technical Tasks:**
1. Install or create toast notification system
2. Create error boundary component
3. Add error handling to all API calls
4. Add success messages after actions
5. Create reusable alert component

**Files to Create:**
- `app/components/ui/Toast.tsx` or use library
- `app/components/ErrorBoundary.tsx`

**Estimated Effort:** 1 hour

---

### Story 4.8: Demo Data Reset Utility
**As a** demo presenter  
**I want to** reset data to initial state  
**So that** I can restart the demo cleanly

**Acceptance Criteria:**
- [ ] Button to reset all data
- [ ] Confirmation dialog before reset
- [ ] Returns to initial mock data
- [ ] Clears localStorage

**Technical Tasks:**
1. Add reset function to mock-storage.ts
2. Create reset button in settings or footer
3. Add confirmation modal
4. Clear localStorage and reload page
5. Add keyboard shortcut (optional)

**Files to Update:**
- `lib/utils/mock-storage.ts`
- Create reset button component or add to layout

**Estimated Effort:** 30 minutes

---

## Additional Stories (Optional Enhancements)

### Story E.1: Notifications Panel
**As a** user  
**I want to** see notifications about pending actions  
**So that** I don't miss important tasks

**Priority:** Low  
**Estimated Effort:** 1.5 hours

---

### Story E.2: Advanced Search
**As a** user  
**I want to** search across all fields  
**So that** I can find biopsies more easily

**Priority:** Low  
**Estimated Effort:** 1 hour

---

### Story E.3: Keyboard Shortcuts
**As a** power user  
**I want to** use keyboard shortcuts  
**So that** I can navigate faster

**Priority:** Low  
**Estimated Effort:** 1 hour

---

### Story E.4: Dark Mode
**As a** user  
**I want to** toggle dark mode  
**So that** I can reduce eye strain

**Priority:** Low  
**Estimated Effort:** 2 hours

---

## Story Completion Checklist

Use this checklist to track progress:

### Phase 1: Setup & Foundation
- [ ] Story 1.1: Dependencies installed
- [ ] Story 1.2: Mock data created
- [ ] Story 1.3: Types defined
- [ ] Story 1.4: State management setup
- [ ] Story 1.5: Permission utilities created
- [ ] Story 1.6: Mock storage layer implemented

### Phase 2: Core Components
- [ ] Story 2.1: UI components created
- [ ] Story 2.2: Status badges implemented
- [ ] Story 2.3: Role simulator built
- [ ] Story 2.4: Dashboard layout created
- [ ] Story 2.5: Biopsy list component
- [ ] Story 2.6: Biopsy filters working
- [ ] Story 2.7: Biopsy cards styled

### Phase 3: Main Features
- [ ] Story 3.1: Biopsy list page
- [ ] Story 3.2: Biopsy detail page
- [ ] Story 3.3: Patient info component
- [ ] Story 3.4: Report editor working
- [ ] Story 3.5: Create report page
- [ ] Story 3.6: Report viewer component
- [ ] Story 3.7: Report view/edit page
- [ ] Story 3.8: Approval workflow
- [ ] Story 3.9: Patient history page

### Phase 4: PDF & Polish
- [ ] Story 4.1: PDF template created
- [ ] Story 4.2: PDF preview component
- [ ] Story 4.3: PDF preview page
- [ ] Story 4.4: Dashboard home page
- [ ] Story 4.5: Responsive design complete
- [ ] Story 4.6: Loading states added
- [ ] Story 4.7: Error handling implemented
- [ ] Story 4.8: Demo reset utility

---

## Testing Scenarios

After completing all stories, test these scenarios:

### Scenario 1: Lab Worker Flow
1. Login as Lab Worker
2. View biopsy list
3. Click on "received" status biopsy
4. Create new report
5. Write findings, diagnosis, recommendations
6. Save draft
7. Submit for approval
8. Verify cannot approve own report

### Scenario 2: Approving Doctor Flow
1. Login as Approving Doctor
2. See notification for pending approval
3. Open pending report
4. Review content
5. Make edits to improve clarity
6. Add approval comments
7. Approve report
8. Verify report is locked

### Scenario 3: Patient History Flow
1. Login as any user
2. Navigate to patient history
3. View all biopsies for patient
4. Click on historical biopsy
5. View approved report
6. Preview PDF
7. Download PDF

### Scenario 4: Role Permission Flow
1. Login as Lab Worker
2. Verify cannot see admin settings
3. Verify cannot approve reports
4. Switch to Approving Doctor
5. Verify can approve reports
6. Verify can edit any report during approval

---

## Definition of Done

A story is considered complete when:
- [ ] All acceptance criteria met
- [ ] All technical tasks completed
- [ ] Component is responsive
- [ ] TypeScript has no errors
- [ ] Manual testing passed
- [ ] Integrated with existing code
- [ ] No console errors
- [ ] Code is formatted and clean

---

**Document Version:** 1.0  
**Last Updated:** January 5, 2026  
**Status:** Ready for Development
