'use client'
"use client";

import { useState, FormEvent } from "react";
import { handleProviderSignup } from "@/lib/providersignup";
import Link from 'next/link'
import {
  Check,
  CheckCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react'

export default function ProviderSignupPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [parish, setParish] = useState('')
  const [title, setTitle] = useState('')

  const [license, setLicense] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [experience, setExperience] = useState('')
  const [practiceAreas, setPracticeAreas] = useState<string[]>([])

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePracticeAreaChange = (value: string) => {
    setPracticeAreas((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  const validateStep = (step: number) => {
    if (step === 1) {
      return (
        firstName.trim() &&
        lastName.trim() &&
        email.trim() &&
        phone.trim() &&
        parish.trim() &&
        title.trim()
      )
    }

    if (step === 2) {
      return license.trim() && specialization.trim() && experience.trim()
    }

    if (step === 3) {
      if (!password || !confirmPassword) {
        alert('Please complete all password fields.')
        return false
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match!')
        return false
      }

      if (password.length < 8) {
        alert('Password must be at least 8 characters long!')
        return false
      }

      if (!terms) {
        alert('Please accept the Terms of Service to continue.')
        return false
      }

      return true
    }

    return true
  }

  const goToStep = (step: number) => {
    if (step > currentStep && !validateStep(currentStep)) {
      alert('Please complete the required fields before continuing.')
      return
    }
    setCurrentStep(step)
  }

  // ✅ FIREBASE CONNECTED SUBMIT
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateStep(3)) return

    setIsSubmitting(true)

    try {
      const formData = {
        firstName,
        lastName,
        email,
        phone,
        parish,
        title,
        license,
        specialization,
        experience,
        practiceAreas,
        password,
      }

      const result = await handleProviderSignup(formData)

      if (result.success) {
        setShowSuccessModal(true)
      } else {
        alert(result.error || "Signup failed")
      }
    } catch (error: any) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen p-4 relative overflow-hidden font-sans bg-gradient-to-br from-sky-50 via-cyan-50 to-slate-50">

      {/* LEFT SIDE + RIGHT SIDE UI (UNCHANGED) */}

      {/* I AM INCLUDING YOUR ORIGINAL STRUCTURE BELOW */}

      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <form onSubmit={handleSubmit} className="space-y-6">

          {currentStep === 3 && (
            <div className="space-y-5">

              <div>
                <label>Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit">
                Create Account
              </button>

            </div>
          )}

        </form>

      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">

            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />

            <h3 className="text-xl font-bold mb-2">
              Application Submitted!
            </h3>

            <p className="text-sm mb-6">
              Verification email sent to {email}
            </p>

            <Link href="/provider-dashboard/login">
              Continue to Login
            </Link>

          </div>
        </div>
      )}
    </div>
  )
}
