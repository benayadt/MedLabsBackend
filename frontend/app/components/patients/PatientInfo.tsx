'use client';

import React from 'react';
import { format, differenceInYears } from 'date-fns';
import { User, Calendar, Hash } from 'lucide-react';
import { Patient } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardBody } from '../ui/Card';

interface PatientInfoProps {
  patient: Patient;
  showHeader?: boolean;
  className?: string;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ 
  patient, 
  showHeader = true,
  className = '' 
}) => {
  const calculateAge = (dateOfBirth: string): number => {
    return differenceInYears(new Date(), new Date(dateOfBirth));
  };

  const getGenderLabel = (gender: 'M' | 'F' | 'Other'): string => {
    switch (gender) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      case 'Other':
        return 'Other';
      default:
        return gender;
    }
  };

  const age = calculateAge(patient.dateOfBirth);

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
          <User className="w-4 h-4" />
          Full Name
        </label>
        <p className="text-base text-gray-900 mt-1 font-medium">
          {patient.firstName} {patient.lastName}
        </p>
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
          <Hash className="w-4 h-4" />
          Medical Record Number
        </label>
        <p className="text-base text-gray-900 mt-1 font-mono">
          {patient.medicalRecordNumber}
        </p>
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Date of Birth
        </label>
        <p className="text-base text-gray-900 mt-1">
          {format(new Date(patient.dateOfBirth), 'PPP')}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">
          Age: {age} years
        </p>
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-500">
          Gender
        </label>
        <p className="text-base text-gray-900 mt-1">
          {getGenderLabel(patient.gender)}
        </p>
      </div>
    </div>
  );

  if (!showHeader) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <User className="w-5 h-5 inline mr-2" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardBody>
        {content}
      </CardBody>
    </Card>
  );
};

// Compact version for inline display
export const PatientInfoCompact: React.FC<{ patient: Patient; className?: string }> = ({ 
  patient, 
  className = '' 
}) => {
  const age = differenceInYears(new Date(), new Date(patient.dateOfBirth));
  const genderLabel = patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other';

  return (
    <div className={`flex items-center gap-4 text-sm ${className}`}>
      <div className="flex items-center gap-1">
        <User className="w-4 h-4 text-gray-400" />
        <span className="font-medium text-gray-900">
          {patient.firstName} {patient.lastName}
        </span>
      </div>
      <div className="flex items-center gap-1 text-gray-600">
        <Hash className="w-4 h-4 text-gray-400" />
        <span className="font-mono">{patient.medicalRecordNumber}</span>
      </div>
      <div className="text-gray-600">
        {genderLabel}, {age} years
      </div>
      <div className="text-gray-500 text-xs">
        DOB: {format(new Date(patient.dateOfBirth), 'PP')}
      </div>
    </div>
  );
};

// Summary version for cards/lists
export const PatientInfoSummary: React.FC<{ patient: Patient; className?: string }> = ({ 
  patient, 
  className = '' 
}) => {
  const age = differenceInYears(new Date(), new Date(patient.dateOfBirth));
  const genderLabel = patient.gender === 'M' ? 'M' : patient.gender === 'F' ? 'F' : 'O';

  return (
    <div className={`space-y-1 ${className}`}>
      <p className="font-medium text-gray-900">
        {patient.firstName} {patient.lastName}
      </p>
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span className="font-mono">{patient.medicalRecordNumber}</span>
        <span>•</span>
        <span>{genderLabel}, {age}y</span>
      </div>
    </div>
  );
};
