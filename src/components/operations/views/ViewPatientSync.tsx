import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  Pill,
  Clock,
  CheckCircle2,
  FileText,
  QrCode,
  Activity,
  ReceiptText,
  RefreshCw,
} from 'lucide-react';

export const ViewPatientSync: React.FC = () => {
  const {
    appointments,
    prescriptions,
    claims,
    selectedPatient,
    setPrintDocumentData,
    runAutomatedCoreJourney,
    isJourneyRunning,
    journeyStep,
  } = useClinicOperations();

  const [activeScreen, setActiveScreen] = useState<'home' | 'prescriptions' | 'records'>('home');

  const patientApt = appointments.find((a) => a.patientId === 'PAT-001') || appointments[0];
  const patientRx = prescriptions.filter((r) => r.patientId === 'PAT-001');
  const patientClaim = claims.find((c) => c.patientId === 'PAT-001');

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Client Surface Mirror
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Patient Mobile Sync
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Real-time synchronization across clinic queue, clinical notes, prescriptions, and claims
          </p>
        </div>

        <button
          type="button"
          onClick={runAutomatedCoreJourney}
          disabled={isJourneyRunning}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isJourneyRunning ? 'animate-spin' : ''}`} />
          <span>{isJourneyRunning ? `Simulating step ${journeyStep}/13...` : 'Simulate live patient journey'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Real-Time Event Sync Logs (6 cols) */}
        <div className="lg:col-span-6 space-y-4 text-xs">
          <div className="border border-[#EBEBEB] rounded-2xl bg-white p-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
              Live Bi-Directional Event Handlers
            </h2>
            <p className="text-[#717171] leading-relaxed text-xs">
              Actions taken by clinic practitioners and front-desk staff trigger low-latency WebPush payloads directly into the patient application:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-[#F7F7F7] rounded-xl space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#222222]">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#008A05]" />
                    <span>Encounter Note Signed & Sealed</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#008A05] bg-[#E8F8EE] px-2 py-0.5 rounded-full">
                    Instant sync
                  </span>
                </div>
                <p className="text-xs text-[#717171] pt-1">
                  Cryptographically sealed consultation summary and care instructions dispatched to patient vault.
                </p>
              </div>

              <div className="p-4 bg-[#F7F7F7] rounded-xl space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#222222]">
                  <span className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-[#008A05]" />
                    <span>Prescription QR Code Issued</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#008A05] bg-[#E8F8EE] px-2 py-0.5 rounded-full">
                    Instant sync
                  </span>
                </div>
                <p className="text-xs text-[#717171] pt-1">
                  Patient presents QR token at partner pharmacies for automated dispensing verification.
                </p>
              </div>

              <div className="p-4 bg-[#F7F7F7] rounded-xl space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#222222]">
                  <span className="flex items-center gap-2">
                    <ReceiptText className="w-4 h-4 text-[#222222]" />
                    <span>Automated Claim Filing</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#222222] bg-white border border-[#EBEBEB] px-2 py-0.5 rounded-full">
                    EDI real-time
                  </span>
                </div>
                <p className="text-xs text-[#717171] pt-1">
                  Patient receives itemized insurance coverage breakdown and confirmed zero out-of-pocket cost.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Mobile Device Frame (6 cols) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-[340px] bg-[#222222] rounded-[48px] p-3.5 shadow-2xl border-4 border-[#333333] text-[#222222] overflow-hidden">
            {/* Mobile Screen Container */}
            <div className="bg-white rounded-[38px] overflow-hidden flex flex-col h-[600px] text-xs">
              {/* Phone Status Bar */}
              <div className="px-5 py-2 flex items-center justify-between text-[11px] font-medium text-[#717171] border-b border-[#F7F7F7]">
                <span>09:41</span>
                <div className="w-16 h-3.5 bg-[#222222] rounded-full"></div>
                <span>5G</span>
              </div>

              {/* Patient App Header */}
              <div className="p-4 border-b border-[#EBEBEB] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#717171] font-semibold uppercase tracking-wider">Patient Portal</span>
                  <h3 className="font-semibold text-[#222222] text-sm mt-0.5">{selectedPatient?.fullName || 'Abebe Bekele'}</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FF385C] text-white flex items-center justify-center font-semibold text-xs">
                  AB
                </div>
              </div>

              {/* Patient App Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Active Visit Status Card */}
                {patientApt && (
                  <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#EBEBEB] space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold uppercase tracking-wider text-[#717171]">
                        {patientApt.status === 'Completed' ? 'Visit Completed' : 'Today\'s Appointment'}
                      </span>
                      <span className="bg-white border border-[#EBEBEB] px-2 py-0.5 rounded-full font-mono text-[#222222] font-semibold">
                        {patientApt.time}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#222222] text-sm">{patientApt.doctorName}</h4>
                      <p className="text-xs text-[#717171]">Bethzatha Clinic · Suite 102</p>
                    </div>

                    {patientApt.status === 'Checked-in' && (
                      <div className="p-2.5 bg-white border border-[#EBEBEB] rounded-xl text-[#222222] text-xs flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#B26B00]" />
                        <span>In queue · Estimated call in 10 mins</span>
                      </div>
                    )}

                    {patientApt.status === 'Completed' && (
                      <div className="p-2.5 bg-[#E8F8EE] rounded-xl text-[#008A05] text-xs font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Encounter notes locked & verified</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Digital Prescriptions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#222222] text-xs">Active Prescriptions</span>
                    <span className="text-xs text-[#717171]">{patientRx.length} Active</span>
                  </div>

                  {patientRx.map((rx) => (
                    <div key={rx.id} className="p-3.5 bg-white border border-[#EBEBEB] rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-[#222222] text-xs">
                          <Pill className="w-3.5 h-3.5 text-[#717171]" />
                          <span>{rx.items[0]?.medication || 'Amlodipine'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPrintDocumentData(rx)}
                          className="text-[11px] font-medium text-[#222222] bg-[#F7F7F7] px-2.5 py-0.5 rounded-full flex items-center gap-1"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>QR code</span>
                        </button>
                      </div>
                      <p className="text-xs text-[#717171]">
                        {rx.items[0]?.dosage} · {rx.items[0]?.frequency}
                      </p>
                      <div className="text-[11px] text-[#717171] font-mono flex items-center justify-between pt-1 border-t border-[#EBEBEB]">
                        <span>Code: {rx.verificationCode}</span>
                        <span className="text-[#008A05] font-medium">{rx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Insurance Coverage in Patient App */}
                {patientClaim && (
                  <div className="p-3.5 bg-[#F7F7F7] rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[#222222] font-semibold">
                      <span>Insurance Claim</span>
                      <span className="text-[#008A05] text-xs font-medium">
                        {patientClaim.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#717171] flex justify-between">
                      <span>{patientClaim.payerName}:</span>
                      <span className="font-semibold text-[#222222]">${patientClaim.claimedAmount.toFixed(2)} Covered</span>
                    </div>
                    <div className="text-xs text-[#008A05] font-medium">
                      ✓ Patient Co-Pay: $0.00 (100% Covered)
                    </div>
                  </div>
                )}
              </div>

              {/* Patient App Bottom Nav */}
              <div className="p-2.5 border-t border-[#EBEBEB] flex items-center justify-around bg-white text-[#717171] text-[10px] font-medium">
                <button
                  type="button"
                  onClick={() => setActiveScreen('home')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'home' ? 'text-[#FF385C]' : ''}`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScreen('prescriptions')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'prescriptions' ? 'text-[#FF385C]' : ''}`}
                >
                  <Pill className="w-4 h-4" />
                  <span>Rx</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScreen('records')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'records' ? 'text-[#FF385C]' : ''}`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Records</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
