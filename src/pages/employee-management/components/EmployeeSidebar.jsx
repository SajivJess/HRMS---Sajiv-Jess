import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmployeeSidebar = ({
  departmentStats,
  statusStats,
  selectedStatusFilter,
  onStatusFilterChange,
  onExportData
}) => {
  const statusOptions = [
    { key: 'all', label: 'All Employees', icon: 'Users', color: 'text-foreground' },
    { key: 'active', label: 'Active', icon: 'CheckCircle', color: 'text-success' },
    { key: 'inactive', label: 'Inactive', icon: 'XCircle', color: 'text-error' },
    { key: 'pending', label: 'Pending', icon: 'Clock', color: 'text-warning' }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Statistics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Quick Stats
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Employees</span>
            <span className="font-semibold text-foreground">{statusStats?.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Active</span>
            <span className="font-semibold text-success">{statusStats?.active}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Inactive</span>
            <span className="font-semibold text-error">{statusStats?.inactive}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Pending</span>
            <span className="font-semibold text-warning">{statusStats?.pending}</span>
          </div>
        </div>
      </div>
      {/* Status Filter */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Filter" size={20} className="mr-2" />
          Filter by Status
        </h3>
        <div className="space-y-2">
          {statusOptions?.map((option) => (
            <button
              key={option?.key}
              onClick={() => onStatusFilterChange(option?.key)}
              className={`w-full flex items-center justify-between p-3 rounded-lg micro-interaction ${
                selectedStatusFilter === option?.key
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={option?.icon} 
                  size={16} 
                  className={selectedStatusFilter === option?.key ? 'text-primary-foreground' : option?.color}
                />
                <span className="font-medium">{option?.label}</span>
              </div>
              <span className="text-sm opacity-75">
                {option?.key === 'all' ? statusStats?.total : statusStats?.[option?.key]}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Department Breakdown */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Building2" size={20} className="mr-2" />
          Department Breakdown
        </h3>
        <div className="space-y-3">
          {departmentStats?.map((dept) => (
            <div key={dept?.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{dept?.name}</span>
                <span className="text-sm text-muted-foreground">{dept?.count}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(dept?.count / statusStats?.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Export Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Download" size={20} className="mr-2" />
          Export Data
        </h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportData('csv')}
            className="w-full justify-start"
            iconName="FileText"
            iconPosition="left"
          >
            Export as CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportData('excel')}
            className="w-full justify-start"
            iconName="FileSpreadsheet"
            iconPosition="left"
          >
            Export as Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportData('pdf')}
            className="w-full justify-start"
            iconName="FileDown"
            iconPosition="left"
          >
            Export as PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;