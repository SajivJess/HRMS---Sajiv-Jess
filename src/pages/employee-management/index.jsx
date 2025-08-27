import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { employeeService, organizationService } from '../../services/hrmsService';
import { Header } from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import FilterBar from './components/FilterBar';
import BulkActionsBar from './components/BulkActionsBar';
import EmployeeSidebar from './components/EmployeeSidebar';

const EmployeeManagement = () => {
  const { userProfile, user, isHR, loading: authLoading } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    position: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadEmployeeData();
    }
  }, [authLoading, user]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [employeeData, departmentData, positionData] = await Promise.all([
        employeeService?.getEmployees(),
        organizationService?.getDepartments(),
        organizationService?.getPositions()
      ]);

      setEmployees(employeeData || []);
      setDepartments(departmentData || []);
      setPositions(positionData || []);
    } catch (err) {
      setError(err?.message || 'Failed to load employee data');
      console.error('Employee management error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees(prev => 
      prev?.includes(employeeId)
        ? prev?.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleEmployeeEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleEmployeeView = (employee) => {
    setSelectedEmployee(employee);
    setShowSidebar(true);
  };

  const handleEmployeeCreate = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleEmployeeSave = async (employeeData) => {
    try {
      if (selectedEmployee?.id) {
        // Update existing employee
        await employeeService?.updateEmployee(selectedEmployee?.id, employeeData);
      } else {
        // Create new employee
        await employeeService?.createEmployee(employeeData);
      }
      
      await loadEmployeeData(); // Reload data
      setShowModal(false);
      setSelectedEmployee(null);
    } catch (err) {
      setError(err?.message || 'Failed to save employee');
    }
  };

  const handleEmployeeDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService?.deleteEmployee(employeeId);
        await loadEmployeeData(); // Reload data
      } catch (err) {
        setError(err?.message || 'Failed to delete employee');
      }
    }
  };

  const handleBulkAction = async (action) => {
    try {
      switch (action) {
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedEmployees?.length} employees?`)) {
            await Promise.all(
              selectedEmployees?.map(id => employeeService?.deleteEmployee(id))
            );
            await loadEmployeeData();
            setSelectedEmployees([]);
          }
          break;
        case 'export':
          // Handle export functionality
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err?.message || 'Bulk action failed');
    }
  };

  const filteredEmployees = employees?.filter(employee => {
    const matchesSearch = !filters?.search || 
      employee?.user_profiles?.full_name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      employee?.user_profiles?.email?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      employee?.employee_id?.toLowerCase()?.includes(filters?.search?.toLowerCase());

    const matchesDepartment = !filters?.department || 
      employee?.departments?.name === filters?.department;

    const matchesStatus = !filters?.status || 
      employee?.status === filters?.status;

    const matchesPosition = !filters?.position ||
      employee?.positions?.title === filters?.position;

    return matchesSearch && matchesDepartment && matchesStatus && matchesPosition;
  }) || [];

  if (authLoading) {
    return <LoadingOverlay message="Loading user data..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please sign in to access employee management.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingOverlay message="Loading employee data..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar onToggle={() => {}} />
        <main className="flex-1 p-6 ml-0 md:ml-64 transition-all duration-300 min-h-screen">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
                <p className="text-gray-600 mt-1">
                  Manage your organization's workforce
                </p>
              </div>
              {isHR && (
                <button
                  onClick={handleEmployeeCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Employee
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

          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            departments={departments}
            positions={positions}
            searchTerm={filters.search}
            onSearchChange={(search) => setFilters(prev => ({ ...prev, search }))}
            selectedDepartment={filters.department}
            onDepartmentChange={(department) => setFilters(prev => ({ ...prev, department }))}
            selectedLocation=""
            onLocationChange={() => {}}
            selectedEmploymentType=""
            onEmploymentTypeChange={() => {}}
            dateRange={null}
            onDateRangeChange={() => {}}
            activeFilters={Object.entries(filters).filter(([key, value]) => value !== '').map(([key]) => key)}
            onClearFilter={(filterKey) => setFilters(prev => ({ ...prev, [filterKey]: '' }))}
            onClearAllFilters={() => setFilters({ search: '', department: '', status: '', position: '' })}
          />

          {/* Bulk Actions */}
          {selectedEmployees?.length > 0 && isHR && (
            <BulkActionsBar
              selectedCount={selectedEmployees?.length}
              onAction={handleBulkAction}
              onClear={() => setSelectedEmployees([])}
              onBulkAction={handleBulkAction}
              onClearSelection={() => setSelectedEmployees([])}
            />
          )}

          {/* Employee Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-gray-900">{employees?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Employees</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-green-600">
                {employees?.filter(e => e?.status === 'active')?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-yellow-600">
                {employees?.filter(e => e?.status === 'on_leave')?.length || 0}
              </div>
              <div className="text-sm text-gray-600">On Leave</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-red-600">
                {employees?.filter(e => e?.status === 'inactive')?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Inactive</div>
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-lg shadow">
            <EmployeeTable
              employees={filteredEmployees}
              selectedEmployees={selectedEmployees}
              onEmployeeSelect={handleEmployeeSelect}
              onEmployeeEdit={handleEmployeeEdit}
              onEmployeeView={handleEmployeeView}
              onEmployeeDelete={handleEmployeeDelete}
              canManage={isHR}
              onSelectEmployee={handleEmployeeSelect}
              onSelectAll={(selectAll) => {
                if (selectAll) {
                  setSelectedEmployees(filteredEmployees.map(emp => emp.id));
                } else {
                  setSelectedEmployees([]);
                }
              }}
              onEditEmployee={handleEmployeeEdit}
              onViewEmployee={handleEmployeeView}
              onDeleteEmployee={handleEmployeeDelete}
              sortConfig={null}
              onSort={() => {}}
            />
          </div>
        </main>
      </div>
      {/* Employee Modal */}
      {showModal && (
        <EmployeeModal
          employee={selectedEmployee}
          departments={departments}
          positions={positions}
          onSave={handleEmployeeSave}
          onClose={() => {
            setShowModal(false);
            setSelectedEmployee(null);
          }}
          isOpen={showModal}
          mode={selectedEmployee ? 'edit' : 'create'}
          onDelete={selectedEmployee ? () => handleEmployeeDelete(selectedEmployee.id) : () => {}}
        />
      )}
      {/* Employee Sidebar */}
      {showSidebar && selectedEmployee && (
        <EmployeeSidebar
          employee={selectedEmployee}
          onClose={() => {
            setShowSidebar(false);
            setSelectedEmployee(null);
          }}
          departmentStats={{}}
          statusStats={{}}
          selectedStatusFilter=""
          onStatusFilterChange={() => {}}
          onExportData={() => {}}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;