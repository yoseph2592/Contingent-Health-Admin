# Maternal Tracking (ANC) Integration — Implementation Plan

Integrate the longitudinal Antenatal Care (ANC) and Maternal Tracking workflow directly into the existing Contingent Health Platform doctor's dashboard, strictly preserving its visual language, navigation hierarchy, data context, and cross-clinic record-sharing permissions.

## User Review & Critical Decisions

- **Workspace Presentation**: Selecting an enrolled mother from the Maternal Tracking table opens a **full-width tabbed clinical workspace with a back button** to return to the patient list, providing dedicated horizontal space for dense longitudinal records while staying inside the existing dashboard shell.
- **Longitudinal Contents-of-Care Structure**: The 8-contact reference ANC schedule (~12, 20, 26, 30, 34, 36, 38, and 40 weeks, plus custom visits) is rendered as a **summary matrix table that opens a structured modal per contact visit** for full clinical documentation and review.
- **Navigation Placement**: Added as **Maternal Tracking** under **Clinical Operations right below Patients** in the existing left sidebar, maintaining identical active/inactive states, typography, and role-based permissions.
- **Doctor-Controlled Risk & Follow-Up Rules**: Risk classification across Obstetric History, Current Pregnancy, and General Medical History supports explicit physician determination rather than opaque auto-escalation, and follow-up intervals remain configurable by the attending practitioner.

---

## 1. Overview & Core Concept

The Maternal Tracking module extends the Contingent Health Platform's clinical operations to support structured antenatal care from initial ANC registration through delivery readiness:

- **Maternal Registry Table**: Searchable, filterable roster of mothers enrolled in antenatal care showing ANC Registration Number, Gestational Age (weeks + days), EDD, Gravida/Para, Risk Classification status, Next Scheduled Contact, and quick actions.
- **Full-Width Maternal Clinical Workspace**: Clicking any enrolled patient transitions the view to a structured workspace with a clear patient header (ANC ID, LMP, EDD, Gravida/Para, Blood Group, Risk Badge, Back to Registry button) and six clinical tabs:
  1. **ANC Registration & Profile**: Captures and edits core pregnancy metadata (ANC Registration Number, LMP, EDD, Gravida, Para, Living Children, Marital Status, Affiliated Attending).
  2. **Risk Classification & Assessment**: Structured evaluation checklist across *Obstetric History*, *Current Pregnancy*, and *General Medical History* plus physical exam and counselling items, with doctor-signed risk classification (`Routine ANC` vs. `Specialized / High-Risk Care`) and clinical rationale.
  3. **Contents-of-Care Chart (8-Contact Matrix)**: High-density longitudinal matrix spanning the 8 reference contacts (and custom visits) across clinical categories. Clicking any contact column or "Record Contact" opens the **ANC Contact Visit Modal** covering complaints, physical exam (weight, BP, pallor, jaundice, edema, fundal height, fetal heart rate, presentation), ultrasound/lab investigations, medications/vaccines, danger signs, counselling, and next contact date.
  4. **Investigations & Medications**: Tracks antenatal lab requests, ultrasound findings, iron/folate supplementation, tetanus toxoid vaccination status, and distinguishes **prescribed treatments** from **patient-reported adherence**.
  5. **Follow-Up & Appointments**: Doctor-controlled follow-up scheduler supporting monthly, bi-weekly, weekly, twice-weekly, or custom intervals, highlighting upcoming and overdue contacts and syncing with the platform's appointment calendar.
  6. **Cross-Clinic Shared Records**: Integrates with the platform's existing external record-sharing and patient-consent workflow so doctors can request access to or view authorized maternal encounters from partner facilities.

---

## 2. User Experience & Visual Design

All screens strictly reuse the approved Contingent Health Platform design system:

- **Color Palette & Surfaces**:
  - Primary Ink & Active Headers: `#0e162b`
  - Clinical Cyan Accent: `#00c0fe`
  - Clinical Emerald (Authorized / Normal / Routine): `#1fc16b`
  - Amber Warning (Pending Review / Overdue Contact): `#f59e0b`
  - Coral Alert (High-Risk / Danger Sign): `#ef4444`
  - Canvas & Borders: `#f0f2f5` workspace background, `#ffffff` cards with `border-[#e8e8e8]` and `rounded-2xl` geometry.
- **Typography**:
  - Display & Section Headers: `Stack Sans` / `Fira Sans` bold with tight tracking.
  - Clinical Data & Tabular Metrics (Gestational Age, BP, Weight, FHR, Dates): Monospace/tabular numerals for rapid clinical scanning.
- **Progressive Disclosure**:
  - The Maternal Registry Table stays concise; detailed obstetric history, risk checklists, and 8-contact clinical matrices appear only inside the patient's maternal workspace and contact modals.

---

## 3. Key Product Decisions & Trade-Offs

- **Matrix Table + Modal vs. Giant Inline Spreadsheet**: Rendering a summary matrix table for the 8 ANC contacts and opening a structured modal per contact prevents horizontal overflow while preserving every clinical category from the reference ANC chart.
- **Explicit Physician Risk Determination**: Checkboxes in the Risk Assessment tab highlight flagged indicators visually, while the final risk classification and care pathway require explicit doctor confirmation and clinical notes.
- **Unified State Sync**: Recording a new ANC contact, ordering a lab investigation, prescribing antenatal supplements, or scheduling a follow-up in the Maternal Tracking workspace directly updates the shared `ClinicOperationsContext` so Appointments, Lab Requests, Prescriptions, and Patient timelines stay synchronized.

---

## 4. Technical Architecture & Data Strategy

```
+-----------------------------------------------------------------------+
|                     ClinicOperationsPlatform Shell                    |
|  +-----------------------+  +--------------------------------------+  |
|  | OperationsSidebar     |  | ViewMaternalTracking                 |  |
|  | - Overview            |  |  +-- Maternal Registry Table         |  |
|  | - Patients            |  |  +-- Full-Width Maternal Workspace   |  |
|  | - Maternal Tracking <-|  |       |-- 1. ANC Registration & Info |  |
|  | - Appointments        |  |       |-- 2. Risk Classification     |  |
|  | - Prescriptions       |  |       |-- 3. 8-Contact Matrix Table  |  |
|  | - Lab Requests        |  |       |      +-- Contact Visit Modal |  |
|  +-----------------------+  |       |-- 4. Labs & Med Adherence    |  |
|                             |       |-- 5. Follow-Up Scheduler     |  |
|                             |       +-- 6. Shared Maternal Records |  |
|                             +--------------------------------------+  |
+-----------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------+
|                        ClinicOperationsContext                        |
|  - maternalRecords (ANC registration, risk factors, 8-contact visits) |
|  - Synced with: patients, appointments, labRequests, prescriptions,   |
|    externalEncounters, and RequestRecordAccessModal                   |
+-----------------------------------------------------------------------+
```

- **State & Persistence Strategy**:
  - Extend `ClinicOperationsContext` with strongly typed `MaternalRecord` objects linked by `patientId` to existing female patients in the platform, persisted in `localStorage` alongside existing clinical operations state.
  - Connect cross-clinic maternal encounters directly to the existing `externalEncounters` and `openRequestAccessModal` authorization flow, ensuring minimum-necessary scope selection and patient consent rules are enforced uniformly.
