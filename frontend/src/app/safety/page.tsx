// frontend/src/app/safety/page.tsx
"use client";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          🆘 Crisis Support Resources
        </h1>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            If you&apos;re in immediate danger
          </h2>
          <p className="text-lg mb-2">
            Call <span className="font-bold text-2xl">119</span> or go to your nearest hospital
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">
            📞 Jamaica Mental Health Helplines
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="font-bold text-blue-600 min-w-37.5">888-NEW-LIFE:</span>
              <span>Mental Health & Suicide Prevention Helpline</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-blue-600 min-w-37.5">Emergency:</span>
              <span>119</span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            🏥 Public Hospitals by Parish
          </h2>
          <p className="text-gray-600">
            [Add hospital list here from your database]
          </p>
        </div>
      </div>
    </div>
  );
}