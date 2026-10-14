import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  Share2,
  Plus,
} from 'lucide-react';

export const ViewReferrals: React.FC = () => {
  const { referrals, setIsReferralModalOpen, setSelectedPatientId, setActiveTab } =
    useClinicOperations();

  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = referrals.filter((r) => statusFilter === 'All' || r.status === statusFilter);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Care Continuity
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Referrals
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Tertiary specialist requisitions, hospital coordination, and closed-loop encounter tracking
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsReferralModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New referral</span>
        </button>
      </div>

      {/* Pill Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['All', 'Sent', 'Accepted', 'Completed'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              statusFilter === s
                ? 'bg-[#0e162b] text-white'
                : 'bg-white border border-[#e8e8e8] text-[#606060] hover:text-[#0e162b]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Referral Cards */}
      <div className="space-y-4">
        {filtered.map((rf) => (
          <div
            key={rf.id}
            className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-4 hover:border-[#bbbbbb] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#e8e8e8] pb-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-[#f0f2f5] text-[#0e162b] rounded-xl shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-[#0e162b] text-sm">{rf.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0f2f5] text-[#606060]">
                      {rf.status}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rf.urgency === 'Immediate'
                          ? 'bg-[#fb3748]/10 text-[#d00416]'
                          : rf.urgency === 'Urgent'
                          ? 'bg-[#ffdb43]/20 text-[#dfb400]'
                          : 'bg-[#f0f2f5] text-[#606060]'
                      }`}
                    >
                      {rf.urgency}
                    </span>
                  </div>
                  <p className="text-xs text-[#717171] mt-1">
                    Patient:{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatientId(rf.patientId);
                        setActiveTab('patients');
                      }}
                      className="font-semibold text-[#222222] hover:underline"
                    >
                      {rf.patientName}
                    </button>{' '}
                    · Referring Doctor: <strong className="text-[#222222] font-semibold">{rf.referringDoctorName}</strong> on {rf.sentDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Destination facility & services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#F7F7F7] rounded-xl space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
                  Receiving Facility & Specialty
                </span>
                <p className="font-semibold text-[#222222] text-sm">{rf.destinationFacility}</p>
                <p className="text-xs text-[#717171]">{rf.destinationSpecialty}</p>
                <p className="text-xs text-[#717171]">Service requested: {rf.requestedService}</p>
              </div>

              <div className="p-4 bg-[#F7F7F7] rounded-xl space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
                  Clinical Indication & Diagnosis
                </span>
                <p className="font-semibold text-[#222222]">{rf.reason}</p>
                <p className="text-xs text-[#717171]">Diagnosis: {rf.diagnosis}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#606060] pt-1">
              <span>Transmitted electronically via Contingent Healthcare Network</span>
              <span className="font-medium text-[#1fc16b]">Continuity maintained</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
