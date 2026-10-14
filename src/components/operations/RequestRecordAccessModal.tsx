import React, { useState } from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import {
  X,
  Lock,
  ShieldCheck,
  Building2,
  User,
  Calendar,
  Clock,
  Send,
  FileText,
  AlertCircle,
  Smartphone,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';

export const RequestRecordAccessModal: React.FC = () => {
  const {
    requestAccessModalEncounter,
    closeRequestAccessModal,
    submitAccessRequest,
    simulatePatientConsentApproval,
    selectedPatient,
    activeRole,
  } = useClinicOperations();

  const [purpose, setPurpose] = useState('Clinical Care Continuity & Treatment Planning');
  const [practitionerNote, setPractitionerNote] = useState('');
  const [requestedScopes, setRequestedScopes] = useState<string[]>([
    'Full Clinical Notes & SOAP Documentation',
    'Diagnostic Orders & Laboratory Results',
    'Prescribed Medications & Dosages',
    'Specialist Clinical Observations',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!requestAccessModalEncounter) return null;

  const enc = requestAccessModalEncounter;
  const patientName = selectedPatient?.fullName || 'Patient';
  const patientPhone = selectedPatient?.phone || '+251 91 142 8890';

  const defaultPurposes = [
    'Clinical Care Continuity & Treatment Planning',
    'Medication Reconciliation & Interaction Screening',
    'Diagnostic Cross-Reference & Lab Review',
    'Multidisciplinary Care Coordination',
    'Emergency & Acute Triage Evaluation',
  ];

  const toggleScope = (scope: string) => {
    if (requestedScopes.includes(scope)) {
      if (requestedScopes.length > 1) {
        setRequestedScopes(requestedScopes.filter((s) => s !== scope));
      }
    } else {
      setRequestedScopes([...requestedScopes, scope]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitAccessRequest(enc.id, purpose, practitionerNote);
      setIsSubmitting(false);
    }, 400);
  };

  const handleQuickSimulate = () => {
    submitAccessRequest(enc.id, purpose, practitionerNote);
    setTimeout(() => {
      simulatePatientConsentApproval(enc.id);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#EBEBEB] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#e8e8e8] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00c0fe]/10 border border-[#00c0fe]/30 flex items-center justify-center text-[#0095c5]">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0095c5]">
                  Consent Sovereignty Exchange
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f2f5] text-[#606060] font-semibold">
                  FHIR HL7
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0e162b] mt-0.5">
                Request Clinical Record Access
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={closeRequestAccessModal}
            className="p-2 text-[#8e8e8e] hover:text-[#0e162b] hover:bg-[#f0f2f5] rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-5 text-xs">
          {/* Target Record Card (Partial Metadata) */}
          <div className="p-4 rounded-2xl bg-[#f0f2f5] border border-[#e8e8e8] space-y-3">
            <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-2.5">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#0095c5]" />
                <span className="font-bold text-[#0e162b] text-xs">{enc.facilityName}</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00c0fe]/15 text-[#0095c5]">
                {enc.providerType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-[#717171] block">Attending Practitioner</span>
                <span className="font-semibold text-[#222222]">{enc.providerName}</span>
                <span className="text-[10px] text-[#717171] block">{enc.providerRoleTitle}</span>
              </div>
              <div>
                <span className="text-[#717171] block">Encounter Date & Time</span>
                <span className="font-semibold text-[#222222]">{enc.date}</span>
                <span className="text-[10px] text-[#717171] block">{enc.time}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EBEBEB]">
              <span className="text-[#717171] block text-[10px] font-semibold uppercase tracking-wider mb-1">
                Encounter Category
              </span>
              <p className="font-medium text-[#222222] text-xs">
                {enc.encounterCategory}
              </p>
              <p className="text-[#717171] text-[11px] mt-1 leading-relaxed italic">
                "{enc.summarySnippet}"
              </p>
            </div>
          </div>

          {/* Patient Consent Prompt Banner */}
          <div className="p-3.5 rounded-2xl bg-[#F0F8FF] border border-[#D0E6FF] flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-[#0066CC] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#0066CC] text-xs">Patient Mobile Authorization</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#0066CC] font-semibold">
                  Push Prompt
                </span>
              </div>
              <p className="text-[#335577] text-[11px] leading-relaxed">
                Submitting this request will dispatch an encrypted consent dialog to{' '}
                <strong className="text-[#112233]">{patientName}</strong> ({patientPhone}). The full clinical SOAP notes,
                prescriptions, and test results will decrypt automatically once approved.
              </p>
            </div>
          </div>

          {/* Clinical Purpose Selection */}
          <div className="space-y-2">
            <label className="font-bold text-[#222222] block text-xs">
              Clinical Purpose of Disclosure *
            </label>
            <div className="space-y-1.5">
              {defaultPurposes.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurpose(p)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    purpose === p
                      ? 'bg-[#00c0fe]/10 border-[#00c0fe] text-[#0e162b] font-semibold shadow-2xs'
                      : 'bg-white border-[#e8e8e8] text-[#606060] hover:bg-[#f0f2f5]'
                  }`}
                >
                  <span>{p}</span>
                  {purpose === p && <CheckCircle2 className="w-3.5 h-3.5 text-[#00c0fe] shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Scope of Records Requested */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#0e162b] text-xs">
                Requested Information Scope
              </label>
              <span className="text-[10px] text-[#8e8e8e]">Minimum necessary principle</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Full Clinical Notes & SOAP Documentation',
                'Diagnostic Orders & Laboratory Results',
                'Prescribed Medications & Dosages',
                'Specialist Clinical Observations',
              ].map((scope) => {
                const isChecked = requestedScopes.includes(scope);
                return (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => toggleScope(scope)}
                    className={`px-3 py-2 rounded-xl text-left border text-[11px] flex items-center space-x-2 transition-all ${
                      isChecked
                        ? 'bg-[#f0f2f5] border-[#0e162b] text-[#0e162b] font-medium'
                        : 'bg-white border-[#e8e8e8] text-[#8e8e8e]'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] shrink-0 ${
                        isChecked ? 'bg-[#0e162b] text-white' : 'border border-[#d2d2d2]'
                      }`}
                    >
                      {isChecked && '✓'}
                    </span>
                    <span className="truncate">{scope}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attending Practitioner Note */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#0e162b] block text-xs">
              Attending Physician Note (Optional)
            </label>
            <textarea
              rows={2}
              value={practitionerNote}
              onChange={(e) => setPractitionerNote(e.target.value)}
              placeholder="e.g. Required for baseline blood pressure titration and neuromuscular rehabilitation review."
              className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-[#e8e8e8] focus:border-[#0e162b] rounded-xl text-xs text-[#0e162b] focus:outline-none resize-none"
            />
          </div>

          {/* Compliance & Attestation */}
          <div className="p-3 bg-[#f0f2f5] rounded-xl border border-[#e8e8e8] text-[10px] text-[#606060] space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-[#0e162b]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1fc16b]" />
              <span>Contingent Health Consent Sovereignty Standard</span>
            </div>
            <p>
              Requesting as <strong className="text-[#0e162b]">{activeRole === 'Doctor' ? 'Dr. Almaz Tefera, MD' : activeRole}</strong>.
              All disclosures are cryptographically logged in the immutable audit trail under patient-authorized access rules.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-[#e8e8e8] flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handleQuickSimulate}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#84ebb4]/20 border border-[#84ebb4] text-[#1fc16b] hover:bg-[#84ebb4]/30 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
              title="Request and immediately simulate patient tapping 'Approve' on their phone"
            >
              <span>⚡ Dispatch &amp; Auto-Approve</span>
            </button>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={closeRequestAccessModal}
                className="px-4 py-2.5 rounded-xl border border-[#e8e8e8] text-[#606060] hover:text-[#0e162b] hover:border-[#0e162b] font-semibold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#0e162b] hover:bg-[#213364] text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Request to Patient'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
