import React, { useState } from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import { UserRole, OperationalTab } from '../../types/operations';
import {
  Bell,
  Sparkles,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Check,
  Menu,
} from 'lucide-react';

export const OperationsTopNav: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    activeTab,
    setActiveTab,
    notifications,
    runAutomatedCoreJourney,
    isJourneyRunning,
    journeyStep,
    resetToInitialDemoData,
    setIsMobileMenuOpen,
  } = useClinicOperations();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifPreviewOpen, setIsNotifPreviewOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roles: UserRole[] = [
    'Clinic Administrator',
    'Medical Director',
    'Doctor',
    'Nurse',
    'Receptionist',
    'Finance Officer',
    'Claims Officer',
    'Clinic Owner',
    'Records Officer',
  ];

  // Helper to map current active tab to breadcrumb path matching Image 2 ("General > Dashboard")
  const getBreadcrumb = (tab: OperationalTab) => {
    switch (tab) {
      case 'overview':
        return { category: 'General', label: 'Dashboard' };
      case 'encounter':
      case 'tasks':
        return { category: 'General', label: 'Active Consultation' };
      case 'patients':
        return { category: 'Clinical Operations', label: 'Patients' };
      case 'appointments':
      case 'check-in':
        return { category: 'Clinical Operations', label: 'Appointments' };
      case 'prescriptions':
        return { category: 'Clinical Operations', label: 'Prescription' };
      case 'diagnostics':
        return { category: 'Clinical Operations', label: 'Diagnostic Orders' };
      case 'referrals':
        return { category: 'Clinical Operations', label: 'Referrals' };
      case 'wallet':
        return { category: 'Finance & Claims', label: 'Payments' };
      case 'revenue':
        return { category: 'Finance & Claims', label: 'Revenue Analytics' };
      case 'claims':
        return { category: 'Finance & Claims', label: 'Claims' };
      case 'contracts':
        return { category: 'Finance & Claims', label: 'Contracts' };
      case 'reports':
        return { category: 'Account & Governance', label: 'Rating and Reviews' };
      case 'admin':
      case 'doctors':
      case 'staff':
        return { category: 'Account & Governance', label: 'Clinic Profile' };
      case 'settings':
        return { category: 'Preference', label: 'Settings' };
      case 'audit':
        return { category: 'Account & Governance', label: 'Audit Trail' };
      case 'onboarding':
        return { category: 'Platform Tools', label: 'Onboarding Hub' };
      case 'patient-sync':
        return { category: 'Platform Tools', label: 'Patient App View' };
      case 'notifications':
        return { category: 'System', label: 'Notifications' };
      default:
        return { category: 'General', label: 'Dashboard' };
    }
  };

  const breadcrumb = getBreadcrumb(activeTab);

  // Avatar of Kam Ephrem matching Image 2
  const kamEphremAvatar =
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#e8e8e8] flex items-center justify-between px-4 sm:px-8 select-none">
      {/* Left: Mobile Drawer Trigger + Breadcrumb Navigation matching Image 2 */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {/* Mobile menu hamburger button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -ml-1 text-[#606060] hover:text-[#0e162b] hover:bg-[#f5f7fa] rounded-xl transition-colors lg:hidden shrink-0"
          title="Open navigation menu"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-[#0e162b]" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 min-w-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className="text-xs sm:text-sm text-[#8e8e8e] hover:text-[#0e162b] transition-colors truncate font-normal focus:outline-none"
          >
            {breadcrumb.category}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[#bbbbbb] shrink-0" />

          <span className="text-xs sm:text-sm font-bold text-[#0e162b] truncate max-w-[140px] sm:max-w-[280px]">
            {breadcrumb.label}
          </span>
        </nav>
      </div>

      {/* Middle: Clean whitespace */}
      <div className="flex-1" />

      {/* Right Controls: Simulator, Notification Bell, User Profile (Image 2 style) */}
      <div className="flex items-center space-x-2 sm:space-x-3.5 shrink-0">
        {/* 1-Click Clinical Journey Simulator Button */}
        <button
          type="button"
          onClick={runAutomatedCoreJourney}
          disabled={isJourneyRunning}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs shrink-0 ${
            isJourneyRunning
              ? 'bg-[#ffdb43]/20 text-[#dfb400] border border-[#dfb400]/40 animate-pulse'
              : 'bg-[#0e162b] hover:bg-[#213364] text-white'
          }`}
          title="Run complete clinic operational scenario"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00c0fe] shrink-0" />
          <span className="hidden md:inline">
            {isJourneyRunning ? `Step ${journeyStep}/13 Running...` : 'Run Clinical Journey'}
          </span>
          <span className="md:hidden text-[11px]">
            {isJourneyRunning ? `${journeyStep}/13` : 'Journey'}
          </span>
        </button>

        {/* Reset Demo Data Button */}
        <button
          type="button"
          onClick={resetToInitialDemoData}
          className="hidden sm:inline-flex p-2 text-[#8e8e8e] hover:text-[#0e162b] hover:bg-[#f5f7fa] rounded-full transition-colors shrink-0"
          title="Reset Operations Data to Default"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notification Bell Box matching Image 2 */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsNotifPreviewOpen(!isNotifPreviewOpen)}
            className="w-10 h-10 rounded-2xl bg-[#f5f7fa] hover:bg-[#e8e8e8] flex items-center justify-center text-[#4a4a4a] hover:text-[#0e162b] relative transition-colors border border-[#e8e8e8]/60"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-[#333333]" />
            {/* Red dot badge matching Image 2 */}
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#d00416] ring-2 ring-white" />
            )}
          </button>

          {isNotifPreviewOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-[#e8e8e8] py-2 z-50 animate-in fade-in duration-100 text-xs">
              <div className="px-4 py-2.5 border-b border-[#e8e8e8] flex items-center justify-between">
                <span className="font-semibold text-[#0e162b]">Notifications ({unreadCount} unread)</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('notifications');
                    setIsNotifPreviewOpen(false);
                  }}
                  className="text-[#00c0fe] hover:underline font-semibold text-[11px]"
                >
                  View all
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-[#e8e8e8]">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.actionLinkTab) setActiveTab(n.actionLinkTab);
                      setIsNotifPreviewOpen(false);
                    }}
                    className={`p-3.5 cursor-pointer hover:bg-[#f5f7fa] transition-colors ${
                      !n.isRead ? 'bg-[#aaeaff]/10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0e162b] text-[11px] truncate">{n.title}</span>
                      <span className="text-[10px] text-[#8e8e8e]">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#606060] mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Card matching Image 2 (Kam Ephrem / Super Admin) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-[#f5f7fa] transition-all text-left group"
            title="Switch User Role & Profile"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#e8e8e8] shrink-0 bg-[#0e162b]">
              <img
                src={kamEphremAvatar}
                alt="Kam Ephrem"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="hidden sm:block leading-tight min-w-0">
              <span className="text-sm font-bold text-[#0e162b] block truncate">
                Kam Ephrem
              </span>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#f0f2f5] text-[#606060] text-[11px] font-medium rounded-md truncate">
                {activeRole === 'Clinic Owner' || activeRole === 'Clinic Administrator'
                  ? 'Super Admin'
                  : activeRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8e8e8e] hidden sm:block shrink-0 group-hover:text-[#0e162b] transition-colors" />
          </button>

          {/* Role switcher dropdown */}
          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#e8e8e8] py-2 z-50 text-xs animate-in fade-in duration-100">
              <div className="px-4 py-2 border-b border-[#e8e8e8] flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0e162b] shrink-0">
                  <img
                    src={kamEphremAvatar}
                    alt="Kam Ephrem"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-[#0e162b] text-xs">Kam Ephrem</p>
                  <p className="text-[10px] text-[#8e8e8e]">kam.ephrem@contingenthealth.org</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#84ebb4]/20 text-[#1fc16b] text-[9px] font-semibold rounded-full border border-[#1fc16b]/30">
                    Active Session: {activeRole}
                  </span>
                </div>
              </div>

              <div className="px-4 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8e8e8e]">
                Switch Active Role Scopes
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setActiveRole(r);
                    setIsRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-[#f5f7fa] transition-colors ${
                    activeRole === r ? 'text-[#0e162b] font-bold bg-[#aaeaff]/20' : 'text-[#333333]'
                  }`}
                >
                  <span>{r}</span>
                  {activeRole === r && <Check className="w-3.5 h-3.5 text-[#00c0fe] shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
