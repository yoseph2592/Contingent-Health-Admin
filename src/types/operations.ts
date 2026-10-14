export type OperationalTab =
  | 'overview'
  | 'patients'
  | 'appointments'
  | 'encounter'
  | 'doctors'
  | 'records'
  | 'prescriptions'
  | 'diagnostics'
  | 'referrals'
  | 'documents'
  | 'wallet'
  | 'revenue'
  | 'claims'
  | 'contracts'
  | 'notifications'
  | 'reports'
  | 'settings'
  | 'admin'
  | 'staff'
  | 'tasks'
  | 'check-in'
  | 'audit'
  | 'patient-sync'
  | 'onboarding';

export type UserRole =
  | 'Clinic Owner'
  | 'Clinic Administrator'
  | 'Medical Director'
  | 'Doctor'
  | 'Nurse'
  | 'Receptionist'
  | 'Finance Officer'
  | 'Claims Officer'
  | 'Records Officer';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface PatientRecord {
  id: string; // e.g. PAT-2024-0081
  fullName: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  bloodType: string;
  nationalId: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  affiliatedDoctorId: string;
  affiliatedDoctorName: string;
  clinicRelationship: 'Active Regular' | 'VIP Care' | 'Chronic Care Program' | 'New Patient';
  walletBalance: number;
  status: 'Active' | 'In Consultation' | 'Waiting Room' | 'Inactive';
  conditions: string[];
  allergies: string[];
  currentMedications: string[];
  lastVisitDate: string;
  nextAppointmentDate?: string;
  emergencyContact: EmergencyContact;
  clinicalAlerts: string[];
  notes: string;
}

export type AppointmentStatus =
  | 'Requested'
  | 'Reviewing'
  | 'Accepted'
  | 'Scheduled'
  | 'Checked-in'
  | 'In consultation'
  | 'Completed'
  | 'Closed'
  | 'Cancelled';

export interface AppointmentRecord {
  id: string; // e.g. APT-8921
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  durationMinutes: number;
  visitType: 'In-person Consultation' | 'Telehealth Video' | 'Follow-up Review' | 'Diagnostic Assessment';
  reasonForVisit: string;
  symptoms: string[];
  status: AppointmentStatus;
  requestedAt: string;
  supportingDocs: string[];
  encounterId?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Covered by Insurance' | 'Refunded';
  amount: number;
  room?: string;
  triagePriority: 'Normal' | 'Urgent' | 'Priority';
}

export interface Vitals {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  spO2: number;
  weightKg: number;
  heightCm: number;
  bmi: number;
}

export interface DiagnosisItem {
  code: string; // e.g. ICD-10 I10
  description: string;
  type: 'Primary' | 'Secondary';
}

export interface EncounterAmendment {
  id: string;
  author: string;
  authorRole: string;
  timestamp: string;
  note: string;
}

export interface EncounterRecord {
  id: string; // e.g. ENC-4029
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  chiefComplaint: string;
  symptoms: string[];
  historyOfPresentIllness: string;
  vitals: Vitals;
  physicalExamination: string;
  assessment: string;
  diagnoses: DiagnosisItem[];
  prescriptions: string[];
  labRequestIds: string[];
  referralIds: string[];
  procedures: string[];
  clinicalNotes: string;
  treatmentPlan: string;
  patientInstructions: string;
  followUpDate?: string;
  isLocked: boolean;
  signedAt?: string;
  signedBy?: string;
  digitalSignatureVerificationCode?: string;
  amendments: EncounterAmendment[];
}

export type PrescriptionStatus =
  | 'Draft'
  | 'Prescribed'
  | 'Sent to Patient'
  | 'Accessed'
  | 'Fulfilled'
  | 'Partially Fulfilled'
  | 'Cancelled';

export interface PrescriptionItem {
  medication: string;
  strength: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  quantity: number;
  refills: number;
  instructions: string;
  indication: string;
}

export interface PrescriptionRecord {
  id: string; // e.g. RX-2024-771
  encounterId?: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  doctorId: string;
  doctorName: string;
  doctorLicense: string;
  clinicId: string;
  clinicName: string;
  clinicLogo: string;
  clinicAddress: string;
  clinicPhone: string;
  date: string;
  items: PrescriptionItem[];
  status: PrescriptionStatus;
  signedAt?: string;
  signedBy?: string;
  qrCodeData: string;
  verificationCode: string;
  notes?: string;
  amendments: { timestamp: string; note: string; author: string }[];
}

export type LabRequestStatus =
  | 'Requested'
  | 'Accepted'
  | 'Scheduled'
  | 'In Progress'
  | 'Result Available'
  | 'Reviewed'
  | 'Closed';

export interface LabRequestRecord {
  id: string; // e.g. LAB-9031
  encounterId?: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testType: string;
  department: string;
  clinicalIndication: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  instructions: string;
  diagnosis: string;
  status: LabRequestStatus;
  requestedAt: string;
  resultDate?: string;
  resultsSummary?: string;
  referenceRange?: string;
  doctorInterpretation?: string;
  isFlaggedAbnormal?: boolean;
  reviewedByDoctor?: boolean;
}

export type ReferralStatus =
  | 'Draft'
  | 'Sent'
  | 'Received'
  | 'Accepted'
  | 'Scheduled'
  | 'Completed'
  | 'Result Returned'
  | 'Closed';

export interface ReferralRecord {
  id: string; // e.g. REF-1092
  encounterId?: string;
  patientId: string;
  patientName: string;
  referringDoctorId: string;
  referringDoctorName: string;
  destinationFacility: string;
  destinationSpecialty: string;
  urgency: 'Routine' | 'Urgent' | 'Immediate';
  reason: string;
  clinicalSummary: string;
  diagnosis: string;
  requestedService: string;
  status: ReferralStatus;
  sentDate: string;
  resultReturnSummary?: string;
}

export type DocumentCategory =
  | 'Appointment Notes'
  | 'Prescriptions'
  | 'Lab Requests'
  | 'Lab Results'
  | 'Imaging'
  | 'Referrals'
  | 'Procedures'
  | 'Medical Certificates'
  | 'Consent Forms'
  | 'Discharge Documents'
  | 'Patient-Submitted'
  | 'Administrative'
  | 'Claims Documentation';

export interface ClinicalDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  patientId: string;
  patientName: string;
  author: string;
  authorRole: string;
  date: string;
  status: 'Draft' | 'Final / Signed' | 'Amended' | 'Archived';
  relatedAppointmentId?: string;
  relatedClaimId?: string;
  version: string;
  accessPermissions: string[];
  content: string;
  verificationHash: string;
}

export type TransactionStatus =
  | 'Pending'
  | 'Authorized'
  | 'Escrowed'
  | 'Completed'
  | 'Settled'
  | 'Refunded'
  | 'Failed';

export interface FinancialTransaction {
  id: string; // e.g. TXN-8930
  appointmentId?: string;
  encounterId?: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  serviceName: string;
  totalAmount: number;
  platformFee: number;
  clinicShare: number;
  doctorShare: number;
  status: TransactionStatus;
  date: string;
  paymentMethod: 'Insurance Claim' | 'Contingent Wallet' | 'Credit Card' | 'Direct Escrow';
  invoiceNumber: string;
}

export type ClaimStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Documentation Required'
  | 'Approved'
  | 'Rejected'
  | 'Paid'
  | 'Closed';

export interface ClaimAuditItem {
  date: string;
  status: ClaimStatus;
  note: string;
  actor: string;
}

export interface InsuranceClaim {
  id: string; // e.g. CLM-2024-554
  patientId: string;
  patientName: string;
  policyNumber: string;
  payerName: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  serviceDescription: string;
  claimedAmount: number;
  approvedAmount?: number;
  submittedDate: string;
  status: ClaimStatus;
  missingDocumentation?: string[];
  supportingDocumentIds: string[];
  reviewNotes?: string;
  auditTimeline: ClaimAuditItem[];
}

export interface ClinicRoom {
  id: string;
  name: string;
  department: string;
  equipment: string[];
}

export interface ClinicProfileRecord {
  id: string;
  name: string;
  registrationNumber: string;
  licenseNumber: string;
  address: string;
  accreditationTier: string;
  defaultSlotDurationMinutes: number;
  rooms: ClinicRoom[];
}

export interface DoctorProfileRecord {
  id: string;
  name: string;
  licenseNumber: string;
  specialty: string;
  subSpecialty?: string;
  experienceYears: number;
  affiliationStatus: 'Active' | 'Pending Review' | 'Suspended';
  affiliationModel: 'Commission Split' | 'Room Rental' | 'Fixed Retainer' | 'Salaried';
  contractRevenueSplit: number;
  assignedRoom: string;
  weeklyHours: string;
  totalConsultations: number;
  revenueGenerated: number;
  rating: number;
  phone: string;
  email: string;
  credentialsVerified: boolean;
}

export type InsuranceClaimRecord = InsuranceClaim;
export type StaffMemberRecord = StaffMember;
export type NotificationItem = OperationalNotification;

export interface ContractRecord {
  id: string;
  title?: string;
  counterparty?: string;
  doctorId: string;
  doctorName: string;
  type: string;
  startDate: string;
  endDate: string;
  terms: string;
  revenueSharePercent?: number;
  revenueSplitPercent: { clinic: number; doctor: number; platform: number };
  noticePeriodDays?: number;
  autoRenew?: boolean;
  status: 'Active' | 'Under Review' | 'Expiring Soon' | 'Pending Signature' | 'Terminated';
  renewalDate: string;
  annualValueEstimate: number;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinedDate: string;
  assignedAppointmentsToday: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  entity: string;
  entityId: string;
  previousState?: string;
  newState: string;
  ipAddress: string;
}

export interface OperationalNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  timestamp: string;
  isRead: boolean;
  priority: string;
  relatedEntityId?: string;
  actionLinkTab?: OperationalTab;
  actionUrl?: string;
  channel?: string[];
}

export type ExternalProviderType =
  | 'External Clinic'
  | 'Nurse Practitioner'
  | 'Clinical Psychologist'
  | 'Physiotherapist'
  | 'Physiologist / Sports Medicine'
  | 'Dietitian';

export type RecordAccessStatus =
  | 'Sealed'
  | 'Pending Approval'
  | 'Granted'
  | 'Declined';

export interface ExternalHistoricalEncounter {
  id: string;
  patientId: string;
  date: string;
  time: string;
  providerType: ExternalProviderType;
  providerName: string;
  providerRoleTitle: string;
  facilityName: string;
  encounterCategory: string;
  summarySnippet: string;
  accessStatus: RecordAccessStatus;
  requestedAt?: string;
  requestedByDoctor?: string;
  requestPurpose?: string;
  approvedAt?: string;
  consentToken?: string;
  fullRecord?: {
    chiefComplaint: string;
    vitalsDetailed: {
      bloodPressure: string;
      heartRate: number;
      spO2: number;
      temperature: number;
      weightKg: number;
      respiratoryRate: number;
      specializedMetrics?: { label: string; value: string }[];
    };
    clinicalNotes: string;
    diagnoses: { code: string; description: string; type: 'Primary' | 'Secondary' }[];
    treatmentPlan: string;
    prescriptions: { medicationName: string; dosage: string; instructions: string }[];
    clinicalOrders: { testOrIntervention: string; status: string; resultSummary: string }[];
    specialistObservations: string;
    attachments: { name: string; type: string; size: string }[];
    attendingSignature: string;
  };
}
