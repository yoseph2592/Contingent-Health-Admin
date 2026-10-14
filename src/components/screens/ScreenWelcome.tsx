import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Building2,
  ShieldCheck,
  Stethoscope,
  Palette,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const ScreenWelcome: React.FC = () => {
  const { setCurrentStep, brandTheme, populateQuickDemo } = useClinic();

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Minimal clean header card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 sm:p-12 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 mb-6 text-slate-800">
          <Building2 className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Register your clinic
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Create your clinic profile, connect verified doctors, and make your healthcare
          services discoverable to patients on the Contingent Health Platform.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <button
            id="register-clinic-btn"
            onClick={() => setCurrentStep('account')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl font-semibold text-white shadow-xs transition-all hover:opacity-90 active:scale-[0.99]"
            style={{
              backgroundColor: brandTheme.palette.primary,
              color: brandTheme.palette.primaryContrast,
            }}
          >
            <span>Register Clinic</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentStep('setup')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-50 border border-slate-300 hover:bg-slate-100 transition-all"
          >
            Already registered? Sign in
          </button>
        </div>

        {/* Four minimal pillars */}
        <div className="border-t border-slate-100 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Contingent Verified
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Affiliate with pre-credentialed, verified medical professionals with zero bypass.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5">
              <Palette className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Dynamic Logo Theme
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your logo and let AI extract an accessible brand palette tailored for healthcare.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2.5">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Service Discovery
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connect services to doctors and publish directly to the patient appointment portal.
            </p>
          </div>
        </div>

        {/* Quick Demo Preloader for Evaluators */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-left bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <div>
            <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Quick Walkthrough & Demo
            </span>
            <p className="text-xs text-blue-700 mt-0.5">
              Want to skip manual typing? Pre-load realistic clinic data, verified doctors, and active services.
            </p>
          </div>
          <button
            onClick={() => {
              populateQuickDemo();
              setCurrentStep('setup');
            }}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-xs"
          >
            Explore Setup Hub
          </button>
        </div>
      </div>
    </div>
  );
};
