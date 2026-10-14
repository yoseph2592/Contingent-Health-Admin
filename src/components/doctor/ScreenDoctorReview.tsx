import React, { useState } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import {
  ClipboardList,
  Edit2,
  CheckCircle2,
  Building2,
  User,
  Stethoscope,
  FileCheck2,
  Award,
  Globe,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const ScreenDoctorReview: React.FC = () => {
  const {
    account,
    profile,
    affiliations,
    isOperatingIndependently,
    verificationDocuments,
    verificationStatus,
    consent,
    setConsent,
    setCurrentStep,
    completeRegistration,
    contingentVerificationId,
  } = useDoctor();

  const [consentError, setConsentError] = useState('');

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent.goodStanding || !consent.registryCheck || !consent.termsAccepted) {
      setConsentError('Please confirm all legal and regulatory declarations to complete registration.');
      return;
    }
    completeRegistration();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium mb-2 border border-emerald-200">
          <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
          <span>Step 5 of 5 · Final Verification & Onboarding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Review & Complete Registration
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
          Review your credentials, chosen practice model, and compliance documents before completing your registration on Contingent.
        </p>
      </div>

      <form onSubmit={handleComplete} className="space-y-6">
        {/* Section 1: Account Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">1. Account & Personal Contact</h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep('account')}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Full Name</span>
              <span className="font-semibold text-slate-900">{account.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Professional Email</span>
              <span className="font-semibold text-slate-900 truncate block">{account.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Mobile Phone</span>
              <span className="font-semibold text-slate-900">{account.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Location</span>
              <span className="font-semibold text-slate-900">{account.city}, {account.country}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Professional Medical Profile */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">2. Professional Credentials & Profile</h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep('profile')}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="mt-3.5 flex flex-col sm:flex-row items-start gap-4">
            <img
              src={profile.avatarUrl}
              alt={account.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shrink-0 shadow-xs"
            />
            <div className="flex-1 space-y-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{profile.title || account.fullName}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {profile.specialty}
                </span>
                {profile.subspecialty && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                    {profile.subspecialty}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block mb-0.5">License / Registration</span>
                  <span className="font-mono font-semibold text-slate-900">{profile.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Licensing Authority</span>
                  <span className="font-semibold text-slate-900">{profile.licensingCountry}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Clinical Experience</span>
                  <span className="font-semibold text-slate-900">{profile.experienceYears} Years</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Languages</span>
                <div className="flex flex-wrap gap-1">
                  {profile.languages.map((l) => (
                    <span key={l} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Professional Bio</span>
                <p className="text-slate-700 italic text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  "{profile.bio}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Affiliation & Practice Model */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">3. Affiliation & Practice Model</h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep('affiliation')}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="mt-3.5 space-y-3">
            {/* Independent Practice Badge */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-medium">Independent Practice:</span>
              {isOperatingIndependently ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  <span>Enabled (Independent Virtual & Direct Practice)</span>
                </span>
              ) : (
                <span className="text-slate-500 italic">Not enabled (Clinic-exclusive practice)</span>
              )}
            </div>

            {/* Clinic Affiliations List */}
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                Clinic Partnerships ({affiliations.length}):
              </span>

              {affiliations.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 italic">
                  No clinic affiliations selected. You will practice independently and can affiliate with clinics from your dashboard anytime.
                </div>
              ) : (
                <div className="space-y-2">
                  {affiliations.map((a) => (
                    <div
                      key={a.clinicId}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <img
                          src={a.clinicLogoUrl}
                          alt={a.clinicName}
                          className="w-8 h-8 rounded object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{a.clinicName}</p>
                          <p className="text-[11px] text-slate-500 truncate">
                            Dept: {a.requestedDepartment} · {a.clinicLocation}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {a.status === 'Accepted' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Accepted</span>
                          </span>
                        )}
                        {a.status === 'Pending' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {a.status === 'Declined' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800">
                            <span>Declined</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Verification & Credentials */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">4. Verification Documents & Status</h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep('verification')}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="mt-3.5 space-y-2">
            <div className="flex items-center space-x-2 text-xs mb-2">
              <span className="text-slate-500 font-medium">Contingent Verification ID:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {contingentVerificationId}
              </span>
              <span className="text-slate-400">· Status: {verificationStatus}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {verificationDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-slate-900 truncate">{doc.title}</p>
                    <p className="text-[11px] font-mono text-slate-500 truncate">{doc.fileName} ({doc.fileSize})</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Mandatory Declarations & Consent */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Practitioner Legal Declaration & Consent</span>
          </h2>

          <div className="space-y-2 text-xs text-slate-700">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent.goodStanding}
                onChange={(e) => {
                  setConsent({ ...consent, goodStanding: e.target.checked });
                  setConsentError('');
                }}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 mt-0.5 shrink-0"
              />
              <span>
                <strong>Good Standing Declaration:</strong> I hereby certify that my medical license and specialist certifications are valid, unencumbered, and not subject to disciplinary suspension or sanction in any jurisdiction.
              </span>
            </label>

            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent.registryCheck}
                onChange={(e) => {
                  setConsent({ ...consent, registryCheck: e.target.checked });
                  setConsentError('');
                }}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 mt-0.5 shrink-0"
              />
              <span>
                <strong>Registry Verification Consent:</strong> I authorize Contingent Health and its credentialing committee to verify my qualifications directly with national medical councils and accredited registries.
              </span>
            </label>

            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent.termsAccepted}
                onChange={(e) => {
                  setConsent({ ...consent, termsAccepted: e.target.checked });
                  setConsentError('');
                }}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 mt-0.5 shrink-0"
              />
              <span>
                <strong>Healthcare Practitioner Agreement:</strong> I accept Contingent's Physician Code of Ethics, Telehealth Practice Protocols, and Medical Data Privacy Standards.
              </span>
            </label>
          </div>

          {consentError && (
            <p className="text-xs text-red-600 flex items-center gap-1 pt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{consentError}</span>
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setCurrentStep('verification')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Verification</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-sm hover:shadow transition-all"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Complete Registration & Open Doctor Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
