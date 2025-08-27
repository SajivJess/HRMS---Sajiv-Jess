import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EmployeeTable = ({ 
  employees, 
  selectedEmployees, 
  onSelectEmployee, 
  onSelectAll, 
  onEditEmployee, 
  onViewEmployee, 
  onDeleteEmployee,
  sortConfig,
  onSort 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    onSort({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-primary" />
      : <Icon name="ArrowDown" size={16} className="text-primary" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success/10 text-success border-success/20', label: 'Active' },
      inactive: { color: 'bg-error/10 text-error border-error/20', label: 'Inactive' },
      pending: { color: 'bg-warning/10 text-warning border-warning/20', label: 'Pending' }
    };

    const config = statusConfig?.[status] || statusConfig?.active;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedEmployees?.length === employees?.length && employees?.length > 0}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground">Photo</th>
              {[
                { key: 'name', label: 'Name' },
                { key: 'employeeId', label: 'Employee ID' },
                { key: 'department', label: 'Department' },
                { key: 'role', label: 'Role' },
                { key: 'hireDate', label: 'Hire Date' },
                { key: 'status', label: 'Status' }
              ]?.map((column) => (
                <th key={column?.key} className="text-left p-4 font-medium text-foreground">
                  <button
                    onClick={() => handleSort(column?.key)}
                    className="flex items-center space-x-2 hover:text-primary micro-interaction"
                  >
                    <span>{column?.label}</span>
                    {getSortIcon(column?.key)}
                  </button>
                </th>
              ))}
              <th className="text-right p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((employee) => (
              <tr
                key={employee?.id}
                className={`border-b border-border hover:bg-muted/30 micro-transition ${
                  selectedEmployees?.includes(employee?.id) ? 'bg-primary/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(employee?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedEmployees?.includes(employee?.id)}
                    onChange={(e) => onSelectEmployee(employee?.id, e?.target?.checked)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                <td className="p-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={employee?.photo}
                      alt={employee?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{employee?.name}</div>
                    <div className="text-sm text-muted-foreground">{employee?.email}</div>
                  </div>
                </td>
                <td className="p-4 text-foreground font-mono text-sm">{employee?.employeeId}</td>
                <td className="p-4 text-foreground">{employee?.department}</td>
                <td className="p-4 text-foreground">{employee?.role}</td>
                <td className="p-4 text-muted-foreground">{employee?.hireDate}</td>
                <td className="p-4">{getStatusBadge(employee?.status)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewEmployee(employee)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditEmployee(employee)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteEmployee(employee)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {employees?.map((employee) => (
          <div
            key={employee?.id}
            className={`bg-background border border-border rounded-lg p-4 ${
              selectedEmployees?.includes(employee?.id) ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={selectedEmployees?.includes(employee?.id)}
                onChange={(e) => onSelectEmployee(employee?.id, e?.target?.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 mt-1"
              />
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={employee?.photo}
                  alt={employee?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground truncate">{employee?.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{employee?.email}</p>
                  </div>
                  {getStatusBadge(employee?.status)}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">ID:</span>
                    <span className="ml-1 font-mono">{employee?.employeeId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dept:</span>
                    <span className="ml-1">{employee?.department}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Role:</span>
                    <span className="ml-1">{employee?.role}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Hired:</span>
                    <span className="ml-1">{employee?.hireDate}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewEmployee(employee)}
                  >
                    <Icon name="Eye" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditEmployee(employee)}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteEmployee(employee)}
                    className="text-error hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {employees?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No employees found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;