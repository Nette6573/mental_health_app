import { Therapist, TherapistApplication } from '@/types/therapists'

export const THERAPIST_SPECIALIZATIONS = [
  'Anxiety', 'Depression', 'Trauma', 'PTSD', 'Grief',
  'Relationship Issues', 'Family Conflict', 'Addiction',
  'Eating Disorders', 'OCD', 'Bipolar Disorder', 'Stress Management',
  'Self Esteem', 'Anger Management', 'Life Transitions',
  'Career Counseling', 'Faith-Based Counseling', 'Christian Counseling',
  'Premarital Counseling', 'Parenting',
]

export const THERAPIST_CREDENTIALS = [
  'PhD', 'PsyD', 'MD', 'LPC', 'LMFT', 'LCSW', 'LMHC',
  'LCMHC', 'LPCC', 'LCPC', 'CCBT', 'EMDR Certified',
]

export const LANGUAGES = [
  'English', 'Spanish', 'French', 'Portuguese', 'Mandarin',
  'Cantonese', 'Japanese', 'Korean', 'Russian', 'Arabic',
  'Hindi', 'Tagalog', 'Jamaican Patois',
]

export const INSURANCE_PROVIDERS = [
  'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare',
  'Humana', 'Medicare', 'Medicaid', 'Tricare', 'Optum',
  'Kaiser Permanente',
]

export const THERAPIST_STATUS = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'suspended', label: 'Suspended', color: 'red' },
  { value: 'on-leave', label: 'On Leave', color: 'yellow' },
]

export const VERIFICATION_STATUS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'verified', label: 'Verified', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
]

export const MOCK_THERAPISTS: Therapist[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@hopepath.org',
    phone: '+1-876-555-0101',
    gender: 'female',
    credentials: ['PhD', 'LPC'],
    specializations: ['Anxiety', 'Depression', 'Trauma', 'Faith-Based Counseling'],
    licenseNumber: 'LPC-12345',
    licenseIssuingBoard: 'Jamaica Council of Professions',
    licenseExpiryDate: '2026-12-31',
    yearsOfExperience: 12,
    education: [
      {
        degree: 'PhD in Clinical Psychology',
        institution: 'University of the West Indies',
        year: 2012,
      },
    ],
    offersOnlineTherapy: true,
    offersInPersonTherapy: true,
    languages: ['English', 'Spanish'],
    sessionTypes: {
      individual: true,
      couples: true,
      family: false,
      group: true,
    },
    sessionRate: {
      individual: 120,
      couples: 150,
      group: 60,
    },
    acceptsInsurance: true,
    insuranceProviders: ['Blue Cross Blue Shield', 'Aetna'],
    slidingScale: true,
    slidingScaleRange: {
      min: 80,
      max: 120,
    },
    availability: {},
    bio: "Dr. Sarah Johnson is a licensed professional counselor with over 12 years of experience.",
    profileCompleted: true,
    verificationStatus: 'verified',
    status: 'active',
    totalSessions: 1243,
    totalClients: 89,
    averageRating: 4.8,
    totalReviews: 67,
    completedSessions: 1187,
    cancelledSessions: 42,
    noShowSessions: 14,
    joinedDate: '2024-01-15',
    lastActive: new Date().toISOString(),
  },
]