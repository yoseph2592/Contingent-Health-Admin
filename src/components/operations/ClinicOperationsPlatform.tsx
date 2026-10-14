import React, { useEffect } from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import { OperationsSidebar } from './OperationsSidebar';
import { OperationsTopNav } from './OperationsTopNav';
import { GlobalSearchModal } from './GlobalSearchModal';
import { PrintableDocumentModal } from './PrintableDocumentModal';
import { PrescribeMedicationModal } from './PrescribeMedicationModal';
import { OrderLabModal } from './OrderLabModal';
import { CreateReferralModal } from './CreateReferralModal';
import { PatientAppSyncBanner } from './PatientAppSyncBanner';
import { RequestRecordAccessModal } from './RequestRecordAccessModal';
import { RecordAccessToast } from './RecordAccessToast';
import { canRoleAccessTab, getDefaultTabForRole } from '../../utils/rolePermissions';

import { ViewOverview } from './views/ViewOverview';
import { ViewPatients } from './views/ViewPatients';
import { ViewAppointments } from './views/ViewAppointments';
import { ViewDoctorWorkspace } from './views/ViewDoctorWorkspace';
import { ViewPrescriptions } from './views/ViewPrescriptions';
import { ViewDiagnostics } from './views/ViewDiagnostics';
import { ViewReferrals } from './views/ViewReferrals';
import { ViewDocuments } from './views/ViewDocuments';
import { ViewDoctors } from './views/ViewDoctors';
import { ViewWallet } from './views/ViewWallet';
import { ViewRevenue } from './views/ViewRevenue';
import { ViewClaims } from './views/ViewClaims';
import { ViewContracts } from './views/ViewContracts';
import { ViewNotifications } from './views/ViewNotifications';
import { ViewReports } from './views/ViewReports';
import { ViewSettings } from './views/ViewSettings';
import { ViewAdminStaff } from './views/ViewAdminStaff';
import { ViewAuditLog } from './views/ViewAuditLog';
import { ViewPatientSync } from './views/ViewPatientSync';
import { ViewMergedOnboarding } from './views/ViewMergedOnboarding';
import { ShieldAlert, ArrowLeft, LayoutGrid, Users, Calendar, Stethoscope, Menu, Info } from 'lucide-react';

