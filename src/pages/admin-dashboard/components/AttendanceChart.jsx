import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AttendanceChart = () => {
  const attendanceData = [
    { day: 'Mon', present: 145, absent: 5 },
    { day: 'Tue', present: 142, absent: 8 },
    { day: 'Wed', present: 148, absent: 2 },
    { day: 'Thu', present: 144, absent: 6 },
    { day: 'Fri', present: 140, absent: 10 },
    { day: 'Sat', present: 85, absent: 65 },
    { day: 'Sun', present: 0, absent: 150 }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Attendance Trends</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm text-muted-foreground">Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-sm text-muted-foreground">Absent</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-popover-foreground)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="present" 
              stroke="var(--color-success)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="absent" 
              stroke="var(--color-error)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;