'use client';

import Link from 'next/link';
import { CheckCircle, Home, Mail, ArrowRight } from 'lucide-react';

export default function OnboardingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to TruVade!
          </h1>
          <p className="text-gray-600 mb-8">
            Your account has been set up successfully. You&apos;re all set to start managing your properties.
          </p>

          {/* What's Next */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">What happens next?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-700 text-sm font-medium">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Account Verification</p>
                  <p className="text-sm text-gray-500">
                    Our team will verify your ID and bank details within 24-48 hours.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-700 text-sm font-medium">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Download the App</p>
                  <p className="text-sm text-gray-500">
                    Get the TruVade mobile app to manage your properties on the go.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-700 text-sm font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Start Collecting Rent</p>
                  <p className="text-sm text-gray-500">
                    Once verified, your tenants can start paying rent through TruVade.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Email Notice */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg text-left mb-6">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Check your email for a confirmation message with your login details.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
            <Link
              href="/properties"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Browse Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{' '}
          <Link href="/contact" className="text-[#0B3D2C] hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
