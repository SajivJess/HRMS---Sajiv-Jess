import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ReportFilters = ({ onFiltersChange, onGenerateReport, isGenerating = false }) => {
  const [filters, setFilters] = useState({
    dateRange: 'last-30-days',
    startDate: '',
    endDate: '',
    department: 'all',
    employee: 'all',
    reportFormat: 'pdf'
  });

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'this-year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const employeeOptions = [
    { value: 'all', label: 'All Employees' },
    { value: 'active', label: 'Active Employees Only' },
    { value: 'inactive', label: 'Inactive Employees Only' },
    { value: 'new-hires', label: 'New Hires (Last 90 Days)' },
    { value: 'probation', label: 'Employees on Probation' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleGenerateReport = () => {
    onGenerateReport?.(filters);
  };

  const handleScheduleReport = () => {
    // Mock implementation for scheduling reports
    alert('Report scheduling feature will be implemented in the next version.');
  };

  const isCustomDateRange = filters?.dateRange === 'custom';

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Filter" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Report Filters</h3>
      </div>
      {/* Date Range Selection */}
      <div className="space-y-4">
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />

        {isCustomDateRange && (
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={filters?.startDate}
              onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={filters?.endDate}
              onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
              required
            />
          </div>
        )}
      </div>
      {/* Department Filter */}
      <Select
        label="Department"
        options={departmentOptions}
        value={filters?.department}
        onChange={(value) => handleFilterChange('department', value)}
      />
      {/* Employee Filter */}
      <Select
        label="Employee Selection"
        options={employeeOptions}
        value={filters?.employee}
        onChange={(value) => handleFilterChange('employee', value)}
      />
      {/* Report Format */}
      <Select
        label="Export Format"
        options={formatOptions}
        value={filters?.reportFormat}
        onChange={(value) => handleFilterChange('reportFormat', value)}
      />
      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-border">
        <Button
          variant="default"
          fullWidth
          loading={isGenerating}
          iconName="FileText"
          iconPosition="left"
          onClick={handleGenerateReport}
        >
          Generate Report
        </Button>

        <Button
          variant="outline"
          fullWidth
          iconName="Calendar"
          iconPosition="left"
          onClick={handleScheduleReport}
        >
          Schedule Automated Reports
        </Button>

        <Button
          variant="ghost"
          fullWidth
          iconName="Download"
          iconPosition="left"
        >
          Export Dashboard
        </Button>
      </div>
      {/* Quick Stats */}
      <div className="bg-muted rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-medium text-foreground">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-muted-foreground">Total Employees:</div>
          <div className="font-medium text-foreground">247</div>
          <div className="text-muted-foreground">Active Reports:</div>
          <div className="font-medium text-foreground">12</div>
          <div className="text-muted-foreground">Last Generated:</div>
          <div className="font-medium text-foreground">2 hours ago</div>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;