import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Sign In - HopePath',
  description: 'Sign in to your HopePath account to access mental health resources and support.',
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Access your personalized mental health journey"
    >
      <LoginForm />
    </AuthLayout>
  )
}