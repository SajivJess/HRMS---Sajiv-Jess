import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();

  const routeMap = {
    '/admin-dashboard': 'Dashboard',
    '/employee-management': 'Employee Management',
    '/payroll-processing': 'Payroll Processing',
    '/attendance-tracking': 'Attendance Tracking',
    '/reports-analytics': 'Reports & Analytics',
    '/multi-portal-login': 'Login'
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Home', path: '/admin-dashboard' }];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeMap?.[currentPath] || segment?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase());
      
      breadcrumbs?.push({
        label,
        path: currentPath,
        isLast: index === pathSegments?.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      {breadcrumbs?.map((crumb, index) => (
        <div key={crumb?.path} className="flex items-center space-x-2">
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          )}
          
          {crumb?.isLast ? (
            <span className="text-foreground font-medium" aria-current="page">
              {crumb?.label}
            </span>
          ) : (
            <Link
              to={crumb?.path}
              className="hover:text-foreground micro-interaction"
            >
              {crumb?.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;