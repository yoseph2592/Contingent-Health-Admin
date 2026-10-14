export type OnboardingStep =
  | 'welcome'
  | 'account'
  | 'branding'
  | 'info'
  | 'clinic_info'
  | 'location'
  | 'verification'
  | 'setup'
  | 'doctors'
  | 'services'
  | 'publish'
  | 'preview';

export type StepId = OnboardingStep;

export type ClinicCategory =
  | 'General Clinic'
  | 'Specialist Clinic'
  | 'Medical Center'
  | 'Dental Clinic'
  | 'Diagnostic Center'
  | "Women's Health"
  | "Children's Health"
  | 'Eye Care Clinic'
  | 'Other';

export interface ClinicAdmin {
  fullName: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  role: 'Clinic Administrator / Authorized Representative';
  password?: string;
  workEmail?: string;
}

export type ClinicAccount = ClinicAdmin;

export interface BrandPalette {
  primary: string; // Hex
  secondary: string; // Hex
  accent: string; // Hex
  neutralBg: string; // Hex
  primaryText: string; // '#FFFFFF' or '#0F172A'
  primaryLight: string; // Light tint for badges / highlights
  primaryBorder: string; // Border tint
  primaryContrast?: string;
  lightTint?: string;
  primaryHover?: string;
  isAutoDetected: boolean;
}

export interface ClinicLogoData {
  url: string;
  name: string;
  palette: BrandPalette;
  isCustom: boolean;
}

export interface ClinicInfo {
  name: string;
  category: ClinicCategory;
  shortDescription: string;
  fullDescription: string;
  phone: string;
  email: string;
  website?: string;
}

export interface ClinicLocation {
  country: string;
  city: string;
  address: string;
  area: string;
  buildingUnit: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  landmark?: string;
}

export interface DayOperatingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export type DaySchedule = DayOperatingHours;

export interface OperatingHours {
  schedule: DayOperatingHours[];
  breakPeriods?: string;
  contactNote?: string;
}

export type VerificationStatus =
  | 'not_started'
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'requires_correction'
  | 'rejected'
  | 'Not Started'
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Requires Correction'
  | 'Rejected';

export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate?: string;
  uploadedAt?: string;
  status?: 'valid' | 'pending' | 'rejected';
}

export interface ClinicVerification {
  legalClinicName?: string;
  legalName?: string;
  registrationNumber: string;
  facilityLicenseNumber?: string;
  facilityLicense?: string;
  authorizedRepresentative: string;
  status: VerificationStatus;
  documents: VerificationDocument[];
  submittedAt?: string;
  approvedAt?: string;
  reviewedAt?: string;
  statusNotes?: string;
  notes?: string;
}

export interface PlatformDoctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  subspecialty?: string;
  subSpecialty?: string;
  avatarUrl: string;
  photo?: string;
  contingentVerified: boolean;
  verificationId: string;
  credentialSummary: string;
  credentialsSummary?: string;
  licenseNumber: string;
  professionalId?: string;
  experienceYears: number;
  education: string;
  languages: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  email?: string;
  phone?: string;
}

export type AffiliationStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'cancelled'
  | 'Pending'
  | 'Accepted';

export interface DoctorAffiliation {
  doctorId: string;
  clinicId?: string;
  status?: 'pending' | 'accepted' | 'declined' | 'cancelled';
  affiliationStatus?: AffiliationStatus;
  requestedAt?: string;
  acceptedAt?: string;
  department: string;
  branch: string;
  assignedServiceIds?: string[];
  publicVisible?: boolean;
}

export type AffiliatedDoctor = DoctorAffiliation;

export interface ClinicService {
  id: string;
  name: string;
  category: string;
  description: string;
  durationMinutes: number;
  priceCurrency?: string;
  priceAmount?: number;
  price?: number;
  currency?: string;
  branch: string;
  department: string;
  status: 'active' | 'draft' | 'Active' | 'Draft';
  associatedDoctorIds?: string[];
  assignedDoctorIds?: string[];
  createdAt?: string;
}

export interface ClinicData {
  id?: string;
  account?: ClinicAdmin;
  admin: ClinicAdmin;
  logoUrl: string;
  logoName?: string;
  palette: BrandPalette;
  info: ClinicInfo;
  location: ClinicLocation;
  operatingHours: OperatingHours;
  verification: ClinicVerification;
  affiliatedDoctors: AffiliatedDoctor[];
  services: ClinicService[];
  isPublished: boolean;
}

// ----------------------------------------------------
// DOCTOR SIGN-UP & AFFILIATION FLOW TYPES
// ----------------------------------------------------

export type DoctorOnboardingStep =
  | 'account'
  | 'profile'
  | 'affiliation'
  | 'verification'
  | 'review'
  | 'portal';

export interface DoctorAccountData {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  country: string;
  city: string;
}

export interface DoctorProfileData {
  title: string;
  specialty: string;
  subspecialty?: string;
  licenseNumber: string;
  licensingCountry: string;
  experienceYears: number;
  avatarUrl: string;
  languages: string[];
  bio: string;
  education?: string;
}

export type DoctorAffiliationRequestStatus = 'Pending' | 'Accepted' | 'Declined';

export interface ClinicDirectoryItem {
  id: string;
  name: string;
  category: ClinicCategory;
  location: string;
  address: string;
  registrationId: string;
  facilityLicenseNumber: string;
  logoUrl: string;
  primaryColor: string;
  isVerified: boolean;
  activeDoctorsCount: number;
  servicesCount: number;
  availableDepartments: string[];
  description: string;
  phone: string;
  email: string;
}

export interface DoctorAffiliationEntry {
  clinicId: string;
  clinicName: string;
  clinicCategory: string;
  clinicLocation: string;
  clinicRegistrationId: string;
  clinicLogoUrl: string;
  requestedDepartment: string;
  status: DoctorAffiliationRequestStatus;
  requestedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export type DoctorVerificationStatus = 'Pending' | 'Verified' | 'Needs Review';

export interface DoctorVerificationDocument {
  id: string;
  type: 'medical_license' | 'identity_doc' | 'supporting_credential';
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'valid' | 'pending' | 'rejected';
  previewUrl?: string;
}

export interface DoctorRegistrationState {
  currentStep: DoctorOnboardingStep;
  account: DoctorAccountData;
  profile: DoctorProfileData;
  isOperatingIndependently: boolean;
  affiliations: DoctorAffiliationEntry[];
  verificationStatus: DoctorVerificationStatus;
  verificationDocuments: DoctorVerificationDocument[];
  consent: {
    goodStanding: boolean;
    registryCheck: boolean;
    termsAccepted: boolean;
  };
  isRegistered: boolean;
  contingentVerificationId?: string;
}

