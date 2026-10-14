import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { useDoctor } from '../context/DoctorContext';
import {
  Building2,
  ShieldCheck,
  Eye,
  Smartphone,
  Monitor,
  CheckCircle2,
  Palette,
  Sparkles,
  Stethoscope,
  UserCheck,
  FileCheck2,
  ClipboardList,
} from 'lucide-react';
import { OnboardingStep, DoctorOnboardingStep } from '../types';

interface HeaderProps {
  platformMode: 'operations' | 'doctor' | 'clinic';
  setPlatformMode: (mode: 'operations' | 'doctor' | 'clinic') => void;
}

export const Header: React.FC<HeaderProps> = ({ platformMode, setPlatformMode }) => {
  const {
    currentStep: clinicStep,
    setCurrentStep: setClinicStep,
    brandTheme,
    clinicInfo,
    previewDevice,
    setPreviewDevice,
    verification: clinicVerification,
    isPublished,
  } = useClinic();

  const {
    currentStep: doctorStep,
    setCurrentStep: setDoctorStep,
    account: doctorAccount,
    profile: doctorProfile,
    verificationStatus: doctorVerificationStatus,
    isRegistered: isDoctorRegistered,
    prefillSampleDoctor,
  } = useDoctor();

  const clinicStepsList: { id: OnboardingStep; label: string; num: number }[] = [
    { id: 'welcome', label: 'Welcome', num: 1 },
    { id: 'account', label: 'Account', num: 2 },
    { id: 'branding', label: 'Branding', num: 3 },
    { id: 'info', label: 'Info', num: 4 },
    { id: 'location', label: 'Location', num: 5 },
    { id: 'verification', label: 'Verification', num: 6 },
    { id: 'setup', label: 'Setup Hub', num: 7 },
    { id: 'doctors', label: 'Doctors', num: 8 },
    { id: 'services', label: 'Services', num: 9 },
    { id: 'preview', label: 'Listing Preview', num: 10 },
    { id: 'publish', label: 'Publish', num: 11 },
  ];

  const doctorStepsList: { id: DoctorOnboardingStep; label: string; num: number }[] = [
    { id: 'account', label: 'Account', num: 1 },
    { id: 'profile', label: 'Profile', num: 2 },
    { id: 'affiliation', label: 'Affiliation', num: 3 },
    { id: 'verification', label: 'Verification', num: 4 },
    { id: 'review', label: 'Review & Submit', num: 5 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e8e8e8]">
      {/* Top Global Platform Banner with Mode Switcher */}
      <div className="bg-[#0e162b] text-slate-300 text-xs px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-[#213364]/60">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#00c0fe]/20 text-[#54d5ff] border border-[#00c0fe]/30 tracking-wider">
            CONTINGENT HEALTH
          </span>
          <span className="text-[#8da2da] text-xs hidden md:inline">
            clinic Dashboard Operating System
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-[#16223e] p-0.5 rounded-lg border border-[#213364]">
          <button
            type="button"
            onClick={() => setPlatformMode('operations')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              platformMode === 'operations'
                ? 'bg-[#00c0fe] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Clinic Operations (19 Modules)</span>
          </button>

          <button
            type="button"
            onClick={() => setPlatformMode('doctor')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              platformMode === 'doctor'
                ? 'bg-[#00c0fe] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor Sign-Up</span>
          </button>

          <button
            type="button"
            onClick={() => setPlatformMode('clinic')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              platformMode === 'clinic'
                ? 'bg-[#00c0fe] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Clinic Setup</span>
          </button>
        </div>

        {/* Right Status Indicator */}
        <div className="flex items-center space-x-3 text-[11px]">
          {platformMode === 'doctor' ? (
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1fc16b]" />
              <span className="text-slate-300">
                Doctor: {doctorVerificationStatus === 'Verified' ? 'Contingent Verified' : doctorVerificationStatus}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1fc16b]" />
              <span className="text-slate-300 capitalize">
                Clinic: {clinicVerification.status === 'approved' ? 'Verified Org' : clinicVerification.status.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main navigation header (Context-aware based on platformMode) */}
      {platformMode === 'doctor' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDoctorStep('account')}
              className="flex items-center space-x-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-0.5 shadow-xs">
                <img
                  src={doctorProfile.avatarUrl}
                  alt={doctorAccount.fullName}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                    {doctorAccount.fullName || 'Doctor Registration'}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 font-normal">
                  {doctorProfile.specialty} · Sign-Up & Affiliation Hub
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={prefillSampleDoctor}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Fill Sample Doctor</span>
              <span className="sm:hidden">Sample</span>
            </button>

            {isDoctorRegistered && (
              <button
                type="button"
                onClick={() => setDoctorStep('portal')}
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  doctorStep === 'portal'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>Doctor Portal</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setClinicStep('welcome')}
              className="flex items-center space-x-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-0.5 shadow-xs">
                <img
                  src={brandTheme.url}
                  alt="Clinic Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                    {clinicInfo.name || 'Contingent Clinic'}
                  </span>
                  {clinicVerification.status === 'approved' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 font-normal">
                  {clinicInfo.category} · Onboarding Hub
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
                  previewDevice === 'desktop'
                    ? 'bg-white text-slate-900 shadow-xs font-medium'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
                  previewDevice === 'mobile'
                    ? 'bg-white text-slate-900 shadow-xs font-medium'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Mobile Responsive View"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            <button
              onClick={() => setClinicStep('preview')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                clinicStep === 'preview'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Patient View</span>
              <span className="md:hidden">Preview</span>
            </button>
          </div>
        </div>
      )}

      {/* Horizontal Steps Bar */}
      {platformMode === 'doctor' && doctorStep !== 'portal' && (
        <div className="bg-slate-50/80 border-t border-slate-200 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center space-x-1 py-1.5 min-w-max">
            {doctorStepsList.map((step) => {
              const isActive = doctorStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setDoctorStep(step.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step.num}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {platformMode === 'clinic' && (
        <div className="bg-slate-50/80 border-t border-slate-200 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center space-x-1 py-1.5 min-w-max">
            {clinicStepsList.map((step) => {
              const isActive = clinicStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setClinicStep(step.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isActive
                        ? 'text-white font-bold'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: brandTheme.palette.primary }
                        : {}
                    }
                  >
                    {step.num}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

