import React, { useState, useMemo } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  MaternalRecord,
  AncContactVisit,
  AncRiskClassification,
  MaternalMedicationTrackingItem,
  MaternalFollowUpSchedule,
  ExternalHistoricalEncounter,
} from '../../../types/operations';
import {
  HeartPulse,
  Search,
  Plus,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Pill,
  FlaskConical,
  ShieldCheck,
  Lock,
  Unlock,
  UserPlus,
  Edit3,
  Stethoscope,
  Activity,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Check,
  Building2,
  Eye,
  User,
} from 'lucide-react';

type WorkspaceSubTab =
  | 'chart'
  | 'registration'
  | 'risk'
  | 'medications'
  | 'followup'
  | 'shared';

export const ViewMaternalTracking: React.FC = () => {
  const {
    patients,
    maternalRecords,
    selectedMaternalPatientId,
    setSelectedMaternalPatientId,
    updateMaternalRegistration,
    updateMaternalRiskAssessment,
    saveMaternalContactVisit,
    addMaternalMedicationItem,
    updateMaternalMedicationAdherence,
    scheduleMaternalFollowUp,
    updateMaternalFollowUpStatus,
    enrollNewMaternalPatient,
    labRequests,
    orderLabTest,
    externalEncounters,
    openRequestAccessModal,
    simulatePatientConsentApproval,
    setSelectedPatientId,
    setIsPrescribeModalOpen,
    setIsOrderLabModalOpen,
  } = useClinicOperations();

  // Registry filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Routine' | 'High-Risk' | '3rd Trimester' | 'Overdue'
  >('All');

  // Workspace active tab
  const [activeSubTab, setActiveSubTab] = useState<WorkspaceSubTab>('chart');

  // Slide-over Drawers & Modals
  const [editingContact, setEditingContact] = useState<AncContactVisit | null>(null);
  const [contactStep, setContactStep] = useState<1 | 2 | 3 | 4>(1);
  const [isPatientProfileDrawerOpen, setIsPatientProfileDrawerOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [viewingSharedEncounter, setViewingSharedEncounter] =
    useState<ExternalHistoricalEncounter | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3200);
  };

  const openContactDrawer = (contact: AncContactVisit) => {
    setEditingContact(contact);
    setContactStep(1);
  };

  const selectedRecord = useMemo(
    () => maternalRecords.find((r) => r.patientId === selectedMaternalPatientId),
    [maternalRecords, selectedMaternalPatientId]
  );

  // Filtered registry list
  const filteredRecords = useMemo(() => {
    return maternalRecords.filter((rec) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rec.patientName.toLowerCase().includes(q) ||
        rec.ancRegistrationNumber.toLowerCase().includes(q) ||
        rec.patientId.toLowerCase().includes(q) ||
        rec.affiliatedDoctorName.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (statusFilter === 'Routine') {
        return rec.riskAssessment.classification === 'Routine ANC (Basic Component)';
      }
      if (statusFilter === 'High-Risk') {
        return rec.riskAssessment.classification === 'Specialized / High-Risk Care';
      }
      if (statusFilter === '3rd Trimester') {
        return rec.trimester === '3rd Trimester';
      }
      if (statusFilter === 'Overdue') {
        return (
          rec.contacts.some((c) => c.status === 'Overdue') ||
          rec.followUpSchedules.some((f) => f.status === 'Overdue')
        );
      }
      return true;
    });
  }, [maternalRecords, searchQuery, statusFilter]);

  // Enroll New Maternal Patient Form State
  const unenrolledFemalePatients = useMemo(() => {
    const enrolledIds = new Set(maternalRecords.map((m) => m.patientId));
    return patients.filter((p) => p.sex === 'Female' && !enrolledIds.has(p.id));
  }, [patients, maternalRecords]);

  const [enrollForm, setEnrollForm] = useState({
    patientId: '',
    ancRegistrationNumber: `ANC-2026-0${Math.floor(200 + Math.random() * 700)}`,
    lmpDate: '2026-07-15',
    eddDate: '2027-04-21',
    currentGestationalWeeks: 14,
    currentGestationalDays: 3,
    gravida: 2,
    para: 1,
    childrenAlive: 1,
    maritalStatus: 'Married' as MaternalRecord['maritalStatus'],
  });

  // Registration Edit State
  const [regForm, setRegForm] = useState<{
    ancRegistrationNumber: string;
    lmpDate: string;
    eddDate: string;
    currentGestationalWeeks: number;
    currentGestationalDays: number;
    trimester: MaternalRecord['trimester'];
    gravida: number;
    para: number;
    childrenAlive: number;
    maritalStatus: MaternalRecord['maritalStatus'];
    deliveryPlanFacility: string;
    carePlanSummary: string;
    emergencyReadinessNotes: string;
  } | null>(null);

  React.useEffect(() => {
    if (selectedRecord) {
      setRegForm({
        ancRegistrationNumber: selectedRecord.ancRegistrationNumber,
        lmpDate: selectedRecord.lmpDate,
        eddDate: selectedRecord.eddDate,
        currentGestationalWeeks: selectedRecord.currentGestationalWeeks,
        currentGestationalDays: selectedRecord.currentGestationalDays,
        trimester: selectedRecord.trimester,
        gravida: selectedRecord.gravida,
        para: selectedRecord.para,
        childrenAlive: selectedRecord.childrenAlive,
        maritalStatus: selectedRecord.maritalStatus,
        deliveryPlanFacility: selectedRecord.deliveryPlanFacility,
        carePlanSummary: selectedRecord.carePlanSummary,
        emergencyReadinessNotes: selectedRecord.emergencyReadinessNotes,
      });
    }
  }, [selectedRecord]);

  // Add Medication Modal State
  const [newMedForm, setNewMedForm] = useState({
    name: '',
    category: 'Supplement / Prophylaxis' as MaternalMedicationTrackingItem['category'],
    dosageAndSchedule: '',
    prescribedStatus: 'Active' as MaternalMedicationTrackingItem['prescribedStatus'],
    patientReportedAdherence: 'Adherent (Daily)' as MaternalMedicationTrackingItem['patientReportedAdherence'],
    adherenceNotes: '',
  });

  // Schedule Follow-Up Modal State
  const [newScheduleForm, setNewScheduleForm] = useState({
    scheduledDate: '2026-11-08',
    scheduledTime: '10:00',
    targetGestationalWeeks: 32,
    intervalType: 'Bi-Weekly (2-Weekly)' as MaternalFollowUpSchedule['intervalType'],
    contactPurpose: 'ANC Follow-Up Contact — Maternal BP, Fundal Height & Fetal Heart Rate',
    clinicalReminderNotes: '',
  });

  const handleLmpChange = (lmp: string, isEnroll = false) => {
    const d = new Date(lmp);
    if (!Number.isNaN(d.getTime())) {
      const edd = new Date(d.getTime() + 280 * 24 * 60 * 60 * 1000);
      const eddStr = edd.toISOString().split('T')[0];
      if (isEnroll) {
        setEnrollForm((prev) => ({ ...prev, lmpDate: lmp, eddDate: eddStr }));
      } else if (regForm) {
        setRegForm({ ...regForm, lmpDate: lmp, eddDate: eddStr });
      }
    } else if (isEnroll) {
      setEnrollForm((prev) => ({ ...prev, lmpDate: lmp }));
    } else if (regForm) {
      setRegForm({ ...regForm, lmpDate: lmp });
    }
  };

  // Summary metrics
  const totalEnrolled = maternalRecords.length;
  const highRiskCount = maternalRecords.filter(
    (m) => m.riskAssessment.classification === 'Specialized / High-Risk Care'
  ).length;
  const overdueContactsCount = maternalRecords.filter(
    (m) =>
      m.contacts.some((c) => c.status === 'Overdue') ||
      m.followUpSchedules.some((f) => f.status === 'Overdue')
  ).length;
  const thirdTrimesterCount = maternalRecords.filter(
    (m) => m.trimester === '3rd Trimester'
  ).length;

  // Helper to keep matrix cell text concise
  const shortText = (val?: string, max = 38) => {
    if (!val || !val.trim()) return '—';
    const clean = val.trim();
    return clean.length > max ? `${clean.slice(0, max)}…` : clean;
  };

  // ============================================================================
  // RENDER 1: MATERNAL REGISTRY TABLE VIEW (WHEN NO PATIENT IS OPENED)
  // ============================================================================
  if (!selectedRecord) {
    return (
      <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8e8e8e]">
              Antenatal Care &amp; Longitudinal Registry
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0e162b] tracking-tight mt-1">
              Maternal Tracking &amp; Antenatal Care (ANC)
            </h1>
            <p className="text-xs sm:text-sm text-[#606060] mt-0.5">
              Longitudinal 8-contact antenatal care, risk classification, and cross-clinic maternal records
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (unenrolledFemalePatients.length > 0 && !enrollForm.patientId) {
                setEnrollForm((prev) => ({ ...prev, patientId: unenrolledFemalePatients[0].id }));
              }
              setIsEnrollModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0e162b] hover:bg-[#213364] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-[#00c0fe]" />
            <span>Enroll Mother in ANC</span>
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
                Enrolled Mothers
              </p>
              <p className="text-2xl font-bold text-[#0e162b] tabular-nums mt-1">{totalEnrolled}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#00c0fe]/10 text-[#00c0fe] flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
                Specialized / High-Risk
              </p>
              <p className="text-2xl font-bold text-[#0e162b] tabular-nums mt-1">{highRiskCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
                3rd Trimester (&ge;28 Wks)
              </p>
              <p className="text-2xl font-bold text-[#0e162b] tabular-nums mt-1">
                {thirdTrimesterCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#1fc16b]/10 text-[#1fc16b] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
                Overdue Contacts
              </p>
              <p className="text-2xl font-bold text-[#0e162b] tabular-nums mt-1">
                {overdueContactsCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fb3748]/10 text-[#fb3748] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8e8e8e] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mother's name, ANC ID, MRN, or doctor..."
              className="w-full pl-9 pr-4 py-2 bg-[#f5f7fa] border border-[#e8e8e8] rounded-xl text-xs sm:text-sm text-[#0e162b] placeholder:text-[#8e8e8e] focus:outline-none focus:border-[#00c0fe]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'Routine', 'High-Risk', '3rd Trimester', 'Overdue'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  statusFilter === tab
                    ? 'bg-[#0e162b] text-white shadow-2xs'
                    : 'bg-[#f5f7fa] text-[#606060] hover:text-[#0e162b]'
                }`}
              >
                {tab === 'All' ? 'All Enrolled' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Maternal Registry Table */}
        <div className="bg-white border border-[#e8e8e8] rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f7fa] border-b border-[#e8e8e8] text-xs font-semibold text-[#606060] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mother &amp; ANC ID</th>
                  <th className="py-3.5 px-4">GA &amp; EDD</th>
                  <th className="py-3.5 px-4">Parity &amp; Blood</th>
                  <th className="py-3.5 px-4">Classification</th>
                  <th className="py-3.5 px-4">Contacts</th>
                  <th className="py-3.5 px-4">Next Follow-Up</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e8e8] text-xs sm:text-sm">
                {filteredRecords.map((rec) => {
                  const completedContacts = rec.contacts.filter(
                    (c) => c.status === 'Completed'
                  ).length;
                  const totalContacts = rec.contacts.length;
                  const nextFollowUp = rec.followUpSchedules[0];
                  const isHighRisk =
                    rec.riskAssessment.classification === 'Specialized / High-Risk Care';
                  const hasOverdue =
                    rec.contacts.some((c) => c.status === 'Overdue') ||
                    rec.followUpSchedules.some((f) => f.status === 'Overdue');

                  return (
                    <tr
                      key={rec.id}
                      onClick={() => {
                        setSelectedMaternalPatientId(rec.patientId);
                        setSelectedPatientId(rec.patientId);
                      }}
                      className="hover:bg-[#f5f7fa]/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#0e162b] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {rec.patientName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-[#0e162b] group-hover:text-[#00c0fe] transition-colors">
                              {rec.patientName}
                            </div>
                            <div className="text-xs text-[#8e8e8e]">
                              {rec.ancRegistrationNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 tabular-nums">
                        <div className="font-bold text-[#0e162b]">
                          {rec.currentGestationalWeeks}w {rec.currentGestationalDays}d
                        </div>
                        <div className="text-xs text-[#606060]">EDD: {rec.eddDate}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-semibold text-[#0e162b] tabular-nums">
                          G{rec.gravida} P{rec.para}
                        </span>
                        <span className="ml-2 inline-block px-2 py-0.5 rounded text-xs font-bold bg-[#f0f2f5] text-[#0e162b] border border-[#e8e8e8]">
                          {rec.bloodType}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isHighRisk
                              ? 'bg-[#fb3748]/10 text-[#d00416]'
                              : 'bg-[#1fc16b]/15 text-[#1fc16b]'
                          }`}
                        >
                          {isHighRisk ? 'High-Risk Care' : 'Routine ANC'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-xs font-semibold text-[#0e162b] tabular-nums mb-1">
                          {completedContacts}/{totalContacts} Completed
                        </div>
                        <div className="w-24 h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00c0fe] rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((completedContacts / totalContacts) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-4 px-4 tabular-nums">
                        {nextFollowUp ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#0e162b]">
                              {nextFollowUp.scheduledDate}
                            </span>
                            {hasOverdue && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#fb3748]/10 text-[#d00416] font-semibold">
                                Overdue
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#8e8e8e]">—</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMaternalPatientId(rec.patientId);
                            setSelectedPatientId(rec.patientId);
                          }}
                          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-[#0e162b] hover:bg-[#00c0fe] text-white text-xs font-semibold transition-colors"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enroll Mother Modal */}
        {isEnrollModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white border border-[#e8e8e8] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-[#00c0fe]" />
                  <h3 className="text-base sm:text-lg font-bold text-[#0e162b]">
                    Enroll Mother in Antenatal Care
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="p-1 rounded-lg text-[#8e8e8e] hover:text-[#0e162b]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {unenrolledFemalePatients.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#f5f7fa] text-xs sm:text-sm text-[#606060]">
                  All registered female patients are already enrolled in Maternal Tracking.
                </div>
              ) : (
                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold text-[#0e162b] mb-1">
                      Select Female Patient
                    </label>
                    <select
                      value={enrollForm.patientId}
                      onChange={(e) =>
                        setEnrollForm({ ...enrollForm, patientId: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#e8e8e8] bg-[#f5f7fa] text-[#0e162b]"
                    >
                      {unenrolledFemalePatients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.fullName} ({p.id} · {p.age}y · Blood {p.bloodType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#0e162b] mb-1">
                        ANC Registration #
                      </label>
                      <input
                        type="text"
                        value={enrollForm.ancRegistrationNumber}
                        onChange={(e) =>
                          setEnrollForm({
                            ...enrollForm,
                            ancRegistrationNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#0e162b] mb-1">
                        Marital Status
                      </label>
                      <select
                        value={enrollForm.maritalStatus}
                        onChange={(e) =>
                          setEnrollForm({
                            ...enrollForm,
                            maritalStatus: e.target.value as MaternalRecord['maritalStatus'],
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                      >
                        <option value="Married">Married</option>
                        <option value="Single">Single</option>
                        <option value="Domestic Partnership">Domestic Partnership</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#0e162b] mb-1">LMP Date</label>
                      <input
                        type="date"
                        value={enrollForm.lmpDate}
                        onChange={(e) => handleLmpChange(e.target.value, true)}
                        className="w-full px-3 py-2 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#0e162b] mb-1">EDD Date</label>
                      <input
                        type="date"
                        value={enrollForm.eddDate}
                        onChange={(e) =>
                          setEnrollForm({ ...enrollForm, eddDate: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e8e8e8]">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#e8e8e8] text-xs sm:text-sm font-semibold text-[#606060]"
                >
                  Cancel
                </button>
                {unenrolledFemalePatients.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      enrollNewMaternalPatient(enrollForm);
                      setIsEnrollModalOpen(false);
                    }}
                    className="px-5 py-2 rounded-full bg-[#0e162b] hover:bg-[#00c0fe] text-white text-xs sm:text-sm font-semibold transition-colors"
                  >
                    Enroll &amp; Open
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // RENDER 2: CLEAN MATERNAL WORKSPACE WITH COMPACT HEADER & SLIDE-OVER DRAWERS
  // ============================================================================
  const patientLabs = labRequests.filter((l) => l.patientId === selectedRecord.patientId);
  const patientExternalEncounters = externalEncounters.filter(
    (e) => e.patientId === selectedRecord.patientId
  );
  const isHighRisk =
    selectedRecord.riskAssessment.classification === 'Specialized / High-Risk Care';
  const flaggedRiskCount =
    selectedRecord.riskAssessment.obstetricHistory.filter((i) => i.present).length +
    selectedRecord.riskAssessment.currentPregnancy.filter((i) => i.present).length +
    selectedRecord.riskAssessment.generalMedical.filter((i) => i.present).length;

  return (
    <div className="p-6 sm:p-8 space-y-5 max-w-[1600px] mx-auto">
      {/* Feedback Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0e162b] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#1fc16b] shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Patient Bar: Back Arrow + Non-Clickable Patient Info + End Action Buttons */}
      <div className="bg-white border border-[#e8e8e8] rounded-2xl shadow-2xs overflow-hidden">
        <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Compact Icon-Only Back Arrow */}
            <button
              type="button"
              onClick={() => setSelectedMaternalPatientId(null)}
              title="Back to Maternal Registry"
              className="w-10 h-10 rounded-xl bg-[#f5f7fa] hover:bg-[#0e162b] text-[#0e162b] hover:text-white flex items-center justify-center transition-colors border border-[#e8e8e8] shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Subject Profile (Non-clickable) */}
            <div className="flex items-center gap-3 text-left">
              <div className="w-11 h-11 rounded-xl bg-[#0e162b] text-white font-bold text-sm flex items-center justify-center shrink-0">
                {selectedRecord.patientName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-[#0e162b]">
                    {selectedRecord.patientName}
                  </h1>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#f0f2f5] text-[#0e162b] border border-[#e8e8e8]/60">
                    {selectedRecord.ancRegistrationNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isHighRisk
                        ? 'bg-[#fb3748]/10 text-[#d00416]'
                        : 'bg-[#84ebb4]/25 text-[#1fc16b]'
                    }`}
                  >
                    {isHighRisk ? 'High-Risk ANC' : 'Routine ANC'}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-[#606060] flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-[#0e162b] tabular-nums">
                    {selectedRecord.currentGestationalWeeks}w {selectedRecord.currentGestationalDays}d
                  </span>
                  <span>·</span>
                  <span>{selectedRecord.trimester}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right End of Top Navbar: Record Contact, Order Lab, Prescribe + View Maternal Profile */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextScheduled =
                  selectedRecord.contacts.find(
                    (c) => c.status === 'Scheduled' || c.status === 'Overdue'
                  ) || selectedRecord.contacts[0];
                if (nextScheduled) {
                  openContactDrawer(nextScheduled);
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#0e162b] hover:bg-[#213364] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <Stethoscope className="w-4 h-4 text-[#00c0fe]" />
              <span>Record Contact</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPatientId(selectedRecord.patientId);
                setIsOrderLabModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#f5f7fa] hover:bg-[#e8e8e8] text-[#0e162b] text-xs sm:text-sm font-semibold transition-colors border border-[#e8e8e8]"
            >
              <FlaskConical className="w-4 h-4 text-[#0e162b]" />
              <span>Order Lab</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPatientId(selectedRecord.patientId);
                setIsPrescribeModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#f5f7fa] hover:bg-[#e8e8e8] text-[#0e162b] text-xs sm:text-sm font-semibold transition-colors border border-[#e8e8e8]"
            >
              <Pill className="w-4 h-4 text-[#0e162b]" />
              <span>Prescribe</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPatientProfileDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#f5f7fa] hover:bg-[#e8e8e8] text-[#0e162b] text-xs sm:text-sm font-semibold transition-colors border border-[#e8e8e8]"
            >
              <User className="w-4 h-4 text-[#00c0fe]" />
              <span>View Maternal Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Standalone Left-Aligned Section Navigation Bar (At least 44px height, between Top Navbar and ANC Content) */}
      <div className="flex flex-wrap items-center justify-start gap-2 py-1">
        {[
          { id: 'chart' as const, label: 'Contents-of-Care Chart' },
          { id: 'registration' as const, label: 'ANC Registration' },
          { id: 'risk' as const, label: `Risk Classification (${flaggedRiskCount})` },
          { id: 'medications' as const, label: 'Labs & Medications' },
          { id: 'followup' as const, label: 'Follow-Up Schedule' },
          {
            id: 'shared' as const,
            label: `Shared Records (${patientExternalEncounters.length})`,
          },
        ].map((tab) => {
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`min-h-[44px] h-11 px-5 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center justify-center transition-all border ${
                active
                  ? 'bg-[#0e162b] text-white border-[#0e162b] shadow-2xs'
                  : 'bg-white text-[#606060] border-[#e8e8e8] hover:text-[#0e162b] hover:bg-[#f5f7fa]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ====================================================================
          SUB-TAB 1: SIMPLIFIED, SCANNABLE 8-CONTACT CONTENTS-OF-CARE CHART
      ==================================================================== */}
      {activeSubTab === 'chart' && (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e8e8e8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0e162b]">
                ANC Contents-of-Care Summary Matrix (8 Contacts)
              </h2>
              <p className="text-xs sm:text-sm text-[#606060] mt-0.5">
                Select any contact column to open the step-by-step clinical drawer for that visit.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextNum = selectedRecord.contacts.length + 1;
                const newCustomContact: AncContactVisit = {
                  id: `CNT-${selectedRecord.id}-${nextNum}`,
                  contactNumber: nextNum,
                  targetWeeksLabel: `Contact ${nextNum} (Custom)`,
                  status: 'Scheduled',
                  date: new Date().toISOString().split('T')[0],
                  gestationalAgeWeeks: selectedRecord.currentGestationalWeeks,
                  gestationalAgeDays: selectedRecord.currentGestationalDays,
                  attendingPractitioner: selectedRecord.affiliatedDoctorName,
                  presentPregnancyComplaints: '',
                  pastPregnancyHistoryNotes: '',
                  medicalAndSurgicalHistoryNotes: '',
                  mentalHealthAndSocialHistory: '',
                  physicalExam: {
                    weightKg: '',
                    bloodPressure: '',
                    pallor: '',
                    jaundice: '',
                    edema: '',
                    breastAndChestExam: '',
                    symphysisFundalHeightCm: '',
                    fetalPresentation: '',
                    fetalHeartRateBpm: '',
                    fetalMovement: '',
                  },
                  investigations: {
                    hemoglobin: '',
                    bloodGroupAndRh: selectedRecord.bloodType,
                    urinalysisProteinGlucose: '',
                    syphilisHivHepBScreening: '',
                    bloodGlucoseOgtt: '',
                    ultrasoundFindings: '',
                    otherLabs: '',
                  },
                  medicationsAndVaccines: {
                    ironAndFolicAcid: '',
                    calciumSupplementation: '',
                    tetanusDiphtheriaVaccine: '',
                    dewormingOrIptp: '',
                    otherPrescriptions: '',
                  },
                  adviceAndCounselling: '',
                  clinicalAssessmentAndDangerSigns: '',
                  actionsTaken: '',
                  nextAppointmentDate: '',
                };
                openContactDrawer(newCustomContact);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f5f7fa] hover:bg-[#0e162b] text-[#0e162b] hover:text-white text-xs sm:text-sm font-semibold transition-colors border border-[#e8e8e8]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#f5f7fa] border-b border-[#e8e8e8]">
                  <th className="py-3.5 px-4 font-bold text-[#0e162b] min-w-[200px] sticky left-0 bg-[#f5f7fa] z-10 border-r border-[#e8e8e8] text-xs sm:text-sm">
                    Clinical Parameter
                  </th>
                  {selectedRecord.contacts.map((contact) => (
                    <th
                      key={contact.id}
                      onClick={() => openContactDrawer(contact)}
                      className="py-3.5 px-4 min-w-[180px] border-r border-[#e8e8e8] cursor-pointer hover:bg-[#00c0fe]/10 transition-colors group"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-[#0e162b] group-hover:text-[#00c0fe]">
                          {contact.targetWeeksLabel.replace(' (Up to 12 wks)', ' (12w)')}
                        </span>
                        <Edit3 className="w-3.5 h-3.5 text-[#8e8e8e] group-hover:text-[#00c0fe] shrink-0" />
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1.5">
                        <span className="text-xs font-medium text-[#606060] tabular-nums">
                          {contact.date || '—'}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            contact.status === 'Completed'
                              ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                              : contact.status === 'Overdue'
                              ? 'bg-[#fb3748]/15 text-[#d00416]'
                              : contact.status === 'Scheduled'
                              ? 'bg-[#00c0fe]/15 text-[#008fbf]'
                              : 'bg-[#f0f2f5] text-[#606060]'
                          }`}
                        >
                          {contact.status}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e8e8e8]">
                {[
                  {
                    label: 'Gestational Age',
                    render: (c: AncContactVisit) =>
                      c.gestationalAgeWeeks
                        ? `${c.gestationalAgeWeeks}w ${c.gestationalAgeDays || 0}d`
                        : '—',
                  },
                  {
                    label: 'BP & Weight',
                    render: (c: AncContactVisit) =>
                      c.physicalExam.bloodPressure || c.physicalExam.weightKg
                        ? `${c.physicalExam.bloodPressure.replace(' mmHg', '') || '—'} · ${
                            c.physicalExam.weightKg || '—'
                          }`
                        : '—',
                  },
                  {
                    label: 'Fundal Height & FHR',
                    render: (c: AncContactVisit) =>
                      c.physicalExam.symphysisFundalHeightCm ||
                      c.physicalExam.fetalHeartRateBpm
                        ? `${
                            c.physicalExam.symphysisFundalHeightCm.replace(
                              ' (At symphysis)',
                              ''
                            ).replace(' (At umbilicus)', '') || '—'
                          } · ${c.physicalExam.fetalHeartRateBpm.replace(' (Doppler)', '') || '—'}`
                        : '—',
                  },
                  {
                    label: 'Presentation & Fetal Move',
                    render: (c: AncContactVisit) =>
                      c.physicalExam.fetalPresentation || c.physicalExam.fetalMovement
                        ? `${shortText(c.physicalExam.fetalPresentation, 24)} · ${shortText(
                            c.physicalExam.fetalMovement,
                            24
                          )}`
                        : '—',
                  },
                  {
                    label: 'Hemoglobin & Urine',
                    render: (c: AncContactVisit) =>
                      c.investigations.hemoglobin || c.investigations.urinalysisProteinGlucose
                        ? `Hb ${shortText(c.investigations.hemoglobin, 14)} · ${shortText(
                            c.investigations.urinalysisProteinGlucose,
                            22
                          )}`
                        : '—',
                  },
                  {
                    label: 'Ultrasound / Key Labs',
                    render: (c: AncContactVisit) =>
                      shortText(
                        c.investigations.ultrasoundFindings ||
                          c.investigations.bloodGlucoseOgtt,
                        42
                      ),
                  },
                  {
                    label: 'Iron/Folate & Prophylaxis',
                    render: (c: AncContactVisit) =>
                      shortText(
                        c.medicationsAndVaccines.ironAndFolicAcid ||
                          c.medicationsAndVaccines.tetanusDiphtheriaVaccine,
                        42
                      ),
                  },
                  {
                    label: 'Next Visit Date',
                    render: (c: AncContactVisit) => c.nextAppointmentDate || '—',
                  },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-[#f5f7fa]/60">
                    <td className="py-3.5 px-4 font-semibold text-[#0e162b] sticky left-0 bg-white border-r border-[#e8e8e8] z-10 text-xs sm:text-sm">
                      {row.label}
                    </td>
                    {selectedRecord.contacts.map((contact) => {
                      const val = row.render(contact);
                      return (
                        <td
                          key={contact.id}
                          onClick={() => openContactDrawer(contact)}
                          className={`py-3.5 px-4 border-r border-[#e8e8e8] cursor-pointer hover:bg-[#00c0fe]/5 tabular-nums ${
                            val === '—' ? 'text-[#8e8e8e]' : 'text-[#0e162b]'
                          }`}
                        >
                          <div className="text-xs sm:text-sm leading-snug">{val}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================================
          SUB-TAB 2: STEP A — ANC REGISTRATION & PREGNANCY INFORMATION
      ==================================================================== */}
      {activeSubTab === 'registration' && regForm && (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0e162b]">
                ANC Registration &amp; Pregnancy Details
              </h2>
              <p className="text-xs sm:text-sm text-[#606060] mt-0.5">
                Core booking identifiers, menstrual dating, parity, and delivery readiness
              </p>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#00c0fe] bg-[#0e162b] px-3.5 py-1.5 rounded-full">
              {regForm.ancRegistrationNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-[#0e162b] mb-1">
                ANC Registration #
              </label>
              <input
                type="text"
                value={regForm.ancRegistrationNumber}
                onChange={(e) =>
                  setRegForm({ ...regForm, ancRegistrationNumber: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0e162b] mb-1">LMP Date</label>
              <input
                type="date"
                value={regForm.lmpDate}
                onChange={(e) => handleLmpChange(e.target.value, false)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0e162b] mb-1">EDD Date</label>
              <input
                type="date"
                value={regForm.eddDate}
                onChange={(e) => setRegForm({ ...regForm, eddDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0e162b] mb-1">Marital Status</label>
              <select
                value={regForm.maritalStatus}
                onChange={(e) =>
                  setRegForm({
                    ...regForm,
                    maritalStatus: e.target.value as MaternalRecord['maritalStatus'],
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
              >
                <option value="Married">Married</option>
                <option value="Single">Single</option>
                <option value="Domestic Partnership">Domestic Partnership</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#0e162b] mb-1">GA (Weeks)</label>
              <input
                type="number"
                min={1}
                max={42}
                value={regForm.currentGestationalWeeks}
                onChange={(e) =>
                  setRegForm({
                    ...regForm,
                    currentGestationalWeeks: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0e162b] mb-1">Gravida (G)</label>
              <input
                type="number"
                min={1}
                value={regForm.gravida}
                onChange={(e) => setRegForm({ ...regForm, gravida: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0e162b] mb-1">Para (P)</label>
              <input
                type="number"
                min={0}
                value={regForm.para}
                onChange={(e) => setRegForm({ ...regForm, para: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0e162b] mb-1">Children Alive</label>
              <input
                type="number"
                min={0}
                value={regForm.childrenAlive}
                onChange={(e) =>
                  setRegForm({ ...regForm, childrenAlive: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-[#0e162b] mb-1">
                Planned Delivery Facility
              </label>
              <input
                type="text"
                value={regForm.deliveryPlanFacility}
                onChange={(e) =>
                  setRegForm({ ...regForm, deliveryPlanFacility: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0e162b] mb-1">
                Emergency Readiness Notes
              </label>
              <input
                type="text"
                value={regForm.emergencyReadinessNotes}
                onChange={(e) =>
                  setRegForm({ ...regForm, emergencyReadinessNotes: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#e8e8e8]">
            <button
              type="button"
              onClick={() => {
                updateMaternalRegistration(selectedRecord.id, regForm);
                showFeedback('ANC Registration updated.');
              }}
              className="px-5 py-2.5 rounded-full bg-[#0e162b] hover:bg-[#00c0fe] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          SUB-TAB 3: STEP B — RISK CLASSIFICATION & ASSESSMENT
      ==================================================================== */}
      {activeSubTab === 'risk' && (
        <div className="space-y-5">
          <div className="bg-white border border-[#e8e8e8] rounded-2xl p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0e162b]">
                ANC Risk Classification &amp; Care Pathway
              </h2>
              <p className="text-xs sm:text-sm text-[#606060] mt-0.5">
                Signed by {selectedRecord.riskAssessment.evaluatedBy} ({selectedRecord.riskAssessment.evaluatedAt})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  'Routine ANC (Basic Component)',
                  'Specialized / High-Risk Care',
                ] as AncRiskClassification[]
              ).map((option) => {
                const selected = selectedRecord.riskAssessment.classification === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      updateMaternalRiskAssessment(selectedRecord.id, {
                        ...selectedRecord.riskAssessment,
                        classification: option,
                        evaluatedBy: selectedRecord.affiliatedDoctorName,
                        evaluatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
                      });
                      showFeedback(`Risk pathway updated to ${option}`);
                    }}
                    className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
                      selected
                        ? option === 'Specialized / High-Risk Care'
                          ? 'bg-[#fb3748] text-white border-[#fb3748]'
                          : 'bg-[#1fc16b] text-white border-[#1fc16b]'
                        : 'bg-[#f5f7fa] text-[#0e162b] border-[#e8e8e8]'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {(
              [
                { key: 'obstetricHistory' as const, title: '1. Obstetric History' },
                { key: 'currentPregnancy' as const, title: '2. Current Pregnancy' },
                { key: 'generalMedical' as const, title: '3. General Medical History' },
                {
                  key: 'physicalExamAndCounselling' as const,
                  title: '4. Baseline Exam & Screening',
                },
              ] as const
            ).map((section) => {
              const items = selectedRecord.riskAssessment[section.key];
              return (
                <div
                  key={section.key}
                  className="bg-white border border-[#e8e8e8] rounded-2xl p-5 shadow-2xs space-y-2.5"
                >
                  <h3 className="text-base font-bold text-[#0e162b] pb-1.5 border-b border-[#e8e8e8]">
                    {section.title}
                  </h3>
                  {items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f5f7fa]/70 border border-[#e8e8e8] cursor-pointer text-xs sm:text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={item.present}
                        onChange={(e) => {
                          const updatedGroup = items.map((i) =>
                            i.id === item.id ? { ...i, present: e.target.checked } : i
                          );
                          updateMaternalRiskAssessment(selectedRecord.id, {
                            ...selectedRecord.riskAssessment,
                            [section.key]: updatedGroup,
                          });
                        }}
                        className="mt-0.5 rounded border-[#8e8e8e]"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-[#0e162b]">{item.label}</div>
                        {item.notes && (
                          <div className="text-xs text-[#606060] mt-0.5">{item.notes}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================
          SUB-TAB 4: STEP D — LABS, PRESCRIPTIONS & ADHERENCE
      ==================================================================== */}
      {activeSubTab === 'medications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#e8e8e8] rounded-2xl shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-[#e8e8e8] flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#0e162b]">
                Supplements, Immunizations &amp; Adherence
              </h2>
              <button
                type="button"
                onClick={() => setIsAddMedModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0e162b] text-white text-xs sm:text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="divide-y divide-[#e8e8e8]">
              {selectedRecord.medicationTracking.map((med) => (
                <div key={med.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[#0e162b]">{med.name}</div>
                    <div className="text-xs text-[#606060] mt-0.5">
                      {med.dosageAndSchedule}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#f0f2f5] text-[#0e162b] font-semibold">
                      Rx: {med.prescribedStatus}
                    </span>
                    <select
                      value={med.patientReportedAdherence}
                      onChange={(e) =>
                        updateMaternalMedicationAdherence(
                          selectedRecord.id,
                          med.id,
                          e.target.value as MaternalMedicationTrackingItem['patientReportedAdherence'],
                          med.prescribedStatus,
                          med.adherenceNotes
                        )
                      }
                      className="px-3 py-1.5 rounded-full border border-[#e8e8e8] text-xs font-semibold bg-[#f5f7fa] text-[#0e162b]"
                    >
                      <option value="Adherent (Daily)">Adherent (Daily)</option>
                      <option value="Partial / Occasional Missed Dose">Partial / Missed Dose</option>
                      <option value="Administered in Clinic">Administered in Clinic</option>
                      <option value="Not Started">Not Started</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e8e8e8] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-[#0e162b]">Antenatal Labs</h3>
              <button
                type="button"
                onClick={() => {
                  orderLabTest(
                    'ANC Hemoglobin & Urinalysis Panel',
                    'Hematology',
                    `ANC Surveillance (${selectedRecord.ancRegistrationNumber})`,
                    'Routine',
                    'Standard sample'
                  );
                  showFeedback('ANC Lab Panel ordered.');
                }}
                className="text-xs sm:text-sm font-semibold text-[#00c0fe] hover:underline"
              >
                + Quick Order
              </button>
            </div>
            {patientLabs.length === 0 ? (
              <p className="text-xs sm:text-sm text-[#8e8e8e]">No pending lab orders.</p>
            ) : (
              patientLabs.map((lab) => (
                <div key={lab.id} className="p-3.5 rounded-xl bg-[#f5f7fa] border border-[#e8e8e8] text-xs sm:text-sm">
                  <div className="font-bold text-[#0e162b]">{lab.testType}</div>
                  <div className="text-xs text-[#606060] mt-0.5">{lab.status}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          SUB-TAB 5: STEP E — FOLLOW-UP SCHEDULE
      ==================================================================== */}
      {activeSubTab === 'followup' && (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-[#e8e8e8] flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#0e162b]">
              Scheduled Antenatal Follow-Ups
            </h2>
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0e162b] text-white text-xs sm:text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Visit</span>
            </button>
          </div>
          <div className="divide-y divide-[#e8e8e8]">
            {selectedRecord.followUpSchedules.map((fup) => (
              <div key={fup.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#0e162b] tabular-nums">
                      {fup.scheduledDate} · {fup.scheduledTime}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f0f2f5] text-[#0e162b] font-medium">
                      {fup.intervalType}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        fup.status === 'Overdue'
                          ? 'bg-[#fb3748]/15 text-[#d00416]'
                          : 'bg-[#84ebb4]/25 text-[#1fc16b]'
                      }`}
                    >
                      {fup.status}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-[#606060] mt-1">{fup.contactPurpose}</div>
                </div>
                {fup.status !== 'Completed' && (
                  <button
                    type="button"
                    onClick={() =>
                      updateMaternalFollowUpStatus(selectedRecord.id, fup.id, 'Completed')
                    }
                    className="px-4 py-2 rounded-full bg-[#f5f7fa] hover:bg-[#1fc16b] text-[#0e162b] hover:text-white text-xs sm:text-sm font-semibold transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          SUB-TAB 6: STEP F — SHARED EXTERNAL MATERNAL RECORDS
      ==================================================================== */}
      {activeSubTab === 'shared' && (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-5 shadow-2xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#0e162b]">
            Cross-Clinic Shared Maternal Records
          </h2>
          {patientExternalEncounters.map((enc) => {
            const isGranted = enc.accessStatus === 'Granted';
            const isPending = enc.accessStatus === 'Pending Approval';
            return (
              <div
                key={enc.id}
                className="p-4 rounded-xl border border-[#e8e8e8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#0e162b] tabular-nums">
                      {enc.date}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#0e162b]">
                      {enc.facilityName}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        isGranted
                          ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                          : 'bg-[#f0f2f5] text-[#606060]'
                      }`}
                    >
                      {enc.accessStatus}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#0e162b] mt-1">
                    {enc.encounterCategory}
                  </div>
                </div>
                <div>
                  {isGranted ? (
                    <button
                      type="button"
                      onClick={() => setViewingSharedEncounter(enc)}
                      className="px-4 py-2 rounded-full bg-[#0e162b] text-white text-xs sm:text-sm font-semibold"
                    >
                      View Details
                    </button>
                  ) : isPending ? (
                    <button
                      type="button"
                      onClick={() => simulatePatientConsentApproval(enc.id)}
                      className="px-4 py-2 rounded-full bg-amber-500 text-white text-xs sm:text-sm font-semibold"
                    >
                      Approve Consent
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openRequestAccessModal(enc)}
                      className="px-4 py-2 rounded-full bg-[#0e162b] text-white text-xs sm:text-sm font-semibold"
                    >
                      Request Access
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          SLIDE-OVER 1: MATERNAL PATIENT PROFILE DRAWER (MATCHING PATIENT DETAILS UI)
      ==================================================================== */}
      {isPatientProfileDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsPatientProfileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-[#e8e8e8] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-[#e8e8e8] flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#0e162b] text-white flex items-center justify-center font-bold text-base shrink-0">
                    {selectedRecord.patientName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-[#0e162b]">
                        {selectedRecord.patientName}
                      </h2>
                      <span className="text-xs bg-[#f0f2f5] text-[#0e162b] px-2.5 py-0.5 rounded-md font-semibold">
                        {selectedRecord.ancRegistrationNumber}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#606060] mt-0.5">
                      {selectedRecord.patientAge} years old · {selectedRecord.maritalStatus} ·{' '}
                      {selectedRecord.phone}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPatientProfileDrawerOpen(false)}
                  className="p-2 text-[#8e8e8e] hover:text-[#0e162b] hover:bg-[#f0f2f5] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body: Organized Maternal Metrics (GA, Parity, Blood Type, LMP, EDD) */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-[#f5f7fa] border border-[#e8e8e8]">
                    <span className="text-xs text-[#8e8e8e] font-medium block">
                      Gestational Age (GA)
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#0e162b] tabular-nums mt-0.5 block">
                      {selectedRecord.currentGestationalWeeks}w{' '}
                      {selectedRecord.currentGestationalDays}d
                    </span>
                    <span className="text-xs text-[#008fbf] font-semibold">
                      {selectedRecord.trimester}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f5f7fa] border border-[#e8e8e8]">
                    <span className="text-xs text-[#8e8e8e] font-medium block">
                      Obstetric Parity
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#0e162b] tabular-nums mt-0.5 block">
                      G{selectedRecord.gravida} P{selectedRecord.para}
                    </span>
                    <span className="text-xs text-[#606060]">
                      {selectedRecord.childrenAlive} Living Child(ren)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f5f7fa] border border-[#e8e8e8]">
                    <span className="text-xs text-[#8e8e8e] font-medium block">LMP &amp; EDD</span>
                    <div className="font-semibold text-[#0e162b] tabular-nums mt-1">
                      LMP: {selectedRecord.lmpDate}
                    </div>
                    <div className="font-bold text-[#0e162b] tabular-nums mt-0.5">
                      EDD: {selectedRecord.eddDate}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f5f7fa] border border-[#e8e8e8]">
                    <span className="text-xs text-[#8e8e8e] font-medium block">
                      Blood Group &amp; Rh
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#0e162b] mt-0.5 block">
                      {selectedRecord.bloodType}
                    </span>
                    <span className="text-xs text-[#606060]">
                      Attending: {selectedRecord.affiliatedDoctorName}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f5f7fa] border border-[#e8e8e8] space-y-1.5">
                  <div className="text-base font-bold text-[#0e162b]">
                    Risk Classification &amp; Care Plan
                  </div>
                  <div className="text-[#008fbf] font-semibold">
                    {selectedRecord.riskAssessment.classification}
                  </div>
                  <p className="text-[#606060] leading-relaxed">
                    {selectedRecord.carePlanSummary}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f5f7fa] border border-[#e8e8e8] space-y-1.5">
                  <div className="text-base font-bold text-[#0e162b]">
                    Delivery &amp; Emergency Readiness
                  </div>
                  <div className="text-[#0e162b] font-medium">
                    Facility: {selectedRecord.deliveryPlanFacility}
                  </div>
                  <p className="text-[#606060] leading-relaxed">
                    {selectedRecord.emergencyReadinessNotes}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-[#e8e8e8] bg-[#f5f7fa] flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsPatientProfileDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#0e162b] text-white text-xs sm:text-sm font-semibold"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SLIDE-OVER 2: STEP-BY-STEP ANC CONTACT VISIT DRAWER (MATCHING PATIENT DETAILS UI)
      ==================================================================== */}
      {editingContact && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setEditingContact(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-[#e8e8e8] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
              {/* Drawer Top Header matching Patient Details Drawer */}
              <div className="p-5 sm:p-6 border-b border-[#e8e8e8] bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#0e162b] text-[#00c0fe] flex items-center justify-center font-bold text-sm shrink-0">
                      C{editingContact.contactNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-[#0e162b]">
                          {editingContact.targetWeeksLabel}
                        </h2>
                        <span className="text-xs bg-[#f0f2f5] text-[#0e162b] px-2.5 py-0.5 rounded-md font-semibold">
                          {selectedRecord.patientName}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#606060] mt-0.5">
                        Step {contactStep} of 4 · Guided Antenatal Contact Documentation
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingContact(null)}
                    className="p-2 text-[#8e8e8e] hover:text-[#0e162b] hover:bg-[#f0f2f5] rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Step-by-Step Progress Tabs inside Drawer Header */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
                  {[
                    { step: 1 as const, title: '1. Pregnancy & Visit' },
                    { step: 2 as const, title: '2. Physical Exam' },
                    { step: 3 as const, title: '3. Investigations' },
                    { step: 4 as const, title: '4. Care & Next Visit' },
                  ].map((s) => {
                    const isActive = contactStep === s.step;
                    const isDone = contactStep > s.step;
                    return (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => setContactStep(s.step)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                          isActive
                            ? 'bg-[#0e162b] text-white border-[#0e162b]'
                            : isDone
                            ? 'bg-[#84ebb4]/20 text-[#0e162b] border-[#1fc16b]/30'
                            : 'bg-[#f5f7fa] text-[#606060] border-[#e8e8e8]'
                        }`}
                      >
                        <div className="truncate">{s.title}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Drawer Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
                {/* STEP 1: PREGNANCY & VISIT HISTORY */}
                {contactStep === 1 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#f5f7fa] border border-[#e8e8e8] grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Contact Date
                        </label>
                        <input
                          type="date"
                          value={editingContact.date || ''}
                          onChange={(e) =>
                            setEditingContact({ ...editingContact, date: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#e8e8e8] bg-white text-[#0e162b]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          GA Weeks
                        </label>
                        <input
                          type="number"
                          value={editingContact.gestationalAgeWeeks || ''}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              gestationalAgeWeeks: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#e8e8e8] bg-white text-[#0e162b]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          GA Days
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={6}
                          value={editingContact.gestationalAgeDays ?? ''}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              gestationalAgeDays: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#e8e8e8] bg-white text-[#0e162b]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Status
                        </label>
                        <select
                          value={editingContact.status}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              status: e.target.value as AncContactVisit['status'],
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#e8e8e8] bg-white font-semibold text-[#0e162b]"
                        >
                          <option value="Completed">Completed</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Upcoming">Upcoming</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#0e162b] mb-1.5">
                        Present Pregnancy History &amp; Maternal Complaints
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Record current symptoms, nausea, fetal movement perception, or any discomfort..."
                        value={editingContact.presentPregnancyComplaints}
                        onChange={(e) =>
                          setEditingContact({
                            ...editingContact,
                            presentPregnancyComplaints: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#0e162b] mb-1.5">
                        Mental Health, Family &amp; Social Support Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Sleep quality, mood screening, partner/family support..."
                        value={editingContact.mentalHealthAndSocialHistory}
                        onChange={(e) =>
                          setEditingContact({
                            ...editingContact,
                            mentalHealthAndSocialHistory: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: MATERNAL & FETAL PHYSICAL EXAMINATION */}
                {contactStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Blood Pressure (mmHg)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 116/74 mmHg"
                          value={editingContact.physicalExam.bloodPressure}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              physicalExam: {
                                ...editingContact.physicalExam,
                                bloodPressure: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Maternal Weight (kg)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 67.3 kg"
                          value={editingContact.physicalExam.weightKg}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              physicalExam: {
                                ...editingContact.physicalExam,
                                weightKg: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Symphysis-Fundal Height (cm)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 28 cm"
                          value={editingContact.physicalExam.symphysisFundalHeightCm}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              physicalExam: {
                                ...editingContact.physicalExam,
                                symphysisFundalHeightCm: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Fetal Heart Rate (FHR)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 146 bpm"
                          value={editingContact.physicalExam.fetalHeartRateBpm}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              physicalExam: {
                                ...editingContact.physicalExam,
                                fetalHeartRateBpm: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Fetal Presentation
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Cephalic"
                          value={editingContact.physicalExam.fetalPresentation}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              physicalExam: {
                                ...editingContact.physicalExam,
                                fetalPresentation: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Fetal Movement
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Active"
                          value={editingContact.physicalExam.fetalMovement}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              physicalExam: {
                                ...editingContact.physicalExam,
                                fetalMovement: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Pallor / Jaundice
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Absent"
                          value={editingContact.physicalExam.pallor}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              physicalExam: {
                                ...editingContact.physicalExam,
                                pallor: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Edema
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. None / Trace ankle"
                          value={editingContact.physicalExam.edema}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              physicalExam: {
                                ...editingContact.physicalExam,
                                edema: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: INVESTIGATIONS (ULTRASOUND & LABS) */}
                {contactStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Hemoglobin (Hb)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 12.1 g/dL"
                          value={editingContact.investigations.hemoglobin}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              investigations: {
                                ...editingContact.investigations,
                                hemoglobin: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Urinalysis (Protein / Glucose)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Protein Neg · Glucose Neg"
                          value={editingContact.investigations.urinalysisProteinGlucose}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              investigations: {
                                ...editingContact.investigations,
                                urinalysisProteinGlucose: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Blood Glucose / 75g OGTT
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Fasting 84 mg/dL"
                          value={editingContact.investigations.bloodGlucoseOgtt}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              investigations: {
                                ...editingContact.investigations,
                                bloodGlucoseOgtt: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Blood Group / Rh / Coombs
                        </label>
                        <input
                          type="text"
                          value={editingContact.investigations.bloodGroupAndRh}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              investigations: {
                                ...editingContact.investigations,
                                bloodGroupAndRh: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#0e162b] mb-1.5">
                        Obstetric Ultrasound Findings
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Fetal biometry, placental localization, amniotic fluid volume..."
                        value={editingContact.investigations.ultrasoundFindings}
                        onChange={(e) =>
                          setEditingContact({
                            ...editingContact,
                            investigations: {
                              ...editingContact.investigations,
                              ultrasoundFindings: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: MEDICATIONS, ASSESSMENT & NEXT APPOINTMENT */}
                {contactStep === 4 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Iron &amp; Folic Acid
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Ferrous Fumarate 60mg + Folic Acid 400mcg"
                          value={editingContact.medicationsAndVaccines.ironAndFolicAcid}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              medicationsAndVaccines: {
                                ...editingContact.medicationsAndVaccines,
                                ironAndFolicAcid: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#0e162b] mb-1">
                          Calcium &amp; Prophylaxis / Vaccines
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Calcium 1000mg daily · Td booster"
                          value={editingContact.medicationsAndVaccines.calciumSupplementation}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              medicationsAndVaccines: {
                                ...editingContact.medicationsAndVaccines,
                                calciumSupplementation: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#0e162b] mb-1">
                        Clinical Assessment &amp; Danger Signs Check
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Summarize clinical assessment and confirm absence/presence of danger signs..."
                        value={editingContact.clinicalAssessmentAndDangerSigns}
                        onChange={(e) =>
                          setEditingContact({
                            ...editingContact,
                            clinicalAssessmentAndDangerSigns: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#0e162b] mb-1">
                        Counselling &amp; Next Scheduled Appointment Date
                      </label>
                      <input
                        type="date"
                        value={editingContact.nextAppointmentDate}
                        onChange={(e) =>
                          setEditingContact({
                            ...editingContact,
                            nextAppointmentDate: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer with Step Navigation + Fill Demo Data + Save */}
              <div className="p-4 border-t border-[#e8e8e8] bg-[#f5f7fa] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {contactStep > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setContactStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4)
                      }
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white border border-[#e8e8e8] text-xs sm:text-sm font-semibold text-[#0e162b]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                  )}
                  {contactStep < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        setContactStep((prev) => Math.min(4, prev + 1) as 1 | 2 | 3 | 4)
                      }
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#0e162b] text-white text-xs sm:text-sm font-semibold"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const gaW =
                        editingContact.gestationalAgeWeeks ||
                        selectedRecord.currentGestationalWeeks;
                      setEditingContact({
                        ...editingContact,
                        status: 'Completed',
                        date: new Date().toISOString().split('T')[0],
                        gestationalAgeWeeks: gaW,
                        gestationalAgeDays: 2,
                        attendingPractitioner: selectedRecord.affiliatedDoctorName,
                        presentPregnancyComplaints:
                          'Active fetal movements; no bleeding or headache.',
                        mentalHealthAndSocialHistory: 'Good sleep and family support.',
                        physicalExam: {
                          weightKg: '68.4 kg',
                          bloodPressure: '116/74 mmHg',
                          pallor: 'Absent',
                          jaundice: 'Absent',
                          edema: 'None',
                          breastAndChestExam: 'Normal',
                          symphysisFundalHeightCm: `${gaW} cm`,
                          fetalPresentation: 'Cephalic',
                          fetalHeartRateBpm: '146 bpm',
                          fetalMovement: 'Active',
                        },
                        investigations: {
                          hemoglobin: '12.0 g/dL',
                          bloodGroupAndRh: selectedRecord.bloodType,
                          urinalysisProteinGlucose: 'Neg / Neg',
                          syphilisHivHepBScreening: 'Negative',
                          bloodGlucoseOgtt: 'Fasting 84 mg/dL',
                          ultrasoundFindings: 'Single live fetus, normal AFI',
                          otherLabs: 'None',
                        },
                        medicationsAndVaccines: {
                          ironAndFolicAcid: 'Iron 60mg + Folic Acid 400mcg daily',
                          calciumSupplementation: 'Calcium 1000mg daily',
                          tetanusDiphtheriaVaccine: 'Up to date',
                          dewormingOrIptp: 'Completed',
                          otherPrescriptions: 'None',
                        },
                        adviceAndCounselling: 'Danger signs and kick counts reviewed.',
                        clinicalAssessmentAndDangerSigns:
                          'Normal antenatal progression; no danger signs.',
                        actionsTaken: 'Updated chart.',
                        nextAppointmentDate: '2026-11-15',
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#e8e8e8] hover:border-[#00c0fe] text-[#0e162b] text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#00c0fe]" />
                    <span>Fill with Demo Data</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      saveMaternalContactVisit(selectedRecord.id, {
                        ...editingContact,
                        status:
                          editingContact.status === 'Upcoming'
                            ? 'Completed'
                            : editingContact.status,
                      });
                      setEditingContact(null);
                      showFeedback(`${editingContact.targetWeeksLabel} saved.`);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1fc16b] hover:bg-[#18a359] text-white text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Contact</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: ADD SUPPLEMENT / VACCINE
      ==================================================================== */}
      {isAddMedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#e8e8e8] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3">
              <h3 className="text-base sm:text-lg font-bold text-[#0e162b]">
                Add Supplement / Vaccine
              </h3>
              <button
                type="button"
                onClick={() => setIsAddMedModalOpen(false)}
                className="text-[#8e8e8e] hover:text-[#0e162b]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#0e162b] mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ferrous Fumarate 60mg + Folic Acid 400mcg"
                  value={newMedForm.name}
                  onChange={(e) => setNewMedForm({ ...newMedForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#0e162b] mb-1">Dosage</label>
                <input
                  type="text"
                  placeholder="e.g. 1 tablet once daily"
                  value={newMedForm.dosageAndSchedule}
                  onChange={(e) =>
                    setNewMedForm({ ...newMedForm, dosageAndSchedule: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#e8e8e8]">
              <button
                type="button"
                onClick={() => setIsAddMedModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#e8e8e8] text-[#606060] font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newMedForm.name.trim()) return;
                  addMaternalMedicationItem(selectedRecord.id, {
                    ...newMedForm,
                    prescribedBy: selectedRecord.affiliatedDoctorName,
                    startDate: new Date().toISOString().split('T')[0],
                  });
                  setIsAddMedModalOpen(false);
                  showFeedback('Medication item added.');
                }}
                className="px-5 py-2 rounded-full bg-[#0e162b] text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: SCHEDULE ANC FOLLOW-UP
      ==================================================================== */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#e8e8e8] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3">
              <h3 className="text-base sm:text-lg font-bold text-[#0e162b]">
                Schedule ANC Follow-Up
              </h3>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-[#8e8e8e] hover:text-[#0e162b]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#0e162b] mb-1">Interval</label>
                <select
                  value={newScheduleForm.intervalType}
                  onChange={(e) =>
                    setNewScheduleForm({
                      ...newScheduleForm,
                      intervalType: e.target.value as MaternalFollowUpSchedule['intervalType'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                >
                  <option value="Monthly (4-Weekly)">Monthly (4-Weekly)</option>
                  <option value="Bi-Weekly (2-Weekly)">Bi-Weekly (2-Weekly)</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Twice Weekly">Twice Weekly</option>
                  <option value="Custom Date">Custom Date</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#0e162b] mb-1">Date</label>
                  <input
                    type="date"
                    value={newScheduleForm.scheduledDate}
                    onChange={(e) =>
                      setNewScheduleForm({
                        ...newScheduleForm,
                        scheduledDate: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0e162b] mb-1">Time</label>
                  <input
                    type="time"
                    value={newScheduleForm.scheduledTime}
                    onChange={(e) =>
                      setNewScheduleForm({
                        ...newScheduleForm,
                        scheduledTime: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#0e162b] mb-1">Purpose</label>
                <input
                  type="text"
                  value={newScheduleForm.contactPurpose}
                  onChange={(e) =>
                    setNewScheduleForm({
                      ...newScheduleForm,
                      contactPurpose: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e8e8] text-[#0e162b]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#e8e8e8]">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#e8e8e8] text-[#606060] font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  scheduleMaternalFollowUp(selectedRecord.id, {
                    ...newScheduleForm,
                    assignedDoctorName: selectedRecord.affiliatedDoctorName,
                    status: 'Scheduled',
                  });
                  setIsScheduleModalOpen(false);
                  showFeedback('Follow-up scheduled.');
                }}
                className="px-5 py-2 rounded-full bg-[#0e162b] text-white font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: SHARED EXTERNAL MATERNAL ENCOUNTER DETAILS
      ==================================================================== */}
      {viewingSharedEncounter && viewingSharedEncounter.fullRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#e8e8e8] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#0e162b]">
                  {viewingSharedEncounter.encounterCategory}
                </h3>
                <p className="text-xs sm:text-sm text-[#606060]">
                  {viewingSharedEncounter.facilityName} · {viewingSharedEncounter.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingSharedEncounter(null)}
                className="p-1 text-[#8e8e8e] hover:text-[#0e162b]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[#606060] leading-relaxed bg-[#f5f7fa] p-4 rounded-xl border border-[#e8e8e8]">
              {viewingSharedEncounter.fullRecord.clinicalNotes}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setViewingSharedEncounter(null)}
                className="px-4 py-2 rounded-full bg-[#0e162b] text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
