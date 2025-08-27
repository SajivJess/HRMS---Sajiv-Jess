import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsService, attendanceService, payrollService, employeeService } from '../../services/hrmsService';
import { Header } from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import ReportFilters from './components/ReportFilters';
import EmployeeMetrics from './components/EmployeeMetrics';
import AttendanceChart from './components/AttendanceChart';
import PayrollChart from './components/PayrollChart';
import ComplianceReports from './components/ComplianceReports';
import ReportBuilder from './components/ReportBuilder';

const ReportsAnalytics = () => {
  const { userProfile, user, loading: authLoading } = useAuth();
  // Allow access to anyone
  const isAdminOrHR = true;

  const [reportData, setReportData] = useState({
    employeeMetrics: null,
    attendanceData: [],
    payrollData: [],
    complianceData: null
  });
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
    endDate: new Date()?.toISOString()?.split('T')?.[0]
  });
  const [filters, setFilters] = useState({
    department: '',
    position: '',
    employeeStatus: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadReportData();
    }
  }, [authLoading, user, selectedReport, dateRange, filters]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      let newReportData = { ...reportData };

      switch (selectedReport) {
        case 'overview':
          // Load overview data
          const [kpis, attendanceStats] = await Promise.all([
            analyticsService?.getDashboardKPIs(),
            analyticsService?.getAttendanceStats(90)
          ]);
          
          newReportData.employeeMetrics = kpis;
          newReportData.attendanceData = attendanceStats;
          break;

        case 'attendance':
          // Load detailed attendance data
          const attendanceData = await attendanceService?.getAttendance({
            startDate: dateRange?.startDate,
            endDate: dateRange?.endDate
          });
          newReportData.attendanceData = attendanceData;
          break;

        case 'payroll':
          // Load payroll data
          const payrollData = await payrollService?.getPayroll({
            payPeriodStart: dateRange?.startDate,
            payPeriodEnd: dateRange?.endDate
          });
          newReportData.payrollData = payrollData;
          break;

        case 'employees':
          // Load employee data
          const employees = await employeeService?.getEmployees();
          newReportData.employeeData = employees;
          break;

        case 'compliance':
          // Load compliance data (mock for now)
          newReportData.complianceData = {
            policyCompliance: 95,
            trainingCompletion: 87,
            documentationScore: 92,
            auditReadiness: 88
          };
          break;

        default:
          break;
      }

      setReportData(newReportData);
    } catch (err) {
      setError(err?.message || 'Failed to load report data');
      console.error('Reports analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    // Implementation for exporting reports
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${selectedReport}-report-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement?.setAttribute('href', dataUri);
    linkElement?.setAttribute('download', exportFileDefaultName);
    linkElement?.click();
  };

  const reportTabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'attendance', name: 'Attendance', icon: '⏰' },
    { id: 'payroll', name: 'Payroll', icon: '💰' },
    { id: 'employees', name: 'Employees', icon: '👥' },
    { id: 'compliance', name: 'Compliance', icon: '📋' }
  ];

  if (authLoading) {
    return <LoadingOverlay message="Loading user data..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingOverlay message="Loading report data..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar onToggle={() => {}} />
        <main className="flex-1 p-6 ml-0 md:ml-64 transition-all duration-300">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600 mt-1">
                  Comprehensive insights into your organization's performance
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportReport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📊 Export Report
                </button>
              </div>
            </div>
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

          {/* Report Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {reportTabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setSelectedReport(tab?.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      selectedReport === tab?.id
                        ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab?.icon}</span>
                    {tab?.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Report Filters */}
          <div className="mb-6">
            <ReportFilters
              selectedReport={selectedReport}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              filters={filters}
              onFiltersChange={setFilters}
              onGenerateReport={loadReportData}
            />
          </div>

          {/* Report Content */}
          <div className="space-y-6">
            {selectedReport === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EmployeeMetrics data={reportData?.employeeMetrics} />
                <AttendanceChart data={reportData?.attendanceData} />
              </div>
            )}

            {selectedReport === 'attendance' && (
              <div className="space-y-6">
                <AttendanceChart data={reportData?.attendanceData} detailed={true} />
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {reportData?.attendanceData?.filter(a => a?.status === 'present')?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Present Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {reportData?.attendanceData?.filter(a => a?.status === 'late')?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Late Arrivals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {reportData?.attendanceData?.filter(a => a?.status === 'absent')?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Absences</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {reportData?.attendanceData?.filter(a => a?.status === 'on_leave')?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">On Leave</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'payroll' && (
              <div className="space-y-6">
                <PayrollChart data={reportData?.payrollData} />
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${reportData?.payrollData?.reduce((sum, p) => sum + (p?.gross_pay || 0), 0)?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-gray-600">Total Gross Pay</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        ${reportData?.payrollData?.reduce((sum, p) => sum + (p?.net_pay || 0), 0)?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-gray-600">Total Net Pay</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {reportData?.payrollData?.filter(p => p?.status === 'processed')?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Processed Payrolls</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'employees' && (
              <EmployeeMetrics data={reportData?.employeeData} detailed={true} />
            )}

            {selectedReport === 'compliance' && (
              <ComplianceReports data={reportData?.complianceData} />
            )}
          </div>

          {/* Report Builder */}
          <div className="mt-8">
            <ReportBuilder 
              selectedReport={selectedReport}
              reportData={reportData}
              onExport={handleExportReport}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsAnalytics;