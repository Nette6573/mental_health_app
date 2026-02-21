// frontend/src/app/dashboard/therapists/[id]/page.js

// IMPORTANT: generateStaticParams must be in a Server Component
// This function runs on the server at build time
export async function generateStaticParams() {
  // Return an array of objects with the id parameter
  return [{ id: '1' }]
}

// Enable fallback for IDs not generated at build time
export const dynamicParams = true

// Then import the client component
import TherapistProfilePageClient from './TherapistProfilePageClient'

// This is the server component that wraps the client component
export default function Page({ params }) {
  return <TherapistProfilePageClient params={params} />
}