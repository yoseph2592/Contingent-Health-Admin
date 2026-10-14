import React, { createContext, useContext, useState } from 'react';
import {
  DoctorOnboardingStep,
  DoctorAccountData,
  DoctorProfileData,
  DoctorAffiliationEntry,
  DoctorAffiliationRequestStatus,
  DoctorVerificationStatus,
  DoctorVerificationDocument,
  ClinicDirectoryItem,
} from '../types';
import {
  CLINIC_DIRECTORY,
  DOCTOR_PHOTO_PRESETS,
  MEDICAL_SPECIALTIES,
} from '../data/mockData';

interface DoctorContextType {
  currentStep: DoctorOnboardingStep;
  setCurrentStep: (step: DoctorOnboardingStep) => void;
  account: DoctorAccountData;
  setAccount: React.Dispatch<React.SetStateAction<DoctorAccountData>>;
  profile: DoctorProfileData;
  setProfile: React.Dispatch<React.SetStateAction<DoctorProfileData>>;
  isOperatingIndependently: boolean;
  setIsOperatingIndependently: React.Dispatch<React.SetStateAction<boolean>>;
  affiliations: DoctorAffiliationEntry[];
  verificationStatus: DoctorVerificationStatus;
  setVerificationStatus: React.Dispatch<React.SetStateAction<DoctorVerificationStatus>>;
  verificationDocuments: DoctorVerificationDocument[];
  consent: {
    goodStanding: boolean;
    registryCheck: boolean;
    termsAccepted: boolean;
  };
  setConsent: React.Dispatch<
    React.SetStateAction<{
      goodStanding: boolean;
      registryCheck: boolean;
      termsAccepted: boolean;
    }>
  >;
  isRegistered: boolean;
  contingentVerificationId: string;

  // Actions
  sendAffiliationRequest: (clinicId: string, department: string, notes?: string) => void;
  removeAffiliation: (clinicId: string) => void;
  updateAffiliationStatus: (clinicId: string, status: DoctorAffiliationRequestStatus) => void;
  toggleIndependentPractice: (forcedVal?: boolean) => void;
  addVerificationDocument: (doc: Omit<DoctorVerificationDocument, 'id' | 'uploadedAt'>) => void;
  removeVerificationDocument: (id: string) => void;
  simulateVerificationCheck: () => void;
  prefillSampleDoctor: () => void;
  completeRegistration: () => void;
  resetOnboarding: () => void;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<DoctorOnboardingStep>('account');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [contingentVerificationId, setContingentVerificationId] = useState<string>('CONT-DOC-84920');

  // 1. Account details
  const [account, setAccount] = useState<DoctorAccountData>({
    fullName: 'Dr. Selamawit Desta',
    email: 'dr.selamawit@healthcare.et',
    phone: '+251 91 245 7710',
    password: '',
    country: 'Ethiopia',
    city: 'Addis Ababa',
  });

  // 2. Professional Profile
  const [profile, setProfile] = useState<DoctorProfileData>({
    title: 'MD, Consultant Physician',
    specialty: 'Internal Medicine',
    subspecialty: 'Preventive & Chronic Care',
    licenseNumber: 'ETH-MOH-MED-99412',
    licensingCountry: 'Ethiopia',
    experienceYears: 8,
    avatarUrl: DOCTOR_PHOTO_PRESETS[0].url,
    languages: ['English', 'Amharic'],
    bio: 'Experienced consultant physician focused on diagnostic internal medicine, cardiometabolic risk reduction, hypertension, and patient-centered chronic disease therapy.',
    education: 'MD - Addis Ababa University College of Health Sciences, Specialty Residency in Internal Medicine Tikur Anbessa Hospital.',
  });

  // 3. Affiliation Options
  // Supports both independent operation and multiple clinic affiliations
  const [isOperatingIndependently, setIsOperatingIndependently] = useState<boolean>(false);
  const [affiliations, setAffiliations] = useState<DoctorAffiliationEntry[]>([
    {
      clinicId: 'clinic-001',
      clinicName: 'St. Gabriel Medical & Diagnostic Clinic',
      clinicCategory: 'General Clinic',
      clinicLocation: 'Bole Medhanealem, Addis Ababa, Ethiopia',
      clinicRegistrationId: 'AA/EFDA/HL-2024/9021',
      clinicLogoUrl: CLINIC_DIRECTORY[0].logoUrl,
      requestedDepartment: 'Internal Medicine',
      status: 'Pending',
      requestedAt: '2026-09-14',
      notes: 'Available for morning outpatient consultations and chronic disease management sessions on Mondays, Wednesdays, and Fridays.',
    },
  ]);

  // 4. Verification
  const [verificationStatus, setVerificationStatus] = useState<DoctorVerificationStatus>('Verified');
  const [verificationDocuments, setVerificationDocuments] = useState<DoctorVerificationDocument[]>([
    {
      id: 'vdoc-1',
      type: 'medical_license',
      title: 'National Medical Council License 2025/2026',
      fileName: 'MOH_Medical_Practice_License_Dr_Desta.pdf',
      fileSize: '1.9 MB',
      uploadedAt: '2026-09-14',
      status: 'valid',
    },
    {
      id: 'vdoc-2',
      type: 'identity_doc',
      title: 'National Biometric ID / Passport',
      fileName: 'Passport_Biometric_ID_Copy.pdf',
      fileSize: '2.4 MB',
      uploadedAt: '2026-09-14',
      status: 'valid',
    },
    {
      id: 'vdoc-3',
      type: 'supporting_credential',
      title: 'Internal Medicine Specialty Board Certificate',
      fileName: 'Specialty_Board_Certification_AAU.pdf',
      fileSize: '3.1 MB',
      uploadedAt: '2026-09-14',
      status: 'valid',
    },
  ]);

  // 5. Legal & Consent
  const [consent, setConsent] = useState({
    goodStanding: true,
    registryCheck: true,
    termsAccepted: true,
  });

  // Actions
  const sendAffiliationRequest = (clinicId: string, department: string, notes?: string) => {
    const clinic = CLINIC_DIRECTORY.find((c) => c.id === clinicId);
    if (!clinic) return;

    setAffiliations((prev) => {
      const existing = prev.find((a) => a.clinicId === clinicId);
      if (existing) {
        return prev.map((a) =>
          a.clinicId === clinicId
            ? {
                ...a,
                requestedDepartment: department || a.requestedDepartment,
                status: 'Pending',
                requestedAt: new Date().toISOString().split('T')[0],
                notes: notes || a.notes,
              }
            : a
        );
      }
      return [
        ...prev,
        {
          clinicId: clinic.id,
          clinicName: clinic.name,
          clinicCategory: clinic.category,
          clinicLocation: clinic.location,
          clinicRegistrationId: clinic.registrationId,
          clinicLogoUrl: clinic.logoUrl,
          requestedDepartment: department || clinic.availableDepartments[0] || 'General Medicine',
          status: 'Pending',
          requestedAt: new Date().toISOString().split('T')[0],
          notes: notes || 'Affiliation requested via Contingent Physician Network.',
        },
      ];
    });
  };

  const removeAffiliation = (clinicId: string) => {
    setAffiliations((prev) => prev.filter((a) => a.clinicId !== clinicId));
  };

