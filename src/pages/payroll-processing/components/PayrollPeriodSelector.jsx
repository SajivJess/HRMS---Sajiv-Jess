import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PayrollPeriodSelector = ({ 
  selectedPeriod, 
  onPeriodChange, 
  selectedDepartment, 
  onDepartmentChange,
  onApplyFilters 
}) => {
  const [startDate, setStartDate] = useState(selectedPeriod?.startDate || '');
  const [endDate, setEndDate] = useState(selectedPeriod?.endDate || '');

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const payrollPeriods = [
    { value: 'current', label: 'Current Month (August 2025)' },
    { value: 'previous', label: 'Previous Month (July 2025)' },
    { value: 'custom', label: 'Custom Date Range' }
  ];

  const handlePeriodSelect = (period) => {
    if (period === 'current') {
      const currentStart = '2025-08-01';
      const currentEnd = '2025-08-31';
      setStartDate(currentStart);
      setEndDate(currentEnd);
      onPeriodChange({ startDate: currentStart, endDate: currentEnd, type: 'current' });
    } else if (period === 'previous') {
      const prevStart = '2025-07-01';
      const prevEnd = '2025-07-31';
      setStartDate(prevStart);
      setEndDate(prevEnd);
      onPeriodChange({ startDate: prevStart, endDate: prevEnd, type: 'previous' });
    }
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      onPeriodChange({ startDate, endDate, type: 'custom' });
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Calendar" size={20} />
          <span>Payroll Period Selection</span>
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Last updated: {new Date()?.toLocaleString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Quick Period Selection */}
        <div className="lg:col-span-1">
          <Select
            label="Quick Select"
            options={payrollPeriods}
            value={selectedPeriod?.type || 'current'}
            onChange={handlePeriodSelect}
            placeholder="Select period"
          />
        </div>

        {/* Custom Date Range */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e?.target?.value);
              handleCustomDateChange();
            }}
            max="2025-12-31"
            min="2025-01-01"
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e?.target?.value);
              handleCustomDateChange();
            }}
            max="2025-12-31"
            min={startDate || "2025-01-01"}
          />
        </div>

        {/* Department Filter */}
        <div className="lg:col-span-1">
          <Select
            label="Department"
            options={departmentOptions}
            value={selectedDepartment}
            onChange={onDepartmentChange}
            placeholder="All Departments"
          />
        </div>
      </div>
      {/* Period Summary */}
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div className="text-sm">
              <span className="text-muted-foreground">Period: </span>
              <span className="font-medium text-foreground">
                {startDate && endDate 
                  ? `${new Date(startDate)?.toLocaleDateString()} - ${new Date(endDate)?.toLocaleDateString()}`
                  : 'No period selected'
                }
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Department: </span>
              <span className="font-medium text-foreground">
                {departmentOptions?.find(d => d?.value === selectedDepartment)?.label || 'All Departments'}
              </span>
            </div>
          </div>
          
          <Button
            variant="default"
            onClick={handleApplyFilters}
            iconName="Filter"
            iconPosition="left"
            disabled={!startDate || !endDate}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PayrollPeriodSelector;