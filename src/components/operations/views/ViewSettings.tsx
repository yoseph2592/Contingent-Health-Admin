import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  CheckCircle2,
  Save,
} from 'lucide-react';

export const ViewSettings: React.FC = () => {
  const { currentClinic, addAuditLog } = useClinicOperations();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'hours' | 'rooms' | 'tariffs' | 'integrations'>('profile');

  const [clinicName, setClinicName] = useState(currentClinic.name);
  const [regNumber, setRegNumber] = useState(currentClinic.registrationNumber);
  const [defaultSlotDuration, setDefaultSlotDuration] = useState(currentClinic.defaultSlotDurationMinutes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog(`Updated clinic profile settings for ${clinicName}`, 'ClinicProfile', currentClinic.id, 'Original', 'Updated');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Facility profile' },
    { id: 'hours', label: 'Operating hours' },
    { id: 'rooms', label: 'Consultation suites' },
    { id: 'tariffs', label: 'Tariff schedules' },
    { id: 'integrations', label: 'Interoperability APIs' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Facility Administration
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Clinic Settings
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Facility licensing, consultation suites, tariff fees, and FHIR integration endpoints
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#84ebb4]/25 text-[#1fc16b] rounded-full text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeSubTab === tab.id
                ? 'bg-[#0e162b] text-white'
                : 'bg-white border border-[#e8e8e8] text-[#606060] hover:text-[#0e162b]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tab Contents */}
      <div className="border border-[#e8e8e8] rounded-2xl bg-white p-8">
        {activeSubTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-6 max-w-xl text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#0e162b] block mb-1.5">
                  Clinic Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0e162b] block mb-1.5">
                  Registration / Facility ID *
                </label>
                <input
                  type="text"
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs font-mono text-[#0e162b] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0e162b] block mb-1.5">
                Official Healthcare Facility License
              </label>
              <input
                type="text"
                readOnly
                value={currentClinic.licenseNumber}
                className="w-full px-3.5 py-2.5 bg-[#f0f2f5] rounded-xl text-xs font-mono text-[#606060] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#0e162b] block mb-1.5">
                  Physical Address
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentClinic.address}
                  className="w-full px-3.5 py-2.5 bg-[#f0f2f5] rounded-xl text-xs text-[#606060] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0e162b] block mb-1.5">
                  Accreditation Tier
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentClinic.accreditationTier}
                  className="w-full px-3.5 py-2.5 bg-[#f0f2f5] rounded-xl text-xs font-semibold text-[#1fc16b] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save profile</span>
              </button>
            </div>
          </form>
        )}

        {activeSubTab === 'hours' && (
          <div className="space-y-6 max-w-xl text-xs">
            <div>
              <span className="text-xs font-semibold text-[#222222] block mb-2">
                Default Appointment Slot Duration
              </span>
              <div className="flex items-center gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDefaultSlotDuration(mins)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      defaultSlotDuration === mins
                        ? 'bg-[#222222] text-white'
                        : 'bg-[#F7F7F7] text-[#717171] hover:text-[#222222]'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#EBEBEB] space-y-3">
              <span className="text-xs font-semibold text-[#222222] block">
                Weekly Operating Schedule
              </span>
              <div className="divide-y divide-[#EBEBEB] rounded-xl overflow-hidden bg-[#F7F7F7]">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <div key={day} className="p-3.5 flex items-center justify-between">
                    <span className="font-semibold text-[#0e162b]">{day}</span>
                    <span className="text-[#606060] font-mono">08:00 AM – 06:00 PM</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] font-medium text-xs">
                      Open
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'rooms' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
              Consultation Suites ({(currentClinic.rooms || []).length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(currentClinic.rooms || []).map((room) => (
                <div key={room.id} className="p-4 bg-[#f0f2f5] rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0e162b] text-sm">{room.name}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white text-[#606060] border border-[#e8e8e8]">
                      {room.department}
                    </span>
                  </div>
                  <p className="text-xs text-[#606060] pt-1">
                    Equipped: {(room.equipment || []).join(', ') || 'Standard Clinical Suite'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'tariffs' && (
          <div className="space-y-4 max-w-xl text-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
              Standard Consultation Tariff Schedule
            </span>
            <div className="rounded-xl overflow-hidden divide-y divide-[#e8e8e8] bg-[#f0f2f5]">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#0e162b] block">General Internal Medicine Consultation</span>
                  <span className="text-xs text-[#606060]">Standard 30 min physician encounter</span>
                </div>
                <span className="font-semibold text-sm text-[#0e162b]">$50.00</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#0e162b] block">Cardiology Specialist Consultation</span>
                  <span className="text-xs text-[#606060]">Specialist 45 min encounter</span>
                </div>
                <span className="font-semibold text-sm text-[#0e162b]">$85.00</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#0e162b] block">Telehealth Remote Follow-Up</span>
                  <span className="text-xs text-[#606060]">Secured virtual encounter</span>
                </div>
                <span className="font-semibold text-sm text-[#0e162b]">$35.00</span>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'integrations' && (
          <div className="space-y-4 max-w-xl text-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#606060] block">
              HL7 FHIR R4 & National Health Data Exchange
            </span>
            <div className="p-5 bg-[#f0f2f5] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#0e162b]">National Health Gateway</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] font-medium text-xs">
                  Connected
                </span>
              </div>
              <p className="text-xs text-[#606060]">
                FHIR Endpoint: <code className="font-mono text-[#0e162b]">https://fhir.contingenthealth.et/v1/bethzatha</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
