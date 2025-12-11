'use client';

import { useState } from 'react';
import { Send, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function InviteOwnerPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      }, 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/owners"
          className="inline-flex items-center mb-4 hover:opacity-80 transition-opacity"
          style={{ color: '#0B3D2C' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Owners
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Invite Property Owner</h1>
        <p className="text-gray-600 mt-2">
          Send an invitation email to onboard a new property owner to the platform
        </p>
      </div>

      {/* Success Message */}
      {isSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-green-900">Invitation Sent Successfully!</p>
            <p className="text-sm text-green-700">The property owner will receive an onboarding email shortly.</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Adewale"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john.adewale@example.com"
            />
            <p className="text-sm text-gray-500 mt-1">
              The invitation link will be sent to this email address
            </p>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+234 803 456 7890"
            />
          </div>

          {/* Custom Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a personal message to the invitation email..."
            />
          </div>

          {/* Email Preview */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Email Preview</h3>
            <div className="bg-white rounded border border-gray-300 p-6 text-sm">
              <p className="font-semibold mb-2">Subject: Welcome to TruVade Property Management</p>
              <div className="space-y-3 text-gray-700">
                <p>Hi {formData.firstName || '[First Name]'},</p>
                <p>
                  You've been invited to join TruVade Property Management platform. We're excited to help you
                  manage your properties efficiently and transparently.
                </p>
                {formData.message && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 italic">
                    "{formData.message}"
                  </div>
                )}
                <p>
                  Click the link below to complete your onboarding and add your properties to our platform:
                </p>
                <div className="bg-blue-600 text-white text-center py-3 rounded font-semibold">
                  Complete Your Onboarding →
                </div>
                <p className="text-xs text-gray-500">
                  This link is unique to you and will expire in 7 days.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending Invitation...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Invitation
                </>
              )}
            </button>
            <Link
              href="/admin/owners"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ The property owner receives an email with a unique onboarding link</li>
          <li>✓ They fill out their details and add their properties</li>
          <li>✓ They can optionally add existing tenant emails during onboarding</li>
          <li>✓ Once completed, they get access to their owner dashboard</li>
          <li>✓ You can track their onboarding progress in the Owners section</li>
        </ul>
      </div>
    </div>
  );
}
