import React, { useState } from 'react';
import { AppointmentRecord } from '../../types/operations';
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  CheckCircle2,
  Clock,
  User,
  XCircle,
  Stethoscope,
  DoorOpen,
  Calendar as CalendarIcon,
  Filter,
  SlidersHorizontal,
  X,
  ArrowRight,
} from 'lucide-react';

interface AppointmentWeeklyCalendarProps {
  appointments: AppointmentRecord[];
  selectedAppointmentId: string | null;
  onSelectAppointment: (id: string) => void;
  onCheckIn: (id: string) => void;
  onStartConsultation: (id: string) => void;
  onViewPatientChart: (patientId: string) => void;
}

interface CalendarSlotAppointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  timeStart: string;
  timeEnd: string;
  timeRange: string;
  reason: string;
  status: 'Completed' | 'Waiting' | 'Scheduled' | 'Canceled';
  dayIndex: number; // 0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri
  hourStart: number; // e.g. 9 for 09:00, 11 for 11:00
  originalAppointment?: AppointmentRecord;
}

export const AppointmentWeeklyCalendar: React.FC<AppointmentWeeklyCalendarProps> = ({
  appointments,
  selectedAppointmentId,
  onSelectAppointment,
  onCheckIn,
  onStartConsultation,
  onViewPatientChart,
}) => {
  // Calendar current week tracking (Reference: Image 3 "April 22, 2025")
  const [currentWeekLabel, setCurrentWeekLabel] = useState('April 21 – 25, 2025');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1); // Tuesday 22 is selected active day in Image 3
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>('All');
  const [inspectModalOpen, setInspectModalOpen] = useState(false);

  // Week days matching Image 3: MON 21, TUE 22, WED 23, THR 24, FRI 25
  const weekDays = [
    { label: 'MON', day: '21', dateStr: '2025-04-21' },
    { label: 'TUE', day: '22', dateStr: '2025-04-22', isToday: true },
    { label: 'WED', day: '23', dateStr: '2025-04-23' },
    { label: 'THR', day: '24', dateStr: '2025-04-24' },
    { label: 'FRI', day: '25', dateStr: '2025-04-25' },
  ];

  // Hourly grid rows from 09:00 to 16:00
  const hours = [
    { hour: 9, label: '09:00' },
    { hour: 10, label: '10:00' },
    { hour: 11, label: '11:00' },
    { hour: 12, label: '12:00', isBreak: true },
    { hour: 13, label: '13:00' },
    { hour: 14, label: '14:00' },
    { hour: 15, label: '15:00' },
    { hour: 16, label: '16:00' },
  ];

  // Map real context appointments and populate sample slots matching Image 3
  const calendarSlots: CalendarSlotAppointment[] = [
    {
      id: appointments[0]?.id || 'APT-8921',
      patientId: appointments[0]?.patientId || 'PAT-2024-0081',
      patientName: 'Tony Hack',
      doctorName: 'Dr. Sarah Jenkins',
      timeStart: '09:00',
      timeEnd: '10:00',
      timeRange: '09:00 - 10:00',
      reason: 'General Check-up',
      status: 'Completed',
      dayIndex: 1, // Tuesday
      hourStart: 9,
      originalAppointment: appointments[0],
    },
    {
      id: appointments[1]?.id || 'APT-8922',
      patientId: appointments[1]?.patientId || 'PAT-2024-0092',
      patientName: 'James Wong',
      doctorName: 'Dr. Sarah Jenkins',
      timeStart: '11:00',
      timeEnd: '12:00',
      timeRange: '11:00 - 12:00',
      reason: 'Headache & Migraine Follow-up',
      status: 'Waiting', // Patient is waiting
      dayIndex: 1, // Tuesday
      hourStart: 11,
      originalAppointment: appointments[1],
    },
    {
      id: appointments[2]?.id || 'APT-8923',
      patientId: appointments[2]?.patientId || 'PAT-2024-0105',
      patientName: 'Emily Watford',
      doctorName: 'Dr. Sarah Jenkins',
      timeStart: '14:00',
      timeEnd: '15:00',
      timeRange: '14:00 - 15:00',
      reason: 'Blood Pressure Check & ECG',
      status: 'Scheduled',
      dayIndex: 1, // Tuesday
      hourStart: 14,
      originalAppointment: appointments[2],
    },
    {
      id: 'APT-8924',
      patientId: 'PAT-2024-0129',
      patientName: 'Henderson Kai',
      doctorName: 'Dr. Michael Chen',
      timeStart: '10:00',
      timeEnd: '11:00',
      timeRange: '10:00 - 11:00',
      reason: 'Routine Cardiology Follow-up',
      status: 'Completed',
      dayIndex: 0, // Monday
      hourStart: 10,
    },
    {
      id: 'APT-8925',
      patientId: 'PAT-2024-0144',
      patientName: 'Fatima Al-Mansoor',
      doctorName: 'Dr. Almaz Tefera',
      timeStart: '13:00',
      timeEnd: '14:00',
      timeRange: '13:00 - 14:00',
      reason: 'Thyroid Hormonal Screening',
      status: 'Waiting',
      dayIndex: 2, // Wednesday
      hourStart: 13,
    },
    {
      id: 'APT-8926',
      patientId: 'PAT-2024-0081',
      patientName: 'Abebe Bekele',
      doctorName: 'Dr. Almaz Tefera',
      timeStart: '15:00',
      timeEnd: '16:00',
      timeRange: '15:00 - 16:00',
      reason: 'Post-consultation Medication Review',
      status: 'Scheduled',
      dayIndex: 3, // Thursday
      hourStart: 15,
    },
    {
      id: 'APT-8927',
      patientId: 'PAT-2024-0092',
      patientName: 'David Lee',
      doctorName: 'Dr. Michael Chen',
      timeStart: '09:00',
      timeEnd: '10:00',
      timeRange: '09:00 - 10:00',
      reason: 'Pre-operative Clearance',
      status: 'Canceled',
      dayIndex: 4, // Friday
      hourStart: 9,
    },
  ];

  const selectedSlot = calendarSlots.find(
    (s) => s.id === selectedAppointmentId || s.originalAppointment?.id === selectedAppointmentId
  ) || calendarSlots[1]; // default to James Wong if none

  const todayCount = calendarSlots.filter((s) => s.dayIndex === selectedDayIndex).length;

  const handleCardClick = (slot: CalendarSlotAppointment) => {
    onSelectAppointment(slot.id);
    setInspectModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP TIMELINE TOOLBAR (Directly modeled after Image 3) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EBEBEB]">
        {/* Date Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1 border border-[#DDDDDD] rounded-full p-1 bg-white">
            <button
              type="button"
              onClick={() => setSelectedDayIndex((prev) => (prev > 0 ? prev - 1 : 0))}
              className="p-1.5 hover:bg-[#F7F7F7] rounded-full text-[#717171] hover:text-[#222222] transition-colors"
              title="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-[#222222]">
              {weekDays[selectedDayIndex].label} {weekDays[selectedDayIndex].day}, 2025
            </span>
            <button
              type="button"
              onClick={() => setSelectedDayIndex((prev) => (prev < 4 ? prev + 1 : 4))}
              className="p-1.5 hover:bg-[#F7F7F7] rounded-full text-[#717171] hover:text-[#222222] transition-colors"
              title="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDayIndex(1)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] transition-colors"
          >
            Today
          </button>

          {/* Dynamic Appointment Count Pill (from Image 3: "3 appointments today") */}
          <span className="text-xs font-semibold text-[#717171] bg-[#F7F7F7] px-3 py-1.5 rounded-full hidden sm:inline">
            {todayCount} appointments today
          </span>
        </div>

        {/* Right Tools: Filter Button & View Controls */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="px-3.5 py-1.5 border border-[#DDDDDD] hover:border-[#222222] text-[#222222] rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-[#717171]" />
              <span>Filter ({activeFilterStatus})</span>
            </button>

            {filterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#EBEBEB] p-2 z-30 space-y-1 text-xs">
                {['All', 'Completed', 'Waiting', 'Scheduled', 'Canceled'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setActiveFilterStatus(status);
                      setFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl font-medium transition-colors ${
                      activeFilterStatus === status
                        ? 'bg-[#222222] text-white'
                        : 'hover:bg-[#F7F7F7] text-[#222222]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-[#EBEBEB]" />

          <span className="text-[11px] font-mono text-[#717171] bg-[#F7F7F7] px-2.5 py-1 rounded-full">
            Week 17 · 2025
          </span>
        </div>
      </div>

      {/* 2. WEEKLY CALENDAR GRID (Exact Replica of Image 3) */}
      <div className="border border-[#EBEBEB] rounded-3xl bg-white overflow-hidden shadow-xs">
        {/* Day Column Headers */}
        <div className="grid grid-cols-6 border-b border-[#EBEBEB] bg-[#FAFAFA] text-xs">
          {/* Timezone label */}
          <div className="p-3.5 border-r border-[#EBEBEB] flex items-center justify-center font-mono font-semibold text-[#717171]">
            GMT +1
          </div>

          {/* 5 Day Headers: MON 21, TUE 22, WED 23, THR 24, FRI 25 */}
          {weekDays.map((d, index) => {
            const isSelected = selectedDayIndex === index;
            return (
              <button
                key={d.label}
                type="button"
                onClick={() => setSelectedDayIndex(index)}
                className={`p-3.5 text-center border-r border-[#EBEBEB] last:border-r-0 transition-colors focus:outline-none ${
                  isSelected ? 'bg-white font-bold' : 'hover:bg-white/60 text-[#717171]'
                }`}
              >
                <span
                  className={`text-xs block uppercase ${
                    isSelected ? 'text-[#0066CC] font-bold' : 'text-[#717171]'
                  }`}
                >
                  {d.label}
                </span>
                <span
                  className={`text-base font-bold mt-0.5 block ${
                    isSelected ? 'text-[#0066CC]' : 'text-[#222222]'
                  }`}
                >
                  {d.day}
                </span>
              </button>
            );
          })}
        </div>

        {/* Hourly Rows */}
        <div className="divide-y divide-[#EBEBEB] relative text-xs">
          {/* CURRENT TIME INDICATOR LINE (Image 3: "11:15" with blue dot and cyan horizontal rule) */}
          <div
            className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
            style={{ top: '35%' }}
          >
            {/* Time label pill */}
            <div className="w-16 sm:w-20 pl-2 sm:pl-3 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0066CC] ring-4 ring-[#0066CC]/20 shrink-0" />
              <span className="text-[10px] font-mono font-bold text-[#0066CC] bg-white px-1 rounded shadow-2xs">
                11:15
              </span>
            </div>
            {/* Cyan horizontal indicator line across columns */}
            <div className="flex-1 h-0.5 bg-[#00A3FF]" />
          </div>

          {hours.map((h) => {
            // Check if this row is 12:00 Break Time
            if (h.isBreak) {
              return (
                <div key={h.hour} className="grid grid-cols-6 min-h-[58px] bg-[#F9F9F9]">
                  {/* Time Label */}
                  <div className="p-3 border-r border-[#EBEBEB] text-[#717171] font-mono font-semibold flex items-center justify-center">
                    {h.label}
                  </div>

                  {/* BREAK TIME STRIPED ROW (Image 3) */}
                  <div className="col-span-5 relative flex items-center justify-center overflow-hidden bg-[repeating-linear-gradient(45deg,#F2F2F2,#F2F2F2_10px,#FAFAFA_10px,#FAFAFA_20px)]">
                    <div className="px-4 py-1 rounded-full bg-white border border-[#EBEBEB] shadow-2xs flex items-center gap-2 text-xs font-semibold text-[#717171]">
                      <Coffee className="w-3.5 h-3.5 text-[#B26B00]" />
                      <span>Break Time</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={h.hour} className="grid grid-cols-6 min-h-[96px] relative">
                {/* Time Label */}
                <div className="p-3 border-r border-[#EBEBEB] text-[#717171] font-mono font-medium flex items-start justify-center pt-3">
                  {h.label}
                </div>

                {/* Day Slot Cells */}
                {weekDays.map((d, dIdx) => {
                  // Find appointment starting at this day & hour
                  const slotApt = calendarSlots.find(
                    (s) =>
                      s.dayIndex === dIdx &&
                      s.hourStart === h.hour &&
                      (activeFilterStatus === 'All' || s.status === activeFilterStatus)
                  );

                  return (
                    <div
                      key={dIdx}
                      className={`p-2 border-r border-[#EBEBEB] last:border-r-0 transition-colors relative min-h-[96px] ${
                        selectedDayIndex === dIdx ? 'bg-[#FDFEFF]/50' : ''
                      }`}
                    >
                      {slotApt && (
                        <div
                          onClick={() => handleCardClick(slotApt)}
                          className={`h-full p-2.5 rounded-2xl bg-white border cursor-pointer transition-all shadow-xs hover:shadow-md hover:scale-[1.01] flex flex-col justify-between ${
                            slotApt.status === 'Completed'
                              ? 'border-l-4 border-l-[#1fc16b] border-[#e8e8e8]'
                              : slotApt.status === 'Waiting'
                              ? 'border-l-4 border-l-[#dfb400] border-[#e8e8e8]'
                              : slotApt.status === 'Scheduled'
                              ? 'border-l-4 border-l-[#00c0fe] border-[#e8e8e8]'
                              : 'border-l-4 border-l-[#fb3748] border-[#e8e8e8]'
                          }`}
                        >
                          {/* Top row: Time badge & Reason */}
                          <div>
                            <span className="text-[10px] font-mono font-semibold text-[#8e8e8e] block">
                              {slotApt.timeRange}
                            </span>
                            <h4 className="text-xs font-bold text-[#0e162b] truncate mt-0.5">
                              {slotApt.patientName}
                            </h4>
                            <p className="text-[11px] text-[#606060] truncate">
                              {slotApt.reason}
                            </p>
                          </div>

                          {/* Bottom row: Status Pill */}
                          <div className="mt-2">
                            {slotApt.status === 'Completed' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] text-[10px] font-semibold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Completed</span>
                              </span>
                            )}
                            {slotApt.status === 'Waiting' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdb43]/20 text-[#dfb400] text-[10px] font-semibold">
                                <User className="w-3 h-3" />
                                <span>Patient is waiting</span>
                              </span>
                            )}
                            {slotApt.status === 'Scheduled' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00c0fe]/15 text-[#0095c5] text-[10px] font-semibold">
                                <Clock className="w-3 h-3" />
                                <span>Scheduled</span>
                              </span>
                            )}
                            {slotApt.status === 'Canceled' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fb3748]/10 text-[#d00416] text-[10px] font-semibold">
                                <XCircle className="w-3 h-3" />
                                <span>Canceled</span>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SELECTED APPOINTMENT INSPECTOR MODAL / SLIDEOVER */}
      {inspectModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#EBEBEB] space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717171]">
                  Appointment Details · Suite 101
                </span>
                <h3 className="text-xl font-bold text-[#222222] mt-0.5">
                  {selectedSlot.patientName}
                </h3>
                <p className="text-xs text-[#717171]">
                  {selectedSlot.timeRange} · {selectedSlot.doctorName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#f0f2f5] rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#606060]">Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    selectedSlot.status === 'Completed'
                      ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                      : selectedSlot.status === 'Waiting'
                      ? 'bg-[#ffdb43]/20 text-[#dfb400]'
                      : selectedSlot.status === 'Scheduled'
                      ? 'bg-[#00c0fe]/15 text-[#0095c5]'
                      : 'bg-[#fb3748]/10 text-[#d00416]'
                  }`}
                >
                  {selectedSlot.status === 'Waiting' ? 'Patient is waiting in room' : selectedSlot.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#606060]">Reason for Visit:</span>
                <strong className="text-[#0e162b]">{selectedSlot.reason}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#606060]">Appointment ID:</span>
                <span className="font-mono text-[#0e162b]">{selectedSlot.id}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {(selectedSlot.status === 'Waiting' || selectedSlot.status === 'Scheduled') && (
                <button
                  type="button"
                  onClick={() => {
                    setInspectModalOpen(false);
                    onStartConsultation(selectedSlot.id);
                  }}
                  className="w-full py-2.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Start Consultation & Enter Results</span>
                </button>
              )}

              {selectedSlot.status === 'Scheduled' && (
                <button
                  type="button"
                  onClick={() => {
                    onCheckIn(selectedSlot.id);
                    setInspectModalOpen(false);
                  }}
                  className="w-full py-2.5 bg-[#222222] hover:bg-black text-white rounded-full font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>Check-in Patient</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setInspectModalOpen(false);
                  onViewPatientChart(selectedSlot.patientId);
                }}
                className="w-full py-2.5 border border-[#DDDDDD] hover:border-[#222222] text-[#222222] rounded-full font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>View Full Patient History & Chart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
