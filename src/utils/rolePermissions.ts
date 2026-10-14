import type { ComponentType } from 'react';
import { UserRole, OperationalTab } from '../types/operations';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  UserCheck,
  FileText,
  Pill,
  FlaskConical,
  Share2,
  FolderLock,
  Wallet,
  TrendingUp,
  ReceiptText,
  FileSignature,
  Bell,
  BarChart3,
  Settings,
  ShieldAlert,
  History,
  CheckCircle2,
  ClipboardList,
  UserPlus,
  CreditCard,
  Building,
  CheckSquare,
  AlertTriangle,
  Scale,
  Activity,
  ShieldCheck,
} from 'lucide-react';

export interface RoleNavItem {
  id: OperationalTab;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badgeKey?: 'appointments' | 'claims' | 'labs' | 'notifications' | 'tasks' | 'unverified';
}

export interface RoleDefinition {
  role: UserRole;
  defaultTab: OperationalTab;
  title: string;
  subtitle: string;
  navItems: RoleNavItem[];
  allowedTabs: OperationalTab[];
  canViewClinicalNotes: boolean;
  canViewFinancials: boolean;
  canViewAdminSettings: boolean;
  canManageContracts: boolean;
  canSignPrescriptions: boolean;
  canDiagnose: boolean;
  canCheckIn: boolean;
  canManageClaims: boolean;
  // Granular permissions for financial, claims, and leadership segregation:
  canIssueRefunds?: boolean;
  canSubmitClaims?: boolean;
  canApproveClaims?: boolean;
  canExportFinancials?: boolean;
  canManageOwnership?: boolean; // Clinic Owner specific (equity distributions, capital governance)
  canManageOperations?: boolean; // Executive Director specific (departmental SLAs, operational throughput)
  canEnforceClinicalStandards?: boolean; // Medical Director specific (physician credentialing, clinical quality audits)
  primaryAction: {
    label: string;
    actionKey: string;
  };
}

