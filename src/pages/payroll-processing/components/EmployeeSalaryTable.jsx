import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const EmployeeSalaryTable = ({ 
  employees, 
  onEmployeeUpdate, 
  selectedEmployees, 
  onEmployeeSelect,
  onSelectAll,
  isCalculating 
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleCellEdit = (employeeId, field, currentValue) => {
    setEditingCell(`${employeeId}-${field}`);
    setEditValue(currentValue?.toString());
  };

  const handleCellSave = (employeeId, field) => {
    const numericValue = parseFloat(editValue) || 0;
    onEmployeeUpdate(employeeId, field, numericValue);
    setEditingCell(null);
    setEditValue('');
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const calculateGrossPay = (employee) => {
    return employee?.baseSalary + employee?.allowances + employee?.overtime;
  };

  const calculateNetPay = (employee) => {
    const grossPay = calculateGrossPay(employee);
    return grossPay - employee?.deductions - employee?.tax;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const EditableCell = ({ employeeId, field, value, isEditing }) => {
    if (isEditing) {
      return (
        <div className="flex items-center space-x-1">
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e?.target?.value)}
            className="w-20 h-8 text-sm"
            min="0"
            step="0.01"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCellSave(employeeId, field)}
            className="h-6 w-6"
          >
            <Icon name="Check" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCellCancel}
            className="h-6 w-6"
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      );
    }

    return (
      <button
        onClick={() => handleCellEdit(employeeId, field, value)}
        className="text-left hover:bg-muted px-2 py-1 rounded micro-interaction w-full"
        disabled={isCalculating}
      >
        {formatCurrency(value)}
      </button>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Users" size={20} />
            <span>Employee Salary Management</span>
          </h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {selectedEmployees?.length} of {employees?.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              iconName={selectedEmployees?.length === employees?.length ? "Square" : "CheckSquare"}
              iconPosition="left"
            >
              {selectedEmployees?.length === employees?.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <Checkbox
                  checked={selectedEmployees?.length === employees?.length}
                  onChange={onSelectAll}
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground">Employee</th>
              <th className="text-left p-4 font-medium text-foreground">Base Salary</th>
              <th className="text-left p-4 font-medium text-foreground">Allowances</th>
              <th className="text-left p-4 font-medium text-foreground">Overtime</th>
              <th className="text-left p-4 font-medium text-foreground">Deductions</th>
              <th className="text-left p-4 font-medium text-foreground">Tax</th>
              <th className="text-left p-4 font-medium text-foreground">Gross Pay</th>
              <th className="text-left p-4 font-medium text-foreground">Net Pay</th>
              <th className="text-left p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((employee) => (
              <tr key={employee?.id} className="border-b border-border hover:bg-muted/50">
                <td className="p-4">
                  <Checkbox
                    checked={selectedEmployees?.includes(employee?.id)}
                    onChange={() => onEmployeeSelect(employee?.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {employee?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{employee?.name}</div>
                      <div className="text-sm text-muted-foreground">{employee?.department}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-foreground">{formatCurrency(employee?.baseSalary)}</td>
                <td className="p-4">
                  <EditableCell
                    employeeId={employee?.id}
                    field="allowances"
                    value={employee?.allowances}
                    isEditing={editingCell === `${employee?.id}-allowances`}
                  />
                </td>
                <td className="p-4">
                  <EditableCell
                    employeeId={employee?.id}
                    field="overtime"
                    value={employee?.overtime}
                    isEditing={editingCell === `${employee?.id}-overtime`}
                  />
                </td>
                <td className="p-4">
                  <EditableCell
                    employeeId={employee?.id}
                    field="deductions"
                    value={employee?.deductions}
                    isEditing={editingCell === `${employee?.id}-deductions`}
                  />
                </td>
                <td className="p-4 text-foreground">{formatCurrency(employee?.tax)}</td>
                <td className="p-4 font-medium text-foreground">
                  {formatCurrency(calculateGrossPay(employee))}
                </td>
                <td className="p-4 font-semibold text-success">
                  {formatCurrency(calculateNetPay(employee))}
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {/* Handle view details */}}
                  >
                    <Icon name="Eye" size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {employees?.map((employee) => (
          <div key={employee?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedEmployees?.includes(employee?.id)}
                  onChange={() => onEmployeeSelect(employee?.id)}
                />
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">
                    {employee?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-foreground">{employee?.name}</div>
                  <div className="text-sm text-muted-foreground">{employee?.department}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Icon name="MoreVertical" size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Base Salary:</span>
                <div className="font-medium text-foreground">{formatCurrency(employee?.baseSalary)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Allowances:</span>
                <div className="font-medium text-foreground">{formatCurrency(employee?.allowances)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Overtime:</span>
                <div className="font-medium text-foreground">{formatCurrency(employee?.overtime)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Deductions:</span>
                <div className="font-medium text-foreground">{formatCurrency(employee?.deductions)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Gross Pay:</span>
                <div className="font-semibold text-foreground">{formatCurrency(calculateGrossPay(employee))}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Net Pay:</span>
                <div className="font-semibold text-success">{formatCurrency(calculateNetPay(employee))}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {employees?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Employees Found</h3>
          <p className="text-muted-foreground">
            No employees match the selected criteria. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalaryTable;