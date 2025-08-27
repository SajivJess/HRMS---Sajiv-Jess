import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PayrollSummaryPanel = ({ 
  summaryData, 
  selectedEmployees, 
  totalEmployees,
  onCalculatePayroll,
  onGeneratePayslips,
  onExportData,
  isCalculating,
  isGenerating,
  isExporting
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0)?.toFixed(1)}%`;
  };

  const summaryCards = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      subtitle: `${selectedEmployees?.length} selected`,
      icon: 'Users',
      color: 'text-blue-600'
    },
    {
      title: 'Gross Pay Total',
      value: formatCurrency(summaryData?.totalGrossPay),
      subtitle: `Avg: ${formatCurrency(summaryData?.averageGrossPay)}`,
      icon: 'DollarSign',
      color: 'text-green-600'
    },
    {
      title: 'Total Deductions',
      value: formatCurrency(summaryData?.totalDeductions),
      subtitle: `${formatPercentage(summaryData?.deductionPercentage)} of gross`,
      icon: 'Minus',
      color: 'text-red-600'
    },
    {
      title: 'Net Pay Total',
      value: formatCurrency(summaryData?.totalNetPay),
      subtitle: `Avg: ${formatCurrency(summaryData?.averageNetPay)}`,
      icon: 'TrendingUp',
      color: 'text-emerald-600'
    }
  ];

  const taxBreakdown = [
    { label: 'Federal Tax', amount: summaryData?.federalTax, percentage: 22 },
    { label: 'State Tax', amount: summaryData?.stateTax, percentage: 8 },
    { label: 'Social Security', amount: summaryData?.socialSecurity, percentage: 6.2 },
    { label: 'Medicare', amount: summaryData?.medicare, percentage: 1.45 },
    { label: 'Other Deductions', amount: summaryData?.otherDeductions, percentage: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        {summaryCards?.map((card, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name={card?.icon} size={20} className={card?.color} />
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{card?.value}</div>
                <div className="text-sm text-muted-foreground">{card?.subtitle}</div>
              </div>
            </div>
            <div className="text-sm font-medium text-foreground">{card?.title}</div>
          </div>
        ))}
      </div>
      {/* Tax Breakdown */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="PieChart" size={20} />
          <span>Tax Breakdown</span>
        </h3>
        <div className="space-y-3">
          {taxBreakdown?.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium text-foreground">{item?.label}</div>
                <div className="text-xs text-muted-foreground">({item?.percentage}%)</div>
              </div>
              <div className="text-sm font-semibold text-foreground">
                {formatCurrency(item?.amount)}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-3 pt-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-foreground">Total Tax & Deductions</div>
            <div className="text-sm font-bold text-foreground">
              {formatCurrency(summaryData?.totalDeductions)}
            </div>
          </div>
        </div>
      </div>
      {/* Department Breakdown */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Building" size={20} />
          <span>Department Summary</span>
        </h3>
        <div className="space-y-3">
          {summaryData?.departmentBreakdown?.map((dept, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="text-sm font-medium text-foreground">{dept?.name}</div>
                <div className="text-xs text-muted-foreground">({dept?.employeeCount})</div>
              </div>
              <div className="text-sm font-semibold text-foreground">
                {formatCurrency(dept?.totalPay)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          fullWidth
          onClick={onCalculatePayroll}
          loading={isCalculating}
          iconName="Calculator"
          iconPosition="left"
          disabled={selectedEmployees?.length === 0}
        >
          {isCalculating ? 'Calculating...' : 'Calculate Payroll'}
        </Button>

        <Button
          variant="outline"
          fullWidth
          onClick={onGeneratePayslips}
          loading={isGenerating}
          iconName="FileText"
          iconPosition="left"
          disabled={selectedEmployees?.length === 0 || !summaryData?.isCalculated}
        >
          {isGenerating ? 'Generating...' : 'Generate Payslips'}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={() => onExportData('csv')}
            loading={isExporting === 'csv'}
            iconName="Download"
            iconPosition="left"
            size="sm"
            disabled={selectedEmployees?.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            onClick={() => onExportData('excel')}
            loading={isExporting === 'excel'}
            iconName="FileSpreadsheet"
            iconPosition="left"
            size="sm"
            disabled={selectedEmployees?.length === 0}
          >
            Export Excel
          </Button>
        </div>
      </div>
      {/* Processing Status */}
      {(isCalculating || isGenerating || isExporting) && (
        <div className="bg-muted border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="text-sm text-foreground">
              {isCalculating && 'Processing payroll calculations...'}
              {isGenerating && 'Generating payslip documents...'}
              {isExporting && 'Preparing export file...'}
            </div>
          </div>
          <div className="mt-2 w-full bg-border rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300 ease-out w-3/4"></div>
          </div>
        </div>
      )}
      {/* Last Calculation Info */}
      {summaryData?.lastCalculated && (
        <div className="bg-muted border border-border rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Last calculated: {new Date(summaryData.lastCalculated)?.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollSummaryPanel;