'use client';

import React, { useState } from 'react';
import { ChevronDown, User as UserIcon } from 'lucide-react';
import { useCurrentUser, useUserActions } from '@/lib/store/user-store';
import { mockUsers } from '@/lib/mock-data/users';
import { getRoleDisplayName, getRoleColor } from '@/lib/utils/permissions';

export const RoleSimulator: React.FC = () => {
  const currentUser = useCurrentUser();
  const { setCurrentUser } = useUserActions();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  const roleColor = getRoleColor(currentUser.role);
  const roleColorClasses = {
    blue: 'border-blue-500 bg-blue-50',
    purple: 'border-purple-500 bg-purple-50',
    green: 'border-green-500 bg-green-50',
    red: 'border-red-500 bg-red-50',
    gray: 'border-gray-500 bg-gray-50',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-l-4 ${roleColorClasses[roleColor as keyof typeof roleColorClasses]} hover:shadow-md transition-all`}
      >
        <UserIcon className="h-5 w-5 text-gray-600" />
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-900">{currentUser.name}</div>
          <div className="text-xs text-gray-600">{getRoleDisplayName(currentUser.role)}</div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Switch User Role
              </div>
              {mockUsers.map((user) => {
                const userRoleColor = getRoleColor(user.role);
                const isActive = currentUser.id === user.id;
                
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md border-l-4 transition-colors ${
                      isActive
                        ? `${roleColorClasses[userRoleColor as keyof typeof roleColorClasses]} font-medium`
                        : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-600">{getRoleDisplayName(user.role)}</div>
                    {user.specialization && (
                      <div className="text-xs text-gray-500 mt-0.5">{user.specialization}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
