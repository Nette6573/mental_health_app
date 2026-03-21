'use client';

import { useState, FormEvent } from "react";
import Link from 'next/link';
// I am assuming you are using lucide-react for icons based on the component names. 
// If you use a different library, adjust these imports!
import { Check, CheckCircle, Eye, EyeOff, Info, ArrowRight } from "lucide-react"; 
import { providerSignup } from "@/lib/firebase/providersignup.ts";


export default function ProviderSignupPage() {
  // Navigation & UI State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Data State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [parish, setParish] = useState("");
  const [title, setTitle] = useState("");
  const [license, setLicense] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);

  // Handlers
  const handlePracticeAreaChange = (value: string) => {
    setPracticeAreas((prev) =>
      prev.includes(value)
        ? prev.filter((area) => area !== value)
        : [...prev, value]
    );
  };

  const validateStep = (step: number) => {
    // Basic validation to ensure required fields are filled before proceeding
    if (step === 1) return firstName && lastName && email && phone && parish && title;
    if (step === 2) return license && specialization && experience;
    if (step === 3) return password && password === confirmPassword && terms;
    return true;
  };

  const goToStep = (step: number) => {
    if (step > currentStep && !validateStep(currentStep)) {
      alert("Please fill out all required fields before continuing.");
      return;
    }
    setCurrentStep(step);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) {
      alert("Please check your passwords and accept the terms.");
      return;
    }

    setIsSubmitting(true);

    try {
      // MAPPING LOCAL STATE TO DATABASE FIELDS
      // This ensures no 'undefined' values are sent to Firebase
      const formData = {
        first_name: firstName || "",
        last_name: lastName || "",
        professional_email: email || "", // Matches your database record
        phone_number: phone || "",       // Matches your database record
        parish: parish || "",
        professional_title: title || "", // Matches your database record
        license: license || "",
        specialization: specialization || "",
        experience: experience || "",
        practice_areas: practiceAreas.join(", ") || "", // Convert array to string
        role: "provider",
        password: password, // Still need this for the Auth part
        created_at: new Date(),
      };

      const result = await providerSignup(formData);
      if (result && result.error) {
        alert("Signup Error: " + result.error);
        return;
      }

      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error("Submission error:", error);
      alert("Something went wrong: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen p-4 relative overflow-hidden font-sans bg-gradient-to-br from-sky-50 via-cyan-50 to-slate-50">
      {/* Decorative Background */}
      <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-sky-600/10" />
      <div className="absolute top-1/4 -right-40 w-80 h-80 rounded-full bg-cyan-700/10" />
      <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-amber-600/10" />

      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10 min-h-[800px]">
        
        {/* Left Side */}
        <div className="lg:w-5/12 bg-gradient-to-br from-sky-600 to-cyan-700 p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <img
                src="https://huggingface.co/spaces/brennanlondon/deepsite-project-q0z6c/resolve/main/images/hopepath.png"
                alt="HopePath Logo"
                className="w-16 h-16 rounded-xl object-cover shadow-lg bg-white/20 backdrop-blur-sm"
              />
              <div>
                <h1 className="text-3xl font-bold">HopePath</h1>
                <p className="text-sky-100 text-sm">Provider Portal</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Join our mission
              <br />
              of hope
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-md">
              Create your provider account to connect with individuals seeking
              faith-integrated mental health support across Jamaica.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <p className="font-medium">Create Your Profile</p>
                  <p className="text-sm text-white/70">Share your credentials and expertise</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <p className="font-medium">Get Verified</p>
                  <p className="text-sm text-white/70">Our team reviews your qualifications</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <p className="font-medium">Start Helping Others</p>
                  <p className="text-sm text-white/70">Connect with clients and make a difference</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <p className="text-sm text-white/70">
              Already have an account?{' '}
              <Link href="/provider-dashboard/login" className="text-white font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-7/12 p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Provider Account</h2>
              <p className="text-slate-500 text-sm">
                Complete the form below to start your application. All information is kept secure and confidential.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-sky-600 transition-all duration-300" style={{ width: currentStep > 1 ? '100%' : '0%' }} />
              </div>

              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-sky-600 transition-all duration-300" style={{ width: currentStep > 2 ? '100%' : '0%' }} />
              </div>

              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 3 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                3
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <h3 className="font-semibold text-slate-800 text-lg mb-4">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
                      <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                      <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white" placeholder="Smith" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Professional Email <span className="text-red-500">*</span></label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white" placeholder="dr.smith@practice.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white" placeholder="(876) 555-0123" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Parish <span className="text-red-500">*</span></label>
                      <select required value={parish} onChange={(e) => setParish(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white">
                        <option value="">Select parish...</option>
                        <option>Kingston</option>
                        <option>St. Andrew</option>
                        <option>St. Catherine</option>
                        <option>Clarendon</option>
                        <option>Manchester</option>
                        <option>St. Ann</option>
                        <option>St. James</option>
                        <option>Westmoreland</option>
                        <option>Hanover</option>
                        <option>St. Elizabeth</option>
                        <option>St. Mary</option>
                        <option>Portland</option>
                        <option>St. Thomas</option>
                        <option>Trelawny</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Professional Title <span className="text-red-500">*</span></label>
                      <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white" placeholder="e.g., Clinical Psychologist" />
                    </div>
                  </div>

                  <button type="button" onClick={() => goToStep(2)} className="w-full py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-all duration-200 shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/40">
                    Continue to Professional Details
                  </button>
                </div>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <h3 className="font-semibold text-slate-800 text-lg mb-4">Professional Credentials</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">License/Credential Number <span className="text-red-500">*</span></label>
                    <input type="text" required value={license} onChange={(e) => setLicense(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white" placeholder="e.g., PSY-2024-001" />
                    <p className="text-xs text-slate-500 mt-1">Your professional license or certification number</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Specialization <span className="text-red-500">*</span></label>
                    <select required value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white">
                      <option value="">Select specialization...</option>
                      <option>Clinical Psychology</option>
                      <option>Counseling Psychology</option>
                      <option>Pastoral Counseling</option>
                      <option>Marriage & Family Therapy</option>
                      <option>Addiction Counseling</option>
                      <option>Child & Adolescent Therapy</option>
                      <option>Trauma Therapy</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Years of Experience <span className="text-red-500">*</span></label>
                    <select required value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white">
                      <option value="">Select experience...</option>
                      <option>Less than 1 year</option>
                      <option>1-3 years</option>
                      <option>3-5 years</option>
                      <option>5-10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Areas of Practice (Select all that apply)</label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {[
                        ['depression', 'Depression'],
                        ['anxiety', 'Anxiety'],
                        ['marriage', 'Marriage/Couples'],
                        ['trauma', 'Trauma/PTSD'],
                        ['grief', 'Grief/Loss'],
                        ['addiction', 'Addiction'],
                      ].map(([value, label]) => (
                        <label key={value} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                          <input type="checkbox" checked={practiceAreas.includes(value)} onChange={() => handlePracticeAreaChange(value)} className="w-4 h-4 text-sky-600 rounded focus:ring-sky-600" />
                          <span className="text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => goToStep(1)} className="flex-1 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200">
                      Back
                    </button>
                    <button type="button" onClick={() => goToStep(3)} className="flex-1 py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-all duration-200 shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/40">
                      Continue to Account Setup
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <h3 className="font-semibold text-slate-800 text-lg mb-4">Account Setup</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Create Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Minimum 8 characters with at least one number</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white" placeholder="••••••••" />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" /> Verification Required
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">After creating your account, you&apos;ll need to upload:</p>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                      <li>Professional license or certification</li>
                      <li>Academic credentials (degree/diploma)</li>
                      <li>Government-issued photo ID</li>
                    </ul>
                  </div>

                  <div className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="w-5 h-5 text-sky-600 rounded focus:ring-sky-600 mt-0.5" />
                    <label className="text-sm text-slate-600 cursor-pointer">
                      I agree to the <a href="#" className="text-sky-600 hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-sky-600 hover:underline font-medium">Privacy Policy</a>. I confirm that all information provided is accurate and I am a licensed mental health professional in good standing.
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => goToStep(2)} className="flex-1 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200">
                      Back
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-all duration-200 shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/40 flex items-center justify-center gap-2 disabled:opacity-70">
                      {isSubmitting ? <span>Creating Account...</span> : <><span className="mr-2">Create Account</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Social Signup */}
            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Or sign up with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => alert('Google signup coming soon! Please use email registration for now.')} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Google
                </button>
                <button type="button" onClick={() => alert('Facebook signup coming soon! Please use email registration for now.')} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-slate-600 mt-6">
              Already have an account?{' '}
              <Link href="/provider-dashboard/login" className="text-sky-600 hover:text-cyan-700 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Application Submitted!</h3>
            <p className="text-sm text-slate-500 mb-2">
              Thank you for applying to join HopePath. We&apos;ve sent a verification email to{' '}
              <span className="font-medium text-slate-800">{email}</span>.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Please verify your email and complete your profile to start the verification process.
            </p>
            <Link href="/provider-dashboard/login" className="block w-full py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-colors">
              Continue to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
