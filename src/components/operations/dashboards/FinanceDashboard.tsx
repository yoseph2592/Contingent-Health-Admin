import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  Wallet,
  TrendingUp,
  ReceiptText,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
} from 'lucide-react';

export const FinanceDashboard: React.FC = () => {
  const {
    transactions,
    claims,
    setActiveTab,
  } = useClinicOperations();

  const [filterMethod, setFilterMethod] = useState<'all' | 'claim' | 'wallet' | 'card'>('all');

  const todayTxns = transactions.filter((t) => t.date.startsWith('2024-09-14'));
  const totalCollectionsToday = todayTxns.reduce((sum, t) => sum + t.totalAmount, 0);
  const clinicShareToday = todayTxns.reduce((sum, t) => sum + t.clinicShare, 0);
  const doctorSplitToday = todayTxns.reduce((sum, t) => sum + t.doctorShare, 0);

  const pendingClaimsAmount = claims
    .filter((c) => c.status === 'Submitted' || c.status === 'Documentation Required')
    .reduce((sum, c) => sum + c.claimedAmount, 0);

  const filteredTxns = transactions.filter((t) => {
    if (filterMethod === 'claim') return t.paymentMethod === 'Insurance Claim';
    if (filterMethod === 'wallet') return t.paymentMethod === 'Contingent Wallet';
    if (filterMethod === 'card') return t.paymentMethod === 'Credit Card';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Financial Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Collections & Wallet
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Escrow collections, physician revenue splits, and claim receivables
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('wallet')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Clinic Wallet & Payouts</span>
          </button>
        </div>
      </div>

      {/* Financial Pulse KPIs (Clean, meaningful) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 space-y-1">
          <span className="text-xs text-[#606060]">Today&apos;s Gross Volume</span>
          <div className="text-2xl font-semibold text-[#0e162b]">
            ${totalCollectionsToday.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#1fc16b] font-medium">100% Escrow secured</p>
        </div>

        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 space-y-1">
          <span className="text-xs text-[#606060]">Clinic Net Share</span>
          <div className="text-2xl font-semibold text-[#0e162b]">
            ${clinicShareToday.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#606060]">Facility margin</p>
        </div>

        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 space-y-1">
          <span className="text-xs text-[#606060]">Doctor Split Allocation</span>
          <div className="text-2xl font-semibold text-[#0e162b]">
            ${doctorSplitToday.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#606060]">Pending settlement</p>
        </div>

        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 space-y-1">
          <span className="text-xs text-[#606060]">Claims Receivables</span>
          <div className="text-2xl font-semibold text-[#0e162b]">
            ${pendingClaimsAmount.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#d00416] font-medium">Awaiting payer payout</p>
        </div>
      </div>

      {/* Daily Transaction Ledger */}
      <div className="bg-white border border-[#e8e8e8] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#0e162b]">
              Real-time Transaction Ledger
            </h2>
            <p className="text-xs text-[#606060]">
              Consultation charges, insurance claims, and split calculations
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f0f2f5] p-1 rounded-full text-xs">
            <button
              type="button"
              onClick={() => setFilterMethod('all')}
              className={`px-3 py-1 rounded-full font-medium ${
                filterMethod === 'all' ? 'bg-white text-[#0e162b] shadow-2xs' : 'text-[#606060]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterMethod('claim')}
              className={`px-3 py-1 rounded-full font-medium ${
                filterMethod === 'claim' ? 'bg-white text-[#0e162b] shadow-2xs' : 'text-[#606060]'
              }`}
            >
              Claims
            </button>
            <button
              type="button"
              onClick={() => setFilterMethod('wallet')}
              className={`px-3 py-1 rounded-full font-medium ${
                filterMethod === 'wallet' ? 'bg-white text-[#0e162b] shadow-2xs' : 'text-[#606060]'
              }`}
            >
              Wallet
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#e8e8e8]">
          {filteredTxns.map((txn) => (
            <div key={txn.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#0e162b]">{txn.invoiceNumber}</span>
                  <span className="text-[#606060]">· {txn.patientName}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#84ebb4]/25 text-[#1fc16b]">
                    {txn.status}
                  </span>
                </div>
                <p className="text-[#606060] mt-0.5">
                  {txn.serviceName} · {txn.paymentMethod} · {txn.date}
                </p>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="font-semibold text-[#222222] block">
                    ${txn.totalAmount.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-[#717171]">
                    Clinic: ${txn.clinicShare.toFixed(2)} | Dr: ${txn.doctorShare.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
