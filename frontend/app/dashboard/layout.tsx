'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Microscope, Users, Settings, FileText } from 'lucide-react';
import { RoleSimulator } from '@/app/components/shared/RoleSimulator';
import { AuthStatus } from '@/app/components/shared/AuthStatus';
import { HealthStatus } from '@/app/components/shared/HealthStatus';
import { useCurrentUser } from '@/lib/store/user-store';
import { canAccessSettings } from '@/lib/utils/permissions';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentUser = useCurrentUser();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Biopsies', href: '/dashboard/biopsies', icon: Microscope },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  ];

  // Add settings only for admins
  if (currentUser && canAccessSettings(currentUser)) {
    navigation.push({ name: 'Settings', href: '/dashboard/settings', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <Microscope className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Anapath</span>
              </Link>
            </div>

            {/* Connectivity status + Role Simulator */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end gap-0.5">
                <HealthStatus />
                <AuthStatus />
              </div>
              <RoleSimulator />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                        ${isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon
                        className={`
                          mr-3 h-5 w-5 flex-shrink-0
                          ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                        `}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Mobile navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="flex justify-around">
            {navigation.slice(0, 4).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors
                    ${isActive ? 'text-blue-600' : 'text-gray-500'}
                  `}
                >
                  <Icon className="h-6 w-6 mb-1" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 pb-16 md:pb-0">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
