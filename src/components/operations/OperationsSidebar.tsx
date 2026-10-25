import React, { useState } from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import { getRoleDefinition } from '../../utils/rolePermissions';
import {
  Layers,
  Smartphone,
  LogOut,
  Users,
  Calendar,
  Stethoscope,
  Pill,
  FlaskConical,
  Share2,
  Wallet,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Star,
  Building2,
  LayoutGrid,
  ReceiptText,
  FileSignature,
  FileText,
  History,
  HeartPulse,
  X,
} from 'lucide-react';
import { OperationalTab } from '../../types/operations';

export const OperationsSidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeRole,
    appointments,
    claims,
    labRequests,
    notifications,
    activeEncounter,
    startConsultation,
    resetToInitialDemoData,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useClinicOperations();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const roleDef = getRoleDefinition(activeRole);

  const pendingAppointmentsCount = appointments.filter(
    (a) => a.status === 'Requested' || a.status === 'Checked-in'
  ).length;
  const pendingClaimsCount = claims.filter(
    (c) => c.status === 'Submitted' || c.status === 'Documentation Required'
  ).length;
  const pendingLabsCount = labRequests.filter(
    (l) => l.status === 'Result Available' && !l.reviewedByDoctor
  ).length;
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;
  const activeConsultationsCount = appointments.filter(
    (a) => a.status === 'In consultation'
  ).length;

  const getBadgeForNav = (badgeKey?: string) => {
    switch (badgeKey) {
      case 'consultations':
        return activeConsultationsCount > 0 ? activeConsultationsCount : undefined;
      case 'appointments':
        return pendingAppointmentsCount > 0 ? pendingAppointmentsCount : undefined;
      case 'claims':
        return pendingClaimsCount > 0 ? pendingClaimsCount : undefined;
      case 'labs':
        return pendingLabsCount > 0 ? pendingLabsCount : undefined;
      case 'notifications':
        return unreadNotifsCount > 0 ? unreadNotifsCount : undefined;
      default:
        return undefined;
    }
  };

  const isOwnerOrAdmin = activeRole === 'Clinic Owner' || activeRole === 'Clinic Administrator';

  const handleNavSelect = (id: OperationalTab) => {
    if (id === 'encounter') {
      const inConsultApts = appointments.filter((a) => a.status === 'In consultation');
      if (inConsultApts.length > 0) {
        const isCurrentActive = inConsultApts.some(
          (a) => a.id === activeEncounter.appointmentId || a.patientId === activeEncounter.patientId
        );
        if (!isCurrentActive || activeEncounter.isLocked) {
          startConsultation(inConsultApts[0].id);
        }
      }
    }
    setActiveTab(id);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Structured Nav Hierarchy matching Image 1:
  // General -> Clinical Operations -> Finance & Claims -> Account & Governance -> Preference
  interface NavItemConfig {
    id: OperationalTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeKey?: 'appointments' | 'claims' | 'labs' | 'notifications' | 'consultations';
  }

  const generalItems: NavItemConfig[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'encounter', label: 'Active Consultation', icon: Stethoscope, badgeKey: 'consultations' },
  ];

  const clinicalItems: NavItemConfig[] = [
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'maternal', label: 'Maternal Tracking', icon: HeartPulse },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badgeKey: 'appointments' },
    { id: 'prescriptions', label: 'Prescription', icon: Pill },
    { id: 'diagnostics', label: 'Diagnostic Orders', icon: FlaskConical, badgeKey: 'labs' },
    { id: 'referrals', label: 'Referrals', icon: Share2 },
  ];

  const financeItems: NavItemConfig[] = [
    { id: 'wallet', label: 'Payments', icon: Wallet },
    ...(roleDef.allowedTabs.includes('claims')
      ? [{ id: 'claims' as OperationalTab, label: 'Claims', icon: ReceiptText, badgeKey: 'claims' as const }]
      : []),
    ...(roleDef.allowedTabs.includes('contracts')
      ? [{ id: 'contracts' as OperationalTab, label: 'Contracts', icon: FileSignature }]
      : []),
  ];

  const accountItems: NavItemConfig[] = [
    { id: 'reports', label: 'Rating and Reviews', icon: Star },
    { id: 'admin', label: 'Clinic Profile', icon: Building2 },
    ...(roleDef.allowedTabs.includes('doctors')
      ? [{ id: 'doctors' as OperationalTab, label: 'Medical Staff', icon: Users }]
      : []),
    ...(roleDef.allowedTabs.includes('audit')
      ? [{ id: 'audit' as OperationalTab, label: 'Audit Trail', icon: History }]
      : []),
  ];

  const preferenceItems: NavItemConfig[] = [
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderNavGroup = (
    title: string,
    items: NavItemConfig[],
    forceExpanded = false,
    showDividerAfter = true
  ) => {
    // Filter items based on whether role is allowed to view them (or fallback to always visible general items)
    const visibleItems = items.filter(
      (item) => roleDef.allowedTabs.includes(item.id) || item.id === 'overview' || item.id === 'encounter'
    );

    if (visibleItems.length === 0) return null;
    const collapsed = forceExpanded ? false : isCollapsed;

    return (
      <div className="space-y-1">
        {!collapsed && (
          <div className="px-3.5 pb-1 text-[11px] font-medium text-[#8da2da]/80 tracking-wide">
            {title}
          </div>
        )}
        <div className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'encounter' && activeTab === 'tasks') ||
              (item.id === 'appointments' && activeTab === 'check-in') ||
              (item.id === 'admin' && activeTab === 'staff') ||
              (item.id === 'wallet' && activeTab === 'revenue');
            const badgeValue = getBadgeForNav(item.badgeKey);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavSelect(item.id)}
                title={item.label}
                className={`w-full group flex items-center transition-all ${
                  collapsed
                    ? 'justify-center p-2.5 rounded-2xl'
                    : 'justify-between px-4 py-2.5 rounded-full'
                } text-xs ${
                  isActive
                    ? 'bg-[#00c0fe] text-white font-medium shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 font-normal'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate text-[13px] tracking-tight">{item.label}</span>
                  )}
                </div>

                {!collapsed && badgeValue !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-white text-[#0e162b]'
                        : 'bg-[#fb3748] text-white'
                    }`}
                  >
                    {badgeValue}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {showDividerAfter && (
          <div className="pt-2 pb-2">
            <div className="border-t border-[#213364]/60 mx-1" />
          </div>
        )}
      </div>
    );
  };

  const renderPlatformTools = (forceExpanded = false) => {
    if (!isOwnerOrAdmin) return null;
    const collapsed = forceExpanded ? false : isCollapsed;
    return (
      <div className="space-y-1">
        {!collapsed && (
          <div className="px-3.5 pb-1 text-[11px] font-medium text-[#8da2da]/80 tracking-wide">
            Platform Tools
          </div>
        )}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => handleNavSelect('onboarding')}
            title="Onboarding Hub"
            className={`w-full group flex items-center transition-all ${
              collapsed
                ? 'justify-center p-2.5 rounded-2xl'
                : 'justify-between px-4 py-2.5 rounded-full'
            } text-xs ${
              activeTab === 'onboarding'
                ? 'bg-[#00c0fe] text-white font-medium shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5 font-normal'
            }`}
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              <Layers
                className={`w-4 h-4 shrink-0 transition-colors ${
                  activeTab === 'onboarding' ? 'text-white' : 'text-slate-300 group-hover:text-white'
                }`}
              />
              {!collapsed && (
                <span className="truncate text-[13px] tracking-tight">Onboarding Hub</span>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleNavSelect('patient-sync')}
            title="Patient App View"
            className={`w-full group flex items-center transition-all ${
              collapsed
                ? 'justify-center p-2.5 rounded-2xl'
                : 'justify-between px-4 py-2.5 rounded-full'
            } text-xs ${
              activeTab === 'patient-sync'
                ? 'bg-[#00c0fe] text-white font-medium shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5 font-normal'
            }`}
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              <Smartphone
                className={`w-4 h-4 shrink-0 transition-colors ${
                  activeTab === 'patient-sync' ? 'text-white' : 'text-slate-300 group-hover:text-white'
                }`}
              />
              {!collapsed && (
                <span className="truncate text-[13px] tracking-tight">Patient App View</span>
              )}
            </div>
            {!collapsed && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1fc16b]/20 text-[#84ebb4] font-medium border border-[#1fc16b]/30">
                Live
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderBottomPill = (forceExpanded = false) => {
    const collapsed = forceExpanded ? false : isCollapsed;
    return (
      <div className="p-4 border-t border-[#213364]/60 bg-[#0e162b] shrink-0">
        <button
          type="button"
          onClick={() => {
            resetToInitialDemoData();
            if (isMobileMenuOpen) setIsMobileMenuOpen(false);
          }}
          className={`w-full flex items-center justify-center space-x-2.5 ${
            collapsed ? 'py-3 px-2 rounded-2xl' : 'py-3 px-4 rounded-full'
          } bg-[#16223e] hover:bg-[#213364] border border-[#213364] text-slate-200 text-xs font-semibold transition-all shadow-xs`}
          title="Log Out / Reset Demo Session"
        >
          <LogOut className="w-4 h-4 text-slate-300 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    );
  };

  // Medical Cross & Health Stethoscope SVG Icon matching Image 1
  const MedicalBrandLogo = () => (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
      <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
        {/* White Rounded Cross */}
        <rect x="14" y="4" width="12" height="32" rx="4" fill="white" />
        <rect x="4" y="14" width="32" height="12" rx="4" fill="white" />
        {/* Curved stethoscope accent loop with dot */}
        <circle cx="31" cy="9" r="3" fill="#00c0fe" />
        <path
          d="M31 12C31 18 25 21 20 21"
          stroke="#00c0fe"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Left Sidebar (Visible on large screens lg:flex) */}
      <aside
        id="operations-desktop-sidebar"
        className={`${
          isCollapsed ? 'w-20' : 'w-72'
        } bg-[#0e162b] border-r border-[#213364]/60 hidden lg:flex flex-col h-full min-h-screen select-none shrink-0 overflow-hidden transition-all duration-200 z-20 self-stretch`}
      >
        {/* Top Header Card matching Image 1 */}
        {!isCollapsed ? (
          <div className="mx-3.5 mt-4 mb-2 p-3 rounded-2xl bg-[#16223e] border border-white/5 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <MedicalBrandLogo />
              <div className="min-w-0">
                <h2 className="text-[15px] font-bold text-white leading-tight truncate tracking-tight">
                  Contingent <span className="text-[#00c0fe]">Health</span>
                </h2>
                <p className="text-[11px] text-[#8da2da] font-normal truncate mt-0.5">
                  clinic Dashboard
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="w-8 h-8 rounded-xl bg-[#213364]/60 hover:bg-[#213364] text-slate-300 hover:text-white transition-colors flex items-center justify-center border border-white/10 shrink-0"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-3 my-3 flex flex-col items-center gap-3">
            <MedicalBrandLogo />
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="w-8 h-8 rounded-xl bg-[#213364]/60 hover:bg-[#213364] text-slate-300 hover:text-white transition-colors flex items-center justify-center border border-white/10"
              title="Expand sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1">
          {renderNavGroup('General', generalItems)}
          {renderNavGroup('Clinical Operations', clinicalItems)}
          {renderNavGroup('Finance & Claims', financeItems)}
          {renderNavGroup('Account & Governance', accountItems)}
          {renderNavGroup('Preference', preferenceItems, false, isOwnerOrAdmin)}
          {renderPlatformTools()}
        </div>

        {/* Bottom Pill matching Image 1 */}
        {renderBottomPill()}
      </aside>

      {/* 2. Mobile & Tablet Drawer (Slide-out menu for screens < lg) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Touch Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <aside
            id="operations-mobile-drawer"
            className="relative w-72 sm:w-80 max-w-[85vw] bg-[#0e162b] border-r border-[#213364]/60 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 select-none"
          >
            {/* Drawer Header Card matching Image 1 */}
            <div className="mx-3.5 mt-4 mb-2 p-3 rounded-2xl bg-[#16223e] border border-white/5 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2.5 min-w-0">
                <MedicalBrandLogo />
                <div className="min-w-0">
                  <h2 className="text-[15px] font-bold text-white leading-tight truncate tracking-tight">
                    Contingent <span className="text-[#00c0fe]">Health</span>
                  </h2>
                  <p className="text-[11px] text-[#8da2da] font-normal truncate mt-0.5">
                    clinic Dashboard
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#213364]/60 hover:bg-[#213364] text-slate-300 hover:text-white transition-colors flex items-center justify-center border border-white/10 shrink-0"
                title="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Nav Items */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1">
              {renderNavGroup('General', generalItems, true)}
              {renderNavGroup('Clinical Operations', clinicalItems, true)}
              {renderNavGroup('Finance & Claims', financeItems, true)}
              {renderNavGroup('Account & Governance', accountItems, true)}
              {renderNavGroup('Preference', preferenceItems, true, isOwnerOrAdmin)}
              {renderPlatformTools(true)}
            </div>

            {/* Bottom Section */}
            {renderBottomPill(true)}
          </aside>
        </div>
      )}
    </>
  );
};
