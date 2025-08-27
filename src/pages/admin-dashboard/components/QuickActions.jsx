import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: 'Process Payroll',
      description: 'Calculate and process monthly payroll',
      icon: 'DollarSign',
      variant: 'default',
      onClick: () => navigate('/payroll-processing')
    },
    {
      id: 2,
      title: 'Add Employee',
      description: 'Register new team member',
      icon: 'UserPlus',
      variant: 'outline',
      onClick: () => navigate('/employee-management')
    },
    {
      id: 3,
      title: 'Generate Reports',
      description: 'Create analytics and reports',
      icon: 'BarChart3',
      variant: 'secondary',
      onClick: () => navigate('/reports-analytics')
    },
    {
      id: 4,
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: 'Settings',
      variant: 'ghost',
      onClick: () => console.log('System settings clicked')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            onClick={action?.onClick}
            iconName={action?.icon}
            iconPosition="left"
            className="h-auto p-4 justify-start text-left"
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">{action?.title}</span>
              <span className="text-xs opacity-70 mt-1">{action?.description}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;