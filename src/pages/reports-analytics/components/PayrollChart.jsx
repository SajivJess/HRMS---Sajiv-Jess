import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const PayrollChart = () => {
  const payrollTrends = [
    { month: 'Jan', totalPayroll: 485000, overtime: 12000, bonuses: 25000, deductions: 8000 },
    { month: 'Feb', totalPayroll: 492000, overtime: 15000, bonuses: 18000, deductions: 9500 },
    { month: 'Mar', totalPayroll: 510000, overtime: 18000, bonuses: 32000, deductions: 7200 },
    { month: 'Apr', totalPayroll: 498000, overtime: 14000, bonuses: 22000, deductions: 8800 },
    { month: 'May', totalPayroll: 515000, overtime: 20000, bonuses: 28000, deductions: 9200 },
    { month: 'Jun', totalPayroll: 523000, overtime: 22000, bonuses: 35000, deductions: 8500 },
    { month: 'Jul', totalPayroll: 531000, overtime: 19000, bonuses: 30000, deductions: 9800 },
    { month: 'Aug', totalPayroll: 528000, overtime: 17000, bonuses: 26000, deductions: 9100 }
  ];

  const departmentPayroll = [
    { department: 'Engineering', amount: 185000, employees: 45 },
    { department: 'Sales', amount: 142000, employees: 38 },
    { department: 'Marketing', amount: 98000, employees: 25 },
    { department: 'Operations', amount: 76000, employees: 22 },
    { department: 'HR', amount: 54000, employees: 12 },
    { department: 'Finance', amount: 67000, employees: 15 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-2">
          <p className="font-medium text-popover-foreground">{`Month: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: $${entry?.value?.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const DepartmentTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-2">
          <p className="font-medium text-popover-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{`Total: $${data?.amount?.toLocaleString()}`}</p>
          <p className="text-sm text-muted-foreground">{`Employees: ${data?.employees}`}</p>
          <p className="text-sm text-muted-foreground">{`Avg: $${Math.round(data?.amount / data?.employees)?.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Payroll Trends Over Time */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Payroll Trends</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Total Payroll</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Overtime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">Bonuses</span>
            </div>
          </div>
        </div>

        <div className="w-full h-80" aria-label="Payroll Trends Line Chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={payrollTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}K`}
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="totalPayroll" 
                stroke="#2563EB" 
                strokeWidth={3}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                name="Total Payroll"
              />
              <Line 
                type="monotone" 
                dataKey="overtime" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', strokeWidth: 2, r: 3 }}
                name="Overtime"
              />
              <Line 
                type="monotone" 
                dataKey="bonuses" 
                stroke="#D97706" 
                strokeWidth={2}
                dot={{ fill: '#D97706', strokeWidth: 2, r: 3 }}
                name="Bonuses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Department-wise Payroll Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Department Payroll Distribution</h3>
        </div>

        <div className="w-full h-80" aria-label="Department Payroll Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentPayroll} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="department" 
                stroke="#64748B"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}K`}
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<DepartmentTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="#2563EB" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Payroll Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-success" />
            <span className="text-sm font-medium text-muted-foreground">Total Payroll</span>
          </div>
          <div className="text-2xl font-bold text-foreground">$528K</div>
          <div className="text-xs text-success">+3.2% from last month</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Overtime Pay</span>
          </div>
          <div className="text-2xl font-bold text-foreground">$17K</div>
          <div className="text-xs text-error">-10.5% from last month</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Award" size={16} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Bonuses</span>
          </div>
          <div className="text-2xl font-bold text-foreground">$26K</div>
          <div className="text-xs text-success">+8.3% from last month</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Minus" size={16} className="text-error" />
            <span className="text-sm font-medium text-muted-foreground">Deductions</span>
          </div>
          <div className="text-2xl font-bold text-foreground">$9.1K</div>
          <div className="text-xs text-error">+2.2% from last month</div>
        </div>
      </div>
      {/* Cost Analysis Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Table" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Cost Analysis by Department</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Employees</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Cost</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg per Employee</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {departmentPayroll?.map((dept, index) => {
                const totalPayroll = departmentPayroll?.reduce((sum, d) => sum + d?.amount, 0);
                const percentage = ((dept?.amount / totalPayroll) * 100)?.toFixed(1);
                const avgPerEmployee = Math.round(dept?.amount / dept?.employees);

                return (
                  <tr key={index} className="border-b border-border hover:bg-muted micro-interaction">
                    <td className="py-3 px-4 font-medium text-foreground">{dept?.department}</td>
                    <td className="py-3 px-4 text-right text-foreground">{dept?.employees}</td>
                    <td className="py-3 px-4 text-right font-medium text-foreground">
                      ${dept?.amount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-foreground">
                      ${avgPerEmployee?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollChart;