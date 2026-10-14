import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  UserCheck,
  AlertCircle,
  Plus,
  ArrowRight,
  FileUp,
  UserPlus,
  Check,
  X,
  Stethoscope,
} from 'lucide-react';

export const AdminOperationalCenter: React.FC = () => {
  const {
    appointments,
    patients,
    doctors,
    currentClinicName,
    setActiveTab,
    acceptAppointment,
    rejectAppointment,
    checkInPatient,
    startConsultation,
    setSelectedPatientId,
  } = useClinicOperations();

  const [filterType, setFilterType] = useState<'all' | 'requests' | 'waiting' | 'consulting'>('all');

  // Operational queues
  const appointmentRequests = appointments.filter((a) => a.status === 'Requested');
  const waitingPatients = appointments.filter((a) => a.status === 'Checked-in');
  const activeConsultations = appointments.filter((a) => a.status === 'In consultation');
  const todayScheduled = appointments.filter((a) => a.date === '2024-09-14');

  const filteredAppointments = todayScheduled.filter((a) => {
    if (filterType === 'requests') return a.status === 'Requested';
    if (filterType === 'waiting') return a.status === 'Checked-in';
    if (filterType === 'consulting') return a.status === 'In consultation';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Clinic Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Today&apos;s Clinic
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            {currentClinicName} · Facility Operations & Desk Management
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00c0fe] hover:bg-[#0095c5] text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Appointment</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('patients')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#e8e8e8] hover:border-[#0e162b] bg-white text-[#0e162b] rounded-full text-xs font-medium transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#8e8e8e]" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* Operational Pulse Bar (Compact, essential metrics only) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setFilterType('requests')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterType === 'requests'
              ? 'border-[#00c0fe] bg-[#aaeaff]/10'
              : 'border-[#e8e8e8] bg-white hover:border-[#bbbbbb]'
          }`}
        >
          <span className="text-xs text-[#8e8e8e] block">Pending Requests</span>
          <span className="text-2xl font-semibold text-[#0e162b] mt-1 block">
            {appointmentRequests.length}
          </span>
          <span className="text-[11px] text-[#d00416] font-medium">Needs review</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('waiting')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterType === 'waiting'
              ? 'border-[#00c0fe] bg-[#aaeaff]/10'
              : 'border-[#e8e8e8] bg-white hover:border-[#bbbbbb]'
          }`}
        >
          <span className="text-xs text-[#8e8e8e] block">Waiting in Lobby</span>
          <span className="text-2xl font-semibold text-[#0e162b] mt-1 block">
            {waitingPatients.length}
          </span>
          <span className="text-[11px] text-[#1fc16b] font-medium">Checked-in</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('consulting')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterType === 'consulting'
              ? 'border-[#00c0fe] bg-[#aaeaff]/10'
              : 'border-[#e8e8e8] bg-white hover:border-[#bbbbbb]'
          }`}
        >
          <span className="text-xs text-[#8e8e8e] block">In Consultation</span>
          <span className="text-2xl font-semibold text-[#0e162b] mt-1 block">
            {activeConsultations.length}
          </span>
          <span className="text-[11px] text-[#8e8e8e]">With doctors</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterType === 'all'
              ? 'border-[#00c0fe] bg-[#aaeaff]/10'
              : 'border-[#e8e8e8] bg-white hover:border-[#bbbbbb]'
          }`}
        >
          <span className="text-xs text-[#8e8e8e] block">Total Today</span>
          <span className="text-2xl font-semibold text-[#0e162b] mt-1 block">
            {todayScheduled.length}
          </span>
          <span className="text-[11px] text-[#8e8e8e]">Scheduled visits</span>
        </button>
      </div>

      {/* 1. URGENT APPOINTMENT REQUESTS QUEUE (Requires Admin action) */}
      {appointmentRequests.length > 0 && (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0e162b] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#d00416]" />
              <span>Appointment Requests Awaiting Review ({appointmentRequests.length})</span>
            </h2>
            <span className="text-xs text-[#8e8e8e]">Action required</span>
          </div>

          <div className="divide-y divide-[#e8e8e8]">
            {appointmentRequests.map((apt) => (
              <div key={apt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#0e162b]">{apt.patientName}</span>
                    <span className="text-xs text-[#8e8e8e]">({apt.patientAge}y · {apt.patientSex})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#fb3748]/15 text-[#d00416]">
                      {apt.triagePriority}
                    </span>
                  </div>
                  <p className="text-xs text-[#8e8e8e] mt-0.5">
                    Requested with <strong>{apt.doctorName}</strong> ({apt.specialty}) · {apt.date} at {apt.time}
                  </p>
                  <p className="text-xs text-[#333333] italic mt-0.5">
                    &ldquo;{apt.reasonForVisit}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => acceptAppointment(apt.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1fc16b] hover:bg-[#199d57] text-white rounded-full text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectAppointment(apt.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#e8e8e8] hover:bg-[#f5f7fa] text-[#8e8e8e] rounded-full text-xs font-medium transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TODAY'S CLINIC SCHEDULE & PATIENT FLOW */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#222222]">
              {filterType === 'all'
                ? "Today's Schedule & Room Flow"
                : filterType === 'waiting'
                ? 'Lobby Waiting Queue'
                : filterType === 'consulting'
                ? 'Active Consultations'
                : 'Pending Requests'}
            </h2>
            <p className="text-xs text-[#717171]">
              Showing {filteredAppointments.length} patient encounters
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className="text-xs font-semibold text-[#00c0fe] hover:underline"
          >
            View full calendar
          </button>
        </div>

        <div className="divide-y divide-[#e8e8e8]">
          {filteredAppointments.map((apt) => {
            const isCheckedIn = apt.status === 'Checked-in';
            const isInConsultation = apt.status === 'In consultation';
            const isCompleted = apt.status === 'Completed' || apt.status === 'Closed';

            return (
              <div key={apt.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-12 pt-0.5 text-[#8e8e8e] font-mono text-xs shrink-0">
                    {apt.time}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-[#0e162b]">{apt.patientName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          isCheckedIn
                            ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                            : isInConsultation
                            ? 'bg-[#00c0fe]/15 text-[#0095c5]'
                            : isCompleted
                            ? 'bg-[#f0f2f5] text-[#606060]'
                            : 'bg-[#f0f2f5] text-[#0e162b]'
                        }`}
                      >
                        {apt.status}
                      </span>
                      {apt.room && (
                        <span className="text-[11px] text-[#8e8e8e]">Room: {apt.room}</span>
                      )}
                    </div>
                    <p className="text-[#606060] mt-0.5">
                      Attending: {apt.doctorName} ({apt.specialty}) · {apt.visitType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {apt.status === 'Scheduled' && (
                    <button
                      type="button"
                      onClick={() => checkInPatient(apt.id)}
                      className="px-3 py-1 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-medium transition-colors"
                    >
                      Check in
                    </button>
                  )}
                  {apt.status === 'Checked-in' && (
                    <button
                      type="button"
                      onClick={() => startConsultation(apt.id)}
                      className="px-3 py-1 bg-[#00c0fe] hover:bg-[#0095c5] text-white rounded-full text-xs font-semibold transition-colors"
                    >
                      Call to Room
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatientId(apt.patientId);
                      setActiveTab('patients');
                    }}
                    className="px-2.5 py-1 border border-[#DDDDDD] hover:border-[#222222] text-[#222222] rounded-full text-xs font-medium transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
