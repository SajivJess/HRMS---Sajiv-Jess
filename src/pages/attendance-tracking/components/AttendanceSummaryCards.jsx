import React from 'react';
import Icon from '../../../components/AppIcon';

const AttendanceSummaryCards = ({ summaryData }) => {
  const cards = [
    {
      title: 'Total Present',
      value: summaryData?.totalPresent || 0,
      icon: 'UserCheck',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: summaryData?.presentChange || '+5%',
      changeType: 'positive'
    },
    {
      title: 'Total Absent',
      value: summaryData?.totalAbsent || 0,
      icon: 'UserX',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: summaryData?.absentChange || '-2%',
      changeType: 'negative'
    },
    {
      title: 'Late Arrivals',
      value: summaryData?.lateArrivals || 0,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: summaryData?.lateChange || '+1%',
      changeType: 'neutral'
    },
    {
      title: 'Overtime Hours',
      value: summaryData?.overtimeHours || '0h',
      icon: 'Timer',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: summaryData?.overtimeChange || '+12h',
      changeType: 'positive'
    }
  ];

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive': return 'TrendingUp';
      case 'negative': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  return (
    <div className="space-y-4">
      {cards?.map((card, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border p-4 hover:elevation-1 micro-interaction"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${card?.bgColor} flex items-center justify-center`}>
              <Icon name={card?.icon} size={20} className={card?.color} />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getChangeColor(card?.changeType)}`}>
              <Icon name={getChangeIcon(card?.changeType)} size={14} />
              <span>{card?.change}</span>
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {card?.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {card?.title}
            </div>
          </div>
        </div>
      ))}
      {/* Quick Stats */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="font-medium text-foreground mb-3">Today's Overview</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Attendance Rate</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-muted rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${summaryData?.attendanceRate || 85}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-foreground">
                {summaryData?.attendanceRate || 85}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">On Time Rate</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${summaryData?.onTimeRate || 78}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-foreground">
                {summaryData?.onTimeRate || 78}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Average Hours</span>
            <span className="text-sm font-medium text-foreground">
              {summaryData?.averageHours || '8.2h'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummaryCards;