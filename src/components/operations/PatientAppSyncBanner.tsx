import React from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import { Smartphone, X, ExternalLink } from 'lucide-react';

export const PatientAppSyncBanner: React.FC = () => {
  const { patientSyncAlert, dismissPatientSyncAlert, setActiveTab } = useClinicOperations();

  if (!patientSyncAlert || !patientSyncAlert.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#222222] text-white rounded-2xl shadow-xl border border-[#333333] p-4.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#333333] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">{patientSyncAlert.title}</span>
              <span className="text-[10px] text-[#1fc16b] bg-[#84ebb4]/25 px-2 py-0.5 rounded-full font-medium">
                Live sync
              </span>
            </div>
            <p className="text-xs text-[#B0B0B0] mt-1 leading-relaxed">
              {patientSyncAlert.message}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('patient-sync');
                  dismissPatientSyncAlert();
                }}
                className="text-xs font-medium text-white hover:underline flex items-center gap-1"
              >
                <span>View in mobile app</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={dismissPatientSyncAlert}
                className="text-xs text-[#717171] hover:text-white transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={dismissPatientSyncAlert}
          className="text-[#717171] hover:text-white p-1 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
