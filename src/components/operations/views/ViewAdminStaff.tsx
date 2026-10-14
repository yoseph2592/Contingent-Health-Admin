import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { Shield } from 'lucide-react';

export const ViewAdminStaff: React.FC = () => {
  const { staffMembers, activeRole, setActiveRole, addAuditLog } = useClinicOperations();
  const [activeTab, setActiveTab] = useState<'matrix' | 'directory'>('matrix');

  const rbacMatrix = [
    { module: 'Clinical Encounter Workspace', admin: 'Full', doctor: 'Full (Own)', nurse: 'Vitals Only', finance: 'None', reception: 'None' },
    { module: 'Electronic Prescriptions', admin: 'Full', doctor: 'Issue & Sign', nurse: 'View Only', finance: 'None', reception: 'None' },
    { module: 'Diagnostic / Lab Orders', admin: 'Full', doctor: 'Order & Interpret', nurse: 'Specimen Prep', finance: 'None', reception: 'None' },
    { module: 'Patient Scheduling & Check-In', admin: 'Full', doctor: 'View Schedule', nurse: 'Triage Check-in', finance: 'None', reception: 'Full' },
    { module: 'Clinic Wallet & Payouts', admin: 'Full', doctor: 'Own Share', nurse: 'None', finance: 'Full', reception: 'None' },
    { module: 'Insurance Claims Adjudication', admin: 'Full', doctor: 'Attach Notes', nurse: 'None', finance: 'Full', reception: 'Basic Info' },
    { module: 'Audit Logs & Tamper Trails', admin: 'Full Read', doctor: 'None', nurse: 'None', finance: 'Read Fin', reception: 'None' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Security & Governance
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Access & Staff
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Role-based access permissions (RBAC) across clinic administrators, doctors, and staff
          </p>
        </div>

        {/* Live Role Switcher */}
        <div className="flex items-center gap-2 bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-1.5 rounded-full self-start sm:self-auto">
          <span className="text-xs text-[#717171]">Simulate role:</span>
          <select
            value={activeRole}
            onChange={(e) => {
              setActiveRole(e.target.value as any);
              addAuditLog(`Switched active operational role to ${e.target.value}`, 'RBACRole', 'ROLE-CURRENT', activeRole, e.target.value);
            }}
            className="text-xs font-semibold text-[#222222] bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="Clinic Administrator">Clinic Administrator</option>
            <option value="Affiliated Doctor">Affiliated Doctor</option>
            <option value="Clinical Staff / Nurse">Clinical Staff / Nurse</option>
            <option value="Finance Team">Finance Team</option>
            <option value="Reception / Front Desk">Reception / Front Desk</option>
          </select>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
            activeTab === 'matrix' ? 'bg-[#222222] text-white' : 'bg-white border border-[#DDDDDD] text-[#717171] hover:text-[#222222]'
          }`}
        >
          Permission matrix
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
            activeTab === 'directory' ? 'bg-[#222222] text-white' : 'bg-white border border-[#DDDDDD] text-[#717171] hover:text-[#222222]'
          }`}
        >
          Staff directory ({staffMembers.length})
        </button>
      </div>

      {activeTab === 'matrix' && (
        <div className="border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden">
          <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#606060]">
              Granular Role Matrix
            </span>
            <span className="text-xs text-[#1fc16b] font-medium flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Compliant with healthcare data segregation rules</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f0f2f5] border-b border-[#e8e8e8] text-[#606060] uppercase text-[11px] font-semibold">
                  <th className="p-4">Functional Module</th>
                  <th className="p-4">Clinic Administrator</th>
                  <th className="p-4">Affiliated Doctor</th>
                  <th className="p-4">Clinical Staff / Nurse</th>
                  <th className="p-4">Finance Team</th>
                  <th className="p-4">Reception</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e8e8]">
                {rbacMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#f5f7fa]">
                    <td className="p-4 font-semibold text-[#0e162b]">{row.module}</td>
                    <td className="p-4 text-[#1fc16b] font-medium">{row.admin}</td>
                    <td className="p-4 text-[#0e162b] font-medium">{row.doctor}</td>
                    <td className="p-4 text-[#606060]">{row.nurse}</td>
                    <td className="p-4 text-[#606060]">{row.finance}</td>
                    <td className="p-4 text-[#606060]">{row.reception}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'directory' && (
        <div className="border border-[#e8e8e8] rounded-2xl bg-white overflow-hidden divide-y divide-[#e8e8e8] text-xs">
          {staffMembers.map((staff) => (
            <div key={staff.id} className="p-5 flex items-center justify-between hover:bg-[#f5f7fa] transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#f0f2f5] border border-[#e8e8e8] text-[#0e162b] flex items-center justify-center font-semibold text-xs">
                  {staff.name
                    ? staff.name
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join('')
                    : 'ST'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0e162b] text-sm">{staff.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0f2f5] text-[#606060]">
                      {staff.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#606060] mt-0.5">
                    {staff.email} · Department: {staff.department}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-[#606060]">
                <span className="text-[#1fc16b] font-medium block">{staff.status}</span>
                <span>Active {staff.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
