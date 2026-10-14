import React, { useEffect } from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import {
  ShieldCheck,
  Smartphone,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  Lock,
  Unlock,
  ChevronRight,
} from 'lucide-react';

export const RecordAccessToast: React.FC = () => {
  const {
    accessToast,
    dismissAccessToast,
    simulatePatientConsentApproval,
    selectedPatient,
    externalEncounters,
  } = useClinicOperations();

  if (!accessToast || !accessToast.show) return null;

  const targetEncounter = accessToast.encounterId
    ? externalEncounters.find((e) => e.id === accessToast.encounterId)
    : undefined;

  const isPending = accessToast.type === 'pending';
  const isSuccess = accessToast.type === 'success';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${
          isSuccess
            ? 'bg-[#F0FFF4] border-[#B7EB8F] text-[#222222]'
            : isPending
            ? 'bg-white border-[#FFE4D6] shadow-2xs text-[#222222]'
            : 'bg-white border-[#EBEBEB] text-[#222222]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Icon */}
          <div className="shrink-0 mt-0.5">
            {isSuccess ? (
              <div className="w-9 h-9 rounded-xl bg-[#1fc16b] text-white flex items-center justify-center shadow-xs">
                <Unlock className="w-5 h-5 stroke-[2.2]" />
              </div>
            ) : isPending ? (
              <div className="w-9 h-9 rounded-xl bg-[#ffdb43]/15 border border-[#ffdb43]/40 text-[#dfb400] flex items-center justify-center relative">
                <Smartphone className="w-5 h-5 stroke-[2.2]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#dfb400] animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#dfb400]" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#f0f2f5] text-[#606060] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isSuccess
                    ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                    : isPending
                    ? 'bg-[#ffdb43]/20 text-[#dfb400]'
                    : 'bg-[#f0f2f5] text-[#606060]'
                }`}
              >
                {isSuccess
                  ? 'Access Authorized'
                  : isPending
                  ? 'Awaiting Patient Consent'
                  : 'Record Privacy'}
              </span>

              {targetEncounter && (
                <span className="text-[10px] text-[#8e8e8e] truncate">
                  {targetEncounter.providerType}
                </span>
              )}
            </div>

            <h4 className="text-xs font-bold text-[#0e162b] leading-snug">
              {accessToast.title}
            </h4>

            <p className="text-[11px] text-[#606060] leading-relaxed">
              {accessToast.message}
            </p>

            {/* If pending, provide 1-click simulation trigger directly in the toast! */}
            {isPending && accessToast.encounterId && (
              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => simulatePatientConsentApproval(accessToast.encounterId!)}
                  className="px-3 py-1.5 rounded-xl bg-[#1fc16b] hover:bg-[#19a55a] text-white font-semibold text-[11px] transition-colors shadow-2xs flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Patient Approval</span>
                </button>

                <span className="text-[10px] text-[#8e8e8e]">Simulates mobile tap</span>
              </div>
            )}

            {/* If success, show verified cryptographic badge */}
            {isSuccess && targetEncounter?.consentToken && (
              <div className="pt-1.5 flex items-center space-x-2 text-[10px] font-mono text-[#1fc16b]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Token: {targetEncounter.consentToken}</span>
              </div>
            )}
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={dismissAccessToast}
            className="p-1 rounded-lg text-[#717171] hover:text-[#222222] hover:bg-black/5 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
