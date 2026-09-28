'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Biopsy } from '@/lib/mock-data/biopsies';
import { Patient } from '@/lib/mock-data/patients';
import { StatusBadge } from '@/app/components/shared/StatusBadge';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { Calendar, MapPin, User, FlaskConical } from 'lucide-react';

interface BiopsyCardProps {
  biopsy: Biopsy;
  patient: Patient;
  onClick?: () => void;
}

export const BiopsyCard: React.FC<BiopsyCardProps> = ({ biopsy, patient, onClick }) => {
  return (
    <Link href={`/dashboard/biopsies/${biopsy.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" padding="md">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{biopsy.labCode}</h3>
              <p className="text-sm text-gray-600">
                {patient.firstName} {patient.lastName}
              </p>
            </div>
            <StatusBadge status={biopsy.status} />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center text-gray-600">
              <FlaskConical className="h-4 w-4 mr-2 text-gray-400" />
              {biopsy.specimenType}
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              {biopsy.source.name}
            </div>

            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              Received: {format(new Date(biopsy.dateReceived), 'MMM dd, yyyy')}
            </div>

            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              {biopsy.sender.name}
            </div>
          </div>

          {/* Footer */}
          {biopsy.source.location && (
            <div className="pt-2 border-t border-gray-100">
              <Badge variant="default" size="sm">
                {biopsy.source.location}
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
