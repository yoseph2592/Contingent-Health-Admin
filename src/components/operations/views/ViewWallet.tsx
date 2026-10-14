import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { FinancialTransaction } from '../../../types/operations';
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Search,
  X,
  FileText,
  DollarSign,
  AlertCircle,
  Filter,
} from 'lucide-react';

export const ViewWallet: React.FC = () => {
  const { transactions, addAuditLog } = useClinicOperations();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('5000');
  const [withdrawMethod, setWithdrawMethod] = useState('Commercial Bank of Ethiopia (CBE) - AC: 1000...492');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [selectedTx, setSelectedTx] = useState<FinancialTransaction | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const availableBalance = 24850.0;
  const escrowBalance = 3420.0;
  const pendingSettlement = 1890.0;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog(
      `Initiated electronic payout of $${withdrawAmount} via ${withdrawMethod}`,
      'FinancialTransaction',
      'TX-PAYOUT-NEW',
      'Available',
      'Processing'
    );
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setIsWithdrawModalOpen(false);
    }, 1800);
  };

  const filteredTransactions = (transactions || []).filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EBEBEB] pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Financial Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Wallet & Payments
          </h1>
          <p className="text-xs sm:text-sm text-[#717171] mt-0.5">
            Operational liquidity, in-encounter escrow releases, and automated provider disbursements
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsWithdrawModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Request Settlement</span>
        </button>
      </div>

      {/* 2. OPERATIONAL BALANCE CARDS (3 Essential Liquidity Metrics Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#717171]">
            <span className="font-medium">Available Balance</span>
            <Wallet className="w-4 h-4 text-[#008A05]" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#222222] tracking-tight">
            ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-[#717171] pt-0.5">
            Cleared & liquid for instant bank transfer
          </p>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#717171]">
            <span className="font-medium">In-Encounter Escrow</span>
            <Clock className="w-4 h-4 text-[#B26B00]" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#222222] tracking-tight">
            ${escrowBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-[#717171] pt-0.5">
            Pending physician encounter note signoff
          </p>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#717171]">
            <span className="font-medium">Pending Claims Settlement</span>
            <AlertCircle className="w-4 h-4 text-[#717171]" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#222222] tracking-tight">
            ${pendingSettlement.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-[#717171] pt-0.5">
            National payer clearinghouse adjudication
          </p>
        </div>
      </div>

      {/* 3. PRIMARY PAYMENT TABLE: Reference | Patient / Service | Amount | Status | Date | Action */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden space-y-3">
        <div className="p-3.5 sm:p-4 border-b border-[#EBEBEB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Completed', 'Escrow Held', 'Pending'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-[#0E2938] text-white font-medium'
                    : 'bg-[#F7F7F7] text-[#717171] hover:text-[#222222]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#717171]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference or patient..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-full text-xs text-[#222222] placeholder-[#717171] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#EBEBEB] text-[#717171] font-semibold text-[11px]">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Patient / Service</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EBEBEB]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#717171]">
                    No transactions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                  >
                    {/* 1. Reference */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-[#222222] block">
                        {tx.id}
                      </span>
                      <span className="text-[11px] text-[#717171] block">
                        {tx.type}
                      </span>
                    </td>

                    {/* 2. Patient / Service */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-[#222222] block">
                        {tx.description}
                      </span>
                    </td>

                    {/* 3. Amount */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-[#222222] block">
                        ${tx.grossAmount.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-[#008A05] font-medium block">
                        Clinic: ${tx.clinicShare.toFixed(2)}
                      </span>
                    </td>

                    {/* 4. Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-[#222222]">
                        {tx.status}
                      </span>
                    </td>

                    {/* 5. Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-[#717171] block">
                        {tx.date}
                      </span>
                    </td>

                    {/* 6. Action */}
                    <td
                      className="py-3 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1 border border-[#DDDDDD] hover:border-[#222222] text-[#222222] rounded-full text-xs font-medium transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. TRANSACTION DETAIL DRAWER */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex justify-end">
          <aside className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 select-none overflow-y-auto text-xs">
            <div className="h-16 px-6 border-b border-[#EBEBEB] bg-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
                  Transaction Receipt
                </span>
                <h3 className="font-semibold text-base font-mono text-[#222222]">
                  {selectedTx.id}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="p-1.5 text-[#717171] hover:text-[#222222] rounded-full hover:bg-[#F7F7F7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1">
              <div className="p-4 bg-[#F7F7F7] rounded-2xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#717171]">Status:</span>
                  <span className="font-semibold text-[#008A05]">{selectedTx.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717171]">Gross Collected:</span>
                  <span className="font-bold text-base text-[#222222]">${selectedTx.grossAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717171]">Transaction Date:</span>
                  <span className="font-mono text-[#222222]">{selectedTx.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717171]">Type:</span>
                  <span className="text-[#222222]">{selectedTx.type}</span>
                </div>
              </div>

              {/* Automated Revenue Splits Breakdown */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block mb-2">
                  Contractual Revenue Split (Smart Escrow)
                </span>
                <div className="p-3.5 bg-white border border-[#EBEBEB] rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#222222]">Clinic Operating Share (70%)</span>
                    <span className="font-semibold text-[#008A05]">${selectedTx.clinicShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#717171]">Attending Physician Share (20%)</span>
                    <span className="font-medium text-[#222222]">${selectedTx.doctorShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#717171]">Platform Network Fee (10%)</span>
                    <span className="text-[#717171]">${selectedTx.platformFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block mb-1">
                  Service Description
                </span>
                <p className="p-3 bg-white border border-[#EBEBEB] rounded-xl text-[#222222]">
                  {selectedTx.description}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-[#EBEBEB] bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 border border-[#DDDDDD] rounded-full text-xs font-medium text-[#222222] hover:bg-[#F7F7F7]"
              >
                Close
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 5. SETTLEMENT WITHDRAW MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-[#EBEBEB] p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-[#EBEBEB] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#222222]">Request Bank Settlement</h3>
                <p className="text-xs text-[#717171] mt-0.5">
                  Disburse cleared clinic earnings to verified banking account
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-1 text-[#717171] hover:text-[#222222] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="p-6 bg-[#E8F8EE] rounded-2xl text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-[#008A05] mx-auto mb-2" />
                <h4 className="font-semibold text-[#008A05] text-sm">Disbursement Initiated</h4>
                <p className="text-xs text-[#008A05]/80">
                  Transaction reference generated. Funds will reflect within 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="font-semibold text-[#222222] block mb-1">
                    Settlement Amount (USD)
                  </label>
                  <input
                    type="number"
                    required
                    max={availableBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl font-semibold text-lg text-[#222222] focus:outline-none transition-colors"
                  />
                  <span className="text-[11px] text-[#717171] mt-1 block">
                    Available: ${availableBalance.toFixed(2)}
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-[#222222] block mb-1">
                    Destination Bank Account
                  </label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-[#222222] focus:outline-none transition-colors"
                  >
                    <option value="Commercial Bank of Ethiopia (CBE) - AC: 1000...492">
                      Commercial Bank of Ethiopia (CBE) - AC: 1000...492
                    </option>
                    <option value="Telebirr Merchant - Acc: 0911...234">
                      Telebirr Merchant - Acc: 0911...234
                    </option>
                    <option value="Awash Bank - AC: 0132...991">Awash Bank - AC: 0132...991</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="px-4 py-2 border border-[#DDDDDD] text-[#717171] rounded-full font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full font-semibold shadow-xs"
                  >
                    Authorize Payout
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
