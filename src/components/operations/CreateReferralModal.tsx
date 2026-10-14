import React, { useState } from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import { X, CheckCircle2 } from 'lucide-react';

export const CreateReferralModal: React.FC = () => {
  const { isReferralModalOpen, setIsReferralModalOpen, createReferralOrder, activeEncounter } =
    useClinicOperations();

  const [destinationFacility, setDestinationFacility] = useState('Apex Heart & Vascular Institute');
  const [destinationSpecialty, setDestinationSpecialty] = useState('Cardiovascular Imaging / Echocardiography');
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Immediate'>('Routine');
  const [reason, setReason] = useState(
    'Transthoracic Echocardiogram (TTE) for LV wall thickness and diastolic function evaluation.'
  );
  const [requestedService, setRequestedService] = useState('Comprehensive Doppler Transthoracic Echo');

  if (!isReferralModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReferralOrder(destinationFacility, destinationSpecialty, urgency, reason, requestedService);
    setIsReferralModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#EBEBEB] overflow-hidden flex flex-col my-8">
        <div className="p-6 border-b border-[#EBEBEB] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#222222]">Create Clinical Referral Order</h2>
            <p className="text-xs text-[#717171] mt-0.5">
              Patient: <span className="font-semibold text-[#222222]">{activeEncounter.patientName}</span> ({activeEncounter.patientId})
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsReferralModalOpen(false)}
            className="p-2 text-[#717171] hover:text-[#222222] rounded-full hover:bg-[#F7F7F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          <div>
            <label className="text-xs font-semibold text-[#222222] block mb-1.5">
              Destination Healthcare Facility *
            </label>
            <input
              type="text"
              required
              value={destinationFacility}
              onChange={(e) => setDestinationFacility(e.target.value)}
              placeholder="e.g. Apex Heart & Vascular Institute"
              className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#717171] block mb-1">
                Target Specialty / Service
              </label>
              <input
                type="text"
                required
                value={destinationSpecialty}
                onChange={(e) => setDestinationSpecialty(e.target.value)}
                placeholder="e.g. Cardiology, Orthopedics"
                className="w-full px-3 py-2 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#717171] block mb-1">
                Referral Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none"
              >
                <option value="Routine">Routine (Within 30 days)</option>
                <option value="Urgent">Urgent (Within 7 days)</option>
                <option value="Immediate">Immediate / STAT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#717171] block mb-1">
              Requested Service / Procedure
            </label>
            <input
              type="text"
              required
              value={requestedService}
              onChange={(e) => setRequestedService(e.target.value)}
              placeholder="e.g. 2D Doppler Echocardiography"
              className="w-full px-3 py-2 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#717171] block mb-1">
              Clinical Reason for Referral
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none resize-none"
            />
          </div>

          <div className="pt-4 border-t border-[#e8e8e8] flex items-center justify-between">
            <div className="text-xs text-[#606060] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1fc16b]" />
              <span>Includes attached clinical notes</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReferralModalOpen(false)}
                className="px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full font-medium text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs transition-colors shadow-xs"
              >
                Dispatch referral
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
