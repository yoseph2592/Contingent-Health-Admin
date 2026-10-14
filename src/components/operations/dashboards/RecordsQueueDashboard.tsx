import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  FolderLock,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  Printer,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { ClinicalDocument } from '../../../types/operations';

export const RecordsQueueDashboard: React.FC = () => {
  const {
    documents,
    appointments,
    activeEncounter,
    setPrintDocumentData,
  } = useClinicOperations();

  const [filterCategory, setFilterCategory] = useState<'ALL' | 'UNVERIFIED' | 'MISSING' | 'SIGNED'>('ALL');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents[0]?.id || null);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const incompleteEncounters = appointments.filter((a) => a.status === 'Completed' && !activeEncounter.isLocked);
  const finalSignedDocs = documents.filter((d) => d.status === 'Final / Signed');

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Medical Records & Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Documentation Queue
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Verification, digital signature seal compliance, and health record archival
          </p>
        </div>
      </div>

      {/* Priority Flags */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 space-y-1">
          <span className="text-xs text-[#606060]">Archived Documents</span>
          <div className="text-2xl font-semibold text-[#0e162b]">{documents.length}</div>
          <p className="text-[11px] text-[#1fc16b] font-medium">100% Cryptographic integrity</p>
        </div>

        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 space-y-1">
          <span className="text-xs text-[#606060]">Incomplete Encounter Notes</span>
          <div className="text-2xl font-semibold text-[#0e162b]">{incompleteEncounters.length}</div>
          <p className="text-[11px] text-[#d00416] font-medium">Physician lock pending</p>
        </div>

        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-4 space-y-1">
          <span className="text-xs text-[#606060]">Signed & Sealed Records</span>
          <div className="text-2xl font-semibold text-[#0e162b]">{finalSignedDocs.length}</div>
          <p className="text-[11px] text-[#606060]">Ready for release</p>
        </div>
      </div>

      {/* Documents Two-Column Queue & Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Document List */}
        <div className="lg:col-span-6 bg-white border border-[#e8e8e8] rounded-2xl p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#606060]">
            Clinical Documents List ({documents.length})
          </h2>

          <div className="divide-y divide-[#e8e8e8]">
            {documents.map((doc) => {
              const isSelected = doc.id === selectedDocId;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`py-3.5 px-3 rounded-xl transition-all cursor-pointer ${
                    isSelected ? 'bg-[#f0f2f5] border-l-2 border-[#00c0fe]' : 'hover:bg-[#f5f7fa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#0e162b]">{doc.title}</span>
                    <span className="text-[11px] font-mono text-[#8e8e8e]">{doc.id}</span>
                  </div>

                  <p className="text-xs text-[#606060] mt-0.5">
                    Patient: {doc.patientName} · Author: {doc.author} ({doc.authorRole})
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#84ebb4]/25 text-[#1fc16b]">
                      {doc.status}
                    </span>
                    <span className="text-[10px] text-[#8e8e8e]">{doc.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Document Viewer & Verification Seal */}
        {selectedDoc && (
          <div className="lg:col-span-6 bg-white border border-[#EBEBEB] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-4">
              <div>
                <span className="text-xs text-[#717171]">{selectedDoc.category}</span>
                <h3 className="text-lg font-semibold text-[#222222] mt-0.5">
                  {selectedDoc.title}
                </h3>
                <p className="text-xs text-[#717171]">
                  Record ID: {selectedDoc.id} · Version {selectedDoc.version}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPrintDocumentData(selectedDoc)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#DDDDDD] hover:border-[#222222] rounded-full text-xs font-medium text-[#222222] transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-[#717171]" />
                <span>Print / Export</span>
              </button>
            </div>

            <div className="p-4 bg-[#F7F7F7] rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#717171]">Patient:</span>
                <strong className="text-[#222222]">{selectedDoc.patientName} ({selectedDoc.patientId})</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#717171]">Signing Author:</span>
                <strong className="text-[#222222]">{selectedDoc.author}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#717171]">Verification Hash:</span>
                <code className="text-[10px] font-mono text-[#717171] truncate max-w-[200px]">
                  {selectedDoc.verificationHash}
                </code>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block mb-1.5">
                Clinical Content
              </span>
              <div className="p-3.5 bg-white border border-[#EBEBEB] rounded-xl text-xs text-[#222222] font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {selectedDoc.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#1fc16b] flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified in immutable health archive</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
