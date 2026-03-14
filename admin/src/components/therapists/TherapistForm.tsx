'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  PlusIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline'

const therapistSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  credentials: z.array(z.string()).min(1, 'At least one credential is required'),
  specializations: z.array(z.string()).min(1, 'At least one specialization is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseIssuingBoard: z.string().min(1, 'Issuing board is required'),
  licenseExpiryDate: z.string().min(1, 'Expiry date is required'),
  yearsOfExperience: z.number().min(0),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    year: z.number().min(1900).max(new Date().getFullYear()),
  })),
  practiceName: z.string().optional(),
  practiceAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  offersOnlineTherapy: z.boolean(),
  offersInPersonTherapy: z.boolean(),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  sessionTypes: z.object({
    individual: z.boolean(),
    couples: z.boolean(),
    family: z.boolean(),
    group: z.boolean(),
  }),
  sessionRate: z.object({
    individual: z.number().optional(),
    couples: z.number().optional(),
    family: z.number().optional(),
    group: z.number().optional(),
  }),
  acceptsInsurance: z.boolean(),
  insuranceProviders: z.array(z.string()),
  slidingScale: z.boolean(),
  slidingScaleRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']),
  status: z.enum(['active', 'inactive', 'suspended', 'on-leave']),
  emergencyContact: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  }).optional(),
})

type TherapistFormData = z.infer<typeof therapistSchema>

interface TherapistFormProps {
  initialData?: TherapistFormData
  onSubmit: (data: TherapistFormData) => Promise<void>
  onCancel: () => void
  isSaving?: boolean
}

const CREDENTIALS_OPTIONS = [
  'PhD', 'PsyD', 'MD', 'LPC', 'LMFT', 'LCSW', 'LMHC',
  'LCMHC', 'LPCC', 'LCPC', 'CCBT', 'EMDR Certified',
]

const SPECIALIZATIONS = [
  'Anxiety', 'Depression', 'Trauma', 'PTSD', 'Grief',
  'Relationship Issues', 'Family Conflict', 'Addiction',
  'Eating Disorders', 'OCD', 'Bipolar Disorder', 'Stress Management',
  'Self Esteem', 'Anger Management', 'Life Transitions',
  'Career Counseling', 'Faith-Based Counseling', 'Christian Counseling',
  'Premarital Counseling', 'Parenting',
]

const LANGUAGES = [
  'English', 'Spanish', 'French', 'Portuguese', 'Mandarin',
  'Cantonese', 'Japanese', 'Korean', 'Russian', 'Arabic',
  'Hindi', 'Tagalog', 'Jamaican Patois',
]

const INSURANCE_PROVIDERS = [
  'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare',
  'Humana', 'Medicare', 'Medicaid', 'Tricare', 'Optum',
  'Kaiser Permanente',
]

export default function TherapistForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSaving = false 
}: TherapistFormProps) {
  const [activeTab, setActiveTab] = useState('personal')

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TherapistFormData>({
    resolver: zodResolver(therapistSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'prefer-not-to-say',
      credentials: [],
      specializations: [],
      licenseNumber: '',
      licenseIssuingBoard: '',
      licenseExpiryDate: '',
      yearsOfExperience: 0,
      education: [{ degree: '', institution: '', year: new Date().getFullYear() }],
      practiceName: '',
      practiceAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Jamaica',
      },
      offersOnlineTherapy: true,
      offersInPersonTherapy: false,
      languages: ['English'],
      sessionTypes: {
        individual: true,
        couples: false,
        family: false,
        group: false,
      },
      sessionRate: {
        individual: undefined,
        couples: undefined,
        family: undefined,
        group: undefined,
      },
      acceptsInsurance: false,
      insuranceProviders: [],
      slidingScale: false,
      slidingScaleRange: {
        min: undefined,
        max: undefined,
      },
      bio: '',
      verificationStatus: 'pending',
      status: 'inactive',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
        email: '',
      },
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  })

  const watchSessionTypes = watch('sessionTypes')
  const watchAcceptsInsurance = watch('acceptsInsurance')
  const watchSlidingScale = watch('slidingScale')

  const tabs = [
    { id: 'personal', name: 'Personal Info' },
    { id: 'professional', name: 'Professional' },
    { id: 'practice', name: 'Practice' },
    { id: 'schedule', name: 'Schedule' },
    { id: 'emergency', name: 'Emergency Contact' },
  ]

  const handleArrayToggle = (field: 'credentials' | 'specializations' | 'languages' | 'insuranceProviders', value: string) => {
    const current = watch(field) as string[]
    if (current.includes(value)) {
      setValue(field, current.filter(v => v !== value))
    } else {
      setValue(field, [...current, value])
    }
  }

  const handleFormSubmit = async (data: TherapistFormData) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <nav className="flex -mb-px space-x-8 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name *
              </label>
              <input
                {...register('firstName')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                {...register('lastName')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone *
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth
              </label>
              <input
                {...register('dateOfBirth')}
                type="date"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                {...register('gender')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Professional Information Tab */}
      {activeTab === 'professional' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-semibold">Professional Information</h3>

          {/* Credentials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Credentials *
            </label>
            <div className="flex flex-wrap gap-2">
              {CREDENTIALS_OPTIONS.map(cred => {
                const isSelected = watch('credentials')?.includes(cred)
                return (
                  <button
                    key={cred}
                    type="button"
                    onClick={() => handleArrayToggle('credentials', cred)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cred}
                  </button>
                )
              })}
            </div>
            {errors.credentials && (
              <p className="mt-1 text-xs text-red-600">{errors.credentials.message}</p>
            )}
          </div>

          {/* Specializations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Specializations *
            </label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
              {SPECIALIZATIONS.map(spec => {
                const isSelected = watch('specializations')?.includes(spec)
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => handleArrayToggle('specializations', spec)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {spec}
                  </button>
                )
              })}
            </div>
            {errors.specializations && (
              <p className="mt-1 text-xs text-red-600">{errors.specializations.message}</p>
            )}
          </div>

          {/* License Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                License Number *
              </label>
              <input
                {...register('licenseNumber')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.licenseNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.licenseNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Issuing Board *
              </label>
              <input
                {...register('licenseIssuingBoard')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.licenseIssuingBoard && (
                <p className="mt-1 text-xs text-red-600">{errors.licenseIssuingBoard.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiry Date *
              </label>
              <input
                {...register('licenseExpiryDate')}
                type="date"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.licenseExpiryDate && (
                <p className="mt-1 text-xs text-red-600">{errors.licenseExpiryDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience *
              </label>
              <input
                {...register('yearsOfExperience', { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.yearsOfExperience && (
                <p className="mt-1 text-xs text-red-600">{errors.yearsOfExperience.message}</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Education *
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(`education.${index}.degree`)}
                  placeholder="Degree"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  {...register(`education.${index}.institution`)}
                  placeholder="Institution"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  {...register(`education.${index}.year`, { valueAsNumber: true })}
                  type="number"
                  placeholder="Year"
                  className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ degree: '', institution: '', year: new Date().getFullYear() })}
              className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Education
            </button>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Professional Bio *
            </label>
            <textarea
              {...register('bio')}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the therapist's experience, approach, and specialties..."
            />
            {errors.bio && (
              <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Status
              </label>
              <select
                {...register('verificationStatus')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Practice Information Tab */}
      {activeTab === 'practice' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-semibold">Practice Information</h3>

          {/* Practice Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Practice Name
            </label>
            <input
              {...register('practiceName')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h4 className="font-medium">Practice Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  {...register('practiceAddress.street')}
                  placeholder="Street Address"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <input
                  {...register('practiceAddress.city')}
                  placeholder="City"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <input
                  {...register('practiceAddress.state')}
                  placeholder="State/Province"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <input
                  {...register('practiceAddress.zipCode')}
                  placeholder="ZIP Code"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <input
                  {...register('practiceAddress.country')}
                  placeholder="Country"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Therapy Types */}
          <div>
            <h4 className="font-medium mb-3">Therapy Options</h4>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  {...register('offersOnlineTherapy')}
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Online Therapy</span>
              </label>
              <label className="flex items-center">
                <input
                  {...register('offersInPersonTherapy')}
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">In-Person Therapy</span>
              </label>
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Languages Spoken *
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => {
                const isSelected = watch('languages')?.includes(lang)
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleArrayToggle('languages', lang)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {lang}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Session Types */}
          <div>
            <h4 className="font-medium mb-3">Session Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['individual', 'couples', 'family', 'group'].map(type => (
                <label key={type} className="flex items-center">
                  <input
                    {...register(`sessionTypes.${type}`)}
                    type="checkbox"
                    className="mr-2 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Session Rates */}
          <div>
            <h4 className="font-medium mb-3">Session Rates ($)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {watchSessionTypes.individual && (
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Individual</label>
                  <input
                    {...register('sessionRate.individual', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
              {watchSessionTypes.couples && (
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Couples</label>
                  <input
                    {...register('sessionRate.couples', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
              {watchSessionTypes.family && (
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Family</label>
                  <input
                    {...register('sessionRate.family', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
              {watchSessionTypes.group && (
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Group</label>
                  <input
                    {...register('sessionRate.group', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Insurance */}
          <div>
            <label className="flex items-center mb-3">
              <input
                {...register('acceptsInsurance')}
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm font-medium">Accepts Insurance</span>
            </label>

            {watchAcceptsInsurance && (
              <div className="ml-6 mt-2">
                <div className="flex flex-wrap gap-2">
                  {INSURANCE_PROVIDERS.map(provider => {
                    const isSelected = watch('insuranceProviders')?.includes(provider)
                    return (
                      <button
                        key={provider}
                        type="button"
                        onClick={() => handleArrayToggle('insuranceProviders', provider)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {provider}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sliding Scale */}
          <div>
            <label className="flex items-center mb-3">
              <input
                {...register('slidingScale')}
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm font-medium">Offers Sliding Scale</span>
            </label>

            {watchSlidingScale && (
              <div className="ml-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Min Rate ($)</label>
                  <input
                    {...register('slidingScaleRange.min', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Max Rate ($)</label>
                  <input
                    {...register('slidingScaleRange.max', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Schedule</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Schedule management coming soon. You'll be able to set weekly availability here.
          </p>
        </div>
      )}

      {/* Emergency Contact Tab */}
      {activeTab === 'emergency' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Name
              </label>
              <input
                {...register('emergencyContact.name')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Relationship
              </label>
              <input
                {...register('emergencyContact.relationship')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                {...register('emergencyContact.phone')}
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                {...register('emergencyContact.email')}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <span>{initialData ? 'Update Therapist' : 'Add Therapist'}</span>
          )}
        </button>
      </div>
    </form>
  )
}