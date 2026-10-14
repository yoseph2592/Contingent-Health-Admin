import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  Heart,
  Thermometer,
  Activity,
  Wind,
  CheckCircle2,
  Users,
  Clock,
  Edit3,
  AlertCircle,
  Save,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { Vitals } from '../../../types/operations';

export const NursePrepQueue: React.FC = () => {
  const {
    appointments,
    patients,
    activeEncounter,
    updateEncounterVitals,
    checkInPatient,
    setSelectedPatientId,
    setActiveTab,
  } = useClinicOperations();

  const [selectedAptId, setSelectedAptId] = useState<string | null>('APT-8921');
  const [vitalsForm, setVitalsForm] = useState<Vitals>(activeEncounter.vitals);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [nursingNote, setNursingNote] = useState('Patient comfortable in triage chair. Denies acute shortness of breath. Glucose random 118 mg/dL.');

  const waitingPatients = appointments.filter(
    (a) => a.status === 'Checked-in' || a.status === 'Scheduled'
  );

  const activeApt = appointments.find((a) => a.id === selectedAptId) || appointments[0];

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    updateEncounterVitals(vitalsForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Clinical Support & Triage
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Patient Preparation Queue
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Vital signs recording, pre-consultation triage, and doctor preparation
          </p>
        </div>

        {/* Clear Nurse Scope Banner */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#F7F7F7] border border-[#EBEBEB] rounded-full text-xs text-[#717171]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#717171]" />
          <span>Doctor consultation & prescriptions require attending physician</span>
        </div>
      </div>

      {/* Main Grid: Waiting List on Left, Focused Vitals Entry on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Waiting Patients List */}
        <div className="lg:col-span-5 bg-white border border-[#EBEBEB] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#222222]">
              Lobby & Triage Queue ({waitingPatients.length})
            </h2>
            <span className="text-xs text-[#717171]">Ready for vitals</span>
          </div>

          <div className="divide-y divide-[#EBEBEB]">
            {waitingPatients.map((apt) => {
              const isSelected = apt.id === selectedAptId;
              const isCheckedIn = apt.status === 'Checked-in';

              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedAptId(apt.id)}
                  className={`py-3 px-2 rounded-xl transition-all cursor-pointer ${
                    isSelected ? 'bg-[#f0f2f5] border-l-2 border-[#00c0fe]' : 'hover:bg-[#f5f7fa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#0e162b]">
                      {apt.patientName}
                    </span>
                    <span className="text-[11px] font-mono text-[#8e8e8e]">{apt.time}</span>
                  </div>

                  <p className="text-xs text-[#606060] mt-0.5">
                    Attending: {apt.doctorName}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isCheckedIn
                          ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                          : 'bg-[#f0f2f5] text-[#606060]'
                      }`}
                    >
                      {isCheckedIn ? 'Checked-in' : 'Scheduled'}
                    </span>

                    {apt.status === 'Scheduled' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          checkInPatient(apt.id);
                        }}
                        className="text-xs font-semibold text-[#00c0fe] hover:underline"
                      >
                        Check in
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Focused Vitals Recording Form */}
        <div className="lg:col-span-7 bg-white border border-[#e8e8e8] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-4">
            <div>
              <span className="text-xs text-[#606060]">Recording Vitals for</span>
              <h3 className="text-lg font-semibold text-[#0e162b]">
                {activeApt?.patientName || 'Patient'} ({activeApt?.patientAge || 0}y · {activeApt?.patientSex || 'N/A'})
              </h3>
              <p className="text-xs text-[#606060] mt-0.5">
                Reason: &ldquo;{activeApt?.reasonForVisit || 'General Clinical Review'}&rdquo;
              </p>
            </div>

            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#84ebb4]/25 text-[#1fc16b] text-xs font-semibold rounded-full">
                <Check className="w-3.5 h-3.5" />
                <span>Vitals saved</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveVitals} className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-[#717171] block mb-1">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  value={vitalsForm.bloodPressure}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, bloodPressure: e.target.value })}
                  placeholder="120/80"
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#717171] block mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={vitalsForm.heartRate}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#717171] block mb-1">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  value={vitalsForm.spO2}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, spO2: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#717171] block mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={vitalsForm.temperature}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#717171] block mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={vitalsForm.weightKg}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, weightKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#717171] block mb-1">
                  Respiratory Rate (/min)
                </label>
                <input
                  type="number"
                  value={vitalsForm.respiratoryRate}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, respiratoryRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                />
              </div>
            </div>

            {/* Nursing Notes */}
            <div>
              <label className="text-xs font-medium text-[#717171] block mb-1">
                Pre-Consultation Nursing Triage Notes
              </label>
              <textarea
                rows={3}
                value={nursingNote}
                onChange={(e) => setNursingNote(e.target.value)}
                className="w-full p-3 border border-[#DDDDDD] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#222222]"
                placeholder="Note any symptoms, mobility issues, or triage observations..."
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#717171]">
                Synced directly to attending doctor encounter
              </span>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Vitals to Encounter</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
