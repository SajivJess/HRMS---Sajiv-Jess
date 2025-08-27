import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const EmployeeMetrics = () => {
  const performanceData = [
    { department: 'Engineering', excellent: 25, good: 15, average: 4, poor: 1 },
    { department: 'Sales', excellent: 18, good: 12, average: 6, poor: 2 },
    { department: 'Marketing', excellent: 12, good: 8, average: 4, poor: 1 },
    { department: 'Operations', excellent: 10, good: 8, average: 3, poor: 1 },
    { department: 'HR', excellent: 6, good: 4, average: 2, poor: 0 },
    { department: 'Finance', excellent: 8, good: 5, average: 2, poor: 0 }
  ];

  const turnoverData = [
    { month: 'Jan', hires: 8, departures: 3, retention: 97.2 },
    { month: 'Feb', hires: 12, departures: 5, retention: 96.8 },
    { month: 'Mar', hires: 15, departures: 4, retention: 97.1 },
    { month: 'Apr', hires: 10, departures: 7, retention: 96.5 },
    { month: 'May', hires: 18, departures: 6, retention: 96.9 },
    { month: 'Jun', hires: 14, departures: 4, retention: 97.3 },
    { month: 'Jul', hires: 11, departures: 8, retention: 96.2 },
    { month: 'Aug', hires: 16, departures: 5, retention: 97.0 }
  ];

  const skillsDistribution = [
    { skill: 'Technical Skills', proficient: 78, developing: 22, color: '#2563EB' },
    { skill: 'Communication', proficient: 85, developing: 15, color: '#059669' },
    { skill: 'Leadership', proficient: 45, developing: 55, color: '#D97706' },
    { skill: 'Problem Solving', proficient: 72, developing: 28, color: '#DC2626' },
    { skill: 'Teamwork', proficient: 89, developing: 11, color: '#7C3AED' }
  ];

  const employeeGrowth = [
    { quarter: 'Q1 2024', total: 235, newHires: 28, promotions: 12 },
    { quarter: 'Q2 2024', total: 247, newHires: 32, promotions: 15 },
    { quarter: 'Q3 2024', total: 258, newHires: 25, promotions: 18 },
    { quarter: 'Q4 2024', total: 267, newHires: 22, promotions: 14 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-2">
          <p className="font-medium text-popover-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${entry?.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Performance Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Award" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Performance Distribution by Department</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Excellent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Good</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">Average</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-muted-foreground">Poor</span>
            </div>
          </div>
        </div>

        <div className="w-full h-80" aria-label="Performance Distribution Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                label={{ value: 'Number of Employees', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="excellent" stackId="a" fill="#059669" radius={[0, 0, 0, 0]} />
              <Bar dataKey="good" stackId="a" fill="#2563EB" radius={[0, 0, 0, 0]} />
              <Bar dataKey="average" stackId="a" fill="#D97706" radius={[0, 0, 0, 0]} />
              <Bar dataKey="poor" stackId="a" fill="#DC2626" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Employee Turnover and Retention */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Employee Turnover & Retention</h3>
        </div>

        <div className="w-full h-80" aria-label="Turnover and Retention Line Chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={turnoverData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="#64748B"
                fontSize={12}
                label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#64748B"
                fontSize={12}
                label={{ value: 'Retention %', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload?.length) {
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 elevation-2">
                        <p className="font-medium text-popover-foreground">{`Month: ${label}`}</p>
                        <p className="text-sm text-success">{`Hires: ${payload?.find(p => p?.dataKey === 'hires')?.value || 0}`}</p>
                        <p className="text-sm text-error">{`Departures: ${payload?.find(p => p?.dataKey === 'departures')?.value || 0}`}</p>
                        <p className="text-sm text-primary">{`Retention: ${payload?.find(p => p?.dataKey === 'retention')?.value || 0}%`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar yAxisId="left" dataKey="hires" fill="#059669" />
              <Bar yAxisId="left" dataKey="departures" fill="#DC2626" />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="retention" 
                stroke="#2563EB" 
                strokeWidth={3}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Skills Assessment */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Target" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Skills Assessment Overview</h3>
        </div>

        <div className="space-y-4">
          {skillsDistribution?.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{skill?.skill}</span>
                <span className="text-sm text-muted-foreground">
                  {skill?.proficient}% Proficient
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${skill?.proficient}%`,
                    backgroundColor: skill?.color
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Proficient: {skill?.proficient}%</span>
                <span>Developing: {skill?.developing}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Employee Growth Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Users" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Employee Growth</h3>
          </div>

          <div className="w-full h-64" aria-label="Employee Growth Chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={employeeGrowth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="quarter" 
                  stroke="#64748B"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748B"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Key Metrics</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium text-foreground">Employee Satisfaction</div>
                <div className="text-sm text-muted-foreground">Based on latest survey</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success">4.2/5</div>
                <div className="text-xs text-success">+0.3 from last quarter</div>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium text-foreground">Average Tenure</div>
                <div className="text-sm text-muted-foreground">Company-wide average</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">3.2 years</div>
                <div className="text-xs text-success">+0.4 from last year</div>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium text-foreground">Training Completion</div>
                <div className="text-sm text-muted-foreground">Required courses</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-warning">87%</div>
                <div className="text-xs text-error">-5% from target</div>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium text-foreground">Internal Promotions</div>
                <div className="text-sm text-muted-foreground">This quarter</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success">18</div>
                <div className="text-xs text-success">+20% from last quarter</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMetrics;