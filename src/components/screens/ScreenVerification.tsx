import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  ShieldCheck,
  FileCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Trash2,
  Lock,
} from 'lucide-react';
import { VerificationStatus } from '../../types';

export const ScreenVerification: React.FC = () => {
  const { verification, setVerification, setCurrentStep, brandTheme } = useClinic();
  const [docName, setDocName] = useState('');

  const statusBadges: Record<string, { label: string; color: string; icon: any }> = {
    not_started: { label: 'Not Started', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Clock },
    'Not Started': { label: 'Not Started', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Clock },
    draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Clock },
    Draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Clock },
    submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Clock },
    Submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Clock },
    under_review: { label: 'Under Review by Contingent', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: Clock },
    'Under Review': { label: 'Under Review by Contingent', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: Clock },
    approved: { label: 'Approved & Credentialed', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle2 },
    Approved: { label: 'Approved & Credentialed', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle2 },
    requires_correction: { label: 'Requires Correction', color: 'bg-orange-100 text-orange-800 border-orange-300', icon: AlertCircle },
    'Requires Correction': { label: 'Requires Correction', color: 'bg-orange-100 text-orange-800 border-orange-300', icon: AlertCircle },
    rejected: { label: 'Application Rejected', color: 'bg-red-100 text-red-800 border-red-300', icon: AlertCircle },
    Rejected: { label: 'Application Rejected', color: 'bg-red-100 text-red-800 border-red-300', icon: AlertCircle },
  };

  const currentBadge = statusBadges[verification.status] || statusBadges.approved;
  const StatusIcon = currentBadge.icon;

  const handleAddDocument = () => {
    if (!docName.trim()) return;
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      type: 'Supporting Medical Compliance Cert',
      size: '2.1 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'valid' as const,
    };
    setVerification({
      ...verification,
      documents: [...verification.documents, newDoc],
    });
    setDocName('');
  };

  const removeDoc = (id: string) => {
    setVerification({
      ...verification,
      documents: verification.documents.filter((d) => d.id !== id),
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Contingent Organization Verification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verify your clinic
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Your clinic must be verified by the Contingent Compliance Team before services can be published.
            </p>
          </div>

          {/* Current Status Badge */}
          <div className="shrink-0">
            <span
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${currentBadge.color}`}
            >
              <StatusIcon className="w-4 h-4" />
              <span>{currentBadge.label}</span>
            </span>
          </div>
        </div>

        {/* State testing switcher for review convenience */}
        <div className="mb-8 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-600">
            Verification Review Status:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(['under_review', 'approved', 'requires_correction'] as VerificationStatus[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setVerification({ ...verification, status: st })}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all capitalize ${
                  verification.status === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Legal Registered Clinic / Entity Name *
            </label>
            <input
              type="text"
              value={verification.legalClinicName}
              onChange={(e) =>
                setVerification({ ...verification, legalClinicName: e.target.value })
              }
              placeholder="e.g. St. Gabriel Specialized Health Services PLC"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Commercial Registration # *
              </label>
              <input
                type="text"
                value={verification.registrationNumber}
                onChange={(e) =>
                  setVerification({ ...verification, registrationNumber: e.target.value })
                }
                placeholder="e.g. AA/EFDA/HL-2024/9021"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Facility Healthcare License # *
              </label>
              <input
                type="text"
                value={verification.facilityLicenseNumber}
                onChange={(e) =>
                  setVerification({ ...verification, facilityLicenseNumber: e.target.value })
                }
                placeholder="e.g. MOH-MED-FAC-88941"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Authorized Legal Representative
            </label>
            <input
              type="text"
              value={verification.authorizedRepresentative}
              onChange={(e) =>
                setVerification({ ...verification, authorizedRepresentative: e.target.value })
              }
              placeholder="Full name and title"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Uploaded Documents Section */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Required Verification Documents
          </label>

          {/* List of uploaded documents */}
          <div className="space-y-2 mb-4">
            {verification.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {doc.type} · {doc.size} · Uploaded on {doc.uploadDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Validated
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDoc(doc.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom document attachment */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Attach another document (e.g. Pharmacy_Board_License.pdf)"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleAddDocument}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Attach</span>
            </button>
          </div>
        </div>

        {/* Navigation actions */}
        <div className="mt-8 pt-4 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentStep('location')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Back
          </button>

          <button
            id="verification-continue-btn"
            onClick={() => setCurrentStep('setup')}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-xs transition-all hover:opacity-90 active:scale-[0.99]"
            style={{
              backgroundColor: brandTheme.palette.primary,
              color: brandTheme.palette.primaryContrast,
            }}
          >
            <span>Continue to Setup Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
