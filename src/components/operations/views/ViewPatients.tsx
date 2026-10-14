import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { RegisterPatientModal } from '../RegisterPatientModal';
import {
  Search,
  AlertTriangle,
  Pill,
  Phone,
  Mail,
  User,
  Plus,
  Stethoscope,
  Printer,
  ChevronRight,
  Lock,
  Unlock,
  Clock,
  ArrowLeft,
  Calendar,
  Share2,
  FileText,
  Activity,
  ReceiptText,
  DoorOpen,
} from 'lucide-react';

export const ViewPatients: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatient,
    appointments,
    prescriptions,
    documents,
    claims,
    labRequests,
    referrals,
    setActiveTab,
    startConsultation,
    setPrintDocumentData,
    externalEncounters,
    openRequestAccessModal,
  } = useClinicOperations();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeProfileTab, setActiveProfileTab] = useState<
    'overview' | 'visit' | 'history' | 'stats' | 'prescriptions' | 'referrals' | 'documents' | 'activity'
  >('overview');
  const [mobileTab, setMobileTab] = useState<'list' | 'chart'>('list');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const filteredPatients = (patients || []).filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activePatient = selectedPatient || (patients || [])[0];

  const patientAppointments = (appointments || []).filter((a) => a.patientId === activePatient?.id);
  const patientPrescriptions = (prescriptions || []).filter((r) => r.patientId === activePatient?.id);
  const patientDocuments = (documents || []).filter((d) => d.patientId === activePatient?.id);
  const patientClaims = (claims || []).filter((c) => c.patientId === activePatient?.id);
  const patientLabs = (labRequests || []).filter((l) => l.patientId === activePatient?.id);
  const patientReferrals = (referrals || []).filter((r) => r.patientId === activePatient?.id);
  const patientExternalEncounters = (externalEncounters || []).filter(
    (e) => e.patientId === activePatient?.id
  );

  // Latest / Current Appointment for Active Patient
  const currentAppointment = patientAppointments[0];

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setMobileTab('chart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EBEBEB] pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Patient Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Patient Registry
          </h1>
          <p className="text-xs sm:text-sm text-[#717171] mt-0.5">
            Identify patients, manage relationships, and inspect longitudinal clinical summaries
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsRegisterModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* 2. MAIN SPLIT VIEW (List on Left, Progressive Profile on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Simplified Patient Table (5 cols on lg) */}
        <div
          className={`lg:col-span-5 border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden space-y-3 ${
            mobileTab === 'chart' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Search and Status Filter */}
          <div className="p-3.5 border-b border-[#EBEBEB] space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#717171]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find patient by name, ID, or phone..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-full text-xs text-[#222222] placeholder-[#717171] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
              {['All', 'Active', 'Scheduled', 'Archived'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                    statusFilter === status
                      ? 'bg-[#0E2938] text-white font-medium'
                      : 'bg-[#F7F7F7] text-[#717171] hover:text-[#222222]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Simplified Table: Patient | Visit | Doctor | Status | Action */}
          <div className="divide-y divide-[#EBEBEB] max-h-[700px] overflow-y-auto">
            {filteredPatients.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#717171]">
                No patients match the search query.
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const isSelected = activePatient?.id === patient.id;
                const apt = (appointments || []).find((a) => a.patientId === patient.id);

                return (
                  <div
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient.id)}
                    className={`p-3.5 cursor-pointer transition-colors text-xs ${
                      isSelected ? 'bg-[#F5F8FA]' : 'hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-semibold truncate ${isSelected ? 'text-[#0E2938]' : 'text-[#222222]'}`}>
                            {patient.fullName}
                          </span>
                          <span className="text-[#717171] text-[11px] font-mono shrink-0">
                            {patient.id}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-[#717171] mt-0.5">
                          <span>{patient.age}y · {patient.sex}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">
                            {apt ? `${apt.visitType} with ${apt.doctorName.split(' ')[1] || apt.doctorName}` : 'Routine care'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-medium text-[#008A05]">
                          {patient.status}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#B0B0B0]" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Progressive Disclosure Patient Profile (7 cols on lg) */}
        <div
          className={`lg:col-span-7 border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden ${
            mobileTab === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          {activePatient ? (
            <div>
              {/* Mobile Back Button */}
              <div className="lg:hidden px-4 py-2 bg-[#F7F7F7] border-b border-[#EBEBEB] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setMobileTab('list')}
                  className="inline-flex items-center gap-1 font-semibold text-[#0E2938]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Registry</span>
                </button>
                <span className="font-mono text-[#717171]">{activePatient.id}</span>
              </div>

              {/* 1. PROGRESSIVE DISCLOSURE: Patient Summary Header */}
              <div className="p-5 border-b border-[#EBEBEB] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-[#222222]">
                        {activePatient.fullName}
                      </h2>
                      <span className="font-mono text-xs text-[#717171]">
                        {activePatient.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#717171] mt-1">
                      <span>{activePatient.age} years ({activePatient.sex})</span>
                      <span aria-hidden="true">·</span>
                      <span>Blood: <strong className="text-[#222222] font-medium">{activePatient.bloodType}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Assigned: <strong className="text-[#222222] font-medium">{currentAppointment?.doctorName || 'Dr. Almaz Tefera'}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#008A05] font-medium">{activePatient.status}</span>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentAppointment) startConsultation(currentAppointment.id);
                        setSelectedPatientId(activePatient.id);
                        setActiveTab('encounter');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Start Consultation</span>
                    </button>
                  </div>
                </div>

                {/* Important Clinical Alerts (if applicable) */}
                {(activePatient.clinicalAlerts || []).length > 0 && (
                  <div className="p-2.5 bg-[#FFF0F2] border border-[#FF385C]/20 rounded-xl flex items-center gap-2 text-xs text-[#C13515]">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span className="font-medium">
                      {(activePatient.clinicalAlerts || []).join(' · ')}
                    </span>
                  </div>
                )}

                {/* 2. PROGRESSIVE DISCLOSURE TABS */}
                <div className="flex items-center gap-4 overflow-x-auto border-b border-[#EBEBEB] pt-2 -mb-5 text-xs">
                  {[
                    { key: 'overview', label: 'Overview' },
                    { key: 'visit', label: 'Current Visit' },
                    { key: 'history', label: 'Visit History' },
                    { key: 'stats', label: 'Health Statistics' },
                    { key: 'prescriptions', label: 'Prescriptions' },
                    { key: 'referrals', label: 'Referrals' },
                    { key: 'documents', label: 'Documents' },
                    { key: 'activity', label: 'Activity' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveProfileTab(tab.key as typeof activeProfileTab)}
                      className={`pb-2.5 font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeProfileTab === tab.key
                          ? 'border-[#0E2938] text-[#0E2938] font-semibold'
                          : 'border-transparent text-[#717171] hover:text-[#222222]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. FOCUSED SECTION CONTENT */}
              <div className="p-5 text-xs space-y-4">
                {/* TAB 1: OVERVIEW */}
                {activeProfileTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-[#F7F7F7] rounded-xl space-y-1.5">
                        <span className="font-semibold text-[#717171] block">Documented Allergies</span>
                        <div className="space-y-1">
                          {(activePatient.allergies || []).map((allergy, i) => (
                            <div key={i} className="text-[#222222] font-medium">
                              • {allergy}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 bg-[#F7F7F7] rounded-xl space-y-1.5">
                        <span className="font-semibold text-[#717171] block">Chronic Conditions</span>
                        <div className="space-y-1">
                          {(activePatient.conditions || []).map((cond, i) => (
                            <div key={i} className="text-[#222222] font-medium">
                              • {cond}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#F7F7F7] rounded-xl space-y-2">
                      <span className="font-semibold text-[#717171] block">Active Medications</span>
                      <div className="divide-y divide-[#EBEBEB]">
                        {(activePatient.currentMedications || []).map((med, i) => (
                          <div key={i} className="py-1.5 flex justify-between">
                            <span className="font-medium text-[#222222]">{med}</span>
                            <span className="text-[#717171]">Ongoing prescription</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#F7F7F7] rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-[#717171] block">Emergency Contact</span>
                        <span className="font-medium text-[#222222]">
                          {typeof activePatient.emergencyContact === 'object' && activePatient.emergencyContact
                            ? `${activePatient.emergencyContact.name} (${activePatient.emergencyContact.relation || 'Contact'})`
                            : String(activePatient.emergencyContact || 'None Listed')}
                        </span>
                      </div>
                      <span className="text-[#717171] font-mono">
                        {typeof activePatient.emergencyContact === 'object' && activePatient.emergencyContact
                          ? activePatient.emergencyContact.phone
                          : activePatient.phone}
                      </span>
                    </div>
                  </div>
                )}

                {/* TAB 2: CURRENT VISIT */}
                {activeProfileTab === 'visit' && (
                  <div className="space-y-3">
                    {currentAppointment ? (
                      <div className="p-4 border border-[#EBEBEB] rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm text-[#222222]">
                            {currentAppointment.visitType} Encounter
                          </span>
                          <span className="font-medium text-[#008A05]">{currentAppointment.status}</span>
                        </div>
                        <div className="text-[#717171] space-y-1">
                          <p>Attending: <strong className="text-[#222222]">{currentAppointment.doctorName}</strong> ({currentAppointment.specialty})</p>
                          <p>Time & Date: {currentAppointment.date} at {currentAppointment.time}</p>
                          <p>Exam Room: {currentAppointment.room || 'Waiting Lounge'}</p>
                          <p className="pt-2 text-[#222222] italic">&ldquo;{currentAppointment.reasonForVisit}&rdquo;</p>
                        </div>
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              startConsultation(currentAppointment.id);
                              setActiveTab('encounter');
                            }}
                            className="px-4 py-2 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full font-semibold transition-colors"
                          >
                            Open Clinical Workspace
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-[#717171]">
                        No active encounter booked for today.
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: VISIT HISTORY */}
                {activeProfileTab === 'history' && (
                  <div className="space-y-3">
                    {patientAppointments.map((apt) => (
                      <div key={apt.id} className="p-3.5 bg-[#F7F7F7] rounded-xl space-y-1.5">
                        <div className="flex justify-between">
                          <span className="font-semibold text-[#222222]">{apt.date} · {apt.visitType}</span>
                          <span className="text-[#717171] font-mono">{apt.time}</span>
                        </div>
                        <p className="text-[#717171]">
                          Doctor: {apt.doctorName} · {apt.reasonForVisit}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: HEALTH STATISTICS */}
                {activeProfileTab === 'stats' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#F7F7F7] rounded-xl text-center">
                      <span className="text-[#717171] block">Blood Pressure</span>
                      <span className="text-base font-semibold text-[#222222] mt-1 block">120/80</span>
                      <span className="text-[10px] text-[#008A05]">Normal</span>
                    </div>
                    <div className="p-3 bg-[#F7F7F7] rounded-xl text-center">
                      <span className="text-[#717171] block">Heart Rate</span>
                      <span className="text-base font-semibold text-[#222222] mt-1 block">72 bpm</span>
                      <span className="text-[10px] text-[#008A05]">Regular</span>
                    </div>
                    <div className="p-3 bg-[#F7F7F7] rounded-xl text-center">
                      <span className="text-[#717171] block">Blood Glucose</span>
                      <span className="text-base font-semibold text-[#222222] mt-1 block">95 mg/dL</span>
                      <span className="text-[10px] text-[#008A05]">Fasting</span>
                    </div>
                    <div className="p-3 bg-[#F7F7F7] rounded-xl text-center">
                      <span className="text-[#717171] block">Oxygen Sat</span>
                      <span className="text-base font-semibold text-[#222222] mt-1 block">99%</span>
                      <span className="text-[10px] text-[#008A05]">Room Air</span>
                    </div>
                  </div>
                )}

                {/* TAB 5: PRESCRIPTIONS */}
                {activeProfileTab === 'prescriptions' && (
                  <div className="space-y-2">
                    {patientPrescriptions.length === 0 ? (
                      <div className="py-6 text-center text-[#717171]">No prescriptions on file.</div>
                    ) : (
                      patientPrescriptions.map((rx) => (
                        <div key={rx.id} className="p-3 border border-[#EBEBEB] rounded-xl flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-[#222222] block">{rx.id}</span>
                            <span className="text-[#717171]">{rx.items.map((i) => i.medication).join(', ')}</span>
                          </div>
                          <span className="font-medium text-[#008A05]">{rx.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB 6: REFERRALS */}
                {activeProfileTab === 'referrals' && (
                  <div className="space-y-2">
                    {patientReferrals.length === 0 ? (
                      <div className="py-6 text-center text-[#717171]">No referrals on file.</div>
                    ) : (
                      patientReferrals.map((rf) => (
                        <div key={rf.id} className="p-3 border border-[#EBEBEB] rounded-xl flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-[#222222] block">To: {rf.destinationFacility}</span>
                            <span className="text-[#717171]">{rf.reason}</span>
                          </div>
                          <span className="font-medium text-[#717171]">{rf.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB 7: DOCUMENTS */}
                {activeProfileTab === 'documents' && (
                  <div className="space-y-2">
                    {patientDocuments.length === 0 ? (
                      <div className="py-6 text-center text-[#717171]">No clinical documents uploaded.</div>
                    ) : (
                      patientDocuments.map((doc) => (
                        <div key={doc.id} className="p-3 border border-[#EBEBEB] rounded-xl flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-[#222222] block">{doc.title}</span>
                            <span className="text-[#717171]">{doc.type} · {doc.createdDate}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPrintDocumentData(doc)}
                            className="px-3 py-1 border border-[#DDDDDD] rounded-full text-xs font-medium hover:border-[#222222]"
                          >
                            View
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB 8: ACTIVITY */}
                {activeProfileTab === 'activity' && (
                  <div className="space-y-2">
                    {patientExternalEncounters.length === 0 ? (
                      <div className="py-6 text-center text-[#717171]">No external activity records logged.</div>
                    ) : (
                      patientExternalEncounters.map((enc) => (
                        <div key={enc.id} className="p-3 bg-[#F7F7F7] rounded-xl flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-[#222222] block">{enc.facilityName}</span>
                            <span className="text-[#717171]">{enc.summarySnippet}</span>
                          </div>
                          <span className="font-medium text-[#0E2938]">{enc.accessStatus}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#717171]">
              Select a patient from the registry to view clinical profile.
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      <RegisterPatientModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};
