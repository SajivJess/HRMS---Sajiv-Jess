import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ReportBuilder = () => {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    type: 'custom',
    fields: [],
    filters: [],
    groupBy: '',
    sortBy: '',
    format: 'pdf'
  });

  const [draggedField, setDraggedField] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const availableFields = [
    { id: 'employee_id', name: 'Employee ID', category: 'Employee', type: 'text' },
    { id: 'employee_name', name: 'Employee Name', category: 'Employee', type: 'text' },
    { id: 'department', name: 'Department', category: 'Employee', type: 'text' },
    { id: 'position', name: 'Position', category: 'Employee', type: 'text' },
    { id: 'hire_date', name: 'Hire Date', category: 'Employee', type: 'date' },
    { id: 'salary', name: 'Salary', category: 'Payroll', type: 'currency' },
    { id: 'overtime_hours', name: 'Overtime Hours', category: 'Attendance', type: 'number' },
    { id: 'total_hours', name: 'Total Hours', category: 'Attendance', type: 'number' },
    { id: 'attendance_rate', name: 'Attendance Rate', category: 'Attendance', type: 'percentage' },
    { id: 'performance_rating', name: 'Performance Rating', category: 'Performance', type: 'number' },
    { id: 'training_completed', name: 'Training Completed', category: 'Training', type: 'number' },
    { id: 'leave_balance', name: 'Leave Balance', category: 'Leave', type: 'number' }
  ];

  const reportTypes = [
    { value: 'custom', label: 'Custom Report' },
    { value: 'employee-summary', label: 'Employee Summary' },
    { value: 'payroll-analysis', label: 'Payroll Analysis' },
    { value: 'attendance-report', label: 'Attendance Report' },
    { value: 'performance-review', label: 'Performance Review' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' },
    { value: 'json', label: 'JSON Data' }
  ];

  const groupByOptions = [
    { value: '', label: 'No Grouping' },
    { value: 'department', label: 'Department' },
    { value: 'position', label: 'Position' },
    { value: 'hire_date', label: 'Hire Date' },
    { value: 'performance_rating', label: 'Performance Rating' }
  ];

  const sortByOptions = [
    { value: '', label: 'No Sorting' },
    { value: 'employee_name', label: 'Employee Name' },
    { value: 'department', label: 'Department' },
    { value: 'hire_date', label: 'Hire Date' },
    { value: 'salary', label: 'Salary' }
  ];

  const handleDragStart = (e, field) => {
    setDraggedField(field);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    if (draggedField && !reportConfig?.fields?.find(f => f?.id === draggedField?.id)) {
      setReportConfig(prev => ({
        ...prev,
        fields: [...prev?.fields, draggedField]
      }));
    }
    setDraggedField(null);
  };

  const handleRemoveField = (fieldId) => {
    setReportConfig(prev => ({
      ...prev,
      fields: prev?.fields?.filter(f => f?.id !== fieldId)
    }));
  };

  const handleConfigChange = (key, value) => {
    setReportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerateReport = () => {
    if (!reportConfig?.name || reportConfig?.fields?.length === 0) {
      alert('Please provide a report name and select at least one field.');
      return;
    }
    alert(`Generating custom report: ${reportConfig?.name}`);
  };

  const handleSaveTemplate = () => {
    if (!reportConfig?.name) {
      alert('Please provide a report name to save as template.');
      return;
    }
    alert(`Saving report template: ${reportConfig?.name}`);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const mockPreviewData = [
    { employee_name: 'John Smith', department: 'Engineering', salary: '$75,000', attendance_rate: '95%' },
    { employee_name: 'Sarah Johnson', department: 'Marketing', salary: '$65,000', attendance_rate: '92%' },
    { employee_name: 'Mike Davis', department: 'Sales', salary: '$70,000', attendance_rate: '88%' },
    { employee_name: 'Emily Brown', department: 'HR', salary: '$60,000', attendance_rate: '97%' }
  ];

  const fieldsByCategory = availableFields?.reduce((acc, field) => {
    if (!acc?.[field?.category]) {
      acc[field.category] = [];
    }
    acc?.[field?.category]?.push(field);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Report Configuration</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Report Name"
              type="text"
              placeholder="Enter report name"
              value={reportConfig?.name}
              onChange={(e) => handleConfigChange('name', e?.target?.value)}
              required
            />

            <Input
              label="Description"
              type="text"
              placeholder="Brief description of the report"
              value={reportConfig?.description}
              onChange={(e) => handleConfigChange('description', e?.target?.value)}
            />

            <Select
              label="Report Type"
              options={reportTypes}
              value={reportConfig?.type}
              onChange={(value) => handleConfigChange('type', value)}
            />
          </div>

          <div className="space-y-4">
            <Select
              label="Group By"
              options={groupByOptions}
              value={reportConfig?.groupBy}
              onChange={(value) => handleConfigChange('groupBy', value)}
            />

            <Select
              label="Sort By"
              options={sortByOptions}
              value={reportConfig?.sortBy}
              onChange={(value) => handleConfigChange('sortBy', value)}
            />

            <Select
              label="Export Format"
              options={formatOptions}
              value={reportConfig?.format}
              onChange={(value) => handleConfigChange('format', value)}
            />
          </div>
        </div>
      </div>
      {/* Field Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Fields */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Database" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Available Fields</h3>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(fieldsByCategory)?.map(([category, fields]) => (
              <div key={category}>
                <h4 className="font-medium text-foreground mb-2 text-sm">{category}</h4>
                <div className="space-y-2">
                  {fields?.map((field) => (
                    <div
                      key={field?.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, field)}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg cursor-move hover:bg-muted/80 micro-transition"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name="GripVertical" size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{field?.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground px-2 py-1 bg-background rounded">
                        {field?.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Fields */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="List" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Selected Fields</h3>
            <span className="text-sm text-muted-foreground">({reportConfig?.fields?.length})</span>
          </div>

          <div
            className="min-h-64 border-2 border-dashed border-border rounded-lg p-4 space-y-2"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {reportConfig?.fields?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Icon name="MousePointer2" size={32} className="text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Drag and drop fields here</p>
                <p className="text-xs text-muted-foreground">or click to add fields</p>
              </div>
            ) : (
              reportConfig?.fields?.map((field, index) => (
                <div
                  key={field?.id}
                  className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-primary px-2 py-1 bg-primary/20 rounded">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{field?.name}</span>
                    <span className="text-xs text-muted-foreground">({field?.type})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveField(field?.id)}
                    className="h-6 w-6"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="Eye"
            iconPosition="left"
            onClick={handlePreview}
            disabled={reportConfig?.fields?.length === 0}
          >
            Preview
          </Button>
          <Button
            variant="outline"
            iconName="Save"
            iconPosition="left"
            onClick={handleSaveTemplate}
            disabled={!reportConfig?.name}
          >
            Save Template
          </Button>
        </div>

        <Button
          variant="default"
          iconName="FileText"
          iconPosition="left"
          onClick={handleGenerateReport}
          disabled={!reportConfig?.name || reportConfig?.fields?.length === 0}
        >
          Generate Report
        </Button>
      </div>
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Report Preview</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">{reportConfig?.name || 'Untitled Report'}</h3>
                {reportConfig?.description && (
                  <p className="text-sm text-muted-foreground mt-1">{reportConfig?.description}</p>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {reportConfig?.fields?.map((field) => (
                        <th key={field?.id} className="text-left py-3 px-4 font-medium text-foreground">
                          {field?.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockPreviewData?.map((row, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50">
                        {reportConfig?.fields?.map((field) => (
                          <td key={field?.id} className="py-3 px-4 text-foreground">
                            {row?.[field?.id] || 'N/A'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Close Preview
                </Button>
                <Button
                  variant="default"
                  iconName="FileText"
                  iconPosition="left"
                  onClick={handleGenerateReport}
                >
                  Generate Full Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBuilder;