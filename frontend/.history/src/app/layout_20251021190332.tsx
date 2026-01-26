import type { Metadata } from "next";
import { Inter, Poppins } from 'next/font/google'
import "./globals.css";
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = { // Use Metadata type
  title: 'HopePath - Faith-Based Mental Health Support',
  description: 'Combining biblical encouragement with professional mental health resources to guide you toward healing and hope.',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-body bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
        
        {/* CRITICAL FIX: Header and Footer are now inside the <body> */}
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-grow">
            {children}
          </main>
          
          <Footer />
        </div>
        {/* End of corrected structure */}

      </body>
    </html>
  );
}