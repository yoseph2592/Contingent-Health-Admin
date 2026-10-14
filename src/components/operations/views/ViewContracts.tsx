import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { ContractRecord } from '../../../types/operations';
import {
  CheckCircle2,
  Download,
} from 'lucide-react';

export const ViewContracts: React.FC = () => {
  const { contracts, addAuditLog } = useClinicOperations();
  const [selectedContract, setSelectedContract] = useState<ContractRecord>(contracts[0]);

  const handleRenew = (c: ContractRecord) => {
    addAuditLog(`Initiated contract renewal negotiations for ${c.id}`, 'ContractRecord', c.id, c.status, 'Active');
    alert(`Renewal amendment workflow initiated for ${c.title}. Notice dispatched to ${c.counterparty}.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
          Legal & Compliance
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
          Contracts & Pacts
        </h1>
        <p className="text-sm text-[#717171] mt-0.5">
          Physician affiliation covenants, payer network agreements, and escrow commission terms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contracts List (5 cols) */}
        <div className="lg:col-span-5 border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden divide-y divide-[#EBEBEB] text-xs">
          {contracts.map((c) => {
            const isSelected = selectedContract.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedContract(c)}
                className={`p-5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#F7F7F7]' : 'hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-semibold ${isSelected ? 'text-[#00c0fe]' : 'text-[#0e162b]'}`}>
                        {c.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          c.status === 'Active'
                            ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                            : 'bg-[#ffdb43]/20 text-[#dfb400]'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#0e162b] text-sm mt-1.5">{c.title}</h3>
                    <p className="text-xs text-[#606060] mt-0.5">
                      Counterparty: <strong className="text-[#0e162b] font-semibold">{c.counterparty}</strong> ({c.type})
                    </p>
                  </div>

                  <span className="text-xs text-[#8e8e8e] block shrink-0">Exp: {c.endDate}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Contract Viewer (7 cols) */}
        <div className="lg:col-span-7 border border-[#e8e8e8] rounded-2xl bg-white overflow-hidden">
          {selectedContract && (
            <div className="divide-y divide-[#e8e8e8] text-xs">
              <div className="p-6 flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
                    Executed Agreement
                  </span>
                  <h2 className="text-lg font-semibold text-[#0e162b] mt-1">{selectedContract.title}</h2>
                  <p className="text-xs text-[#606060] mt-0.5">
                    Parties: <span className="text-[#0e162b] font-medium">Bethzatha Clinic</span> &{' '}
                    <span className="text-[#0e162b] font-medium">{selectedContract.counterparty}</span>
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] font-medium text-xs">
                  {selectedContract.status}
                </span>
              </div>

              {/* Term Specifications */}
              <div className="p-6 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
                  Operating Terms
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-[#F7F7F7] rounded-xl">
                    <span className="text-xs text-[#717171] block">Fee / Split Structure</span>
                    <span className="font-semibold text-[#222222] text-sm mt-1 block">
                      {selectedContract.revenueSharePercent ? `${selectedContract.revenueSharePercent}% Doctor Share` : 'Standard Network Tariff'}
                    </span>
                  </div>

                  <div className="p-4 bg-[#F7F7F7] rounded-xl">
                    <span className="text-xs text-[#717171] block">Notice Period</span>
                    <span className="font-semibold text-[#222222] text-sm mt-1 block">
                      {selectedContract.noticePeriodDays} Days
                    </span>
                  </div>

                  <div className="p-4 bg-[#F7F7F7] rounded-xl">
                    <span className="text-xs text-[#717171] block">Effective Term</span>
                    <span className="font-medium text-[#222222] text-xs mt-1 block">
                      {selectedContract.startDate} → {selectedContract.endDate}
                    </span>
                  </div>

                  <div className="p-4 bg-[#f0f2f5] rounded-xl">
                    <span className="text-xs text-[#606060] block">Auto-Renewal</span>
                    <span className="font-semibold text-[#1fc16b] text-xs mt-1 block">
                      {selectedContract.autoRenew ? 'Enabled (Annual Term)' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#f0f2f5] rounded-xl space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
                    Execution & Cryptographic Certificate
                  </span>
                  <div className="flex items-center gap-2 text-[#0e162b] text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#1fc16b]" />
                    <span>Signed electronically by both parties via Contingent Legal Engine</span>
                  </div>
                  <code className="text-[11px] text-[#8e8e8e] block font-mono">
                    SHA256: 8f92b41982c7a6e1104e8d35f79a924b...
                  </code>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-[#f0f2f5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => alert(`Downloading signed copy of ${selectedContract.id}.pdf`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] bg-white text-[#0e162b] rounded-full text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#606060]" />
                  <span>Download executed PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRenew(selectedContract)}
                  className="px-5 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs transition-colors shadow-xs"
                >
                  Initiate renewal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
