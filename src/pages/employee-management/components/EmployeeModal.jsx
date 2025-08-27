import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmployeeModal = ({
  isOpen,
  onClose,
  employee,
  mode, // 'view', 'edit', 'create'
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    role: '',
    location: '',
    employmentType: '',
    hireDate: '',
    salary: '',
    status: 'active',
    photo: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (employee && (mode === 'view' || mode === 'edit')) {
      setFormData({
        name: employee?.name || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        employeeId: employee?.employeeId || '',
        department: employee?.department || '',
        role: employee?.role || '',
        location: employee?.location || '',
        employmentType: employee?.employmentType || '',
        hireDate: employee?.hireDate || '',
        salary: employee?.salary || '',
        status: employee?.status || 'active',
        photo: employee?.photo || ''
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        employeeId: '',
        department: '',
        role: '',
        location: '',
        employmentType: '',
        hireDate: '',
        salary: '',
        status: 'active',
        photo: ''
      });
    }
    setErrors({});
  }, [employee, mode, isOpen]);

  const departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const locationOptions = [
    { value: 'new-york', label: 'New York' },
    { value: 'san-francisco', label: 'San Francisco' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'austin', label: 'Austin' },
    { value: 'remote', label: 'Remote' }
  ];

  const employmentTypeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) newErrors.name = 'Name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (!formData?.employeeId?.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData?.department) newErrors.department = 'Department is required';
    if (!formData?.role?.trim()) newErrors.role = 'Role is required';
    if (!formData?.hireDate) newErrors.hireDate = 'Hire date is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData?.email && !emailRegex?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await onDelete(employee?.id);
        onClose();
      } catch (error) {
        console.error('Error deleting employee:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view';
  const modalTitle = mode === 'create' ? 'Add New Employee' : 
                    mode === 'edit' ? 'Edit Employee' : 'Employee Details';

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{modalTitle}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Photo Section */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border">
                <Image
                  src={formData?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                  alt={formData?.name || 'Employee'}
                  className="w-full h-full object-cover"
                />
              </div>
              {!isReadOnly && (
                <div>
                  <Button variant="outline" size="sm" iconName="Upload">
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG up to 2MB
                  </p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground border-b border-border pb-2">
                  Personal Information
                </h3>
                
                <Input
                  label="Full Name"
                  type="text"
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  error={errors?.name}
                  disabled={isReadOnly}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={errors?.email}
                  disabled={isReadOnly}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                  error={errors?.phone}
                  disabled={isReadOnly}
                />
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground border-b border-border pb-2">
                  Employment Information
                </h3>

                <Input
                  label="Employee ID"
                  type="text"
                  value={formData?.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e?.target?.value)}
                  error={errors?.employeeId}
                  disabled={isReadOnly}
                  required
                />

                <Select
                  label="Department"
                  options={departmentOptions}
                  value={formData?.department}
                  onChange={(value) => handleInputChange('department', value)}
                  error={errors?.department}
                  disabled={isReadOnly}
                  required
                />

                <Input
                  label="Job Role"
                  type="text"
                  value={formData?.role}
                  onChange={(e) => handleInputChange('role', e?.target?.value)}
                  error={errors?.role}
                  disabled={isReadOnly}
                  required
                />

                <Select
                  label="Location"
                  options={locationOptions}
                  value={formData?.location}
                  onChange={(value) => handleInputChange('location', value)}
                  disabled={isReadOnly}
                />

                <Select
                  label="Employment Type"
                  options={employmentTypeOptions}
                  value={formData?.employmentType}
                  onChange={(value) => handleInputChange('employmentType', value)}
                  disabled={isReadOnly}
                />

                <Input
                  label="Hire Date"
                  type="date"
                  value={formData?.hireDate}
                  onChange={(e) => handleInputChange('hireDate', e?.target?.value)}
                  error={errors?.hireDate}
                  disabled={isReadOnly}
                  required
                />

                <Input
                  label="Annual Salary"
                  type="number"
                  value={formData?.salary}
                  onChange={(e) => handleInputChange('salary', e?.target?.value)}
                  disabled={isReadOnly}
                  placeholder="50000"
                />

                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData?.status}
                  onChange={(value) => handleInputChange('status', value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div>
            {mode === 'edit' && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                loading={isLoading}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete Employee
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              {isReadOnly ? 'Close' : 'Cancel'}
            </Button>
            
            {!isReadOnly && (
              <Button
                variant="default"
                onClick={handleSave}
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
              >
                {mode === 'create' ? 'Create Employee' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;