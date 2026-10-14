import React, { useState } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const COUNTRIES = [
  'Ethiopia',
  'United States',
  'United Kingdom',
  'Kenya',
  'Canada',
  'Germany',
  'Rwanda',
  'South Africa',
  'United Arab Emirates',
  'India',
];

export const ScreenDoctorAccount: React.FC = () => {
  const { account, setAccount, setCurrentStep, prefillSampleDoctor } = useDoctor();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!account.fullName.trim()) errs.fullName = 'Full legal name is required.';
    if (!account.email.trim() || !account.email.includes('@')) {
      errs.email = 'A valid professional email address is required.';
    }
    if (!account.phone.trim()) errs.phone = 'Phone number is required for 2FA.';
    if (account.password && account.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    }
    if (!account.country) errs.country = 'Please select your country of practice.';
    if (!account.city.trim()) errs.city = 'City / location is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setCurrentStep('profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      {/* Intro Header */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium mb-2 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Step 1 of 5 · Medical Practitioner Registration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Create Your Doctor Account
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
          Join the verified Contingent Healthcare Network. Provide your primary identity details to establish your secure practitioner credentials.
        </p>
      </div>

      {/* Main Account Form Card */}
      <form onSubmit={handleContinue} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Full Legal Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={account.fullName}
              onChange={(e) => {
                setAccount({ ...account, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              placeholder="e.g. Dr. Hana Tesfaye or Dr. Michael Chen"
              className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-300 focus:ring-slate-900 focus:border-slate-900'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.fullName}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            Must match your national medical registration certificate or passport.
          </p>
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Professional Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={account.email}
                onChange={(e) => {
                  setAccount({ ...account, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="dr.name@clinic.et or personal@email.com"
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-slate-900'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Mobile Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={account.phone}
                onChange={(e) => {
                  setAccount({ ...account, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="+251 91 123 4567"
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-slate-900'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={account.password || ''}
              onChange={(e) => {
                setAccount({ ...account, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="Create a strong password (min 8 characters)"
              className={`w-full pl-9 pr-10 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-slate-900'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.password}
            </p>
          )}
          <div className="mt-2 flex items-center space-x-3 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className={`w-3.5 h-3.5 ${account.password && account.password.length >= 8 ? 'text-emerald-500' : 'text-slate-300'}`} />
              <span>8+ characters</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className={`w-3.5 h-3.5 ${account.password && /[A-Z]/.test(account.password) ? 'text-emerald-500' : 'text-slate-300'}`} />
              <span>Uppercase letter</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className={`w-3.5 h-3.5 ${account.password && /[0-9]/.test(account.password) ? 'text-emerald-500' : 'text-slate-300'}`} />
              <span>Number</span>
            </span>
          </div>
        </div>

        {/* Country & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Country of Practice <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <select
                value={account.country}
                onChange={(e) => {
                  setAccount({ ...account, country: e.target.value });
                  if (errors.country) setErrors({ ...errors, country: '' });
                }}
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 appearance-none transition-all ${
                  errors.country
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-slate-900'
                }`}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {errors.country && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.country}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              City / Metropolitan Area <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={account.city}
                onChange={(e) => {
                  setAccount({ ...account, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: '' });
                }}
                placeholder="e.g. Addis Ababa, Bole Sub-City"
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.city
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-slate-900'
                }`}
              />
            </div>
            {errors.city && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.city}
              </p>
            )}
          </div>
        </div>

        {/* Trust badge / security note */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start space-x-3 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-900 font-semibold">Contingent Security Protocol:</strong> Your contact credentials are encrypted and protected by healthcare privacy standards. You will use these details to access patient consultations, digital health records, and clinic affiliation invitations.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-200">
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
            <span>Continue to Professional Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
