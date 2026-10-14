/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { DoctorProvider } from './context/DoctorContext';
import { ClinicOperationsProvider } from './context/ClinicOperationsContext';
import { ClinicOperationsPlatform } from './components/operations/ClinicOperationsPlatform';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { DoctorFlowManager } from './components/doctor/DoctorFlowManager';
import { ScreenWelcome } from './components/screens/ScreenWelcome';
import { ScreenAccount } from './components/screens/ScreenAccount';
import { ScreenLogoBranding } from './components/screens/ScreenLogoBranding';
import { ScreenClinicInfo } from './components/screens/ScreenClinicInfo';
import { ScreenLocationHours } from './components/screens/ScreenLocationHours';
import { ScreenVerification } from './components/screens/ScreenVerification';
import { ScreenClinicSetup } from './components/screens/ScreenClinicSetup';
import { ScreenDoctorAffiliation } from './components/screens/ScreenDoctorAffiliation';
import { ScreenServices } from './components/screens/ScreenServices';
import { ScreenPublish } from './components/screens/ScreenPublish';
import { ScreenPatientListing } from './components/screens/ScreenPatientListing';

type AppPlatformMode = 'operations' | 'doctor' | 'clinic';

const MainAppContent: React.FC = () => {
  const { currentStep, previewDevice } = useClinic();
  const [platformMode, setPlatformMode] = useState<AppPlatformMode>('operations');

  const renderClinicScreen = () => {
    switch (currentStep) {
      case 'welcome':
        return <ScreenWelcome />;
      case 'account':
        return <ScreenAccount />;
      case 'branding':
        return <ScreenLogoBranding />;
      case 'info':
        return <ScreenClinicInfo />;
      case 'location':
        return <ScreenLocationHours />;
      case 'verification':
        return <ScreenVerification />;
      case 'setup':
        return <ScreenClinicSetup />;
      case 'doctors':
        return <ScreenDoctorAffiliation />;
      case 'services':
        return <ScreenServices />;
      case 'publish':
        return <ScreenPublish />;
      case 'preview':
        return <ScreenPatientListing />;
      default:
        return <ScreenWelcome />;
    }
  };

  // Primary mode: Complete Clinic Operations & Management Platform
  if (platformMode === 'operations') {
    return <ClinicOperationsPlatform />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <Header
        platformMode={platformMode}
        setPlatformMode={(mode) => setPlatformMode(mode as AppPlatformMode)}
      />

      {platformMode === 'doctor' ? (
        <DoctorFlowManager />
      ) : (
        <>
          <ProgressBar />
          <main className="flex-1">
            {previewDevice === 'mobile' ? (
              <div className="py-6 px-4 flex justify-center items-center">
                {/* Mobile frame container for preview */}
                <div className="w-full max-w-[400px] bg-white rounded-[40px] border-[10px] border-slate-900 shadow-2xl overflow-hidden min-h-[780px] flex flex-col relative">
                  <div className="w-36 h-4 bg-slate-900 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-30" />
                  <div className="flex-1 overflow-y-auto pt-4">
                    {renderClinicScreen()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                {renderClinicScreen()}
              </div>
            )}
          </main>
        </>
      )}

      {/* Platform footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Contingent Health Platform · {platformMode === 'doctor' ? 'Doctor Sign-Up & Affiliation System' : 'Clinic Registration & Affiliation Architecture'}
          </span>
          <button
            type="button"
            onClick={() => setPlatformMode('operations')}
            className="text-[#00c0fe] hover:text-[#0095c5] font-bold"
          >
            Switch to Clinic Operations Operating System →
          </button>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ClinicProvider>
      <DoctorProvider>
        <ClinicOperationsProvider>
          <MainAppContent />
        </ClinicOperationsProvider>
      </DoctorProvider>
    </ClinicProvider>
  );
}
