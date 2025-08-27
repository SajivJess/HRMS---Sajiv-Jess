import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import CompanyBranding from './components/CompanyBranding';

const MultiPortalLogin = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('admin');

  useEffect(() => {
    // Check if user is already logged in
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const session = JSON.parse(userSession);
      // Redirect to appropriate dashboard
      navigate('/admin-dashboard');
    }
  }, [navigate]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Company Branding */}
          <div className="hidden lg:block">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 elevation-1">
              <CompanyBranding />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-card border border-border rounded-2xl p-8 elevation-2">
              {/* Mobile Branding */}
              <div className="lg:hidden mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">HR</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-foreground">HRMSPro</h1>
                      <p className="text-xs text-muted-foreground">Human Resource Management</p>
                    </div>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Sign in to access your dashboard
                  </p>
                </div>
              </div>

              {/* Login Form */}
              <LoginForm 
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
              />

              {/* Mobile Security Info */}
              <div className="lg:hidden mt-8 pt-6 border-t border-border">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>GDPR Compliant</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    © {new Date()?.getFullYear()} HRMSPro. All rights reserved.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Badges - Desktop Only */}
        <div className="hidden lg:block mt-12">
          <SecurityBadges />
        </div>
      </div>
    </div>
  );
};

export default MultiPortalLogin;