export const CORE_ROLES: UserRole[] = [
  'Clinic Owner',
  'Executive Director / Clinic Director',
  'Clinic Administrator',
  'Medical Director',
  'Doctor',
  'Nurse',
  'Receptionist',
  'Finance & Claims Officer',
];

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  // 1. CLINIC OWNER (Ownership interests, capital allocation, equity splits, major clinic decisions)
  'Clinic Owner': {
    role: 'Clinic Owner',
    defaultTab: 'overview',
    title: 'Clinic Command & Ownership Center',
    subtitle: 'Ownership interests, capital distributions, partner equity, and strategic governance',
    allowedTabs: [
      'overview',
      'patients',
      'appointments',
      'encounter',
      'doctors',
      'staff',
      'admin',
      'wallet',
      'revenue',
      'claims',
      'contracts',
      'reports',
      'settings',
      'audit',
      'documents',
      'notifications',
    ],
    navItems: [
      { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
      { id: 'wallet', label: 'Capital & Payments', icon: Wallet },
      { id: 'revenue', label: 'Financial Performance', icon: TrendingUp },
      { id: 'contracts', label: 'Partner Contracts', icon: FileSignature },
      { id: 'reports', label: 'Executive Analytics', icon: BarChart3 },
      { id: 'admin', label: 'Clinic Profile', icon: Building },
      { id: 'audit', label: 'Governance Audit', icon: History },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    canViewClinicalNotes: false, // Clinical privacy: executive/ownership does not read private clinical SOAP
    canViewFinancials: true,
    canViewAdminSettings: true,
    canManageContracts: true,
    canSignPrescriptions: false, // Not a doctor
    canDiagnose: false,
    canCheckIn: false,
    canManageClaims: true,
    canIssueRefunds: true,
    canSubmitClaims: false,
    canApproveClaims: true,
    canExportFinancials: true,
    canManageOwnership: true,
    canManageOperations: false,
    canEnforceClinicalStandards: false,
    primaryAction: {
      label: 'Review Capital & Equity',
      actionKey: 'review_capital',
    },
  },

  // 2. EXECUTIVE DIRECTOR / CLINIC DIRECTOR (Manages organizational performance & operational execution)
  'Executive Director / Clinic Director': {
    role: 'Executive Director / Clinic Director',
    defaultTab: 'overview',
    title: 'Executive Operations & Performance',
    subtitle: 'Organizational throughput, departmental SLAs, staffing capacity, and operational execution',
    allowedTabs: [
      'overview',
      'patients',
      'appointments',
      'doctors',
      'staff',
      'admin',
      'revenue',
      'claims',
      'reports',
      'settings',
      'audit',
      'documents',
      'notifications',
    ],
    navItems: [
      { id: 'overview', label: 'Executive Operations', icon: LayoutDashboard },
      { id: 'appointments', label: 'Clinic Schedule', icon: Calendar, badgeKey: 'appointments' },
      { id: 'doctors', label: 'Staffing & Rosters', icon: UserCheck },
      { id: 'reports', label: 'SLA Analytics', icon: BarChart3 },
      { id: 'revenue', label: 'Budget & Variance', icon: TrendingUp },
      { id: 'admin', label: 'Facility Profile', icon: Building },
      { id: 'audit', label: 'Operational Audit', icon: History },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    canViewClinicalNotes: false, // Clinical decision-making authority must NOT be granted solely by executive title
    canViewFinancials: true,
    canViewAdminSettings: true,
    canManageContracts: true,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: false,
    canManageClaims: false,
    canIssueRefunds: false,
    canSubmitClaims: false,
    canApproveClaims: false,
    canExportFinancials: true,
    canManageOwnership: false, // Owner manages ownership
    canManageOperations: true,
    canEnforceClinicalStandards: false, // Medical Director manages medical standards
    primaryAction: {
      label: 'Evaluate Department SLAs',
      actionKey: 'evaluate_slas',
    },
  },

  // 3. CLINIC ADMINISTRATOR (Day-to-day system & clinic configuration tasks)
  'Clinic Administrator': {
    role: 'Clinic Administrator',
    defaultTab: 'overview',
    title: "Today's Clinic Operations",
    subtitle: 'System configuration, room schedules, facility logistics, hardware, and staff rostering',
    allowedTabs: [
      'overview',
      'patients',
      'appointments',
      'encounter',
      'prescriptions',
      'diagnostics',
      'referrals',
      'doctors',
      'documents',
      'claims',
      'wallet',
      'staff',
      'admin',
      'reports',
      'settings',
      'audit',
      'onboarding',
      'patient-sync',
      'tasks',
      'notifications',
    ],
    navItems: [
      { id: 'overview', label: 'Admin Overview', icon: LayoutDashboard },
      { id: 'appointments', label: 'Appointments', icon: Calendar, badgeKey: 'appointments' },
      { id: 'patients', label: 'Patients', icon: Users },
      { id: 'doctors', label: 'Doctor Roster', icon: UserCheck },
      { id: 'admin', label: 'Facility Settings', icon: Building },
      { id: 'settings', label: 'System Config', icon: Settings },
      { id: 'audit', label: 'Audit Trail', icon: History },
    ],
    canViewClinicalNotes: true,
    canViewFinancials: true,
    canViewAdminSettings: true,
    canManageContracts: true,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: true,
    canManageClaims: true,
    canIssueRefunds: false,
    canSubmitClaims: false,
    canApproveClaims: false,
    canExportFinancials: true,
    canManageOwnership: false,
    canManageOperations: false,
    canEnforceClinicalStandards: false,
    primaryAction: {
      label: 'Configure Clinic Settings',
      actionKey: 'configure_settings',
    },
  },

  // 4. MEDICAL DIRECTOR (Oversees clinical standards, physician credentialing & medical quality)
  'Medical Director': {
    role: 'Medical Director',
    defaultTab: 'overview',
    title: 'Clinical Oversight & Quality Assurance',
    subtitle: 'Physician credentialing, clinical peer review, protocol compliance, and medical outcomes',
    allowedTabs: [
      'overview',
      'doctors',
      'patients',
      'appointments',
      'encounter',
      'prescriptions',
      'diagnostics',
      'reports',
      'audit',
      'documents',
    ],
    navItems: [
      { id: 'overview', label: 'Clinical Overview', icon: LayoutDashboard },
      { id: 'doctors', label: 'Doctor Credentialing', icon: UserCheck },
      { id: 'patients', label: 'Clinical Records', icon: Users },
      { id: 'diagnostics', label: 'Diagnostic Quality', icon: FlaskConical },
      { id: 'reports', label: 'Medical Audit Reports', icon: BarChart3 },
      { id: 'audit', label: 'Peer Review Trail', icon: History },
    ],
    canViewClinicalNotes: true,
    canViewFinancials: false,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: true,
    canDiagnose: true,
    canCheckIn: false,
    canManageClaims: false,
    canIssueRefunds: false,
    canSubmitClaims: false,
    canApproveClaims: false,
    canExportFinancials: false,
    canManageOwnership: false,
    canManageOperations: false,
    canEnforceClinicalStandards: true,
    primaryAction: {
      label: 'Audit Clinical Quality',
      actionKey: 'audit_clinical_quality',
    },
  },

  // 5. DOCTOR (Clinical consultations, patient exams, SOAP notes, prescriptions)
  'Doctor': {
    role: 'Doctor',
    defaultTab: 'overview',
    title: 'My Day · Clinical Workspace',
    subtitle: 'Active appointments, consultations, diagnostic reviews, and patient orders',
    allowedTabs: [
      'overview',
      'patients',
      'appointments',
      'encounter',
      'prescriptions',
      'diagnostics',
      'referrals',
      'documents',
      'tasks',
    ],
    navItems: [
      { id: 'overview', label: 'My Day', icon: LayoutDashboard, badgeKey: 'appointments' },
      { id: 'encounter', label: 'Active Consultation', icon: Stethoscope },
      { id: 'patients', label: 'Patients', icon: Users },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
      { id: 'diagnostics', label: 'Diagnostic Orders', icon: FlaskConical, badgeKey: 'labs' },
      { id: 'referrals', label: 'Referrals', icon: Share2 },
    ],
    canViewClinicalNotes: true,
    canViewFinancials: false,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: true,
    canDiagnose: true,
    canCheckIn: false,
    canManageClaims: false,
    canIssueRefunds: false,
    canSubmitClaims: false,
    canApproveClaims: false,
    canExportFinancials: false,
    canManageOwnership: false,
    canManageOperations: false,
    canEnforceClinicalStandards: false,
    primaryAction: {
      label: 'Start Consultation',
      actionKey: 'start_consultation',
    },
  },

  // 6. NURSE (Patient preparation queue, triage vitals, pre-consultation nursing)
  'Nurse': {
    role: 'Nurse',
    defaultTab: 'overview',
    title: 'Patient Preparation Queue',
    subtitle: 'Triage vitals, pre-consultation notes, and patient check-ins',
    allowedTabs: [
      'overview',
      'patients',
      'appointments',
      'diagnostics',
      'documents',
      'tasks',
    ],
    navItems: [
      { id: 'overview', label: 'Preparation Queue', icon: LayoutDashboard, badgeKey: 'appointments' },
      { id: 'patients', label: 'Patients', icon: Users },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'diagnostics', label: 'Lab Specimens', icon: FlaskConical, badgeKey: 'labs' },
      { id: 'documents', label: 'Documents', icon: FolderLock },
    ],
    canViewClinicalNotes: true,
    canViewFinancials: false,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: true,
    canManageClaims: false,
    canIssueRefunds: false,
    canSubmitClaims: false,
    canApproveClaims: false,
    canExportFinancials: false,
    canManageOwnership: false,
    canManageOperations: false,
    canEnforceClinicalStandards: false,
    primaryAction: {
      label: 'Record Vitals',
      actionKey: 'record_vitals',
    },
  },

  // 7. RECEPTIONIST (Patient arrivals, desk flow, check-in, registration)
  'Receptionist': {
    role: 'Receptionist',
    defaultTab: 'overview',
    title: "Today's Patient Queue",
    subtitle: 'Patient arrivals, registration, appointment check-ins, and desk flow',
    allowedTabs: [
      'overview',
      'appointments',
      'patients',
      'check-in',
    ],
    navItems: [
      { id: 'overview', label: 'Front Desk Queue', icon: LayoutDashboard },
      { id: 'appointments', label: 'Appointments', icon: Calendar, badgeKey: 'appointments' },
      { id: 'patients', label: 'Patient Registration', icon: Users },
    ],
    canViewClinicalNotes: false,
    canViewFinancials: false,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: true,
    canManageClaims: false,
    canIssueRefunds: false,
    canSubmitClaims: false,
    canApproveClaims: false,
    canExportFinancials: false,
    canManageOwnership: false,
    canManageOperations: false,
    canEnforceClinicalStandards: false,
    primaryAction: {
      label: 'Check In Patient',
      actionKey: 'checkin_patient',
    },
  },

  // 8. FINANCE & CLAIMS OFFICER (Merged Finance Officer + Claims Officer)
  'Finance & Claims Officer': {
    role: 'Finance & Claims Officer',
    defaultTab: 'overview',
    title: 'Finance & Claims Operations',
    subtitle: 'Unified billing, disbursements, insurance adjudication, ledger reconciliation & reports',
    allowedTabs: [
      'overview',
      'wallet',
      'revenue',
      'claims',
      'contracts',
      'reports',
      'documents',
    ],
    navItems: [
      { id: 'overview', label: 'Finance & Claims', icon: LayoutDashboard },
      { id: 'wallet', label: 'Payments & Wallet', icon: Wallet },
      { id: 'claims', label: 'Claims Adjudication', icon: ReceiptText, badgeKey: 'claims' },
      { id: 'revenue', label: 'Revenue Ledger', icon: TrendingUp },
      { id: 'contracts', label: 'Provider Splits', icon: FileSignature },
      { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
    ],
    canViewClinicalNotes: false, // Access to supporting documents only
    canViewFinancials: true,
    canViewAdminSettings: false,
    canManageContracts: true,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: false,
    canManageClaims: true,
    canIssueRefunds: true,
    canSubmitClaims: true,
    canApproveClaims: true,
    canExportFinancials: true,
    canManageOwnership: false,
    canManageOperations: false,
    canEnforceClinicalStandards: false,
    primaryAction: {
      label: 'Reconcile Ledger',
      actionKey: 'reconcile_ledger',
    },
  },

  // OPTIONAL SPECIALIST PROFILES (Retained for workflows or backwards compatibility)
  'Finance Officer': {
    role: 'Finance Officer',
    defaultTab: 'overview',
    title: 'Financial Operations & Wallet',
    subtitle: 'Escrow collections, payment reconciliations, doctor splits, and settlements',
    allowedTabs: ['overview', 'wallet', 'revenue', 'claims', 'contracts', 'reports'],
    navItems: [
      { id: 'overview', label: 'Finance & Claims', icon: LayoutDashboard },
      { id: 'wallet', label: 'Wallet & Ledger', icon: Wallet },
      { id: 'revenue', label: 'Revenue', icon: TrendingUp },
      { id: 'claims', label: 'Claims Settlement', icon: ReceiptText, badgeKey: 'claims' },
      { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
    ],
    canViewClinicalNotes: false,
    canViewFinancials: true,
    canViewAdminSettings: false,
    canManageContracts: true,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: false,
    canManageClaims: true,
    canIssueRefunds: true,
    canSubmitClaims: false,
    canApproveClaims: false,
    canExportFinancials: true,
    primaryAction: {
      label: 'Reconcile Ledger',
      actionKey: 'reconcile_ledger',
    },
  },

  'Claims Officer': {
    role: 'Claims Officer',
    defaultTab: 'overview',
    title: 'Insurance Claims Queue',
    subtitle: 'Payer adjudication, supporting clinical documentation, and approvals',
    allowedTabs: ['overview', 'claims', 'documents', 'patients'],
    navItems: [
      { id: 'overview', label: 'Finance & Claims', icon: LayoutDashboard },
      { id: 'claims', label: 'Claims Queue', icon: ReceiptText, badgeKey: 'claims' },
      { id: 'documents', label: 'Supporting Docs', icon: FolderLock },
      { id: 'patients', label: 'Policyholders', icon: Users },
    ],
    canViewClinicalNotes: true,
    canViewFinancials: true,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: false,
    canManageClaims: true,
    canIssueRefunds: false,
    canSubmitClaims: true,
    canApproveClaims: true,
    canExportFinancials: true,
    primaryAction: {
      label: 'Review Next Claim',
      actionKey: 'review_claim',
    },
  },

  'Records Officer': {
    role: 'Records Officer',
    defaultTab: 'documents',
    title: 'Medical Records & Documentation',
    subtitle: 'Encounter completion audit, document verification, and archival',
    allowedTabs: ['documents', 'patients', 'audit', 'overview'],
    navItems: [
      { id: 'documents', label: 'Documents Queue', icon: FolderLock, badgeKey: 'unverified' },
      { id: 'patients', label: 'Patient Archives', icon: Users },
      { id: 'audit', label: 'Compliance Audit', icon: History },
      { id: 'overview', label: 'Summary', icon: LayoutDashboard },
    ],
    canViewClinicalNotes: true,
    canViewFinancials: false,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: false,
    canManageClaims: false,
    primaryAction: {
      label: 'Verify Documents',
      actionKey: 'verify_documents',
    },
  },

  'Pharmacy Coordinator': {
    role: 'Pharmacy Coordinator',
    defaultTab: 'prescriptions',
    title: 'Pharmacy Coordination & Dispensing',
    subtitle: 'Prescription QR verification, pharmacy partner network, and medication stock',
    allowedTabs: ['prescriptions', 'patients', 'overview'],
    navItems: [
      { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
      { id: 'patients', label: 'Patients', icon: Users },
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    ],
    canViewClinicalNotes: true,
    canViewFinancials: false,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: false,
    canManageClaims: false,
    primaryAction: {
      label: 'Verify Prescription QR',
      actionKey: 'verify_rx',
    },
  },

  'Diagnostic Coordinator': {
    role: 'Diagnostic Coordinator',
    defaultTab: 'diagnostics',
    title: 'Diagnostic Lab Operations',
    subtitle: 'Specimen routing, diagnostic lab requests, and partner laboratory results',
    allowedTabs: ['diagnostics', 'patients', 'overview'],
    navItems: [
      { id: 'diagnostics', label: 'Lab Orders', icon: FlaskConical, badgeKey: 'labs' },
      { id: 'patients', label: 'Patients', icon: Users },
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    ],
    canViewClinicalNotes: true,
    canViewFinancials: false,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: false,
    canManageClaims: false,
    primaryAction: {
      label: 'Upload Lab Results',
      actionKey: 'upload_labs',
    },
  },

  'Auditor': {
    role: 'Auditor',
    defaultTab: 'audit',
    title: 'Independent Regulatory & HIPAA Audit',
    subtitle: 'Cryptographic log inspection, compliance audits, and access review',
    allowedTabs: ['audit', 'reports', 'overview'],
    navItems: [
      { id: 'audit', label: 'Audit Trail', icon: History },
      { id: 'reports', label: 'Compliance Reports', icon: BarChart3 },
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    ],
    canViewClinicalNotes: false,
    canViewFinancials: true,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: false,
    canManageClaims: false,
    primaryAction: {
      label: 'Export Compliance Log',
      actionKey: 'export_audit',
    },
  },
};

export const getRoleDefinition = (role: UserRole): RoleDefinition => {
  return ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS['Clinic Administrator'];
};

export const canRoleAccessTab = (role: UserRole, tab: OperationalTab): boolean => {
  if (
    role === 'Clinic Administrator' ||
    role === 'Clinic Owner' ||
    role === 'Executive Director / Clinic Director' ||
    role === 'Medical Director' ||
    role === 'Doctor'
  ) {
    return true;
  }
  const def = getRoleDefinition(role);
  return def.allowedTabs.includes(tab);
};

export const getDefaultTabForRole = (role: UserRole): OperationalTab => {
  const def = getRoleDefinition(role);
  return def.defaultTab;
};
