import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Building2,
  ArrowRight,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  FileText,
  Tag,
} from 'lucide-react';
import { CLINIC_CATEGORIES } from '../../data/mockData';
import { ClinicCategory } from '../../types';

export const ScreenClinicInfo: React.FC = () => {
  const { clinicInfo, setClinicInfo, setCurrentStep, brandTheme } = useClinic();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!clinicInfo.name.trim()) newErrors.name = 'Clinic name is required';
    if (!clinicInfo.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!clinicInfo.phone.trim()) newErrors.phone = 'Clinic contact phone is required';
    if (!clinicInfo.email.trim()) newErrors.email = 'Clinic public contact email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep('location');
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Clinic Profile</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tell us about your clinic
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Provide the organizational details that will be visible to patients and platform doctors.
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          {/* Clinic Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Clinic Name *
            </label>
            <input
              id="clinic-name-input"
              type="text"
              value={clinicInfo.name}
              onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
              placeholder="e.g. St. Gabriel Medical & Diagnostic Clinic"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                errors.name ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300 focus:border-slate-800'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Clinic Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Clinic Category / Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CLINIC_CATEGORIES.map((category) => {
                const isSelected = clinicInfo.category === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setClinicInfo({ ...clinicInfo, category: category as ClinicCategory })}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-2xs font-semibold'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Summary Description *
            </label>
            <input
              id="clinic-short-desc"
              type="text"
              value={clinicInfo.shortDescription}
              onChange={(e) => setClinicInfo({ ...clinicInfo, shortDescription: e.target.value })}
              placeholder="e.g. Modern comprehensive outpatient care, family medicine, and diagnostics."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                errors.shortDescription ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300 focus:border-slate-800'
              }`}
            />
            <p className="text-xs text-slate-400 mt-1">Appears in patient search results and category listings.</p>
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Clinic Description
            </label>
            <textarea
              rows={3}
              value={clinicInfo.fullDescription}
              onChange={(e) => setClinicInfo({ ...clinicInfo, fullDescription: e.target.value })}
              placeholder="Describe your clinic's mission, facilities, medical equipment, and healthcare values..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={clinicInfo.phone}
                  onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                  placeholder="+251 11 661 2450"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={clinicInfo.email}
                  onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
                  placeholder="contact@yourclinic.et"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Website (Optional)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={clinicInfo.website}
                  onChange={(e) => setClinicInfo({ ...clinicInfo, website: e.target.value })}
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep('branding')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Back
            </button>

            <button
              id="clinic-info-continue-btn"
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-xs transition-all hover:opacity-90 active:scale-[0.99]"
              style={{
                backgroundColor: brandTheme.palette.primary,
                color: brandTheme.palette.primaryContrast,
              }}
            >
              <span>Continue to Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
