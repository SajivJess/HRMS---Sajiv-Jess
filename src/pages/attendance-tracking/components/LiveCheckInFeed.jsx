import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const LiveCheckInFeed = ({ checkInData }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'check-in': return { icon: 'LogIn', color: 'text-success' };
      case 'check-out': return { icon: 'LogOut', color: 'text-error' };
      case 'break-start': return { icon: 'Coffee', color: 'text-warning' };
      case 'break-end': return { icon: 'Play', color: 'text-accent' };
      default: return { icon: 'Clock', color: 'text-muted-foreground' };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time?.toLocaleDateString();
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Live Check-in Feed</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
      </div>
      {/* Feed Content */}
      <div className="max-h-96 overflow-y-auto">
        {checkInData?.length > 0 ? (
          <div className="space-y-1">
            {checkInData?.map((activity, index) => {
              const { icon, color } = getActivityIcon(activity?.type);
              return (
                <div
                  key={activity?.id}
                  className="p-3 hover:bg-muted/30 micro-interaction border-b border-border last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={activity?.avatar}
                        alt={activity?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-foreground text-sm truncate">
                          {activity?.name}
                        </span>
                        <Icon name={icon} size={14} className={color} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {activity?.action}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity?.timestamp)}
                        </span>
                        {activity?.location && (
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Icon name="MapPin" size={12} className="mr-1" />
                            {activity?.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="Activity" size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No recent activity</p>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/20">
        <button className="w-full text-sm text-primary hover:text-primary/80 micro-transition font-medium">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default LiveCheckInFeed;