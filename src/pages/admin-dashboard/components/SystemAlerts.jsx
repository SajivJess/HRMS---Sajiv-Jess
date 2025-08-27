import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Overtime Threshold Exceeded',
      message: '5 employees have exceeded 40 hours this week',
      timestamp: '10 minutes ago',
      dismissed: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Payroll Reminder',
      message: 'Monthly payroll processing due in 3 days',
      timestamp: '2 hours ago',
      dismissed: false
    },
    {
      id: 3,
      type: 'error',
      title: 'System Backup Failed',
      message: 'Automated backup failed at 2:00 AM. Manual backup required.',
      timestamp: '6 hours ago',
      dismissed: false
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'primary';
      default: return 'muted';
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts?.map(alert => 
      alert?.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const activeAlerts = alerts?.filter(alert => !alert?.dismissed);

  if (activeAlerts?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
        </div>
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
          <p className="text-muted-foreground">All systems running smoothly</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
        <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full">
          {activeAlerts?.length}
        </span>
      </div>
      <div className="space-y-4">
        {activeAlerts?.map((alert) => (
          <div 
            key={alert?.id} 
            className={`border-l-4 border-${getAlertColor(alert?.type)} bg-${getAlertColor(alert?.type)}/5 p-4 rounded-r-lg`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Icon 
                  name={getAlertIcon(alert?.type)} 
                  size={20} 
                  className={`text-${getAlertColor(alert?.type)} mt-0.5`} 
                />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground text-sm">
                    {alert?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {alert?.message}
                  </p>
                  <span className="text-xs text-muted-foreground mt-2 block">
                    {alert?.timestamp}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dismissAlert(alert?.id)}
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAlerts;