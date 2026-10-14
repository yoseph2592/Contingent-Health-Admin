import React from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { Download } from 'lucide-react';

export const ViewReports: React.FC = () => {
  const { appointments } = useClinicOperations();

  const totalEncounters = appointments.filter((a) => a.status === 'Completed').length;
  const avgWaitTime = 14; // minutes
  const claimApprovalRate = 92; // %

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Clinical Intelligence
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Reports & Analytics
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Ministry of Health reporting, clinical quality indicators, and throughput metrics
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Generating formal compliance & operations PDF report...')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#DDDDDD] hover:border-[#222222] bg-white text-[#222222] rounded-full text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#717171]" />
          <span>Export official report</span>
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
            Encounters (MTD)
          </span>
          <div className="text-3xl font-semibold text-[#0e162b] tracking-tight mt-1">{totalEncounters + 142}</div>
          <p className="text-xs text-[#1fc16b] font-medium pt-1">↑ 18% vs last month</p>
        </div>

        <div className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
            Avg Patient Wait
          </span>
          <div className="text-3xl font-semibold text-[#0e162b] tracking-tight mt-1">{avgWaitTime} mins</div>
          <p className="text-xs text-[#606060] pt-1">Target benchmark: &lt; 20 mins</p>
        </div>

        <div className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
            Claim Approval Rate
          </span>
          <div className="text-3xl font-semibold text-[#0e162b] tracking-tight mt-1">{claimApprovalRate}%</div>
          <p className="text-xs text-[#1fc16b] font-medium pt-1">Clean claim submission</p>
        </div>

        <div className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
            Room Utilization
          </span>
          <div className="text-3xl font-semibold text-[#0e162b] tracking-tight mt-1">78.4%</div>
          <p className="text-xs text-[#606060] pt-1">Optimal operational band</p>
        </div>
      </div>

      {/* Top Diagnoses & Turnaround Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#606060]">
            Top Clinical Diagnoses (ICD-10)
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3.5 bg-[#f0f2f5] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-[#0e162b]">ICD-10 I10 · Essential Hypertension</span>
              <span className="font-medium text-[#606060]">38.4% (89 cases)</span>
            </div>
            <div className="p-3.5 bg-[#f0f2f5] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-[#0e162b]">ICD-10 E11.9 · Type 2 Diabetes Mellitus</span>
              <span className="font-medium text-[#606060]">24.1% (56 cases)</span>
            </div>
            <div className="p-3.5 bg-[#f0f2f5] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-[#0e162b]">ICD-10 E78.0 · Hypercholesterolemia</span>
              <span className="font-medium text-[#606060]">14.6% (34 cases)</span>
            </div>
            <div className="p-3.5 bg-[#f0f2f5] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-[#0e162b]">ICD-10 J45.909 · Bronchial Asthma</span>
              <span className="font-medium text-[#606060]">9.2% (21 cases)</span>
            </div>
          </div>
        </div>

        <div className="border border-[#e8e8e8] rounded-2xl bg-white p-6 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#606060]">
            Diagnostic Turnaround Time
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3.5 bg-[#f0f2f5] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-[#0e162b]">Complete Metabolic Panel (CMP)</span>
              <span className="font-medium text-[#1fc16b]">1.8 Hours Avg</span>
            </div>
            <div className="p-3.5 bg-[#f0f2f5] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-[#0e162b]">Lipid & Glycemic Panels</span>
              <span className="font-medium text-[#1fc16b]">2.1 Hours Avg</span>
            </div>
            <div className="p-3.5 bg-[#f0f2f5] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-[#0e162b]">Transthoracic Echocardiogram (TTE)</span>
              <span className="font-medium text-[#606060]">24 Hours Avg</span>
            </div>
            <div className="p-3.5 bg-[#f0f2f5] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-[#0e162b]">Digital Chest X-Ray PA</span>
              <span className="font-medium text-[#1fc16b]">25 Minutes Avg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
