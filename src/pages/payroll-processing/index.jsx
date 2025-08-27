import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { payrollService } from '../../services/hrmsService';
import { Header } from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import EmployeeSalaryTable from './components/EmployeeSalaryTable';
import PayrollPeriodSelector from './components/PayrollPeriodSelector';
import PayrollSummaryPanel from './components/PayrollSummaryPanel';
import PayrollCalculationModal from './components/PayrollCalculationModal';

const PayrollProcessing = () => {
  const { userProfile, user, employee, isHR, loading: authLoading } = useAuth();
  const [payrollData, setPayrollData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)?.toISOString()?.split('T')?.[0],
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)?.toISOString()?.split('T')?.[0]
  });
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    employeeId: isHR ? '' : employee?.id || ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadPayrollData();
    }
  }, [authLoading, user, selectedPeriod, filters]);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      setError(null);

      const payrollFilters = {
        ...filters,
        payPeriodStart: selectedPeriod?.startDate,
        payPeriodEnd: selectedPeriod?.endDate
      };

      const data = await payrollService?.getPayroll(payrollFilters);
      setPayrollData(data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load payroll data');
      console.error('Payroll processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayroll = () => {
    setSelectedPayroll(null);
    setShowCalculationModal(true);
  };

  const handleEditPayroll = (payroll) => {
    setSelectedPayroll(payroll);
    setShowCalculationModal(true);
  };

  const handleSavePayroll = async (payrollData) => {
    try {
      if (selectedPayroll?.id) {
        await payrollService?.updatePayroll(selectedPayroll?.id, payrollData);
      } else {
        await payrollService?.createPayroll(payrollData);
      }
      
      await loadPayrollData();
      setShowCalculationModal(false);
      setSelectedPayroll(null);
    } catch (err) {
      setError(err?.message || 'Failed to save payroll');
    }
  };

  const handleProcessPayroll = async (payrollId) => {
    if (!window.confirm('Are you sure you want to process this payroll? This action cannot be undone.')) {
      return;
    }

    try {
      await payrollService?.processPayroll(payrollId, user?.id);
      await loadPayrollData();
    } catch (err) {
      setError(err?.message || 'Failed to process payroll');
    }
  };

  const calculateSummaryStats = () => {
    const totalEmployees = payrollData?.length || 0;
    const processedPayrolls = payrollData?.filter(p => p?.status === 'processed')?.length || 0;
    const draftPayrolls = payrollData?.filter(p => p?.status === 'draft')?.length || 0;
    const totalGrossPay = payrollData?.reduce((sum, p) => sum + (p?.gross_pay || 0), 0) || 0;
    const totalNetPay = payrollData?.reduce((sum, p) => sum + (p?.net_pay || 0), 0) || 0;

    return {
      totalEmployees,
      processedPayrolls,
      draftPayrolls,
      totalGrossPay: totalGrossPay?.toFixed(2),
      totalNetPay: totalNetPay?.toFixed(2),
      averageSalary: totalEmployees > 0 ? (totalGrossPay / totalEmployees)?.toFixed(2) : '0.00'
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
          <p className="text-gray-600 mb-4">Please sign in to access payroll processing.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingOverlay message="Loading payroll data..." />;
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
                <h1 className="text-3xl font-bold text-gray-900">Payroll Processing</h1>
                <p className="text-gray-600 mt-1">
                  {isHR 
                    ? 'Manage employee payroll and compensation' : 'View your salary and payment history'
                  }
                </p>
              </div>
              {isHR && (
                <button
                  onClick={handleCreatePayroll}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Process Payroll
                </button>
              )}
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Period Selector */}
              <PayrollPeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                filters={filters}
                onFiltersChange={setFilters}
                isHR={isHR}
                selectedDepartment=""
                onDepartmentChange={() => {}}
                onApplyFilters={() => {}}
              />

              {/* Employee Salary Table */}
              <div className="bg-white rounded-lg shadow">
                <EmployeeSalaryTable
                  payrollData={payrollData}
                  onEditPayroll={handleEditPayroll}
                  onProcessPayroll={handleProcessPayroll}
                  canManage={isHR}
                  isHR={isHR}
                  employees={[]}
                  onEmployeeUpdate={() => {}}
                  selectedEmployees={[]}
                  onEmployeeSelect={() => {}}
                  onSelectAll={() => {}}
                  isCalculating={false}
                />
              </div>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <PayrollSummaryPanel
                stats={summaryStats}
                selectedPeriod={selectedPeriod}
                isHR={isHR}
                summaryData={{}}
                selectedEmployees={[]}
                totalEmployees={0}
                onCalculatePayroll={() => {}}
                onGeneratePayslips={() => {}}
                onExportData={() => {}}
                isCalculating={false}
                isGenerating={false}
                isExporting={false}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Payroll Calculation Modal */}
      {showCalculationModal && (
        <PayrollCalculationModal
          payroll={selectedPayroll}
          selectedPeriod={selectedPeriod}
          onSave={handleSavePayroll}
          onClose={() => {
            setShowCalculationModal(false);
            setSelectedPayroll(null);
          }}
          isOpen={showCalculationModal}
          selectedEmployees={[]}
          onConfirmCalculation={() => {}}
          calculationProgress={0}
        />
      )}
    </div>
  );
};

export default PayrollProcessing;