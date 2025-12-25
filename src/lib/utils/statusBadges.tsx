import React from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
} from 'lucide-react';

/**
 * Status badge configuration types
 */
export interface BadgeConfig {
  bg: string;
  text: string;
  label: string;
  icon?: React.ElementType;
}

/**
 * Generic status badge configurations
 */
export const STATUS_CONFIGS: Record<string, BadgeConfig> = {
  // General statuses
  active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Inactive' },

  // Property/Unit statuses
  occupied: { bg: 'bg-green-100', text: 'text-green-700', label: 'Occupied' },
  vacant: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Vacant' },
  under_review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Under Review' },
  maintenance: { bg: 'bg-red-100', text: 'text-red-700', label: 'Maintenance' },
  reserved: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Reserved' },

  // Complaint statuses
  open: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Open' },
  in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Progress' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Closed' },

  // Payment statuses
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
  current: { bg: 'bg-green-100', text: 'text-green-700', label: 'Current' },
  overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' },
  failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
  refunded: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Refunded' },

  // Maintenance statuses
  scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scheduled' },

  // Booking statuses (with icons)
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed', icon: CheckCircle },
  checked_in: { bg: 'bg-green-100', text: 'text-green-700', label: 'Checked In', icon: LogIn },
  checked_out: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Checked Out', icon: LogOut },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled', icon: XCircle },
};

/**
 * Priority badge configurations
 */
export const PRIORITY_CONFIGS: Record<string, BadgeConfig> = {
  low: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Low' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Medium' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High' },
  urgent: { bg: 'bg-red-100', text: 'text-red-700', label: 'Urgent' },
};

/**
 * Render a status badge
 */
export function StatusBadge({ status, showIcon = false }: { status: string; showIcon?: boolean }) {
  const config = STATUS_CONFIGS[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    label: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
  };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {showIcon && Icon && <Icon className="w-3 h-3" />}
      {config.label}
    </span>
  );
}

/**
 * Render a priority badge
 */
export function PriorityBadge({ priority }: { priority: string }) {
  const config = PRIORITY_CONFIGS[priority] || PRIORITY_CONFIGS.low;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

/**
 * Render a type badge (for property types, etc.)
 */
export function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
      {type.replace('_', ' ')}
    </span>
  );
}

/**
 * Get status badge configuration (for custom rendering)
 */
export function getStatusConfig(status: string): BadgeConfig {
  return STATUS_CONFIGS[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    label: status
  };
}

/**
 * Get priority badge configuration (for custom rendering)
 */
export function getPriorityConfig(priority: string): BadgeConfig {
  return PRIORITY_CONFIGS[priority] || PRIORITY_CONFIGS.low;
}
