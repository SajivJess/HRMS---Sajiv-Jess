import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PayrollCalculationModal = ({ 
  isOpen, 
  onClose, 
  selectedEmployees, 
  onConfirmCalculation,
  calculationProgress 
}) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (calculationProgress > 0 && calculationProgress < 100) {
      setIsProcessing(true);
      setStep(2);
    } else if (calculationProgress === 100) {
      setStep(3);
      setIsProcessing(false);
    }
  }, [calculationProgress]);

  const handleConfirm = () => {
    setStep(2);
    setIsProcessing(true);
    onConfirmCalculation();
  };

  const handleClose = () => {
    if (!isProcessing) {
      setStep(1);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full elevation-3">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Calculator" size={24} />
              <span>Payroll Calculation</span>
            </h2>
            {!isProcessing && (
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <Icon name="X" size={20} />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Confirmation */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <Icon name="AlertTriangle" size={48} className="mx-auto text-warning mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Confirm Payroll Calculation
                </h3>
                <p className="text-muted-foreground">
                  You are about to calculate payroll for {selectedEmployees?.length} selected employees. 
                  This action will update all salary calculations and tax deductions.
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Calculation Details:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Base salary calculations</li>
                  <li>• Allowances and overtime processing</li>
                  <li>• Tax deductions (Federal, State, Social Security, Medicare)</li>
                  <li>• Other deductions and benefits</li>
                  <li>• Net pay computation</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" fullWidth onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="default" fullWidth onClick={handleConfirm}>
                  Confirm & Calculate
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Processing */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Processing Payroll
                </h3>
                <p className="text-muted-foreground">
                  Calculating salaries for {selectedEmployees?.length} employees...
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">{calculationProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${calculationProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Info" size={16} />
                  <span>Please do not close this window during calculation.</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Completion */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Check" size={32} className="text-success-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Calculation Complete
                </h3>
                <p className="text-muted-foreground">
                  Payroll has been successfully calculated for {selectedEmployees?.length} employees.
                </p>
              </div>

              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span>Calculation Summary</span>
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All salary calculations updated</li>
                  <li>• Tax deductions applied</li>
                  <li>• Net pay amounts finalized</li>
                  <li>• Ready for payslip generation</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" fullWidth onClick={handleClose}>
                  Close
                </Button>
                <Button variant="default" fullWidth onClick={handleClose}>
                  Generate Payslips
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollCalculationModal;