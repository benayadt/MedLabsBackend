'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Card, CardHeader, CardTitle, CardBody } from '../ui/Card';

interface ReportApprovalProps {
  reportId: string;
  onApprove: (comments: string) => Promise<void>;
  onReject: (comments: string) => Promise<void>;
  disabled?: boolean;
}

export const ReportApproval: React.FC<ReportApprovalProps> = ({
  reportId,
  onApprove,
  onReject,
  disabled = false
}) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    try {
      setProcessing(true);
      setError(null);
      await onApprove(comments);
      setShowApproveModal(false);
      setComments('');
    } catch (err) {
      setError('Failed to approve report');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      await onReject(comments);
      setShowRejectModal(false);
      setComments('');
    } catch (err) {
      setError('Failed to reject report');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleModalClose = (isApprove: boolean) => {
    if (isApprove) {
      setShowApproveModal(false);
    } else {
      setShowRejectModal(false);
    }
    setComments('');
    setError(null);
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="danger"
          onClick={() => setShowRejectModal(true)}
          disabled={disabled || processing}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Reject Report
        </Button>
        <Button
          onClick={() => setShowApproveModal(true)}
          disabled={disabled || processing}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Approve Report
        </Button>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => handleModalClose(true)}
        title="Approve Report"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to approve this report? This action will finalize the report and make it available for official use.
          </p>

          <div>
            <label htmlFor="approve-comments" className="block text-sm font-medium text-gray-700 mb-2">
              Comments (Optional)
            </label>
            <textarea
              id="approve-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any comments or notes about this approval..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={processing}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => handleModalClose(true)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={processing}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {processing ? 'Approving...' : 'Approve Report'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => handleModalClose(false)}
        title="Reject Report"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Please provide a reason for rejecting this report. Your comments will help the author understand what needs to be revised.
          </p>

          <div>
            <label htmlFor="reject-comments" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Rejection <span className="text-red-600">*</span>
            </label>
            <textarea
              id="reject-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Explain what needs to be corrected or improved..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              disabled={processing}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Required: Please provide specific feedback for the author
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => handleModalClose(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={processing || !comments.trim()}
            >
              <XCircle className="w-4 h-4 mr-2" />
              {processing ? 'Rejecting...' : 'Reject Report'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Compact version for inline use
export const ReportApprovalCard: React.FC<ReportApprovalProps> = ({
  reportId,
  onApprove,
  onReject,
  disabled = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Review Actions
        </CardTitle>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-gray-600 mb-4">
          This report is pending your review. Please approve or reject with comments.
        </p>
        <ReportApproval
          reportId={reportId}
          onApprove={onApprove}
          onReject={onReject}
          disabled={disabled}
        />
      </CardBody>
    </Card>
  );
};
