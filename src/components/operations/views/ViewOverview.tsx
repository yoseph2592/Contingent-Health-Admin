import React from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { OwnerCommandCenter } from '../dashboards/OwnerCommandCenter';
import { ExecutiveDirectorDashboard } from '../dashboards/ExecutiveDirectorDashboard';
import { AdminOperationalCenter } from '../dashboards/AdminOperationalCenter';
import { MedicalDirectorDashboard } from '../dashboards/MedicalDirectorDashboard';
import { DoctorMyDayDashboard } from '../dashboards/DoctorMyDayDashboard';
import { NursePrepQueue } from '../dashboards/NursePrepQueue';
import { ReceptionistQueue } from '../dashboards/ReceptionistQueue';
import { FinanceAndClaimsDashboard } from '../dashboards/FinanceAndClaimsDashboard';
import { RecordsQueueDashboard } from '../dashboards/RecordsQueueDashboard';

export const ViewOverview: React.FC = () => {
  const { activeRole } = useClinicOperations();

  switch (activeRole) {
    case 'Clinic Owner':
      return <OwnerCommandCenter />;
    case 'Executive Director / Clinic Director':
      return <ExecutiveDirectorDashboard />;
    case 'Clinic Administrator':
      return <AdminOperationalCenter />;
    case 'Medical Director':
      return <MedicalDirectorDashboard />;
    case 'Doctor':
      return <DoctorMyDayDashboard />;
    case 'Nurse':
      return <NursePrepQueue />;
    case 'Receptionist':
      return <ReceptionistQueue />;
    case 'Finance & Claims Officer':
    case 'Finance Officer':
    case 'Claims Officer':
      return <FinanceAndClaimsDashboard />;
    case 'Records Officer':
      return <RecordsQueueDashboard />;
    default:
      return <AdminOperationalCenter />;
  }
};
