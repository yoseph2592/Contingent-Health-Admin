import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Building2,
  UserCheck,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react';

export const ScreenAccount: React.FC = () => {
  const { admin, setAdmin, setCurrentStep, brandTheme } = useClinic();
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!admin.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!admin.email.trim() || !admin.email.includes('@')) newErrors.email = 'Valid work email is required';
    if (!admin.phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep('branding');
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10">
        {/* Important Role Distinction Notice mandated by Prompt */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold block text-sm mb-0.5 text-amber-950">
              Clinic Organization Account
            </span>
            This account is registered to manage a <strong>clinic organizational entity</strong>.
            It does <span className="underline">not</span> register you as an individual physician or doctor.
            Individual doctors join through separate platform credentialing and are affiliated later.
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Clinic Administrator Registration</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create clinic administrator account
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Provide the details of the clinic’s primary authorized representative.
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="admin-full-name"
                type="text"
                value={admin.fullName}
                onChange={(e) => setAdmin({ ...admin, fullName: e.target.value })}
                placeholder="e.g. Dr. Yonas Melese or Sara Tadesse"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.fullName ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300 focus:border-slate-800'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Clinic Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="admin-work-email"
                type="email"
                value={admin.email}
                onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                placeholder="admin@yourclinic.et"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.email ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300 focus:border-slate-800'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.email}</span>
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1">Used for official verification notices and doctor requests.</p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="admin-phone"
                type="tel"
                value={admin.phone}
                onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
                placeholder="+251 91 142 8890"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.phone ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300 focus:border-slate-800'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>

          {/* Role (Read-only badge) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Role
            </label>
            <div className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-sm">
              <UserCheck className="w-4 h-4 text-slate-600" />
              <span className="font-semibold">{admin.role}</span>
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep('welcome')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Back
            </button>

            <button
              id="account-continue-btn"
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-xs transition-all hover:opacity-90 active:scale-[0.99]"
              style={{
                backgroundColor: brandTheme.palette.primary,
                color: brandTheme.palette.primaryContrast,
              }}
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
