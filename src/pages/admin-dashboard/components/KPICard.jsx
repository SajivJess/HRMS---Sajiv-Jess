import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, color = 'primary', onClick }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-6 elevation-1 hover:elevation-2 micro-interaction ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <div className={`flex items-center space-x-1 mt-2 ${getChangeColor()}`}>
              <Icon name={getChangeIcon()} size={16} />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center`}>
          <Icon name={icon} size={24} className={`text-${color}`} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;