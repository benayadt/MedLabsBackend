'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import { ReportEditor } from './ReportEditor';
import { Card, CardHeader, CardTitle, CardBody } from '../ui/Card';

export interface ReportSections {
  findings: string;
  diagnosis: string;
  recommendations: string;
}

interface StructuredReportEditorProps {
  initialSections: ReportSections;
  onChange: (sections: ReportSections) => void;
  onSave?: () => void;
  autoSave?: boolean;
  autoSaveDelay?: number;
  readOnly?: boolean;
  showSaveButton?: boolean;
}

export const StructuredReportEditor: React.FC<StructuredReportEditorProps> = ({
  initialSections,
  onChange,
  onSave,
  autoSave = true,
  autoSaveDelay = 2000,
  readOnly = false,
  showSaveButton = true
}) => {
  const [sections, setSections] = useState<ReportSections>(initialSections);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Update parent when sections change
  useEffect(() => {
    onChange(sections);
  }, [sections, onChange]);

  const updateSection = (section: keyof ReportSections, content: string) => {
    setSections(prev => ({
      ...prev,
      [section]: content
    }));
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave();
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error saving report:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const getSectionPlaceholder = (section: keyof ReportSections): string => {
    const placeholders = {
      findings: 'Describe the gross and microscopic examination findings. Include details about specimen appearance, measurements, and pathological observations...',
      diagnosis: 'Provide the final diagnosis based on the examination. Be specific and use standard medical terminology...',
      recommendations: 'Suggest next steps, additional tests, or clinical recommendations based on the findings...'
    };
    return placeholders[section];
  };

  const getSectionTitle = (section: keyof ReportSections): string => {
    const titles = {
      findings: 'Findings',
      diagnosis: 'Diagnosis',
      recommendations: 'Recommendations'
    };
    return titles[section];
  };

  const getSectionDescription = (section: keyof ReportSections): string => {
    const descriptions = {
      findings: 'Document gross and microscopic examination results',
      diagnosis: 'Final diagnostic impression',
      recommendations: 'Clinical recommendations and next steps'
    };
    return descriptions[section];
  };

  return (
    <div className="space-y-6">
      {/* Auto-save indicator */}
      {autoSave && !readOnly && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span>Auto-save is enabled</span>
          </div>
          {lastSaved && (
            <span className="text-xs text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      )}

      {/* Findings Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {getSectionTitle('findings')}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {getSectionDescription('findings')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <ReportEditor
            content={sections.findings}
            onChange={(content) => updateSection('findings', content)}
            onSave={autoSave ? handleSave : undefined}
            placeholder={getSectionPlaceholder('findings')}
            autoSave={autoSave}
            autoSaveDelay={autoSaveDelay}
            readOnly={readOnly}
          />
        </CardBody>
      </Card>

      {/* Diagnosis Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {getSectionTitle('diagnosis')}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {getSectionDescription('diagnosis')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <ReportEditor
            content={sections.diagnosis}
            onChange={(content) => updateSection('diagnosis', content)}
            onSave={autoSave ? handleSave : undefined}
            placeholder={getSectionPlaceholder('diagnosis')}
            autoSave={autoSave}
            autoSaveDelay={autoSaveDelay}
            readOnly={readOnly}
          />
        </CardBody>
      </Card>

      {/* Recommendations Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {getSectionTitle('recommendations')}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {getSectionDescription('recommendations')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <ReportEditor
            content={sections.recommendations}
            onChange={(content) => updateSection('recommendations', content)}
            onSave={autoSave ? handleSave : undefined}
            placeholder={getSectionPlaceholder('recommendations')}
            autoSave={autoSave}
            autoSaveDelay={autoSaveDelay}
            readOnly={readOnly}
          />
        </CardBody>
      </Card>

      {/* Manual Save Button */}
      {showSaveButton && onSave && !autoSave && !readOnly && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Report'}
          </button>
        </div>
      )}
    </div>
  );
};

// Read-only viewer for structured reports
export const StructuredReportViewer: React.FC<{ sections: ReportSections }> = ({ sections }) => {
  return (
    <StructuredReportEditor
      initialSections={sections}
      onChange={() => {}}
      readOnly={true}
      showSaveButton={false}
      autoSave={false}
    />
  );
};
