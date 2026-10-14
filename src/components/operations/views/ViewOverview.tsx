import React from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { OwnerCommandCenter } from '../dashboards/OwnerCommandCenter';
import { AdminOperationalCenter } from '../dashboards/AdminOperationalCenter';
import { DoctorMyDayDashboard } from '../dashboards/DoctorMyDayDashboard';
import { NursePrepQueue } from '../dashboards/NursePrepQueue';
import { ReceptionistQueue } from '../dashboards/ReceptionistQueue';
import { FinanceDashboard } from '../dashboards/FinanceDashboard';
import { ClaimsQueueDashboard } from '../dashboards/ClaimsQueueDashboard';
import { RecordsQueueDashboard } from '../dashboards/RecordsQueueDashboard';
import { MedicalDirectorDashboard } from '../dashboards/MedicalDirectorDashboard';

export const ViewOverview: React.FC = () => {
  const { activeRole } = useClinicOperations();

  switch (activeRole) {
    case 'Clinic Owner':
    case 'Clinic Administrator':
    case 'Doctor':
    case 'Medical Director':
      return <DoctorMyDayDashboard />;
    case 'Nurse':
      return <NursePrepQueue />;
    case 'Receptionist':
      return <ReceptionistQueue />;
    case 'Finance Officer':
      return <FinanceDashboard />;
    case 'Claims Officer':
      return <ClaimsQueueDashboard />;
    case 'Records Officer':
      return <RecordsQueueDashboard />;
    default:
      return <DoctorMyDayDashboard />;
  }
};
