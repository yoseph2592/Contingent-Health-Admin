import React from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ReceiptText,
  FileSignature,
  UserCheck,
  Building,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const OwnerCommandCenter: React.FC = () => {
  const {
    currentClinicName,
    appointments,
    contracts,
    claims,
    transactions,
    doctors,
    setActiveTab,
    runAutomatedCoreJourney,
    isJourneyRunning,
    journeyStep,
  } = useClinicOperations();

  // Key Exceptions (Prioritize exceptions rather than raw data)
  const expiringContracts = contracts.filter(
    (c) => c.status === 'Expiring Soon' || c.status === 'Under Review' || c.status === 'Pending Signature'
  );
  const pendingClaims = claims.filter(
    (c) => c.status === 'Documentation Required' || c.status === 'Submitted'
  );
  const pendingDoctors = doctors.filter((d) => !d.credentialsVerified || d.affiliationStatus === 'Pending Review');

  const todayRevenue = transactions
    .filter((t) => t.date.startsWith('2024-09-14'))
    .reduce((sum, t) => sum + t.clinicShare, 0);

  const pendingClaimsValue = pendingClaims.reduce((sum, c) => sum + c.claimedAmount, 0);

  const activeDoctorsCount = doctors.filter((d) => d.affiliationStatus === 'Active').length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header with Title and Single Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Executive Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Clinic Overview
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            {currentClinicName} · Today&apos;s Operational Status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={runAutomatedCoreJourney}
            disabled={isJourneyRunning}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs ${
              isJourneyRunning
                ? 'bg-[#ffdb43]/20 text-[#dfb400] border border-[#dfb400]/30 animate-pulse'
                : 'bg-[#0e162b] hover:bg-[#213364] text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00c0fe]" />
            <span>{isJourneyRunning ? `Running Step ${journeyStep}/13...` : 'Simulate Core Journey'}</span>
          </button>
        </div>
      </div>

      {/* 1. EXCEPTIONS REQUIRING ATTENTION (Owner Rule: Prioritize exceptions over raw data) */}
      <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-[#fb3748]" />
            <h2 className="text-sm font-semibold text-[#0e162b]">
              Operational Exceptions Requiring Attention
            </h2>
          </div>
          <span className="text-xs text-[#717171]">
            {expiringContracts.length + pendingClaims.length + pendingDoctors.length} items flagged
          </span>
        </div>

        <div className="divide-y divide-[#EBEBEB]">
          {/* Exception 1: Contracts */}
          {(expiringContracts || []).length > 0 && (
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#222222]">
                  {expiringContracts.length} physician contract{expiringContracts.length > 1 ? 's' : ''} require renewal or signature
                </p>
                <p className="text-xs text-[#717171] mt-0.5">
                  {(expiringContracts || []).map((c) => c.doctorName).join(', ')} — revenue split agreements pending
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('contracts')}
                className="px-3 py-1.5 rounded-full border border-[#DDDDDD] hover:border-[#222222] text-xs font-medium text-[#222222] transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>Review contracts</span>
                <ArrowRight className="w-3 h-3 text-[#717171]" />
              </button>
            </div>
          )}

          {/* Exception 2: Claims */}
          {pendingClaims.length > 0 && (
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#222222]">
                  {pendingClaims.length} insurance claim{pendingClaims.length > 1 ? 's' : ''} pending payer documentation (${pendingClaimsValue.toLocaleString()})
                </p>
                <p className="text-xs text-[#717171] mt-0.5">
                  Missing clinical diagnostic reports or discharge summaries required by payers
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('claims')}
                className="px-3 py-1.5 rounded-full border border-[#DDDDDD] hover:border-[#222222] text-xs font-medium text-[#222222] transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>Inspect claims</span>
                <ArrowRight className="w-3 h-3 text-[#717171]" />
              </button>
            </div>
          )}

          {/* Exception 3: Doctor Credentials */}
          {(pendingDoctors || []).length > 0 && (
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#222222]">
                  {pendingDoctors.length} physician credential{pendingDoctors.length > 1 ? 's' : ''} awaiting license verification
                </p>
                <p className="text-xs text-[#717171] mt-0.5">
                  {(pendingDoctors || []).map((d) => d.name).join(', ')} — board accreditation audit due
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('doctors')}
                className="px-3 py-1.5 rounded-full border border-[#DDDDDD] hover:border-[#222222] text-xs font-medium text-[#222222] transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>Verify credentials</span>
                <ArrowRight className="w-3 h-3 text-[#717171]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. HIGH-LEVEL OPERATIONAL INDICATORS (Restrained, no wall-of-cards) */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#717171] mb-3">
          Daily High-Level Indicators
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 space-y-1">
            <span className="text-xs text-[#717171]">Today&apos;s Consultations</span>
            <div className="text-2xl font-semibold text-[#222222]">
              {appointments.filter((a) => a.date === '2024-09-14').length}
            </div>
            <p className="text-[11px] text-[#1fc16b] font-medium">
              4 active in clinics now
            </p>
          </div>

          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 space-y-1">
            <span className="text-xs text-[#717171]">Clinic Revenue (Today)</span>
            <div className="text-2xl font-semibold text-[#222222]">
              ${todayRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#717171]">
              Net facility share
            </p>
          </div>

          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 space-y-1">
            <span className="text-xs text-[#717171]">Outstanding Claims</span>
            <div className="text-2xl font-semibold text-[#222222]">
              ${pendingClaimsValue.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#717171]">
              {pendingClaims.length} pending settlement
            </p>
          </div>

          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 space-y-1">
            <span className="text-xs text-[#717171]">Active Roster</span>
            <div className="text-2xl font-semibold text-[#222222]">
              {activeDoctorsCount}
            </div>
            <p className="text-[11px] text-[#717171]">
              Affiliated doctors on duty
            </p>
          </div>
        </div>
      </div>

      {/* 3. QUICK DRILL-DOWN SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('revenue')}
          className="bg-white border border-[#EBEBEB] hover:border-[#222222] p-5 rounded-2xl transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#F7F7F7] flex items-center justify-center text-[#222222]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#717171] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <h3 className="text-sm font-semibold text-[#222222]">Revenue & Payout Ledger</h3>
          <p className="text-xs text-[#717171]">Inspect consultation billing, doctor fee splits, and wallet balances.</p>
        </div>

        <div
          onClick={() => setActiveTab('contracts')}
          className="bg-white border border-[#EBEBEB] hover:border-[#222222] p-5 rounded-2xl transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#F7F7F7] flex items-center justify-center text-[#222222]">
              <FileSignature className="w-4 h-4" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#717171] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <h3 className="text-sm font-semibold text-[#222222]">Physician Affiliations</h3>
          <p className="text-xs text-[#717171]">Review commission splits, room rentals, and contract renewals.</p>
        </div>

        <div
          onClick={() => setActiveTab('audit')}
          className="bg-white border border-[#EBEBEB] hover:border-[#222222] p-5 rounded-2xl transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#F7F7F7] flex items-center justify-center text-[#222222]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#717171] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <h3 className="text-sm font-semibold text-[#222222]">Compliance Audit Trail</h3>
          <p className="text-xs text-[#717171]">View tamper-evident activity records across clinical and financial logs.</p>
        </div>
      </div>
    </div>
  );
};
