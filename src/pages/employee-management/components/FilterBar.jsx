import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterBar = ({
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedLocation,
  onLocationChange,
  selectedEmploymentType,
  onEmploymentTypeChange,
  dateRange,
  onDateRangeChange,
  activeFilters,
  onClearFilter,
  onClearAllFilters
}) => {
  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'new-york', label: 'New York' },
    { value: 'san-francisco', label: 'San Francisco' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'austin', label: 'Austin' },
    { value: 'remote', label: 'Remote' }
  ];

  const employmentTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Search and Primary Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search employees by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>
        
        <Select
          placeholder="Department"
          options={departmentOptions}
          value={selectedDepartment}
          onChange={onDepartmentChange}
        />
        
        <Select
          placeholder="Location"
          options={locationOptions}
          value={selectedLocation}
          onChange={onLocationChange}
        />
        
        <Select
          placeholder="Employment Type"
          options={employmentTypeOptions}
          value={selectedEmploymentType}
          onChange={onEmploymentTypeChange}
        />
      </div>
      {/* Date Range Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          type="date"
          label="Hire Date From"
          value={dateRange?.from}
          onChange={(e) => onDateRangeChange({ ...dateRange, from: e?.target?.value })}
        />
        <Input
          type="date"
          label="Hire Date To"
          value={dateRange?.to}
          onChange={(e) => onDateRangeChange({ ...dateRange, to: e?.target?.value })}
        />
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onClearAllFilters}
            className="w-full"
            iconName="X"
            iconPosition="left"
          >
            Clear All Filters
          </Button>
        </div>
      </div>
      {/* Active Filter Chips */}
      {activeFilters?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
          {activeFilters?.map((filter) => (
            <div
              key={filter?.key}
              className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
            >
              <span>{filter?.label}: {filter?.value}</span>
              <button
                onClick={() => onClearFilter(filter?.key)}
                className="hover:bg-primary/20 rounded-full p-0.5 micro-interaction"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;