import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { DoctorEncounterResultModal } from '../DoctorEncounterResultModal';
import {
  Stethoscope,
  Pill,
  Lock,
  FileSignature,
  AlertTriangle,
  Plus,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  FlaskConical,
  Share2,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Printer,
  ChevronRight,
  Save,
  Check,
  User,
  Heart,
  Thermometer,
  Activity,
  FileText,
  FolderLock,
  ExternalLink,
  Phone,
  ShieldAlert,
  History,
  FileCheck2,
  Sparkles,
  Search,
  Unlock,
  Building2,
  Send,
  Smartphone,
  RotateCcw,
  Eye,
} from 'lucide-react';

export const ViewDoctorWorkspace: React.FC = () => {
  const {
    activeEncounter,
    setActiveEncounter,
    selectedPatient,
    setIsPrescribeModalOpen,
    setIsOrderLabModalOpen,
    setIsReferralModalOpen,
    setPrintDocumentData,
    addEncounterAmendment,
    prescriptions,
    labRequests,
    referrals,
    documents,
    setActiveTab,
    externalEncounters,
    openRequestAccessModal,
    submitAccessRequest,
    simulatePatientConsentApproval,
    revokeRecordAccess,
    appointments,
    startConsultation,
  } = useClinicOperations();

  // Mode: 'encounter' (Active Encounter Page) or 'history' (Dedicated Separate Patient History Page)
  const [currentMode, setCurrentMode] = useState<'encounter' | 'history'>('encounter');

  // State to control the dedicated Appointment Results Modal
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isAddAmendmentOpen, setIsAddAmendmentOpen] = useState(false);
  const [amendmentText, setAmendmentText] = useState('');

  // Patient History Page filter
  const [historyFilter, setHistoryFilter] = useState<
    'all' | 'external' | 'sealed' | 'granted' | 'internal'
  >('all');
  const [historySearch, setHistorySearch] = useState('');

  const currentPatientPrescriptions = prescriptions.filter(
    (r) => r.encounterId === activeEncounter.id || r.patientId === activeEncounter.patientId
  );
  const currentPatientLabs = labRequests.filter(
    (l) => l.encounterId === activeEncounter.id || l.patientId === activeEncounter.patientId
  );
  const currentPatientReferrals = referrals.filter(
    (rf) => rf.encounterId === activeEncounter.id || rf.patientId === activeEncounter.patientId
  );
  const currentPatientDocs = documents.filter(
    (d) => d.patientId === activeEncounter.patientId
  );

  const handleAddAmendmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amendmentText.trim()) return;
    addEncounterAmendment(amendmentText.trim());
    setAmendmentText('');
    setIsAddAmendmentOpen(false);
  };

  const vitals = activeEncounter.vitals || {
    bloodPressure: '124/82',
    heartRate: 74,
    spO2: 98,
    temperature: 36.8,
    weightKg: 78.5,
    heightCm: 176,
  };

  const bmi =
    vitals.heightCm && vitals.weightKg
      ? (vitals.weightKg / Math.pow(vitals.heightCm / 100, 2)).toFixed(1)
      : '25.3';

  // Comprehensive Longitudinal History records
  const pastVisits = [
    {
      id: 'ENC-2026-0814',
      date: 'Aug 14, 2026',
      time: '10:30 AM',
      type: 'Follow-up Consultation',
      doctor: 'Dr. Almaz Tefera, MD',
      facility: 'St. Gabriel Medical Center · Room 204',
      diagnosis: 'Essential hypertension (ICD-10 I10)',
      vitalsSummary: 'BP 138/88 mmHg · HR 78 bpm · Weight 79.0 kg',
      notes:
        'Blood pressure mildly elevated. Titrated amlodipine to 10mg daily. Patient reports good tolerance without ankle edema. Advised sodium restriction and weekly home BP charting.',
      prescriptions: ['Amlodipine 10mg Oral Tablet · 1 daily', 'Hydrochlorothiazide 12.5mg · 1 daily in AM'],
      labs: ['Comprehensive Metabolic Panel (Normal)', 'Serum Creatinine 0.9 mg/dL'],
      status: 'Completed',
    },
    {
      id: 'ENC-2026-0510',
      date: 'May 10, 2026',
      time: '02:15 PM',
      type: 'Acute Care Visit',
      doctor: 'Dr. Michael Chen, MD',
      facility: 'Horizon Urgent Care Annex',
      diagnosis: 'Acute Bronchitis (ICD-10 J20.9)',
      vitalsSummary: 'BP 122/80 mmHg · HR 84 bpm · SpO2 97% · Temp 37.4°C',
      notes:
        'Patient presented with 5 days of productive cough, mild fatigue. Lungs clear with minimal expiratory wheezing. Chest X-Ray negative for consolidation.',
      prescriptions: ['Albuterol Sulfate HFA 90mcg Inhaler', 'Guaifenesin 600mg ER Tablets'],
      labs: ['Chest Radiography (Bilateral clear)', 'Respiratory Viral Panel (Negative)'],
      status: 'Completed',
    },
    {
      id: 'ENC-2026-0122',
      date: 'Jan 22, 2026',
      time: '09:00 AM',
      type: 'Annual Health Check & Metabolic Review',
      doctor: 'Dr. Almaz Tefera, MD',
      facility: 'St. Gabriel Medical Center · Room 102',
      diagnosis: 'Type 2 Diabetes Mellitus without complication (ICD-10 E11.9)',
      vitalsSummary: 'BP 126/82 mmHg · HR 72 bpm · BMI 25.1 · Weight 78.0 kg',
      notes:
        'Annual wellness exam. Fasting glucose 112 mg/dL, HbA1c 6.8%. Foot examination with monofilament intact. Dilated eye exam completed without retinopathy.',
      prescriptions: ['Metformin HCl 500mg Oral Tablet · Twice daily with meals'],
      labs: ['Glycated Hemoglobin (HbA1c) 6.8%', 'Lipid Panel (LDL 94 mg/dL)'],
      status: 'Completed',
    },
  ];

  const activeConsultationAppointments = appointments.filter((a) => a.status === 'In consultation');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6 pb-28">
      {/* ACTIVE CONSULTATION SELECTOR STRIP */}
      {activeConsultationAppointments.length > 0 && (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1fc16b] animate-pulse" />
            <span className="text-xs font-bold text-[#0e162b] uppercase tracking-wider">
              Active Consultations In Progress ({activeConsultationAppointments.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeConsultationAppointments.map((apt) => {
              const isSelected =
                apt.id === activeEncounter.appointmentId || apt.patientId === activeEncounter.patientId;
              return (
                <button
                  key={apt.id}
                  type="button"
                  onClick={() => startConsultation(apt.id)}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#00c0fe] text-white shadow-xs'
                      : 'bg-[#f0f2f5] hover:bg-[#e4e7ec] text-[#333333]'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{apt.patientName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#606060]'
                    }`}
                  >
                    {apt.room || 'Suite 101'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PERSISTENT PATIENT IDENTITY & TOP ACTION BAR */}
      <div className="bg-white border border-[#e8e8e8] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="p-1.5 sm:p-2 hover:bg-[#f0f2f5] rounded-full text-[#606060] hover:text-[#0e162b] transition-colors shrink-0"
              title="Return to Dashboard Overview"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#0e162b] text-white flex items-center justify-center font-bold text-lg sm:text-xl shrink-0 shadow-xs">
              {activeEncounter.patientName.charAt(0)}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                <h1 className="text-lg sm:text-2xl font-bold text-[#0e162b] truncate leading-tight">
                  {activeEncounter.patientName}
                </h1>
                <span className="text-xs font-mono font-semibold text-[#606060] px-2 py-0.5 rounded-full bg-[#f0f2f5] border border-[#e8e8e8]">
                  {activeEncounter.patientId}
                </span>
                <span className="text-xs font-medium text-[#606060]">
                  {selectedPatient?.age || 48}y · {selectedPatient?.sex || 'Male'}
                </span>
                <span className="text-xs font-medium text-[#606060] hidden sm:inline">
                  · Blood {selectedPatient?.bloodType || 'O+'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8e8e8e] mt-1">
                <span>
                  Attending: <strong className="text-[#0e162b]">{activeEncounter.doctorName}</strong>
                </span>
                <span className="hidden sm:inline">Room: {activeEncounter.appointmentId === 'APT-8920' ? 'Suite 101' : 'Suite 102'}</span>
                <span>Encounter: #{activeEncounter.id}</span>
                <span className="hidden md:inline">
                  Insurance: {selectedPatient?.insuranceProvider || 'Contingent Health Enterprise Plan'}
                </span>
              </div>
            </div>
          </div>

          {/* PAGE SWITCHER: Dedicated Active Encounter vs Dedicated Full Patient History Page */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 shrink-0 self-start lg:self-center">
            <div className="bg-[#f0f2f5] p-1 rounded-full flex items-center border border-[#e8e8e8]">
              <button
                type="button"
                onClick={() => setCurrentMode('encounter')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  currentMode === 'encounter'
                    ? 'bg-white text-[#0e162b] shadow-xs'
                    : 'text-[#606060] hover:text-[#0e162b]'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-[#00c0fe]" />
                <span>Active Encounter</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentMode('history')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  currentMode === 'history'
                    ? 'bg-white text-[#0e162b] shadow-xs'
                    : 'text-[#606060] hover:text-[#0e162b]'
                }`}
              >
                <History className="w-3.5 h-3.5 text-[#0e162b]" />
                <span>Patient History</span>
              </button>
            </div>

            {/* Modal Trigger for Doctor Encounter Results */}
            {activeEncounter.isLocked ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-[#84ebb4]/25 text-[#1fc16b] text-xs font-semibold rounded-full border border-[#1fc16b]/20">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Finalized</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddAmendmentOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 border border-[#e8e8e8] hover:border-[#0e162b] rounded-full text-xs font-semibold text-[#0e162b] transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Addendum</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsResultModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#00c0fe] hover:bg-[#0095c5] text-white rounded-full text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Enter Results</span>
              </button>
            )}
          </div>
        </div>

        {/* CLINICAL SAFETY ALERT STRIP */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#e8e8e8] text-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fb3748]/10 border border-[#fb3748]/20 text-[#d00416] rounded-full font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-[#d00416] shrink-0" />
            <span>Allergy: {selectedPatient?.allergies?.join(', ') || 'Penicillin G (Severe Anaphylaxis)'}</span>
          </div>

          {(selectedPatient?.conditions || ['Essential Hypertension', 'Type 2 Diabetes Mellitus']).map((c, i) => (
            <span key={i} className="px-3 py-1 bg-[#f0f2f5] text-[#333333] border border-[#e8e8e8] rounded-full font-medium">
              {c}
            </span>
          ))}

          <div className="ml-auto text-xs text-[#8e8e8e] hidden md:flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#8e8e8e]" />
            <span>
              ICE: {selectedPatient?.emergencyContact?.name || 'Clara Vance'} ({selectedPatient?.emergencyContact?.phone || '+1 (555) 928-1102'})
            </span>
          </div>
        </div>
      </div>

      {/* VIEW 1: ACTIVE CONSULTATION ENCOUNTER WORKSPACE */}
      {currentMode === 'encounter' ? (
        <div className="space-y-6">
          {/* External Sealed Patient History Alert Banner */}
          <div className="bg-[#f0f9ff] border border-[#aaeaff] rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#00c0fe] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-[#0e162b]">
                    External Specialist &amp; Partner Records Detected
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#006a8e] font-bold border border-[#aaeaff]">
                    {externalEncounters.filter((e) => e.accessStatus === 'Sealed').length} Sealed Records
                  </span>
                </div>
                <p className="text-xs text-[#606060] mt-0.5">
                  Records from Physiotherapists, Psychologists, Nurses, and Clinics are linked to {activeEncounter.patientName}.
                  Review partial summaries and request full patient-approved disclosure.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentMode('history')}
              className="px-4 py-2.5 bg-[#00c0fe] hover:bg-[#0095c5] text-white text-xs font-semibold rounded-full shadow-xs transition-colors shrink-0 flex items-center justify-center space-x-1.5"
            >
              <span>View Sealed History &amp; Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Encounter Banner */}
          <div className="bg-white border-2 border-[#0e162b]/10 rounded-3xl p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e8e8] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1fc16b] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0e162b]">
                    Active In-Person Consultation Session
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#0e162b] mt-0.5">
                  Today&apos;s Consultation Documentation
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentMode('history')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] rounded-full text-xs font-semibold text-[#0e162b] transition-colors"
                >
                  <span>Open Full Patient History Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tri-card clinical summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Chief Complaint */}
              <div className="p-5 bg-[#f7f8fa] rounded-2xl border border-[#e8e8e8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e8e]">
                    Chief Complaint
                  </span>
                  <Activity className="w-4 h-4 text-[#8e8e8e]" />
                </div>
                <p className="text-sm font-semibold text-[#0e162b] leading-relaxed">
                  &ldquo;{activeEncounter.chiefComplaint || 'Persistent evening tension headache and routine hypertension follow-up'}&rdquo;
                </p>
                <p className="text-xs text-[#8e8e8e]">
                  Duration: 3 weeks · Onset: gradual evening throbbing
                </p>
              </div>

              {/* Real-time Vitals */}
              <div className="p-5 bg-[#f7f8fa] rounded-2xl border border-[#e8e8e8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e8e]">
                    Physiological Vitals
                  </span>
                  <Heart className="w-4 h-4 text-[#fb3748]" />
                </div>
                <div className="text-sm font-bold text-[#0e162b]">
                  BP: <span className="text-[#0e162b]">{vitals.bloodPressure} mmHg</span> · HR: {vitals.heartRate} bpm
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-[#606060]">
                  <span>SpO2: <strong className="text-[#0e162b]">{vitals.spO2}%</strong></span>
                  <span>Temp: <strong className="text-[#0e162b]">{vitals.temperature}°C</strong></span>
                  <span>Weight: <strong className="text-[#0e162b]">{vitals.weightKg} kg</strong></span>
                  <span>BMI: <strong className="text-[#0e162b]">{bmi}</strong></span>
                </div>
              </div>

              {/* Assessment & Diagnoses */}
              <div className="p-5 bg-[#f7f8fa] rounded-2xl border border-[#e8e8e8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e8e]">
                    Assessment &amp; Codes
                  </span>
                  <FileText className="w-4 h-4 text-[#8e8e8e]" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(activeEncounter.diagnoses || []).length === 0 ? (
                    <span className="text-xs text-[#8e8e8e] italic">No ICD-10 diagnoses coded yet</span>
                  ) : (
                    (activeEncounter.diagnoses || []).map((d, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#e8e8e8] text-xs font-semibold text-[#0e162b]"
                      >
                        {d.code} - {d.description}
                      </span>
                    ))
                  )}
                </div>
                <p className="text-xs text-[#606060] pt-1 line-clamp-2">
                  {activeEncounter.assessment || 'Essential hypertension under active management; headache follow-up.'}
                </p>
              </div>
            </div>

            {/* Fast Clinical Orders Toolbar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e8e8]">
              <span className="text-xs font-semibold text-[#8e8e8e]">
                Quick Orders during visit:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrescribeModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-[#e8e8e8] hover:border-[#0e162b] bg-white text-xs font-semibold text-[#0e162b] transition-colors"
                >
                  <Pill className="w-3.5 h-3.5 text-[#00c0fe]" />
                  <span>Prescribe Rx</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOrderLabModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-[#e8e8e8] hover:border-[#0e162b] bg-white text-xs font-semibold text-[#0e162b] transition-colors"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-[#00c0fe]" />
                  <span>Order Diagnostic Lab</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsReferralModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-[#e8e8e8] hover:border-[#0e162b] bg-white text-xs font-semibold text-[#0e162b] transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#00c0fe]" />
                  <span>Specialist Referral</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsResultModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-full bg-[#0e162b] hover:bg-[#213364] text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-[#00c0fe]" />
                  <span>Open Full Encounter Modal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Consultation Orders Created in this session */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Medications Ordered */}
            <div className="bg-white border border-[#e8e8e8] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Pill className="w-4 h-4 text-[#00c0fe]" />
                  <h3 className="text-sm font-bold text-[#0e162b]">
                    Prescriptions ({currentPatientPrescriptions.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrescribeModalOpen(true)}
                  className="text-xs font-semibold text-[#00c0fe] hover:underline"
                >
                  + Add Medication
                </button>
              </div>

              {currentPatientPrescriptions.length === 0 ? (
                <p className="text-xs text-[#8e8e8e] py-4 text-center bg-[#f7f8fa] rounded-2xl">
                  No active prescriptions generated for this session yet.
                </p>
              ) : (
                <div className="divide-y divide-[#e8e8e8] text-xs">
                  {currentPatientPrescriptions.map((rx) => (
                    <div key={rx.id} className="py-2.5 first:pt-0 flex items-center justify-between">
                      <div>
                        <strong className="text-[#0e162b] block font-semibold">{rx.medicationName}</strong>
                        <span className="text-[#8e8e8e]">{rx.dosage} · {rx.frequency} · {rx.duration}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] text-[10px] font-semibold border border-[#1fc16b]/20">
                        {rx.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Diagnostic Labs Ordered */}
            <div className="bg-white border border-[#e8e8e8] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FlaskConical className="w-4 h-4 text-[#00c0fe]" />
                  <h3 className="text-sm font-bold text-[#0e162b]">
                    Diagnostic Lab Orders ({currentPatientLabs.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOrderLabModalOpen(true)}
                  className="text-xs font-semibold text-[#00c0fe] hover:underline"
                >
                  + Order Lab
                </button>
              </div>

              {currentPatientLabs.length === 0 ? (
                <p className="text-xs text-[#8e8e8e] py-4 text-center bg-[#f7f8fa] rounded-2xl">
                  No laboratory investigations requested for this session yet.
                </p>
              ) : (
                <div className="divide-y divide-[#e8e8e8] text-xs">
                  {currentPatientLabs.map((lab) => (
                    <div key={lab.id} className="py-2.5 first:pt-0 flex items-center justify-between">
                      <div>
                        <strong className="text-[#0e162b] block font-semibold">{lab.testName}</strong>
                        <span className="text-[#8e8e8e]">{lab.panelCategory} · Priority: {lab.priority}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f0f9ff] text-[#006a8e] text-[10px] font-semibold border border-[#aaeaff]">
                        {lab.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: DEDICATED FULL-PAGE PATIENT LONGITUDINAL HISTORY & TIMELINE (Takes its OWN PAGE!) */
        <div className="space-y-6">
          {/* Header Bar for History Page */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e8e8] pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0e162b]">
                  Longitudinal Health Record
                </span>
                <span className="text-xs text-[#8e8e8e]">· Full Medical History</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0e162b] mt-0.5">
                Complete Clinical History &amp; Timeline
              </h2>
              <p className="text-xs text-[#8e8e8e]">
                Past outpatient visits, medication changes, diagnostic reports, and physician notes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentMode('encounter')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0e162b] text-white rounded-full text-xs font-semibold hover:bg-[#213364] transition-colors shadow-xs self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Active Consultation</span>
            </button>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Records', count: pastVisits.length + externalEncounters.length },
                {
                  id: 'external',
                  label: 'External Care Sources',
                  count: externalEncounters.length,
                },
                {
                  id: 'sealed',
                  label: 'Sealed (Consent Required)',
                  count: externalEncounters.filter((e) => e.accessStatus === 'Sealed').length,
                },
                {
                  id: 'granted',
                  label: 'Decrypted / Granted',
                  count: externalEncounters.filter((e) => e.accessStatus === 'Granted').length,
                },
                { id: 'internal', label: 'Internal Consultations', count: pastVisits.length },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setHistoryFilter(f.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                    historyFilter === f.id
                      ? 'bg-[#0e162b] text-white shadow-xs'
                      : 'bg-white border border-[#e8e8e8] text-[#606060] hover:text-[#0e162b] hover:border-[#0e162b]'
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      historyFilter === f.id ? 'bg-[#00c0fe] text-white' : 'bg-[#f0f2f5] text-[#606060]'
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-[#8e8e8e]" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Filter by facility, nurse, psychologist, note..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#e8e8e8] focus:border-[#00c0fe] rounded-full text-xs text-[#0e162b] placeholder-[#8e8e8e] focus:outline-none"
              />
            </div>
          </div>

          {/* TIMELINE CARDS: Internal Visits + External Healthcare Encounters */}
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#e8e8e8] before:z-0">
            {/* 1. EXTERNAL ENCOUNTERS (Cross-Facility Records from Nurses, Psychologists, Physiotherapists, Physiologists, Clinics) */}
            {externalEncounters
              .filter((enc) => {
                if (historyFilter === 'internal') return false;
                if (historyFilter === 'sealed' && enc.accessStatus !== 'Sealed') return false;
                if (historyFilter === 'granted' && enc.accessStatus !== 'Granted') return false;
                if (historySearch) {
                  const q = historySearch.toLowerCase();
                  return (
                    enc.facilityName.toLowerCase().includes(q) ||
                    enc.providerName.toLowerCase().includes(q) ||
                    enc.providerType.toLowerCase().includes(q) ||
                    enc.encounterCategory.toLowerCase().includes(q) ||
                    enc.summarySnippet.toLowerCase().includes(q)
                  );
                }
                return true;
              })
              .map((enc) => (
                <div key={enc.id} className="relative z-10 pl-12 space-y-3">
                  {/* Timeline node icon */}
                  <div
                    className={`absolute left-3 top-4 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center shadow-2xs border-2 ${
                      enc.accessStatus === 'Granted'
                        ? 'bg-[#1fc16b] text-white border-[#84ebb4]'
                        : enc.accessStatus === 'Pending Approval'
                        ? 'bg-[#dfb400] text-white border-[#ffdb43] animate-pulse'
                        : 'bg-[#0e162b] text-white border-[#e8e8e8]'
                    }`}
                  >
                    {enc.accessStatus === 'Granted' ? (
                      <Unlock className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : enc.accessStatus === 'Pending Approval' ? (
                      <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </div>

                  {/* External Record Card */}
                  <div
                    className={`bg-white border rounded-3xl p-6 shadow-2xs transition-shadow space-y-4 ${
                      enc.accessStatus === 'Granted'
                        ? 'border-[#84ebb4]'
                        : enc.accessStatus === 'Pending Approval'
                        ? 'border-[#ffdb43]/40 bg-gradient-to-b from-[#fffef0] to-white'
                        : 'border-[#e8e8e8]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e8e8e8] pb-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
                            enc.accessStatus === 'Granted'
                              ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                              : enc.accessStatus === 'Pending Approval'
                              ? 'bg-[#ffdb43]/20 text-[#dfb400]'
                              : 'bg-[#0e162b] text-white'
                          }`}
                        >
                          {enc.date}
                        </span>
                        <span className="text-xs text-[#717171] font-medium">{enc.time}</span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            enc.providerType === 'Physiotherapist'
                              ? 'bg-[#E6F7FF] text-[#0066CC]'
                              : enc.providerType === 'Clinical Psychologist'
                              ? 'bg-[#F9F0FF] text-[#722ED1]'
                              : enc.providerType === 'Nurse Practitioner'
                              ? 'bg-[#E6FFFB] text-[#08979C]'
                              : enc.providerType === 'Exercise Physiologist'
                              ? 'bg-[#FCF1E6] text-[#D46B08]'
                              : 'bg-[#FFF0F6] text-[#C41D7F]'
                          }`}
                        >
                          {enc.providerType}
                        </span>
                        <span className="text-xs text-[#717171] font-medium hidden sm:inline">
                          ID: {enc.id}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {enc.accessStatus === 'Granted' ? (
                          <span className="px-3 py-1 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] text-xs font-bold flex items-center space-x-1 border border-[#1fc16b]/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Access Granted &amp; Decrypted</span>
                          </span>
                        ) : enc.accessStatus === 'Pending Approval' ? (
                          <span className="px-3 py-1 rounded-full bg-[#ffdb43]/20 text-[#dfb400] text-xs font-bold flex items-center space-x-1 border border-[#dfb400]/25 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Awaiting Patient Mobile Approval</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-[#f0f9ff] text-[#006a8e] text-xs font-bold flex items-center space-x-1 border border-[#aaeaff]">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Record Sealed · Request Needed</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Originating Facility & Practitioner Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[#8e8e8e] font-semibold block">Originating Source</span>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <Building2 className="w-4 h-4 text-[#00c0fe] shrink-0" />
                          <span className="font-bold text-[#0e162b] text-sm">{enc.facilityName}</span>
                        </div>
                        <span className="text-[11px] text-[#8e8e8e] block mt-0.5">
                          {enc.providerName} · {enc.providerRoleTitle}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#8e8e8e] font-semibold block">Encounter Classification</span>
                        <span className="text-sm font-bold text-[#0e162b] block mt-0.5">
                          {enc.encounterCategory}
                        </span>
                        <span className="text-[11px] text-[#8e8e8e] block mt-0.5">
                          Facility Type: {enc.facilityType}
                        </span>
                      </div>
                    </div>

                    {/* Partial Information (Always visible to the clinic) */}
                    <div className="p-4 bg-[#f7f8fa] rounded-2xl border border-[#e8e8e8] text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e8e]">
                          Partial Information (Pre-Consent Summary)
                        </span>
                        <span className="text-[10px] text-[#606060] font-medium bg-white px-2 py-0.5 rounded-full border border-[#e8e8e8]">
                          Disclosed Synopsis
                        </span>
                      </div>
                      <p className="text-[#0e162b] leading-relaxed italic">
                        &ldquo;{enc.summarySnippet}&rdquo;
                      </p>
                    </div>

                    {/* ACCESS STATUS STATE RENDERING */}

                    {/* 1. SEALED STATE */}
                    {enc.accessStatus === 'Sealed' && (
                      <div className="p-5 rounded-2xl bg-[#f0f9ff] border border-[#aaeaff] space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-[#00c0fe] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <Lock className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-[#0e162b] uppercase tracking-wider">
                              Confidential Clinical Records Sealed (Protected Health Data)
                            </h4>
                            <p className="text-xs text-[#606060] leading-relaxed">
                              This encounter originates from an external {enc.providerType.toLowerCase()} ({enc.facilityName}).
                              Under Patient Consent Sovereignty, clinical SOAP narratives, specialized biometric measurements,
                              and prescription orders are sealed until authorized by {activeEncounter.patientName}.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-[#aaeaff]">
                          <div className="flex items-center space-x-2 text-[11px] text-[#8e8e8e]">
                            <Smartphone className="w-3.5 h-3.5 text-[#00c0fe]" />
                            <span>Dispatches cryptographic authorization prompt to patient&apos;s phone</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                submitAccessRequest(enc.id, 'Clinical Care Continuity & Treatment Planning');
                                setTimeout(() => simulatePatientConsentApproval(enc.id), 500);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-white border border-[#aaeaff] text-[#006a8e] hover:bg-[#f0f9ff] font-semibold text-xs transition-colors flex items-center space-x-1.5"
                              title="Fast-forward demonstration: Dispatches and immediately approves in 1 step"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#00c0fe]" />
                              <span>⚡ Instant Auto-Grant</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openRequestAccessModal(enc)}
                              className="px-4 py-2 rounded-xl bg-[#0e162b] hover:bg-[#213364] text-white font-semibold text-xs transition-colors shadow-xs flex items-center space-x-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Request Full Record Access</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. PENDING APPROVAL STATE */}
                    {enc.accessStatus === 'Pending Approval' && (
                      <div className="p-5 rounded-2xl bg-[#ffdb43]/10 border border-[#ffdb43]/30 space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-[#dfb400] text-white flex items-center justify-center shrink-0 mt-0.5 relative shadow-xs">
                            <Smartphone className="w-5 h-5 stroke-[2.2]" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#dfb400] animate-ping" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xs font-bold text-[#0e162b] uppercase tracking-wider">
                                Consent Request Dispatched · Awaiting Patient Mobile Approval
                              </h4>
                              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-semibold text-[#dfb400] border border-[#ffdb43]">
                                Active Prompt
                              </span>
                            </div>
                            <p className="text-xs text-[#606060] leading-relaxed">
                              Requested on <strong className="text-[#0e162b]">{enc.requestedAt}</strong> by {enc.requestedByDoctor}.
                              Clinical Purpose: <strong className="text-[#0e162b]">{enc.requestPurpose || 'Care Continuity'}</strong>.
                              A push notification is awaiting approval on {activeEncounter.patientName}&apos;s mobile device (+251 91 142 8890).
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-[#e8e8e8]">
                          <div className="flex items-center space-x-2 text-[11px] text-[#8e8e8e]">
                            <Clock className="w-3.5 h-3.5 text-[#dfb400]" />
                            <span>Simulate patient opening the prompt and tapping &ldquo;Authorize Access&rdquo;</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => simulatePatientConsentApproval(enc.id)}
                            className="px-4 py-2 rounded-xl bg-[#1fc16b] hover:bg-[#19a55a] text-white font-semibold text-xs transition-colors shadow-xs flex items-center space-x-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>⚡ Simulate Patient Approval on Phone</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3. GRANTED / DECRYPTED STATE */}
                    {enc.accessStatus === 'Granted' && (
                      <div className="space-y-4">
                        {/* Verified Banner */}
                        <div className="p-3.5 rounded-2xl bg-[#84ebb4]/15 border border-[#84ebb4] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="flex items-center space-x-2 text-[#1fc16b]">
                            <CheckCircle2 className="w-4 h-4 text-[#1fc16b] shrink-0" />
                            <span className="font-bold">
                              Full Record Access Decrypted · Patient Consent Verified
                            </span>
                            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-mono text-[#1fc16b] border border-[#84ebb4]">
                              {enc.consentToken || 'CH-CONSENT-VERIFIED'}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-[#8e8e8e]">
                              Approved: {enc.approvedAt || 'Today'}
                            </span>
                            <button
                              type="button"
                              onClick={() => revokeRecordAccess(enc.id)}
                              className="px-2.5 py-1 rounded-lg border border-[#e8e8e8] hover:border-[#0e162b] text-[#8e8e8e] hover:text-[#0e162b] text-[10px] font-semibold transition-colors flex items-center space-x-1"
                              title="Return this record to Sealed state to re-test the request workflow"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Seal Again (Re-test)</span>
                            </button>
                          </div>
                        </div>

                        {/* Specialized Vitals & Metrics (Decrypted) */}
                        {enc.fullData?.vitals && (
                          <div className="p-3.5 bg-[#f7f8fa] rounded-2xl border border-[#e8e8e8] text-xs font-mono text-[#0e162b] space-y-1">
                            <div className="flex items-center justify-between font-sans">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e8e]">
                                Decrypted Specialist Biometrics &amp; Functional Metrics
                              </span>
                              <span className="text-[10px] text-[#1fc16b] font-semibold">Verified</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-sans text-xs">
                              {Object.entries(enc.fullData.vitals).map(([k, v]) => (
                                <div key={k} className="p-2 bg-white rounded-xl border border-[#e8e8e8]">
                                  <span className="text-[10px] text-[#8e8e8e] capitalize block">
                                    {k.replace(/([A-Z])/g, ' $1')}
                                  </span>
                                  <span className="font-bold text-[#0e162b]">{String(v)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Decrypted Clinical SOAP Narrative */}
                        {enc.fullData?.notes && (
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#8e8e8e] uppercase tracking-wider text-[10px]">
                                Decrypted Clinical SOAP Encounter Notes
                              </span>
                              <span className="text-[10px] text-[#1fc16b] font-semibold flex items-center space-x-1">
                                <Unlock className="w-3 h-3" />
                                <span>Confidential Disclosure Authorized</span>
                              </span>
                            </div>
                            <div className="p-4 bg-[#f7f8fa] rounded-2xl border border-[#e8e8e8] text-[#0e162b] leading-relaxed whitespace-pre-line text-xs font-normal">
                              {enc.fullData.notes}
                            </div>
                          </div>
                        )}

                        {/* Diagnoses & Orders / Prescriptions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#e8e8e8] text-xs">
                          <div>
                            <span className="font-bold text-[#8e8e8e] block mb-1.5">
                              Documented Diagnoses ({enc.fullData?.diagnoses?.length || 0})
                            </span>
                            <ul className="space-y-1">
                              {(enc.fullData?.diagnoses || []).map((d, i) => (
                                <li key={i} className="flex items-center space-x-2 text-[#0e162b]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#1fc16b] shrink-0" />
                                  <span className="font-semibold text-[#0e162b]">{d.code}</span>
                                  <span>—</span>
                                  <span>{d.description}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="font-bold text-[#8e8e8e] block mb-1.5">
                              Prescriptions &amp; Clinical Protocols ({enc.fullData?.prescriptions?.length || 0})
                            </span>
                            <ul className="space-y-1">
                              {(enc.fullData?.prescriptions || []).map((p, i) => (
                                <li key={i} className="flex items-center space-x-2 text-[#0e162b]">
                                  <Pill className="w-3.5 h-3.5 text-[#00c0fe] shrink-0" />
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Attached Documents */}
                        {(enc.fullData?.attachments || []).length > 0 && (
                          <div className="pt-2 border-t border-[#e8e8e8] text-xs">
                            <span className="font-bold text-[#8e8e8e] block mb-1.5">
                              Decrypted Diagnostic Attachments ({enc.fullData?.attachments.length})
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {enc.fullData?.attachments.map((att, i) => (
                                <div
                                  key={i}
                                  className="px-3 py-1.5 rounded-xl bg-[#f0f2f5] border border-[#e8e8e8] text-[#0e162b] font-medium flex items-center space-x-2 text-xs"
                                >
                                  <FileText className="w-3.5 h-3.5 text-[#00c0fe]" />
                                  <span>{att}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Attending Signature */}
                        <div className="pt-2 border-t border-[#e8e8e8] flex items-center justify-between text-[11px] text-[#8e8e8e]">
                          <div className="flex items-center space-x-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#1fc16b]" />
                            <span>Digital Signature: <strong className="text-[#0e162b]">{enc.providerName}</strong> ({enc.providerRoleTitle})</span>
                          </div>
                          <span className="font-mono">Facility: {enc.facilityName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

            {/* 2. INTERNAL CLINIC VISITS */}
            {pastVisits
              .filter((visit) => {
                if (historyFilter === 'external' || historyFilter === 'sealed' || historyFilter === 'granted') {
                  return false;
                }
                if (historySearch) {
                  const q = historySearch.toLowerCase();
                  return (
                    visit.doctor.toLowerCase().includes(q) ||
                    visit.diagnosis.toLowerCase().includes(q) ||
                    visit.notes.toLowerCase().includes(q) ||
                    visit.facility.toLowerCase().includes(q)
                  );
                }
                return true;
              })
              .map((visit) => (
                <div key={visit.id} className="relative z-10 pl-12 space-y-3">
                  {/* Timeline node icon */}
                  <div className="absolute left-3 top-4 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-4 border-[#0e162b] shadow-2xs" />

                  {/* Visit Timeline Card */}
                  <div className="bg-white border border-[#e8e8e8] rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e8e8e8] pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 rounded-full bg-[#0e162b] text-white font-mono text-xs font-bold">
                          {visit.date}
                        </span>
                        <span className="text-xs text-[#8e8e8e] font-medium">{visit.time}</span>
                        <span className="text-sm font-bold text-[#0e162b]">{visit.type}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-[#8e8e8e]">{visit.facility}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] text-[10px] font-bold border border-[#1fc16b]/20">
                          {visit.status}
                        </span>
                      </div>
                    </div>

                    {/* Diagnosis & Attending Doctor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[#8e8e8e] font-semibold block">Attending Physician</span>
                        <span className="text-sm font-bold text-[#0e162b]">{visit.doctor}</span>
                      </div>
                      <div>
                        <span className="text-[#8e8e8e] font-semibold block">Diagnosed Condition</span>
                        <span className="text-sm font-bold text-[#0e162b]">{visit.diagnosis}</span>
                      </div>
                    </div>

                    {/* Recorded Vitals at this visit */}
                    <div className="p-3 bg-[#f7f8fa] rounded-2xl text-xs font-mono text-[#0e162b]">
                      <span className="text-[#8e8e8e] font-sans font-semibold mr-2">Recorded Vitals:</span>
                      {visit.vitalsSummary}
                    </div>

                    {/* Physician Narrative Notes */}
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-[#8e8e8e] uppercase tracking-wider text-[10px]">
                        Clinical SOAP Encounter Notes
                      </span>
                      <p className="text-[#0e162b] bg-[#f7f8fa] p-3.5 rounded-2xl leading-relaxed border border-[#e8e8e8]">
                        {visit.notes}
                      </p>
                    </div>

                    {/* Prescriptions & Diagnostic findings at that visit */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#e8e8e8] text-xs">
                      <div>
                        <span className="font-bold text-[#8e8e8e] block mb-1">
                          Prescribed Medications ({visit.prescriptions.length})
                        </span>
                        <ul className="space-y-1">
                          {visit.prescriptions.map((p, i) => (
                            <li key={i} className="flex items-center space-x-2 text-[#0e162b]">
                              <Pill className="w-3.5 h-3.5 text-[#00c0fe] shrink-0" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-bold text-[#8e8e8e] block mb-1">
                          Diagnostic Investigations
                        </span>
                        <ul className="space-y-1">
                          {visit.labs.map((l, i) => (
                            <li key={i} className="flex items-center space-x-2 text-[#0e162b]">
                              <FlaskConical className="w-3.5 h-3.5 text-[#00c0fe] shrink-0" />
                              <span>{l}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. DOCTOR ENCOUNTER RESULTS MODAL (Modal Flow for Results Entry) */}
      <DoctorEncounterResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
      />

      {/* 5. ADDENDUM MODAL (If encounter is locked) */}
      {isAddAmendmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e8e8e8] space-y-4">
            <h3 className="text-base font-bold text-[#0e162b]">
              Append Legal Medical Record Addendum
            </h3>
            <p className="text-xs text-[#8e8e8e]">
              This encounter is officially signed. Any addendum will be permanently time-stamped and attached to the audit trail.
            </p>
            <textarea
              rows={4}
              value={amendmentText}
              onChange={(e) => setAmendmentText(e.target.value)}
              placeholder="State the addendum, new clinical finding, or laboratory update..."
              className="w-full p-3.5 bg-[#f5f7fa] border border-[#e8e8e8] focus:border-[#00c0fe] focus:bg-white rounded-2xl text-xs text-[#0e162b] focus:outline-none transition-colors"
            />
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddAmendmentOpen(false)}
                className="px-4 py-2 rounded-full border border-[#e8e8e8] text-xs font-semibold text-[#8e8e8e] hover:text-[#0e162b]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAmendmentSubmit}
                className="px-5 py-2 rounded-full bg-[#0e162b] text-white text-xs font-semibold hover:bg-[#213364] transition-colors"
              >
                Save Addendum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
