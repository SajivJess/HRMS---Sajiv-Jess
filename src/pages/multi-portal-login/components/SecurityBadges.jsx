import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: '256-bit encryption'
    },
    {
      icon: 'Lock',
      title: 'GDPR Compliant',
      description: 'Data protection certified'
    },
    {
      icon: 'CheckCircle',
      title: 'SOC 2 Certified',
      description: 'Security audited'
    },
    {
      icon: 'Eye',
      title: 'Privacy First',
      description: 'No data sharing'
    }
  ];

  const complianceBadges = [
    'ISO 27001 Certified',
    'HIPAA Compliant',
    'PCI DSS Level 1',
    'Privacy Shield Certified'
  ];

  return (
    <div className="space-y-6">
      {/* Security Features */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {securityFeatures?.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-3 bg-muted/30 rounded-lg"
          >
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center mb-2">
              <Icon name={feature?.icon} size={16} className="text-success" />
            </div>
            <div className="text-xs font-medium text-foreground mb-1">
              {feature?.title}
            </div>
            <div className="text-xs text-muted-foreground">
              {feature?.description}
            </div>
          </div>
        ))}
      </div>
      {/* Compliance Badges */}
      <div className="text-center">
        <div className="text-xs text-muted-foreground mb-3">
          Trusted by 500+ companies worldwide
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {complianceBadges?.map((badge, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-card border border-border rounded text-xs text-muted-foreground"
            >
              <Icon name="Award" size={12} className="mr-1" />
              {badge}
            </span>
          ))}
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={12} />
            <span>50,000+ Active Users</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>99.9% Uptime</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Enterprise-grade security for your business data
        </div>
      </div>
    </div>
  );
};

export default SecurityBadges;