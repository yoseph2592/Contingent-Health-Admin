import React, { useState } from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  Pill,
  FlaskConical,
  Share2,
  FileSignature,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DIAGNOSTIC_TEST_SCHEMAS, getTestResultSchema, DiagnosticTestSchema } from './OrderLabModal';
import { LabRequestRecord, LabResultParameter } from '../../types/operations';

interface DoctorEncounterResultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorEncounterResultModal: React.FC<DoctorEncounterResultModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    activeEncounter,
    setActiveEncounter,
    updateEncounterVitals,
    updateEncounterAssessment,
    addEncounterDiagnosis,
    signAndCompleteEncounter,
    selectedPatient,
    setIsPrescribeModalOpen,
    setIsOrderLabModalOpen,
    setIsReferralModalOpen,
    orderLabTest,
    updateLabResults,
    prescriptions,
    labRequests,
    referrals,
    setPrintDocumentData,
  } = useClinicOperations();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Local form state for Vitals (Step 1)
  const [vitals, setVitals] = useState({
    bloodPressure: activeEncounter.vitals?.bloodPressure || '124/82',
    heartRate: activeEncounter.vitals?.heartRate || 74,
    spO2: activeEncounter.vitals?.spO2 || 98,
    temperature: activeEncounter.vitals?.temperature || 36.8,
    weightKg: activeEncounter.vitals?.weightKg || 78.5,
    heightCm: activeEncounter.vitals?.heightCm || 176,
  });

  // Local form state for SOAP & Notes (Step 2)
  const [chiefComplaint, setChiefComplaint] = useState(
    activeEncounter.chiefComplaint || 'Persistent evening tension headache and routine hypertension follow-up'
  );
  const [hpiText, setHpiText] = useState(
    'Patient reports 3-week history of bilateral frontal throbbing headaches, typically worsening toward evening. No aura, photophobia, or nausea. Compliant with morning amlodipine.'
  );
  const [physicalExamNotes, setPhysicalExamNotes] = useState(
    'Alert and oriented x3. HEENT normocephalic, PERRLA. Cardiovascular: Regular rate and rhythm, no murmurs. Lungs clear to auscultation bilaterally. Neurologic: Cranial nerves II-XII grossly intact, gait normal.'
  );

  // Local form state for Assessment (Step 3)
  const [assessmentText, setAssessmentText] = useState(
    activeEncounter.assessment || 'Essential hypertension, moderately controlled on monotherapy; tension-type headache likely stress-related.'
  );
  const [newDiagnosisCode, setNewDiagnosisCode] = useState('');
  const [newDiagnosisDesc, setNewDiagnosisDesc] = useState('');
  const [newDiagnosisType, setNewDiagnosisType] = useState<'Primary' | 'Secondary'>('Secondary');
  const [isAddingDiagnosis, setIsAddingDiagnosis] = useState(false);

  // Common quick-pick ICD-10 list
  const quickDiagnoses = [
    { code: 'I10', desc: 'Essential (primary) hypertension' },
    { code: 'G44.209', desc: 'Tension-type headache, unspecified' },
    { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications' },
    { code: 'J06.9', desc: 'Acute upper respiratory infection' },
    { code: 'M54.5', desc: 'Low back pain' },
    { code: 'K21.9', desc: 'GERD without esophagitis' },
  ];

  // Local form state for Treatment & Orders (Step 4)
  const [patientInstructions, setPatientInstructions] = useState(
    activeEncounter.patientInstructions || 'Keep a twice-daily blood pressure log for 14 days. Limit sodium intake to <2,000mg/day. Stay well hydrated and maintain regular sleep hygiene.'
  );
  const [followUpDate, setFollowUpDate] = useState(
    activeEncounter.followUpDate || '2026-09-29'
  );

  // Step 4 Inline Diagnostic Lab & Result Entry State
  const [isInlineLabBuilderOpen, setIsInlineLabBuilderOpen] = useState(true);
  const [editingLabId, setEditingLabId] = useState<string | null>(null);
  const [selectedLabSchemaName, setSelectedLabSchemaName] = useState<string>(
    DIAGNOSTIC_TEST_SCHEMAS[0].name
  );
  const [labPriority, setLabPriority] = useState<'Routine' | 'Urgent' | 'STAT'>('Routine');
  const [labIndication, setLabIndication] = useState<string>(
    DIAGNOSTIC_TEST_SCHEMAS[0].defaultIndication
  );
  const [labParamValues, setLabParamValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    DIAGNOSTIC_TEST_SCHEMAS[0].parameters.forEach((p) => {
      init[p.key] = p.demoValue;
    });
    return init;
  });
  const [labInterpretation, setLabInterpretation] = useState<string>(
    DIAGNOSTIC_TEST_SCHEMAS[0].defaultInterpretation
  );
  const [labAbnormalFlag, setLabAbnormalFlag] = useState<boolean>(
    Boolean(DIAGNOSTIC_TEST_SCHEMAS[0].defaultAbnormal)
  );

  const activeLabSchema: DiagnosticTestSchema = getTestResultSchema(selectedLabSchemaName);

  const handleSelectInlineTest = (schema: DiagnosticTestSchema) => {
    setEditingLabId(null);
    setSelectedLabSchemaName(schema.name);
    setLabIndication(schema.defaultIndication);
    const nextParams: Record<string, string> = {};
    schema.parameters.forEach((p) => {
      nextParams[p.key] = p.demoValue;
    });
    setLabParamValues(nextParams);
    setLabInterpretation(schema.defaultInterpretation);
    setLabAbnormalFlag(Boolean(schema.defaultAbnormal));
    setIsInlineLabBuilderOpen(true);
  };

  const handleStartEditExistingLab = (lab: LabRequestRecord) => {
    const schema = getTestResultSchema(lab.testType);
    setEditingLabId(lab.id);
    setSelectedLabSchemaName(lab.testType);
    setLabPriority(lab.priority);
    setLabIndication(lab.clinicalIndication);
    const nextParams: Record<string, string> = {};
    schema.parameters.forEach((p) => {
      const existingParam = lab.structuredResults?.find(
        (sr) => sr.key === p.key || sr.label.toLowerCase() === p.label.toLowerCase()
      );
      nextParams[p.key] = existingParam?.value || p.demoValue;
    });
    setLabParamValues(nextParams);
    setLabInterpretation(lab.doctorInterpretation || schema.defaultInterpretation);
    setLabAbnormalFlag(
      lab.isFlaggedAbnormal !== undefined ? lab.isFlaggedAbnormal : Boolean(schema.defaultAbnormal)
    );
    setIsInlineLabBuilderOpen(true);
  };

  const handleSaveInlineLabAndResults = () => {
    const structuredResults: LabResultParameter[] = activeLabSchema.parameters.map((p) => ({
      key: p.key,
      label: p.label,
      value: (labParamValues[p.key] || '').trim(),
      unit: p.unit,
      referenceRange: p.referenceRange,
    }));

    const summaryString = structuredResults
      .filter((r) => r.value !== '')
      .map((r) => `${r.label}: ${r.value} ${r.unit}`.trim())
      .join(' · ');

    if (editingLabId) {
      updateLabResults(editingLabId, {
        structuredResults,
        resultsSummary: summaryString || 'Results recorded during encounter',
        doctorInterpretation: labInterpretation,
        isFlaggedAbnormal: labAbnormalFlag,
      });
      setEditingLabId(null);
    } else {
      orderLabTest(
        selectedLabSchemaName,
        activeLabSchema.dept,
        labIndication,
        labPriority,
        activeLabSchema.defaultInstructions,
        {
          structuredResults,
          resultsSummary: summaryString,
          doctorInterpretation: labInterpretation,
          isFlaggedAbnormal: labAbnormalFlag,
        }
      );
    }
  };

  // Step 5: Sign & Finalize
  const [physicianConfirmation, setPhysicianConfirmation] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Synchronize modal state with currently selected active encounter
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      if (activeEncounter.vitals) {
        setVitals({
          bloodPressure: activeEncounter.vitals.bloodPressure || '134/84',
          heartRate: activeEncounter.vitals.heartRate || 74,
          spO2: activeEncounter.vitals.spO2 || 98,
          temperature: activeEncounter.vitals.temperature || 36.8,
          weightKg: activeEncounter.vitals.weightKg || 78.5,
          heightCm: activeEncounter.vitals.heightCm || 176,
        });
      }
      setChiefComplaint(activeEncounter.chiefComplaint || 'Routine clinical assessment');
      setAssessmentText(activeEncounter.assessment || 'Under evaluation');
      setPatientInstructions(
        activeEncounter.patientInstructions ||
          'Keep a daily blood pressure and symptom log. Contact clinic if symptoms change.'
      );
      if (activeEncounter.followUpDate) {
        setFollowUpDate(activeEncounter.followUpDate);
      }
    }
  }, [isOpen, activeEncounter.id]);

  if (!isOpen) return null;

  // Active prescriptions, labs, referrals for this encounter
  const currentPatientPrescriptions = prescriptions.filter(
    (r) => r.encounterId === activeEncounter.id || r.patientId === activeEncounter.patientId
  );
  const currentPatientLabs = labRequests.filter(
    (l) => l.encounterId === activeEncounter.id || l.patientId === activeEncounter.patientId
  );
  const currentPatientReferrals = referrals.filter(
    (rf) => rf.encounterId === activeEncounter.id || rf.patientId === activeEncounter.patientId
  );

  // Auto-calculated BMI
  const bmi =
    vitals.heightCm && vitals.weightKg
      ? (vitals.weightKg / Math.pow(vitals.heightCm / 100, 2)).toFixed(1)
      : '25.3';

  // Handle saving step data into context
  const syncStepDataToContext = () => {
    updateEncounterVitals(vitals);
    updateEncounterAssessment(assessmentText);
    setActiveEncounter((prev) => ({
      ...prev,
      chiefComplaint,
      patientInstructions,
      followUpDate,
    }));
  };

  const handleNext = () => {
    syncStepDataToContext();
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5);
    }
  };

  const handlePrev = () => {
    syncStepDataToContext();
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5);
    }
  };

  const handleAddDiagnosis = (code: string, desc: string, type: 'Primary' | 'Secondary' = 'Secondary') => {
    addEncounterDiagnosis({
      code,
      description: desc,
      type,
    });
    setNewDiagnosisCode('');
    setNewDiagnosisDesc('');
    setIsAddingDiagnosis(false);
  };

  const handleSignAndComplete = () => {
    setIsFinalizing(true);
    syncStepDataToContext();
    setTimeout(() => {
      signAndCompleteEncounter();
      setIsFinalizing(false);
      onClose();
    }, 600);
  };

  const steps = [
    { num: 1, title: 'Vitals & Chief Complaint' },
    { num: 2, title: 'Clinical Examination' },
    { num: 3, title: 'ICD-10 Diagnoses' },
    { num: 4, title: 'Treatment & Orders' },
    { num: 5, title: 'Sign & Finalize' },
  ];

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="relative w-full bg-white rounded-3xl shadow-2xs border border-[#e8e8e8] flex flex-col overflow-hidden">
        {/* PAGE HEADER */}
        <div className="p-6 sm:p-8 border-b border-[#e8e8e8] bg-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00c0fe]/15 text-[#00c0fe] flex items-center justify-center font-bold text-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8e8e8e]">
                  Clinical Visit Documentation
                </span>
                <h2 className="text-lg font-bold text-[#0e162b]">
                  {activeEncounter.patientName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#8e8e8e] px-2.5 py-1 rounded-full bg-[#f5f7fa]">
                Ref: {activeEncounter.id}
              </span>
              <button
                type="button"
                onClick={() => {
                  syncStepDataToContext();
                  onClose();
                }}
                className="p-2 rounded-full hover:bg-[#f5f7fa] text-[#8e8e8e] hover:text-[#0e162b] transition-colors"
                title="Close and save draft"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* STEPPER PROGRESS INDICATOR */}
          <div className="mt-6 pt-4 border-t border-[#f0f2f5]">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute left-4 right-4 top-4 -translate-y-1/2 h-0.5 bg-[#e8e8e8] -z-0" />
              <div
                className="absolute left-4 top-4 -translate-y-1/2 h-0.5 bg-[#00c0fe] transition-all duration-300 -z-0"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((s) => {
                const isCompleted = s.num < currentStep;
                const isCurrent = s.num === currentStep;

                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      syncStepDataToContext();
                      setCurrentStep(s.num as any);
                    }}
                    className="flex flex-col items-center group relative z-10 focus:outline-none"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all shadow-xs ${
                        isCurrent
                          ? 'bg-[#00c0fe] text-white ring-4 ring-[#00c0fe]/20 scale-110'
                          : isCompleted
                          ? 'bg-[#0e162b] text-white'
                          : 'bg-white border-2 border-[#e8e8e8] text-[#8e8e8e] group-hover:border-[#0e162b]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span
                      className={`text-[11px] mt-1.5 font-medium whitespace-nowrap hidden sm:block ${
                        isCurrent
                          ? 'text-[#222222] font-semibold'
                          : isCompleted
                          ? 'text-[#717171]'
                          : 'text-[#999999]'
                      }`}
                    >
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* PAGE BODY (STEP CONTENT) */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 text-xs">
          {/* STEP 1: VITALS & CHIEF COMPLAINT */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                  Reason for Visit / Chief Complaint
                </label>
                <input
                  type="text"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="e.g. Follow-up hypertension, headache, routine check-up"
                  className="w-full px-4 py-2.5 bg-[#F7F7F7] border border-[#EBEBEB] focus:border-[#222222] focus:bg-white rounded-xl text-xs font-medium text-[#222222] focus:outline-none transition-colors"
                />
              </div>

              {/* Vitals Input Grid */}
              <div className="bg-[#F7F7F7] border border-[#EBEBEB] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
                    Clinical Vitals & Physiological Measurements
                  </span>
                  <span className="text-[11px] font-medium text-[#1fc16b] bg-[#84ebb4]/25 px-2.5 py-0.5 rounded-full">
                    Auto-synced from triage
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-[#717171] block mb-1">
                      Blood Pressure (mmHg)
                    </label>
                    <input
                      type="text"
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                      placeholder="120/80"
                      className="w-full px-3 py-2 bg-white border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#717171] block mb-1">
                      Heart Rate (BPM)
                    </label>
                    <input
                      type="number"
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#717171] block mb-1">
                      SpO2 Oxygen (%)
                    </label>
                    <input
                      type="number"
                      value={vitals.spO2}
                      onChange={(e) => setVitals({ ...vitals, spO2: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#717171] block mb-1">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#717171] block mb-1">
                      Body Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.weightKg}
                      onChange={(e) => setVitals({ ...vitals, weightKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#717171] block mb-1">
                      Body Height (cm)
                    </label>
                    <input
                      type="number"
                      value={vitals.heightCm}
                      onChange={(e) => setVitals({ ...vitals, heightCm: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#EBEBEB] text-[11px] text-[#717171]">
                  <span>
                    Calculated BMI: <strong className="text-[#222222] font-semibold">{bmi} kg/m²</strong> (Normal range)
                  </span>
                  <span>Target BP: &lt; 130/80 mmHg</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CLINICAL EXAMINATION & NOTES */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                  Subjective / History of Present Illness (HPI)
                </label>
                <textarea
                  rows={3}
                  value={hpiText}
                  onChange={(e) => setHpiText(e.target.value)}
                  placeholder="Chronological description of the development of the patient's illness..."
                  className="w-full p-3.5 bg-[#F7F7F7] border border-[#EBEBEB] focus:border-[#222222] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none leading-relaxed transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                  Objective Physical Examination Findings
                </label>
                <textarea
                  rows={4}
                  value={physicalExamNotes}
                  onChange={(e) => setPhysicalExamNotes(e.target.value)}
                  placeholder="Systemic examination: General appearance, HEENT, Cardiovascular, Respiratory, Abdomen..."
                  className="w-full p-3.5 bg-[#F7F7F7] border border-[#EBEBEB] focus:border-[#222222] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none leading-relaxed transition-colors"
                />
              </div>

              <div className="p-3.5 bg-[#F7F7F7] rounded-xl border border-[#EBEBEB] flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#1fc16b] shrink-0" />
                <span className="text-[11px] text-[#717171]">
                  Clinical documentation meets standard SOAP note guidelines for outpatient internal medicine.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: ASSESSMENT & ICD-10 DIAGNOSES */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                  Clinical Assessment & Synthesis
                </label>
                <textarea
                  rows={2}
                  value={assessmentText}
                  onChange={(e) => setAssessmentText(e.target.value)}
                  placeholder="Physician's medical impression and clinical assessment..."
                  className="w-full p-3 bg-[#F7F7F7] border border-[#EBEBEB] focus:border-[#222222] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                />
              </div>

              {/* Current Diagnoses List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
                    Documented ICD-10 Diagnoses ({(activeEncounter.diagnoses || []).length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingDiagnosis(true)}
                    className="text-xs text-[#00c0fe] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Diagnosis</span>
                  </button>
                </div>

                {(activeEncounter.diagnoses || []).length === 0 ? (
                  <div className="p-6 bg-[#f5f7fa] rounded-2xl text-center text-[#8e8e8e]">
                    No diagnoses coded yet. Select from quick-picks below or search custom ICD-10.
                  </div>
                ) : (
                  <div className="divide-y divide-[#e8e8e8] border border-[#e8e8e8] rounded-2xl bg-white overflow-hidden">
                    {(activeEncounter.diagnoses || []).map((diag, index) => (
                      <div key={index} className="p-3.5 flex items-center justify-between hover:bg-[#f5f7fa]">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              diag.type === 'Primary'
                                ? 'bg-[#00c0fe] text-white'
                                : 'bg-[#f5f7fa] text-[#8e8e8e] border border-[#e8e8e8]'
                            }`}
                          >
                            {diag.type}
                          </span>
                          <span className="font-mono font-bold text-[#0e162b]">{diag.code}</span>
                          <span className="text-[#333333]">{diag.description}</span>
                        </div>
                        <span className="text-[11px] text-[#1fc16b] font-medium">Active Code</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Add Diagnosis Form */}
              {isAddingDiagnosis && (
                <div className="p-4 bg-[#F7F7F7] border border-[#EBEBEB] rounded-2xl space-y-3 animate-in fade-in duration-150">
                  <span className="text-xs font-semibold text-[#222222] block">
                    Add New ICD-10 Diagnosis
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      placeholder="ICD-10 Code (e.g. I10)"
                      value={newDiagnosisCode}
                      onChange={(e) => setNewDiagnosisCode(e.target.value)}
                      className="sm:col-span-3 px-3 py-2 bg-white border border-[#DDDDDD] rounded-xl text-xs font-mono font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Clinical Description"
                      value={newDiagnosisDesc}
                      onChange={(e) => setNewDiagnosisDesc(e.target.value)}
                      className="sm:col-span-6 px-3 py-2 bg-white border border-[#DDDDDD] rounded-xl text-xs"
                    />
                    <select
                      value={newDiagnosisType}
                      onChange={(e) => setNewDiagnosisType(e.target.value as any)}
                      className="sm:col-span-3 px-3 py-2 bg-white border border-[#DDDDDD] rounded-xl text-xs"
                    >
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingDiagnosis(false)}
                      className="px-3 py-1.5 border border-[#DDDDDD] rounded-full text-xs font-medium hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddDiagnosis(newDiagnosisCode, newDiagnosisDesc, newDiagnosisType)}
                      disabled={!newDiagnosisCode || !newDiagnosisDesc}
                      className="px-4 py-1.5 bg-[#222222] text-white rounded-full text-xs font-semibold hover:bg-black disabled:opacity-50"
                    >
                      Confirm Diagnosis
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Pick ICD-10 Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-[#717171] block">
                  Quick Select Common Outpatient Diagnoses:
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickDiagnoses.map((qd) => (
                    <button
                      key={qd.code}
                      type="button"
                      onClick={() => handleAddDiagnosis(qd.code, qd.desc, 'Secondary')}
                      className="px-3 py-1.5 rounded-full bg-white border border-[#e8e8e8] hover:border-[#0e162b] text-[#333333] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="font-mono font-bold text-[#00c0fe]">{qd.code}</span>
                      <span>{qd.desc}</span>
                      <Plus className="w-3 h-3 text-[#8e8e8e]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TREATMENT & ORDERS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Prescriptions Section */}
              <div className="bg-[#f5f7fa] border border-[#e8e8e8] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-[#00c0fe]" />
                    <span className="text-xs font-semibold text-[#0e162b]">
                      Prescriptions &amp; Medication Therapy
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrescribeModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full font-semibold transition-colors shadow-2xs text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Prescribe Medication</span>
                  </button>
                </div>

                {currentPatientPrescriptions.length === 0 ? (
                  <p className="text-xs text-[#8e8e8e] py-2">
                    No medications prescribed in this session yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {currentPatientPrescriptions.map((rx) => (
                      <div key={rx.id} className="p-3 bg-white rounded-xl border border-[#e8e8e8] flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-[#0e162b]">
                            {(rx.items || []).map((i) => `${i.medication} ${i.strength}`).join(', ')}
                          </span>
                          <span className="text-[11px] text-[#8e8e8e] block mt-0.5">
                            Rx Ref: {rx.id} · Status: {rx.status}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] text-[11px] font-semibold border border-[#1fc16b]/20">
                          Authorized
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lab & Imaging Section */}
              <div className="bg-[#f5f7fa] border border-[#e8e8e8] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-[#00c0fe]" />
                    <span className="text-xs font-semibold text-[#0e162b]">
                      Diagnostic Lab &amp; Imaging Orders
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOrderLabModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full font-semibold transition-colors shadow-2xs text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#00c0fe]" />
                    <span>Enter Test Results</span>
                  </button>
                </div>

                {/* Recorded / Ordered Labs List for Current Patient */}
                {currentPatientLabs.length === 0 ? (
                  <p className="text-xs text-[#717171] py-2">
                    No laboratory test results entered for this encounter yet.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {currentPatientLabs.map((lab) => (
                      <div
                        key={lab.id}
                        className="p-3.5 bg-white rounded-xl border border-[#e8e8e8] space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#0e162b]">
                                {lab.testType}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  lab.status === 'Result Available' || lab.resultsSummary
                                    ? 'bg-[#84ebb4]/25 text-[#1fc16b] border border-[#1fc16b]/20'
                                    : 'bg-[#f5f7fa] text-[#606060] border border-[#e8e8e8]'
                                }`}
                              >
                                {lab.status}
                              </span>
                              {lab.isFlaggedAbnormal && (
                                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                                  Abnormal Flag
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#606060] block mt-0.5">
                              {lab.department} · Priority: {lab.priority} · {lab.clinicalIndication}
                            </span>
                          </div>
                        </div>

                        {lab.structuredResults && lab.structuredResults.length > 0 ? (
                          <div className="pt-2 border-t border-[#e8e8e8] space-y-1.5">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {lab.structuredResults
                                .filter((sr) => sr.value.trim() !== '')
                                .map((sr) => (
                                  <div
                                    key={sr.key}
                                    className="px-2.5 py-1.5 rounded-lg bg-[#f5f7fa] border border-[#e8e8e8] flex flex-col"
                                  >
                                    <span className="text-xs text-[#606060]">{sr.label}</span>
                                    <span className="text-xs font-bold text-[#0e162b]">
                                      {sr.value} {sr.unit}
                                    </span>
                                  </div>
                                ))}
                            </div>
                            {lab.doctorInterpretation && (
                              <p className="text-xs text-[#333333] bg-[#f5f7fa] px-3 py-1.5 rounded-lg">
                                <strong className="text-[#0e162b]">Interpretation:</strong>{' '}
                                {lab.doctorInterpretation}
                              </p>
                            )}
                          </div>
                        ) : lab.resultsSummary ? (
                          <div className="pt-2 border-t border-[#e8e8e8] text-xs text-[#0e162b]">
                            <strong>Recorded Results:</strong> {lab.resultsSummary}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Discharge Instructions & Follow-up */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Patient Discharge Instructions & Care Advice
                  </label>
                  <textarea
                    rows={2}
                    value={patientInstructions}
                    onChange={(e) => setPatientInstructions(e.target.value)}
                    placeholder="Instructions communicated to patient or caregiver..."
                    className="w-full p-3 bg-[#F7F7F7] border border-[#EBEBEB] focus:border-[#222222] focus:bg-white rounded-xl text-xs text-[#222222] focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                      Recommended Follow-up Visit Date
                    </label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F7F7] border border-[#EBEBEB] rounded-xl text-xs font-semibold text-[#222222]"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => setIsReferralModalOpen(true)}
                      className="w-full px-4 py-2 border border-[#DDDDDD] hover:border-[#222222] text-[#222222] rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4 text-[#00c0fe]" />
                      <span>Create Specialist Referral</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SIGN & FINALIZE ENCOUNTER */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Visit Summary Card */}
              <div className="bg-[#F7F7F7] border border-[#EBEBEB] rounded-2xl p-5 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#717171] block">
                  Encounter Record Summary
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#717171] block text-[11px]">Chief Complaint:</span>
                    <strong className="text-[#222222]">{chiefComplaint}</strong>
                  </div>
                  <div>
                    <span className="text-[#717171] block text-[11px]">Recorded Vitals:</span>
                    <strong className="text-[#222222]">
                      BP: {vitals.bloodPressure} · HR: {vitals.heartRate} bpm · BMI: {bmi}
                    </strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#717171] block text-[11px]">Coded Diagnoses:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(activeEncounter.diagnoses || []).map((d, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-white border border-[#e8e8e8] text-[#333333] font-medium"
                        >
                          <strong className="text-[#00c0fe]">{d.code}</strong> {d.description}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#8e8e8e] block text-[11px]">Plan &amp; Prescriptions:</span>
                    <p className="text-[#0e162b] font-medium mt-0.5">
                      {currentPatientPrescriptions.length} prescriptions issued · {currentPatientLabs.length} lab orders
                    </p>
                  </div>
                </div>
              </div>

              {/* Digital Attestation Box */}
              <div className="p-5 border-2 border-dashed border-[#e8e8e8] rounded-2xl bg-white space-y-3">
                <div className="flex items-center gap-3">
                  <FileSignature className="w-5 h-5 text-[#00c0fe]" />
                  <div>
                    <h3 className="font-bold text-[#0e162b]">Physician Digital Attestation</h3>
                    <p className="text-[11px] text-[#8e8e8e]">
                      Attending: {activeEncounter.doctorName} · Medical Lic #MD-84920 · Room 101
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={physicianConfirmation}
                    onChange={(e) => setPhysicianConfirmation(e.target.checked)}
                    className="mt-0.5 accent-[#00c0fe] rounded"
                  />
                  <span className="text-xs text-[#333333] leading-relaxed">
                    I attest that I have conducted this clinical encounter, reviewed all subjective, objective, diagnostic and treatment data, and verified its accuracy. Submitting will digitally sign and finalize the record.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-5 border-t border-[#e8e8e8] bg-[#f5f7fa] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] rounded-full text-xs font-semibold text-[#0e162b] transition-colors disabled:opacity-40 disabled:hover:border-[#e8e8e8] flex items-center gap-1.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                syncStepDataToContext();
                onClose();
              }}
              className="px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] rounded-full text-xs font-semibold text-[#8e8e8e] hover:text-[#0e162b] transition-colors"
            >
              Save Draft &amp; Close
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Save &amp; Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignAndComplete}
                disabled={!physicianConfirmation || isFinalizing}
                className="px-6 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isFinalizing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing Record...</span>
                  </>
                ) : (
                  <>
                    <FileSignature className="w-4 h-4" />
                    <span>Sign &amp; Finalize Encounter</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
