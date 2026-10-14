import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  ReceiptText,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  FileText,
  Check,
} from 'lucide-react';
import { ClaimStatus, InsuranceClaim } from '../../../types/operations';

export const ClaimsQueueDashboard: React.FC = () => {
  const {
    claims,
    updateClaimStatus,
    documents,
    setPrintDocumentData,
  } = useClinicOperations();

  const [selectedClaimId, setSelectedClaimId] = useState<string | null>('CLM-2024-539');
  const [filterStatus, setFilterStatus] = useState<ClaimStatus | 'ALL'>('ALL');

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  const filteredClaims = claims.filter((c) => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  const documentationRequiredCount = claims.filter((c) => c.status === 'Documentation Required').length;
  const submittedCount = claims.filter((c) => c.status === 'Submitted').length;
  const approvedCount = claims.filter((c) => c.status === 'Approved').length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Insurance Adjudication
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Claims Queue
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Payer submissions, supporting clinical attachments, and settlement tracking
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setFilterStatus('ALL')}
          className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
            filterStatus === 'ALL'
              ? 'bg-[#222222] text-white'
              : 'bg-white border border-[#EBEBEB] text-[#717171] hover:text-[#222222]'
          }`}
        >
          All Claims ({claims.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('Documentation Required')}
          className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
            filterStatus === 'Documentation Required'
              ? 'bg-[#fb3748] text-white'
              : 'bg-white border border-[#e8e8e8] text-[#606060] hover:text-[#0e162b]'
          }`}
        >
          Doc Required ({documentationRequiredCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('Submitted')}
          className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
            filterStatus === 'Submitted'
              ? 'bg-[#0e162b] text-white'
              : 'bg-white border border-[#e8e8e8] text-[#606060] hover:text-[#0e162b]'
          }`}
        >
          Submitted ({submittedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('Approved')}
          className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
            filterStatus === 'Approved'
              ? 'bg-[#0e162b] text-white'
              : 'bg-white border border-[#e8e8e8] text-[#606060] hover:text-[#0e162b]'
          }`}
        >
          Approved ({approvedCount})
        </button>
      </div>

      {/* Main Two-Column Layout: Queue on Left, Focused Inspection on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Claims List */}
        <div className="lg:col-span-6 bg-white border border-[#e8e8e8] rounded-2xl p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#606060]">
            Claims Requiring Action ({filteredClaims.length})
          </h2>

          <div className="divide-y divide-[#e8e8e8]">
            {filteredClaims.map((claim) => {
              const isSelected = claim.id === selectedClaimId;
              const isDocRequired = claim.status === 'Documentation Required';
              const isApproved = claim.status === 'Approved';

              return (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaimId(claim.id)}
                  className={`py-3.5 px-3 rounded-xl transition-all cursor-pointer ${
                    isSelected ? 'bg-[#f0f2f5] border-l-2 border-[#00c0fe]' : 'hover:bg-[#f5f7fa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#0e162b]">{claim.id}</span>
                    <span className="text-xs font-semibold text-[#0e162b]">
                      ${claim.claimedAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-xs text-[#606060]">
                    <span>{claim.patientName}</span>
                    <span>{claim.payerName}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isDocRequired
                          ? 'bg-[#fb3748]/10 text-[#d00416]'
                          : isApproved
                          ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                          : 'bg-[#f0f2f5] text-[#606060]'
                      }`}
                    >
                      {claim.status}
                    </span>

                    {claim.missingDocumentation && claim.missingDocumentation.length > 0 && (
                      <span className="text-[10px] text-[#d00416] font-medium">
                        Missing: {claim.missingDocumentation.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Focused Claim Inspection & Attachment Verification */}
        {selectedClaim && (
          <div className="lg:col-span-6 bg-white border border-[#EBEBEB] rounded-2xl p-6 space-y-6">
            <div className="border-b border-[#EBEBEB] pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#717171]">Claim Details</span>
                <span className="px-2.5 py-1 rounded-full bg-[#F7F7F7] text-xs font-semibold text-[#222222]">
                  {selectedClaim.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#222222] mt-1">
                {selectedClaim.id} · {selectedClaim.serviceDescription}
              </h3>
              <p className="text-xs text-[#717171]">
                Patient: <strong>{selectedClaim.patientName}</strong> · Payer: <strong>{selectedClaim.payerName}</strong> (Policy #{selectedClaim.policyNumber})
              </p>
            </div>

            {/* Financial Breakdown */}
            <div className="p-4 bg-[#F7F7F7] rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[#717171] block">Claimed Amount</span>
                <span className="text-base font-semibold text-[#222222]">
                  ${selectedClaim.claimedAmount.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[#717171] block">Attending Physician</span>
                <span className="font-medium text-[#222222]">
                  {selectedClaim.doctorName}
                </span>
              </div>
              <div>
                <span className="text-[#717171] block">Submission Date</span>
                <span className="font-medium text-[#222222]">
                  {selectedClaim.submittedDate}
                </span>
              </div>
            </div>

            {/* Missing Documentation & Attachments */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block mb-2">
                Required Verification Documents
              </span>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-[#EBEBEB] rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#717171]" />
                    <div>
                      <span className="font-semibold text-[#222222] block">Clinical Encounter Notes</span>
                      <span className="text-[11px] text-[#717171]">Attached from Doctor Workspace</span>
                    </div>
                  </div>
                  <span className="text-[#1fc16b] text-xs font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>

                <div className="p-3 bg-white border border-[#e8e8e8] rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#8e8e8e]" />
                    <div>
                      <span className="font-semibold text-[#0e162b] block">Diagnostic Lab / Imaging Report</span>
                      <span className="text-[11px] text-[#606060]">Referenced Ref LAB-9028</span>
                    </div>
                  </div>
                  <span className="text-[#1fc16b] text-xs font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Attached
                  </span>
                </div>
              </div>
            </div>

            {/* Payer Actions */}
            <div className="pt-2 flex flex-wrap gap-2 justify-end">
              {selectedClaim.status === 'Documentation Required' && (
                <button
                  type="button"
                  onClick={() => updateClaimStatus(selectedClaim.id, 'Submitted', 'Required documentation attached by Claims Officer')}
                  className="px-4 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
                >
                  Attach Notes & Resubmit
                </button>
              )}

              {selectedClaim.status === 'Submitted' && (
                <button
                  type="button"
                  onClick={() => updateClaimStatus(selectedClaim.id, 'Approved', 'Claim adjudicated and approved by payer')}
                  className="px-4 py-2 bg-[#1fc16b] hover:bg-[#19a55a] text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
                >
                  Mark Approved by Payer
                </button>
              )}

              {selectedClaim.status === 'Approved' && (
                <button
                  type="button"
                  onClick={() => updateClaimStatus(selectedClaim.id, 'Paid', 'Payment settled into clinic contingent escrow')}
                  className="px-4 py-2 bg-[#222222] hover:bg-[#000000] text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
                >
                  Record Remittance Payment
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
