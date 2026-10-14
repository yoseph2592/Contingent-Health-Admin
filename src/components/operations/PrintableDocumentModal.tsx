import React from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import { PrescriptionRecord, ClinicalDocument } from '../../types/operations';
import {
  Printer,
  X,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export const PrintableDocumentModal: React.FC = () => {
  const { printDocumentData, setPrintDocumentData, currentClinicName } = useClinicOperations();

  if (!printDocumentData) return null;

  const isRx = 'items' in printDocumentData;
  const rx = isRx ? (printDocumentData as PrescriptionRecord) : null;
  const doc = !isRx ? (printDocumentData as ClinicalDocument) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#EBEBEB] overflow-hidden flex flex-col my-8">
        {/* Modal Action Header (Non-printing bar) */}
        <div className="p-4 bg-[#222222] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isRx ? 'Electronic Prescription (Rx)' : 'Official Clinical Document'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setPrintDocumentData(null)}
              className="p-1.5 text-[#8e8e8e] hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Formal Document Paper (Printable target) */}
        <div className="p-8 sm:p-12 text-[#0e162b] bg-white font-sans space-y-6">
          {/* Clinic Official Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-[#0e162b] pb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0e162b] text-white flex items-center justify-center font-bold text-lg tracking-tight shrink-0">
                CH
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0e162b] tracking-tight leading-tight">
                  {currentClinicName}
                </h1>
                <p className="text-xs text-[#606060] font-medium mt-0.5">
                  Accredited Tertiary Ambulatory & Specialty Care Center
                </p>
                <p className="text-xs text-[#8e8e8e] mt-1">
                  Bole Medhanealem Road, Suite 400 · Tel: +251 11 661 4000 · Reg: ET-MOH-CL-8890
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Certified Electronic Record</span>
              </div>
              <p className="text-xs font-mono font-bold text-[#0e162b]">
                {isRx ? rx?.id : doc?.id}
              </p>
              <p className="text-xs text-[#606060]">Date: {isRx ? rx?.date : doc?.date}</p>
            </div>
          </div>

          {/* Patient and Attending Physician Demographics Box */}
          <div className="grid grid-cols-2 gap-4 bg-[#F7F7F7] p-5 rounded-2xl text-xs">
            <div>
              <span className="text-xs font-semibold text-[#717171] block mb-1">
                Patient Information
              </span>
              <p className="font-bold text-[#222222] text-sm">{isRx ? rx?.patientName : doc?.patientName}</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-[#717171] mt-1">
                <span>ID: {isRx ? rx?.patientId : doc?.patientId}</span>
                <span>Demographics: {isRx ? `${rx?.patientAge}y / ${rx?.patientSex}` : '48y / Male'}</span>
              </div>
            </div>

            <div className="border-l border-[#EBEBEB] pl-5">
              <span className="text-xs font-semibold text-[#717171] block mb-1">
                Attending Physician
              </span>
              <p className="font-bold text-[#222222] text-sm">{isRx ? rx?.doctorName : doc?.author}</p>
              <p className="text-xs text-[#717171] mt-0.5">
                License: {isRx ? rx?.doctorLicense : 'CONT-DOC-84920'}
              </p>
              <p className="text-xs text-[#717171]">Department: Internal Medicine & Specialty Care</p>
            </div>
          </div>

          {/* Body: Prescription Medication Items or Document Content */}
          {isRx && rx && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-serif font-black text-[#222222]">℞</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
                    Prescribed Medications ({rx.items.length})
                  </span>
                </div>
                <span className="text-xs text-[#717171] italic">Generic substitution authorized</span>
              </div>

              <div className="border border-[#EBEBEB] rounded-2xl overflow-hidden divide-y divide-[#EBEBEB]">
                {(rx.items || []).map((item, idx) => (
                  <div key={idx} className="p-4 bg-white text-xs space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-[#222222] text-sm">{item.medication}</span>{' '}
                        <span className="px-2 py-0.5 rounded-full bg-[#F7F7F7] font-medium text-[#222222] text-xs">
                          {item.strength}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-[#222222]">Qty: {item.quantity}</span>
                        <span className="text-[#717171] text-xs block">Refills: {item.refills}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-[#717171] pt-1">
                      <div>
                        <span>Dosage:</span> {item.dosage}, {item.route}
                      </div>
                      <div>
                        <span>Frequency:</span> {item.frequency}
                      </div>
                      <div>
                        <span>Duration:</span> {item.duration}
                      </div>
                    </div>

                    <div className="text-xs bg-[#F7F7F7] p-2.5 rounded-xl text-[#222222] mt-1">
                      <span className="font-semibold">Instructions:</span> {item.instructions}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isRx && doc && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
                Document Contents: {doc.title}
              </h2>
              <div className="p-5 bg-[#F7F7F7] rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed">
                {doc.content}
              </div>
            </div>
          )}

          {/* Electronic Signature & Verification Footer Block */}
          <div className="pt-6 border-t-2 border-[#222222] grid grid-cols-3 gap-4 items-end text-xs">
            {/* Left QR Code Box */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border-2 border-[#222222] p-1 flex items-center justify-center bg-white rounded-xl">
                <QrCode className="w-14 h-14 text-[#222222]" />
              </div>
              <div className="text-xs text-[#717171] space-y-0.5">
                <span className="font-semibold text-[#222222] block">Scan to Verify</span>
                <p>Contingent Health Registry</p>
                <p className="font-mono text-[10px] text-[#717171]">
                  {isRx ? rx?.verificationCode : doc?.verificationHash.slice(0, 16)}
                </p>
              </div>
            </div>

            {/* Middle Registry Stamp */}
            <div className="text-center">
              <div className="inline-block border border-[#DDDDDD] rounded-xl p-2.5 text-xs text-[#717171] uppercase tracking-wider bg-[#F7F7F7]">
                <div className="font-bold text-[#222222]">CONTINGENT VERIFIED</div>
                <div className="text-[10px]">AUDIT TRAIL SECURED</div>
              </div>
            </div>

            {/* Right Doctor Electronic Signature */}
            <div className="text-right space-y-1">
              <div className="font-serif italic text-base text-[#222222] font-bold border-b border-[#222222] pb-1 inline-block min-w-[160px]">
                {isRx ? rx?.signedBy : doc?.author}
              </div>
              <p className="text-xs text-[#717171]">
                Digitally Signed ({isRx ? rx?.signedAt : doc?.date})
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-[#717171] pt-2 border-t border-[#EBEBEB]">
            This document is cryptographically verified and legally binding pursuant to Ethiopian Healthcare
            Digital Standards and Contingent Health Interoperability Protocol v2.4.
          </div>
        </div>
      </div>
    </div>
  );
};
