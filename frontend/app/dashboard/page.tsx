'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { useCurrentUser } from '@/lib/store/user-store';
import { mockBiopsyApi, mockReportApi } from '@/lib/utils/mock-api';
import { Microscope, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';

export default function DashboardPage() {
  const currentUser = useCurrentUser();
  const [stats, setStats] = useState({
    totalBiopsies: 0,
    pendingApproval: 0,
    inAnalysis: 0,
    completedThisWeek: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const biopsies = await mockBiopsyApi.getAll();
      const reports = await mockReportApi.getAll();

      // Calculate stats
      const totalBiopsies = biopsies.length;
      const pendingApproval = biopsies.filter(b => b.status === 'pending-approval').length;
      const inAnalysis = biopsies.filter(b => b.status === 'in-analysis').length;
      
      // Count completed in last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const completedThisWeek = biopsies.filter(b => 
        (b.status === 'completed' || b.status === 'approved') &&
        new Date(b.dateReceived) >= weekAgo
      ).length;

      setStats({
        totalBiopsies,
        pendingApproval,
        inAnalysis,
        completedThisWeek,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {currentUser?.name || 'User'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Biopsies</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {isLoading ? '...' : stats.totalBiopsies}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Microscope className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {isLoading ? '...' : stats.pendingApproval}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Analysis</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {isLoading ? '...' : stats.inAnalysis}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed This Week</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {isLoading ? '...' : stats.completedThisWeek}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/biopsies">
              <Button variant="secondary" className="w-full justify-start">
                <Microscope className="h-5 w-5 mr-2" />
                View All Biopsies
              </Button>
            </Link>
            
            <Link href="/dashboard/biopsies?status=pending-approval">
              <Button variant="secondary" className="w-full justify-start">
                <FileText className="h-5 w-5 mr-2" />
                Pending Approvals
              </Button>
            </Link>
            
            <Link href="/dashboard/patients">
              <Button variant="secondary" className="w-full justify-start">
                <FileText className="h-5 w-5 mr-2" />
                Patient Records
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      {/* Role Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardBody>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Demo Mode Active</h3>
              <p className="text-sm text-blue-800">
                You are currently viewing as <strong>{currentUser?.name}</strong> ({currentUser?.role}). 
                Use the role selector in the header to switch between different user roles and see how permissions affect the interface.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
