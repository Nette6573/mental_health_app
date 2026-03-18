export interface TimeSlot {
  start: string
  end: string
  isBooked: boolean
  sessionId?: string
}

export interface Therapist {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  credentials: string[]
  specializations: string[]
  licenseNumber: string
  licenseIssuingBoard: string
  licenseExpiryDate: string
  yearsOfExperience: number
  education: {
    degree: string
    institution: string
    year: number
  }[]
  practiceName?: string
  practiceAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  offersOnlineTherapy: boolean
  offersInPersonTherapy: boolean
  languages: string[]
  sessionTypes: {
    individual: boolean
    couples: boolean
    family: boolean
    group: boolean
  }
  sessionRate: {
    individual?: number
    couples?: number
    family?: number
    group?: number
  }
  acceptsInsurance: boolean
  insuranceProviders: string[]
  slidingScale: boolean
  slidingScaleRange?: {
    min: number
    max: number
  }
  availability: {
    monday?: TimeSlot[]
    tuesday?: TimeSlot[]
    wednesday?: TimeSlot[]
    thursday?: TimeSlot[]
    friday?: TimeSlot[]
    saturday?: TimeSlot[]
    sunday?: TimeSlot[]
  }
  bio: string
  profileImage?: string
  profileCompleted: boolean
  verificationStatus: 'pending' | 'verified' | 'rejected'
  status: 'active' | 'inactive' | 'suspended' | 'on-leave'
  totalSessions: number
  totalClients: number
  averageRating: number
  totalReviews: number
  completedSessions: number
  cancelledSessions: number
  noShowSessions: number
  joinedDate: string
  lastActive?: string
  notes?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
    email?: string
  }
}

export interface TherapistApplication {
  id: string
  therapistId: string
  firstName: string
  lastName: string
  email: string
  credentials: string[]
  specializations: string[]
  licenseNumber: string
  licenseImage?: string
  resume?: string
  applicationDate: string
  status: 'pending' | 'under-review' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewDate?: string
  reviewNotes?: string
}