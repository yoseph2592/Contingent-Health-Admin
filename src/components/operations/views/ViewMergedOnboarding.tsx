import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Building2,
  FileCheck,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const ViewMergedOnboarding: React.FC = () => {
  const { setActiveTab, addAuditLog } = useClinicOperations();

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = [
    { id: 'account', title: '1. Account', desc: 'Identity & credentials' },
    { id: 'profile', title: '2. Profile', desc: 'Specialty & license' },
    { id: 'affiliation', title: '3. Affiliation', desc: 'Clinic or independent' },
    { id: 'verification', title: '4. Documents', desc: 'Board validation' },
    { id: 'contract', title: '5. Setup', desc: 'Revenue split & suite' },
  ];

  const [formData, setFormData] = useState({
    fullName: 'Dr. Michael Chen, MD',
    email: 'm.chen@apexheart.et',
    phone: '+251 91 145 6789',
    country: 'Ethiopia',
    specialty: 'Cardiovascular Diseases',
    subSpecialty: 'Interventional Echocardiography',
    licenseNumber: 'MD-ET-2018-8841',
    licensingCountry: 'Ethiopia',
    experienceYears: '12',
    languages: 'English, Amharic',
    bio: 'Senior Consultant Cardiologist specializing in comprehensive cardiovascular diagnostic imaging and hypertensive cardiomyopathy management.',
    affiliationMode: 'clinic' as 'clinic' | 'independent',
    selectedClinicId: 'CLN-001',
    selectedClinicName: 'Bethzatha Comprehensive Medical Center',
    proposedSplit: '70/30',
    assignedRoom: 'Exam Room 102 - Cardiology Suite',
    sessionalSchedule: 'Mon, Wed, Fri (08:00 - 12:00)',
    isLicenseUploaded: true,
    isIdUploaded: true,
  });

  const [isCompleted, setIsCompleted] = useState(false);

  const handleNext = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Unified Registration
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Doctor Onboarding & Affiliation
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Continuous 5-stage setup: account creation, license verification, clinic affiliation, and suite allocation
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#DDDDDD] hover:border-[#222222] bg-white text-[#222222] rounded-full text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <span>Jump to platform</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#717171]" />
        </button>
      </div>

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
                  ? 'bg-[#222222] text-white'
                  : isDone
                  ? 'bg-[#E8F8EE] text-[#008A05]'
                  : 'bg-[#F7F7F7] text-[#717171] hover:text-[#222222]'
              }`}
            >
              <span>{step.title}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </div>

      {/* Unified Form Body */}
      <div className="border border-[#EBEBEB] rounded-2xl bg-white p-8">
        {isCompleted ? (
          <div className="py-8 text-center space-y-5 max-w-md mx-auto">
            <div className="w-14 h-14 bg-[#E8F8EE] text-[#008A05] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#222222]">Onboarding Complete</h2>
              <p className="text-xs text-[#717171] mt-1 leading-relaxed">
                Credentials verified, clinic affiliation ratified at Bethzatha Clinic, and consultation suite 102 allocated.
              </p>
            </div>

            <div className="p-4 bg-[#F7F7F7] rounded-xl text-xs text-left space-y-1.5 text-[#717171]">
              <div>Physician: <strong className="text-[#222222]">{formData.fullName}</strong></div>
              <div>License: <code className="font-mono text-[#222222]">{formData.licenseNumber}</code></div>
              <div>Affiliation: <strong className="text-[#222222]">{formData.selectedClinicName}</strong> (70/30 Split)</div>
              <div>Exam Room: <strong className="text-[#222222]">{formData.assignedRoom}</strong></div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="w-full py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full font-semibold text-xs shadow-xs transition-colors"
            >
              Launch Clinic Operations Platform
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Create Account */}
            {activeStepIndex === 0 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#222222]">Account Identity</h3>
                  <p className="text-[#717171] text-xs">
                    Basic physician contact info and platform credentials
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="font-medium text-[#222222] block mb-1.5">Full Legal Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#222222] block mb-1.5">Professional Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#222222] block mb-1.5">Phone Number *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#222222] block mb-1.5">Country / Jurisdiction *</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Profile */}
            {activeStepIndex === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#222222]">Professional Medical Profile</h3>
                  <p className="text-[#717171] text-xs">
                    Specialty, licensing credentials, and clinical practice background
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="font-medium text-[#222222] block mb-1.5">Primary Medical Specialty *</label>
                    <input
                      type="text"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#222222] block mb-1.5">Sub-Specialty (Optional)</label>
                    <input
                      type="text"
                      value={formData.subSpecialty}
                      onChange={(e) => setFormData({ ...formData, subSpecialty: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#222222] block mb-1.5">License Number *</label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl font-mono text-xs text-[#222222] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#222222] block mb-1.5">Years of Clinical Experience *</label>
                    <input
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-medium text-[#222222] block mb-1.5">Languages Spoken</label>
                    <input
                      type="text"
                      value={formData.languages}
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-medium text-[#222222] block mb-1.5">Short Professional Bio</label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none resize-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Affiliation */}
            {activeStepIndex === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#222222]">Clinic Affiliation</h3>
                  <p className="text-[#717171] text-xs">
                    Choose between affiliating with an accredited medical clinic or continuing independently
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div
                    onClick={() => setFormData({ ...formData, affiliationMode: 'clinic' })}
                    className={`p-5 rounded-2xl border cursor-pointer transition-colors ${
                      formData.affiliationMode === 'clinic'
                        ? 'bg-[#FAFAFA] border-[#222222] ring-1 ring-[#222222]'
                        : 'bg-white border-[#EBEBEB] hover:border-[#DDDDDD]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-[#222222] text-sm">
                      <Building2 className="w-4 h-4 text-[#FF385C]" />
                      <span>Affiliate with a Clinic</span>
                    </div>
                    <p className="text-xs text-[#717171] mt-1.5 leading-relaxed">
                      Practice at registered clinics, utilize consultation rooms, diagnostic suites, and shared nursing care teams.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, affiliationMode: 'independent' })}
                    className={`p-5 rounded-2xl border cursor-pointer transition-colors ${
                      formData.affiliationMode === 'independent'
                        ? 'bg-[#FAFAFA] border-[#222222] ring-1 ring-[#222222]'
                        : 'bg-white border-[#EBEBEB] hover:border-[#DDDDDD]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-[#222222] text-sm">
                      <User className="w-4 h-4 text-[#FF385C]" />
                      <span>Continue Independently</span>
                    </div>
                    <p className="text-xs text-[#717171] mt-1.5 leading-relaxed">
                      Deliver virtual care and private appointments without a physical clinic contract. Affiliations can be added later.
                    </p>
                  </div>
                </div>

                {formData.affiliationMode === 'clinic' && (
                  <div className="p-4 bg-[#F7F7F7] rounded-xl space-y-2 mt-3">
                    <span className="text-xs font-semibold text-[#222222] block">Selected Healthcare Facility</span>
                    <div className="p-3 bg-white rounded-lg border border-[#EBEBEB] flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-[#222222] block">{formData.selectedClinicName}</span>
                        <span className="text-xs text-[#717171]">
                          Bole Sub-City, Addis Ababa · Registration: REG-ETH-89210
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8EE] text-[#008A05] text-xs font-medium">
                        Accredited Tier A
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Verification */}
            {activeStepIndex === 3 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#222222]">Credential Verification</h3>
                  <p className="text-[#717171] text-xs">
                    Certified copies of medical board licenses and government identity documents
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#F7F7F7] rounded-xl space-y-2">
                    <span className="font-semibold text-[#222222] block">Medical Practicing License</span>
                    <div className="p-3 bg-white rounded-lg border border-[#EBEBEB] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-[#008A05]" />
                        <span className="font-mono text-[#222222]">license_dr_chen_md.pdf</span>
                      </div>
                      <span className="text-[#008A05] font-medium text-xs">Verified ✓</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#F7F7F7] rounded-xl space-y-2">
                    <span className="font-semibold text-[#222222] block">National Identity / Passport</span>
                    <div className="p-3 bg-white rounded-lg border border-[#EBEBEB] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#008A05]" />
                        <span className="font-mono text-[#222222]">passport_id_verified.pdf</span>
                      </div>
                      <span className="text-[#008A05] font-medium text-xs">Verified ✓</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#E8F8EE] rounded-xl text-[#008A05] flex items-center gap-2 font-medium">
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
                  <h3 className="text-sm font-semibold text-[#222222]">Contract Terms & Suite Assignment</h3>
                  <p className="text-[#717171] text-xs">
                    Confirm contractual terms, revenue split formula, and physical practice room
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-[#F7F7F7] rounded-xl">
                    <span className="text-xs text-[#717171] block">Revenue Split</span>
                    <span className="font-semibold text-[#222222] text-sm mt-0.5 block">
                      70% Clinic / 20% Doctor / 10% Plat.
                    </span>
                  </div>

                  <div className="p-4 bg-[#F7F7F7] rounded-xl">
                    <span className="text-xs text-[#717171] block">Assigned Suite</span>
                    <span className="font-semibold text-[#222222] text-sm mt-0.5 block">{formData.assignedRoom}</span>
                  </div>

                  <div className="p-4 bg-[#F7F7F7] rounded-xl">
                    <span className="text-xs text-[#717171] block">Sessional Schedule</span>
                    <span className="font-semibold text-[#222222] text-sm mt-0.5 block">
                      {formData.sessionalSchedule}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#F7F7F7] rounded-xl space-y-1">
                  <span className="font-semibold text-[#222222] block">Master Affiliation Agreement (CON-2024-884)</span>
                  <p className="text-xs text-[#717171]">
                    By proceeding, both parties ratify digital execution under Contingent Health protocol with automatic escrow settlement.
                  </p>
                </div>
              </div>
            )}

            {/* Form Footer Controls */}
            <div className="pt-6 border-t border-[#EBEBEB] flex items-center justify-between">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={handleBack}
                className="inline-flex items-center gap-1 px-4 py-2 border border-[#DDDDDD] hover:border-[#222222] text-[#222222] rounded-full font-medium text-xs disabled:opacity-30 disabled:hover:border-[#DDDDDD] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full font-semibold text-xs transition-colors shadow-xs"
              >
                <span>{activeStepIndex === steps.length - 1 ? 'Complete & launch' : 'Next step'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
