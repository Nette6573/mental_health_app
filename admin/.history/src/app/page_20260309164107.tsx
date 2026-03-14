import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to admin login page
  redirect('/admin/login')
}