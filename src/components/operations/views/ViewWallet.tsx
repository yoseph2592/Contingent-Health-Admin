import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  Building,
} from 'lucide-react';

export const ViewWallet: React.FC = () => {
  const { transactions, addAuditLog } = useClinicOperations();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('5000');
  const [withdrawMethod, setWithdrawMethod] = useState('Commercial Bank of Ethiopia (CBE) - AC: 1000...492');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const availableBalance = 24850.0;
  const escrowBalance = 3420.0;
  const pendingClaimsVal = 1890.0;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog(`Initiated electronic payout of $${withdrawAmount} via ${withdrawMethod}`, 'FinancialTransaction', 'TX-PAYOUT-NEW', 'Available', 'Processing');
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setIsWithdrawModalOpen(false);
    }, 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8e8e8e]">
            Financial Operations
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[#0e162b] mt-1">
            Wallet &amp; Escrow
          </h1>
          <p className="text-sm text-[#8e8e8e] mt-0.5">
            Automated consultation splits, escrow holding, payouts, and transaction ledger
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsWithdrawModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Request settlement</span>
        </button>
      </div>

      {/* Restrained Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-2">
          <div className="flex items-center justify-between text-[#8e8e8e] text-xs">
            <span className="font-semibold uppercase tracking-wider">Available Balance</span>
            <Wallet className="w-4 h-4 text-[#8e8e8e]" />
          </div>
          <div className="text-3xl font-bold text-[#0e162b] tracking-tight">
            ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#8e8e8e] pt-1">
            Cleared &amp; liquid. Instant transfer eligible via Telebirr or CBE.
          </p>
        </div>

        <div className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-2">
          <div className="flex items-center justify-between text-[#8e8e8e] text-xs">
            <span className="font-semibold uppercase tracking-wider">In-Encounter Escrow</span>
            <Clock className="w-4 h-4 text-[#8e8e8e]" />
          </div>
          <div className="text-3xl font-bold text-[#0e162b] tracking-tight">
            ${escrowBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#8e8e8e] pt-1">
            Pre-authorized patient funds held until physician signature lock.
          </p>
        </div>

        <div className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-2">
          <div className="flex items-center justify-between text-[#8e8e8e] text-xs">
            <span className="font-semibold uppercase tracking-wider">Insurance Receivable</span>
            <Building className="w-4 h-4 text-[#8e8e8e]" />
          </div>
          <div className="text-3xl font-bold text-[#0e162b] tracking-tight">
            ${pendingClaimsVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#8e8e8e] pt-1">
            Adjudicated claims pending clearinghouse batch disbursement.
          </p>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="border border-[#e8e8e8] rounded-2xl bg-white overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-[#e8e8e8] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8e8e8e]">
            Automated Settlement Ledger
          </span>
          <span className="text-xs text-[#8e8e8e]">Contractual split: 70% Clinic / 20% Doctor / 10% Platform</span>
        </div>

        <div className="divide-y divide-[#e8e8e8] text-xs">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#f7f8fa] transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#f0f2f5] text-[#0e162b] shrink-0">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-[#0e162b]">{t.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#84ebb4]/25 text-[#1fc16b] border border-[#1fc16b]/20">
                      {t.status}
                    </span>
                    <span className="text-xs text-[#8e8e8e] font-mono">({t.type})</span>
                  </div>
                  <p className="text-xs text-[#0e162b] mt-1 font-medium">{t.description}</p>
                  <p className="text-[11px] text-[#8e8e8e] mt-0.5 font-mono">{t.date}</p>
                </div>
              </div>

              {/* Splits Breakdown */}
              <div className="flex items-center gap-6 shrink-0 text-right">
                <div>
                  <span className="text-xs text-[#8e8e8e] block">Gross</span>
                  <span className="font-bold text-[#0e162b] text-sm">${t.grossAmount.toFixed(2)}</span>
                </div>
                <div className="border-l border-[#e8e8e8] pl-6">
                  <span className="text-xs text-[#1fc16b] block font-medium">Clinic (70%)</span>
                  <span className="font-bold text-[#1fc16b] text-sm">${t.clinicShare.toFixed(2)}</span>
                </div>
                <div className="border-l border-[#e8e8e8] pl-6 hidden sm:block">
                  <span className="text-xs text-[#8e8e8e] block">Doctor (20%)</span>
                  <span className="font-semibold text-[#0e162b] text-xs">${t.doctorShare.toFixed(2)}</span>
                </div>
                <div className="border-l border-[#e8e8e8] pl-6 hidden sm:block">
                  <span className="text-xs text-[#8e8e8e] block">Platform (10%)</span>
                  <span className="font-semibold text-[#8e8e8e] text-xs">${t.platformFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-[#e8e8e8] p-6 space-y-4">
            <div>
              <h3 className="font-bold text-[#0e162b] text-lg">Request bank settlement</h3>
              <p className="text-xs text-[#8e8e8e] mt-0.5">
                Withdraw cleared wallet balance to your verified organizational bank account.
              </p>
            </div>

            {withdrawSuccess ? (
              <div className="p-6 bg-[#84ebb4]/25 border border-[#1fc16b]/20 rounded-2xl text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-[#1fc16b] mx-auto mb-2" />
                <h4 className="font-bold text-[#1fc16b] text-sm">Disbursement initiated</h4>
                <p className="text-xs text-[#0e162b]">
                  Transfer reference generated. Funds will reflect within 10 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
                <div>
                  <label className="text-xs font-semibold text-[#0e162b] block mb-1.5">
                    Settlement Amount (USD)
                  </label>
                  <input
                    type="number"
                    required
                    max={availableBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#00c0fe] focus:bg-white rounded-xl font-bold text-lg text-[#0e162b] focus:outline-none transition-colors"
                  />
                  <span className="text-xs text-[#8e8e8e] mt-1 block">
                    Available eligible: ${availableBalance.toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0e162b] block mb-1.5">
                    Destination Account
                  </label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#00c0fe] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none transition-colors"
                  >
                    <option value="Commercial Bank of Ethiopia (CBE) - AC: 1000...492">
                      Commercial Bank of Ethiopia (CBE) - AC: 1000...492
                    </option>
                    <option value="Awash Bank - AC: 0132...881">Awash Bank - AC: 0132...881</option>
                    <option value="Telebirr Merchant ID: 893120">Telebirr Merchant ID: 893120</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs transition-colors shadow-xs"
                  >
                    Confirm payout
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
