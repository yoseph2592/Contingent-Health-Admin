import React, { useState } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { CLINIC_DIRECTORY } from '../../data/mockData';
import { ClinicDirectoryItem } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  User,
  Stethoscope,
  MapPin,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  Award,
  Search,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  FileCheck2,
  UserPlus,
  Activity,
  HeartHandshake,
} from 'lucide-react';

export const ScreenDoctorPortal: React.FC = () => {
  const {
    account,
    profile,
    affiliations,
    isOperatingIndependently,
    toggleIndependentPractice,
    sendAffiliationRequest,
    removeAffiliation,
    updateAffiliationStatus,
    verificationStatus,
    contingentVerificationId,
    verificationDocuments,
    resetOnboarding,
    setCurrentStep,
  } = useDoctor();

  const [isAddingAffiliation, setIsAddingAffiliation] = useState(false);
  const [clinicSearch, setClinicSearch] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<ClinicDirectoryItem | null>(null);
  const [targetDept, setTargetDept] = useState('');
  const [notes, setNotes] = useState('');

  const activeClinics = affiliations.filter((a) => a.status === 'Accepted');
  const pendingClinics = affiliations.filter((a) => a.status === 'Pending');

  const filteredClinics = CLINIC_DIRECTORY.filter(
    (c) =>
      !affiliations.some((a) => a.clinicId === c.id) &&
      (c.name.toLowerCase().includes(clinicSearch.toLowerCase()) ||
        c.location.toLowerCase().includes(clinicSearch.toLowerCase()) ||
        c.registrationId.toLowerCase().includes(clinicSearch.toLowerCase()))
  );

  const handleSendNewAffiliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClinic) {
      sendAffiliationRequest(selectedClinic.id, targetDept || selectedClinic.availableDepartments[0], notes);
      setSelectedClinic(null);
      setIsAddingAffiliation(false);
      setClinicSearch('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
      {/* Registration Success Banner */}
      <div className="mb-8 p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-emerald-100">
                Active Doctor Profile
              </span>
              <span className="text-xs font-mono text-emerald-100">ID: {contingentVerificationId}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-0.5">
              Welcome to Contingent, {account.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl">
              Your professional credentials have been registered. You can manage multiple clinic affiliations, practice independently, and accept patient appointments.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setCurrentStep('account')}
            className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-semibold text-white transition-colors"
          >
            Edit Profile Flow
          </button>
          <button
            type="button"
            onClick={resetOnboarding}
            className="px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Onboarding</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Doctor Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="text-center pb-5 border-b border-slate-100">
              <div className="relative inline-block mx-auto mb-3">
                <img
                  src={profile.avatarUrl}
                  alt={account.fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-sm mx-auto"
                />
                <span
                  className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs"
                  title="Contingent Verified"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900">{profile.title || account.fullName}</h2>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">{profile.specialty}</p>
              {profile.subspecialty && (
                <p className="text-[11px] text-slate-500">{profile.subspecialty}</p>
              )}

              <div className="mt-3 inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contingent Verified Practitioner</span>
              </div>
            </div>

            {/* Credential Metrics */}
            <div className="py-4 space-y-2.5 text-xs text-slate-600 border-b border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">License ID:</span>
                <span className="font-mono font-semibold text-slate-900">{profile.licenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Authority:</span>
                <span className="font-semibold text-slate-900">{profile.licensingCountry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Experience:</span>
                <span className="font-semibold text-slate-900">{profile.experienceYears} Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-slate-900">{account.city}, {account.country}</span>
              </div>
            </div>

            {/* Languages & Bio */}
            <div className="pt-4 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Consultation Languages
                </span>
                <div className="flex flex-wrap gap-1">
                  {profile.languages.map((l) => (
                    <span key={l} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Professional Bio
                </span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {profile.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Documents Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Documents ({verificationDocuments.length})</span>
            </h2>
            <div className="space-y-2 text-xs">
              {verificationDocuments.map((d) => (
                <div key={d.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-slate-900 truncate">{d.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{d.fileName}</p>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded shrink-0">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Affiliation & Practice Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Practice Mode Control Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-emerald-600" />
                  <span>Affiliation & Practice Mode Management</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage your active clinic partnerships and independent telehealth practice status.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingAffiliation(!isAddingAffiliation)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Affiliate with New Clinic</span>
              </button>
            </div>

            {/* Independent Practice Toggle */}
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900">Independent Practice Status</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Allow patients to book direct telehealth or private consultations with you, independent of clinic affiliations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleIndependentPractice()}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isOperatingIndependently ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isOperatingIndependently ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Add New Affiliation Inline Drawer */}
            {isAddingAffiliation && (
              <div className="mt-4 p-4 bg-slate-100/70 border border-slate-300 rounded-xl animate-in fade-in duration-150">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Search & Request Clinic Affiliation
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingAffiliation(false);
                      setSelectedClinic(null);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={clinicSearch}
                    onChange={(e) => setClinicSearch(e.target.value)}
                    placeholder="Search clinics by name, location, or Reg ID..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {selectedClinic ? (
                  <form onSubmit={handleSendNewAffiliation} className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-3">
                    <div className="flex items-center space-x-2">
                      <img src={selectedClinic.logoUrl} alt={selectedClinic.name} className="w-8 h-8 rounded object-contain border p-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{selectedClinic.name}</p>
                        <p className="text-[11px] text-slate-500">{selectedClinic.location}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department</label>
                      <select
                        value={targetDept}
                        onChange={(e) => setTargetDept(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border rounded"
                      >
                        {selectedClinic.availableDepartments.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Note (Optional)</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. In-person Tuesday & Thursday clinics"
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border rounded"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedClinic(null)}
                        className="px-3 py-1 text-xs border rounded text-slate-600 hover:bg-slate-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 text-xs bg-slate-900 text-white rounded font-semibold hover:bg-slate-800"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1.5">
                    {filteredClinics.slice(0, 4).map((clinic) => (
                      <div
                        key={clinic.id}
                        className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300"
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <img src={clinic.logoUrl} alt={clinic.name} className="w-7 h-7 rounded object-contain border p-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{clinic.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{clinic.location} · {clinic.registrationId}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClinic(clinic);
                            setTargetDept(clinic.availableDepartments[0]);
                          }}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-medium shrink-0"
                        >
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Affiliations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Active Clinic Partnerships ({activeClinics.length})</span>
            </h2>

            {activeClinics.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No active clinic partnerships yet. Requests are currently pending or you are operating independently.
              </div>
            ) : (
              <div className="space-y-3">
                {activeClinics.map((clinic) => (
                  <div
                    key={clinic.clinicId}
                    className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={clinic.clinicLogoUrl}
                        alt={clinic.clinicName}
                        className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-200 p-1 shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-sm">{clinic.clinicName}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        </div>
                        <p className="text-slate-500 mt-0.5">{clinic.clinicLocation}</p>
                        <p className="text-slate-700 mt-1">
                          Department: <strong>{clinic.requestedDepartment}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => removeAffiliation(clinic.clinicId)}
                        className="px-2.5 py-1.5 text-[11px] text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                      >
                        End Affiliation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Affiliation Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Pending Affiliation Requests ({pendingClinics.length})</span>
            </h2>

            {pendingClinics.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No pending requests.</p>
            ) : (
              <div className="space-y-3">
                {pendingClinics.map((clinic) => (
                  <div
                    key={clinic.clinicId}
                    className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={clinic.clinicLogoUrl}
                        alt={clinic.clinicName}
                        className="w-9 h-9 rounded-lg object-contain bg-white border border-slate-200 p-1 shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900">{clinic.clinicName}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Pending Review
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{clinic.clinicLocation}</p>
                        <p className="text-slate-700 mt-1">
                          Requested Dept: <strong>{clinic.requestedDepartment}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Simulation Switcher */}
                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => updateAffiliationStatus(clinic.clinicId, 'Accepted')}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                        title="Simulate clinic accepting request"
                      >
                        Simulate Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAffiliation(clinic.clinicId)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        title="Cancel request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
