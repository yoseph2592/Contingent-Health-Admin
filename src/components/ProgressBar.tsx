import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Check } from 'lucide-react';
import { OnboardingStep } from '../types';

interface StepMeta {
  id: OnboardingStep;
  title: string;
}

const ONBOARDING_FLOW: StepMeta[] = [
  { id: 'account', title: 'Account' },
  { id: 'branding', title: 'Branding' },
  { id: 'info', title: 'Clinic Info' },
  { id: 'location', title: 'Location' },
  { id: 'verification', title: 'Verification' },
  { id: 'setup', title: 'Clinic Setup' },
  { id: 'doctors', title: 'Doctors' },
  { id: 'services', title: 'Services' },
  { id: 'publish', title: 'Publish' },
];

export const ProgressBar: React.FC = () => {
  const { currentStep, setCurrentStep, brandTheme } = useClinic();

  if (currentStep === 'welcome' || currentStep === 'preview') {
    return null;
  }

  const currentIndex = ONBOARDING_FLOW.findIndex((s) => s.id === currentStep);

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Clinic Onboarding
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-700">
              Step {currentIndex >= 0 ? currentIndex + 1 : 1} of {ONBOARDING_FLOW.length}
            </span>
          </div>

          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: brandTheme.palette.lightTint,
              color: brandTheme.palette.primary,
            }}
          >
            {currentIndex >= 0 ? ONBOARDING_FLOW[currentIndex].title : 'Progress'}
          </span>
        </div>

        {/* Visual stepped bar */}
        <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
          {ONBOARDING_FLOW.map((step, idx) => {
            const isDone = currentIndex > idx;
            const isCurrent = currentIndex === idx;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className="group flex flex-col text-left focus:outline-hidden"
              >
                <div
                  className="h-1.5 w-full rounded-full transition-all"
                  style={{
                    backgroundColor: isDone || isCurrent
                      ? brandTheme.palette.primary
                      : '#e2e8f0',
                    opacity: isDone ? 1 : isCurrent ? 0.9 : 0.6,
                  }}
                />
                <span
                  className={`mt-1 text-[11px] truncate hidden md:inline transition-colors ${
                    isCurrent
                      ? 'font-semibold text-slate-900'
                      : isDone
                      ? 'text-slate-600'
                      : 'text-slate-400'
                  }`}
                >
                  {isDone ? `✓ ${step.title}` : step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
