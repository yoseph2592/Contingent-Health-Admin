import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Building2,
  Users,
  Stethoscope,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  Layers,
} from 'lucide-react';

export const ScreenClinicSetup: React.FC = () => {
  const {
    clinicInfo,
    brandTheme,
    affiliations,
    services,
    verification,
    setCurrentStep,
    isPublished,
  } = useClinic();

  const affiliatedDoctorsCount = affiliations.filter((a) => a.status === 'accepted').length;
  const pendingDoctorsCount = affiliations.filter((a) => a.status === 'pending').length;
  const activeServicesCount = services.filter((s) => s.status === 'active').length;

  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Clinic Header Banner adapted to brand theme */}
      <div
        className="rounded-2xl border p-6 sm:p-8 text-white relative overflow-hidden shadow-xs"
        style={{
          backgroundColor: brandTheme.palette.primary,
          borderColor: brandTheme.palette.primaryHover,
        }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 shrink-0 shadow-md flex items-center justify-center">
              <img
                src={brandTheme.url}
                alt="Clinic Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {clinicInfo.name}
                </h1>
                {verification.status === 'approved' && (
                  <span className="bg-emerald-500/20 text-emerald-100 border border-emerald-400/40 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <p className="text-sm opacity-90 mt-1 max-w-xl">
                {clinicInfo.shortDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setCurrentStep('preview')}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white text-slate-900 shadow-md hover:bg-slate-50 transition-all flex items-center space-x-1.5"
            >
              <span>View Public Listing</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Headline & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Set up your clinic
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Configure your organizational profile, affiliate verified medical professionals, and build bookable services.
          </p>
        </div>

        <button
          onClick={() => setCurrentStep('publish')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition-all hover:opacity-95"
          style={{
            backgroundColor: brandTheme.palette.primary,
            color: brandTheme.palette.primaryContrast,
          }}
        >
          <span>Publish Clinic Checklist</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Three Primary Setup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Clinic Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-lg font-bold text-slate-900">1. Clinic Profile</h3>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Complete your public clinic information, category, logo branding, and location.
            </p>

            <div className="space-y-2 py-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Branding Theme</span>
                <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: brandTheme.palette.primary }}
                  />
                  <span>Active</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Verification</span>
                <span className="font-semibold text-emerald-600 capitalize">
                  {verification.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep('info')}
            className="mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Edit Profile & Hours</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Doctors */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{
                backgroundColor: brandTheme.palette.lightTint,
                color: brandTheme.palette.primary,
              }}
            >
              <Users className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-lg font-bold text-slate-900">2. Doctors</h3>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: brandTheme.palette.lightTint,
                  color: brandTheme.palette.primary,
                }}
              >
                {affiliatedDoctorsCount} Affiliated
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Search and add Contingent verified doctors to your clinic organization.
            </p>

            <div className="space-y-2 py-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Active Affiliated</span>
                <span className="font-semibold text-slate-900">{affiliatedDoctorsCount} Doctors</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Pending Requests</span>
                <span className="font-semibold text-amber-600">{pendingDoctorsCount} Pending</span>
              </div>
            </div>
          </div>

          <button
            id="manage-doctors-btn"
            onClick={() => setCurrentStep('doctors')}
            className="mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 flex items-center justify-center space-x-1.5"
            style={{
              backgroundColor: brandTheme.palette.primary,
              color: brandTheme.palette.primaryContrast,
            }}
          >
            <span>Manage Doctors</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Services */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-lg font-bold text-slate-900">3. Services</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {activeServicesCount} Created
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Create clinic services, configure pricing/duration, and assign affiliated doctors.
            </p>

            <div className="space-y-2 py-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Active Services</span>
                <span className="font-semibold text-slate-900">{activeServicesCount} Bookable</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Doctor Assignment</span>
                <span className="font-semibold text-emerald-600">Configured</span>
              </div>
            </div>
          </div>

          <button
            id="manage-services-btn"
            onClick={() => setCurrentStep('services')}
            className="mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Manage Services</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
