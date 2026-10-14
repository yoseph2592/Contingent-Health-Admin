import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { AppointmentRecord, AppointmentStatus } from '../../../types/operations';
import { AppointmentWeeklyCalendar } from '../AppointmentWeeklyCalendar';
import {
  Calendar as CalendarIcon,
  Search,
  Check,
  DoorOpen,
  Stethoscope,
  List as ListIcon,
  CalendarDays,
  Plus,
  Eye,
  X,
  Clock,
  User,
  ArrowUpDown,
  Filter,
  Users,
  CheckCircle2,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const ViewAppointments: React.FC = () => {
  const {
    appointments,
    acceptAppointment,
    rejectAppointment,
    checkInPatient,
    startConsultation,
    selectedAppointmentId,
    setSelectedAppointmentId,
    selectedAppointment,
    setSelectedPatientId,
    setActiveTab,
    currentClinicName,
  } = useClinicOperations();

  // View Mode: 'list' or 'calendar'
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const statuses: (AppointmentStatus | 'All')[] = [
    'All',
    'Requested',
    'Checked-in',
    'In consultation',
    'Completed',
  ];

  const filteredAppointments = (appointments || []).filter((a) => {
    const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
    const matchesSearch =
      (a.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.doctorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.reasonForVisit || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / pageSize));
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenConsultation = (appointmentId: string) => {
    startConsultation(appointmentId);
    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt) {
      setSelectedPatientId(apt.patientId);
    }
    setActiveTab('encounter');
  };

  const handleOpenPatientChart = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('encounter');
  };

  const openAppointmentDetail = (apt: AppointmentRecord) => {
    setSelectedAppointmentId(apt.id);
    setIsDetailDrawerOpen(true);
  };

  // KPI Calculations
  const totalAppointmentsCount = (appointments || []).length;
  const waitingRoomCount = (appointments || []).filter((a) => a.status === 'Checked-in').length;
  const completedCount = (appointments || []).filter((a) => a.status === 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. TOP HEADER & VIEW TOGGLE (Reference: Admin Dashboard _ Adverts.jpg) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
            Listings &amp; Consultations
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222] mt-0.5">
            Appointments
          </h1>
          <p className="text-xs sm:text-sm text-[#717171] mt-0.5">
            Review and manage active appointments, triage queues, and sessional bookings.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* View Mode Toggle: List vs Calendar */}
          <div className="bg-[#F0F0F0] border border-[#EBEBEB] rounded-full p-1 flex items-center shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white text-[#222222] shadow-xs'
                  : 'text-[#717171] hover:text-[#222222]'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'calendar'
                  ? 'bg-white text-[#222222] shadow-xs'
                  : 'text-[#717171] hover:text-[#222222]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Weekly Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CALENDAR VIEW TOGGLE */}
      {viewMode === 'calendar' ? (
        <AppointmentWeeklyCalendar
          appointments={appointments}
          selectedAppointmentId={selectedAppointmentId}
          onSelectAppointment={(id) => {
            setSelectedAppointmentId(id);
            setIsDetailDrawerOpen(true);
          }}
          onCheckIn={(id) => checkInPatient(id)}
          onStartConsultation={(id) => handleOpenConsultation(id)}
          onViewPatientChart={(patientId) => handleOpenPatientChart(patientId)}
        />
      ) : (
        /* 3. LIST / TABLE VIEW (Exact reference: Admin Dashboard _ Adverts.jpg) */
        <div className="space-y-6">
          {/* Segmented Status Tabs (Reference: [My Rentals] [Active Rentals] [Audit Logs]) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBEBEB] pb-3">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              {statuses.map((status) => {
                const count =
                  status === 'All'
                    ? (appointments || []).length
                    : (appointments || []).filter((a) => a.status === status).length;
                const isActive = filterStatus === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setFilterStatus(status);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                      isActive
                        ? 'bg-[#0e162b] text-white shadow-xs'
                        : 'bg-white border border-[#e8e8e8] text-[#606060] hover:text-[#0e162b] hover:border-[#0e162b]'
                    }`}
                  >
                    <span>{status === 'All' ? 'All Visits' : status}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-[#00c0fe] text-white' : 'bg-[#f0f2f5] text-[#606060]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right quick search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-[#8e8e8e]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search patient or doctor..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#e8e8e8] focus:border-[#00c0fe] rounded-full text-xs text-[#0e162b] placeholder-[#8e8e8e] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 3 KPI Stat Cards (Reference: Admin Dashboard _ Adverts.jpg: Total Rented Spaces, Active Ads, Average Clicks) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 flex items-start justify-between shadow-2xs hover:shadow-xs transition-shadow">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#8e8e8e] block">
                  Total Bookings
                </span>
                <div className="text-3xl font-bold text-[#0e162b] tracking-tight">
                  {totalAppointmentsCount}
                </div>
                <p className="text-[11px] text-[#8e8e8e] pt-1">
                  Active in today&apos;s clinic roster
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#f0f2f5] text-[#0e162b] flex items-center justify-center shrink-0">
                <CalendarCheck2 className="w-5 h-5 text-[#0e162b]" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 flex items-start justify-between shadow-2xs hover:shadow-xs transition-shadow">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#8e8e8e] block">
                  In Waiting Room
                </span>
                <div className="text-3xl font-bold text-[#dfb400] tracking-tight">
                  {waitingRoomCount}
                </div>
                <p className="text-[11px] text-[#8e8e8e] pt-1">
                  Checked-in &amp; vitalized by nurse
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ffdb43]/20 text-[#dfb400] flex items-center justify-center shrink-0 border border-[#dfb400]/25">
                <DoorOpen className="w-5 h-5 text-[#dfb400]" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 flex items-start justify-between shadow-2xs hover:shadow-xs transition-shadow">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#8e8e8e] block">
                  Completed Visits
                </span>
                <div className="text-3xl font-bold text-[#1fc16b] tracking-tight">
                  {completedCount}
                </div>
                <p className="text-[11px] text-[#8e8e8e] pt-1">
                  Encounter signed · Claims generated
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#84ebb4]/25 text-[#1fc16b] flex items-center justify-center shrink-0 border border-[#1fc16b]/20">
                <CheckCircle2 className="w-5 h-5 text-[#1fc16b]" />
              </div>
            </div>
          </div>

          {/* TABLE CARD (Reference: Full-width Table in Admin Dashboard _ Adverts.jpg) */}
          <div className="bg-white border border-[#EBEBEB] rounded-2xl shadow-2xs overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 sm:p-5 border-b border-[#EBEBEB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-[#222222]">
                  Consultations &amp; Triage Roster
                </h3>
                <span className="text-xs text-[#717171]">
                  ({filteredAppointments.length} total)
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-[#717171]">
                  Listing: <strong className="text-[#222222]">{currentClinicName.split(' ')[0]} Medical</strong>
                </span>
              </div>
            </div>

            {/* Full-width Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-[#EBEBEB] text-[#717171] font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 pl-6 pr-3 w-10">
                      <input
                        type="checkbox"
                        className="rounded border-[#e8e8e8] text-[#0e162b] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 cursor-pointer hover:text-[#222222]">
                        <span>Patient &amp; Ref</span>
                        <ArrowUpDown className="w-3 h-3 text-[#B0B0B0]" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 cursor-pointer hover:text-[#222222]">
                        <span>Time &amp; Date</span>
                        <ArrowUpDown className="w-3 h-3 text-[#B0B0B0]" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 cursor-pointer hover:text-[#222222]">
                        <span>Attending Physician</span>
                        <ArrowUpDown className="w-3 h-3 text-[#B0B0B0]" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 cursor-pointer hover:text-[#222222]">
                        <span>Reason / Specialty</span>
                        <ArrowUpDown className="w-3 h-3 text-[#B0B0B0]" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1 cursor-pointer hover:text-[#222222]">
                        <span>Fee</span>
                        <ArrowUpDown className="w-3 h-3 text-[#B0B0B0]" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 cursor-pointer hover:text-[#222222]">
                        <span>Status</span>
                        <ArrowUpDown className="w-3 h-3 text-[#B0B0B0]" />
                      </div>
                    </th>
                    <th className="py-3.5 pl-4 pr-6 text-right">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EBEBEB]">
                  {paginatedAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-[#717171]">
                        <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-[#CCCCCC]" />
                        <p className="font-medium text-xs">No appointments match your search criteria</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedAppointments.map((apt) => {
                      const isSelected = apt.id === selectedAppointmentId;
                      return (
                        <tr
                          key={apt.id}
                          onClick={() => setSelectedAppointmentId(apt.id)}
                          className={`hover:bg-[#F9F9F9] transition-colors cursor-pointer ${
                            isSelected ? 'bg-[#F5F8FA]' : ''
                          }`}
                        >
                          <td className="py-4 pl-6 pr-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="rounded border-[#e8e8e8] text-[#0e162b] focus:ring-0 cursor-pointer"
                            />
                          </td>

                          {/* Patient & Ref */}
                          <td className="py-4 px-4 min-w-[170px]">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#222222] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                                {apt.patientName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-[#222222] block truncate">
                                  {apt.patientName}
                                </span>
                                <span className="font-mono text-[10px] text-[#717171] block">
                                  {apt.id} · {apt.patientAge}y
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Time & Date */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="font-bold text-[#222222] block">{apt.time}</span>
                            <span className="text-[10px] text-[#717171]">{apt.date}</span>
                          </td>

                          {/* Attending Physician */}
                          <td className="py-4 px-4 min-w-[150px]">
                            <span className="font-medium text-[#222222] block truncate">
                              {apt.doctorName}
                            </span>
                            <span className="text-[10px] text-[#717171] block truncate">
                              {apt.specialty}
                            </span>
                          </td>

                          {/* Reason */}
                          <td className="py-4 px-4 max-w-[220px]">
                            <p className="text-[#222222] truncate font-normal">
                              {apt.reasonForVisit}
                            </p>
                            <span className="text-[10px] text-[#717171]">{apt.visitType}</span>
                          </td>

                          {/* Fee */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <span className="font-bold text-[#0e162b] block">${apt.amount}</span>
                            <span className="text-[10px] text-[#1fc16b] font-medium">{apt.paymentStatus}</span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                apt.status === 'Completed'
                                  ? 'bg-[#84ebb4]/25 text-[#1fc16b] border border-[#1fc16b]/20'
                                  : apt.status === 'In consultation'
                                  ? 'bg-[#ffdb43]/20 text-[#dfb400] border border-[#dfb400]/25'
                                  : apt.status === 'Checked-in'
                                  ? 'bg-[#ffdb43]/20 text-[#dfb400] border border-[#dfb400]/25'
                                  : 'bg-[#f0f2f5] text-[#606060]'
                              }`}
                            >
                              {apt.status === 'Completed' && <span className="w-1.5 h-1.5 rounded-full bg-[#1fc16b] mr-1.5" />}
                              {apt.status === 'In consultation' && <span className="w-1.5 h-1.5 rounded-full bg-[#dfb400] mr-1.5 animate-pulse" />}
                              {apt.status === 'Checked-in' && <span className="w-1.5 h-1.5 rounded-full bg-[#dfb400] mr-1.5" />}
                              {apt.status}
                            </span>
                          </td>

                          {/* Actions (Reference: "View Detail" eye button) */}
                          <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => openAppointmentDetail(apt)}
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#e8e8e8] hover:border-[#0e162b] hover:bg-white text-[#0e162b] text-xs font-semibold transition-all shadow-2xs"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#8e8e8e]" />
                                <span>View Detail</span>
                              </button>

                              {apt.status === 'Checked-in' && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenConsultation(apt.id)}
                                  className="px-3 py-1.5 rounded-full bg-[#00c0fe] hover:bg-[#0095c5] text-white text-xs font-semibold transition-colors shadow-2xs"
                                >
                                  Open Encounter
                                </button>
                              )}

                              {apt.status === 'In consultation' && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenConsultation(apt.id)}
                                  className="px-3 py-1.5 rounded-full bg-[#0e162b] hover:bg-[#213364] text-white text-xs font-semibold transition-colors shadow-2xs"
                                >
                                  Resume Consultation
                                </button>
                              )}

                              {apt.status === 'Requested' && (
                                <button
                                  type="button"
                                  onClick={() => acceptAppointment(apt.id)}
                                  className="px-3 py-1.5 rounded-full bg-[#0e162b] hover:bg-[#213364] text-white text-xs font-semibold transition-colors shadow-2xs"
                                >
                                  Accept
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls (Reference: Previous / Next buttons from reference) */}
            <div className="p-4 border-t border-[#EBEBEB] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#717171]">
              <div>
                Showing <strong>{filteredAppointments.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
                <strong>{Math.min(currentPage * pageSize, filteredAppointments.length)}</strong> of{' '}
                <strong>{filteredAppointments.length}</strong> appointments
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-full border border-[#DDDDDD] hover:border-[#222222] disabled:opacity-40 disabled:hover:border-[#DDDDDD] text-[#222222] font-semibold transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                        currentPage === i + 1
                          ? 'bg-[#0e162b] text-white'
                          : 'text-[#8e8e8e] hover:text-[#0e162b] hover:bg-[#f0f2f5]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-full border border-[#e8e8e8] hover:border-[#0e162b] disabled:opacity-40 text-[#0e162b] font-semibold transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DETAIL INSPECTOR DRAWER / MODAL (Reference: Modal Design Styles) */}
      {isDetailDrawerOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#e8e8e8] w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#e8e8e8] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0e162b] text-white flex items-center justify-center font-bold text-sm">
                  {selectedAppointment.patientName.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#717171]">
                    Consultation Details
                  </span>
                  <h3 className="text-base font-bold text-[#222222]">
                    {selectedAppointment.patientName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs px-2.5 py-1 bg-[#F0F0F0] rounded-full text-[#717171]">
                  {selectedAppointment.id}
                </span>
                <button
                  type="button"
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F0F0F0] text-[#717171] hover:text-[#222222] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs divide-y divide-[#EBEBEB]">
              {/* Snapshot Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#717171] block font-medium">Attending Doctor</span>
                  <span className="text-sm font-bold text-[#222222] block mt-0.5">
                    {selectedAppointment.doctorName}
                  </span>
                  <span className="text-[#717171]">{selectedAppointment.specialty}</span>
                </div>

                <div>
                  <span className="text-[#717171] block font-medium">Scheduled Time</span>
                  <span className="text-sm font-bold text-[#222222] block mt-0.5">
                    {selectedAppointment.time}
                  </span>
                  <span className="text-[#717171]">{selectedAppointment.date}</span>
                </div>

                <div>
                  <span className="text-[#717171] block font-medium">Visit Type &amp; Room</span>
                  <span className="font-semibold text-[#222222] block mt-0.5">
                    {selectedAppointment.visitType}
                  </span>
                  <span className="text-[#717171]">{selectedAppointment.room || 'Room 102'}</span>
                </div>

                <div>
                  <span className="text-[#8e8e8e] block font-medium">Consultation Fee</span>
                  <span className="font-bold text-[#0e162b] text-sm block mt-0.5">
                    ${selectedAppointment.amount}
                  </span>
                  <span className="text-[#1fc16b] font-semibold">{selectedAppointment.paymentStatus}</span>
                </div>
              </div>

              {/* Patient Demographics */}
              <div className="pt-4 space-y-2">
                <span className="font-bold text-[#0e162b] block">Patient Information</span>
                <div className="grid grid-cols-2 gap-2 text-[#8e8e8e]">
                  <span>Age: <strong className="text-[#0e162b]">{selectedAppointment.patientAge} years</strong></span>
                  <span>Sex: <strong className="text-[#0e162b]">{selectedAppointment.patientSex}</strong></span>
                  <span>Phone: <strong className="text-[#0e162b]">{selectedAppointment.patientPhone}</strong></span>
                  <span>Patient ID: <code className="text-[#0e162b]">{selectedAppointment.patientId}</code></span>
                </div>
              </div>

              {/* Reported Reason & Symptoms */}
              <div className="pt-4 space-y-2">
                <span className="font-bold text-[#0e162b] block">Reason for Consultation</span>
                <p className="p-3 bg-[#f7f8fa] rounded-xl text-[#0e162b] font-medium leading-relaxed">
                  &ldquo;{selectedAppointment.reasonForVisit}&rdquo;
                </p>

                {(selectedAppointment.symptoms || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(selectedAppointment.symptoms || []).map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-[#f0f2f5] text-[#0e162b] text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-[#e8e8e8] bg-[#f7f8fa] flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsDetailDrawerOpen(false);
                  handleOpenPatientChart(selectedAppointment.patientId);
                }}
                className="text-xs text-[#00c0fe] hover:underline font-semibold"
              >
                Open Full Longitudinal Chart →
              </button>

              <div className="flex items-center space-x-2">
                {selectedAppointment.status === 'Requested' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        rejectAppointment(selectedAppointment.id);
                        setIsDetailDrawerOpen(false);
                      }}
                      className="px-4 py-2 rounded-full border border-[#e8e8e8] hover:border-[#0e162b] text-xs font-semibold text-[#0e162b]"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        acceptAppointment(selectedAppointment.id);
                        setIsDetailDrawerOpen(false);
                      }}
                      className="px-4 py-2 rounded-full bg-[#0e162b] text-white text-xs font-semibold hover:bg-[#213364]"
                    >
                      Accept Visit
                    </button>
                  </>
                )}

                {(selectedAppointment.status === 'Accepted' || selectedAppointment.status === 'Scheduled') && (
                  <button
                    type="button"
                    onClick={() => {
                      checkInPatient(selectedAppointment.id);
                      setIsDetailDrawerOpen(false);
                    }}
                    className="px-4 py-2 rounded-full bg-[#0e162b] text-white text-xs font-semibold hover:bg-[#213364] flex items-center space-x-1.5"
                  >
                    <DoorOpen className="w-3.5 h-3.5" />
                    <span>Check-in Patient</span>
                  </button>
                )}

                {(selectedAppointment.status === 'Checked-in' || selectedAppointment.status === 'In consultation') && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailDrawerOpen(false);
                      handleOpenConsultation(selectedAppointment.id);
                    }}
                    className="px-4 py-2 rounded-full bg-[#00c0fe] text-white text-xs font-semibold hover:bg-[#0095c5] flex items-center space-x-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Open Clinical Encounter</span>
                  </button>
                )}

                {selectedAppointment.status === 'Completed' && (
                  <span className="text-xs text-[#1fc16b] font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Encounter Finalized</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
