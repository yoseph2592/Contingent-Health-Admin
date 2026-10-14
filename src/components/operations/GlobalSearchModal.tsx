import React, { useEffect, useRef } from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import {
  Search,
  X,
  Users,
  Calendar,
  Pill,
  ReceiptText,
  ArrowRight,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    globalSearchQuery,
    setGlobalSearchQuery,
    patients,
    appointments,
    prescriptions,
    documents,
    claims,
    labRequests,
    referrals,
    setActiveTab,
    setSelectedPatientId,
    setSelectedAppointmentId,
  } = useClinicOperations();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsGlobalSearchOpen]);

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const query = globalSearchQuery.toLowerCase().trim();

  const matchedPatients = query
    ? patients.filter(
        (p) =>
          p.fullName.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query) ||
          p.phone.includes(query)
      )
    : [];

  const matchedAppointments = query
    ? appointments.filter(
        (a) =>
          a.id.toLowerCase().includes(query) ||
          a.patientName.toLowerCase().includes(query) ||
          a.reasonForVisit.toLowerCase().includes(query)
      )
    : [];

  const matchedPrescriptions = query
    ? prescriptions.filter(
        (r) =>
          r.id.toLowerCase().includes(query) ||
          r.patientName.toLowerCase().includes(query) ||
          r.items.some((i) => i.medication.toLowerCase().includes(query))
      )
    : [];

  const matchedClaims = query
    ? claims.filter(
        (c) =>
          c.id.toLowerCase().includes(query) ||
          c.patientName.toLowerCase().includes(query) ||
          c.payerName.toLowerCase().includes(query)
      )
    : [];

  const totalResults =
    matchedPatients.length +
    matchedAppointments.length +
    matchedPrescriptions.length +
    matchedClaims.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#EBEBEB] overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#EBEBEB] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#717171] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Search patients, appointments, prescriptions, claims..."
            className="w-full bg-transparent text-sm font-medium text-[#222222] placeholder-[#717171] focus:outline-none"
          />
          {globalSearchQuery && (
            <button
              type="button"
              onClick={() => setGlobalSearchQuery('')}
              className="text-[#717171] hover:text-[#222222] p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsGlobalSearchOpen(false)}
            className="px-2.5 py-1 text-xs text-[#717171] hover:text-[#222222] bg-[#F7F7F7] rounded-full shrink-0 font-medium"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {!query && (
            <div className="py-10 text-center text-[#717171]">
              <Search className="w-8 h-8 mx-auto mb-2 text-[#DDDDDD]" />
              <p className="font-semibold text-[#222222]">Type any patient name, ID, drug, doctor, or claim</p>
              <p className="text-xs text-[#717171] mt-1">
                Try searching: "Abebe", "Hypertension", "Valsartan", "MedNet", or "APT-8921"
              </p>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-10 text-center text-[#717171]">
              <p className="font-medium text-[#222222]">No operational records found matching "{query}"</p>
            </div>
          )}

          {/* Group: Patients */}
          {matchedPatients.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#717171] mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Patients ({matchedPatients.length})</span>
              </div>
              <div className="space-y-1">
                {matchedPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setActiveTab('patients');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-[#FAFAFA] flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <span className="font-semibold text-[#0e162b] group-hover:text-[#00c0fe] transition-colors">
                        {p.fullName}
                      </span>{' '}
                      <span className="text-[#606060] font-mono text-xs">({p.id})</span>
                      <p className="text-xs text-[#717171] mt-0.5">
                        {p.age}y {p.sex} · {p.phone} · Ins: {p.insuranceProvider}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#DDDDDD] group-hover:text-[#222222] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group: Appointments */}
          {matchedAppointments.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#717171] mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Appointments ({matchedAppointments.length})</span>
              </div>
              <div className="space-y-1">
                {matchedAppointments.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setSelectedAppointmentId(a.id);
                      setActiveTab('appointments');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-[#FAFAFA] flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <span className="font-semibold text-[#222222]">{a.id}</span> ·{' '}
                      <span className="text-[#222222] font-medium">{a.patientName}</span>{' '}
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#F7F7F7] text-[#717171]">
                        {a.status}
                      </span>
                      <p className="text-xs text-[#717171] mt-0.5">
                        {a.date} at {a.time} · {a.reasonForVisit}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#DDDDDD] group-hover:text-[#222222] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group: Prescriptions */}
          {matchedPrescriptions.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#717171] mb-2">
                <Pill className="w-3.5 h-3.5" />
                <span>Prescriptions ({matchedPrescriptions.length})</span>
              </div>
              <div className="space-y-1">
                {matchedPrescriptions.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setActiveTab('prescriptions');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-[#FAFAFA] flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <span className="font-semibold text-[#222222]">{r.id}</span> ·{' '}
                      <span className="text-[#222222] font-medium">{r.patientName}</span>
                      <p className="text-xs text-[#717171] mt-0.5">
                        {(r.items || []).map((i) => `${i.medication} ${i.strength}`).join(', ')}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#DDDDDD] group-hover:text-[#222222] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group: Claims */}
          {matchedClaims.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#717171] mb-2">
                <ReceiptText className="w-3.5 h-3.5" />
                <span>Insurance Claims ({matchedClaims.length})</span>
              </div>
              <div className="space-y-1">
                {matchedClaims.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveTab('claims');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-[#FAFAFA] flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <span className="font-semibold text-[#222222]">{c.id}</span> ·{' '}
                      <span className="text-[#222222] font-medium">{c.patientName}</span> (${c.claimedAmount})
                      <p className="text-xs text-[#717171] mt-0.5">
                        Payer: {c.payerName} · Status: {c.status}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#DDDDDD] group-hover:text-[#222222] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#F7F7F7] border-t border-[#EBEBEB] flex items-center justify-between text-xs text-[#717171]">
          <span>Unified cross-module entity search</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
