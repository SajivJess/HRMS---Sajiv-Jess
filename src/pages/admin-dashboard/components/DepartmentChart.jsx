import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DepartmentChart = () => {
  const departmentData = [
    { name: 'Engineering', value: 45, color: '#2563EB' },
    { name: 'Sales', value: 25, color: '#059669' },
    { name: 'Marketing', value: 15, color: '#D97706' },
    { name: 'HR', value: 8, color: '#DC2626' },
    { name: 'Finance', value: 7, color: '#7C3AED' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-2">
          <p className="text-sm font-medium text-popover-foreground">
            {data?.name}: {data?.value} employees
          </p>
          <p className="text-xs text-muted-foreground">
            {((data?.value / 100) * 100)?.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Department Distribution</h3>
        <button className="text-sm text-primary hover:text-primary/80 micro-interaction">
          View Details
        </button>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={departmentData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {departmentData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {departmentData?.map((dept) => (
          <div key={dept?.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: dept?.color }}
              ></div>
              <span className="text-sm text-foreground">{dept?.name}</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {dept?.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentChart;