import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { DoctorEncounterResultModal } from '../DoctorEncounterResultModal';
import {
  ExternalLink,
  Hourglass,
  TrendingUp,
  ArrowRight,
  Edit3,
} from 'lucide-react';

export const DoctorMyDayDashboard: React.FC = () => {
  const {
    appointments,
    labRequests,
    prescriptions,
    setSelectedPatientId,
    setSelectedAppointmentId,
    setActiveTab,
    startConsultation,
  } = useClinicOperations();

  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Dedicated patient avatar references matching Image exactly
  const patientAvatars: Record<string, string> = {
    'PAT-2024-0105': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80', // Dawit Haile
    'PAT-2024-0081': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80', // Abebe Bekele
    'PAT-2024-0092': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80', // Sarah Melkamu
    'PAT-2024-0118': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80', // Helen Deriba
  };

  const getPatientAvatar = (patientId: string) => {
    return (
      patientAvatars[patientId] ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'
    );
  };

  const handleOpenPatientChart = (patientId: string, appointmentId?: string) => {
    setSelectedPatientId(patientId);
    if (appointmentId) {
      setSelectedAppointmentId(appointmentId);
      startConsultation(appointmentId);
    } else {
      setActiveTab('encounter');
    }
  };

  const handleOpenDirectResultsModal = (patientId: string, appointmentId?: string) => {
    setSelectedPatientId(patientId);
    if (appointmentId) {
      setSelectedAppointmentId(appointmentId);
      startConsultation(appointmentId);
    }
    setIsResultModalOpen(true);
  };

  // Appointments queue configured to match image
  interface QueueItem {
    id: string;
    patientId: string;
    patientName: string;
    time: string;
    status: 'In Consultation Right Now' | 'Checked-in' | 'Scheduled' | 'Completed';
    reason: string;
  }

  const queueItems: QueueItem[] = [
    {
      id: 'APT-8921',
      patientId: 'PAT-2024-0081',
      patientName: 'Abebe Bekele',
      time: '14:30',
      status: 'In Consultation Right Now',
      reason: 'Hypertension and routine Glycemic control assessment with recent dizziness episodes',
    },
    {
      id: 'APT-8922',
      patientId: 'PAT-2024-0092',
      patientName: 'Sarah Melkamu',
      time: '15:15',
      status: 'Checked-in',
      reason: 'Exertional dyspnea and tachycardia evaluation following viral illness',
    },
    {
      id: 'APT-8923',
      patientId: 'PAT-2024-0118',
      patientName: 'Helen Deriba',
      time: '16:00',
      status: 'Scheduled',
      reason: 'Exertional dyspnea and tachycardia evaluation following viral illness',
    },
    {
      id: 'APT-8927',
      patientId: 'PAT-2024-0105',
      patientName: 'Dawit Haile',
      time: '11:00',
      status: 'Completed',
      reason: 'Semi-annual lipid and cardiovascular monitoring visit',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 select-none">
      {/* 1. Header: Doctor Identity & View Appointments Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0e162b]">
            My Day
          </h1>
          <p className="text-sm text-[#8e8e8e] mt-1 font-normal">
            Dr. Almaz Tefera, MD · Internal Medicine &amp; Endocrinology
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-sm font-semibold transition-all shadow-xs self-start sm:self-auto"
        >
          View Appointments
        </button>
      </div>

      {/* 2. KPI STAT CARDS (4-Column Layout Matching Image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Patients Today */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-xs flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#606060]">Total Patients Today</span>
            <button
              type="button"
              onClick={() => setActiveTab('patients')}
              className="text-[#8e8e8e] hover:text-[#0e162b] transition-colors p-1"
              title="View patients"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#0e162b]">
                {Math.max((appointments || []).length, 7)}
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#84ebb4]/25 text-[#1fc16b] border border-[#1fc16b]/20">
                <TrendingUp className="w-3 h-3" />
                <span>+2.9%</span>
              </span>
            </div>
            <p className="text-xs text-[#8e8e8e] mt-2 font-normal">
              Daily scheduled throughput
            </p>
          </div>
        </div>

        {/* Stat 2: Waiting in Clinic */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-xs flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#606060]">Waiting in Clinic</span>
            <button
              type="button"
              onClick={() => setActiveTab('appointments')}
              className="text-[#8e8e8e] hover:text-[#0e162b] transition-colors p-1"
              title="View queue"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#0e162b]">2</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ffdb43]/20 text-[#dfb400] border border-[#dfb400]/25">
                <Hourglass className="w-3 h-3" />
                <span>Checked In</span>
              </span>
            </div>
            <p className="text-xs text-[#8e8e8e] mt-2 font-normal">
              Average triage wait: 8 mins
            </p>
          </div>
        </div>

        {/* Stat 3: Prescriptions (Rx) */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-xs flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#606060]">Prescriptions (Rx)</span>
            <button
              type="button"
              onClick={() => setActiveTab('prescriptions')}
              className="text-[#8e8e8e] hover:text-[#0e162b] transition-colors p-1"
              title="View prescriptions"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#0e162b]">
                {Math.max((prescriptions || []).length, 2)}
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#84ebb4]/25 text-[#1fc16b] border border-[#1fc16b]/20">
                <TrendingUp className="w-3 h-3" />
                <span>+1.8%</span>
              </span>
            </div>
            <p className="text-xs text-[#8e8e8e] mt-2 font-normal">
              Active regimens managed
            </p>
          </div>
        </div>

        {/* Stat 4: Pending Diagnostic Labs */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-xs flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#606060]">Pending Diagnostic Labs</span>
            <button
              type="button"
              onClick={() => setActiveTab('diagnostics')}
              className="text-[#8e8e8e] hover:text-[#0e162b] transition-colors p-1"
              title="View lab orders"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#0e162b]">0</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fb3748]/15 text-[#d00416] border border-[#d00416]/20">
                Review Required
              </span>
            </div>
            <p className="text-xs text-[#8e8e8e] mt-2 font-normal">
              Awaiting physician sign-off
            </p>
          </div>
        </div>
      </div>

      {/* 3. Section: Your Priority Clinical Tasks */}
      <div className="bg-white border border-[#e8e8e8] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[#0e162b]">
            Your Priority Clinical Tasks
          </h2>
          <span className="px-3 py-1 bg-[#f0f2f5] text-[#4a4a4a] text-xs font-semibold rounded-full">
            1 actions required
          </span>
        </div>

        {/* Task Card: Dawit Haile (Active Consultation) */}
        <div className="rounded-2xl border border-[#e8e8e8] p-5 sm:p-6 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-[#e8e8e8] shrink-0 bg-[#f5f7fa]">
                <img
                  src={getPatientAvatar('PAT-2024-0105')}
                  alt="Dawit Haile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-[#0e162b]">Dawit Haile</h3>
                  <span className="font-mono text-xs text-[#8e8e8e]">PAT-2024-0105</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#606060] mt-1 font-normal">
                  <span>62 years old <strong className="font-semibold text-[#333333]">(Male)</strong></span>
                  <span className="text-[#bbbbbb]">·</span>
                  <span>Blood Type: <strong className="font-semibold text-[#333333]">B+</strong></span>
                  <span className="text-[#bbbbbb]">·</span>
                  <span>Last Update: <strong className="font-semibold text-[#333333]">2024-08-30</strong></span>
                </div>
              </div>
            </div>

            <div className="self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ffdb43]/20 text-[#dfb400] border border-[#dfb400]/25">
                <Hourglass className="w-3.5 h-3.5" />
                <span>In Consultation Right Now</span>
              </span>
            </div>
          </div>

          {/* Reason for Visit Container */}
          <div className="bg-[#f7f8fa] rounded-xl p-4 space-y-1 text-left">
            <span className="text-xs text-[#8e8e8e] font-normal block">Reason for Visit</span>
            <p className="text-sm text-[#0e162b] font-medium leading-relaxed">
              &ldquo;Hypertension and routine Glycemic control assessment with recent dizziness episodes&rdquo;
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleOpenDirectResultsModal('PAT-2024-0105', 'APT-8920')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold transition-all shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Enter Results</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenPatientChart('PAT-2024-0105', 'APT-8920')}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#e8e8e8] hover:bg-[#f5f7fa] bg-white text-[#333333] rounded-full text-xs font-semibold transition-all"
            >
              <span>View Full Chart</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8e8e8e]" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Section: Today's Appointments Queue */}
      <div className="bg-white border border-[#e8e8e8] rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#0e162b]">
              Today&apos;s Appointments Queue
            </h2>
            <p className="text-xs text-[#8e8e8e] mt-0.5 font-normal">
              1 waiting · 1 upcoming · 2 completed
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#e8e8e8] hover:bg-[#f5f7fa] text-[#333333] rounded-full text-xs font-medium transition-all self-start sm:self-auto"
          >
            <span>Open Schedule Timeline</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8e8e8e]" />
          </button>
        </div>

        {/* Appointment Rows List matching Image */}
        <div className="divide-y divide-[#f0f2f5]">
          {queueItems.map((item) => {
            const isCompleted = item.status === 'Completed';

            return (
              <div
                key={item.id}
                className="py-4.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Side: Time + Avatar + Name & Status + Reason */}
                <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
                  <span className="font-semibold text-xs text-[#606060] w-11 shrink-0 pt-1 sm:pt-0">
                    {item.time}
                  </span>

                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-1 ring-[#e8e8e8] bg-[#f5f7fa]">
                    <img
                      src={getPatientAvatar(item.patientId)}
                      alt={item.patientName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-bold text-sm text-[#0e162b] truncate">
                        {item.patientName}
                      </span>

                      {/* Status Badges */}
                      {item.status === 'In Consultation Right Now' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ffdb43]/20 text-[#dfb400] border border-[#dfb400]/25">
                          In Consultation Right Now
                        </span>
                      )}

                      {item.status === 'Checked-in' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ffdb43]/20 text-[#dfb400] border border-[#dfb400]/25">
                          Checked-in
                        </span>
                      )}

                      {item.status === 'Scheduled' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f0f2f5] text-[#606060]">
                          Scheduled
                        </span>
                      )}

                      {item.status === 'Completed' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#84ebb4]/25 text-[#1fc16b] border border-[#1fc16b]/20">
                          Completed
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#8e8e8e] mt-0.5 font-normal truncate max-w-md lg:max-w-xl">
                      {item.reason}
                    </p>
                  </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pl-14 sm:pl-0">
                  <button
                    type="button"
                    onClick={() => handleOpenPatientChart(item.patientId, item.id)}
                    className="px-4 py-2 rounded-full border border-[#e8e8e8] hover:bg-[#f5f7fa] text-xs font-semibold text-[#333333] transition-all"
                  >
                    Patient Chart
                  </button>

                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleOpenDirectResultsModal(item.patientId, item.id)}
                      className="px-4 py-2 rounded-full bg-[#0e162b] hover:bg-[#213364] text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      Enter Results
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Result Documentation Modal */}
      <DoctorEncounterResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
      />
    </div>
  );
};