  const updateAffiliationStatus = (clinicId: string, status: DoctorAffiliationRequestStatus) => {
    setAffiliations((prev) =>
      prev.map((a) =>
        a.clinicId === clinicId
          ? {
              ...a,
              status,
              reviewedAt: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );
  };

  const toggleIndependentPractice = (forcedVal?: boolean) => {
    setIsOperatingIndependently((prev) => (typeof forcedVal === 'boolean' ? forcedVal : !prev));
  };

  const addVerificationDocument = (doc: Omit<DoctorVerificationDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: DoctorVerificationDocument = {
      ...doc,
      id: 'vdoc-' + Date.now(),
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setVerificationDocuments((prev) => [...prev, newDoc]);
  };

  const removeVerificationDocument = (id: string) => {
    setVerificationDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const simulateVerificationCheck = () => {
    // Cycles or approves
    if (verificationStatus === 'Pending') {
      setVerificationStatus('Verified');
    } else if (verificationStatus === 'Verified') {
      setVerificationStatus('Needs Review');
    } else {
      setVerificationStatus('Verified');
    }
  };

  const prefillSampleDoctor = () => {
    setAccount({
      fullName: 'Dr. Michael Chen',
      email: 'dr.michael.chen@cardiohealth.org',
      phone: '+1 (415) 890-2134',
      password: 'SecurePassword123!',
      country: 'United States',
      city: 'San Francisco, CA',
    });

    setProfile({
      title: 'MD, FACC, Cardiologist',
      specialty: 'Cardiology',
      subspecialty: 'Non-Invasive Cardiovascular Care',
      licenseNumber: 'CA-MED-G84902',
      licensingCountry: 'United States',
      experienceYears: 14,
      avatarUrl: DOCTOR_PHOTO_PRESETS[3].url,
      languages: ['English', 'Mandarin'],
      bio: 'Board-certified non-invasive cardiologist specializing in echocardiography, hypertension management, preventive lipids, and holistic cardiac rehabilitation.',
      education: 'MD - Johns Hopkins School of Medicine, Cardiology Fellowship at UCSF Medical Center.',
    });

    setAffiliations([
      {
        clinicId: 'clinic-002',
        clinicName: 'Apex Heart Institute & Cardiology Center',
        clinicCategory: 'Specialist Clinic',
        clinicLocation: 'Kazanchis Business District, Addis Ababa, Ethiopia',
        clinicRegistrationId: 'AA/EFDA/SPEC-2023/4019',
        clinicLogoUrl: CLINIC_DIRECTORY[1].logoUrl,
        requestedDepartment: 'Cardiology',
        status: 'Accepted',
        requestedAt: '2026-09-10',
        reviewedAt: '2026-09-11',
        notes: 'Senior consultant cardiologist in charge of echocardiography reviews and secondary referrals.',
      },
      {
        clinicId: 'clinic-001',
        clinicName: 'St. Gabriel Medical & Diagnostic Clinic',
        clinicCategory: 'General Clinic',
        clinicLocation: 'Bole Medhanealem, Addis Ababa, Ethiopia',
        clinicRegistrationId: 'AA/EFDA/HL-2024/9021',
        clinicLogoUrl: CLINIC_DIRECTORY[0].logoUrl,
        requestedDepartment: 'Internal Medicine',
        status: 'Pending',
        requestedAt: '2026-09-14',
        notes: 'Visiting specialist for complex cardiovascular consults.',
      },
    ]);

    setIsOperatingIndependently(true);
    setVerificationStatus('Verified');
    setContingentVerificationId('CONT-VRF-65201');
  };

  const completeRegistration = () => {
    setIsRegistered(true);
    setCurrentStep('portal');
  };

  const resetOnboarding = () => {
    setIsRegistered(false);
    setCurrentStep('account');
  };

  return (
    <DoctorContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        account,
        setAccount,
        profile,
        setProfile,
        isOperatingIndependently,
        setIsOperatingIndependently,
        affiliations,
        verificationStatus,
        setVerificationStatus,
        verificationDocuments,
        consent,
        setConsent,
        isRegistered,
        contingentVerificationId,
        sendAffiliationRequest,
        removeAffiliation,
        updateAffiliationStatus,
        toggleIndependentPractice,
        addVerificationDocument,
        removeVerificationDocument,
        simulateVerificationCheck,
        prefillSampleDoctor,
        completeRegistration,
        resetOnboarding,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};
