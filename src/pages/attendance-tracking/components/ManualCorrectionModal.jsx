import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ManualCorrectionModal = ({ 
  isOpen, 
  onClose, 
  employee, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    checkIn: employee?.checkIn || '',
    checkOut: employee?.checkOut || '',
    reason: '',
    reasonCategory: 'technical',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const reasonCategories = [
    { value: 'technical', label: 'Technical Issue' },
    { value: 'forgot', label: 'Forgot to Check In/Out' },
    { value: 'meeting', label: 'External Meeting' },
    { value: 'travel', label: 'Business Travel' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.checkIn) {
      newErrors.checkIn = 'Check-in time is required';
    }
    
    if (!formData?.reason) {
      newErrors.reason = 'Reason is required';
    }

    if (formData?.checkIn && formData?.checkOut) {
      const checkInTime = new Date(`2024-01-01 ${formData.checkIn}`);
      const checkOutTime = new Date(`2024-01-01 ${formData.checkOut}`);
      
      if (checkOutTime <= checkInTime) {
        newErrors.checkOut = 'Check-out time must be after check-in time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        employeeId: employee?.id,
        ...formData,
        timestamp: new Date()?.toISOString()
      });
      onClose();
    }
  };

  const calculateHours = () => {
    if (formData?.checkIn && formData?.checkOut) {
      const checkInTime = new Date(`2024-01-01 ${formData.checkIn}`);
      const checkOutTime = new Date(`2024-01-01 ${formData.checkOut}`);
      const diff = checkOutTime - checkInTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}:${minutes?.toString()?.padStart(2, '0')}`;
    }
    return '0:00';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border elevation-3 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Manual Attendance Correction</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Correcting attendance for {employee?.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Employee Info */}
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium text-sm">
                  {employee?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-foreground">{employee?.name}</div>
                <div className="text-sm text-muted-foreground">{employee?.department}</div>
              </div>
            </div>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="time"
              label="Check In Time"
              value={formData?.checkIn}
              onChange={(e) => handleInputChange('checkIn', e?.target?.value)}
              error={errors?.checkIn}
              required
            />
            <Input
              type="time"
              label="Check Out Time"
              value={formData?.checkOut}
              onChange={(e) => handleInputChange('checkOut', e?.target?.value)}
              error={errors?.checkOut}
            />
          </div>

          {/* Calculated Hours */}
          {formData?.checkIn && formData?.checkOut && (
            <div className="bg-accent/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Hours:</span>
                <span className="font-medium text-foreground font-mono">
                  {calculateHours()}
                </span>
              </div>
            </div>
          )}

          {/* Reason Category */}
          <Select
            label="Reason Category"
            options={reasonCategories}
            value={formData?.reasonCategory}
            onChange={(value) => handleInputChange('reasonCategory', value)}
            required
          />

          {/* Reason */}
          <Input
            label="Reason for Correction"
            placeholder="Explain why this correction is needed..."
            value={formData?.reason}
            onChange={(e) => handleInputChange('reason', e?.target?.value)}
            error={errors?.reason}
            required
          />

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={3}
              placeholder="Any additional information..."
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Correction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManualCorrectionModal;