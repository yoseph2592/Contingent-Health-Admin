import { PlatformDoctor, ClinicCategory, DayOperatingHours } from '../types';

export const PLATFORM_DOCTORS: PlatformDoctor[] = [
  {
    id: 'doc-001',
    name: 'Dr. Hana Tesfaye',
    title: 'MD, Consultant Physician',
    specialty: 'Internal Medicine',
    subspecialty: 'Adult Health & Chronic Disease',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    contingentVerified: true,
    verificationId: 'CONT-VRF-84920',
    credentialSummary: 'Addis Ababa University School of Medicine, Board Certified Internal Medicine, 12 yrs clinical experience.',
    licenseNumber: 'ETH-MED-84920',
    experienceYears: 12,
    education: 'MD - AAU College of Health Sciences, Fellowship in Internal Medicine',
    languages: ['English', 'Amharic'],
    bio: 'Specializing in comprehensive internal medicine diagnostics, hypertension, diabetes management, and geriatric care.',
    rating: 4.9,
    reviewCount: 148,
  },
  {
    id: 'doc-002',
    name: 'Dr. Dawit Bekele',
    title: 'MD, Pediatrician',
    specialty: 'Pediatrics & Child Health',
    subspecialty: 'Neonatal & Adolescent Health',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    contingentVerified: true,
    verificationId: 'CONT-VRF-77219',
    credentialSummary: 'Tikur Anbessa Specialized Hospital Residency, Fellow Pediatric Society. 9 yrs pediatric care.',
    licenseNumber: 'ETH-MED-77219',
    experienceYears: 9,
    education: 'MD - Gondar University, Pediatrics Residency AAU',
    languages: ['English', 'Amharic', 'Oromo'],
    bio: 'Dedicated to compassionate pediatric care, preventive developmental screenings, childhood immunizations, and pediatric asthma.',
    rating: 4.8,
    reviewCount: 112,
  },
  {
    id: 'doc-003',
    name: 'Dr. Sara Ahmed',
    title: 'MD, Dermatologist',
    specialty: 'Dermatology & Skin Health',
    subspecialty: 'Clinical & Cosmetic Dermatology',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813576-58673a5a7b6e?auto=format&fit=crop&q=80&w=400',
    contingentVerified: true,
    verificationId: 'CONT-VRF-92144',
    credentialSummary: 'Certified Dermatologist, Ethiopian Dermatology Society Member, Advanced laser and dermatologic therapeutics.',
    licenseNumber: 'ETH-MED-92144',
    experienceYears: 8,
    education: 'MD - Jimma University, Postgrad Dermatology St. Paul’s Hospital',
    languages: ['English', 'Amharic'],
    bio: 'Expertise in eczema, acne management, allergic skin disorders, psoriasis, skin biopsies, and phototherapy.',
    rating: 4.9,
    reviewCount: 94,
  },
  {
    id: 'doc-004',
    name: 'Dr. Michael Chen',
    title: 'MD, FACC, Cardiologist',
    specialty: 'Cardiology',
    subspecialty: 'Non-Invasive Cardiovascular Care',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    contingentVerified: true,
    verificationId: 'CONT-VRF-65201',
    credentialSummary: 'Board Certified Cardiology, Former Clinical Director, Specialist in Echocardiography & ECG stress analysis.',
    licenseNumber: 'ETH-MED-65201',
    experienceYears: 14,
    education: 'MD - Johns Hopkins, Cardiology Fellowship UCSF',
    languages: ['English', 'Mandarin'],
    bio: 'Specializing in heart failure management, arrhythmia screening, arterial hypertension, and preventive cardiac wellness.',
    rating: 5.0,
    reviewCount: 165,
  },
  {
    id: 'doc-005',
    name: 'Dr. Beth Berhanu',
    title: 'MD, Consultant OB/GYN',
    specialty: 'Obstetrics & Gynecology',
    subspecialty: 'Maternal-Fetal Wellness',
    avatarUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&q=80&w=400',
    contingentVerified: true,
    verificationId: 'CONT-VRF-81930',
    credentialSummary: 'Specialist OB/GYN, Royal College Associate, Over 1,200 successful deliveries & surgical procedures.',
    licenseNumber: 'ETH-MED-81930',
    experienceYears: 11,
    education: 'MD - Hawassa University, Master in Clinical OB/GYN AAU',
    languages: ['English', 'Amharic'],
    bio: 'Providing comprehensive reproductive healthcare, prenatal ultrasound, family planning, and minimally invasive gynecologic care.',
    rating: 4.9,
    reviewCount: 138,
  },
  {
    id: 'doc-006',
    name: 'Dr. Abdi Mohammed',
    title: 'MD, General Physician',
    specialty: 'General Practice & Family Medicine',
    subspecialty: 'Preventive Health & Urgent Care',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
    contingentVerified: true,
    verificationId: 'CONT-VRF-99432',
    credentialSummary: 'General Practitioner with primary care focus, emergency triage certification, 6 yrs clinical practice.',
    licenseNumber: 'ETH-MED-99432',
    experienceYears: 6,
    education: 'MD - Haramaya University College of Health',
    languages: ['English', 'Amharic', 'Oromo', 'Somali'],
    bio: 'Family medicine specialist focusing on routine physical exams, acute illness triage, health screenings, and preventative counseling.',
    rating: 4.7,
    reviewCount: 88,
  },
];

export interface PresetClinicLogo {
  id: string;
  name: string;
  specialtyTag: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  svgDataUri: string;
}

// Generate high quality SVGs as data URIs with distinct brand palettes
export const PRESET_LOGOS: PresetClinicLogo[] = [
  {
    id: 'logo-teal',
    name: "St. Gabriel Medical",
    specialtyTag: 'Clinical Teal & Emerald',
    primaryColor: '#0f766e',
    secondaryColor: '#0284c7',
    accentColor: '#10b981',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="36" fill="#0f766e"/>
        <circle cx="100" cy="100" r="70" fill="#134e4a" opacity="0.4"/>
        <path d="M100 45 V155 M45 100 H155" stroke="#ffffff" stroke-width="22" stroke-linecap="round"/>
        <circle cx="100" cy="100" r="18" fill="#34d399"/>
      </svg>
    `)}`,
  },
  {
    id: 'logo-sapphire',
    name: 'Apex Cardiology & Health',
    specialtyTag: 'Royal Sapphire & Cyan',
    primaryColor: '#1e40af',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="36" fill="#1e40af"/>
        <circle cx="100" cy="100" r="65" fill="#172554" opacity="0.4"/>
        <path d="M45 105 L75 105 L88 65 L108 140 L122 88 L134 105 L155 105" stroke="#38bdf8" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="100" cy="50" r="8" fill="#ffffff"/>
      </svg>
    `)}`,
  },
  {
    id: 'logo-plum',
    name: "Blossom Women & Child",
    specialtyTag: 'Plum & Coral Rose',
    primaryColor: '#86198f',
    secondaryColor: '#e11d48',
    accentColor: '#fb7185',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="36" fill="#86198f"/>
        <circle cx="100" cy="100" r="65" fill="#701a75" opacity="0.4"/>
        <path d="M100 60 C120 40 155 55 155 85 C155 120 100 150 100 150 C100 150 45 120 45 85 C45 55 80 40 100 60 Z" fill="#f43f5e"/>
        <circle cx="100" cy="95" r="14" fill="#ffffff"/>
      </svg>
    `)}`,
  },
  {
    id: 'logo-emerald',
    name: 'Horizon Diagnostic Center',
    specialtyTag: 'Forest Pine & Sage',
    primaryColor: '#166534',
    secondaryColor: '#0f766e',
    accentColor: '#22c55e',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="36" fill="#166534"/>
        <circle cx="100" cy="100" r="65" fill="#14532d" opacity="0.4"/>
        <path d="M60 135 A55 55 0 0 1 140 135" stroke="#4ade80" stroke-width="14" stroke-linecap="round" fill="none"/>
        <circle cx="100" cy="90" r="28" fill="#ffffff"/>
        <path d="M100 75 V105 M85 90 H115" stroke="#166534" stroke-width="8" stroke-linecap="round"/>
      </svg>
    `)}`,
  },
];

export const CLINIC_CATEGORIES: ClinicCategory[] = [
  'General Clinic',
  'Specialist Clinic',
  'Medical Center',
  'Dental Clinic',
  'Diagnostic Center',
  "Women's Health",
  "Children's Health",
  'Eye Care Clinic',
  'Other',
];

export const DEFAULT_OPERATING_HOURS: DayOperatingHours[] = [
  { day: 'Monday', isOpen: true, openTime: '08:00', closeTime: '18:00', breakStart: '12:30', breakEnd: '13:30' },
  { day: 'Tuesday', isOpen: true, openTime: '08:00', closeTime: '18:00', breakStart: '12:30', breakEnd: '13:30' },
  { day: 'Wednesday', isOpen: true, openTime: '08:00', closeTime: '18:00', breakStart: '12:30', breakEnd: '13:30' },
  { day: 'Thursday', isOpen: true, openTime: '08:00', closeTime: '18:00', breakStart: '12:30', breakEnd: '13:30' },
  { day: 'Friday', isOpen: true, openTime: '08:00', closeTime: '18:00', breakStart: '12:30', breakEnd: '13:30' },
  { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '14:00' },
  { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '14:00' },
];

export const MEDICAL_SPECIALTIES = [
  'Internal Medicine',
  'Pediatrics & Child Health',
  'Cardiology',
  'Dermatology & Skin Health',
  'Obstetrics & Gynecology',
  'General Surgery',
  'Family Medicine & General Practice',
  'Orthopedic Surgery',
  'Neurology',
  'Ophthalmology',
  'Psychiatry & Behavioral Health',
  'Endocrinology & Diabetes',
  'Gastroenterology',
  'Pulmonology & Respiratory Care',
  'Emergency & Urgent Care Medicine',
  'ENT / Otolaryngology',
  'Anesthesiology & Critical Care',
];

export const POPULAR_LANGUAGES = [
  'English',
  'Amharic',
  'Oromo',
  'Tigrinya',
  'Somali',
  'French',
  'Arabic',
  'Spanish',
  'German',
  'Mandarin',
];