export const ClinicOperationsPlatform: React.FC = () => {
  const { activeTab, setActiveTab, activeRole, setIsMobileMenuOpen } = useClinicOperations();
  const [legalModalText, setLegalModalText] = React.useState<string | null>(null);

  // Redirect if the active role cannot access the currently active tab
  useEffect(() => {
    if (!canRoleAccessTab(activeRole, activeTab)) {
      setActiveTab(getDefaultTabForRole(activeRole));
    }
  }, [activeRole, activeTab, setActiveTab]);

  const renderActiveView = () => {
    if (!canRoleAccessTab(activeRole, activeTab)) {
      return (
        <div className="max-w-md mx-auto my-20 p-8 bg-white border border-[#e8e8e8] rounded-2xl text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#fb3748]/10 text-[#d00416] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-[#0e162b]">Module Restricted</h2>
          <p className="text-xs text-[#8e8e8e] leading-relaxed">
            Your current operational session (<strong>{activeRole}</strong>) does not have authorization for this module.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab(getDefaultTabForRole(activeRole))}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0e162b] text-white rounded-full text-xs font-semibold hover:bg-[#213364] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to {activeRole} Dashboard</span>
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <ViewOverview />;
      case 'patients':
        return <ViewPatients />;
      case 'appointments':
      case 'check-in':
        return <ViewAppointments />;
      case 'encounter':
      case 'tasks':
        return <ViewDoctorWorkspace />;
      case 'prescriptions':
        return <ViewPrescriptions />;
      case 'diagnostics':
        return <ViewDiagnostics />;
      case 'referrals':
        return <ViewReferrals />;
      case 'documents':
      case 'records':
        return <ViewDocuments />;
      case 'doctors':
        return <ViewDoctors />;
      case 'wallet':
        return <ViewWallet />;
      case 'revenue':
        return <ViewRevenue />;
      case 'claims':
        return <ViewClaims />;
      case 'contracts':
        return <ViewContracts />;
      case 'notifications':
        return <ViewNotifications />;
      case 'reports':
        return <ViewReports />;
      case 'settings':
        return <ViewSettings />;
      case 'staff':
      case 'admin':
        return <ViewAdminStaff />;
      case 'audit-log':
      case 'audit':
        return <ViewAuditLog />;
      case 'patient-sync':
        return <ViewPatientSync />;
      case 'merged-onboarding':
      case 'onboarding':
        return <ViewMergedOnboarding />;
      default:
        return <ViewOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F7F7F7] text-[#222222] overflow-hidden font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <OperationsSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Persistent Top Navigation Bar */}
        <OperationsTopNav />

        {/* Dynamic View Scroll Container */}
        <main className="flex-1 overflow-y-auto bg-[#F7F7F7] flex flex-col justify-between pb-18 lg:pb-0">
          <div className="flex-1">
            {renderActiveView()}
          </div>

          {/* Contingent Health Clinic OS Global Footer */}
          <footer className="border-t border-[#e8e8e8] bg-white px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8e8e8e] shrink-0 mt-8 gap-3">
            <div className="text-xs text-center sm:text-left font-normal">
              © 2025 - Contingent-Health. Designed By Pixel Addis. All rights reserved
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs font-normal">
              <span>Version 2.1.0</span>
              <button
                type="button"
                onClick={() => setLegalModalText('Privacy Policy: All patient and provider clinical data is encrypted in-transit and at-rest compliant with HIPAA, GDPR, and HL7 FHIR standards.')}
                className="hover:text-[#0e162b] transition-colors"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setLegalModalText('Terms & Conditions: Operating under authorized medical institution license for Contingent Health Clinic OS.')}
                className="hover:text-[#0e162b] transition-colors"
              >
                Terms &amp; Condition
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile/Tablet Bottom Navigation Bar (< lg) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8e8e8] py-1.5 px-3 flex items-center justify-around select-none shadow-lg"
      >
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'text-[#00c0fe] font-bold'
              : 'text-[#8e8e8e] hover:text-[#0e162b]'
          }`}
        >
          <LayoutGrid className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'appointments' || activeTab === 'check-in'
              ? 'text-[#00c0fe] font-bold'
              : 'text-[#8e8e8e] hover:text-[#0e162b]'
          }`}
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">Schedule</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('patients')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'patients'
              ? 'text-[#00c0fe] font-bold'
              : 'text-[#8e8e8e] hover:text-[#0e162b]'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">Patients</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('encounter')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'encounter' || activeTab === 'tasks'
              ? 'text-[#00c0fe] font-bold'
              : 'text-[#8e8e8e] hover:text-[#0e162b]'
          }`}
        >
          <Stethoscope className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">Doctor</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[#8e8e8e] hover:text-[#0e162b] transition-all"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">More</span>
        </button>
      </nav>

      {/* Lightweight Non-blocking Legal Modal */}
      {legalModalText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-[#e8e8e8] space-y-4">
            <div className="flex items-center space-x-2 text-[#0e162b]">
              <Info className="w-5 h-5 text-[#00c0fe]" />
              <h3 className="font-bold text-sm">Regulatory Notice</h3>
            </div>
            <p className="text-xs text-[#606060] leading-relaxed">
              {legalModalText}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setLegalModalText(null)}
                className="px-4 py-2 bg-[#0e162b] text-white text-xs font-semibold rounded-full hover:bg-[#213364] transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Floating Banners */}
      <GlobalSearchModal />
      <PrintableDocumentModal />
      <PrescribeMedicationModal />
      <OrderLabModal />
      <CreateReferralModal />
      <PatientAppSyncBanner />
      <RequestRecordAccessModal />
      <RecordAccessToast />
    </div>
  );
};
