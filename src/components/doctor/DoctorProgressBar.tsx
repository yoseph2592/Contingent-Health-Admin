import React from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { DoctorOnboardingStep } from '../../types';
import {
  UserCheck,
  Stethoscope,
  Building2,
  FileCheck2,
  ClipboardList,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface StepItem {
  id: DoctorOnboardingStep;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  { id: 'account', label: 'Create Account', shortLabel: 'Account', icon: UserCheck },
  { id: 'profile', label: 'Professional Profile', shortLabel: 'Profile', icon: Stethoscope },
  { id: 'affiliation', label: 'Clinic Affiliation', shortLabel: 'Affiliation', icon: Building2 },
  { id: 'verification', label: 'Medical Verification', shortLabel: 'Verification', icon: FileCheck2 },
  { id: 'review', label: 'Review & Submit', shortLabel: 'Review', icon: ClipboardList },
];

export const DoctorProgressBar: React.FC = () => {
  const { currentStep, setCurrentStep, prefillSampleDoctor, isRegistered, resetOnboarding } = useDoctor();

  if (currentStep === 'portal') {
    return null;
  }

  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar with quick demo helper */}
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Doctor Registration
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-700 font-medium">
              Step {currentIdx + 1} of {STEPS.length}: {STEPS[currentIdx]?.label}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prefillSampleDoctor}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
              title="Populate complete physician data for instant testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auto-Fill Sample Doctor</span>
            </button>

            {isRegistered && (
              <button
                onClick={resetOnboarding}
                className="inline-flex items-center space-x-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 rounded transition-colors"
                title="Reset flow"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const StepIcon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex-1 flex items-center p-2 rounded-lg text-left transition-all group ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mr-2 text-xs font-semibold ${
                    isCurrent
                      ? 'bg-emerald-500 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0 hidden md:block">
                  <p
                    className={`text-[10px] font-medium leading-tight truncate ${
                      isCurrent ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    Step {idx + 1}
                  </p>
                  <p
                    className={`text-xs font-semibold truncate ${
                      isCurrent ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {step.shortLabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
