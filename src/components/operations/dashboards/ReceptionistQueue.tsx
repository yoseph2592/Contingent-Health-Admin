import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Search,
  Plus,
  UserCheck,
  Building,
  Bell,
} from 'lucide-react';

export const ReceptionistQueue: React.FC = () => {
  const {
    appointments,
    checkInPatient,
    setActiveTab,
    setSelectedPatientId,
  } = useClinicOperations();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeStage, setActiveStage] = useState<'all' | 'waiting' | 'checked_in' | 'with_doctor' | 'completed'>('all');

  const todayApts = appointments.filter((a) => a.date === '2024-09-14');

  const waitingArrival = todayApts.filter((a) => a.status === 'Scheduled');
  const checkedIn = todayApts.filter((a) => a.status === 'Checked-in');
  const withDoctor = todayApts.filter((a) => a.status === 'In consultation');
  const completed = todayApts.filter((a) => a.status === 'Completed' || a.status === 'Closed');

  const filteredList = todayApts.filter((a) => {
    if (activeStage === 'waiting') return a.status === 'Scheduled';
    if (activeStage === 'checked_in') return a.status === 'Checked-in';
    if (activeStage === 'with_doctor') return a.status === 'In consultation';
    if (activeStage === 'completed') return a.status === 'Completed' || a.status === 'Closed';
    return true;
  }).filter((a) => {
    if (!searchQuery) return true;
    return (
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientPhone.includes(searchQuery) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Front Desk & Patient Flow
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Today&apos;s Queue
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Arrivals, room assignment, and appointment status tracking
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('patients')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Patient</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#e8e8e8] hover:border-[#0e162b] bg-white text-[#0e162b] rounded-full text-xs font-medium transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-[#606060]" />
            <span>Book Slot</span>
          </button>
        </div>
      </div>

      {/* Patient Flow Pipeline (Waiting -> Checked-in -> With Doctor -> Completed) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveStage('waiting')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeStage === 'waiting'
              ? 'border-[#00c0fe] bg-[#f0f9ff]'
              : 'border-[#e8e8e8] bg-white hover:border-[#bbbbbb]'
          }`}
        >
          <span className="text-xs text-[#606060] block">1. Awaiting Arrival</span>
          <span className="text-2xl font-semibold text-[#0e162b] mt-1 block">
            {waitingArrival.length}
          </span>
          <span className="text-[11px] text-[#8e8e8e]">Expected today</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStage('checked_in')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeStage === 'checked_in'
              ? 'border-[#00c0fe] bg-[#f0f9ff]'
              : 'border-[#e8e8e8] bg-white hover:border-[#bbbbbb]'
          }`}
        >
          <span className="text-xs text-[#606060] block">2. In Waiting Lobby</span>
          <span className="text-2xl font-semibold text-[#0e162b] mt-1 block">
            {checkedIn.length}
          </span>
          <span className="text-[11px] text-[#1fc16b] font-medium">Ready for doctor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStage('with_doctor')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeStage === 'with_doctor'
              ? 'border-[#00c0fe] bg-[#f0f9ff]'
              : 'border-[#e8e8e8] bg-white hover:border-[#bbbbbb]'
          }`}
        >
          <span className="text-xs text-[#606060] block">3. With Doctor</span>
          <span className="text-2xl font-semibold text-[#0e162b] mt-1 block">
            {withDoctor.length}
          </span>
          <span className="text-[11px] text-[#00c0fe] font-medium">In consultation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStage('completed')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeStage === 'completed'
              ? 'border-[#00c0fe] bg-[#f0f9ff]'
              : 'border-[#e8e8e8] bg-white hover:border-[#bbbbbb]'
          }`}
        >
          <span className="text-xs text-[#606060] block">4. Completed</span>
          <span className="text-2xl font-semibold text-[#0e162b] mt-1 block">
            {completed.length}
          </span>
          <span className="text-[11px] text-[#8e8e8e]">Checked out</span>
        </button>
      </div>

      {/* Search & Fast Check-In Table */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#717171] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name or phone..."
              className="w-full pl-9 pr-3 py-1.5 border border-[#DDDDDD] rounded-full text-xs text-[#222222] focus:outline-none focus:border-[#222222]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStage('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeStage === 'all'
                  ? 'bg-[#222222] text-white'
                  : 'bg-[#F7F7F7] text-[#717171] hover:text-[#222222]'
              }`}
            >
              All Today ({todayApts.length})
            </button>
          </div>
        </div>

        {/* List of Patients (NO clinical notes, diagnoses, or prescriptions exposed) */}
        <div className="divide-y divide-[#EBEBEB]">
          {filteredList.map((apt) => {
            const isWaitingArrival = apt.status === 'Scheduled';
            const isCheckedIn = apt.status === 'Checked-in';
            const isInConsult = apt.status === 'In consultation';

            return (
              <div key={apt.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="w-12 text-[#8e8e8e] font-mono shrink-0">
                    {apt.time}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-[#0e162b]">{apt.patientName}</span>
                      <span className="text-[#606060]">({apt.patientAge}y · {apt.patientSex})</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          isCheckedIn
                            ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                            : isInConsult
                            ? 'bg-[#00c0fe]/15 text-[#0095c5]'
                            : 'bg-[#f0f2f5] text-[#606060]'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-[#606060] mt-0.5">
                      Doctor: {apt.doctorName} · {apt.room || 'Suite 101'} · Phone: {apt.patientPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isWaitingArrival && (
                    <button
                      type="button"
                      onClick={() => checkInPatient(apt.id)}
                      className="px-3 py-1.5 bg-[#00c0fe] hover:bg-[#0095c5] text-white rounded-full text-xs font-semibold shadow-2xs transition-colors"
                    >
                      Check in
                    </button>
                  )}

                  {isCheckedIn && (
                    <span className="text-xs text-[#1fc16b] font-medium px-2 py-1 bg-[#84ebb4]/25 rounded-full">
                      Checked in · In lobby
                    </span>
                  )}

                  {isInConsult && (
                    <span className="text-xs text-[#00c0fe] font-medium px-2 py-1 bg-[#00c0fe]/15 rounded-full">
                      With doctor now
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
