'use client';

import { useState } from 'react';
import { getPendingKYCApplications } from '@/lib/data/adminMock';
import { FileText, Download, Check, X, Eye, AlertCircle, Calendar, Mail, Phone, User } from 'lucide-react';

export default function KYCReviewPage() {
  const [applications] = useState(getPendingKYCApplications());
  const [selectedApplication, setSelectedApplication] = useState(applications[0]);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert(`KYC approved for ${selectedApplication.firstName} ${selectedApplication.lastName}. Lease agreement will be sent next.`);
      setIsProcessing(false);
    }, 1500);
  };

  const handleReject = () => {
    if (!reviewNotes.trim()) {
      alert('Please provide rejection reason in the notes');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      alert(`KYC rejected for ${selectedApplication.firstName} ${selectedApplication.lastName}. Email notification sent.`);
      setIsProcessing(false);
    }, 1500);
  };

  const getDocumentStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Review' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getDocumentIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const getDocumentLabel = (type: string) => {
    const labels: Record<string, string> = {
      id_card: 'National ID / Passport',
      employment_proof: 'Employment Letter',
      guarantor_form: 'Guarantor Form',
      bank_statement: 'Bank Statement',
      other: 'Other Document',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">KYC Review</h1>
        <p className="text-gray-600 mt-1">Review and approve tenant applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-600">Pending Review</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{applications.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-600">Under Review</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-600">Approved Today</p>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-600">Rejected Today</p>
          <p className="text-3xl font-bold text-red-600 mt-2">0</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No pending KYC applications to review at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Applications Queue</h3>
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApplication(app)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedApplication?.id === app.id
                    ? 'border-[#0B3D2C] bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3" style={{ backgroundColor: '#B87333' }}>
                    {app.firstName[0]}{app.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {app.firstName} {app.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{app.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {app.documents.length} documents
                  </span>
                  <span className="text-gray-400">
                    {new Date(app.createdAt).toLocaleDateString('en-NG')}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Review Panel */}
          {selectedApplication && (
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Applicant Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4" style={{ backgroundColor: '#0B3D2C' }}>
                    {selectedApplication.firstName[0]}{selectedApplication.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedApplication.firstName} {selectedApplication.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">KYC Application Review</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Pending Review
                  </span>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {selectedApplication.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {selectedApplication.phone}
                  </div>
                  {selectedApplication.dateOfBirth && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      DOB: {new Date(selectedApplication.dateOfBirth).toLocaleDateString('en-NG')}
                    </div>
                  )}
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    Submitted: {new Date(selectedApplication.createdAt).toLocaleDateString('en-NG')}
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Documents</h3>

                {selectedApplication.documents.length === 0 ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">No Documents Submitted</p>
                      <p className="text-sm text-red-700">This applicant hasn't uploaded any documents yet.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedApplication.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center flex-1">
                            {getDocumentIcon(doc.type)}
                            <div className="ml-3 flex-1">
                              <p className="font-medium text-gray-900">{getDocumentLabel(doc.type)}</p>
                              <p className="text-sm text-gray-500">{doc.fileName}</p>
                            </div>
                          </div>
                          {getDocumentStatusBadge(doc.status)}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleString('en-NG')}
                          </span>
                          <div className="flex space-x-2">
                            <button className="flex items-center px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                            <button className="flex items-center px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Auto-Approval Check */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-gray-500" />
                    Verification Checklist
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-gray-700">All required documents submitted</span>
                    </div>
                    <div className="flex items-center">
                      <X className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-gray-700">Income verification (₦0 vs required ₦0)</span>
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-700">Manual review required</span>
                    </div>
                  </div>
                </div>

                {/* Review Notes */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes / Rejection Reason
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    placeholder="Add notes about your decision..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing || selectedApplication.documents.length === 0}
                    className="flex-1 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ backgroundColor: '#0B3D2C' }}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {isProcessing ? 'Processing...' : 'Approve & Send Lease'}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    {isProcessing ? 'Processing...' : 'Reject Application'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
