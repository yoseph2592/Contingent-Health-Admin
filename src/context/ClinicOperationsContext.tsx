import React, { createContext, useContext, useState } from 'react';
import {
  OperationalTab,
  UserRole,
  PatientRecord,
  AppointmentRecord,
  AppointmentStatus,
  EncounterRecord,
  PrescriptionRecord,
  LabRequestRecord,
  ReferralRecord,
  ClinicalDocument,
  FinancialTransaction,
  InsuranceClaim,
  ContractRecord,
  StaffMember,
  AuditLogEntry,
  OperationalNotification,
  Vitals,
  DiagnosisItem,
  ClaimStatus,
  DoctorProfileRecord,
  ClinicProfileRecord,
  ExternalHistoricalEncounter,
} from '../types/operations';
import {
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_ENCOUNTER,
  INITIAL_ENCOUNTER_DAWIT,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_REQUESTS,
  INITIAL_REFERRALS,
  INITIAL_DOCUMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CLAIMS,
  INITIAL_CONTRACTS,
  INITIAL_STAFF,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EXTERNAL_ENCOUNTERS,
} from '../data/mockOperationsData';

interface PatientSyncAlert {
  show: boolean;
  title: string;
  message: string;
  type: 'rx' | 'apt' | 'lab' | 'claim';
  timestamp: string;
}

interface ClinicOperationsContextType {
  activeTab: OperationalTab;
  setActiveTab: (tab: OperationalTab) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentClinicName: string;
  setCurrentClinicName: (name: string) => void;

  patients: PatientRecord[];
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  selectedPatient: PatientRecord | undefined;

  appointments: AppointmentRecord[];
  selectedAppointmentId: string | null;
  setSelectedAppointmentId: (id: string | null) => void;
  selectedAppointment: AppointmentRecord | undefined;

  activeEncounter: EncounterRecord;
  setActiveEncounter: React.Dispatch<React.SetStateAction<EncounterRecord>>;

  prescriptions: PrescriptionRecord[];
  labRequests: LabRequestRecord[];
  referrals: ReferralRecord[];
  documents: ClinicalDocument[];
  transactions: FinancialTransaction[];
  claims: InsuranceClaim[];
  contracts: ContractRecord[];
  staff: StaffMember[];
  staffMembers: StaffMember[];
  doctors: DoctorProfileRecord[];
  currentClinic: ClinicProfileRecord;
  auditLogs: AuditLogEntry[];
  notifications: OperationalNotification[];

  acceptDoctorAffiliation: (id: string) => void;
  rejectDoctorAffiliation: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Modals & UI States
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  isPrescribeModalOpen: boolean;
  setIsPrescribeModalOpen: (open: boolean) => void;
  isOrderLabModalOpen: boolean;
  setIsOrderLabModalOpen: (open: boolean) => void;
  isReferralModalOpen: boolean;
  setIsReferralModalOpen: (open: boolean) => void;
  printDocumentData: ClinicalDocument | PrescriptionRecord | null;
  setPrintDocumentData: (data: ClinicalDocument | PrescriptionRecord | null) => void;

  // External Encounters & Patient Consent Access Flow
  externalEncounters: ExternalHistoricalEncounter[];
  requestAccessModalEncounter: ExternalHistoricalEncounter | null;
  openRequestAccessModal: (encounter: ExternalHistoricalEncounter) => void;
  closeRequestAccessModal: () => void;
  submitAccessRequest: (encounterId: string, purpose: string, notes?: string) => void;
  simulatePatientConsentApproval: (encounterId: string) => void;
  revokeRecordAccess: (encounterId: string) => void;
  accessToast: {
    show: boolean;
    title: string;
    message: string;
    type: 'pending' | 'success' | 'info';
    encounterId?: string;
  } | null;
  dismissAccessToast: () => void;

  // Patient App Sync Simulation
  patientSyncAlert: PatientSyncAlert | null;
  dismissPatientSyncAlert: () => void;

  // Operational Actions
  acceptAppointment: (id: string) => void;
  rejectAppointment: (id: string) => void;
  checkInPatient: (id: string) => void;
  startConsultation: (id: string) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;

  updateEncounterVitals: (vitals: Partial<Vitals>) => void;
  updateEncounterAssessment: (assessment: string) => void;
  addEncounterDiagnosis: (diag: DiagnosisItem) => void;
  signAndCompleteEncounter: () => void;
  addEncounterAmendment: (note: string) => void;

  createPrescription: (items: PrescriptionRecord['items']) => void;
  fulfillPrescription: (id: string) => void;

  orderLabTest: (
    testType: string,
    department: string,
    clinicalIndication: string,
    priority: 'Routine' | 'Urgent' | 'STAT',
    instructions: string
  ) => void;

  createReferralOrder: (
    destinationFacility: string,
    destinationSpecialty: string,
    urgency: 'Routine' | 'Urgent' | 'Immediate',
    reason: string,
    requestedService: string
  ) => void;

  updateClaimStatus: (claimId: string, status: ClaimStatus, note?: string) => void;
  addAuditLog: (action: string, entity: string, entityId: string, prev?: string, next?: string) => void;
  markNotificationRead: (id: string) => void;

  // Guided Core Journey Runner
  isJourneyRunning: boolean;
  journeyStep: number;
  runAutomatedCoreJourney: () => void;
  resetToInitialDemoData: () => void;
}

const INITIAL_CLINIC: ClinicProfileRecord = {
  id: 'CLN-001',
  name: 'Bethzatha Comprehensive Medical Center',
  registrationNumber: 'REG-ETH-89210',
  licenseNumber: 'LIC-MOH-2023-4912',
  address: 'Bole Sub-City, Woreda 03, House 410, Addis Ababa',
  accreditationTier: 'Tier A Comprehensive Center',
  defaultSlotDurationMinutes: 30,
  rooms: [
    { id: 'RM-101', name: 'Suite 101 - General Internal Medicine', department: 'Internal Medicine', equipment: ['Welch Allyn Vitals Monitor', 'Examination Bed', 'Otoscope/Ophthalmoscope'] },
    { id: 'RM-102', name: 'Suite 102 - Cardiology & Echo Suite', department: 'Cardiology', equipment: ['GE Vivid E95 Echocardiograph', '12-Lead ECG Machine', 'Cardiac Defibrillator'] },
    { id: 'RM-103', name: 'Suite 103 - Minor Procedure & Triage', department: 'Triage & Surgery', equipment: ['Surgical Light', 'Sterilization Autoclave', 'Minor Suture Kit'] },
    { id: 'RM-104', name: 'Suite 104 - Telehealth & Review Pod', department: 'Telehealth', equipment: ['Contingent Telehealth Station', 'High-Res Dermatoscope'] },
  ],
};

const INITIAL_DOCTORS: DoctorProfileRecord[] = [
  {
    id: 'DOC-01',
    name: 'Dr. Almaz Tefera, MD',
    licenseNumber: 'MD-ET-2016-4412',
    specialty: 'Internal Medicine & Endocrinology',
    subSpecialty: 'Metabolic & Glycemic Disorders',
    experienceYears: 14,
    affiliationStatus: 'Active',
    affiliationModel: 'Commission Split',
    contractRevenueSplit: 20,
    assignedRoom: 'Suite 101 - Internal Medicine',
    weeklyHours: 'Mon-Thu (09:00 - 16:00)',
    totalConsultations: 342,
    revenueGenerated: 28400,
    rating: 4.9,
    phone: '+251 91 345 6789',
    email: 'dr.almaz@stgabriel.et',
    credentialsVerified: true,
  },
  {
    id: 'DOC-02',
    name: 'Dr. Michael Chen, MD, FACC',
    licenseNumber: 'MD-ET-2018-8841',
    specialty: 'Cardiovascular Diseases',
    subSpecialty: 'Interventional Echocardiography',
    experienceYears: 12,
    affiliationStatus: 'Active',
    affiliationModel: 'Commission Split',
    contractRevenueSplit: 25,
    assignedRoom: 'Suite 102 - Cardiology Suite',
    weeklyHours: 'Tue, Wed, Fri (08:30 - 15:30)',
    totalConsultations: 218,
    revenueGenerated: 32900,
    rating: 4.95,
    phone: '+251 91 145 6789',
    email: 'm.chen@apexheart.et',
    credentialsVerified: true,
  },
  {
    id: 'DOC-03',
    name: 'Dr. Sofia Ahmed, MD',
    licenseNumber: 'MD-ET-2020-1920',
    specialty: 'Pediatrics & Adolescent Health',
    experienceYears: 8,
    affiliationStatus: 'Active',
    affiliationModel: 'Fixed Retainer',
    contractRevenueSplit: 30,
    assignedRoom: 'Suite 103 - Pediatrics Pod',
    weeklyHours: 'Mon, Wed (13:00 - 18:00)',
    totalConsultations: 124,
    revenueGenerated: 14600,
    rating: 4.85,
    phone: '+251 91 772 1049',
    email: 'sofia.ahmed@pedicare.et',
    credentialsVerified: true,
  },
  {
    id: 'DOC-04',
    name: 'Dr. Dawit Kassa, MD, FRCS',
    licenseNumber: 'MD-ET-2014-0992',
    specialty: 'Orthopedic & Trauma Surgery',
    subSpecialty: 'Sports Arthroscopy',
    experienceYears: 16,
    affiliationStatus: 'Pending Review',
    affiliationModel: 'Commission Split',
    contractRevenueSplit: 20,
    assignedRoom: 'Suite 103 - Minor Procedure',
    weeklyHours: 'Thu, Sat (09:00 - 14:00)',
    totalConsultations: 0,
    revenueGenerated: 0,
    rating: 5.0,
    phone: '+251 91 884 2291',
    email: 'd.kassa@orthomed.et',
    credentialsVerified: true,
  },
];

const ClinicOperationsContext = createContext<ClinicOperationsContextType | undefined>(undefined);

export const ClinicOperationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<OperationalTab>('overview');
  const [activeRole, setActiveRole] = useState<UserRole>('Clinic Administrator');
  const [currentClinicName, setCurrentClinicName] = useState('St. Gabriel Contingent Medical Center');
  const [currentClinic, setCurrentClinic] = useState<ClinicProfileRecord>(INITIAL_CLINIC);
  const [doctors, setDoctors] = useState<DoctorProfileRecord[]>(INITIAL_DOCTORS);

  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('PAT-2024-0081');

  const [appointments, setAppointments] = useState<AppointmentRecord[]>(INITIAL_APPOINTMENTS);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>('APT-8921');

  const [activeEncounter, setActiveEncounter] = useState<EncounterRecord>(INITIAL_ENCOUNTER);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(INITIAL_PRESCRIPTIONS);
  const [labRequests, setLabRequests] = useState<LabRequestRecord[]>(INITIAL_LAB_REQUESTS);
  const [referrals, setReferrals] = useState<ReferralRecord[]>(INITIAL_REFERRALS);
  const [documents, setDocuments] = useState<ClinicalDocument[]>(INITIAL_DOCUMENTS);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [claims, setClaims] = useState<InsuranceClaim[]>(INITIAL_CLAIMS);
  const [contracts, setContracts] = useState<ContractRecord[]>(INITIAL_CONTRACTS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<OperationalNotification[]>(INITIAL_NOTIFICATIONS);

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isPrescribeModalOpen, setIsPrescribeModalOpen] = useState(false);
  const [isOrderLabModalOpen, setIsOrderLabModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [printDocumentData, setPrintDocumentData] = useState<ClinicalDocument | PrescriptionRecord | null>(null);

  // Patient-side synchronization notice
  const [patientSyncAlert, setPatientSyncAlert] = useState<PatientSyncAlert | null>(null);

  // External Encounters & Patient Consent Access Flow
  const [externalEncounters, setExternalEncounters] = useState<ExternalHistoricalEncounter[]>(INITIAL_EXTERNAL_ENCOUNTERS);
  const [requestAccessModalEncounter, setRequestAccessModalEncounter] = useState<ExternalHistoricalEncounter | null>(null);
  const [accessToast, setAccessToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'pending' | 'success' | 'info';
    encounterId?: string;
  } | null>(null);

  const openRequestAccessModal = (encounter: ExternalHistoricalEncounter) => {
    setRequestAccessModalEncounter(encounter);
  };

  const closeRequestAccessModal = () => {
    setRequestAccessModalEncounter(null);
  };

  const submitAccessRequest = (encounterId: string, purpose: string, notes?: string) => {
    const enc = externalEncounters.find((e) => e.id === encounterId);
    if (!enc) return;

    const reqTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const reqDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const doctorName = activeRole === 'Doctor' ? 'Dr. Almaz Tefera, MD' : `${activeRole} (On Duty)`;

    setExternalEncounters((prev) =>
      prev.map((item) =>
        item.id === encounterId
          ? {
              ...item,
              accessStatus: 'Pending Approval',
              requestedAt: `${reqDate} · ${reqTime}`,
              requestedByDoctor: doctorName,
              requestPurpose: purpose,
            }
          : item
      )
    );

    addAuditLog(
      'DISPATCH_CONSENT_REQUEST',
      'PatientRecordAccess',
      encounterId,
      'Sealed',
      `Pending Patient Approval (Purpose: ${purpose})`
    );

    const newNotif: OperationalNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: 'Consent Request Dispatched',
      message: `Access authorization dispatched to ${selectedPatient?.fullName || 'Patient'} for ${enc.facilityName} (${enc.providerRoleTitle}) records.`,
      category: 'Clinical',
      timestamp: 'Just now',
      isRead: false,
      priority: 'High',
      relatedEntityId: encounterId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setAccessToast({
      show: true,
      title: 'Consent Request Dispatched to Patient',
      message: `Prompt sent to ${selectedPatient?.fullName || 'Patient'}'s mobile device. Awaiting digital cryptographic approval.`,
      type: 'pending',
      encounterId: encounterId,
    });

    closeRequestAccessModal();
  };

  const simulatePatientConsentApproval = (encounterId: string) => {
    const enc = externalEncounters.find((e) => e.id === encounterId);
    if (!enc) return;

    const approvedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const approvedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const token = `CH-CONSENT-${Math.floor(100000 + Math.random() * 900000)}-DECRYPTED`;

    setExternalEncounters((prev) =>
      prev.map((item) =>
        item.id === encounterId
          ? {
              ...item,
              accessStatus: 'Granted',
              approvedAt: `${approvedDate} · ${approvedTime}`,
              consentToken: token,
            }
          : item
      )
    );

    addAuditLog(
      'PATIENT_CONSENT_VERIFIED',
      'PatientRecordAccess',
      encounterId,
      'Pending Approval',
      `Granted - Full Record Decrypted (Token: ${token})`
    );

    setAccessToast({
      show: true,
      title: 'Consent Granted by Patient',
      message: `${selectedPatient?.fullName || 'Patient'} approved disclosure of ${enc.facilityName} records. Full SOAP notes & orders decrypted.`,
      type: 'success',
      encounterId: encounterId,
    });

    const newNotif: OperationalNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: 'Record Decryption Approved',
      message: `Patient granted full record disclosure for encounter ${enc.id} (${enc.providerName}).`,
      category: 'Clinical',
      timestamp: 'Just now',
      isRead: false,
      priority: 'Medium',
      relatedEntityId: encounterId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const revokeRecordAccess = (encounterId: string) => {
    setExternalEncounters((prev) =>
      prev.map((item) =>
        item.id === encounterId
          ? {
              ...item,
              accessStatus: 'Sealed',
              approvedAt: undefined,
              requestedAt: undefined,
              consentToken: undefined,
            }
          : item
      )
    );
    setAccessToast({
      show: true,
      title: 'Record Access Sealed',
      message: `Encounter ${encounterId} has been returned to sealed status.`,
      type: 'info',
    });
  };

  const dismissAccessToast = () => {
    setAccessToast(null);
  };

  // Guided Journey runner
  const [isJourneyRunning, setIsJourneyRunning] = useState(false);
  const [journeyStep, setJourneyStep] = useState(0);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const selectedAppointment = appointments.find((a) => a.id === selectedAppointmentId);

  const addAuditLog = (action: string, entity: string, entityId: string, prev = 'N/A', next = 'Updated') => {
    const newLog: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: activeRole === 'Doctor' ? 'Dr. Almaz Tefera, MD' : `${activeRole} (Active Session)`,
      role: activeRole,
      action,
      entity,
      entityId,
      previousState: prev,
      newState: next,
      ipAddress: '196.188.24.110 (Enterprise Secure Session)',
    };
    setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  const triggerPatientSync = (title: string, message: string, type: 'rx' | 'apt' | 'lab' | 'claim') => {
    setPatientSyncAlert({
      show: true,
      title,
      message,
      type,
      timestamp: 'Just now',
    });
  };

  const dismissPatientSyncAlert = () => {
    setPatientSyncAlert(null);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const acceptDoctorAffiliation = (id: string) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, affiliationStatus: 'Active' as const } : d))
    );
    addAuditLog(`Approved doctor affiliation application for ${id}`, 'DoctorProfileRecord', id, 'Pending Review', 'Active');
  };

  const rejectDoctorAffiliation = (id: string) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, affiliationStatus: 'Suspended' as const } : d))
    );
    addAuditLog(`Rejected doctor affiliation application for ${id}`, 'DoctorProfileRecord', id, 'Pending Review', 'Suspended');
  };

  // Appointment Actions
  const acceptAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Accepted' } : a))
    );
    addAuditLog('Accepted appointment request', 'AppointmentRecord', id, 'Requested', 'Accepted');
    triggerPatientSync(
      'Appointment Confirmed',
      `Your appointment has been accepted and confirmed by ${currentClinicName}.`,
      'apt'
    );
  };

  const rejectAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a))
    );
    addAuditLog('Cancelled appointment request', 'AppointmentRecord', id, 'Requested', 'Cancelled');
  };

  const checkInPatient = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Checked-in', room: 'Waiting Area A' } : a))
    );
    setPatients((prev) =>
      prev.map((p) => {
        const apt = appointments.find((a) => a.id === id);
        return p.id === apt?.patientId ? { ...p, status: 'Waiting Room' } : p;
      })
    );
    addAuditLog('Patient checked in at reception', 'AppointmentRecord', id, 'Scheduled', 'Checked-in');
    triggerPatientSync(
      'Reception Check-In Verified',
      'You are checked in. Dr. Almaz Tefera has been notified you are waiting in Suite 102.',
      'apt'
    );
  };

  const startConsultation = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return;

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'In consultation' } : a))
    );
    setPatients((prev) =>
      prev.map((p) => (p.id === apt.patientId ? { ...p, status: 'In Consultation' } : p))
    );
    setSelectedAppointmentId(id);
    setSelectedPatientId(apt.patientId);

    const patientObj = patients.find((p) => p.id === apt.patientId);

    if (apt.id === 'APT-8920' || apt.patientId === 'PAT-2024-0105') {
      setActiveEncounter(INITIAL_ENCOUNTER_DAWIT);
    } else if (apt.id === 'APT-8921' || apt.patientId === 'PAT-2024-0081') {
      setActiveEncounter(INITIAL_ENCOUNTER);
    } else {
      setActiveEncounter((prev) => ({
        ...prev,
        id: apt.encounterId || `ENC-${Math.floor(4000 + Math.random() * 999)}`,
        appointmentId: apt.id,
        patientId: apt.patientId,
        patientName: apt.patientName,
        doctorId: apt.doctorId,
        doctorName: apt.doctorName,
        date: apt.date,
        time: apt.time,
        chiefComplaint: apt.reasonForVisit,
        symptoms: apt.symptoms || [],
        historyOfPresentIllness: `${patientObj?.fullName || apt.patientName}, a ${apt.patientAge}-year-old ${apt.patientSex}, presents for ${apt.reasonForVisit.toLowerCase()}.`,
        vitals: prev.patientId === apt.patientId && prev.vitals ? prev.vitals : {
          bloodPressure: '138/86 mmHg',
          heartRate: 74,
          temperature: 36.8,
          respiratoryRate: 16,
          spO2: 98,
          weightKg: 78.5,
          heightCm: 176,
          bmi: 25.3,
        },
        assessment: `${apt.reasonForVisit}. Under clinical evaluation.`,
        isLocked: false,
        signedAt: undefined,
        signedBy: undefined,
        digitalSignatureVerificationCode: undefined,
      }));
    }

    setActiveTab('encounter');
    addAuditLog('Started patient clinical encounter', 'EncounterRecord', apt.encounterId || id, 'Checked-in', 'In consultation');
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    addAuditLog(`Updated appointment status to ${status}`, 'AppointmentRecord', id, 'Previous', status);
  };

  // Encounter Documentation Actions
  const updateEncounterVitals = (newVitals: Partial<Vitals>) => {
    if (activeEncounter.isLocked) return;
    setActiveEncounter((prev) => ({
      ...prev,
      vitals: { ...prev.vitals, ...newVitals },
    }));
  };

  const updateEncounterAssessment = (assessment: string) => {
    if (activeEncounter.isLocked) return;
    setActiveEncounter((prev) => ({ ...prev, assessment }));
  };

  const addEncounterDiagnosis = (diag: DiagnosisItem) => {
    if (activeEncounter.isLocked) return;
    setActiveEncounter((prev) => ({
      ...prev,
      diagnoses: [...prev.diagnoses, diag],
    }));
    addAuditLog(`Added diagnosis ${diag.code}: ${diag.description}`, 'EncounterRecord', activeEncounter.id);
  };

  const createPrescription = (items: PrescriptionRecord['items']) => {
    const newRxId = `RX-2024-${Math.floor(700 + Math.random() * 299)}`;
    const newRx: PrescriptionRecord = {
      id: newRxId,
      encounterId: activeEncounter.id,
      appointmentId: activeEncounter.appointmentId,
      patientId: activeEncounter.patientId,
      patientName: activeEncounter.patientName,
      patientAge: selectedPatient?.age || 48,
      patientSex: selectedPatient?.sex || 'Male',
      doctorId: activeEncounter.doctorId,
      doctorName: activeEncounter.doctorName,
      doctorLicense: 'CONT-DOC-84920 / ET-MOH-2016-091',
      clinicId: 'CLN-001',
      clinicName: currentClinicName,
      clinicLogo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&auto=format&fit=crop&q=80',
      clinicAddress: 'Bole Medhanealem Road, Suite 400, Addis Ababa',
      clinicPhone: '+251 11 661 4000',
      date: new Date().toISOString().split('T')[0],
      items,
      status: 'Sent to Patient',
      signedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      signedBy: activeEncounter.doctorName,
      qrCodeData: `https://contingent.health/verify/rx/${newRxId}`,
      verificationCode: `RX-VRF-${Math.floor(1000 + Math.random() * 9000)}-CONT`,
      notes: 'Dispensed through accredited partner pharmacy network with electronic audit trail.',
      amendments: [],
    };

    setPrescriptions((prev) => [newRx, ...prev]);

    // Also register as an official clinical document
    const newDoc: ClinicalDocument = {
      id: `DOC-${Math.floor(9000 + Math.random() * 999)}`,
      title: `Official Electronic Prescription - ${newRxId}`,
      category: 'Prescriptions',
      patientId: activeEncounter.patientId,
      patientName: activeEncounter.patientName,
      author: activeEncounter.doctorName,
      authorRole: 'Attending Physician',
      date: newRx.date,
      status: 'Final / Signed',
      relatedAppointmentId: activeEncounter.appointmentId,
      version: '1.0',
      accessPermissions: ['Attending Doctor', 'Patient', 'Accredited Pharmacy'],
      content: `Prescription issued for ${items.map((i) => i.medication).join(', ')}.`,
      verificationHash: `SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
    };
    setDocuments((prev) => [newDoc, ...prev]);

    // Update patient current medications
    setPatients((prev) =>
      prev.map((p) =>
        p.id === activeEncounter.patientId
          ? {
              ...p,
              currentMedications: [
                ...new Set([...p.currentMedications, ...items.map((i) => `${i.medication} ${i.strength}`)]),
              ],
            }
          : p
      )
    );

    addAuditLog(`Signed electronic prescription ${newRxId}`, 'PrescriptionRecord', newRxId, 'Draft', 'Sent to Patient');
    triggerPatientSync(
      'New Prescription Available in App',
      `Dr. Almaz Tefera prescribed ${items.length} medication(s). Sent to your Contingent Patient App with QR pickup code.`,
      'rx'
    );
  };

  const fulfillPrescription = (id: string) => {
    setPrescriptions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Fulfilled' } : r))
    );
    addAuditLog(`Marked prescription ${id} as Fulfilled by partner pharmacy`, 'PrescriptionRecord', id, 'Sent to Patient', 'Fulfilled');
    triggerPatientSync('Prescription Fulfilled', `Prescription ${id} has been dispensed by Pharmacy.`, 'rx');
  };

  const orderLabTest = (
    testType: string,
    department: string,
    clinicalIndication: string,
    priority: 'Routine' | 'Urgent' | 'STAT',
    instructions: string
  ) => {
    const newLabId = `LAB-${Math.floor(9000 + Math.random() * 999)}`;
    const newLab: LabRequestRecord = {
      id: newLabId,
      encounterId: activeEncounter.id,
      appointmentId: activeEncounter.appointmentId,
      patientId: activeEncounter.patientId,
      patientName: activeEncounter.patientName,
      doctorId: activeEncounter.doctorId,
      doctorName: activeEncounter.doctorName,
      testType,
      department,
      clinicalIndication,
      priority,
      instructions,
      diagnosis: activeEncounter.diagnoses[0]?.description || 'Clinical Evaluation',
      status: 'In Progress',
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setLabRequests((prev) => [newLab, ...prev]);
    addAuditLog(`Ordered diagnostic laboratory examination ${newLabId}`, 'LabRequestRecord', newLabId, 'None', 'In Progress');
    triggerPatientSync(
      'Diagnostic Order Generated',
      `Laboratory order for ${testType} placed by doctor. Fasting preparation instructions available in your app.`,
      'lab'
    );
  };

  const createReferralOrder = (
    destinationFacility: string,
    destinationSpecialty: string,
    urgency: 'Routine' | 'Urgent' | 'Immediate',
    reason: string,
    requestedService: string
  ) => {
    const newRefId = `REF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRef: ReferralRecord = {
      id: newRefId,
      encounterId: activeEncounter.id,
      patientId: activeEncounter.patientId,
      patientName: activeEncounter.patientName,
      referringDoctorId: activeEncounter.doctorId,
      referringDoctorName: activeEncounter.doctorName,
      destinationFacility,
      destinationSpecialty,
      urgency,
      reason,
      clinicalSummary: activeEncounter.assessment,
      diagnosis: activeEncounter.diagnoses[0]?.description || 'Diagnostic Workup',
      requestedService,
      status: 'Sent',
      sentDate: new Date().toISOString().split('T')[0],
    };

    setReferrals((prev) => [newRef, ...prev]);
    addAuditLog(`Created medical referral ${newRefId} to ${destinationFacility}`, 'ReferralRecord', newRefId, 'Draft', 'Sent');
  };

  const signAndCompleteEncounter = () => {
    if (activeEncounter.isLocked) return;

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const verificationCode = `CONT-SIG-${activeEncounter.id}-${Math.floor(1000 + Math.random() * 9000)}`;

    setActiveEncounter((prev) => ({
      ...prev,
      isLocked: true,
      signedAt: timestamp,
      signedBy: `${prev.doctorName} (Digitally Certified MD)`,
      digitalSignatureVerificationCode: verificationCode,
    }));

    // Update appointment status to Completed
    setAppointments((prev) =>
      prev.map((a) => (a.id === activeEncounter.appointmentId ? { ...a, status: 'Completed' } : a))
    );

    // Update patient status
    setPatients((prev) =>
      prev.map((p) =>
        p.id === activeEncounter.patientId
          ? {
              ...p,
              status: 'Active',
              lastVisitDate: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );

    // Generate clinical documentation record
    const newDocId = `DOC-${Math.floor(9000 + Math.random() * 999)}`;
    const encounterDoc: ClinicalDocument = {
      id: newDocId,
      title: `Clinical Encounter Summary - ${activeEncounter.id}`,
      category: 'Appointment Notes',
      patientId: activeEncounter.patientId,
      patientName: activeEncounter.patientName,
      author: activeEncounter.doctorName,
      authorRole: 'Attending Physician',
      date: new Date().toISOString().split('T')[0],
      status: 'Final / Signed',
      relatedAppointmentId: activeEncounter.appointmentId,
      version: '1.0',
      accessPermissions: ['Attending Doctor', 'Clinic Admin', 'Patient (Disclosed Summary)'],
      content: activeEncounter.treatmentPlan,
      verificationHash: `SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
    };
    setDocuments((prev) => [encounterDoc, ...prev]);

    // Financial transaction generation & wallet allocation:
    // Total Amount $95: 10% platform ($9.50), 70% clinic ($66.50), 20% doctor ($19.00)
    const newTxnId = `TXN-${Math.floor(8000 + Math.random() * 1999)}`;
    const newTxn: FinancialTransaction = {
      id: newTxnId,
      appointmentId: activeEncounter.appointmentId,
      encounterId: activeEncounter.id,
      patientId: activeEncounter.patientId,
      patientName: activeEncounter.patientName,
      doctorId: activeEncounter.doctorId,
      doctorName: activeEncounter.doctorName,
      serviceName: 'Level 4 Chronic Disease Management Encounter',
      totalAmount: 95.0,
      platformFee: 9.5,
      clinicShare: 66.5,
      doctorShare: 19.0,
      status: 'Completed',
      date: timestamp,
      paymentMethod: 'Insurance Claim',
      invoiceNumber: `INV-2024-${Math.floor(8000 + Math.random() * 1000)}`,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    // Generate Insurance Claim automatically
    const newClaimId = `CLM-2024-${Math.floor(500 + Math.random() * 499)}`;
    const newClaim: InsuranceClaim = {
      id: newClaimId,
      patientId: activeEncounter.patientId,
      patientName: activeEncounter.patientName,
      policyNumber: selectedPatient?.insurancePolicyNumber || 'MN-77402-B',
      payerName: selectedPatient?.insuranceProvider || 'MedNet Continental',
      appointmentId: activeEncounter.appointmentId,
      doctorId: activeEncounter.doctorId,
      doctorName: activeEncounter.doctorName,
      serviceDescription: 'Comprehensive Consultation & Medication Adjustment',
      claimedAmount: 95.0,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      supportingDocumentIds: [newDocId],
      auditTimeline: [
        {
          date: timestamp,
          status: 'Submitted',
          note: `Claim generated automatically from locked Encounter ${activeEncounter.id}.`,
          actor: 'Contingent Automated Revenue Engine',
        },
      ],
    };
    setClaims((prev) => [newClaim, ...prev]);

    addAuditLog(`Digitally locked and signed Encounter ${activeEncounter.id}`, 'EncounterRecord', activeEncounter.id, 'In consultation', 'Completed / Locked');
    triggerPatientSync(
      'Encounter Documentation Finalized',
      'Your consultation summary, treatment instructions, and care plan are now accessible in your Contingent patient history.',
      'apt'
    );
  };

  const addEncounterAmendment = (note: string) => {
    const amendment = {
      id: `AMD-${Math.floor(100 + Math.random() * 900)}`,
      author: activeRole === 'Doctor' ? 'Dr. Almaz Tefera, MD' : activeRole,
      authorRole: activeRole,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      note,
    };
    setActiveEncounter((prev) => ({
      ...prev,
      amendments: [...prev.amendments, amendment],
    }));
    addAuditLog(`Added signed amendment to locked Encounter ${activeEncounter.id}: ${note}`, 'EncounterRecord', activeEncounter.id);
  };

  const updateClaimStatus = (claimId: string, status: ClaimStatus, note = 'Status adjusted') => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const newTimelineItem = {
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            status,
            note,
            actor: `${activeRole} (${activeRole === 'Doctor' ? 'Dr. Almaz Tefera' : 'Staff'})`,
          };
          return {
            ...c,
            status,
            auditTimeline: [newTimelineItem, ...c.auditTimeline],
          };
        }
        return c;
      })
    );
    addAuditLog(`Updated claim ${claimId} status to ${status}`, 'InsuranceClaim', claimId, 'Previous', status);
  };

  // Guided Core Journey Runner (Section 27: executes the 27 steps)
  const runAutomatedCoreJourney = () => {
    setIsJourneyRunning(true);
    setJourneyStep(1);

    // Step 1: Patient requests appointment (Fatima Al-Mansoor APT-8925)
    setTimeout(() => {
      setJourneyStep(2);
      // Step 2 & 3: Clinic accepts and schedules
      acceptAppointment('APT-8925');
    }, 1200);

    setTimeout(() => {
      setJourneyStep(4);
      // Step 4 & 5: Patient arrives and checks in
      checkInPatient('APT-8922');
      setActiveTab('appointments');
    }, 2400);

    setTimeout(() => {
      setJourneyStep(6);
      // Step 6 & 7: Doctor opens encounter
      startConsultation('APT-8921');
      setActiveRole('Doctor');
    }, 3600);

    setTimeout(() => {
      setJourneyStep(8);
      // Step 8 & 9: Doctor records clinical findings & diagnosis
      addEncounterDiagnosis({
        code: 'ICD-10 I11.9',
        description: 'Hypertensive heart disease without heart failure',
        type: 'Secondary',
      });
    }, 4800);

    setTimeout(() => {
      setJourneyStep(10);
      // Step 10 & 11: Doctor prescribes medication
      createPrescription([
        {
          medication: 'Lisinopril',
          strength: '10 mg',
          dosage: '1 Tablet',
          route: 'Oral',
          frequency: 'Once Daily',
          duration: '30 Days',
          quantity: 30,
          refills: 1,
          instructions: 'Take in the morning with water.',
          indication: 'Essential Hypertension',
        },
      ]);
    }, 6000);

    setTimeout(() => {
      setJourneyStep(12);
      // Step 12: Order diagnostic test
      orderLabTest(
        'Renal Function & Electrolytes Panel',
        'Biochemistry',
        'Monitor ACE inhibitor initiation',
        'Routine',
        'Fasting blood draw'
      );
    }, 7200);

    setTimeout(() => {
      setJourneyStep(13);
      // Step 13: Sign & lock encounter, triggering financials & claims
      signAndCompleteEncounter();
      setIsJourneyRunning(false);
      setActiveTab('overview');
    }, 8500);
  };

  const resetToInitialDemoData = () => {
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setActiveEncounter(INITIAL_ENCOUNTER);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setLabRequests(INITIAL_LAB_REQUESTS);
    setReferrals(INITIAL_REFERRALS);
    setDocuments(INITIAL_DOCUMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setClaims(INITIAL_CLAIMS);
    setContracts(INITIAL_CONTRACTS);
    setStaff(INITIAL_STAFF);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setExternalEncounters(INITIAL_EXTERNAL_ENCOUNTERS);
    setRequestAccessModalEncounter(null);
    setAccessToast(null);
    setActiveTab('overview');
    setActiveRole('Clinic Administrator');
    setJourneyStep(0);
    setIsJourneyRunning(false);
  };

  return (
    <ClinicOperationsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeRole,
        setActiveRole,
        currentClinicName,
        setCurrentClinicName,

        patients,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,

        appointments,
        selectedAppointmentId,
        setSelectedAppointmentId,
        selectedAppointment,

        activeEncounter,
        setActiveEncounter,

        prescriptions,
        labRequests,
        referrals,
        documents,
        transactions,
        claims,
        contracts,
        staff,
        staffMembers: staff,
        doctors,
        currentClinic,
        auditLogs,
        notifications,

        acceptDoctorAffiliation,
        rejectDoctorAffiliation,
        markAllNotificationsRead,

        // UI state
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        globalSearchQuery,
        setGlobalSearchQuery,
        isPrescribeModalOpen,
        setIsPrescribeModalOpen,
        isOrderLabModalOpen,
        setIsOrderLabModalOpen,
        isReferralModalOpen,
        setIsReferralModalOpen,
        printDocumentData,
        setPrintDocumentData,

        // External Encounters & Patient Consent Access Flow
        externalEncounters,
        requestAccessModalEncounter,
        openRequestAccessModal,
        closeRequestAccessModal,
        submitAccessRequest,
        simulatePatientConsentApproval,
        revokeRecordAccess,
        accessToast,
        dismissAccessToast,

        patientSyncAlert,
        dismissPatientSyncAlert,

        acceptAppointment,
        rejectAppointment,
        checkInPatient,
        startConsultation,
        updateAppointmentStatus,

        updateEncounterVitals,
        updateEncounterAssessment,
        addEncounterDiagnosis,
        signAndCompleteEncounter,
        addEncounterAmendment,

        createPrescription,
        fulfillPrescription,
        orderLabTest,
        createReferralOrder,
        updateClaimStatus,
        addAuditLog,
        markNotificationRead,

        isJourneyRunning,
        journeyStep,
        runAutomatedCoreJourney,
        resetToInitialDemoData,
      }}
    >
      {children}
    </ClinicOperationsContext.Provider>
  );
};

export const useClinicOperations = () => {
  const context = useContext(ClinicOperationsContext);
  if (!context) {
    throw new Error('useClinicOperations must be used within a ClinicOperationsProvider');
  }
  return context;
};
