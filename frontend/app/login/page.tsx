'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/app/components/ui/Button';
import { Microscope } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Microscope className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Anapath MVP</h1>
            <p className="text-gray-600">Anatomical Pathology Laboratory System</p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Sign in with your MedLabs Keycloak account to continue.
              </p>
            </div>

            <Button
              onClick={() => signIn('keycloak', { callbackUrl: '/dashboard' })}
              className="w-full"
            >
              Sign in with Keycloak
            </Button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Dashboard data is still mock data pending API integration.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

