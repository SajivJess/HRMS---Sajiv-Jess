import React from 'react';
import Icon from '../../../components/AppIcon';

const CompanyBranding = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="text-center space-y-6">
      {/* Company Logo */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center elevation-2">
            <span className="text-primary-foreground font-bold text-xl">HR</span>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">HRMSPro</h1>
            <p className="text-sm text-muted-foreground">Human Resource Management</p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Welcome Back
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sign in to access your personalized dashboard and manage your HR operations efficiently.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 py-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">500+</div>
          <div className="text-xs text-muted-foreground">Companies</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-accent">50K+</div>
          <div className="text-xs text-muted-foreground">Employees</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-success">99.9%</div>
          <div className="text-xs text-muted-foreground">Uptime</div>
        </div>
      </div>

      {/* Features Highlight */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          What's New in HRMSPro
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Sparkles" size={12} className="text-accent" />
            <span>Enhanced payroll automation</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="BarChart3" size={12} className="text-primary" />
            <span>Advanced analytics dashboard</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Smartphone" size={12} className="text-success" />
            <span>Mobile-first attendance tracking</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div>
          © {currentYear} HRMSPro. All rights reserved.
        </div>
        <div className="flex items-center justify-center space-x-4">
          <a href="#" className="hover:text-foreground micro-interaction">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-foreground micro-interaction">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-foreground micro-interaction">Support</a>
        </div>
      </div>
    </div>
  );
};

export default CompanyBranding;