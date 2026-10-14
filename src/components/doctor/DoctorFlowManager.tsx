import React from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { DoctorProgressBar } from './DoctorProgressBar';
import { ScreenDoctorAccount } from './ScreenDoctorAccount';
import { ScreenDoctorProfile } from './ScreenDoctorProfile';
import { ScreenDoctorAffiliation } from './ScreenDoctorAffiliation';
import { ScreenDoctorVerification } from './ScreenDoctorVerification';
import { ScreenDoctorReview } from './ScreenDoctorReview';
import { ScreenDoctorPortal } from './ScreenDoctorPortal';

export const DoctorFlowManager: React.FC = () => {
  const { currentStep } = useDoctor();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DoctorProgressBar />

      <main className="flex-1 pb-16">
        {currentStep === 'account' && <ScreenDoctorAccount />}
        {currentStep === 'profile' && <ScreenDoctorProfile />}
        {currentStep === 'affiliation' && <ScreenDoctorAffiliation />}
        {currentStep === 'verification' && <ScreenDoctorVerification />}
        {currentStep === 'review' && <ScreenDoctorReview />}
        {currentStep === 'portal' && <ScreenDoctorPortal />}
      </main>
    </div>
  );
};
