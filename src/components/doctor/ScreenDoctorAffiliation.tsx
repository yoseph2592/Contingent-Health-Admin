import React, { useState, useMemo } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { ClinicDirectoryItem, ClinicCategory } from '../../types';
import { CLINIC_DIRECTORY } from '../../data/mockData';
import {
  Building2,
  Search,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Filter,
  Plus,
  Trash2,
  Info,
  Check,
  Building,
  UserPlus,
  HelpCircle,
} from 'lucide-react';

export const ScreenDoctorAffiliation: React.FC = () => {
  const {
    affiliations,
    sendAffiliationRequest,
    removeAffiliation,
    updateAffiliationStatus,
    isOperatingIndependently,
    toggleIndependentPractice,
    setCurrentStep,
  } = useDoctor();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedClinicForRequest, setSelectedClinicForRequest] = useState<ClinicDirectoryItem | null>(null);
  const [targetDepartment, setTargetDepartment] = useState('');
  const [requestNotes, setRequestNotes] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Filtered clinics
  const filteredClinics = useMemo(() => {
    return CLINIC_DIRECTORY.filter((clinic) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        clinic.name.toLowerCase().includes(q) ||
        clinic.location.toLowerCase().includes(q) ||
        clinic.address.toLowerCase().includes(q) ||
        clinic.registrationId.toLowerCase().includes(q) ||
        clinic.facilityLicenseNumber.toLowerCase().includes(q) ||
        clinic.category.toLowerCase().includes(q) ||
        clinic.availableDepartments.some((d) => d.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'All' || clinic.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ['All', 'General Clinic', 'Specialist Clinic', "Women's Health", 'Diagnostic Center', 'Eye Care Clinic', 'Medical Center'];

  const handleOpenRequest = (clinic: ClinicDirectoryItem) => {
    setSelectedClinicForRequest(clinic);
    setTargetDepartment(clinic.availableDepartments[0] || 'General Medicine');
    setRequestNotes('');
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClinicForRequest) {
      sendAffiliationRequest(
        selectedClinicForRequest.id,
        targetDepartment,
        requestNotes
      );
      setSelectedClinicForRequest(null);
    }
  };

  const handleSkip = () => {
    // If doctor hasn't chosen a clinic or independent, default to independent practice so they have full autonomy
    if (affiliations.length === 0 && !isOperatingIndependently) {
      toggleIndependentPractice(true);
    }
    setCurrentStep('verification');
  };

  const handleContinue = () => {
    // Automatically enable independent practice if no clinics requested
    if (affiliations.length === 0 && !isOperatingIndependently) {
      toggleIndependentPractice(true);
    }
    setCurrentStep('verification');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
      {/* Step Header with Skip CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium mb-2 border border-emerald-200">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Step 3 of 5 · Flexible Practice & Affiliation Model</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Clinic Affiliation & Practice Mode
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Choose how you wish to practice on Contingent. You can affiliate with verified clinics, operate independently, or combine both models.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="self-start sm:self-center inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
        >
          <span>Skip Affiliation for Now</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>

      {/* Distinction & Info Banner */}
      <div className="mb-6 p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start space-x-3 text-xs text-blue-900">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-blue-950">
            Professional Verification vs. Clinic Affiliation
          </p>
          <p className="mt-0.5 text-blue-800 leading-relaxed">
            <strong>Professional Verification</strong> certifies your official medical license with Contingent's integrity council. <strong>Clinic Affiliation</strong> is strictly optional—it links your schedule to specific clinical facilities so they can assign consultations and procedure slots. You can skip this now and manage affiliations at any time.
          </p>
        </div>
      </div>

      {/* Two Flexible Options Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Option 1: Affiliate with Clinics */}
        <div
          className={`p-5 rounded-xl border transition-all ${
            affiliations.length > 0
              ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            {affiliations.length > 0 && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                <Check className="w-3 h-3" />
                <span>{affiliations.length} {affiliations.length === 1 ? 'Clinic Selected' : 'Clinics Selected'}</span>
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-slate-900">Option 1: Join / Affiliate with Clinics</h2>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            Search our directory of licensed clinics by name, city, or registration ID and send partnership requests. Multiple affiliations are fully supported.
          </p>
          <a
            href="#clinic-search"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
          >
            <span>Browse Clinic Directory Below</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Option 2: Practice Independently */}
        <div
          onClick={() => toggleIndependentPractice()}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            isOperatingIndependently
              ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mb-3">
              <UserCheck className="w-5 h-5" />
            </div>
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                isOperatingIndependently
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {isOperatingIndependently && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
          <h2 className="text-base font-bold text-slate-900">Option 2: Continue Independently</h2>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            Practice as an autonomous physician without a clinic affiliation. Provide direct telehealth and clinical consultations under your verified Contingent badge.
          </p>
          <span className="text-xs font-medium text-blue-700">
            {isOperatingIndependently ? '✓ Active: Operating Independently' : 'Click to enable independent practice'}
          </span>
        </div>
      </div>

      {/* Selected Affiliation Requests Hub (Shows Pending / Accepted / Declined status) */}
      {affiliations.length > 0 && (
        <div className="mb-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>My Clinic Affiliation Requests</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {affiliations.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Track the status of your requests. Clinics review your verified credentials before confirming.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {affiliations.map((item) => {
              const isPending = item.status === 'Pending';
              const isAccepted = item.status === 'Accepted';
              const isDeclined = item.status === 'Declined';

              return (
                <div
                  key={item.clinicId}
                  className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <img
                      src={item.clinicLogoUrl}
                      alt={item.clinicName}
                      className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-200 shrink-0 p-1"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.clinicName}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-medium">
                          {item.clinicCategory}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{item.clinicLocation}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-mono text-[11px] text-slate-400">ID: {item.clinicRegistrationId}</span>
                      </p>
                      <p className="text-xs text-slate-700 mt-1">
                        Department: <strong className="font-medium text-slate-900">{item.requestedDepartment}</strong>
                        {item.notes && <span className="text-slate-500 italic ml-2">"{item.notes}"</span>}
                      </p>
                    </div>
                  </div>

                  {/* Status Pill & Interactive Simulator Controls */}
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {/* Status badge */}
                    {isPending && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pending Clinic Review</span>
                      </span>
                    )}
                    {isAccepted && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Accepted / Active</span>
                      </span>
                    )}
                    {isDeclined && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>Declined</span>
                      </span>
                    )}

                    {/* Simulation Switcher Dropdown / Quick Simulator */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-md p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => updateAffiliationStatus(item.clinicId, 'Accepted')}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                          isAccepted ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-emerald-700'
                        }`}
                        title="Simulate clinic approving your request"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAffiliationStatus(item.clinicId, 'Pending')}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                          isPending ? 'bg-amber-600 text-white font-bold' : 'text-slate-600 hover:text-amber-700'
                        }`}
                        title="Simulate pending status"
                      >
                        Pending
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAffiliationStatus(item.clinicId, 'Declined')}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                          isDeclined ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:text-red-700'
                        }`}
                        title="Simulate clinic declining request"
                      >
                        Decline
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeAffiliation(item.clinicId)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Withdraw affiliation request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Searchable Clinic Directory Section */}
      <div id="clinic-search" className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              <span>Searchable Clinic Directory</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Search by clinic name, metropolitan location, or facility registration ID.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clinic, location, or Reg ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="py-3 flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-slate-400 shrink-0 mr-1 flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white font-medium shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Directory Grid */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredClinics.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No clinics found matching your criteria</p>
              <p className="text-xs text-slate-500 mt-1">Try searching by a broader keyword or resetting filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-3 px-3 py-1.5 bg-white border border-slate-300 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredClinics.map((clinic) => {
              const existingAffiliation = affiliations.find((a) => a.clinicId === clinic.id);
              const isAffiliated = !!existingAffiliation;

              return (
                <div
                  key={clinic.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    {/* Top Row: Logo, Name, Verification Shield */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={clinic.logoUrl}
                          alt={clinic.name}
                          className="w-11 h-11 rounded-lg object-contain bg-slate-50 border border-slate-200 shrink-0 p-1"
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-slate-900 truncate">
                            {clinic.name}
                          </h3>
                          <span className="inline-block text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                            {clinic.category}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center space-x-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </div>
                    </div>

                    {/* Clinic Address & Registration ID */}
                    <div className="mt-2.5 space-y-1 text-xs text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{clinic.location}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <strong className="font-medium text-slate-700">Reg ID:</strong>
                        <span className="font-mono">{clinic.registrationId}</span>
                        <span className="text-slate-300">·</span>
                        <span>Lic: {clinic.facilityLicenseNumber}</span>
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                        {clinic.description}
                      </p>
                    </div>

                    {/* Departments list */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {clinic.availableDepartments.map((dept) => (
                        <span
                          key={dept}
                          className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {clinic.activeDoctorsCount} affiliated doctors · {clinic.servicesCount} services
                    </span>

                    {isAffiliated ? (
                      <span className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Requested ({existingAffiliation?.status})</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenRequest(clinic)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Request Affiliation</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Affiliation Request Modal / Drawer */}
      {selectedClinicForRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedClinicForRequest.logoUrl}
                  alt={selectedClinicForRequest.name}
                  className="w-12 h-12 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Request Affiliation with {selectedClinicForRequest.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedClinicForRequest.location} · {selectedClinicForRequest.registrationId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClinicForRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Target Department
                </label>
                <select
                  value={targetDepartment}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {selectedClinicForRequest.availableDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Availability / Partnership Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="e.g. Available for outpatient clinic sessions on Tuesdays and Thursdays, 09:00 - 13:00."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  The clinic administrators will receive your request along with your Contingent-verified medical license. Once accepted, your profile will be affiliated with their facility.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedClinicForRequest(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Send Affiliation Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setCurrentStep('profile')}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSkip}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 transition-colors"
          >
            Skip / Continue Later
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-xs transition-colors"
          >
            <span>Continue to Verification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
