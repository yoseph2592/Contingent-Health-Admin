import React, { useState, useRef } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { DoctorVerificationStatus, DoctorVerificationDocument } from '../../types';
import {
  FileCheck2,
  UploadCloud,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  ExternalLink,
  Lock,
} from 'lucide-react';

export const ScreenDoctorVerification: React.FC = () => {
  const {
    profile,
    account,
    verificationStatus,
    setVerificationStatus,
    verificationDocuments,
    addVerificationDocument,
    removeVerificationDocument,
    simulateVerificationCheck,
    setCurrentStep,
  } = useDoctor();

  const [activeUploadType, setActiveUploadType] = useState<'medical_license' | 'identity_doc' | 'supporting_credential'>('medical_license');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const titles: Record<string, string> = {
      medical_license: `Medical License - ${profile.licenseNumber || 'Verified License'}`,
      identity_doc: `Government ID - ${account.fullName || 'Practitioner'}`,
      supporting_credential: `Specialty Board Certificate - ${profile.specialty}`,
    };

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    addVerificationDocument({
      type: activeUploadType,
      title: titles[activeUploadType],
      fileName: file.name,
      fileSize: sizeInMb === '0.0 MB' ? '0.8 MB' : sizeInMb,
      status: 'valid',
      previewUrl: URL.createObjectURL(file),
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadSampleDocs = () => {
    // Adds standard sample docs if missing
    if (verificationDocuments.length < 2) {
      addVerificationDocument({
        type: 'medical_license',
        title: `National Medical Council License (${profile.licensingCountry})`,
        fileName: 'MOH_Medical_Practice_License_2025.pdf',
        fileSize: '2.1 MB',
        status: 'valid',
      });
      addVerificationDocument({
        type: 'identity_doc',
        title: 'National Identity / Passport Biometric Page',
        fileName: 'National_ID_Passport_Copy.pdf',
        fileSize: '1.8 MB',
        status: 'valid',
      });
    }
  };

  const triggerUpload = (type: 'medical_license' | 'identity_doc' | 'supporting_credential') => {
    setActiveUploadType(type);
    fileInputRef.current?.click();
  };

  const hasLicense = verificationDocuments.some((d) => d.type === 'medical_license');
  const hasId = verificationDocuments.some((d) => d.type === 'identity_doc');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />

      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium mb-2 border border-emerald-200">
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Step 4 of 5 · Credential Integrity & Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Professional Medical Verification
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
          Contingent verifies every healthcare practitioner directly with official medical regulatory boards and licensing authorities before issuing your public verified badge.
        </p>
      </div>

      {/* Key Architectural Distinction Callout */}
      <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start space-x-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h2 className="font-bold text-emerald-950">
            Professional Verification vs. Clinic Affiliation
          </h2>
          <p className="mt-0.5 text-emerald-900 leading-relaxed">
            <strong>Professional Verification</strong> confirms your identity, medical training, and legal license to practice medicine. It belongs entirely to <em>you as a physician</em>. Even if you change clinics or practice independently, your Contingent Medical Verification remains permanent and portable across the platform.
          </p>
        </div>
      </div>

      {/* Verification Status Simulator Bar */}
      <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="text-xs">
            <span className="text-slate-500 font-medium">Verification Status: </span>
            {verificationStatus === 'Verified' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 ml-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified by Contingent Board</span>
              </span>
            )}
            {verificationStatus === 'Pending' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 ml-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Verification Pending Triage</span>
              </span>
            )}
            {verificationStatus === 'Needs Review' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 ml-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Needs Clarification / Re-Scan</span>
              </span>
            )}
          </div>
        </div>

        {/* Demo Status Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400">Simulate status:</span>
          {(['Pending', 'Verified', 'Needs Review'] as DoctorVerificationStatus[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setVerificationStatus(st)}
              className={`px-2 py-1 text-[11px] font-medium rounded-md border transition-colors ${
                verificationStatus === st
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* 1. Medical License (Required) */}
        <div className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${hasLicense ? 'border-emerald-300 ring-1 ring-emerald-300' : 'border-slate-200'}`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Required
              </span>
              {hasLicense && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <h2 className="text-sm font-bold text-slate-900">Medical License / Certificate</h2>
            <p className="text-xs text-slate-500 mt-1">
              Current practice license or registration certificate from your national medical council.
            </p>
            <div className="mt-3 p-2 bg-slate-50 rounded text-[11px] text-slate-600 font-mono">
              Lic: {profile.licenseNumber || 'Pending'} ({profile.licensingCountry})
            </div>
          </div>

          <button
            type="button"
            onClick={() => triggerUpload('medical_license')}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
            <span>{hasLicense ? 'Upload Replacement' : 'Upload License (PDF/PNG)'}</span>
          </button>
        </div>

        {/* 2. Identity Document (Required) */}
        <div className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${hasId ? 'border-emerald-300 ring-1 ring-emerald-300' : 'border-slate-200'}`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Required
              </span>
              {hasId && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <h2 className="text-sm font-bold text-slate-900">Government Identity Document</h2>
            <p className="text-xs text-slate-500 mt-1">
              Valid passport, national biometric ID card, or official driver's license with clear photo.
            </p>
            <div className="mt-3 p-2 bg-slate-50 rounded text-[11px] text-slate-600">
              Name: <strong>{account.fullName}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => triggerUpload('identity_doc')}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
            <span>{hasId ? 'Upload Replacement' : 'Upload ID Document'}</span>
          </button>
        </div>

        {/* 3. Supporting Credentials (Optional) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium tracking-wider uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Optional
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-900">Supporting Specialty Credentials</h2>
            <p className="text-xs text-slate-500 mt-1">
              Board certification diplomas, sub-specialty fellowships, postgraduate awards, or academic honors.
            </p>
            <div className="mt-3 p-2 bg-slate-50 rounded text-[11px] text-slate-600">
              Specialty: {profile.specialty}
            </div>
          </div>

          <button
            type="button"
            onClick={() => triggerUpload('supporting_credential')}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
            <span>Add Specialty Credential</span>
          </button>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Uploaded Credential Files ({verificationDocuments.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Files are encrypted with AES-256 and only accessible to accredited Contingent verifiers.
            </p>
          </div>

          {verificationDocuments.length < 2 && (
            <button
              type="button"
              onClick={loadSampleDocs}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Files</span>
            </button>
          )}
        </div>

        {verificationDocuments.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-medium">No documents uploaded yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Please upload your medical license and government ID above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {verificationDocuments.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {doc.title}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <span className="font-mono">{doc.fileName}</span>
                      <span className="text-slate-300">·</span>
                      <span>{doc.fileSize}</span>
                      <span className="text-slate-300">·</span>
                      <span>Uploaded {doc.uploadedAt}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Uploaded & Encrypted</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => removeVerificationDocument(doc.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    title="Remove document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security & Regulatory Guarantee */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3 text-xs text-slate-600 mb-8">
        <Lock className="w-5 h-5 text-slate-500 shrink-0" />
        <p>
          <strong className="text-slate-900">Regulatory Security Guarantee:</strong> Contingent complies with national health data governance standards. Medical documents are verified through encrypted channels and never shared with third-party advertisers.
        </p>
      </div>

      {/* Navigation */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-200">
        <button
          type="button"
          onClick={() => setCurrentStep('affiliation')}
          className="inline-flex items-center space-x-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Affiliation</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentStep('review')}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-xs transition-colors"
        >
          <span>Continue to Review & Submit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
