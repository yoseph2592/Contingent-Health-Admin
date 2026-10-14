import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { getRoleDefinition } from '../../../utils/rolePermissions';
import {
  Wallet,
  ReceiptText,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Building,
  Download,
  Filter,
  Search,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Send,
  Check,
  X,
  CreditCard,
  Scale,
} from 'lucide-react';
import { InsuranceClaim, ClaimStatus, FinancialTransaction } from '../../../types/operations';

export type FinanceClaimsTab = 'billing' | 'payments' | 'claims' | 'reconciliation' | 'reports';

export const FinanceAndClaimsDashboard: React.FC = () => {
  const {
    activeRole,
    transactions,
    claims,
    updateClaimStatus,
    addAuditLog,
    currentClinicName,
    setActiveTab,
  } = useClinicOperations();

  const roleDef = getRoleDefinition(activeRole);
  const canIssueRefunds = roleDef.canIssueRefunds ?? true;
  const canSubmitClaims = roleDef.canSubmitClaims ?? true;
  const canApproveClaims = roleDef.canApproveClaims ?? true;
  const canExportFinancials = roleDef.canExportFinancials ?? true;

  const [activeSubTab, setActiveSubTab] = useState<FinanceClaimsTab>('billing');
  const [claimFilter, setClaimFilter] = useState<'all' | ClaimStatus>('all');
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(claims[0]?.id || null);
  const [isExporting, setIsExporting] = useState(false);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundTargetTxn, setRefundTargetTxn] = useState<FinancialTransaction | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundSuccess, setRefundSuccess] = useState(false);

  // New Invoice Form State
  const [invoicePatient, setInvoicePatient] = useState('Dawit Haile');
  const [invoiceService, setInvoiceService] = useState('Specialist Consultation & Follow-up');
  const [invoiceAmount, setInvoiceAmount] = useState('95.00');

  // Key Aggregations
  const totalGrossRevenue = transactions.reduce((sum, t) => sum + t.grossAmount, 0);
  const clinicShareTotal = transactions.reduce((sum, t) => sum + t.clinicShare, 0);
  const doctorShareTotal = transactions.reduce((sum, t) => sum + t.doctorShare, 0);
  const pendingClaimsTotal = claims
    .filter((c) => c.status === 'Submitted' || c.status === 'Documentation Required')
    .reduce((sum, c) => sum + c.claimedAmount, 0);

  const filteredClaims = claims.filter((c) => {
    if (claimFilter === 'all') return true;
    return c.status === claimFilter;
  });

  const selectedClaim = claims.find((c) => c.id === selectedClaimId);

  // Export handler
  const handleExportFinancialData = (format: 'CSV' | 'PDF') => {
    if (!canExportFinancials) {
      alert('Access Restricted: You do not possess granular permissions to export financial records.');
      return;
    }
    setIsExporting(true);
    addAuditLog(`Exported ${activeSubTab.toUpperCase()} records in ${format} format`, 'FinancialLedger', 'EXPORT-BATCH');
    setTimeout(() => {
      setIsExporting(false);
    }, 1000);
  };

  // Refund handler
  const handleInitiateRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canIssueRefunds || !refundTargetTxn) return;
    addAuditLog(
      `Issued full refund of $${refundTargetTxn.grossAmount} for Transaction ${refundTargetTxn.id}. Reason: ${refundReason}`,
      'FinancialTransaction',
      refundTargetTxn.id,
      refundTargetTxn.status,
      'Refunded'
    );
    setRefundSuccess(true);
    setTimeout(() => {
      setRefundSuccess(false);
      setIsRefundModalOpen(false);
      setRefundTargetTxn(null);
      setRefundReason('');
    }, 1200);
  };

  // Claim status action
  const handleClaimAction = (claimId: string, nextStatus: ClaimStatus) => {
    if (nextStatus === 'Approved' && !canApproveClaims) {
      alert('Granular permission required: You do not have claim approval authority.');
      return;
    }
    updateClaimStatus(claimId, nextStatus, `Status transitioned to ${nextStatus} by ${activeRole}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 select-none">
      {/* 1. Header with Role Badge and Top Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0e162b] bg-[#0e162b]/10 px-2.5 py-0.5 rounded-full border border-[#0e162b]/20">
              Finance &amp; Claims Operations
            </span>
            <span className="text-xs text-[#8e8e8e]">· Consolidated Financial Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0e162b] mt-1.5">
            Finance &amp; Claims Center
          </h1>
          <p className="text-sm text-[#8e8e8e] mt-0.5">
            {currentClinicName} · Billing Invoices, Payment Splits, Payer Adjudication, Reconciliation &amp; Financial Reports
          </p>
        </div>

        {/* Global Financial Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {canExportFinancials && (
            <button
              type="button"
              onClick={() => handleExportFinancialData('CSV')}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full text-xs font-semibold transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#00c0fe]" />
              <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsNewInvoiceOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Patient Invoice</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8e8e8e]">
            <span className="font-semibold uppercase tracking-wider">Gross Billed</span>
            <DollarSign className="w-4 h-4 text-[#00c0fe]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0e162b] tracking-tight">
            ${totalGrossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#1fc16b] font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>97.2% collection rate</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8e8e8e]">
            <span className="font-semibold uppercase tracking-wider">Clinic Net Share</span>
            <Building className="w-4 h-4 text-[#00c0fe]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0e162b] tracking-tight">
            ${clinicShareTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#8e8e8e]">
            Standard contractual 70% facility split
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8e8e8e]">
            <span className="font-semibold uppercase tracking-wider">Physician Escrow</span>
            <Wallet className="w-4 h-4 text-[#00c0fe]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0e162b] tracking-tight">
            ${doctorShareTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#8e8e8e]">
            20% physician sessional split
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8e8e8e]">
            <span className="font-semibold uppercase tracking-wider">Pending Claims</span>
            <ReceiptText className="w-4 h-4 text-[#dfb400]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#dfb400] tracking-tight">
            ${pendingClaimsTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#8e8e8e]">
            {claims.filter((c) => c.status === 'Submitted').length} queued in adjudication
          </p>
        </div>
      </div>

      {/* 3. Five Dedicated Sections Switcher */}
      <div className="bg-white border border-[#e8e8e8] rounded-2xl p-1.5 flex flex-wrap items-center gap-1.5 shadow-2xs">
        {[
          { id: 'billing', label: 'Billing & Invoices', icon: FileText },
          { id: 'payments', label: 'Payments & Ledger', icon: Wallet },
          { id: 'claims', label: 'Insurance Claims', icon: ReceiptText, count: claims.length },
          { id: 'reconciliation', label: 'Reconciliation', icon: Scale },
          { id: 'reports', label: 'Financial Reports', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as FinanceClaimsTab)}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#0e162b] text-white shadow-xs'
                  : 'text-[#606060] hover:text-[#0e162b] hover:bg-[#f0f2f5]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#00c0fe] text-white' : 'bg-[#f0f2f5] text-[#606060]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. SECTION CONTENT RENDERING */}

      {/* SECTION 1: BILLING & INVOICES */}
      {activeSubTab === 'billing' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e8e8e8] rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e8e8e8]">
              <div>
                <h3 className="text-lg font-bold text-[#0e162b]">Patient Billing &amp; Fee Tariffs</h3>
                <p className="text-xs text-[#8e8e8e]">
                  Outpatient consultations, diagnostic fees, copay collections, and billing invoices
                </p>
              </div>
              <span className="text-xs text-[#606060] font-medium">
                Permissions: Refund Authorization {canIssueRefunds ? '✓ Active' : '✗ Restricted'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8e8e8] text-[#8e8e8e] uppercase text-[11px] font-semibold">
                    <th className="pb-3 pl-2">Invoice / TXN</th>
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Service Description</th>
                    <th className="pb-3">Gross Amount</th>
                    <th className="pb-3">Payment Method</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5]">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-[#f7f8fa] transition-colors">
                      <td className="py-3.5 pl-2 font-mono font-semibold text-[#0e162b]">
                        {t.invoiceNumber || t.id}
                      </td>
                      <td className="py-3.5 font-bold text-[#0e162b]">{t.patientName}</td>
                      <td className="py-3.5 text-[#606060] max-w-xs truncate">{t.serviceName}</td>
                      <td className="py-3.5 font-bold text-[#0e162b]">${t.grossAmount.toFixed(2)}</td>
                      <td className="py-3.5 text-[#606060]">{t.paymentMethod}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#84ebb4]/25 text-[#1fc16b] border border-[#1fc16b]/20">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        {canIssueRefunds ? (
                          <button
                            type="button"
                            onClick={() => {
                              setRefundTargetTxn(t);
                              setIsRefundModalOpen(true);
                            }}
                            className="text-xs font-semibold text-[#fb3748] hover:underline inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Refund</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#8e8e8e] italic">No Refund Perms</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PAYMENTS & LEDGER */}
      {activeSubTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e8e8e8] rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e8e8e8]">
              <div>
                <h3 className="text-lg font-bold text-[#0e162b]">Disbursements &amp; Split Calculations</h3>
                <p className="text-xs text-[#8e8e8e]">
                  70% Facility share · 20% Physician sessional fee · 10% Platform processing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold transition-all shadow-xs"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Request Bank Settlement</span>
              </button>
            </div>

            <div className="divide-y divide-[#f0f2f5] text-xs">
              {transactions.map((t) => (
                <div key={t.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#f0f2f5] text-[#0e162b] shrink-0">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0e162b]">{t.id}</span>
                        <span className="text-xs text-[#8e8e8e] font-mono">{t.date}</span>
                      </div>
                      <p className="text-xs font-medium text-[#0e162b] mt-0.5">{t.description}</p>
                      <p className="text-[11px] text-[#8e8e8e]">
                        Doctor: {t.doctorName} · Patient: {t.patientName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 text-right">
                    <div>
                      <span className="text-[11px] text-[#8e8e8e] block">Gross</span>
                      <span className="font-bold text-[#0e162b] text-sm">${t.grossAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-l border-[#e8e8e8] pl-5">
                      <span className="text-[11px] text-[#1fc16b] font-medium block">Clinic (70%)</span>
                      <span className="font-bold text-[#1fc16b] text-sm">${t.clinicShare.toFixed(2)}</span>
                    </div>
                    <div className="border-l border-[#e8e8e8] pl-5">
                      <span className="text-[11px] text-[#8e8e8e] block">Doctor (20%)</span>
                      <span className="font-semibold text-[#0e162b] text-xs">${t.doctorShare.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: INSURANCE CLAIMS */}
      {activeSubTab === 'claims' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Claims Queue (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#e8e8e8] rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e8e8e8]">
              <div>
                <h3 className="text-lg font-bold text-[#0e162b]">Insurance Claims Queue</h3>
                <p className="text-xs text-[#8e8e8e]">Payer adjudication and supporting notes review</p>
              </div>

              {/* Status filter pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {(['all', 'Submitted', 'Documentation Required', 'Approved'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setClaimFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      claimFilter === st
                        ? 'bg-[#0e162b] text-white'
                        : 'bg-[#f0f2f5] text-[#606060] hover:text-[#0e162b]'
                    }`}
                  >
                    {st === 'all' ? 'All' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#f0f2f5]">
              {filteredClaims.map((claim) => {
                const isSelected = claim.id === selectedClaimId;
                return (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaimId(claim.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#f0f9ff] border border-[#aaeaff]'
                        : 'hover:bg-[#f7f8fa] border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0e162b]">{claim.patientName}</span>
                          <span className="font-mono text-xs text-[#8e8e8e]">{claim.id}</span>
                        </div>
                        <p className="text-xs text-[#606060] mt-0.5">
                          {claim.payerName} · Policy #{claim.policyNumber}
                        </p>
                        <p className="text-xs text-[#8e8e8e] mt-1">{claim.serviceDescription}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-[#0e162b] block">
                          ${claim.claimedAmount.toFixed(2)}
                        </span>
                        <span
                          className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            claim.status === 'Approved'
                              ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                              : claim.status === 'Documentation Required'
                              ? 'bg-[#ffdb43]/20 text-[#dfb400]'
                              : 'bg-[#00c0fe]/15 text-[#0095c5]'
                          }`}
                        >
                          {claim.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Claim Detail Adjudication Inspector (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#e8e8e8] rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
            {selectedClaim ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e8e]">
                      Claim Adjudication
                    </span>
                    <h4 className="text-base font-bold text-[#0e162b]">{selectedClaim.id}</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#0e162b] bg-[#f0f2f5] px-2.5 py-1 rounded-full">
                    ${selectedClaim.claimedAmount.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#8e8e8e] block">Payer Institution</span>
                    <strong className="text-[#0e162b] text-sm">{selectedClaim.payerName}</strong>
                  </div>
                  <div>
                    <span className="text-[#8e8e8e] block">Policyholder</span>
                    <strong className="text-[#0e162b]">{selectedClaim.patientName} (Policy {selectedClaim.policyNumber})</strong>
                  </div>
                  <div>
                    <span className="text-[#8e8e8e] block">Attending Provider</span>
                    <span className="text-[#0e162b]">{selectedClaim.doctorName}</span>
                  </div>
                  <div className="p-3 bg-[#f7f8fa] rounded-2xl border border-[#e8e8e8]">
                    <span className="text-[11px] font-bold text-[#8e8e8e] uppercase tracking-wider block mb-1">
                      Supporting Clinical Diagnosis
                    </span>
                    <p className="text-xs text-[#0e162b] italic">
                      &ldquo;Documented Essential Hypertension and Glycemic follow-up. Vital signs and prescription attached.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Granular Action Controls */}
                <div className="pt-3 border-t border-[#e8e8e8] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e8e] block">
                    Adjudication Decision
                  </span>

                  {canApproveClaims ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleClaimAction(selectedClaim.id, 'Approved')}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1fc16b] hover:bg-[#19a55a] text-white rounded-full text-xs font-semibold transition-all shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Claim</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleClaimAction(selectedClaim.id, 'Documentation Required')}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#dfb400] text-[#dfb400] hover:bg-[#ffdb43]/10 rounded-full text-xs font-semibold transition-all"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Req. Clinical Note</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#f0f2f5] rounded-xl text-center text-xs text-[#8e8e8e]">
                      Approval authority requires Claims Adjudication permission.
                    </div>
                  )}

                  {canSubmitClaims && selectedClaim.status === 'Documentation Required' && (
                    <button
                      type="button"
                      onClick={() => handleClaimAction(selectedClaim.id, 'Submitted')}
                      className="w-full py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Resubmit Claim with Records</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-xs text-[#8e8e8e]">
                Select a claim from the queue to review adjudication details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: RECONCILIATION */}
      {activeSubTab === 'reconciliation' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e8e8e8] rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e8e8e8]">
              <div>
                <h3 className="text-lg font-bold text-[#0e162b]">Bank Settlement &amp; Ledger Reconciliation</h3>
                <p className="text-xs text-[#8e8e8e]">
                  Match electronic payment receipts with Commercial Bank of Ethiopia (CBE) and Awash deposits
                </p>
              </div>
              <span className="px-3 py-1 bg-[#84ebb4]/25 text-[#1fc16b] text-xs font-bold rounded-full border border-[#1fc16b]/20">
                Ledger 100% Balanced
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#f7f8fa] rounded-2xl border border-[#e8e8e8] space-y-1">
                <span className="text-[#8e8e8e]">Electronic Inflow</span>
                <div className="text-xl font-bold text-[#0e162b]">${totalGrossRevenue.toFixed(2)}</div>
                <p className="text-[11px] text-[#1fc16b]">✓ Fully verified against bank webhooks</p>
              </div>

              <div className="p-4 bg-[#f7f8fa] rounded-2xl border border-[#e8e8e8] space-y-1">
                <span className="text-[#8e8e8e]">Escrow Balance Cleared</span>
                <div className="text-xl font-bold text-[#0e162b]">${clinicShareTotal.toFixed(2)}</div>
                <p className="text-[11px] text-[#8e8e8e]">Disbursed to primary operating reserve</p>
              </div>

              <div className="p-4 bg-[#f7f8fa] rounded-2xl border border-[#e8e8e8] space-y-1">
                <span className="text-[#8e8e8e]">Unreconciled Variance</span>
                <div className="text-xl font-bold text-[#1fc16b]">$0.00</div>
                <p className="text-[11px] text-[#8e8e8e]">Zero open ledger discrepancies</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#e8e8e8] text-xs">
              <span className="text-[#8e8e8e]">
                Automated nightly settlement runs at 23:59 EAT with Ethiopian National Bank audit hash.
              </span>
              <button
                type="button"
                onClick={() => addAuditLog('Manual Ledger Re-audit executed', 'ReconciliationEngine', 'RECON-NOW')}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#00c0fe]" />
                <span>Re-Audit Batch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: FINANCIAL REPORTS */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e8e8e8] rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e8e8e8]">
              <div>
                <h3 className="text-lg font-bold text-[#0e162b]">Financial Statements &amp; Revenue Cycle Metrics</h3>
                <p className="text-xs text-[#8e8e8e]">
                  Longitudinal collection ratios, payer aging schedules, and net revenue summaries
                </p>
              </div>

              {canExportFinancials && (
                <button
                  type="button"
                  onClick={() => handleExportFinancialData('PDF')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#00c0fe]" />
                  <span>Export Financial Report</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payer Aging Schedule */}
              <div className="p-5 rounded-2xl bg-[#f7f8fa] border border-[#e8e8e8] space-y-3 text-xs">
                <span className="font-bold text-[#0e162b] text-sm block">Accounts Receivable (A/R) Aging</span>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#606060]">0 - 30 Days (Current):</span>
                    <strong className="text-[#0e162b]">$3,420.00 (78%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#606060]">31 - 60 Days:</span>
                    <strong className="text-[#0e162b]">$680.00 (15%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#606060]">61 - 90 Days:</span>
                    <strong className="text-[#0e162b]">$240.00 (5%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#606060]">90+ Days:</span>
                    <strong className="text-[#1fc16b]">$0.00 (0%)</strong>
                  </div>
                </div>
              </div>

              {/* Revenue Cycle Performance */}
              <div className="p-5 rounded-2xl bg-[#f7f8fa] border border-[#e8e8e8] space-y-3 text-xs">
                <span className="font-bold text-[#0e162b] text-sm block">Revenue Cycle Key Performance Indicators</span>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#606060]">Clean Claim First-Pass Rate:</span>
                    <strong className="text-[#1fc16b]">98.2%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#606060]">Average Days in A/R:</span>
                    <strong className="text-[#0e162b]">14.6 Days</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#606060]">Claim Denial Rate:</span>
                    <strong className="text-[#1fc16b]">1.8% (Target &lt; 5%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#606060]">Cost to Collect:</span>
                    <strong className="text-[#0e162b]">2.4%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. REFUND MODAL */}
      {isRefundModalOpen && refundTargetTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e8e8e8] space-y-4">
            <h3 className="text-base font-bold text-[#0e162b]">Authorize Patient Refund</h3>
            <p className="text-xs text-[#8e8e8e]">
              Transaction: <strong className="text-[#0e162b] font-mono">{refundTargetTxn.id}</strong> · Patient: {refundTargetTxn.patientName}
            </p>

            {refundSuccess ? (
              <div className="p-4 bg-[#84ebb4]/25 border border-[#1fc16b]/20 rounded-2xl text-center space-y-1 text-xs">
                <CheckCircle2 className="w-8 h-8 text-[#1fc16b] mx-auto mb-1" />
                <h4 className="font-bold text-[#1fc16b]">Refund Processed</h4>
                <p className="text-[#0e162b]">Electronic reimbursement credited to patient original payment method.</p>
              </div>
            ) : (
              <form onSubmit={handleInitiateRefund} className="space-y-4 text-xs">
                <div>
                  <label className="text-xs font-semibold text-[#0e162b] block mb-1">
                    Refund Amount (USD)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`$${refundTargetTxn.grossAmount.toFixed(2)}`}
                    className="w-full p-3 bg-[#f0f2f5] rounded-xl font-bold text-sm text-[#0e162b]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0e162b] block mb-1">
                    Audit Reason for Reversal
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="E.g., Duplicate consultation fee billed or insurance retrospectively covered visit..."
                    className="w-full p-3 bg-[#f0f2f5] border border-[#e8e8e8] focus:border-[#00c0fe] rounded-xl text-xs text-[#0e162b] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRefundModalOpen(false)}
                    className="px-4 py-2 border border-[#e8e8e8] text-xs font-semibold text-[#8e8e8e] hover:text-[#0e162b] rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#fb3748] hover:bg-[#d00416] text-white text-xs font-semibold rounded-full shadow-xs transition-colors"
                  >
                    Confirm Full Refund
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. NEW INVOICE MODAL */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e8e8e8] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0e162b]">Create Patient Invoice</h3>
              <button
                type="button"
                onClick={() => setIsNewInvoiceOpen(false)}
                className="text-[#8e8e8e] hover:text-[#0e162b]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addAuditLog(`Generated patient invoice of $${invoiceAmount} for ${invoicePatient}`, 'BillingInvoice', 'INV-NEW');
                setIsNewInvoiceOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="text-xs font-semibold text-[#0e162b] block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={invoicePatient}
                  onChange={(e) => setInvoicePatient(e.target.value)}
                  className="w-full p-2.5 bg-[#f0f2f5] border border-[#e8e8e8] rounded-xl text-xs text-[#0e162b] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0e162b] block mb-1">Service</label>
                <input
                  type="text"
                  required
                  value={invoiceService}
                  onChange={(e) => setInvoiceService(e.target.value)}
                  className="w-full p-2.5 bg-[#f0f2f5] border border-[#e8e8e8] rounded-xl text-xs text-[#0e162b] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0e162b] block mb-1">Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  className="w-full p-2.5 bg-[#f0f2f5] border border-[#e8e8e8] rounded-xl text-xs text-[#0e162b] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-4 py-2 border border-[#e8e8e8] text-xs font-semibold text-[#8e8e8e] rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0e162b] hover:bg-[#213364] text-white text-xs font-semibold rounded-full shadow-xs transition-colors"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
