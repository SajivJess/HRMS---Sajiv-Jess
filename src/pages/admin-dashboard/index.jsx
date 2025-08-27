import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsService, alertsService } from '../../services/hrmsService';
import KPICard from './components/KPICard';
import SystemAlerts from './components/SystemAlerts';
import ActivityFeed from './components/ActivityFeed';
import AttendanceChart from './components/AttendanceChart';
import QuickActions from './components/QuickActions';
import DepartmentChart from './components/DepartmentChart';
import { Header } from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import LoadingOverlay from '../../components/ui/LoadingOverlay';

const AdminDashboard = () => {
  const { userProfile, user, loading: authLoading } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [authLoading, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load KPIs
      const kpiData = await analyticsService?.getDashboardKPIs();
      setKpis(kpiData);

      // Load system alerts
      const alertsData = await alertsService?.getSystemAlerts();
      setAlerts(alertsData || []);

      // Load attendance statistics
      const attendanceData = await analyticsService?.getAttendanceStats(30);
      setAttendanceStats(attendanceData || []);

    } catch (err) {
      setError(err?.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingOverlay message="Loading user data..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please sign in to access the dashboard.</p>
          <button
            onClick={() => window.location.href = '/multi-portal-login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingOverlay message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar onToggle={() => {}} />
        <main className="flex-1 p-6 ml-0 md:ml-64 transition-all duration-300">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening in your organization today.
            </p>
            {userProfile?.role && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {userProfile?.role?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-red-600">
                  ⚠️ {error}
                </div>
              </div>
              <button
                onClick={loadDashboardData}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Try again
              </button>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total Employees"
              value={kpis?.totalEmployees?.toString() || '0'}
              change="+5%"
              changeType="positive"
              trend="up"
              icon="👥"
              onClick={() => {}}
            />
            <KPICard
              title="Present Today"
              value={kpis?.presentToday?.toString() || '0'}
              change={`${kpis?.attendanceRate || '0'}%`}
              changeType="positive"
              trend="up"
              icon="✅"
              onClick={() => {}}
            />
            <KPICard
              title="Pending Leaves"
              value={kpis?.pendingLeaves?.toString() || '0'}
              change="-2%"
              changeType="negative"
              trend="down"
              icon="📝"
              onClick={() => {}}
            />
            <KPICard
              title="Payroll Processed"
              value={kpis?.payrollProcessed?.toString() || '0'}
              change="100%"
              changeType="positive"
              trend="up"
              icon="💰"
              onClick={() => {}}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions userRole={userProfile?.role} />
            </div>

            {/* System Alerts */}
            <div className="lg:col-span-2">
              <SystemAlerts alerts={alerts} />
            </div>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <AttendanceChart data={attendanceStats} />
            </div>

            {/* Department Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <DepartmentChart />
            </div>
          </div>

          {/* Activity Feed */}
          <div className="mt-6">
            <ActivityFeed />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;