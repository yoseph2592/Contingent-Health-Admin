import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { DoctorProfileRecord } from '../../../types/operations';
import {
  CheckCircle2,
  Star,
  Check,
  Clock,
} from 'lucide-react';

export const ViewDoctors: React.FC = () => {
  const { doctors, acceptDoctorAffiliation, rejectDoctorAffiliation } = useClinicOperations();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfileRecord>(doctors[0]);

  const pendingDoctors = doctors.filter((d) => d.affiliationStatus === 'Pending Review');
  const activeDoctors = doctors.filter((d) => d.affiliationStatus === 'Active');

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
          Medical Staff
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
          Doctors & Affiliations
        </h1>
        <p className="text-sm text-[#717171] mt-0.5">
          Credential verification, contractual splits, practice assignments, and performance
        </p>
      </div>

      {/* Pending Affiliation Requests Banner */}
      {pendingDoctors.length > 0 && (
        <div className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#0e162b] font-semibold text-xs">
            <Clock className="w-4 h-4 text-[#fb3748]" />
            <span>Pending Affiliation Applications ({pendingDoctors.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingDoctors.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-[#f0f2f5] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#0e162b]">{doc.name}</span>
                    <span className="font-mono text-xs text-[#606060]">({doc.licenseNumber})</span>
                  </div>
                  <p className="text-xs text-[#606060] mt-0.5">
                    {doc.specialty} · {doc.experienceYears}y exp · Proposed: {doc.affiliationModel} (70/30)
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => acceptDoctorAffiliation(doc.id)}
                    className="px-4 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectDoctorAffiliation(doc.id)}
                    className="px-3 py-2 border border-[#e8e8e8] text-[#0e162b] hover:border-[#0e162b] bg-white rounded-full text-xs font-medium transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Directory & Selected Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Doctors List (5 cols) */}
        <div className="lg:col-span-5 border border-[#e8e8e8] rounded-2xl bg-white overflow-hidden divide-y divide-[#e8e8e8] text-xs">
          {activeDoctors.map((doc) => {
            const isSelected = selectedDoctor.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                className={`p-5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f7fa]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#0e162b] text-white flex items-center justify-center font-semibold text-xs shrink-0">
                      {doc.name
                        ? (doc.name.split(' ').slice(1).filter(Boolean).map((n) => n[0]).join('') || doc.name.charAt(0))
                        : 'DR'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-semibold ${isSelected ? 'text-[#00c0fe]' : 'text-[#0e162b]'}`}>
                          {doc.name}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1fc16b]" />
                      </div>
                      <p className="text-xs text-[#717171] mt-0.5">{doc.specialty}</p>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#717171] inline-block mt-1.5">
                        {doc.affiliationModel} · Split: {doc.contractRevenueSplit}%
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[#222222] font-semibold justify-end">
                      <Star className="w-3.5 h-3.5 fill-current text-[#222222]" />
                      <span>{doc.rating}</span>
                    </div>
                    <span className="text-xs text-[#717171] block mt-1">
                      {doc.totalConsultations} Consults
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Doctor Performance & Contract Breakdown (7 cols) */}
        <div className="lg:col-span-7 border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden">
          {selectedDoctor && (
            <div className="divide-y divide-[#EBEBEB] text-xs">
              {/* Profile Header */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#222222]">{selectedDoctor.name}</h2>
                    <p className="text-xs text-[#717171] mt-0.5">
                      {selectedDoctor.specialty} · Sub-specialty: {selectedDoctor.subSpecialty || 'None'}
                    </p>
                    <p className="text-xs text-[#717171] mt-1">
                      License: <code className="font-mono text-[#222222] font-medium">{selectedDoctor.licenseNumber}</code> ·{' '}
                      {selectedDoctor.experienceYears} Years Clinical Practice
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] font-medium text-xs inline-block">
                      {selectedDoctor.affiliationStatus}
                    </span>
                    <span className="text-xs text-[#606060] block mt-1">
                      Contract: {selectedDoctor.contractModel}
                    </span>
                  </div>
                </div>

                <p className="text-[#606060] leading-relaxed mt-4 bg-[#f0f2f5] p-4 rounded-xl text-xs">
                  {selectedDoctor.bio}
                </p>
              </div>

              {/* Performance Metrics */}
              <div className="p-6 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
                  Clinical & Financial Activity
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#f0f2f5] rounded-2xl">
                    <span className="text-xs text-[#606060] block font-medium">Encounters</span>
                    <span className="text-xl font-semibold text-[#0e162b] mt-1 block">
                      {selectedDoctor.totalConsultations}
                    </span>
                  </div>

                  <div className="p-4 bg-[#f0f2f5] rounded-2xl">
                    <span className="text-xs text-[#606060] block font-medium">Gross Revenue</span>
                    <span className="text-xl font-semibold text-[#0e162b] mt-1 block">
                      ${selectedDoctor.revenueGenerated.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 bg-[#f0f2f5] rounded-2xl">
                    <span className="text-xs text-[#606060] block font-medium">Contract Split</span>
                    <span className="text-xl font-semibold text-[#0e162b] mt-1 block">
                      {selectedDoctor.contractRevenueSplit}%
                    </span>
                  </div>

                  <div className="p-4 bg-[#f0f2f5] rounded-2xl">
                    <span className="text-xs text-[#606060] block font-medium">Rating</span>
                    <span className="text-xl font-semibold text-[#0e162b] mt-1 block">
                      ★ {selectedDoctor.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned Rooms & Schedule */}
              <div className="p-6 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
                  Practice Assignment & Sessional Schedule
                </span>
                <div className="p-4 bg-[#f0f2f5] rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm text-[#0e162b]">Exam Room: {selectedDoctor.assignedRoom}</span>
                    <p className="text-xs text-[#606060] mt-0.5">
                      Schedule: {selectedDoctor.availabilitySchedule}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-[#1fc16b] font-medium border border-[#e8e8e8] text-xs">
                    Available Today
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
