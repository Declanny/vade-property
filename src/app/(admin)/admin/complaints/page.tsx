'use client';

import { useState } from 'react';
import { getActiveComplaints, mockComplaints, mockProperties, mockTenants } from '@/lib/data/adminMock';
import { AlertCircle, Clock, CheckCircle, Filter, MessageSquare, Image as ImageIcon, Video } from 'lucide-react';
import type { Complaint, ComplaintStatus } from '@/lib/types/admin';

export default function ComplaintsPage() {
  const [complaints] = useState(mockComplaints);
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'all'>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(complaints[0]);
  const [updateNotes, setUpdateNotes] = useState('');

  const filteredComplaints = complaints.filter(
    c => selectedStatus === 'all' || c.status === selectedStatus
  );

  const getStatusBadge = (status: ComplaintStatus) => {
    const badges = {
      open: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Open' },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock, label: 'In Progress' },
      resolved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Resolved' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-700', icon: CheckCircle, label: 'Closed' },
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: { bg: 'bg-gray-100', text: 'text-gray-700' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      high: { bg: 'bg-orange-100', text: 'text-orange-700' },
      urgent: { bg: 'bg-red-100', text: 'text-red-700' },
    };
    const badge = badges[priority as keyof typeof badges];
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${badge.bg} ${badge.text} uppercase`}>
        {priority}
      </span>
    );
  };

  const getTenantName = (tenantId: string) => {
    const tenant = mockTenants.find(t => t.id === tenantId);
    return tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown';
  };

  const getPropertyName = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown';
  };

  const handleStatusUpdate = (newStatus: ComplaintStatus) => {
    if (!selectedComplaint) return;
    alert(`Complaint status updated to: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Complaints & Maintenance</h1>
        <p className="text-gray-600 mt-1">Manage and resolve tenant complaints</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`text-left p-4 rounded-xl border-2 transition-all ${
            selectedStatus === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-sm font-medium text-gray-600">Total Complaints</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{complaints.length}</p>
        </button>
        <button
          onClick={() => setSelectedStatus('open')}
          className={`text-left p-4 rounded-xl border-2 transition-all ${
            selectedStatus === 'open' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-sm font-medium text-red-700">Open</p>
          <p className="text-3xl font-bold text-red-900 mt-2">
            {complaints.filter(c => c.status === 'open').length}
          </p>
        </button>
        <button
          onClick={() => setSelectedStatus('in_progress')}
          className={`text-left p-4 rounded-xl border-2 transition-all ${
            selectedStatus === 'in_progress' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-sm font-medium text-blue-700">In Progress</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            {complaints.filter(c => c.status === 'in_progress').length}
          </p>
        </button>
        <button
          onClick={() => setSelectedStatus('resolved')}
          className={`text-left p-4 rounded-xl border-2 transition-all ${
            selectedStatus === 'resolved' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-sm font-medium text-green-700">Resolved</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {complaints.filter(c => c.status === 'resolved').length}
          </p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Complaints List</h3>
            <span className="text-sm text-gray-500">{filteredComplaints.length} items</span>
          </div>
          <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
            {filteredComplaints.map((complaint) => (
              <button
                key={complaint.id}
                onClick={() => setSelectedComplaint(complaint)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedComplaint?.id === complaint.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm flex-1 pr-2">
                    {complaint.title}
                  </h4>
                  {getPriorityBadge(complaint.priority)}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">
                    {getPropertyName(complaint.propertyId)}
                  </p>
                  <p className="text-xs text-gray-500">
                    by {getTenantName(complaint.tenantId)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    {getStatusBadge(complaint.status)}
                    <span className="text-xs text-gray-400">
                      {new Date(complaint.createdAt).toLocaleDateString('en-NG')}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Complaint Detail */}
        {selectedComplaint && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getPriorityBadge(selectedComplaint.priority)}
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      {selectedComplaint.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{selectedComplaint.title}</h2>
                  <p className="text-orange-100 text-sm">
                    Complaint ID: {selectedComplaint.id}
                  </p>
                </div>
                <div>{getStatusBadge(selectedComplaint.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-orange-200">Tenant</p>
                  <p className="font-semibold">{getTenantName(selectedComplaint.tenantId)}</p>
                </div>
                <div>
                  <p className="text-orange-200">Property</p>
                  <p className="font-semibold">{getPropertyName(selectedComplaint.propertyId)}</p>
                </div>
                <div>
                  <p className="text-orange-200">Submitted</p>
                  <p className="font-semibold">
                    {new Date(selectedComplaint.createdAt).toLocaleString('en-NG')}
                  </p>
                </div>
                {selectedComplaint.resolvedAt && (
                  <div>
                    <p className="text-orange-200">Resolved</p>
                    <p className="font-semibold">
                      {new Date(selectedComplaint.resolvedAt).toLocaleString('en-NG')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedComplaint.description}</p>
              </div>

              {/* Attachments */}
              {(selectedComplaint.images || selectedComplaint.videos) && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Attachments</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedComplaint.images?.map((img, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-3 flex items-center space-x-3 hover:border-blue-300 cursor-pointer">
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">Image {idx + 1}</span>
                      </div>
                    ))}
                    {selectedComplaint.videos?.map((vid, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-3 flex items-center space-x-3 hover:border-blue-300 cursor-pointer">
                        <Video className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">Video {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
                <div className="space-y-4">
                  {selectedComplaint.timeline.map((entry) => (
                    <div key={entry.id} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{entry.action}</p>
                        {entry.notes && (
                          <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(entry.timestamp).toLocaleString('en-NG')} • by {entry.performedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Notes (if resolved) */}
              {selectedComplaint.resolutionNotes && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Resolution Notes</h3>
                  <p className="text-green-800 text-sm">{selectedComplaint.resolutionNotes}</p>
                </div>
              )}

              {/* Update Form */}
              {selectedComplaint.status !== 'resolved' && selectedComplaint.status !== 'closed' && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Update Complaint</h3>
                  <textarea
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                    placeholder="Add update notes..."
                  />

                  <div className="grid grid-cols-3 gap-3">
                    {selectedComplaint.status === 'open' && (
                      <button
                        onClick={() => handleStatusUpdate('in_progress')}
                        className="text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
                        style={{ backgroundColor: '#0B3D2C' }}
                      >
                        Start Progress
                      </button>
                    )}
                    {selectedComplaint.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusUpdate('resolved')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button className="text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors" style={{ backgroundColor: '#B87333' }}>
                      Assign To
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                      Change Priority
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
