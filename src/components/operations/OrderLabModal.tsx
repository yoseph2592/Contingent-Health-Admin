import React, { useState } from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import { X, CheckCircle2 } from 'lucide-react';

export const OrderLabModal: React.FC = () => {
  const { isOrderLabModalOpen, setIsOrderLabModalOpen, orderLabTest, activeEncounter } =
    useClinicOperations();

  const [testType, setTestType] = useState('Comprehensive Metabolic Panel (CMP)');
  const [department, setDepartment] = useState('Clinical Biochemistry');
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'STAT'>('Routine');
  const [clinicalIndication, setClinicalIndication] = useState(
    'Monitor renal and electrolyte baseline following antihypertensive medication switch'
  );
  const [instructions, setInstructions] = useState('10-hour overnight fasting required before venipuncture.');

  const popularTests = [
    { name: 'Comprehensive Metabolic Panel (CMP)', dept: 'Clinical Biochemistry' },
    { name: 'Glycated Hemoglobin (HbA1c)', dept: 'Clinical Chemistry & Endocrinology' },
    { name: 'Complete Blood Count (CBC) with Diff', dept: 'Hematology' },
    { name: 'Lipid Panel (TC, HDL, LDL, Triglycerides)', dept: 'Clinical Chemistry' },
    { name: 'Thyroid Stimulating Hormone (TSH)', dept: 'Endocrinology' },
    { name: 'Transthoracic Echocardiogram (TTE)', dept: 'Cardiovascular Imaging' },
  ];

  if (!isOrderLabModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testType.trim()) return;
    orderLabTest(testType, department, clinicalIndication, priority, instructions);
    setIsOrderLabModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#EBEBEB] overflow-hidden flex flex-col my-8">
        <div className="p-6 border-b border-[#EBEBEB] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#222222]">Order Diagnostic / Lab Test</h2>
            <p className="text-xs text-[#717171] mt-0.5">
              Patient: <span className="font-semibold text-[#222222]">{activeEncounter.patientName}</span> ({activeEncounter.patientId})
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOrderLabModalOpen(false)}
            className="p-2 text-[#717171] hover:text-[#222222] rounded-full hover:bg-[#F7F7F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Quick Select Common Tests */}
          <div>
            <span className="text-xs font-semibold text-[#222222] block mb-2">
              Common Diagnostic Orders
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularTests.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => {
                    setTestType(t.name);
                    setDepartment(t.dept);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    testType === t.name
                      ? 'bg-[#222222] text-white'
                      : 'bg-[#F7F7F7] text-[#717171] hover:text-[#222222]'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#222222] block mb-1.5">
              Diagnostic Test / Procedure Name *
            </label>
            <input
              type="text"
              required
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#717171] block mb-1">
                Laboratory Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#717171] block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none"
              >
                <option value="Routine">Routine (Next available)</option>
                <option value="Urgent">Urgent (Within 4 hours)</option>
                <option value="STAT">STAT (Immediate emergency)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#717171] block mb-1">
              Clinical Indication / Justification
            </label>
            <textarea
              rows={2}
              value={clinicalIndication}
              onChange={(e) => setClinicalIndication(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#717171] block mb-1">
              Patient Prep & Specimen Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Fasting, bring current medications..."
              className="w-full px-3.5 py-2 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#e8e8e8] flex items-center justify-between">
            <div className="text-xs text-[#606060] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1fc16b]" />
              <span>Transmits directly to laboratory LIS</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOrderLabModalOpen(false)}
                className="px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full font-medium text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs transition-colors shadow-xs"
              >
                Place order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
