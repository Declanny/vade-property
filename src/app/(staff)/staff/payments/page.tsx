'use client';

import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useStaffBookings } from '@/lib/hooks/useStaffBookings';
import { useStaffPermissions } from '@/contexts/StaffAuthContext';

// Staff theme color
const STAFF_PRIMARY = '#1E40AF';

export default function PaymentsPage() {
  const { payments } = useStaffBookings();
  const permissions = useStaffPermissions();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: CheckCircle,
        };
      case 'pending':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          icon: Clock,
        };
      case 'failed':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock };
    }
  };

  // Stats
  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    completed: payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    pending: payments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  // Check permission
  if (!permissions?.canViewPayments) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900">Access Restricted</h2>
          <p className="text-gray-500 mt-2">
            You don&apos;t have permission to view payment information.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Contact a manager if you need access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">Shortlet booking payments for your properties</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(stats.total)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {formatCurrency(stats.completed)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {formatCurrency(stats.pending)}
          </p>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            {payments.length} payment{payments.length !== 1 ? 's' : ''}
          </h2>
        </div>
        <div className="overflow-x-auto">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No payments found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="px-4 py-3 font-medium">Guest</th>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  const statusInfo = getStatusBadge(payment.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr
                      key={payment.bookingId}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {payment.guestName}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {payment.propertyName}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-sm">
                        {payment.reference || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
