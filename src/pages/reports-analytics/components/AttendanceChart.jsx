import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const AttendanceChart = () => {
  const attendanceData = [
    { month: 'Jan', present: 92, absent: 8, late: 5 },
    { month: 'Feb', present: 89, absent: 11, late: 7 },
    { month: 'Mar', present: 94, absent: 6, late: 4 },
    { month: 'Apr', present: 91, absent: 9, late: 6 },
    { month: 'May', present: 88, absent: 12, late: 8 },
    { month: 'Jun', present: 93, absent: 7, late: 5 },
    { month: 'Jul', present: 95, absent: 5, late: 3 },
    { month: 'Aug', present: 90, absent: 10, late: 7 }
  ];

  const departmentAttendance = [
    { name: 'Engineering', value: 45, color: '#2563EB' },
    { name: 'Marketing', value: 23, color: '#059669' },
    { name: 'Sales', value: 18, color: '#D97706' },
    { name: 'HR', value: 8, color: '#DC2626' },
    { name: 'Finance', value: 6, color: '#7C3AED' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-2">
          <p className="font-medium text-popover-foreground">{`Month: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${entry?.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-2">
          <p className="font-medium text-popover-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">{`${data?.value}% attendance`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Monthly Attendance Trends */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Monthly Attendance Trends</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-muted-foreground">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">Late</span>
            </div>
          </div>
        </div>

        <div className="w-full h-80" aria-label="Monthly Attendance Trends Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
                label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="present" fill="#2563EB" radius={[2, 2, 0, 0]} />
              <Bar dataKey="absent" fill="#DC2626" radius={[2, 2, 0, 0]} />
              <Bar dataKey="late" fill="#D97706" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Department-wise Attendance Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="PieChart" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Department-wise Attendance</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full h-64" aria-label="Department Attendance Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentAttendance}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {departmentAttendance?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Department Breakdown</h4>
            {departmentAttendance?.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: dept?.color }}
                  ></div>
                  <span className="font-medium text-foreground">{dept?.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{dept?.value}%</div>
                  <div className="text-xs text-muted-foreground">Average Attendance</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Users" size={16} className="text-success" />
            <span className="text-sm font-medium text-muted-foreground">Overall Attendance</span>
          </div>
          <div className="text-2xl font-bold text-foreground">91.2%</div>
          <div className="text-xs text-success">+2.1% from last month</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Late Arrivals</span>
          </div>
          <div className="text-2xl font-bold text-foreground">5.8%</div>
          <div className="text-xs text-error">+0.5% from last month</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="UserX" size={16} className="text-error" />
            <span className="text-sm font-medium text-muted-foreground">Absenteeism</span>
          </div>
          <div className="text-2xl font-bold text-foreground">8.8%</div>
          <div className="text-xs text-success">-1.2% from last month</div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;