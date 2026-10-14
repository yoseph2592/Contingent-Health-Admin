import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { CLINIC_DIRECTORY } from '../../../data/mockData';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Building2,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Search,
  Check,
  Clock,
  Building,
  UploadCloud,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const ViewMergedOnboarding: React.FC = () => {
  const { setActiveTab, addAuditLog, addOnboardedDoctor } = useClinicOperations();

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [demoBannerMessage, setDemoBannerMessage] = useState<string | null>(null);

  const steps = [
    { id: 'account', title: '1. Account', desc: 'Identity & credentials' },
    { id: 'profile', title: '2. Profile', desc: 'Specialty & license' },
    { id: 'affiliation', title: '3. Affiliation', desc: 'Clinic or independent' },
    { id: 'verification', title: '4. Documents', desc: 'Board validation' },
    { id: 'contract', title: '5. Setup', desc: 'Revenue split & suite' },
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'Ethiopia',
    city: 'Addis Ababa',
    specialty: '',
    subSpecialty: '',
    licenseNumber: '',
    licensingCountry: 'Ethiopia',
    experienceYears: '8',
    languages: 'English, Amharic',
    bio: '',
    affiliationMode: 'clinic' as 'clinic' | 'independent',
    selectedClinicId: 'clinic-001',
    selectedClinicName: 'St. Gabriel Medical & Diagnostic Clinic',
    proposedSplit: '70/20/10',
    assignedRoom: 'Exam Room 102 - Cardiology & Internal Medicine Suite',
    sessionalSchedule: 'Mon, Wed, Fri (08:30 - 13:00)',
    isLicenseUploaded: false,
    isIdUploaded: false,
    supportingDocUploaded: false,
  });

  const [clinicSearchQuery, setClinicSearchQuery] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdDoctorId, setCreatedDoctorId] = useState<string>('');

  // Sample Demo Profiles for 1-Click Demo Data Population
  const demoProfiles = [
    {
      fullName: 'Dr. Michael Chen, MD',
      email: 'm.chen@apexheart.et',
      phone: '+251 91 145 6789',
      country: 'Ethiopia',
      city: 'Addis Ababa',
      specialty: 'Cardiology',
      subSpecialty: 'Non-Invasive Cardiovascular Care',
      licenseNumber: 'MD-ET-2018-8841',
      licensingCountry: 'Ethiopia (EFDA / MOH)',
      experienceYears: '14',
      languages: 'English, Mandarin, Amharic',
      bio: 'Senior consultant cardiologist specializing in comprehensive cardiovascular imaging, arterial hypertension management, and preventative cardiac care.',
      affiliationMode: 'clinic' as const,
      selectedClinicId: 'clinic-002',
      selectedClinicName: 'Apex Heart Institute & Cardiology Center',
      proposedSplit: '70/20/10',
      assignedRoom: 'Exam Room 204 - Echo Suite',
      sessionalSchedule: 'Mon, Wed, Fri (08:30 - 13:00)',
      isLicenseUploaded: true,
      isIdUploaded: true,
      supportingDocUploaded: true,
    },
    {
      fullName: 'Dr. Hana Tesfaye, MD',
      email: 'dr.hana.tesfaye@stgabriel.et',
      phone: '+251 91 245 7710',
      country: 'Ethiopia',
      city: 'Addis Ababa',
      specialty: 'Internal Medicine',
      subSpecialty: 'Adult Health & Chronic Disease',
      licenseNumber: 'ETH-MED-84920',
      licensingCountry: 'Ethiopia (MOH Directorate)',
      experienceYears: '12',
      languages: 'English, Amharic',
      bio: 'Consultant physician focusing on diagnostic internal medicine, cardiometabolic risk reduction, hypertension, and patient-centered chronic disease therapy.',
      affiliationMode: 'clinic' as const,
      selectedClinicId: 'clinic-001',
      selectedClinicName: 'St. Gabriel Medical & Diagnostic Clinic',
      proposedSplit: '70/20/10',
      assignedRoom: 'Suite 102 - Internal Medicine',
      sessionalSchedule: 'Tue, Thu, Sat (09:00 - 14:00)',
      isLicenseUploaded: true,
      isIdUploaded: true,
      supportingDocUploaded: true,
    },
  ];

  // Fill with Demo Data button handler
  const handleFillDemoData = () => {
    // Choose demo profile matching current state or toggle
    const profile = formData.fullName.includes('Hana') ? demoProfiles[0] : demoProfiles[1];
    setFormData((prev) => ({
      ...prev,
      ...profile,
    }));

    setDemoBannerMessage(`Populated form with verified sample credentials for ${profile.fullName}`);
    setTimeout(() => setDemoBannerMessage(null), 4000);
  };

  const handleNext = () => {
    // Basic validation
    if (activeStepIndex === 0 && !formData.fullName) {
      setFormData((prev) => ({
        ...prev,
        fullName: 'Dr. Michael Chen, MD',
        email: 'm.chen@apexheart.et',
        phone: '+251 91 145 6789',
      }));
    }

    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      // Completed - register doctor in ClinicOperationsContext
      const generatedId = `DOC-${Math.floor(100 + Math.random() * 900)}`;
      setCreatedDoctorId(generatedId);

      addOnboardedDoctor({
        id: generatedId,
        name: formData.fullName || 'Dr. Michael Chen, MD',
        specialty: formData.specialty || 'Cardiology',
        subSpecialty: formData.subSpecialty || 'Cardiovascular Care',
        licenseNumber: formData.licenseNumber || 'MD-LIC-2024-8841',
        affiliationModel: formData.affiliationMode === 'clinic' ? 'Sessional (70/30)' : 'Independent',
        clinicSplit: formData.affiliationMode === 'clinic' ? 70 : 0,
        doctorSplit: formData.affiliationMode === 'clinic' ? 20 : 90,
        platformSplit: 10,
        assignedSuite: formData.assignedRoom,
        phone: formData.phone || '+251 91 145 6789',
        email: formData.email || 'doctor@contingenthealth.org',
        bio: formData.bio || 'Consultant Physician onboarded via Contingent Health',
      });

      setIsCompleted(true);
      addAuditLog(
        `Completed Unified 5-Stage Onboarding Flow for ${formData.fullName}`,
        'DoctorOnboarding',
        'ONBOARD-UNIFIED',
        'In Progress',
        'Completed & Live'
      );
    }
  };

  const handleBack = () => {
    if (activeStepIndex > 0) setActiveStepIndex(activeStepIndex - 1);
  };

  // Filtered clinic directory
  const filteredClinics = CLINIC_DIRECTORY.filter((clinic) => {
    const q = clinicSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      clinic.name.toLowerCase().includes(q) ||
      clinic.location.toLowerCase().includes(q) ||
      clinic.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8e8e8e]">
            Clinic Onboarding &amp; Physician Integration
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0e162b] mt-1">
            Doctor Onboarding &amp; Affiliation
          </h1>
          <p className="text-xs sm:text-sm text-[#606060] mt-0.5">
            Continuous 5-stage setup: account creation, license verification, clinic affiliation, and suite allocation
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] bg-white text-[#0e162b] rounded-full text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <span>Jump to platform</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#8e8e8e]" />
        </button>
      </div>

      {/* Demo Data Feedback Banner */}
      {demoBannerMessage && (
        <div className="p-3 bg-[#00c0fe]/10 border border-[#00c0fe]/30 rounded-xl text-xs text-[#008fbf] font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00c0fe] shrink-0" />
            <span>{demoBannerMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setDemoBannerMessage(null)}
            className="text-[11px] underline text-[#008fbf] hover:text-[#0e162b]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Progress Stepper Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {steps.map((step, idx) => {
          const isDone = idx < activeStepIndex || isCompleted;
          const isCurrent = idx === activeStepIndex && !isCompleted;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStepIndex(idx)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                isCurrent
                  ? 'bg-[#0e162b] text-white shadow-xs'
                  : isDone
                  ? 'bg-[#84ebb4]/25 text-[#1fc16b]'
                  : 'bg-[#f0f2f5] text-[#606060] hover:text-[#0e162b]'
              }`}
            >
              <span>{step.title}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </div>

      {/* Unified Form Body */}
      <div className="border border-[#e8e8e8] rounded-2xl bg-white p-6 sm:p-8 shadow-2xs">
        {isCompleted ? (
          <div className="py-8 text-center space-y-5 max-w-md mx-auto">
            <div className="w-14 h-14 bg-[#84ebb4]/25 text-[#1fc16b] border border-[#1fc16b]/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0e162b]">Doctor Onboarding Complete</h2>
              <p className="text-xs text-[#8e8e8e] mt-1 leading-relaxed">
                Credentials verified, affiliation ratified with {formData.selectedClinicName}, and consultation suite allocated. The physician is now active in the platform roster.
              </p>
            </div>

            <div className="p-4 bg-[#f0f2f5] rounded-xl text-xs text-left space-y-1.5 text-[#606060]">
              <div>Physician: <strong className="text-[#0e162b]">{formData.fullName}</strong></div>
              <div>License: <code className="font-mono text-[#0e162b]">{formData.licenseNumber}</code></div>
              <div>Affiliation Mode: <strong className="text-[#0e162b]">{formData.affiliationMode === 'clinic' ? 'Clinic Affiliated' : 'Independent Practice'}</strong></div>
              <div>Assigned Clinic: <strong className="text-[#0e162b]">{formData.selectedClinicName}</strong> ({formData.proposedSplit} Split)</div>
              <div>Allocated Room: <strong className="text-[#0e162b]">{formData.assignedRoom}</strong></div>
              <div>Doctor Record ID: <code className="font-mono text-[#00c0fe]">{createdDoctorId || 'DOC-882'}</code></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('doctors')}
                className="flex-1 py-3 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs shadow-xs transition-colors"
              >
                View in Doctor Roster
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="flex-1 py-3 border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full font-semibold text-xs transition-colors"
              >
                Launch Platform
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Create Account */}
            {activeStepIndex === 0 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#0e162b]">1. Account Identity &amp; Contact</h3>
                  <p className="text-[#8e8e8e] text-xs">
                    Basic physician contact info, national jurisdiction, and authentication credentials
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="font-medium text-[#0e162b] block mb-1.5">Full Legal Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      placeholder="e.g. Dr. Michael Chen, MD"
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#0e162b] block mb-1.5">Professional Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      placeholder="dr.name@clinic.et"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#0e162b] block mb-1.5">Phone Number *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      placeholder="+251 91 145 6789"
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#0e162b] block mb-1.5">Country / Jurisdiction *</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Profile */}
            {activeStepIndex === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#0e162b]">2. Professional Medical Profile</h3>
                  <p className="text-[#8e8e8e] text-xs">
                    Specialty, licensing credentials, experience, and clinical practice background
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="font-medium text-[#0e162b] block mb-1.5">Primary Medical Specialty *</label>
                    <input
                      type="text"
                      value={formData.specialty}
                      placeholder="e.g. Cardiology, Internal Medicine, Pediatrics"
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#0e162b] block mb-1.5">Sub-Specialty (Optional)</label>
                    <input
                      type="text"
                      value={formData.subSpecialty}
                      placeholder="e.g. Non-Invasive Echocardiography"
                      onChange={(e) => setFormData({ ...formData, subSpecialty: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#0e162b] block mb-1.5">License / Registration Number *</label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      placeholder="e.g. MD-ET-2018-8841"
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#0e162b] block mb-1.5">Years of Clinical Experience *</label>
                    <input
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-medium text-[#0e162b] block mb-1.5">Languages Spoken</label>
                    <input
                      type="text"
                      value={formData.languages}
                      placeholder="e.g. English, Amharic, Oromo"
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-medium text-[#0e162b] block mb-1.5">Short Professional Bio</label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      placeholder="Briefly describe clinical focus, certifications, and hospital affiliations..."
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-transparent focus:border-[#0e162b] focus:bg-white rounded-xl text-xs text-[#0e162b] focus:outline-none resize-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Affiliation Options */}
            {activeStepIndex === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#0e162b]">3. Clinic Affiliation &amp; Partnership Model</h3>
                  <p className="text-[#8e8e8e] text-xs">
                    Choose between affiliating with an accredited medical clinic or continuing independent virtual practice
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div
                    onClick={() => setFormData({ ...formData, affiliationMode: 'clinic' })}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      formData.affiliationMode === 'clinic'
                        ? 'bg-[#00c0fe]/5 border-[#00c0fe] ring-2 ring-[#00c0fe]/30'
                        : 'bg-white border-[#e8e8e8] hover:border-[#0e162b]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-[#0e162b] text-sm">
                      <Building2 className="w-4 h-4 text-[#00c0fe]" />
                      <span>Affiliate with a Partner Clinic</span>
                    </div>
                    <p className="text-xs text-[#606060] mt-1.5 leading-relaxed">
                      Practice at registered clinics, utilize consultation rooms, diagnostic labs, and nursing care teams with automated escrow settlement.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, affiliationMode: 'independent' })}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      formData.affiliationMode === 'independent'
                        ? 'bg-[#00c0fe]/5 border-[#00c0fe] ring-2 ring-[#00c0fe]/30'
                        : 'bg-white border-[#e8e8e8] hover:border-[#0e162b]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-[#0e162b] text-sm">
                      <User className="w-4 h-4 text-[#00c0fe]" />
                      <span>Continue Independently</span>
                    </div>
                    <p className="text-xs text-[#606060] mt-1.5 leading-relaxed">
                      Deliver private virtual consultations and direct telehealth without physical clinic contracts. Additional clinic affiliations can be requested anytime.
                    </p>
                  </div>
                </div>

                {formData.affiliationMode === 'clinic' && (
                  <div className="p-4 bg-[#f0f2f5] rounded-2xl space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0e162b]">Search &amp; Select Clinic Facility</span>
                      <span className="text-[11px] text-[#8e8e8e]">Selected: {formData.selectedClinicName}</span>
                    </div>

                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8e8e8e]" />
                      <input
                        type="text"
                        value={clinicSearchQuery}
                        onChange={(e) => setClinicSearchQuery(e.target.value)}
                        placeholder="Search accredited clinics by name or location..."
                        className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e8e8] rounded-xl text-xs text-[#0e162b] outline-none"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filteredClinics.slice(0, 4).map((clinic) => {
                        const isSelected = formData.selectedClinicId === clinic.id;
                        return (
                          <div
                            key={clinic.id}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                selectedClinicId: clinic.id,
                                selectedClinicName: clinic.name,
                              })
                            }
                            className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-white border-[#00c0fe] ring-1 ring-[#00c0fe]'
                                : 'bg-white border-[#e8e8e8] hover:border-[#8e8e8e]'
                            }`}
                          >
                            <div>
                              <span className="font-bold text-[#0e162b] block">{clinic.name}</span>
                              <span className="text-[11px] text-[#8e8e8e]">
                                {clinic.location} · {clinic.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isSelected ? (
                                <span className="px-2 py-0.5 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] text-[10px] font-bold">
                                  Selected ✓
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#00c0fe] font-medium hover:underline">
                                  Select
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Verification Documents */}
            {activeStepIndex === 3 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#0e162b]">4. Regulatory Verification Documents</h3>
                  <p className="text-[#8e8e8e] text-xs">
                    Upload official medical practice credentials and government-issued identity documents
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#f0f2f5] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0e162b]">Medical Practice License *</span>
                      <span className="text-[#1fc16b] font-medium text-[11px]">Ready</span>
                    </div>
                    <div className="p-3 bg-white border border-[#e8e8e8] rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-[#00c0fe]" />
                        <span className="font-mono text-[#0e162b]">
                          {formData.licenseNumber ? `${formData.licenseNumber}_verified.pdf` : 'license_scan.pdf'}
                        </span>
                      </div>
                      <span className="text-[#1fc16b] font-semibold text-xs">Validated ✓</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#f0f2f5] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0e162b]">Government National ID / Passport *</span>
                      <span className="text-[#1fc16b] font-medium text-[11px]">Ready</span>
                    </div>
                    <div className="p-3 bg-white border border-[#e8e8e8] rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#1fc16b]" />
                        <span className="font-mono text-[#0e162b]">passport_id_verified.pdf</span>
                      </div>
                      <span className="text-[#1fc16b] font-semibold text-xs">Verified ✓</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#84ebb4]/25 border border-[#1fc16b]/20 rounded-xl text-[#1fc16b] flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>
                    Cryptographically authenticated via Ethiopian Health Professionals Licensing Directorate.
                  </span>
                </div>
              </div>
            )}

            {/* Step 5: Contract & Operational Setup */}
            {activeStepIndex === 4 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#0e162b]">5. Contract Terms &amp; Suite Allocation</h3>
                  <p className="text-[#8e8e8e] text-xs">
                    Confirm contractual terms, revenue split formula, and physical practice room
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-[#f0f2f5] rounded-xl">
                    <span className="text-xs text-[#8e8e8e] block">Revenue Split</span>
                    <span className="font-bold text-[#0e162b] text-sm mt-0.5 block">
                      70% Clinic / 20% Doctor / 10% Plat.
                    </span>
                  </div>

                  <div className="p-4 bg-[#f0f2f5] rounded-xl">
                    <span className="text-xs text-[#8e8e8e] block">Assigned Suite</span>
                    <span className="font-bold text-[#0e162b] text-sm mt-0.5 block">
                      {formData.assignedRoom}
                    </span>
                  </div>

                  <div className="p-4 bg-[#f0f2f5] rounded-xl">
                    <span className="text-xs text-[#8e8e8e] block">Sessional Schedule</span>
                    <span className="font-bold text-[#0e162b] text-sm mt-0.5 block">
                      {formData.sessionalSchedule}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#f0f2f5] rounded-xl space-y-1">
                  <span className="font-semibold text-[#0e162b] block">Master Affiliation Agreement (CON-2024-884)</span>
                  <p className="text-xs text-[#8e8e8e]">
                    By proceeding, both parties ratify digital execution under Contingent Health protocol with automatic escrow settlement.
                  </p>
                </div>
              </div>
            )}

            {/* Form Footer Controls */}
            <div className="pt-6 border-t border-[#e8e8e8] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={handleBack}
                className="inline-flex items-center gap-1 px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full font-medium text-xs disabled:opacity-30 disabled:hover:border-[#e8e8e8] transition-colors self-start sm:self-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {/* Clearly Identifiable "Fill with Demo Data" Button Beside Submit Button */}
                <button
                  type="button"
                  onClick={handleFillDemoData}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#00c0fe] bg-[#00c0fe]/10 hover:bg-[#00c0fe]/20 text-[#008fbf] font-semibold text-xs transition-all shadow-2xs"
                  title="Populate form with verified sample physician credentials"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00c0fe]" />
                  <span>Fill with Demo Data</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs transition-colors shadow-xs"
                >
                  <span>{activeStepIndex === steps.length - 1 ? 'Complete & Affiliate Doctor' : 'Next step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
