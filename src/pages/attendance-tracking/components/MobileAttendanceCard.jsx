import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MobileAttendanceCard = ({ 
  employee, 
  onCheckIn, 
  onCheckOut, 
  onManualCorrection,
  userRole = 'employee' 
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'text-success bg-success/10 border-success/20';
      case 'absent': return 'text-error bg-error/10 border-error/20';
      case 'late': return 'text-warning bg-warning/10 border-warning/20';
      case 'overtime': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    return new Date(`2024-01-01 ${time}`)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateTotalHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '0:00';
    const start = new Date(`2024-01-01 ${checkIn}`);
    const end = new Date(`2024-01-01 ${checkOut}`);
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes?.toString()?.padStart(2, '0')}`;
  };

  const canCheckOut = employee?.checkIn && !employee?.checkOut;
  const canCheckIn = !employee?.checkIn;

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      {/* Employee Header */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
          <Image
            src={employee?.avatar}
            alt={employee?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{employee?.name}</h3>
          <p className="text-sm text-muted-foreground">{employee?.department}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee?.status)}`}>
          {employee?.status}
        </div>
      </div>
      {/* Time Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Check In</div>
          <div className="font-mono text-sm font-medium text-foreground">
            {formatTime(employee?.checkIn)}
          </div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Check Out</div>
          <div className="font-mono text-sm font-medium text-foreground">
            {formatTime(employee?.checkOut)}
          </div>
        </div>
      </div>
      {/* Hours Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Total Hours</div>
          <div className="font-mono text-sm font-medium text-foreground">
            {calculateTotalHours(employee?.checkIn, employee?.checkOut)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Overtime</div>
          <div className="font-mono text-sm font-medium text-foreground">
            {employee?.overtime || '0:00'}
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      {userRole === 'employee' && (
        <div className="flex space-x-2">
          <Button
            variant={canCheckIn ? "default" : "outline"}
            size="sm"
            fullWidth
            disabled={!canCheckIn}
            onClick={() => onCheckIn(employee?.id)}
            iconName="LogIn"
            iconPosition="left"
          >
            Check In
          </Button>
          <Button
            variant={canCheckOut ? "default" : "outline"}
            size="sm"
            fullWidth
            disabled={!canCheckOut}
            onClick={() => onCheckOut(employee?.id)}
            iconName="LogOut"
            iconPosition="left"
          >
            Check Out
          </Button>
        </div>
      )}
      {/* Admin Actions */}
      {userRole === 'admin' && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onManualCorrection(employee)}
            iconName="Edit"
            iconPosition="left"
          >
            Manual Correction
          </Button>
        </div>
      )}
      {/* Location Info */}
      {employee?.location && (
        <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
          <Icon name="MapPin" size={12} />
          <span>{employee?.location}</span>
        </div>
      )}
    </div>
  );
};

export default MobileAttendanceCard;