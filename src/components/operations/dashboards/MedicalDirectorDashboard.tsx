import React from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  FileText,
  TrendingUp,
  Stethoscope,
  Users,
} from 'lucide-react';

export const MedicalDirectorDashboard: React.FC = () => {
  const {
    doctors,
    appointments,
    labRequests,
    setActiveTab,
    setSelectedPatientId,
  } = useClinicOperations();

  const activeDoctors = doctors.filter((d) => d.affiliationStatus === 'Active');
  const abnormalLabs = labRequests.filter((l) => l.isFlaggedAbnormal);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Clinical Governance & Quality
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Clinical Quality Oversight
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Physician credential compliance, diagnostic stewardship, and care protocol adherence
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Quality Analytics Report</span>
        </button>
      </div>

      {/* Clinical Quality KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 space-y-1">
          <span className="text-xs text-[#606060]">Encounter Note Lock Rate</span>
          <div className="text-2xl font-semibold text-[#0e162b]">96.4%</div>
          <p className="text-[11px] text-[#1fc16b] font-medium">&lt; 24h compliance</p>
        </div>

        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 space-y-1">
          <span className="text-xs text-[#606060]">Active Doctor Roster</span>
          <div className="text-2xl font-semibold text-[#0e162b]">{activeDoctors.length}</div>
          <p className="text-[11px] text-[#606060]">Credentialed attending</p>
        </div>

        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 space-y-1">
          <span className="text-xs text-[#606060]">Flagged Abnormal Labs</span>
          <div className="text-2xl font-semibold text-[#0e162b]">{abnormalLabs.length}</div>
          <p className="text-[11px] text-[#d00416] font-medium">Physician follow-up noted</p>
        </div>

        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 space-y-1">
          <span className="text-xs text-[#606060]">Patient Satisfaction</span>
          <div className="text-2xl font-semibold text-[#0e162b]">4.9 / 5.0</div>
          <p className="text-[11px] text-[#1fc16b] font-medium">Post-consult feedback</p>
        </div>
      </div>

      {/* Doctor Performance & Documentation Quality Roster */}
      <div className="bg-white border border-[#e8e8e8] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#0e162b]">
              Attending Physician Documentation Compliance
            </h2>
            <p className="text-xs text-[#606060]">
              Audited against international ICD-10 coding and clinical guidelines
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('doctors')}
            className="text-xs font-semibold text-[#00c0fe] hover:underline"
          >
            Manage Roster
          </button>
        </div>

        <div className="divide-y divide-[#e8e8e8]">
          {doctors.map((doc) => (
            <div key={doc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#0e162b] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {doc.name.charAt(4)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-[#0e162b]">{doc.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#84ebb4]/25 text-[#1fc16b]">
                      {doc.affiliationStatus}
                    </span>
                  </div>
                  <p className="text-[#606060] mt-0.5">
                    {doc.specialty} · License {doc.licenseNumber} · {doc.totalConsultations} consultations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <span className="font-semibold text-[#0e162b] block">Rating: {doc.rating} ★</span>
                  <span className="text-[11px] text-[#1fc16b]">100% Verified</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('doctors')}
                  className="px-3 py-1.5 border border-[#e8e8e8] hover:border-[#0e162b] rounded-full font-medium text-xs text-[#0e162b] transition-colors"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