export const CLINIC_DIRECTORY: import('../types').ClinicDirectoryItem[] = [
  {
    id: 'clinic-001',
    name: 'St. Gabriel Medical & Diagnostic Clinic',
    category: 'General Clinic',
    location: 'Bole Medhanealem, Addis Ababa, Ethiopia',
    address: 'Morning Star Plaza, 2nd & 3rd Floor, Bole Sub-City',
    registrationId: 'AA/EFDA/HL-2024/9021',
    facilityLicenseNumber: 'MOH-MED-FAC-88941',
    logoUrl: PRESET_LOGOS[0].svgDataUri,
    primaryColor: '#0f766e',
    isVerified: true,
    activeDoctorsCount: 14,
    servicesCount: 28,
    availableDepartments: ['Internal Medicine', 'Pediatrics & Child Health', 'Diagnostic Lab', 'Family Medicine', 'Urgent Care'],
    description: 'Premier outpatient medical clinic offering comprehensive diagnostics, primary care, pediatric triage, and chronic wellness programs.',
    phone: '+251 11 661 2450',
    email: 'contact@stgabrielclinic.et',
  },
  {
    id: 'clinic-002',
    name: 'Apex Heart Institute & Cardiology Center',
    category: 'Specialist Clinic',
    location: 'Kazanchis Business District, Addis Ababa, Ethiopia',
    address: 'Apex Tower, 4th Floor, Menelik II Avenue',
    registrationId: 'AA/EFDA/SPEC-2023/4019',
    facilityLicenseNumber: 'MOH-SPEC-FAC-40192',
    logoUrl: PRESET_LOGOS[1].svgDataUri,
    primaryColor: '#1e40af',
    isVerified: true,
    activeDoctorsCount: 8,
    servicesCount: 16,
    availableDepartments: ['Cardiology', 'Vascular Medicine', 'Preventive Cardiovascular Care', 'Echocardiography'],
    description: 'Specialized cardiovascular facility with modern catheterization diagnostics, stress echo suites, and cardiac rehabilitation.',
    phone: '+251 11 552 9010',
    email: 'referrals@apexcardio.et',
  },
  {
    id: 'clinic-003',
    name: 'Blossom Women & Child Specialist Clinic',
    category: "Women's Health",
    location: 'Old Airport / Sarbet, Addis Ababa, Ethiopia',
    address: 'Plot 44, Bisrate Gabriel Road',
    registrationId: 'AA/EFDA/MAT-2024/6610',
    facilityLicenseNumber: 'MOH-WH-FAC-66109',
    logoUrl: PRESET_LOGOS[2].svgDataUri,
    primaryColor: '#86198f',
    isVerified: true,
    activeDoctorsCount: 11,
    servicesCount: 22,
    availableDepartments: ['Obstetrics & Gynecology', 'Pediatrics & Child Health', 'Neonatology', 'Fertility Counseling'],
    description: 'Dedicated center for maternal health, high-risk obstetrics, well-woman examinations, and pediatric developmental clinics.',
    phone: '+251 11 371 8840',
    email: 'care@blossomwomen.et',
  },
  {
    id: 'clinic-004',
    name: 'Horizon Diagnostic & Advanced Imaging Center',
    category: 'Diagnostic Center',
    location: 'Sarbet Green Mall Area, Addis Ababa, Ethiopia',
    address: 'Horizon Medical Complex, Ground & 1st Floor',
    registrationId: 'AA/EFDA/DIAG-2023/3310',
    facilityLicenseNumber: 'MOH-MED-FAC-33108',
    logoUrl: PRESET_LOGOS[3].svgDataUri,
    primaryColor: '#166534',
    isVerified: true,
    activeDoctorsCount: 9,
    servicesCount: 35,
    availableDepartments: ['Radiology & Imaging', 'Clinical Pathology', 'Ultrasound & MRI', 'Preventive Health Checkup'],
    description: 'Full-spectrum diagnostic medical center providing 128-slice CT, high-field MRI, automated biochemistry, and pathology analysis.',
    phone: '+251 11 320 4400',
    email: 'info@horizondiagnostics.et',
  },
  {
    id: 'clinic-005',
    name: 'Red Sea Eye Specialty Clinic',
    category: 'Eye Care Clinic',
    location: 'CMC Road, Near Civil Service University, Addis Ababa',
    address: 'Red Sea Building, 2nd Floor',
    registrationId: 'AA/EFDA/EYE-2024/2041',
    facilityLicenseNumber: 'MOH-MED-FAC-20411',
    logoUrl: PRESET_LOGOS[0].svgDataUri,
    primaryColor: '#0369a1',
    isVerified: true,
    activeDoctorsCount: 6,
    servicesCount: 14,
    availableDepartments: ['Ophthalmology', 'Optometry', 'Cataract & Refractive', 'Glaucoma Care'],
    description: 'Comprehensive ophthalmology and surgical vision center equipped with laser vitreoretinal diagnostics and optical lens dispensary.',
    phone: '+251 11 647 1290',
    email: 'reception@redseaeye.et',
  },
  {
    id: 'clinic-006',
    name: 'Bole International Polyclinic & Family Health',
    category: 'Medical Center',
    location: 'Atlas Hotel Area, Bole, Addis Ababa',
    address: 'Namibia Street, Villa 18',
    registrationId: 'AA/EFDA/POLY-2023/7714',
    facilityLicenseNumber: 'MOH-MED-FAC-77142',
    logoUrl: PRESET_LOGOS[1].svgDataUri,
    primaryColor: '#0891b2',
    isVerified: true,
    activeDoctorsCount: 16,
    servicesCount: 30,
    availableDepartments: ['Family Medicine & General Practice', 'Dermatology & Skin Health', 'ENT / Otolaryngology', 'Dental & Maxillofacial'],
    description: 'Multi-specialty international polyclinic offering bilingual family medicine, routine outpatient surgery, and traveler health medicine.',
    phone: '+251 11 663 5510',
    email: 'hello@bolepolyclinic.et',
  },
];

export const DOCTOR_PHOTO_PRESETS = [
  {
    id: 'photo-1',
    label: 'Female Physician 1',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'photo-2',
    label: 'Male Physician 1',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'photo-3',
    label: 'Female Specialist 2',
    url: 'https://images.unsplash.com/photo-1594824813576-58673a5a7b6e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'photo-4',
    label: 'Male Consultant 2',
    url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'photo-5',
    label: 'Female Physician 3',
    url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'photo-6',
    label: 'Male Physician 3',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
  },
];

