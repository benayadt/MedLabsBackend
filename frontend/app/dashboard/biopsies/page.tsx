'use client';

import React from 'react';
import { BiopsyList } from '@/app/components/biopsies/BiopsyList';
import { Button } from '@/app/components/ui/Button';
import { Plus } from 'lucide-react';
import { useCurrentUser } from '@/lib/store/user-store';
import { canCreateBiopsy } from '@/lib/utils/permissions';
import Link from 'next/link';

export default function BiopsiesPage() {
  const currentUser = useCurrentUser();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biopsies</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track all biopsy specimens
          </p>
        </div>
        
        {currentUser && canCreateBiopsy(currentUser) && (
          <Link href="/dashboard/biopsies/new">
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              New Biopsy
            </Button>
          </Link>
        )}
      </div>

      {/* Biopsy List with Filters */}
      <BiopsyList />
    </div>
  );
}
