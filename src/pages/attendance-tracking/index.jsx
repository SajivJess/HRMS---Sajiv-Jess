import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { attendanceService } from '../../services/hrmsService';
import { Header } from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import AttendanceTable from './components/AttendanceTable';
import AttendanceFilters from './components/AttendanceFilters';
import AttendanceSummaryCards from './components/AttendanceSummaryCards';
import LiveCheckInFeed from './components/LiveCheckInFeed';
import MobileAttendanceCard from './components/MobileAttendanceCard';
import ManualCorrectionModal from './components/ManualCorrectionModal';

const AttendanceTracking = () => {
  const { userProfile, user, employee, isHR, loading: authLoading } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
    endDate: new Date()?.toISOString()?.split('T')?.[0],
    status: '',
    employeeId: isHR ? '' : employee?.id || ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadAttendanceData();
      loadTodayAttendance();
    }
  }, [authLoading, user, filters]);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await attendanceService?.getAttendance(filters);
      setAttendanceData(data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load attendance data');
      console.error('Attendance tracking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayAttendance = async () => {
    if (!employee?.id) return;

    try {
      const today = new Date()?.toISOString()?.split('T')?.[0];
      const data = await attendanceService?.getAttendance({
        employeeId: employee?.id,
        startDate: today,
        endDate: today
      });

      setTodayAttendance(data?.[0] || null);
    } catch (err) {
      console.error('Failed to load today attendance:', err);
    }
  };

  const handleCheckIn = async () => {
    if (!employee?.id) return;

    try {
      await attendanceService?.checkIn(employee?.id);
      await loadTodayAttendance();
      await loadAttendanceData();
    } catch (err) {
      setError(err?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    if (!employee?.id) return;

    try {
      await attendanceService?.checkOut(employee?.id);
      await loadTodayAttendance();
      await loadAttendanceData();
    } catch (err) {
      setError(err?.message || 'Failed to check out');
    }
  };

  const handleManualCorrection = (attendance) => {
    setSelectedAttendance(attendance);
    setShowCorrectionModal(true);
  };

  const handleSaveCorrection = async (correctionData) => {
    try {
      await attendanceService?.correctAttendance(selectedAttendance?.id, correctionData);
      await loadAttendanceData();
      setShowCorrectionModal(false);
      setSelectedAttendance(null);
    } catch (err) {
      setError(err?.message || 'Failed to save correction');
    }
  };

  const calculateSummaryStats = () => {
    const totalDays = attendanceData?.length || 0;
    const presentDays = attendanceData?.filter(a => a?.status === 'present')?.length || 0;
    const lateDays = attendanceData?.filter(a => a?.status === 'late')?.length || 0;
    const absentDays = attendanceData?.filter(a => a?.status === 'absent')?.length || 0;
    const avgWorkHours = totalDays > 0 
      ? (attendanceData?.reduce((sum, a) => sum + (a?.work_hours || 0), 0) / totalDays)?.toFixed(1)
      : '0.0';

    return {
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      avgWorkHours,
      attendanceRate: totalDays > 0 ? ((presentDays / totalDays) * 100)?.toFixed(1) : '0'
    };
  };

  const summaryStats = calculateSummaryStats();

  if (authLoading) {
    return <LoadingOverlay message="Loading user data..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please sign in to access attendance tracking.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingOverlay message="Loading attendance data..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar onToggle={() => {}} />
        <main className="flex-1 p-6 ml-0 md:ml-64 transition-all duration-300">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Tracking</h1>
            <p className="text-gray-600">
              {isHR 
                ? 'Monitor and manage employee attendance across the organization' 
                : 'Track your daily attendance and work hours'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-red-600">⚠️ {error}</div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Mobile Check-in Card for Employees */}
          {!isHR && employee && (
            <div className="mb-6">
              <MobileAttendanceCard
                todayAttendance={todayAttendance}
                employee={employee}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onManualCorrection={handleManualCorrection}
                loading={loading}
              />
            </div>
          )}

          {/* Summary Cards */}
          <div className="mb-6">
            <AttendanceSummaryCards 
              stats={summaryStats}
              summaryData={summaryStats}
              isHR={isHR}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Attendance Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filters */}
              <AttendanceFilters
                filters={filters}
                onFiltersChange={setFilters}
                onFilterChange={setFilters}
                onExport={() => {}}
                onBulkAction={() => {}}
                isHR={isHR}
              />

              {/* Attendance Table */}
              <div className="bg-white rounded-lg shadow">
                <AttendanceTable
                  attendanceData={attendanceData}
                  onManualCorrection={handleManualCorrection}
                  selectedEmployees={[]}
                  onSelectionChange={() => {}}
                  sortConfig={{ key: '', direction: 'asc' }}
                  onSort={() => {}}
                  canEdit={isHR}
                  isHR={isHR}
                />
              </div>
            </div>

            {/* Live Feed Sidebar */}
            {isHR && (
              <div className="lg:col-span-1">
                <LiveCheckInFeed checkInData={[]} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Manual Correction Modal */}
      {showCorrectionModal && selectedAttendance && (
        <ManualCorrectionModal
          isOpen={showCorrectionModal}
          attendance={selectedAttendance}
          employee={employee}
          onSave={handleSaveCorrection}
          onClose={() => {
            setShowCorrectionModal(false);
            setSelectedAttendance(null);
          }}
        />
      )}
    </div>
  );
};

export default AttendanceTracking;