import React, { useState, useRef } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import {
  Stethoscope,
  Award,
  Calendar,
  Languages,
  FileText,
  Camera,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  AlertCircle,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import {
  MEDICAL_SPECIALTIES,
  POPULAR_LANGUAGES,
  DOCTOR_PHOTO_PRESETS,
} from '../../data/mockData';

export const ScreenDoctorProfile: React.FC = () => {
  const { profile, setProfile, setCurrentStep, prefillSampleDoctor } = useDoctor();
  const [customLanguage, setCustomLanguage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleLanguage = (lang: string) => {
    if (profile.languages.includes(lang)) {
      if (profile.languages.length > 1) {
        setProfile({
          ...profile,
          languages: profile.languages.filter((l) => l !== lang),
        });
      }
    } else {
      setProfile({
        ...profile,
        languages: [...profile.languages, lang],
      });
    }
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLanguage.trim() && !profile.languages.includes(customLanguage.trim())) {
      setProfile({
        ...profile,
        languages: [...profile.languages, customLanguage.trim()],
      });
      setCustomLanguage('');
    }
  };

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile({
            ...profile,
            avatarUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!profile.specialty) errs.specialty = 'Please select your medical specialty.';
    if (!profile.licenseNumber.trim()) errs.licenseNumber = 'Medical license or registration number is required.';
    if (!profile.licensingCountry.trim()) errs.licensingCountry = 'Licensing authority country is required.';
    if (profile.experienceYears < 0) errs.experienceYears = 'Experience cannot be negative.';
    if (!profile.bio.trim()) errs.bio = 'Please provide a short professional bio.';
    if (profile.languages.length === 0) errs.languages = 'Please select at least one language.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setCurrentStep('affiliation');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      {/* Step Header */}
      <div className="mb-6">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium mb-2 border border-emerald-200">
          <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
          <span>Step 2 of 5 · Clinical Credentials</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Professional Medical Profile
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Detail your clinical specialty, licensing identifiers, and background. This information powers patient search and clinic affiliation matchmaking.
        </p>
      </div>

      <form onSubmit={handleContinue} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Photo Selection (Upload or Presets) */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Professional Photo (Optional)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Current Selected Avatar Preview */}
            <div className="relative group shrink-0">
              <img
                src={profile.avatarUrl || DOCTOR_PHOTO_PRESETS[0].url}
                alt="Doctor Portrait"
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-xs bg-slate-200"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Upload custom image"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Presets + Custom Upload Picker */}
            <div className="flex-1 w-full">
              <p className="text-xs text-slate-600 mb-2">
                Select a high-resolution sample avatar or upload your official headshot:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {DOCTOR_PHOTO_PRESETS.map((p) => {
                  const isSelected = profile.avatarUrl === p.url;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, avatarUrl: p.url })}
                      className={`relative w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                        isSelected
                          ? 'border-emerald-600 ring-2 ring-emerald-400 scale-105'
                          : 'border-slate-300 opacity-70 hover:opacity-100 hover:border-slate-400'
                      }`}
                      title={p.label}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  );
                })}

                {/* Upload custom button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCustomPhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs rounded-lg transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload Headshot</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Title & Specialty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Medical Specialty <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Stethoscope className="w-4 h-4" />
              </div>
              <select
                value={profile.specialty}
                onChange={(e) => {
                  setProfile({ ...profile, specialty: e.target.value });
                  if (errors.specialty) setErrors({ ...errors, specialty: '' });
                }}
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 appearance-none transition-all ${
                  errors.specialty
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-slate-900'
                }`}
              >
                <option value="">Select Clinical Specialty...</option>
                {MEDICAL_SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            {errors.specialty && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.specialty}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Sub-Specialty / Clinical Focus <span className="text-slate-400 lowercase font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={profile.subspecialty || ''}
              onChange={(e) => setProfile({ ...profile, subspecialty: e.target.value })}
              placeholder="e.g. Hypertension & Metabolic Health, Neonatology"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* License Number & Licensing Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Medical License / Registration Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Award className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={profile.licenseNumber}
                onChange={(e) => {
                  setProfile({ ...profile, licenseNumber: e.target.value });
                  if (errors.licenseNumber) setErrors({ ...errors, licenseNumber: '' });
                }}
                placeholder="e.g. ETH-MED-84920 or GMC-789012"
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 font-mono transition-all ${
                  errors.licenseNumber
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-slate-900'
                }`}
              />
            </div>
            {errors.licenseNumber && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.licenseNumber}
              </p>
            )}
            <p className="mt-1 text-[11px] text-slate-500">
              Cross-checked against the national medical regulatory registry during verification.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Licensing Country / Authority <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.licensingCountry}
              onChange={(e) => {
                setProfile({ ...profile, licensingCountry: e.target.value });
                if (errors.licensingCountry) setErrors({ ...errors, licensingCountry: '' });
              }}
              placeholder="e.g. Ethiopia (MOH / EFDA), United States (State Board)"
              className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.licensingCountry
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-slate-900'
              }`}
            />
            {errors.licensingCountry && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.licensingCountry}
              </p>
            )}
          </div>
        </div>

        {/* Years of Experience & Education */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Years of Clinical Experience <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={profile.experienceYears}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      experienceYears: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                {profile.experienceYears} {profile.experienceYears === 1 ? 'year' : 'years'} post-residency
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Professional Degree & Title
            </label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              placeholder="e.g. MD, Consultant Physician or MBBS, FRCS"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Languages Multi-Select */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Consultation Languages <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {POPULAR_LANGUAGES.map((lang) => {
              const isSelected = profile.languages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{lang}</span>
                </button>
              );
            })}
          </div>

          {/* Add custom language */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={customLanguage}
              onChange={(e) => setCustomLanguage(e.target.value)}
              placeholder="Add another language..."
              className="max-w-xs px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <button
              type="button"
              onClick={handleAddCustomLanguage}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Short Professional Bio */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Short Professional Bio <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {profile.bio.length}/500 characters
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={500}
            value={profile.bio}
            onChange={(e) => {
              setProfile({ ...profile, bio: e.target.value });
              if (errors.bio) setErrors({ ...errors, bio: '' });
            }}
            placeholder="Briefly describe your clinical focus, patient philosophy, diagnostic interests, and certifications..."
            className={`w-full p-3 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.bio
                ? 'border-red-300 focus:ring-red-500'
                : 'border-slate-300 focus:ring-slate-900'
            }`}
          />
          {errors.bio && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.bio}
            </p>
          )}
        </div>

        {/* Navigation CTAs */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setCurrentStep('account')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Account</span>
          </button>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={prefillSampleDoctor}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg border border-sky-400 bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-xs transition-colors shadow-2xs"
              title="Populate form with verified sample physician credentials"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Fill with Demo Data</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-xs transition-colors"
            >
              <span>Continue to Affiliation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
