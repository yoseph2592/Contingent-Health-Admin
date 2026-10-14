import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  Pill,
  Search,
  Plus,
  Printer,
  QrCode,
  Check,
} from 'lucide-react';

export const ViewPrescriptions: React.FC = () => {
  const {
    prescriptions,
    fulfillPrescription,
    setIsPrescribeModalOpen,
    setPrintDocumentData,
    setActiveTab,
    setSelectedPatientId,
  } = useClinicOperations();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = prescriptions.filter((r) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.items.some((i) => i.medication.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Pharmacy Integration
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Prescriptions
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Electronic prescriptions, accredited dispensary fulfillment, and QR verification
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPrescribeModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Prescribe medication</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="border border-[#e8e8e8] rounded-2xl bg-white p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#606060]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by drug name, Rx ID, patient, doctor..."
            className="w-full pl-9 pr-4 py-2 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-full text-xs text-[#0e162b] placeholder-[#8e8e8e] focus:outline-none transition-colors"
          />
        </div>

        {/* Pill status filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Sent to Patient', 'Fulfilled', 'Draft'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-[#0e162b] text-white'
                  : 'bg-[#f0f2f5] text-[#606060] hover:text-[#0e162b]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filtered.map((rx) => (
          <div
            key={rx.id}
            className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-4 hover:border-[#bbbbbb] transition-colors"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#e8e8e8] pb-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-[#f0f2f5] text-[#0e162b] rounded-xl shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0e162b] text-sm font-mono">{rx.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rx.status === 'Fulfilled'
                          ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                          : 'bg-[#f0f2f5] text-[#606060]'
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#717171] mt-1">
                    Patient:{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatientId(rx.patientId);
                        setActiveTab('patients');
                      }}
                      className="font-semibold text-[#222222] hover:underline"
                    >
                      {rx.patientName}
                    </button>{' '}
                    · Prescribed by <strong className="text-[#222222] font-semibold">{rx.doctorName}</strong> on {rx.date}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPrintDocumentData(rx)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#DDDDDD] hover:border-[#222222] text-[#222222] rounded-full text-xs font-medium transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-[#717171]" />
                  <span>Print official Rx</span>
                </button>

                {rx.status !== 'Fulfilled' && (
                  <button
                    type="button"
                    onClick={() => fulfillPrescription(rx.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#222222] hover:bg-black text-white rounded-full text-xs font-medium transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark dispensed</span>
                  </button>
                )}
              </div>
            </div>

            {/* Prescribed Items */}
            <div className="rounded-xl overflow-hidden divide-y divide-[#EBEBEB] text-xs bg-[#F7F7F7]">
              {(rx.items || []).map((item, idx) => (
                <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#222222] text-sm">{item.medication}</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-[#EBEBEB] font-medium text-[#717171] text-xs">
                        {item.strength}
                      </span>
                    </div>
                    <p className="text-xs text-[#717171] mt-0.5">
                      {item.dosage} · {item.route} · {item.frequency} for {item.duration}
                    </p>
                    <p className="text-xs text-[#222222] font-medium mt-0.5">
                      Sig: {item.instructions}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-semibold text-[#222222]">Qty: {item.quantity}</span>
                    <span className="text-xs text-[#717171] block">Refills: {item.refills}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Footer */}
            <div className="flex items-center justify-between text-xs text-[#717171] pt-1">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#717171]" />
                <span>Verification: <code className="font-mono text-[#222222] font-semibold">{rx.verificationCode}</code></span>
              </div>
              <span className="hidden sm:inline">Certified electronic health record token</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
