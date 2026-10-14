import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { ShieldCheck, Search, Download } from 'lucide-react';

export const ViewAuditLog: React.FC = () => {
  const { auditLogs } = useClinicOperations();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Regulatory Ledger
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Audit Trail
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Immutable, cryptographically verified record across clinical and financial transactions
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Exporting cryptographic audit log bundle (CSV/JSON)...')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#DDDDDD] hover:border-[#222222] bg-white text-[#222222] rounded-full text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#717171]" />
          <span>Export audit trail</span>
        </button>
      </div>

      {/* Search and count */}
      <div className="border border-[#EBEBEB] rounded-2xl bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[#717171]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by action, actor, entity ID..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-full text-xs text-[#222222] placeholder-[#717171] focus:outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-[#717171]">
          {filtered.length} Recorded events
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden divide-y divide-[#EBEBEB] text-xs">
        {filtered.map((log) => (
          <div key={log.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAFA] transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-[#f0f2f5] text-[#0e162b] shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-[#1fc16b]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0e162b] text-sm">{log.action}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f0f2f5] text-[#606060] text-xs font-mono">
                    {log.entityType} ({log.entityId})
                  </span>
                </div>
                <p className="text-xs text-[#606060] mt-1">
                  Actor: <strong className="text-[#0e162b] font-semibold">{log.userName}</strong> · Role:{' '}
                  <span className="text-[#0e162b]">{log.userRole}</span>
                </p>
                {(log.previousState || log.newState) && (
                  <p className="text-xs text-[#606060] mt-0.5 font-mono">
                    Transition: <span className="line-through">{log.previousState}</span> →{' '}
                    <span className="text-[#1fc16b] font-semibold">{log.newState}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="text-right text-xs text-[#717171] font-mono shrink-0">
              <span className="block">{log.timestamp}</span>
              <span className="text-[11px]">IP: {log.ipAddress}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
