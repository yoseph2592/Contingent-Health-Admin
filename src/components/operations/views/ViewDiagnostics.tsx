import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { LabRequestRecord } from '../../../types/operations';
import {
  FlaskConical,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const ViewDiagnostics: React.FC = () => {
  const {
    labRequests,
    setIsOrderLabModalOpen,
    addAuditLog,
    setSelectedPatientId,
    setActiveTab,
  } = useClinicOperations();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedLab, setSelectedLab] = useState<LabRequestRecord | null>(labRequests[1] || null);
  const [doctorInterpretationInput, setDoctorInterpretationInput] = useState('');

  const statuses = ['All', 'In Progress', 'Result Available', 'Reviewed'];

  const filtered = labRequests.filter((l) => {
    return statusFilter === 'All' || l.status === statusFilter;
  });

  const handleSignOff = (lab: LabRequestRecord) => {
    lab.reviewedByDoctor = true;
    lab.status = 'Reviewed';
    if (doctorInterpretationInput.trim()) {
      lab.doctorInterpretation = doctorInterpretationInput.trim();
    }
    addAuditLog(`Signed off laboratory review for ${lab.id}`, 'LabRequestRecord', lab.id, 'Result Available', 'Reviewed');
    setDoctorInterpretationInput('');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Laboratory & Diagnostics
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Diagnostic Orders
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Pathology tests, radiology imaging, specimen status, and physician result sign-offs
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOrderLabModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Order diagnostic test</span>
        </button>
      </div>

      {/* Filter strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              statusFilter === s
                ? 'bg-[#0e162b] text-white'
                : 'bg-white border border-[#e8e8e8] text-[#606060] hover:text-[#0e162b]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lab Requests List (6 cols) */}
        <div className="lg:col-span-6 border border-[#e8e8e8] rounded-2xl bg-white overflow-hidden divide-y divide-[#e8e8e8] text-xs">
          {filtered.map((lab) => {
            const isSelected = selectedLab?.id === lab.id;
            return (
              <div
                key={lab.id}
                onClick={() => {
                  setSelectedLab(lab);
                  setDoctorInterpretationInput(lab.doctorInterpretation || '');
                }}
                className={`p-5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f7fa]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-semibold ${isSelected ? 'text-[#00c0fe]' : 'text-[#0e162b]'}`}>
                        {lab.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lab.status === 'Result Available'
                            ? 'bg-[#ffdb43]/20 text-[#dfb400]'
                            : lab.status === 'Reviewed'
                            ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                            : 'bg-[#f0f2f5] text-[#606060]'
                        }`}
                      >
                        {lab.status}
                      </span>
                      {lab.isFlaggedAbnormal && (
                        <span className="px-2 py-0.5 rounded-full bg-[#fb3748]/10 text-[#d00416] text-xs font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Abnormal</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-[#222222] text-sm mt-1.5">{lab.testType}</h3>
                    <p className="text-xs text-[#717171] mt-0.5">
                      Patient: <strong className="text-[#222222] font-semibold">{lab.patientName}</strong> · Dept:{' '}
                      {lab.department}
                    </p>
                  </div>

                  <span className="text-xs text-[#717171] font-mono shrink-0">
                    {lab.requestedAt.split(' ')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Lab Results & Doctor Sign-Off Panel (6 cols) */}
        <div className="lg:col-span-6 border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden">
          {selectedLab ? (
            <div className="divide-y divide-[#EBEBEB] text-xs">
              <div className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
                    Diagnostic Order
                  </span>
                  <h3 className="font-semibold text-[#222222] text-base mt-0.5">{selectedLab.testType}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPatientId(selectedLab.patientId);
                    setActiveTab('patients');
                  }}
                  className="text-xs text-[#00c0fe] font-semibold hover:underline"
                >
                  View patient chart
                </button>
              </div>

              {/* Order Context */}
              <div className="p-5 space-y-3 text-[#0e162b]">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#606060]">Order ID:</span>{' '}
                    <code className="font-mono font-semibold text-[#0e162b]">{selectedLab.id}</code>
                  </div>
                  <div>
                    <span className="text-[#606060]">Priority:</span>{' '}
                    <span className="font-semibold text-[#0e162b]">{selectedLab.priority}</span>
                  </div>
                  <div>
                    <span className="text-[#606060]">Requesting Doctor:</span>{' '}
                    <span className="font-semibold text-[#0e162b]">{selectedLab.doctorName}</span>
                  </div>
                  <div>
                    <span className="text-[#606060]">Diagnosis:</span>{' '}
                    <span className="font-semibold text-[#0e162b]">{selectedLab.diagnosis}</span>
                  </div>
                </div>

                <div className="bg-[#f0f2f5] p-3 rounded-xl text-xs">
                  <span className="font-semibold text-[#0e162b]">Clinical Indication:</span>{' '}
                  <span className="text-[#606060]">{selectedLab.clinicalIndication}</span>
                </div>
              </div>

              {/* Verified Result Data */}
              <div className="p-5 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
                  Laboratory Test Results
                </span>

                {selectedLab.resultsSummary ? (
                  <div className="space-y-2">
                    <div className="p-4 bg-[#f0f2f5] border border-[#e8e8e8] text-[#0e162b] font-mono text-xs rounded-xl whitespace-pre-wrap leading-relaxed">
                      {selectedLab.resultsSummary}
                    </div>
                    {selectedLab.referenceRange && (
                      <p className="text-xs text-[#606060] italic">
                        Target/Ref: {selectedLab.referenceRange}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-8 bg-[#f0f2f5] rounded-xl text-center text-[#606060]">
                    <Clock className="w-6 h-6 mx-auto mb-1.5 text-[#bbbbbb]" />
                    <span>Specimen currently in analysis at central pathology lab</span>
                  </div>
                )}
              </div>

              {/* Physician Review & Interpretation Block */}
              {selectedLab.resultsSummary && (
                <div className="p-5 space-y-3 bg-[#f0f2f5]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
                    Doctor Interpretation & Sign-off
                  </span>

                  {selectedLab.reviewedByDoctor ? (
                    <div className="p-4 bg-[#84ebb4]/25 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-[#1fc16b] text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Physician Review Signed Off</span>
                      </div>
                      <p className="text-[#1fc16b]/90 font-medium text-xs">
                        "{selectedLab.doctorInterpretation || 'Reviewed and approved.'}"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows={2}
                        placeholder="Add physician interpretation, clinical comments, and follow-up plan..."
                        value={doctorInterpretationInput}
                        onChange={(e) => setDoctorInterpretationInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DDDDDD] rounded-xl text-xs text-[#222222] focus:outline-none resize-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSignOff(selectedLab)}
                        className="w-full py-2.5 bg-[#222222] hover:bg-black text-white rounded-full font-semibold text-xs transition-colors shadow-xs"
                      >
                        Sign & acknowledge result
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-16 text-center text-[#717171]">
              <FlaskConical className="w-10 h-10 mx-auto mb-2 text-[#DDDDDD]" />
              <p className="text-sm">Select an order to view diagnostic result report</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
