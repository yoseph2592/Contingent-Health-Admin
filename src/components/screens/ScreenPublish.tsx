import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Users,
  Stethoscope,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Check,
} from 'lucide-react';

export const ScreenPublish: React.FC = () => {
  const {
    clinicInfo,
    brandTheme,
    location,
    verification,
    affiliations,
    services,
    operatingHours,
    isPublished,
    setIsPublished,
    setCurrentStep,
  } = useClinic();

  const [publishSuccessModal, setPublishSuccessModal] = useState(false);

  // Validation Rules Check
  const hasInfo = Boolean(clinicInfo.name && clinicInfo.category && clinicInfo.phone);
  const hasBranding = Boolean(brandTheme.url && brandTheme.palette.primary);
  const hasLocation = Boolean(location.city && location.address);
  const isVerificationApproved = verification.status === 'approved';
  const affiliatedDocsCount = affiliations.filter((a) => a.status === 'accepted').length;
  const hasAffiliatedDocs = affiliatedDocsCount > 0;
  const hasServices = services.length > 0;
  const allServicesHaveDocs =
    services.length > 0 && services.every((s) => s.associatedDoctorIds.length > 0);
  const hasOperatingHours = operatingHours.some((h) => h.isOpen);

  const checklistItems = [
    {
      id: 'info',
      label: 'Clinic information completed',
      passed: hasInfo,
      meta: clinicInfo.name,
    },
    {
      id: 'branding',
      label: 'Logo and accessible brand palette applied',
      passed: hasBranding,
      meta: `Brand color ${brandTheme.palette.primary}`,
    },
    {
      id: 'location',
      label: 'Physical location & map coordinates pinned',
      passed: hasLocation,
      meta: `${location.city}, ${location.address}`,
    },
    {
      id: 'verification',
      label: 'Contingent platform organizational verification approved',
      passed: isVerificationApproved,
      meta: isVerificationApproved ? 'Status: Approved' : `Status: ${verification.status}`,
    },
    {
      id: 'doctors',
      label: 'Contingent verified doctors affiliated',
      passed: hasAffiliatedDocs,
      meta: `${affiliatedDocsCount} accepted doctors`,
    },
    {
      id: 'services',
      label: 'Healthcare services created',
      passed: hasServices,
      meta: `${services.length} services configured`,
    },
    {
      id: 'assigned',
      label: 'Doctors assigned to every active service',
      passed: allServicesHaveDocs,
      meta: allServicesHaveDocs ? 'All services have providers' : 'Warning: Unassigned services',
    },
    {
      id: 'hours',
      label: 'Clinic operating hours & break schedule defined',
      passed: hasOperatingHours,
      meta: 'Weekly schedule active',
    },
  ];

  const canPublish =
    hasInfo &&
    hasBranding &&
    hasLocation &&
    isVerificationApproved &&
    hasAffiliatedDocs &&
    hasServices &&
    allServicesHaveDocs;

  const handlePublish = () => {
    setIsPublished(true);
    setPublishSuccessModal(true);
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10">
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pre-Flight Readiness Review</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your clinic is ready to publish
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Review the final compliance checklist before making your clinic profile, verified doctors, and services discoverable to patients.
          </p>
        </div>

        {/* Readiness Checklist */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden mb-8">
          {checklistItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex items-center justify-between gap-3 ${
                item.passed ? 'bg-white' : 'bg-red-50/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    item.passed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.passed ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.label}</p>
                  <p className="text-[11px] text-slate-500">{item.meta}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  item.passed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {item.passed ? 'Ready' : 'Incomplete'}
              </span>
            </div>
          ))}
        </div>

        {/* Publish Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentStep('services')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Back to Services
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCurrentStep('setup')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Save as Draft
            </button>

            <button
              id="publish-clinic-final-btn"
              type="button"
              onClick={handlePublish}
              disabled={!canPublish}
              className={`w-full sm:w-auto px-7 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-1.5 ${
                canPublish
                  ? 'text-white hover:opacity-90 active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              style={
                canPublish
                  ? {
                      backgroundColor: brandTheme.palette.primary,
                      color: brandTheme.palette.primaryContrast,
                    }
                  : {}
              }
            >
              <span>Publish Clinic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Publish Confirmation (Section 37) */}
      {publishSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div
              className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-md"
              style={{
                backgroundColor: brandTheme.palette.lightTint,
                color: brandTheme.palette.primary,
              }}
            >
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                Contingent Platform Live
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Your clinic is now live
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Patients can now discover {clinicInfo.name}, view your available services,
                and book appointments with your affiliated verified physicians.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Public Listing URL:</span>
                <span className="font-bold text-slate-900">
                  contingent.health/clinics/{clinicInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Affiliated Doctors:</span>
                <span className="font-bold text-slate-900">{affiliatedDocsCount} Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bookable Services:</span>
                <span className="font-bold text-slate-900">{services.length} Services</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPublishSuccessModal(false);
                  setCurrentStep('preview');
                }}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-90 flex items-center justify-center space-x-1.5"
                style={{
                  backgroundColor: brandTheme.palette.primary,
                  color: brandTheme.palette.primaryContrast,
                }}
              >
                <span>View Public Listing</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setPublishSuccessModal(false);
                  setCurrentStep('setup');
                }}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
              >
                Go to Clinic Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
