import React, { useState } from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import { PrescriptionItem } from '../../types/operations';
import { Plus, Trash2, X, CheckCircle2 } from 'lucide-react';

export const PrescribeMedicationModal: React.FC = () => {
  const { isPrescribeModalOpen, setIsPrescribeModalOpen, createPrescription, activeEncounter } =
    useClinicOperations();

  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      medication: 'Valsartan / Hydrochlorothiazide',
      strength: '80 mg / 12.5 mg',
      dosage: '1 Tablet',
      route: 'Oral',
      frequency: 'Once Daily in Morning',
      duration: '30 Days',
      quantity: 30,
      refills: 2,
      instructions: 'Take 1 tablet every morning with water.',
      indication: 'Essential Hypertension',
    },
  ]);

  const [commonDrugs] = useState([
    { name: 'Amlodipine Besylate', strength: '5 mg', route: 'Oral', freq: 'Once Daily' },
    { name: 'Metformin HCl', strength: '850 mg', route: 'Oral', freq: 'Twice Daily with Meals' },
    { name: 'Atorvastatin Calcium', strength: '20 mg', route: 'Oral', freq: 'At Bedtime' },
    { name: 'Lisinopril', strength: '10 mg', route: 'Oral', freq: 'Once Daily in Morning' },
    { name: 'Azithromycin', strength: '500 mg', route: 'Oral', freq: 'Once Daily for 3 Days' },
    { name: 'Omeprazole', strength: '20 mg', route: 'Oral', freq: 'Before Breakfast' },
  ]);

  if (!isPrescribeModalOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        medication: '',
        strength: '',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'Once Daily',
        duration: '30 Days',
        quantity: 30,
        refills: 0,
        instructions: '',
        indication: activeEncounter.diagnoses[0]?.description || '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof PrescriptionItem, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSelectQuickDrug = (index: number, drug: typeof commonDrugs[0]) => {
    handleUpdateItem(index, 'medication', drug.name);
    handleUpdateItem(index, 'strength', drug.strength);
    handleUpdateItem(index, 'route', drug.route);
    handleUpdateItem(index, 'frequency', drug.freq);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some((i) => !i.medication.trim())) {
      alert('Please enter medication name for all items');
      return;
    }
    createPrescription(items);
    setIsPrescribeModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#EBEBEB] overflow-hidden flex flex-col my-8">
        <div className="p-6 border-b border-[#EBEBEB] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#222222]">Issue Electronic Prescription</h2>
            <p className="text-xs text-[#717171] mt-0.5">
              Patient: <span className="font-semibold text-[#222222]">{activeEncounter.patientName}</span> ({activeEncounter.patientId})
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPrescribeModalOpen(false)}
            className="p-2 text-[#717171] hover:text-[#222222] rounded-full hover:bg-[#F7F7F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] space-y-6 text-xs">
          {items.map((item, idx) => (
            <div key={idx} className="p-5 bg-[#F7F7F7] rounded-2xl space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#222222] text-xs">Medication #{idx + 1}</span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-[#606060] hover:text-[#fb3748] p-1 flex items-center gap-1 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {/* Quick Select Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-xs text-[#717171] font-medium shrink-0">Quick fill:</span>
                {commonDrugs.map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => handleSelectQuickDrug(idx, d)}
                    className="px-3 py-1 rounded-full bg-white border border-[#DDDDDD] hover:border-[#222222] text-xs text-[#222222] shrink-0 transition-colors"
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#222222] block mb-1.5">
                    Drug Name & Formulation *
                  </label>
                  <input
                    type="text"
                    required
                    value={item.medication}
                    onChange={(e) => handleUpdateItem(idx, 'medication', e.target.value)}
                    placeholder="e.g. Valsartan, Metformin"
                    className="w-full px-3.5 py-2 bg-white border border-transparent focus:border-[#DDDDDD] rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#222222] block mb-1.5">
                    Strength *
                  </label>
                  <input
                    type="text"
                    required
                    value={item.strength}
                    onChange={(e) => handleUpdateItem(idx, 'strength', e.target.value)}
                    placeholder="e.g. 80mg, 500mg"
                    className="w-full px-3.5 py-2 bg-white border border-transparent focus:border-[#DDDDDD] rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-xs text-[#717171] block mb-1">Dosage Unit</label>
                  <input
                    type="text"
                    value={item.dosage}
                    onChange={(e) => handleUpdateItem(idx, 'dosage', e.target.value)}
                    placeholder="1 Tablet"
                    className="w-full px-3 py-1.5 bg-white border border-transparent focus:border-[#DDDDDD] rounded-xl text-xs text-[#222222] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#717171] block mb-1">Route</label>
                  <select
                    value={item.route}
                    onChange={(e) => handleUpdateItem(idx, 'route', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-transparent focus:border-[#DDDDDD] rounded-xl text-xs text-[#222222] focus:outline-none"
                  >
                    <option value="Oral">Oral</option>
                    <option value="Sublingual">Sublingual</option>
                    <option value="Topical">Topical</option>
                    <option value="Inhalation">Inhalation</option>
                    <option value="Subcutaneous">Subcutaneous</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#717171] block mb-1">Frequency</label>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e) => handleUpdateItem(idx, 'frequency', e.target.value)}
                    placeholder="Once Daily"
                    className="w-full px-3 py-1.5 bg-white border border-transparent focus:border-[#DDDDDD] rounded-xl text-xs text-[#222222] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#717171] block mb-1">Duration</label>
                  <input
                    type="text"
                    value={item.duration}
                    onChange={(e) => handleUpdateItem(idx, 'duration', e.target.value)}
                    placeholder="30 Days"
                    className="w-full px-3 py-1.5 bg-white border border-transparent focus:border-[#DDDDDD] rounded-xl text-xs text-[#222222] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#717171] block mb-1">Total Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 bg-white border border-transparent focus:border-[#DDDDDD] rounded-xl text-xs text-[#222222] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#717171] block mb-1">Refills Allowed</label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={item.refills}
                    onChange={(e) => handleUpdateItem(idx, 'refills', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-transparent focus:border-[#DDDDDD] rounded-xl text-xs text-[#222222] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#717171] block mb-1">Patient Instructions (Sig)</label>
                <input
                  type="text"
                  value={item.instructions}
                  onChange={(e) => handleUpdateItem(idx, 'instructions', e.target.value)}
                  placeholder="Take 1 tablet every morning with water before food."
                  className="w-full px-3.5 py-2 bg-white border border-transparent focus:border-[#DDDDDD] rounded-xl text-xs text-[#222222] focus:outline-none"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-3 border border-dashed border-[#DDDDDD] hover:border-[#222222] rounded-2xl text-[#717171] hover:text-[#222222] font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add another medication</span>
          </button>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#e8e8e8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[#606060] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1fc16b]" />
              <span>Generates QR token and live syncs to patient mobile app</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setIsPrescribeModalOpen(false)}
                className="px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full font-medium text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs transition-colors shadow-xs"
              >
                Sign & transmit Rx
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
