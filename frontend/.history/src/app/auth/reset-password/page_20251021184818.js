import AuthLayout from '@/components/auth/AuthLayout'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export const metadata = {
  title: 'Reset Password - HopePath',
  description: 'Reset your HopePath account password to regain access to your mental health resources.',
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll help you get back into your account"
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}