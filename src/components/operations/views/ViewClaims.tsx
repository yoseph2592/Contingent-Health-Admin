import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { InsuranceClaimRecord } from '../../../types/operations';
import {
  ReceiptText,
  CheckCircle2,
  FileText,
  FileCheck,
} from 'lucide-react';

export const ViewClaims: React.FC = () => {
  const { claims, updateClaimStatus, setSelectedPatientId, setActiveTab } =
    useClinicOperations();

  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaimRecord | null>(claims[0] || null);
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = claims.filter((c) => statusFilter === 'All' || c.status === statusFilter);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Payer Reimbursement
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Insurance Claims
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Auto-generated claim packets, clinical note proofs, and clearinghouse adjudication
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Batch EDI Claim Package exported for national health clearinghouse.')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#DDDDDD] hover:border-[#222222] bg-white text-[#222222] rounded-full text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <FileText className="w-3.5 h-3.5 text-[#717171]" />
          <span>Export EDI 837 batch</span>
        </button>
      </div>

      {/* Claims Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-[#EBEBEB] rounded-2xl bg-white p-5 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
            Total Pipeline
          </span>
          <span className="text-2xl font-semibold text-[#222222] mt-1 block">{claims.length} Claims</span>
        </div>

        <div className="border border-[#EBEBEB] rounded-2xl bg-white p-5 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
            Pending Adjudication
          </span>
          <span className="text-2xl font-semibold text-[#222222] mt-1 block">
            ${claims
              .filter((c) => c.status === 'Submitted' || c.status === 'Documentation Required')
              .reduce((s, c) => s + c.claimedAmount, 0)
              .toFixed(0)}
          </span>
        </div>

        <div className="border border-[#EBEBEB] rounded-2xl bg-white p-5 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
            Approved & Settled
          </span>
          <span className="text-2xl font-semibold text-[#222222] mt-1 block">
            ${claims
              .filter((c) => c.status === 'Approved')
              .reduce((s, c) => s + (c.approvedAmount || 0), 0)
              .toFixed(0)}
          </span>
        </div>

        <div className="border border-[#EBEBEB] rounded-2xl bg-white p-5 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
            Payer Turnaround
          </span>
          <span className="text-2xl font-semibold text-[#222222] mt-1 block">3.4 Days Avg</span>
        </div>
      </div>

      {/* Main Grid: Claims List & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Claims List (6 cols) */}
        <div className="lg:col-span-6 border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden divide-y divide-[#EBEBEB] text-xs">
          {filtered.map((claim) => {
            const isSelected = selectedClaim?.id === claim.id;
            return (
              <div
                key={claim.id}
                onClick={() => setSelectedClaim(claim)}
                className={`p-5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#F7F7F7]' : 'hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-semibold ${isSelected ? 'text-[#00c0fe]' : 'text-[#0e162b]'}`}>
                        {claim.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          claim.status === 'Approved'
                            ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                            : claim.status === 'Documentation Required'
                            ? 'bg-[#fb3748]/10 text-[#d00416]'
                            : 'bg-[#f0f2f5] text-[#606060]'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#0e162b] font-semibold mt-1">
                      Patient: {claim.patientName}
                    </p>
                    <p className="text-xs text-[#606060] mt-0.5">
                      Payer: <span className="text-[#0e162b] font-medium">{claim.payerName}</span> ({claim.policyNumber})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-semibold text-[#222222] text-sm block">
                      ${claim.claimedAmount.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[#717171] block font-mono mt-0.5">
                      {claim.submittedDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Claim Inspector (6 cols) */}
        <div className="lg:col-span-6 border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden">
          {selectedClaim ? (
            <div className="divide-y divide-[#EBEBEB] text-xs">
              <div className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
                    Claim Dossier
                  </span>
                  <span className="font-semibold text-[#222222] text-base mt-0.5 block">{selectedClaim.id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPatientId(selectedClaim.patientId);
                    setActiveTab('patients');
                  }}
                  className="text-xs text-[#00c0fe] font-semibold hover:underline"
                >
                  View patient chart
                </button>
              </div>

              {/* Itemized Billing Services */}
              <div className="p-5 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
                  Itemized Service Coding
                </span>
                <div className="rounded-xl overflow-hidden divide-y divide-[#e8e8e8] bg-[#f0f2f5]">
                  {(selectedClaim.items || []).map((item, i) => (
                    <div key={i} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-[#0e162b] block">{item.description}</span>
                        <code className="text-[11px] text-[#606060] font-mono">{item.code}</code>
                      </div>
                      <span className="font-semibold text-[#0e162b]">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attached Clinical Evidence */}
              <div className="p-5 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
                  Clinical Evidence Attached
                </span>
                <div className="space-y-1.5">
                  {(selectedClaim.attachedDocuments || []).map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#f0f2f5] rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-[#1fc16b]" />
                        <span className="font-medium text-[#0e162b]">{doc}</span>
                      </div>
                      <span className="text-[11px] font-medium text-[#606060] uppercase">Verified</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 space-y-3 bg-[#f0f2f5]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
                  Adjudication Status & Actions
                </span>

                {selectedClaim.status === 'Documentation Required' ? (
                  <div className="p-4 bg-white rounded-xl border border-[#e8e8e8] space-y-3">
                    <p className="text-[#0e162b] text-xs">
                      Payer requested official diagnostic narrative notes signed by attending physician.
                    </p>
                    <button
                      type="button"
                      onClick={() => updateClaimStatus(selectedClaim.id, 'Approved', selectedClaim.claimedAmount)}
                      className="w-full py-2.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs transition-colors shadow-xs"
                    >
                      Upload Supporting Notes & Resubmit
                    </button>
                  </div>
                ) : selectedClaim.status === 'Approved' ? (
                  <div className="p-4 bg-[#84ebb4]/25 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-[#1fc16b] text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approved in Full for ${selectedClaim.approvedAmount?.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-[#1fc16b]/80">
                      Settlement batch scheduled for release to clinic wallet.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateClaimStatus(selectedClaim.id, 'Approved', selectedClaim.claimedAmount)}
                    className="w-full py-2.5 bg-[#222222] hover:bg-black text-white rounded-full font-semibold text-xs transition-colors"
                  >
                    Simulate insurer approval
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-[#717171]">
              <ReceiptText className="w-10 h-10 mx-auto mb-2 text-[#DDDDDD]" />
              <p className="text-sm">Select a claim to inspect reimbursement status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
