'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { StaffAuthProvider, useStaffAuth } from '@/contexts/StaffAuthContext';
import StaffSidebar from '@/components/staff/StaffSidebar';
import StaffHeader from '@/components/staff/StaffHeader';

function StaffLayoutContent({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useStaffAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/staff/login') return;

    // Wait for auth to load
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/staff/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show login page without layout
  if (pathname === '/staff/login') {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard until auth is confirmed
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <StaffHeader />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <StaffAuthProvider>
      <StaffLayoutContent>{children}</StaffLayoutContent>
    </StaffAuthProvider>
  );
}
