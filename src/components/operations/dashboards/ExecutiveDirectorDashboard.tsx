import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  TrendingUp,
  Activity,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  FileSpreadsheet,
  Download,
  Filter,
  BarChart3,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const ExecutiveDirectorDashboard: React.FC = () => {
  const {
    currentClinicName,
    appointments,
    doctors,
    claims,
    transactions,
    setActiveTab,
    addAuditLog,
  } = useClinicOperations();

  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [isExporting, setIsExporting] = useState(false);
  const [slaAlertDismissed, setSlaAlertDismissed] = useState(false);

  // Department Operational SLAs
  const slaMetrics = [
    {
      department: 'Front Desk / Reception',
      metric: 'Check-in Latency',
      current: '4.2 min',
      slaThreshold: '< 8.0 min',
      complianceRate: 97.4,
      status: 'optimal',
    },
    {
      department: 'Nursing & Triage',
      metric: 'Pre-Consult Vitals Turnaround',
      current: '6.8 min',
      slaThreshold: '< 10.0 min',
      complianceRate: 94.2,
      status: 'optimal',
    },
    {
      department: 'Clinical Consultations',
      metric: 'Physician Call-In Delay',
      current: '8.4 min',
      slaThreshold: '< 12.0 min',
      complianceRate: 91.8,
      status: 'warning',
    },
    {
      department: 'Billing & Claims',
      metric: 'Same-Day Adjudication Batching',
      current: '98.5%',
      slaThreshold: '> 95.0%',
      complianceRate: 98.5,
      status: 'optimal',
    },
  ];

  // Budget vs Actual Operational Execution
  const operationalBudget = {
    budgetedOpEx: 48500,
    actualOpEx: 46210,
    variance: -2290,
    variancePct: -4.72,
    patientThroughputTarget: 45,
    actualThroughput: 38,
  };

  const handleExportPerformanceReport = () => {
    setIsExporting(true);
    addAuditLog('Generated Executive Operations Performance Matrix (PDF/CSV)', 'OperationsLog', 'EXEC-PERF-01');
    setTimeout(() => {
      setIsExporting(false);
    }, 1200);
  };

  const inConsultCount = appointments.filter((a) => a.status === 'In consultation').length;
  const waitingRoomCount = appointments.filter((a) => a.status === 'Checked-in').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 select-none">
      {/* 1. Header with Executive Title and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00c0fe] bg-[#00c0fe]/10 px-2.5 py-0.5 rounded-full border border-[#00c0fe]/20">
              Executive Director / Clinic Director
            </span>
            <span className="text-xs text-[#8e8e8e]">· Operations Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0e162b] mt-1.5">
            Operational Performance &amp; SLA Center
          </h1>
          <p className="text-sm text-[#8e8e8e] mt-0.5">
            {currentClinicName} · Clinic Throughput, Staffing Allocation, Departmental SLAs &amp; Budget Execution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-[#f0f2f5] p-1 rounded-full flex items-center border border-[#e8e8e8] text-xs font-semibold">
            {(['today', 'week', 'month'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-full capitalize transition-all ${
                  timeframe === t
                    ? 'bg-[#0e162b] text-white shadow-xs'
                    : 'text-[#606060] hover:text-[#0e162b]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportPerformanceReport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full text-xs font-semibold transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#00c0fe]" />
            <span>{isExporting ? 'Generating...' : 'Export SLA Matrix'}</span>
          </button>
        </div>
      </div>

      {/* 2. Executive SLA Alert Banner */}
      {!slaAlertDismissed && (
        <div className="bg-[#f0f9ff] border border-[#aaeaff] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#00c0fe] text-white flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0e162b] uppercase tracking-wider">
                Operational Quality Notice: Overall Clinic SLA Index at 95.5%
              </h4>
              <p className="text-xs text-[#606060] mt-0.5">
                Front desk check-ins and laboratory turnaround comply with Tier-A accreditation standards. All active rooms staffed.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSlaAlertDismissed(true)}
            className="text-xs font-semibold text-[#0095c5] hover:underline self-start sm:self-auto shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Top Executive KPIs (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-2xs flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8e8e8e]">
              Daily Throughput
            </span>
            <Users className="w-4 h-4 text-[#00c0fe]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0e162b]">
                {completedCount + inConsultCount + waitingRoomCount}
              </span>
              <span className="text-xs text-[#8e8e8e]">/ {operationalBudget.patientThroughputTarget} Target</span>
            </div>
            <p className="text-xs text-[#1fc16b] font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>84.4% of daily target reached</span>
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-2xs flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8e8e8e]">
              Suites Occupancy
            </span>
            <Building2 className="w-4 h-4 text-[#00c0fe]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0e162b]">87.5%</span>
              <span className="text-xs text-[#8e8e8e]">7 of 8 rooms</span>
            </div>
            <p className="text-xs text-[#8e8e8e] mt-1 font-normal">
              Suite 101, 102, 103 actively occupied
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-2xs flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8e8e8e]">
              Physician Rostering
            </span>
            <Stethoscope className="w-4 h-4 text-[#00c0fe]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0e162b]">
                {doctors.length}
              </span>
              <span className="text-xs text-[#1fc16b] font-semibold">100% On-Duty</span>
            </div>
            <p className="text-xs text-[#8e8e8e] mt-1 font-normal">
              Zero unassigned clinical shifts today
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-2xs flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8e8e8e]">
              OpEx Variance
            </span>
            <BarChart3 className="w-4 h-4 text-[#1fc16b]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1fc16b]">-4.7%</span>
              <span className="text-xs text-[#8e8e8e] font-mono">Favorable</span>
            </div>
            <p className="text-xs text-[#8e8e8e] mt-1 font-normal">
              Actual ${operationalBudget.actualOpEx.toLocaleString()} vs Budget ${operationalBudget.budgetedOpEx.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Layout: Departmental SLA Compliance & Real-Time Clinic Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Departmental SLAs (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#e8e8e8] rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0e162b]">
                Departmental SLA Compliance &amp; Turnaround
              </h2>
              <p className="text-xs text-[#8e8e8e] mt-0.5">
                Continuous monitoring against institutional healthcare standards
              </p>
            </div>
            <span className="px-3 py-1 bg-[#84ebb4]/25 text-[#1fc16b] text-xs font-bold rounded-full border border-[#1fc16b]/20">
              Avg 95.5%
            </span>
          </div>

          <div className="space-y-4">
            {slaMetrics.map((sla, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-[#e8e8e8] bg-[#f7f8fa] hover:bg-white transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#0e162b] text-sm block">
                      {sla.department}
                    </span>
                    <span className="text-[#8e8e8e] text-xs">{sla.metric}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#0e162b] text-sm block font-mono">
                      {sla.current}
                    </span>
                    <span className="text-[#8e8e8e] text-[11px]">Target: {sla.slaThreshold}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-[#606060]">SLA Compliance:</span>
                    <span className={sla.complianceRate >= 95 ? 'text-[#1fc16b]' : 'text-[#dfb400]'}>
                      {sla.complianceRate}%
                    </span>
                  </div>
                  <div className="w-full bg-[#e8e8e8] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sla.complianceRate >= 95 ? 'bg-[#1fc16b]' : 'bg-[#dfb400]'
                      }`}
                      style={{ width: `${sla.complianceRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#e8e8e8] text-xs">
            <span className="text-[#8e8e8e]">
              Last automated audit: 12 minutes ago · Compliant with HL7 FHIR SLA metrics
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('reports')}
              className="text-xs font-semibold text-[#00c0fe] hover:underline"
            >
              Detailed Analytics &rarr;
            </button>
          </div>
        </div>

        {/* Real-Time Operational Flow & Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Status Card */}
          <div className="bg-white border border-[#e8e8e8] rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs">
            <h3 className="text-lg font-bold text-[#0e162b]">
              Current Clinic Bottlenecks &amp; Triage
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#f0f2f5] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1fc16b] animate-pulse" />
                  <span className="font-semibold text-[#0e162b]">In Consultation</span>
                </div>
                <span className="font-bold text-[#0e162b] font-mono text-sm">{inConsultCount} Patients</span>
              </div>

              <div className="p-3.5 bg-[#f0f2f5] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dfb400]" />
                  <span className="font-semibold text-[#0e162b]">Waiting in Reception</span>
                </div>
                <span className="font-bold text-[#0e162b] font-mono text-sm">{waitingRoomCount} Patients</span>
              </div>

              <div className="p-3.5 bg-[#f0f2f5] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8e8e8e]" />
                  <span className="font-semibold text-[#0e162b]">Completed Today</span>
                </div>
                <span className="font-bold text-[#0e162b] font-mono text-sm">{completedCount} Encounters</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e8e8e8] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e8e]">
                Executive Actions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('appointments')}
                  className="px-3.5 py-2.5 rounded-full bg-[#0e162b] hover:bg-[#213364] text-white text-xs font-semibold text-center transition-all shadow-xs"
                >
                  Schedule Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('doctors')}
                  className="px-3.5 py-2.5 rounded-full border border-[#e8e8e8] hover:border-[#0e162b] bg-white text-[#0e162b] text-xs font-semibold text-center transition-colors"
                >
                  Doctor Roster
                </button>
              </div>
            </div>
          </div>

          {/* Operational Boundaries Callout */}
          <div className="p-5 rounded-2xl bg-[#f7f8fa] border border-[#e8e8e8] space-y-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e8e]">
              Governance Boundary Architecture
            </span>
            <p className="text-[#606060] leading-relaxed">
              <strong>Executive Director</strong> manages operational performance and organizational execution.
              Clinical decision authority rests exclusively with the <strong>Medical Director</strong> and attending physicians.
              Ownership equity, recapitalization, and partner distributions remain under the <strong>Clinic Owner</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
