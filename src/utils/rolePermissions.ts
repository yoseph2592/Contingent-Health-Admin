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
  primaryAction: {
    label: string;
    actionKey: string;
  };
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  'Clinic Owner': {
    role: 'Clinic Owner',
    defaultTab: 'overview',
    title: 'Clinic Command Center',
    subtitle: 'Executive oversight, revenue settlement, and operational exceptions',
    allowedTabs: [
      'overview',
      'patients',
      'appointments',
      'encounter',
      'prescriptions',
      'diagnostics',
      'referrals',
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
      'onboarding',
      'patient-sync',
      'documents',
      'tasks',
      'notifications',
    ],
    navItems: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'encounter', label: 'Active Consultation', icon: Stethoscope },
      { id: 'patients', label: 'Patients', icon: Users },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'prescriptions', label: 'Prescription', icon: Pill },
      { id: 'diagnostics', label: 'Diagnostic Orders', icon: FlaskConical },
      { id: 'referrals', label: 'Referrals', icon: Share2 },
      { id: 'wallet', label: 'Payments', icon: Wallet },
      { id: 'claims', label: 'Claims', icon: ReceiptText, badgeKey: 'claims' },
      { id: 'reports', label: 'Rating and Reviews', icon: BarChart3 },
      { id: 'admin', label: 'Clinic Profile', icon: Building },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    canViewClinicalNotes: true,
    canViewFinancials: true,
    canViewAdminSettings: true,
    canManageContracts: true,
    canSignPrescriptions: true,
    canDiagnose: true,
    canCheckIn: true,
    canManageClaims: true,
    primaryAction: {
      label: 'Review Exceptions',
      actionKey: 'review_exceptions',
    },
  },

  'Clinic Administrator': {
    role: 'Clinic Administrator',
    defaultTab: 'overview',
    title: "Today's Clinic Operations",
    subtitle: 'Facility logistics, scheduling, staff allocation, and document flow',
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
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'encounter', label: 'Active Consultation', icon: Stethoscope },
      { id: 'patients', label: 'Patients', icon: Users },
      { id: 'appointments', label: 'Appointments', icon: Calendar, badgeKey: 'appointments' },
      { id: 'prescriptions', label: 'Prescription', icon: Pill },
      { id: 'diagnostics', label: 'Diagnostic Orders', icon: FlaskConical, badgeKey: 'labs' },
      { id: 'referrals', label: 'Referrals', icon: Share2 },
      { id: 'wallet', label: 'Payments', icon: Wallet },
      { id: 'claims', label: 'Claims', icon: ReceiptText, badgeKey: 'claims' },
      { id: 'reports', label: 'Rating and Reviews', icon: BarChart3 },
      { id: 'admin', label: 'Clinic Profile', icon: Building },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    canViewClinicalNotes: true,
    canViewFinancials: true,
    canViewAdminSettings: true,
    canManageContracts: true,
    canSignPrescriptions: true,
    canDiagnose: true,
    canCheckIn: true,
    canManageClaims: true,
    primaryAction: {
      label: 'Schedule Appointment',
      actionKey: 'schedule_appointment',
    },
  },

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
      { id: 'overview', label: 'Today', icon: LayoutDashboard, badgeKey: 'appointments' },
      { id: 'patients', label: 'Patients', icon: Users },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'encounter', label: 'Active Consultation', icon: Stethoscope },
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
    primaryAction: {
      label: 'Start Consultation',
      actionKey: 'start_consultation',
    },
  },

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
      { id: 'overview', label: 'Today', icon: LayoutDashboard, badgeKey: 'appointments' },
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
    primaryAction: {
      label: 'Record Vitals',
      actionKey: 'record_vitals',
    },
  },

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
      { id: 'overview', label: 'Today', icon: LayoutDashboard },
      { id: 'appointments', label: 'Appointments', icon: Calendar, badgeKey: 'appointments' },
      { id: 'patients', label: 'Patients', icon: Users },
    ],
    canViewClinicalNotes: false,
    canViewFinancials: false,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: true,
    canManageClaims: false,
    primaryAction: {
      label: 'Check In Patient',
      actionKey: 'checkin_patient',
    },
  },

  'Finance Officer': {
    role: 'Finance Officer',
    defaultTab: 'overview',
    title: 'Financial Operations & Wallet',
    subtitle: 'Escrow collections, payment reconciliations, doctor splits, and settlements',
    allowedTabs: [
      'overview',
      'wallet',
      'revenue',
      'claims',
      'contracts',
      'reports',
    ],
    navItems: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'wallet', label: 'Transactions & Wallet', icon: Wallet },
      { id: 'revenue', label: 'Revenue', icon: TrendingUp },
      { id: 'claims', label: 'Claims Settlement', icon: ReceiptText, badgeKey: 'claims' },
      { id: 'contracts', label: 'Provider Splits', icon: FileSignature },
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
    primaryAction: {
      label: 'Reconcile Ledger',
      actionKey: 'reconcile_ledger',
    },
  },

  'Claims Officer': {
    role: 'Claims Officer',
    defaultTab: 'claims',
    title: 'Insurance Claims Queue',
    subtitle: 'Payer adjudication, supporting clinical documentation, and approvals',
    allowedTabs: [
      'claims',
      'documents',
      'patients',
      'overview',
    ],
    navItems: [
      { id: 'claims', label: 'Claims Queue', icon: ReceiptText, badgeKey: 'claims' },
      { id: 'documents', label: 'Supporting Docs', icon: FolderLock },
      { id: 'patients', label: 'Policyholders', icon: Users },
      { id: 'overview', label: 'Summary', icon: LayoutDashboard },
    ],
    canViewClinicalNotes: true, // Only for claim supporting notes
    canViewFinancials: true,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: false,
    canDiagnose: false,
    canCheckIn: false,
    canManageClaims: true,
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
    allowedTabs: [
      'documents',
      'patients',
      'audit',
      'overview',
    ],
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

  'Medical Director': {
    role: 'Medical Director',
    defaultTab: 'overview',
    title: 'Clinical Oversight & Quality Assurance',
    subtitle: 'Physician compliance, peer reviews, patient outcomes, and quality metrics',
    allowedTabs: [
      'overview',
      'doctors',
      'patients',
      'diagnostics',
      'reports',
      'audit',
      'documents',
    ],
    navItems: [
      { id: 'overview', label: 'Clinical Overview', icon: LayoutDashboard },
      { id: 'doctors', label: 'Doctor Roster', icon: UserCheck },
      { id: 'patients', label: 'Patient Records', icon: Users },
      { id: 'diagnostics', label: 'Lab Quality', icon: FlaskConical },
      { id: 'reports', label: 'Clinical Quality Reports', icon: BarChart3 },
      { id: 'audit', label: 'Audit Trail', icon: History },
    ],
    canViewClinicalNotes: true,
    canViewFinancials: false,
    canViewAdminSettings: false,
    canManageContracts: false,
    canSignPrescriptions: true,
    canDiagnose: true,
    canCheckIn: false,
    canManageClaims: false,
    primaryAction: {
      label: 'Review Audits',
      actionKey: 'review_audits',
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
