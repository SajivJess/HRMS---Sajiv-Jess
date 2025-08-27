import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import AttendanceTracking from './pages/attendance-tracking';
import MultiPortalLogin from './pages/multi-portal-login';
import PayrollProcessing from './pages/payroll-processing';
import EmployeeManagement from './pages/employee-management';
import ReportsAnalytics from './pages/reports-analytics';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/attendance-tracking" element={<AttendanceTracking />} />
        <Route path="/multi-portal-login" element={<MultiPortalLogin />} />
        <Route path="/payroll-processing" element={<PayrollProcessing />} />
        <Route path="/employee-management" element={<EmployeeManagement />} />
        <Route path="/reports-analytics" element={<ReportsAnalytics />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
