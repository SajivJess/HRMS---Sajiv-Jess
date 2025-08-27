import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AttendanceFilters = ({ 
  onFilterChange, 
  onExport, 
  selectedCount = 0,
  onBulkAction 
}) => {
  const [filters, setFilters] = useState({
    dateRange: 'today',
    department: 'all',
    status: 'all',
    search: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
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

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'overtime', label: 'Overtime' }
  ];

  const exportOptions = [
    { value: 'pdf', label: 'Export as PDF', icon: 'FileText' },
    { value: 'excel', label: 'Export as Excel', icon: 'FileSpreadsheet' },
    { value: 'csv', label: 'Export as CSV', icon: 'Download' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: 'today',
      department: 'all',
      status: 'all',
      search: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleExport = (format) => {
    onExport(format, filters);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      {/* Main Filter Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Left Side - Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
          {/* Search */}
          <div className="flex-1 max-w-xs">
            <Input
              type="search"
              placeholder="Search employees..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="w-full"
            />
          </div>

          {/* Date Range */}
          <Select
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
            className="min-w-[140px]"
          />

          {/* Department */}
          <Select
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => handleFilterChange('department', value)}
            className="min-w-[160px]"
          />

          {/* Status */}
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            className="min-w-[120px]"
          />

          {/* Advanced Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Advanced
          </Button>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Bulk Actions */}
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2 mr-4">
              <span className="text-sm text-muted-foreground">
                {selectedCount} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('correct')}
                iconName="Edit"
                iconPosition="left"
              >
                Bulk Correct
              </Button>
            </div>
          )}

          {/* Export Dropdown */}
          <div className="relative group">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg elevation-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                {exportOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => handleExport(option?.value)}
                    className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted micro-interaction flex items-center space-x-2"
                  >
                    <Icon name={option?.icon} size={16} />
                    <span>{option?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            iconName="RotateCcw"
          >
            Reset
          </Button>
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="date"
              label="From Date"
              disabled={filters?.dateRange !== 'custom'}
            />
            <Input
              type="date"
              label="To Date"
              disabled={filters?.dateRange !== 'custom'}
            />
            <Input
              type="time"
              label="Check-in After"
              placeholder="09:00"
            />
            <Input
              type="time"
              label="Check-out Before"
              placeholder="18:00"
            />
          </div>
        </div>
      )}
      {/* Active Filters Display */}
      {(filters?.search || filters?.department !== 'all' || filters?.status !== 'all' || filters?.dateRange !== 'today') && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters?.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
                Search: {filters?.search}
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 hover:text-accent/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.department !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
                {departmentOptions?.find(d => d?.value === filters?.department)?.label}
                <button
                  onClick={() => handleFilterChange('department', 'all')}
                  className="ml-1 hover:text-accent/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.status !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
                {statusOptions?.find(s => s?.value === filters?.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', 'all')}
                  className="ml-1 hover:text-accent/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceFilters;