import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggle, userRole = 'admin' }) => {
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/admin-dashboard',
      icon: 'LayoutDashboard',
      requiredRoles: ['admin', 'hr', 'employee'],
      tooltip: 'System overview and metrics'
    },
    {
      label: 'Employees',
      path: '/employee-management',
      icon: 'Users',
      requiredRoles: ['admin', 'hr'],
      tooltip: 'Manage employee records'
    },
    {
      label: 'Attendance',
      path: '/attendance-tracking',
      icon: 'Clock',
      requiredRoles: ['admin', 'hr', 'employee'],
      tooltip: 'Track time and attendance'
    },
    {
      label: 'Payroll',
      path: '/payroll-processing',
      icon: 'DollarSign',
      requiredRoles: ['admin', 'hr'],
      tooltip: 'Process salary and compensation'
    },
    {
      label: 'Reports',
      path: '/reports-analytics',
      icon: 'BarChart3',
      requiredRoles: ['admin', 'hr'],
      tooltip: 'Analytics and reporting'
    }
  ];

  const filteredItems = navigationItems?.filter(item => 
    item?.requiredRoles?.includes(userRole)
  );

  const isActive = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 z-40 bg-card border-r border-border sidebar-transition ${
        isCollapsed ? 'w-16' : 'w-70'
      } hidden lg:block`}>
        <div className="flex flex-col h-full">
          {/* Toggle Button */}
          <div className="p-4 border-b border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="w-full justify-center"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredItems?.map((item) => (
              <div key={item?.path} className="relative group">
                <NavLink
                  to={item?.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-lg micro-interaction ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                >
                  <Icon name={item?.icon} size={20} />
                  {!isCollapsed && (
                    <span className="font-medium">{item?.label}</span>
                  )}
                </NavLink>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md border border-border elevation-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item?.tooltip}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            {!isCollapsed && (
              <div className="text-xs text-muted-foreground text-center">
                HRMSPro v2.1.0
              </div>
            )}
          </div>
        </div>
      </aside>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border lg:hidden">
        <div className="flex items-center justify-around py-2">
          {filteredItems?.slice(0, 5)?.map((item) => (
            <NavLink
              key={item?.path}
              to={item?.path}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 px-3 py-2 rounded-lg micro-interaction min-w-0 ${
                  isActive
                    ? 'text-primary' :'text-muted-foreground'
                }`
              }
            >
              <Icon name={item?.icon} size={20} />
              <span className="text-xs font-medium truncate max-w-full">
                {item?.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;