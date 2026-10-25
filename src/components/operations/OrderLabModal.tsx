import React, { useState, useEffect } from 'react';
import { useClinicOperations } from '../../context/ClinicOperationsContext';
import { LabResultParameter } from '../../types/operations';
import { X, CheckCircle2, FlaskConical, Sparkles, AlertTriangle, Plus, Check } from 'lucide-react';

export interface DiagnosticTestSchema {
  name: string;
  dept: string;
  defaultIndication: string;
  defaultInstructions: string;
  defaultInterpretation: string;
  defaultAbnormal?: boolean;
  parameters: {
    key: string;
    label: string;
    unit: string;
    referenceRange: string;
    demoValue: string;
    placeholder?: string;
  }[];
}

export const DIAGNOSTIC_TEST_SCHEMAS: DiagnosticTestSchema[] = [
  {
    name: 'Lipid Panel (TC, HDL, LDL, Triglycerides)',
    dept: 'Clinical Chemistry',
    defaultIndication: 'Evaluate dyslipidemia and cardiovascular risk profile',
    defaultInstructions: '10-12 hour overnight fasting required before venipuncture.',
    defaultInterpretation: 'Borderline elevated Total and LDL Cholesterol; dietary modification and statin therapy reviewed.',
    defaultAbnormal: true,
    parameters: [
      { key: 'tc', label: 'Total Cholesterol (TC)', unit: 'mg/dL', referenceRange: '< 200 mg/dL', demoValue: '218', placeholder: 'e.g. 195' },
      { key: 'ldl', label: 'LDL Cholesterol (Direct)', unit: 'mg/dL', referenceRange: '< 100 mg/dL', demoValue: '142', placeholder: 'e.g. 98' },
      { key: 'hdl', label: 'HDL Cholesterol', unit: 'mg/dL', referenceRange: '> 40 mg/dL', demoValue: '46', placeholder: 'e.g. 52' },
      { key: 'trig', label: 'Triglycerides', unit: 'mg/dL', referenceRange: '< 150 mg/dL', demoValue: '164', placeholder: 'e.g. 135' },
      { key: 'non_hdl', label: 'Non-HDL Cholesterol', unit: 'mg/dL', referenceRange: '< 130 mg/dL', demoValue: '172', placeholder: 'e.g. 122' },
    ],
  },
  {
    name: 'Complete Blood Count (CBC) with Diff',
    dept: 'Hematology',
    defaultIndication: 'Evaluate hematologic baseline, anemia screen, and leukocyte differential',
    defaultInstructions: 'No fasting required. EDTA whole blood specimen.',
    defaultInterpretation: 'Normocytic, normochromic hematologic indices and leukocyte differential within normal reference limits.',
    defaultAbnormal: false,
    parameters: [
      { key: 'wbc', label: 'White Blood Cell (WBC)', unit: 'x10³/µL', referenceRange: '4.5 - 11.0', demoValue: '6.8', placeholder: 'e.g. 6.8' },
      { key: 'hb', label: 'Hemoglobin (Hb)', unit: 'g/dL', referenceRange: '12.0 - 16.0', demoValue: '14.2', placeholder: 'e.g. 14.2' },
      { key: 'hct', label: 'Hematocrit (Hct)', unit: '%', referenceRange: '36.0 - 48.0', demoValue: '42.5', placeholder: 'e.g. 42.5' },
      { key: 'plt', label: 'Platelet Count', unit: 'x10³/µL', referenceRange: '150 - 450', demoValue: '248', placeholder: 'e.g. 250' },
      { key: 'diff', label: 'Neutrophils / Lymphocytes', unit: '%', referenceRange: '40-70% / 20-40%', demoValue: '58% / 32%', placeholder: 'e.g. 58% / 32%' },
      { key: 'mcv', label: 'Mean Corpuscular Volume (MCV)', unit: 'fL', referenceRange: '80 - 100', demoValue: '89', placeholder: 'e.g. 89' },
    ],
  },
  {
    name: 'Comprehensive Metabolic Panel (CMP)',
    dept: 'Clinical Biochemistry',
    defaultIndication: 'Monitor renal function, electrolyte baseline, and hepatic enzymes',
    defaultInstructions: '8-10 hour fasting recommended prior to blood draw.',
    defaultInterpretation: 'Preserved renal filtration (eGFR > 60) and normal electrolyte and hepatic enzyme profile.',
    defaultAbnormal: false,
    parameters: [
      { key: 'glucose', label: 'Fasting Blood Glucose', unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', demoValue: '96', placeholder: 'e.g. 94' },
      { key: 'creatinine', label: 'Serum Creatinine', unit: 'mg/dL', referenceRange: '0.6 - 1.2 mg/dL', demoValue: '0.94', placeholder: 'e.g. 0.95' },
      { key: 'egfr', label: 'eGFR (CKD-EPI)', unit: 'mL/min/1.73m²', referenceRange: '> 60', demoValue: '88', placeholder: 'e.g. 88' },
      { key: 'electrolytes', label: 'Sodium (Na+) / Potassium (K+)', unit: 'mEq/L', referenceRange: '136-145 / 3.5-5.1', demoValue: '140 / 4.3', placeholder: 'e.g. 140 / 4.2' },
      { key: 'lft', label: 'ALT (SGPT) / AST (SGOT)', unit: 'U/L', referenceRange: '7-56 / 8-33', demoValue: '24 / 21', placeholder: 'e.g. 24 / 21' },
      { key: 'bun', label: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', referenceRange: '7 - 20 mg/dL', demoValue: '15', placeholder: 'e.g. 15' },
    ],
  },
  {
    name: 'Glycated Hemoglobin (HbA1c)',
    dept: 'Clinical Chemistry & Endocrinology',
    defaultIndication: 'Assess 3-month glycemic control and metabolic status',
    defaultInstructions: 'No fasting required. Whole blood EDTA sample.',
    defaultInterpretation: 'Mildly elevated HbA1c consistent with pre-diabetes / controlled glycemic range.',
    defaultAbnormal: true,
    parameters: [
      { key: 'hba1c', label: 'HbA1c Fraction', unit: '%', referenceRange: '< 5.7% Normal', demoValue: '6.2', placeholder: 'e.g. 5.6' },
      { key: 'eag', label: 'Estimated Avg Glucose (eAG)', unit: 'mg/dL', referenceRange: '< 117 mg/dL', demoValue: '131', placeholder: 'e.g. 114' },
      { key: 'fpg', label: 'Concurrent Fasting Glucose', unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', demoValue: '112', placeholder: 'e.g. 98' },
      { key: 'status', label: 'Glycemic Target Status', unit: 'Category', referenceRange: '< 7.0% Target', demoValue: 'Controlled / Pre-diabetic', placeholder: 'e.g. Controlled' },
    ],
  },
  {
    name: 'Thyroid Stimulating Hormone (TSH)',
    dept: 'Endocrinology',
    defaultIndication: 'Evaluate thyroid function for fatigue or hemodynamic changes',
    defaultInstructions: 'Morning blood draw preferred; no fasting required.',
    defaultInterpretation: 'Euthyroid biochemical profile; TSH and Free T4 within normal reference ranges.',
    defaultAbnormal: false,
    parameters: [
      { key: 'tsh', label: 'TSH (Ultra-Sensitive)', unit: 'mIU/L', referenceRange: '0.40 - 4.50 mIU/L', demoValue: '2.15', placeholder: 'e.g. 2.15' },
      { key: 'ft4', label: 'Free T4 (Thyroxine)', unit: 'ng/dL', referenceRange: '0.80 - 1.80 ng/dL', demoValue: '1.24', placeholder: 'e.g. 1.24' },
      { key: 'ft3', label: 'Free T3 (Triiodothyronine)', unit: 'pg/mL', referenceRange: '2.30 - 4.20 pg/mL', demoValue: '3.10', placeholder: 'e.g. 3.10' },
    ],
  },
  {
    name: 'Urinalysis (Complete with Microscopy)',
    dept: 'Clinical Pathology',
    defaultIndication: 'Screen for proteinuria, glycosuria, or urinary tract infection',
    defaultInstructions: 'Clean-catch midstream urine specimen.',
    defaultInterpretation: 'Unremarkable urinalysis; negative protein, glucose, leukocyte esterase, and nitrites.',
    defaultAbnormal: false,
    parameters: [
      { key: 'protein', label: 'Urine Protein / Albumin', unit: 'Dipstick', referenceRange: 'Negative', demoValue: 'Negative', placeholder: 'Negative / Trace / +1' },
      { key: 'glucose_ket', label: 'Urine Glucose & Ketones', unit: 'Dipstick', referenceRange: 'Negative', demoValue: 'Negative', placeholder: 'Negative' },
      { key: 'leuk_nit', label: 'Leukocyte Esterase / Nitrites', unit: 'Dipstick', referenceRange: 'Negative', demoValue: 'Negative', placeholder: 'Negative' },
      { key: 'sg_ph', label: 'Specific Gravity & pH', unit: 'SG / pH', referenceRange: '1.005-1.030 / pH 5-7', demoValue: '1.018 / pH 6.0', placeholder: '1.018 / pH 6.0' },
      { key: 'microscopy', label: 'Microscopy (WBC / RBC)', unit: '/HPF', referenceRange: '0 - 5 /HPF', demoValue: '1-2 WBC / 0 RBC', placeholder: '0-2 /HPF' },
    ],
  },
  {
    name: 'Transthoracic Echocardiogram (TTE)',
    dept: 'Cardiovascular Imaging',
    defaultIndication: 'Assess left ventricular hypertrophy, systolic function, and valvular structure',
    defaultInstructions: 'Resting 2D & Doppler transthoracic study in Suite 102.',
    defaultInterpretation: 'Preserved LVEF (60%) with mild concentric LVH secondary to hypertension; no hemodynamically significant valvular disease.',
    defaultAbnormal: false,
    parameters: [
      { key: 'lvef', label: 'LV Ejection Fraction (LVEF)', unit: '%', referenceRange: '55 - 70%', demoValue: '60%', placeholder: 'e.g. 60%' },
      { key: 'wall_motion', label: 'LV Wall Thickness & Motion', unit: 'Finding', referenceRange: 'Normal wall motion', demoValue: 'Mild concentric LVH; normal wall motion', placeholder: 'Chamber & wall motion' },
      { key: 'valves', label: 'Valvular Structure & Doppler', unit: 'Finding', referenceRange: 'Normal valves', demoValue: 'Trileaflet aortic valve; trace MR', placeholder: 'Valvular findings' },
      { key: 'diastolic', label: 'Diastolic Function & Pericardium', unit: 'Finding', referenceRange: 'Normal relaxation, no effusion', demoValue: 'Grade I diastolic dysfunction; no effusion', placeholder: 'Diastolic / Pericardium' },
    ],
  },
];

export function getTestResultSchema(testName: string): DiagnosticTestSchema {
  const exact = DIAGNOSTIC_TEST_SCHEMAS.find(
    (s) => s.name.toLowerCase() === testName.trim().toLowerCase()
  );
  if (exact) return exact;

  const lower = testName.toLowerCase();
  if (lower.includes('lipid') || lower.includes('cholesterol') || lower.includes('triglyceride')) {
    return DIAGNOSTIC_TEST_SCHEMAS[0];
  }
  if (lower.includes('cbc') || lower.includes('blood count') || lower.includes('hemoglobin') || lower.includes('hematology')) {
    return DIAGNOSTIC_TEST_SCHEMAS[1];
  }
  if (lower.includes('cmp') || lower.includes('metabolic') || lower.includes('renal') || lower.includes('electrolyte')) {
    return DIAGNOSTIC_TEST_SCHEMAS[2];
  }
  if (lower.includes('hba1c') || lower.includes('glycated') || lower.includes('a1c')) {
    return DIAGNOSTIC_TEST_SCHEMAS[3];
  }
  if (lower.includes('tsh') || lower.includes('thyroid')) {
    return DIAGNOSTIC_TEST_SCHEMAS[4];
  }
  if (lower.includes('urin')) {
    return DIAGNOSTIC_TEST_SCHEMAS[5];
  }
  if (lower.includes('echo') || lower.includes('tte') || lower.includes('cardiac')) {
    return DIAGNOSTIC_TEST_SCHEMAS[6];
  }

  return {
    name: testName || 'Custom Diagnostic Investigation',
    dept: 'Clinical Diagnostics',
    defaultIndication: 'Diagnostic evaluation per clinical assessment',
    defaultInstructions: 'Standard clinical specimen collection protocol.',
    defaultInterpretation: 'Diagnostic results reviewed and verified by attending physician.',
    defaultAbnormal: false,
    parameters: [
      { key: 'primary_val', label: 'Primary Measured Result', unit: 'Value', referenceRange: 'Standard Reference', demoValue: 'Within normal limits', placeholder: 'Enter measured value...' },
      { key: 'secondary_val', label: 'Secondary Parameter / Ratio', unit: 'Units', referenceRange: 'Normal range', demoValue: 'Normal', placeholder: 'Enter secondary parameter...' },
      { key: 'qualitative', label: 'Qualitative / Lab Observation', unit: 'Finding', referenceRange: 'Unremarkable', demoValue: 'No significant abnormality detected', placeholder: 'Enter qualitative finding...' },
    ],
  };
}

interface SessionAddedEntry {
  testName: string;
  dept: string;
  summary: string;
  isAbnormal: boolean;
}

export const OrderLabModal: React.FC = () => {
  const { isOrderLabModalOpen, setIsOrderLabModalOpen, orderLabTest, activeEncounter } =
    useClinicOperations();

  const [testType, setTestType] = useState(DIAGNOSTIC_TEST_SCHEMAS[0].name);
  const [department, setDepartment] = useState(DIAGNOSTIC_TEST_SCHEMAS[0].dept);
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'STAT'>('Routine');
  const [clinicalIndication, setClinicalIndication] = useState(
    DIAGNOSTIC_TEST_SCHEMAS[0].defaultIndication
  );
  const [instructions, setInstructions] = useState(DIAGNOSTIC_TEST_SCHEMAS[0].defaultInstructions);

  // Dynamic test-specific result entry state
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [doctorInterpretation, setDoctorInterpretation] = useState(
    DIAGNOSTIC_TEST_SCHEMAS[0].defaultInterpretation
  );
  const [isFlaggedAbnormal, setIsFlaggedAbnormal] = useState(
    Boolean(DIAGNOSTIC_TEST_SCHEMAS[0].defaultAbnormal)
  );

  // Track multiple test results added sequentially in this modal session
  const [sessionAddedTests, setSessionAddedTests] = useState<SessionAddedEntry[]>([]);
  const [justAddedToast, setJustAddedToast] = useState<string | null>(null);

  const activeSchema = getTestResultSchema(testType);

  // Reset session list when modal opens
  useEffect(() => {
    if (isOrderLabModalOpen) {
      setSessionAddedTests([]);
      setJustAddedToast(null);
    }
  }, [isOrderLabModalOpen]);

  // Reset or initialize parameter fields when testType changes
  useEffect(() => {
    const schema = getTestResultSchema(testType);
    const initialMap: Record<string, string> = {};
    schema.parameters.forEach((p) => {
      initialMap[p.key] = p.demoValue;
    });
    setParamValues(initialMap);
    setDoctorInterpretation(schema.defaultInterpretation);
    setIsFlaggedAbnormal(Boolean(schema.defaultAbnormal));
  }, [testType]);

  if (!isOrderLabModalOpen) return null;

  const handleSelectPresetTest = (schema: DiagnosticTestSchema) => {
    setTestType(schema.name);
    setDepartment(schema.dept);
    setClinicalIndication(schema.defaultIndication);
    setInstructions(schema.defaultInstructions);
    setJustAddedToast(null);
  };

  const handleFillDemoResults = () => {
    const filled: Record<string, string> = {};
    activeSchema.parameters.forEach((p) => {
      filled[p.key] = p.demoValue;
    });
    setParamValues(filled);
    setDoctorInterpretation(activeSchema.defaultInterpretation);
    setIsFlaggedAbnormal(Boolean(activeSchema.defaultAbnormal));
  };

  const handleClearResults = () => {
    const cleared: Record<string, string> = {};
    activeSchema.parameters.forEach((p) => {
      cleared[p.key] = '';
    });
    setParamValues(cleared);
    setDoctorInterpretation('');
    setIsFlaggedAbnormal(false);
  };

  const saveCurrentTestEntry = (): boolean => {
    if (!testType.trim()) return false;

    const structuredResults: LabResultParameter[] = activeSchema.parameters.map((p) => ({
      key: p.key,
      label: p.label,
      value: (paramValues[p.key] || '').trim(),
      unit: p.unit,
      referenceRange: p.referenceRange,
    }));

    const hasEnteredValues = structuredResults.some((r) => r.value.trim() !== '');

    const summaryString = structuredResults
      .filter((r) => r.value.trim() !== '')
      .map((r) => `${r.label}: ${r.value} ${r.unit}`.trim())
      .join(' · ');

    orderLabTest(
      testType,
      department,
      clinicalIndication,
      priority,
      instructions,
      hasEnteredValues
        ? {
            structuredResults,
            resultsSummary: summaryString,
            doctorInterpretation,
            isFlaggedAbnormal,
          }
        : undefined
    );

    setSessionAddedTests((prev) => [
      ...prev,
      {
        testName: testType,
        dept: department,
        summary: summaryString || 'Ordered (Pending values)',
        isAbnormal: isFlaggedAbnormal,
      },
    ]);

    return true;
  };

  // Save current test result and automatically prepare the form for the NEXT diagnostic test
  const handleAddAndEnterNext = () => {
    const saved = saveCurrentTestEntry();
    if (!saved) return;

    const completedTestName = testType;
    setJustAddedToast(`Saved ${completedTestName}. Select and enter the next test result below.`);

    // Automatically advance to the next unselected preset test for convenience
    const usedNames = new Set([
      ...sessionAddedTests.map((t) => t.testName),
      completedTestName,
    ]);
    const nextSchema =
      DIAGNOSTIC_TEST_SCHEMAS.find((s) => !usedNames.has(s.name)) ||
      DIAGNOSTIC_TEST_SCHEMAS[
        (DIAGNOSTIC_TEST_SCHEMAS.findIndex((s) => s.name === completedTestName) + 1) %
          DIAGNOSTIC_TEST_SCHEMAS.length
      ];

    setTestType(nextSchema.name);
    setDepartment(nextSchema.dept);
    setClinicalIndication(nextSchema.defaultIndication);
    setInstructions(nextSchema.defaultInstructions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCurrentTestEntry();
    setIsOrderLabModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#e8e8e8] overflow-hidden flex flex-col my-6 max-h-[92vh]">
        <div className="p-6 border-b border-[#e8e8e8] flex items-center justify-between bg-[#f5f7fa] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0e162b] flex items-center justify-center text-[#00c0fe]">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0e162b]">
                Enter Diagnostic Lab Test Results
              </h2>
              <p className="text-xs text-[#606060] mt-0.5">
                Patient: <span className="font-semibold text-[#0e162b]">{activeEncounter.patientName}</span> ({activeEncounter.patientId})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOrderLabModalOpen(false)}
            className="p-2 text-[#606060] hover:text-[#0e162b] rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs overflow-y-auto flex-1">
          {/* Multi-Test Session Tracker: Shows tests already entered in this session */}
          {sessionAddedTests.length > 0 && (
            <div className="bg-[#f0fdf4] border border-[#1fc16b]/30 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1fc16b]" />
                  <span className="text-xs font-bold text-[#0e162b]">
                    Completed in This Session ({sessionAddedTests.length} {sessionAddedTests.length === 1 ? 'Test' : 'Tests'} Added)
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#1fc16b]">
                  Ready for Test #{sessionAddedTests.length + 1}
                </span>
              </div>
              <div className="space-y-1.5">
                {sessionAddedTests.map((entry, idx) => (
                  <div
                    key={`${entry.testName}-${idx}`}
                    className="bg-white border border-[#e8e8e8] rounded-xl px-3 py-2 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-[#0e162b] block">
                        #{idx + 1} {entry.testName}
                      </span>
                      <span className="text-xs text-[#606060] block truncate">
                        {entry.summary}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#84ebb4]/25 text-[#1fc16b] text-xs font-semibold shrink-0">
                      Saved
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {justAddedToast && (
            <div className="px-3.5 py-2 rounded-xl bg-[#00c0fe]/10 border border-[#00c0fe]/30 text-xs font-semibold text-[#0e162b] flex items-center justify-between">
              <span>{justAddedToast}</span>
              <button
                type="button"
                onClick={() => setJustAddedToast(null)}
                className="text-xs text-[#606060] hover:text-[#0e162b]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Quick Select Common Diagnostic Tests */}
          <div>
            <span className="text-xs font-semibold text-[#0e162b] block mb-2">
              1. Select Diagnostic Test / Panel (UI adapts result fields automatically)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DIAGNOSTIC_TEST_SCHEMAS.map((t) => {
                const isAlreadyAdded = sessionAddedTests.some((s) => s.testName === t.name);
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => handleSelectPresetTest(t)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border inline-flex items-center gap-1.5 ${
                      testType === t.name
                        ? 'bg-[#0e162b] text-white border-[#0e162b] shadow-2xs'
                        : isAlreadyAdded
                        ? 'bg-[#f0fdf4] text-[#1fc16b] border-[#1fc16b]/40 hover:border-[#0e162b]'
                        : 'bg-[#f5f7fa] text-[#606060] border-[#e8e8e8] hover:text-[#0e162b] hover:border-[#0e162b]/30'
                    }`}
                  >
                    {isAlreadyAdded && <Check className="w-3.5 h-3.5" />}
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#0e162b] block mb-1">
                Selected Diagnostic Test / Panel Name *
              </label>
              <input
                type="text"
                required
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#f5f7fa] border border-[#e8e8e8] focus:border-[#0e162b] focus:bg-white rounded-xl text-xs font-semibold text-[#0e162b] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#606060] block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Routine' | 'Urgent' | 'STAT')}
                className="w-full px-3 py-2 bg-[#f5f7fa] border border-[#e8e8e8] focus:border-[#0e162b] focus:bg-white rounded-xl text-xs font-semibold text-[#0e162b] focus:outline-none"
              >
                <option value="Routine">Routine</option>
                <option value="Urgent">Urgent (4h)</option>
                <option value="STAT">STAT (Immediate)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Test-Specific Result Entry Section */}
          <div className="bg-[#f5f7fa] border border-[#e8e8e8] rounded-2xl p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e8e8e8] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0e162b]">
                    2. Enter Test Results — {activeSchema.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#00c0fe]/15 text-[#006a8e] text-xs font-semibold">
                    {activeSchema.parameters.length} Result Parameters
                  </span>
                </div>
                <p className="text-xs text-[#606060] mt-0.5">
                  Result fields dynamically match the selected diagnostic order.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFillDemoResults}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] text-xs font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00c0fe]" />
                  <span>Fill Sample Results</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearResults}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#e8e8e8] hover:border-[#0e162b] text-[#606060] hover:text-[#0e162b] text-xs font-medium transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeSchema.parameters.map((param) => (
                <div
                  key={param.key}
                  className="bg-white border border-[#e8e8e8] rounded-xl p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1">
                    <label className="text-xs font-semibold text-[#0e162b]">
                      {param.label}
                    </label>
                    <span className="text-xs text-[#606060] font-medium">
                      Ref: {param.referenceRange}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={paramValues[param.key] || ''}
                      onChange={(e) =>
                        setParamValues((prev) => ({
                          ...prev,
                          [param.key]: e.target.value,
                        }))
                      }
                      placeholder={param.placeholder || `Enter ${param.label}...`}
                      className="w-full px-3 py-1.5 bg-[#f5f7fa] border border-[#e8e8e8] focus:border-[#0e162b] focus:bg-white rounded-lg text-xs font-semibold text-[#0e162b] focus:outline-none"
                    />
                    <span className="text-xs font-semibold text-[#606060] shrink-0 min-w-[44px] text-right">
                      {param.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#0e162b] block mb-1">
                  Clinical Interpretation &amp; Findings Summary
                </label>
                <input
                  type="text"
                  value={doctorInterpretation}
                  onChange={(e) => setDoctorInterpretation(e.target.value)}
                  placeholder="Enter clinical interpretation of these lab values..."
                  className="w-full px-3 py-2 bg-white border border-[#e8e8e8] focus:border-[#0e162b] rounded-xl text-xs text-[#0e162b] focus:outline-none"
                />
              </div>
              <div className="flex items-end">
                <label className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#e8e8e8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFlaggedAbnormal}
                    onChange={(e) => setIsFlaggedAbnormal(e.target.checked)}
                    className="accent-[#e11d48] rounded"
                  />
                  <AlertTriangle className={`w-3.5 h-3.5 ${isFlaggedAbnormal ? 'text-[#e11d48]' : 'text-[#8e8e8e]'}`} />
                  <span className="text-xs font-semibold text-[#0e162b]">
                    Flag Abnormal
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e8e8e8] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsOrderLabModalOpen(false)}
              className="px-4 py-2 border border-[#e8e8e8] hover:border-[#0e162b] text-[#0e162b] rounded-full font-semibold text-xs transition-colors"
            >
              {sessionAddedTests.length > 0 ? 'Done / Close' : 'Cancel'}
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAddAndEnterNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#0e162b] hover:bg-[#f5f7fa] text-[#0e162b] rounded-full font-semibold text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#00c0fe]" />
                <span>Save &amp; Enter Next Test</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#0e162b] hover:bg-[#213364] text-white rounded-full font-semibold text-xs transition-colors shadow-xs"
              >
                Save &amp; Finish
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
