# Implementation Plan: Strict UI Preservation, Table-Based Management, and Onboarding Functionality

This plan details the functional integration of the complete clinic setup, doctor onboarding, table-based patient management, and testing utilities in the Contingent Health Platform, strictly adhering to the provided designs and user instructions.

---

## User Answers & Constraints Summary
- **Patient Details Presentation**: Slide-over drawer on the right side when clicking any table row (keeping the main table overview compact and clean until forthcoming patient detail reference designs are provided).
- **Onboarding Entry Point**: Replace the "Run Clinical Journey" / "Simulate Core Journey" button in the top navigation header (`OperationsTopNav`) with a primary **"Clinic Setup & Onboarding"** button that seamlessly opens and navigates through the setup flows.
- **"Fill with Demo Data" Placement**: Positioned beside the form submit button at the bottom of all onboarding and configuration forms for convenient testing.
- **Design Directive**: Strict UI preservation—maintain all existing tokens, fonts, spacing, layouts, and component patterns without unauthorized redesigns.

---

## 1. Table-Based Patient Management (`ViewPatients.tsx`)

### Problem
The current view uses a side-by-side list-and-detail layout that crowds the screen. The user directive requires replacing this with a structured, searchable, filterable, sortable, and actionable table with an on-demand slide-over drawer.

### Implementation Details
- **High-Density Table View**:
  - Columns:
    - **Patient**: Avatar, Full Name, National ID / Patient MRN
    - **Demographics**: Age, Sex, Blood Type
    - **Affiliated Attending**: Doctor Name, Department
    - **Relationship**: Tier (Active Regular, VIP Care, Chronic Care, New Patient)
    - **Active Balance / Co-Pay**: Tabular numeric currency (`font-mono`)
    - **Clinical Status**: Status badge (`Waiting Room`, `In Consultation`, `Active`, `Inactive`)
    - **Quick Actions**: "Start Encounter", "Open Drawer"
- **Table Controls**:
  - Real-time search query across name, MRN, phone, national ID, and affiliated doctor.
  - Status filter tabs: `All`, `Waiting Room`, `In Consultation`, `Active`, `VIP Care`.
  - Sort by Name, Age, Last Visit, and Balance.
  - Pagination controls (10 records per page) with record count summary.
- **Slide-Over Detail Drawer (Right Side)**:
  - Opens smoothly from the right side upon row click.
  - Shows patient summary, clinical alerts, allergies, chronic conditions, active prescriptions, and recent encounter timeline.
  - Includes a direct "Start Consultation" CTA and a clean close button.
  - Preserves clean boundaries for future modal/detail updates.

---

## 2. Clinic Registration & Branding Onboarding Flow (PDF 1)

### Visual Source of Truth
PDF 1: 6-step Clinic Registration ("Register your clinic") with left-right split screen layouts.

### Implementation Details (`ClinicRegistrationModal.tsx` / `ViewClinicRegistration.tsx`)
1. **Hero / Entry Screen**:
   - Healthcare provider hero photography with headline *"Register your clinic"*, description, and *"Register Your Facility"* CTA.
2. **Step 1 of 6 — Admin Account**:
   - Fields: Full Name, Work Email (`admin@contingentmedical.com`), Phone Number (`+251 91 234 5678`), Password, Confirm Password, Terms Agreement checkbox.
   - Role clarification callout: *"Clinic Administrator / Authorized Representative"*.
   - Bottom actions: "Fill with Demo Data" button + "Continue".
3. **Step 2 of 6 — Branding & Theme Generator**:
   - Logo upload simulator.
   - Dynamic Brand Theme Generator: Extracting Primary `#0e162b`, Accent `#00c0fe`, Surface `#f8f9fc`, Neutral `#e8e8e8`.
   - Live Dashboard Preview card demonstrating theme on buttons and status badges.
   - Action: "Use this Theme" / "Continue".
4. **Step 3 of 6 — Clinic Info**:
   - Fields: Clinic Name, Clinic Type (`General Clinic`), Category, Short Description, Full Description, Phone, Email, Website.
   - "Fill with Demo Data" button + "Continue".
5. **Step 4 of 6 — Location & Mapping**:
   - City (`Addis Ababa`), Area/Neighborhood (`Bole`), Building/Unit (`4th floor, Moringa Bdg`).
   - Interactive map pin coordinate display: `207-112 Taitu Street, Addis Ababa, Ethiopia`.
6. **Step 5 of 6 — Business Hours**:
   - Opening Type (`Custom`), operating hours matrix for Monday through Sunday (Opening Time & Closing Time dropdowns).
7. **Step 6 of 6 — Clinic Verification**:
   - Legal clinic name, registration number (`ET-CLINIC-88213`), authorized representative name.
   - File upload dropzones: Facility License Document (PDF/DOCX max 10MB) and Supporting Documents.
   - Notice: *"The platform owns credential verification. Clinics cannot mark themselves or doctors as verified."*
   - Submission state and confirmation.

---

## 3. Clinic Setup Readiness Checklist & Publishing (PDF 2)

