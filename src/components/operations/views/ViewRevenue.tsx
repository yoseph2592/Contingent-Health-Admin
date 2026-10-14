import React from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  Download,
} from 'lucide-react';

export const ViewRevenue: React.FC = () => {
  const { transactions, doctors } = useClinicOperations();

  const totalGross = transactions.reduce((s, t) => s + t.grossAmount, 0);
  const totalClinicNet = transactions.reduce((s, t) => s + t.clinicShare, 0);
  const totalDoctorShare = transactions.reduce((s, t) => s + t.doctorShare, 0);
  const totalPlatformFees = transactions.reduce((s, t) => s + t.platformFee, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Financial Analytics
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Revenue & Distribution
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Automated contractual fee splits, department attribution, and doctor earnings
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Exporting complete P&L CSV statement...')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#DDDDDD] hover:border-[#222222] bg-white text-[#222222] rounded-full text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#717171]" />
          <span>Export statement</span>
        </button>
      </div>

      {/* High-level Revenue Distribution Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-[#EBEBEB] rounded-2xl bg-white p-6 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
            Gross Billings
          </span>
          <div className="text-3xl font-semibold text-[#222222] tracking-tight mt-1">
            ${totalGross.toFixed(2)}
          </div>
          <p className="text-xs text-[#717171] pt-1">Total volume across all consultations</p>
        </div>

        <div className="border border-[#EBEBEB] rounded-2xl bg-white p-6 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
            Clinic Retained (70%)
          </span>
          <div className="text-3xl font-semibold text-[#222222] tracking-tight mt-1">
            ${totalClinicNet.toFixed(2)}
          </div>
          <p className="text-xs text-[#717171] pt-1">Net facility operating income</p>
        </div>

        <div className="border border-[#EBEBEB] rounded-2xl bg-white p-6 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
            Doctor Disbursed (20%)
          </span>
          <div className="text-3xl font-semibold text-[#222222] tracking-tight mt-1">
            ${totalDoctorShare.toFixed(2)}
          </div>
          <p className="text-xs text-[#717171] pt-1">Physician sessional compensation</p>
        </div>

        <div className="border border-[#EBEBEB] rounded-2xl bg-white p-6 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
            Platform Protocol (10%)
          </span>
          <div className="text-3xl font-semibold text-[#222222] tracking-tight mt-1">
            ${totalPlatformFees.toFixed(2)}
          </div>
          <p className="text-xs text-[#717171] pt-1">Infrastructure, signatures & escrow</p>
        </div>
      </div>

      {/* Revenue by Doctor attribution */}
      <div className="border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden">
        <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Physician Yield & Remuneration
          </span>
          <span className="text-xs text-[#717171]">Automated settlement splits</span>
        </div>

        <div className="divide-y divide-[#EBEBEB] text-xs">
          {doctors
            .filter((d) => d.affiliationStatus === 'Active')
            .map((doc) => (
              <div
                key={doc.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAFA] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#222222]">{doc.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F7F7F7] text-[#717171] font-medium">
                      {doc.affiliationModel}
                    </span>
                  </div>
                  <p className="text-xs text-[#717171] mt-1">
                    {doc.specialty} · {doc.totalConsultations} Completed encounters
                  </p>
                </div>

                <div className="flex items-center gap-8 text-right">
                  <div>
                    <span className="text-xs text-[#717171] block">Total volume</span>
                    <span className="font-semibold text-sm text-[#222222]">${doc.revenueGenerated.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#717171] block">Doctor ({doc.contractRevenueSplit}%)</span>
                    <span className="font-semibold text-sm text-[#222222]">
                      ${((doc.revenueGenerated * doc.contractRevenueSplit) / 100).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#717171] block">Clinic ({100 - doc.contractRevenueSplit}%)</span>
                    <span className="font-semibold text-sm text-[#1fc16b]">
                      ${((doc.revenueGenerated * (100 - doc.contractRevenueSplit)) / 100).toLocaleString()}
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
