import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'check-in',
      user: 'Sarah Johnson',
      action: 'checked in',
      time: '2 minutes ago',
      icon: 'Clock',
      color: 'success'
    },
    {
      id: 2,
      type: 'leave-request',
      user: 'Michael Chen',
      action: 'submitted leave request for Dec 25-27',
      time: '15 minutes ago',
      icon: 'Calendar',
      color: 'warning'
    },
    {
      id: 3,
      type: 'payroll',
      user: 'System',
      action: 'completed payroll processing for November',
      time: '1 hour ago',
      icon: 'DollarSign',
      color: 'primary'
    },
    {
      id: 4,
      type: 'employee-add',
      user: 'HR Team',
      action: 'added new employee - David Wilson',
      time: '2 hours ago',
      icon: 'UserPlus',
      color: 'accent'
    },
    {
      id: 5,
      type: 'check-out',
      user: 'Emma Davis',
      action: 'checked out',
      time: '3 hours ago',
      icon: 'LogOut',
      color: 'secondary'
    },
    {
      id: 6,
      type: 'overtime',
      user: 'James Rodriguez',
      action: 'logged 2 hours overtime',
      time: '4 hours ago',
      icon: 'Clock',
      color: 'warning'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-primary/80 micro-interaction">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full bg-${activity?.color}/10 flex items-center justify-center flex-shrink-0`}>
              <Icon name={activity?.icon} size={16} className={`text-${activity?.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{activity?.user}</span> {activity?.action}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{activity?.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;