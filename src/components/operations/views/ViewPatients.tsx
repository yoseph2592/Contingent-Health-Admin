import React, { useState, useMemo } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { PatientRecord } from '../../../types/operations';
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
  X,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Calendar,
  Wallet,
  ShieldAlert,
  ChevronLeft,
  FileText,
  Activity,
  HeartPulse,
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
    maternalRecords,
    setSelectedMaternalPatientId,
  } = useClinicOperations();

  // Search, Filter, Sort, Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  const [sortField, setSortField] = useState<'fullName' | 'age' | 'lastVisitDate' | 'walletBalance'>('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Slide-over Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'clinical' | 'timeline' | 'demographics'>('clinical');

  // Filter and sort patients
  const filteredAndSortedPatients = useMemo(() => {
    return patients
      .filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          p.fullName.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.nationalId.toLowerCase().includes(q) ||
          p.affiliatedDoctorName.toLowerCase().includes(q);

        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesProgram = programFilter === 'All' || p.clinicRelationship === programFilter;

        return matchesQuery && matchesStatus && matchesProgram;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        } else {
          return sortOrder === 'asc'
            ? ((valA as number) || 0) - ((valB as number) || 0)
            : ((valB as number) || 0) - ((valA as number) || 0);
        }
      });
  }, [patients, searchQuery, statusFilter, programFilter, sortField, sortOrder]);

  // Paginated patients
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPatients.length / pageSize));
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedPatients.slice(start, start + pageSize);
  }, [filteredAndSortedPatients, currentPage, pageSize]);

  // Handle sorting toggle
  const handleSort = (field: 'fullName' | 'age' | 'lastVisitDate' | 'walletBalance') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Open drawer for a patient
  const handleSelectPatient = (patient: PatientRecord) => {
    setSelectedPatientId(patient.id);
    setIsDrawerOpen(true);
  };

  // Aggregated data for selected patient
  const currentSelectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || selectedPatient || patients[0];
  }, [patients, selectedPatientId, selectedPatient]);

  const patientAppointments = appointments.filter((a) => a.patientId === currentSelectedPatient?.id);
  const patientPrescriptions = prescriptions.filter((r) => r.patientId === currentSelectedPatient?.id);
  const patientDocuments = documents.filter((d) => d.patientId === currentSelectedPatient?.id);
  const patientClaims = claims.filter((c) => c.patientId === currentSelectedPatient?.id);
  const patientLabs = labRequests.filter((l) => l.patientId === currentSelectedPatient?.id);
  const patientReferrals = referrals.filter((r) => r.patientId === currentSelectedPatient?.id);
  const patientExternalEncounters = externalEncounters.filter(
    (e) => e.patientId === currentSelectedPatient?.id
  );

  // Longitudinal timeline
  const unifiedTimeline = useMemo(() => {
    return [
      ...patientExternalEncounters.map((enc) => ({
        type: 'external_encounter',
        date: enc.date,
        title: `External Record: ${enc.encounterCategory}`,
        subtitle: `${enc.facilityName} (${enc.providerName}, ${enc.providerType}) · "${enc.summarySnippet}"`,
        badge: enc.accessStatus,
        id: enc.id,
        raw: enc,
      })),
      ...patientAppointments.map((a) => ({
        type: 'appointment',
        date: a.date,
        title: `Appointment: ${a.visitType}`,
        subtitle: `${a.doctorName} · ${a.reasonForVisit}`,
        badge: a.status,
        id: a.id,
        raw: a,
      })),
      ...patientPrescriptions.map((r) => ({
        type: 'prescription',
        date: r.date,
        title: `Electronic Prescription ${r.id}`,
        subtitle: (r.items || []).map((i) => `${i.medication} ${i.strength}`).join(', '),
        badge: r.status,
        id: r.id,
        raw: r,
      })),
      ...patientLabs.map((l) => ({
        type: 'lab',
        date: l.requestedAt.split(' ')[0],
        title: `Diagnostic Order: ${l.testType}`,
        subtitle: l.clinicalIndication,
        badge: l.status,
        id: l.id,
        raw: l,
      })),
      ...patientReferrals.map((rf) => ({
        type: 'referral',
        date: rf.sentDate,
        title: `Referral to ${rf.destinationFacility}`,
        subtitle: rf.reason,
        badge: rf.status,
        id: rf.id,
        raw: rf,
      })),
      ...patientClaims.map((c) => ({
        type: 'claim',
        date: c.submittedDate,
        title: `Insurance Claim ${c.id}`,
        subtitle: `${c.payerName} · $${c.claimedAmount}`,
        badge: c.status,
        id: c.id,
        raw: c,
      })),
    ].sort((a, b) => (b.date > a.date ? 1 : -1));
  }, [
    patientExternalEncounters,
    patientAppointments,
    patientPrescriptions,
    patientLabs,
    patientReferrals,
    patientClaims,
  ]);

  // Status counts for overview pills
  const counts = useMemo(() => {
    return {
      total: patients.length,
      active: patients.filter((p) => p.status === 'Active').length,
      waiting: patients.filter((p) => p.status === 'Waiting Room').length,
      consultation: patients.filter((p) => p.status === 'In Consultation').length,
      vip: patients.filter((p) => p.clinicRelationship === 'VIP Care').length,
    };
  }, [patients]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8e8e8e]">
            Clinical Directory &amp; Longitudinal EHR
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0e162b] mt-1">
            Patient Management
          </h1>
          <p className="text-xs sm:text-sm text-[#606060] mt-0.5">
            Structured records, longitudinal charts, diagnostic orders, and secure interoperability
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('onboarding')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#e8e8e8] hover:border-[#0e162b] bg-white text-[#0e162b] rounded-full text-xs font-medium transition-colors"
          >
            <span>Clinic Onboarding</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0e162b] hover:bg-[#213364] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Quick Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-[#e8e8e8] p-4 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-[#8e8e8e] uppercase tracking-wider block">Total Patients</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#0e162b]">{counts.total}</span>
            <span className="text-xs text-[#1fc16b] font-medium">Enrolled</span>
          </div>
        </div>

        <div className="bg-white border border-[#e8e8e8] p-4 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-[#8e8e8e] uppercase tracking-wider block">In Waiting Room</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#dfb400]">{counts.waiting}</span>
            <span className="text-xs text-[#8e8e8e]">Ready for triage</span>
          </div>
        </div>

        <div className="bg-white border border-[#e8e8e8] p-4 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-[#8e8e8e] uppercase tracking-wider block">In Consultation</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#00c0fe]">{counts.consultation}</span>
            <span className="text-xs text-[#8e8e8e]">Active with doctor</span>
          </div>
        </div>

        <div className="bg-white border border-[#e8e8e8] p-4 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-[#8e8e8e] uppercase tracking-wider block">VIP / Chronic Care</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#1fc16b]">{counts.vip}</span>
            <span className="text-xs text-[#8e8e8e]">Priority program</span>
          </div>
        </div>
      </div>

      {/* Structured Table Container */}
      <div className="bg-white border border-[#e8e8e8] rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Search & Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#e8e8e8] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8e8e8e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, ID, phone, national ID, or doctor..."
              className="w-full pl-9 pr-4 py-2 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] placeholder-[#8e8e8e] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-[#8e8e8e] hover:text-[#0e162b]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {['All', 'Active', 'Waiting Room', 'In Consultation', 'Inactive'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatusFilter(s);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-[#0e162b] text-white'
                    : 'bg-[#f0f2f5] text-[#606060] hover:text-[#0e162b]'
                }`}
              >
                {s}
              </button>
            ))}

            {/* Care Program Select */}
            <select
              value={programFilter}
              onChange={(e) => {
                setProgramFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-[#f0f2f5] hover:bg-[#e8e8e8] text-[#0e162b] rounded-full text-xs font-medium border-0 focus:ring-1 focus:ring-[#0e162b] outline-none transition-colors"
            >
              <option value="All">All Care Programs</option>
              <option value="VIP Care">VIP Care</option>
              <option value="Chronic Care Program">Chronic Care Program</option>
              <option value="Active Regular">Active Regular</option>
              <option value="New Patient">New Patient</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f7fa] text-[#8e8e8e] font-semibold border-b border-[#e8e8e8] uppercase tracking-wider text-[10px]">
              <tr>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#0e162b] transition-colors"
                  onClick={() => handleSort('fullName')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Patient</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#0e162b] transition-colors"
                  onClick={() => handleSort('age')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Demographics</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Program / Relationship</th>
                <th className="py-3 px-4">Attending Physician</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#0e162b] transition-colors"
                  onClick={() => handleSort('walletBalance')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Balance</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#0e162b] transition-colors"
                  onClick={() => handleSort('lastVisitDate')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Last Visit</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8]">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8e8e8e]">
                    <User className="w-10 h-10 mx-auto mb-2 text-[#cccccc]" />
                    <p className="font-semibold text-sm text-[#0e162b]">No patients found</p>
                    <p className="text-xs text-[#8e8e8e] mt-0.5">Try adjusting your search criteria or active filters.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('All');
                        setProgramFilter('All');
                      }}
                      className="mt-3 px-3 py-1.5 bg-[#f0f2f5] hover:bg-[#e8e8e8] text-[#0e162b] rounded-full text-xs font-medium transition-colors"
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((p) => {
                  const isSelected = p.id === currentSelectedPatient?.id && isDrawerOpen;
                  const activeApt = appointments.find((a) => a.patientId === p.id && (a.status === 'In consultation' || a.status === 'Checked-in' || a.status === 'Accepted'));

                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleSelectPatient(p)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#00c0fe]/10'
                          : 'hover:bg-[#f5f7fa]'
                      }`}
                    >
                      {/* Patient Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#0e162b] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {p.fullName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-[#0e162b] hover:text-[#00c0fe] transition-colors block truncate">
                              {p.fullName}
                            </span>
                            <span className="text-[11px] font-mono text-[#8e8e8e] block">
                              {p.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Demographics */}
                      <td className="py-3.5 px-4 text-[#606060]">
                        <div>
                          <span>{p.age}y · {p.sex}</span>
                          <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#f0f2f5] text-[#0e162b] border border-[#e8e8e8]">
                            {p.bloodType}
                          </span>
                        </div>
                        {p.allergies.length > 0 && !p.allergies[0].includes('NKDA') && (
                          <span className="text-[10px] font-medium text-[#d00416] flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-[120px]">{p.allergies[0]}</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            p.status === 'In Consultation'
                              ? 'bg-[#00c0fe]/15 text-[#008fbf]'
                              : p.status === 'Waiting Room'
                              ? 'bg-[#ffdb43]/20 text-[#9b7b00]'
                              : p.status === 'Active'
                              ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                              : 'bg-[#f0f2f5] text-[#606060]'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Program */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-[#f0f2f5] text-[#0e162b] text-[11px] font-medium border border-[#e8e8e8]/60">
                          {p.clinicRelationship}
                        </span>
                      </td>

                      {/* Doctor */}
                      <td className="py-3.5 px-4 text-[#606060]">
                        <span className="font-medium text-[#0e162b] block truncate">
                          {p.affiliatedDoctorName.split(',')[0]}
                        </span>
                        <span className="text-[10px] text-[#8e8e8e]">
                          {p.insuranceProvider}
                        </span>
                      </td>

                      {/* Balance */}
                      <td className="py-3.5 px-4 font-mono font-medium text-[#0e162b]">
                        ${(p.walletBalance || 0).toFixed(2)}
                      </td>

                      {/* Last Visit */}
                      <td className="py-3.5 px-4 text-[#8e8e8e] font-mono text-[11px]">
                        <div>{p.lastVisitDate}</div>
                        {p.nextAppointmentDate && (
                          <div className="text-[10px] text-[#00c0fe] font-sans">
                            Next: {p.nextAppointmentDate}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {activeApt && (
                            <button
                              type="button"
                              onClick={() => {
                                startConsultation(activeApt.id);
                                setActiveTab('encounter');
                              }}
                              className="px-2.5 py-1 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                              title="Start Consultation Encounter"
                            >
                              <Stethoscope className="w-3 h-3" />
                              <span className="hidden sm:inline">Consult</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleSelectPatient(p)}
                            className="px-2.5 py-1 border border-[#e8e8e8] hover:border-[#0e162b] bg-white text-[#0e162b] rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            title="Open Patient Clinical Chart Drawer"
                          >
                            <span>Chart</span>
                            <ChevronRight className="w-3 h-3 text-[#8e8e8e]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-4 border-t border-[#e8e8e8] bg-[#f5f7fa] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8e8e8e]">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <span className="font-semibold text-[#0e162b]">
              {filteredAndSortedPatients.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>
            <span>to</span>
            <span className="font-semibold text-[#0e162b]">
              {Math.min(currentPage * pageSize, filteredAndSortedPatients.length)}
            </span>
            <span>of</span>
            <span className="font-semibold text-[#0e162b]">{filteredAndSortedPatients.length}</span>
            <span>patients</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px]">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white border border-[#e8e8e8] rounded-md text-xs font-medium text-[#0e162b] outline-none"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
            </select>

            <div className="flex items-center gap-1 ml-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 border border-[#e8e8e8] rounded-lg bg-white hover:bg-[#f0f2f5] disabled:opacity-30 disabled:hover:bg-white text-[#0e162b] transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-semibold text-[#0e162b]">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-[#e8e8e8] rounded-lg bg-white hover:bg-[#f0f2f5] disabled:opacity-30 disabled:hover:bg-white text-[#0e162b] transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Patient Detail Drawer on the Right Side */}
      {isDrawerOpen && currentSelectedPatient && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-[#e8e8e8] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
              {/* Drawer Top Navigation & Header */}
              <div className="p-5 sm:p-6 border-b border-[#e8e8e8] bg-white sticky top-0 z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#0e162b] text-white flex items-center justify-center font-bold text-base shrink-0">
                      {currentSelectedPatient.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-[#0e162b]">
                          {currentSelectedPatient.fullName}
                        </h2>
                        <span className="font-mono text-xs text-[#8e8e8e] bg-[#f0f2f5] px-2 py-0.5 rounded">
                          {currentSelectedPatient.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] text-xs font-semibold">
                          {currentSelectedPatient.clinicRelationship}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#606060] mt-1">
                        <span>{currentSelectedPatient.age} years old ({currentSelectedPatient.sex})</span>
                        <span>Blood: <strong className="text-[#0e162b] font-medium">{currentSelectedPatient.bloodType}</strong></span>
                        <span>National ID: <code className="font-mono">{currentSelectedPatient.nationalId}</code></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {maternalRecords.some((m) => m.patientId === currentSelectedPatient.id) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMaternalPatientId(currentSelectedPatient.id);
                          setActiveTab('maternal');
                          setIsDrawerOpen(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00c0fe]/15 hover:bg-[#00c0fe] text-[#0e162b] hover:text-white rounded-full text-xs font-semibold transition-colors border border-[#00c0fe]/30"
                      >
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>Open ANC Record</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const activeApt = appointments.find((a) => a.patientId === currentSelectedPatient.id);
                        if (activeApt) startConsultation(activeApt.id);
                        setActiveTab('encounter');
                        setIsDrawerOpen(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold transition-colors shadow-2xs"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-[#00c0fe]" />
                      <span>Start encounter</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-2 text-[#8e8e8e] hover:text-[#0e162b] hover:bg-[#f0f2f5] rounded-full transition-colors"
                      title="Close drawer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Drawer Tabs */}
                <div className="flex items-center gap-6 border-b border-[#e8e8e8] mt-5 -mb-6 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveProfileTab('clinical')}
                    className={`pb-3 font-semibold border-b-2 transition-colors ${
                      activeProfileTab === 'clinical'
                        ? 'border-[#0e162b] text-[#0e162b]'
                        : 'border-transparent text-[#8e8e8e] hover:text-[#0e162b]'
                    }`}
                  >
                    Clinical Summary &amp; Alerts
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProfileTab('timeline')}
                    className={`pb-3 font-semibold border-b-2 transition-colors ${
                      activeProfileTab === 'timeline'
                        ? 'border-[#0e162b] text-[#0e162b]'
                        : 'border-transparent text-[#8e8e8e] hover:text-[#0e162b]'
                    }`}
                  >
                    Timeline ({unifiedTimeline.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProfileTab('demographics')}
                    className={`pb-3 font-semibold border-b-2 transition-colors ${
                      activeProfileTab === 'demographics'
                        ? 'border-[#0e162b] text-[#0e162b]'
                        : 'border-transparent text-[#8e8e8e] hover:text-[#0e162b]'
                    }`}
                  >
                    Demographics &amp; Insurance
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                {/* Tab 1: Clinical Summary */}
                {activeProfileTab === 'clinical' && (
                  <div className="space-y-6">
                    {/* Alerts if any */}
                    {(currentSelectedPatient.clinicalAlerts || []).length > 0 && (
                      <div className="p-4 bg-[#fb3748]/10 border border-[#fb3748]/20 rounded-2xl space-y-1">
                        <div className="flex items-center gap-2 text-[#d00416] font-semibold text-xs">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Active Clinical Alerts</span>
                        </div>
                        <ul className="list-disc list-inside text-[#606060] space-y-0.5 pl-1">
                          {(currentSelectedPatient.clinicalAlerts || []).map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Allergies & Chronic Conditions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#f0f2f5] rounded-2xl">
                        <span className="text-xs font-semibold text-[#606060] block mb-2">
                          Allergies &amp; Adverse Reactions
                        </span>
                        <div className="space-y-1.5">
                          {(currentSelectedPatient.allergies || []).map((allergy, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 bg-white rounded-xl border border-[#e8e8e8] text-[#0e162b] font-medium"
                            >
                              <span>{allergy}</span>
                              <span className="text-[10px] font-semibold text-[#d00416] bg-[#fb3748]/15 px-2 py-0.5 rounded-full">
                                Documented
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-[#f0f2f5] rounded-2xl">
                        <span className="text-xs font-semibold text-[#606060] block mb-2">
                          Chronic Conditions
                        </span>
                        <div className="space-y-1.5">
                          {(currentSelectedPatient.conditions || []).map((c, i) => (
                            <div
                              key={i}
                              className="p-2 bg-white rounded-xl border border-[#e8e8e8] text-[#0e162b] font-medium"
                            >
                              {c}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Active Medications */}
                    <div className="p-4 bg-[#f0f2f5] rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#606060]">
                          Current Active Medications ({(currentSelectedPatient.currentMedications || []).length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('prescriptions');
                            setIsDrawerOpen(false);
                          }}
                          className="text-xs text-[#00c0fe] hover:underline font-medium"
                        >
                          Prescriptions Hub
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(currentSelectedPatient.currentMedications || []).map((med, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-[#e8e8e8] text-[#0e162b] font-medium"
                          >
                            <Pill className="w-3.5 h-3.5 text-[#8e8e8e] shrink-0" />
                            <span className="truncate">{med}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Care coordination notes */}
                    <div className="p-4 bg-[#f0f2f5] rounded-2xl">
                      <span className="text-xs font-semibold text-[#8e8e8e] block mb-1">
                        Care Coordination Notes
                      </span>
                      <p className="text-[#0e162b] leading-relaxed">
                        {currentSelectedPatient.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 2: Longitudinal Timeline */}
                {activeProfileTab === 'timeline' && (
                  <div className="space-y-4">
                    <div className="text-xs text-[#8e8e8e] mb-2">
                      Unified chronological health records across appointments, prescriptions, diagnostic labs, and insurance claims:
                    </div>

                    <div className="space-y-3">
                      {unifiedTimeline.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border border-[#e8e8e8] hover:border-[#0e162b]/30 transition-colors flex items-start justify-between gap-4 bg-white"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#0e162b]">
                                {item.title}
                              </span>
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                                  item.type === 'external_encounter'
                                    ? item.badge === 'Granted'
                                      ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                                      : item.badge === 'Pending Approval'
                                      ? 'bg-[#ffdb43]/20 text-[#dfb400]'
                                      : 'bg-[#00c0fe]/10 text-[#008fbf] border border-[#00c0fe]/30'
                                    : 'bg-[#f0f2f5] text-[#606060]'
                                }`}
                              >
                                {item.type === 'external_encounter' && item.badge === 'Sealed' && (
                                  <Lock className="w-3 h-3 text-[#00c0fe] mr-1" />
                                )}
                                {item.type === 'external_encounter' && item.badge === 'Granted' && (
                                  <Unlock className="w-3 h-3 text-[#1fc16b] mr-1" />
                                )}
                                {item.type === 'external_encounter' && item.badge === 'Pending Approval' && (
                                  <Clock className="w-3 h-3 text-[#dfb400] mr-1 animate-pulse" />
                                )}
                                <span>{item.badge}</span>
                              </span>
                            </div>
                            <p className="text-xs text-[#606060] mt-0.5">
                              {item.subtitle}
                            </p>
                            <span className="text-[11px] text-[#8e8e8e] mt-1 block font-mono">
                              {item.date}
                            </span>
                          </div>

                          {item.type === 'external_encounter' && item.badge === 'Sealed' && (
                            <button
                              type="button"
                              onClick={() => openRequestAccessModal(item.raw as any)}
                              className="px-3 py-1.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Request Access</span>
                            </button>
                          )}

                          {item.type === 'external_encounter' && item.badge === 'Granted' && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('encounter');
                                setIsDrawerOpen(false);
                              }}
                              className="px-3 py-1.5 bg-[#84ebb4]/25 hover:bg-[#84ebb4]/40 text-[#1fc16b] rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>View Decrypted</span>
                            </button>
                          )}

                          {item.type === 'prescription' && (
                            <button
                              type="button"
                              onClick={() => setPrintDocumentData(item.raw as any)}
                              className="px-3 py-1.5 bg-white border border-[#e8e8e8] hover:border-[#0e162b] rounded-full text-xs font-medium text-[#0e162b] flex items-center gap-1.5 shrink-0 transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#8e8e8e]" />
                              <span>View Rx</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Demographics & Insurance */}
                {activeProfileTab === 'demographics' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#f0f2f5] rounded-2xl space-y-2">
                        <span className="text-xs font-semibold text-[#8e8e8e] block">
                          Contact Details
                        </span>
                        <div className="space-y-1.5 text-[#0e162b]">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-[#8e8e8e]" />
                            <span>{currentSelectedPatient.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-[#8e8e8e]" />
                            <span>{currentSelectedPatient.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#f0f2f5] rounded-2xl space-y-2">
                        <span className="text-xs font-semibold text-[#8e8e8e] block">
                          Emergency Contact
                        </span>
                        <div className="text-[#0e162b]">
                          <p className="font-bold text-sm">{currentSelectedPatient.emergencyContact.name}</p>
                          <p className="text-xs text-[#8e8e8e]">
                            Relationship: {currentSelectedPatient.emergencyContact.relation}
                          </p>
                          <p className="text-xs text-[#8e8e8e] mt-0.5">{currentSelectedPatient.emergencyContact.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#f0f2f5] rounded-2xl space-y-2">
                      <span className="text-xs font-semibold text-[#8e8e8e] block">
                        Insurance &amp; Payer Coverage
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#0e162b]">
                        <div>
                          <span className="text-[#8e8e8e] text-xs">Payer Name:</span>
                          <p className="font-bold text-sm mt-0.5">{currentSelectedPatient.insuranceProvider}</p>
                        </div>
                        <div>
                          <span className="text-[#8e8e8e] text-xs">Policy / Member ID:</span>
                          <p className="font-mono font-bold text-sm mt-0.5">
                            {currentSelectedPatient.insurancePolicyNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#f0f2f5] rounded-2xl space-y-2">
                      <span className="text-xs font-semibold text-[#8e8e8e] block">
                        Wallet &amp; Pre-Paid Escrow
                      </span>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-[#8e8e8e]">Available Escrow Balance</span>
                          <p className="text-xl font-bold font-mono text-[#0e162b]">
                            ${(currentSelectedPatient.walletBalance || 0).toFixed(2)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('wallet');
                            setIsDrawerOpen(false);
                          }}
                          className="px-3.5 py-1.5 bg-white border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full text-xs font-semibold transition-colors"
                        >
                          Ledger Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
