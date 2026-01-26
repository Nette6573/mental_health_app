import AuthLayout from '@/components/auth/AuthLayout'
import SignupForm from '@/components/auth/SignupForm'

export const metadata = {
  title: 'Sign Up - HopePath',
  description: 'Create your HopePath account to start your mental health journey with faith-based support.',
}

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your journey to mental wellness today"
      background="alternative"
    >
      <SignupForm />
    </AuthLayout>
  )
}