### Implementation Details (`ClinicSetupPublishingModal.tsx`)
- **Setup Progress Header**:
  - Three summary progress cards:
    1. **Clinic Profile** (`Completed`, with "Edit Information")
    2. **Affiliated Doctors** (`2 doctors affiliated · 1 pending`, with "+ Add Doctors" & "Manage Doctors")
    3. **Services** (`2 active · 1 draft`, with "+ Add Service" & "Manage Service")
- **Readiness Checklist**:
  - Itemized verification status items: Clinic Information, Logo & Branding, Location, Operating Hours, Organizational Documents, Doctors Affiliated, Services Created, Doctors Assigned to Services.
  - Interactive "Save as Draft" and "Publish Clinic" buttons.
- **"Your clinic is now live" Confirmation Modal**:
  - Live celebration illustration.
  - Public listing URL: `contingent.health/clinics/st-gabriel-medical` (with copy icon).
  - Summary metrics: 3 Active Doctors, 2 Services Bookable.
  - Action buttons: "Close" and "Go to clinic dashboard".

---

## 4. Doctor Onboarding, Search, Affiliation & Services (PDF 3)

### Implementation Details
1. **Doctors Management View**:
   - Displays affiliated physicians with credentials, departments, branches, and assigned services:
     - *Dr. Hana Tesfaye* (Verified · Internal Medicine · AAU Fellow · 12 yrs exp).
     - *Dr. Dawit Bekele* (Verified · Pediatrics · Gondar Univ · 9 yrs exp).
   - "Important Doctor Verification Rule" callout banner.
   - Actions: "Assign Department & Services", "Remove", and primary **"+ Add Doctor"**.
2. **Find a Doctor Modal**:
   - Search across verified physicians on Contingent Platform by name, specialty, license, or credential ID.
   - Physician cards with verification badges, academic backgrounds, and dynamic affiliation states:
     - `Already Affiliated` (disabled state).
     - `Pending Acceptance` (in-review state).
     - `Add to Clinic` (initiates affiliation request).
   - **"+ Add New Doctor"** button triggering full doctor registration.
3. **Multi-Step Doctor Onboarding Workflow**:
   - **Step 1: Account Setup**: Full Legal Name, Professional Email, Mobile Phone, Password, Confirm Password.
   - **Step 2: Professional Medical Profile**: Photo upload, Medical Specialty (`Cardiology`), Sub-Specialty, Medical License/Registration Number (`CA MED-G84902`), Years of Experience, Professional Degree & Title (`MD, FACC`), Consultation Languages, Short Professional Bio.
   - **Step 3: Credential Verification**: Medical license upload, government ID upload, supporting credentials. Option: *"Continue Independently"*.
   - **Step 4: Configure Doctor Assignments**: Clinic Department, Branch (`Main Bole Branch`), and associated clinic service checkboxes.
   - **Step 5: Send Affiliation Request Modal**: Summary of doctor specialty, credential status, and mutual confirmation notice before submission.
4. **Clinic Services Management & "Create Clinic Service" Modal**:
   - Table of clinic services: Service Name, Department, Duration & Fee (ETB), Assigned Doctors count, Branch, Status (`Active` / `Draft`), Actions (`Edit`, `Remove`).
   - "Create Clinic Service" modal: Service Name, Category, Department, Duration, Price in ETB, Description, and physician link checkboxes.

---

## 5. "Fill with Demo Data" Utility

### Architecture
- Reusable helper function `fillDemoData(formType, setFormData)` that populates complete, realistic, internally consistent medical and facility records.
- Prominently placed at the bottom beside the form submit button across:
  - Clinic Registration (Admin Account, Clinic Info, Location, Hours, Verification).
  - Doctor Registration (Account, Medical Profile, Credentials, Assignments).
  - Clinic Service Creation.
- Pre-fills all required inputs without auto-submitting, allowing the user to review or edit fields before advancing.

---

## 6. Top Navigation & Global Integration (`OperationsTopNav.tsx`)

- Replace the "Simulate Core Journey" button in `OperationsTopNav` with a **"Clinic Setup & Onboarding"** button.
- Clicking the button launches the interactive Setup & Onboarding modal hub, allowing the user to experience either the full 6-step Clinic Registration, the Readiness Checklist & Publishing, or the Doctor Affiliation workflows.
- Successfully completed registrations and affiliations persist in state (`ClinicOperationsContext.tsx`) and immediately reflect in the Doctors roster, Services table, and Audit trail.

---

## Verification Plan
1. **Compilation & Linting**: Run `compile_applet` and `lint_applet` to ensure zero build errors or TypeScript mismatches.
2. **Table-Based Patient Management**:
   - Verify search, filtering, and sorting work correctly.
   - Verify clicking any row opens the slide-over drawer on the right side without layout shifts.
3. **Clinic Registration Flow**:
   - Test steps 1 through 6 end-to-end.
   - Verify "Fill with Demo Data" populates each screen accurately.
4. **Clinic Setup Checklist & Live Modal**:
   - Verify checklist badges and "Publish Clinic" opens the live confirmation dialog.
5. **Doctor Onboarding & Affiliation Flow**:
   - Test "Find a Doctor" search and "Add to Clinic" affiliation requests.
   - Test "+ Add New Doctor" multi-step flow with demo data autofill.
   - Verify newly affiliated doctors appear in the Doctors directory.
6. **Clinic Services Flow**:
   - Test "Create Clinic Service" modal and service table updates.
