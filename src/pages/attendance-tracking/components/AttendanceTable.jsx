import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AttendanceTable = ({ 
  attendanceData, 
  selectedEmployees, 
  onSelectionChange, 
  onManualCorrection,
  userRole = 'admin',
  sortConfig,
  onSort
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'text-success bg-success/10';
      case 'absent': return 'text-error bg-error/10';
      case 'late': return 'text-warning bg-warning/10';
      case 'overtime': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const formatTime = (time) => {
    if (!time) return '--';
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

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(attendanceData?.map(emp => emp?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleRowSelection = (employeeId, checked) => {
    if (checked) {
      onSelectionChange([...selectedEmployees, employeeId]);
    } else {
      onSelectionChange(selectedEmployees?.filter(id => id !== employeeId));
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-primary" />
      : <Icon name="ArrowDown" size={16} className="text-primary" />;
  };

  const isAllSelected = selectedEmployees?.length === attendanceData?.length;
  const isPartiallySelected = selectedEmployees?.length > 0 && selectedEmployees?.length < attendanceData?.length;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4 w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4 min-w-[200px]">
                <button
                  onClick={() => onSort('name')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary micro-interaction"
                >
                  <span>Employee</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="text-left p-4 min-w-[120px]">
                <button
                  onClick={() => onSort('checkIn')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary micro-interaction"
                >
                  <span>Check In</span>
                  {getSortIcon('checkIn')}
                </button>
              </th>
              <th className="text-left p-4 min-w-[120px]">
                <button
                  onClick={() => onSort('checkOut')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary micro-interaction"
                >
                  <span>Check Out</span>
                  {getSortIcon('checkOut')}
                </button>
              </th>
              <th className="text-left p-4 min-w-[100px]">
                <button
                  onClick={() => onSort('totalHours')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary micro-interaction"
                >
                  <span>Total Hours</span>
                  {getSortIcon('totalHours')}
                </button>
              </th>
              <th className="text-left p-4 min-w-[100px]">
                <button
                  onClick={() => onSort('overtime')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary micro-interaction"
                >
                  <span>Overtime</span>
                  {getSortIcon('overtime')}
                </button>
              </th>
              <th className="text-left p-4 min-w-[120px]">
                <button
                  onClick={() => onSort('status')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary micro-interaction"
                >
                  <span>Status</span>
                  {getSortIcon('status')}
                </button>
              </th>
              {userRole === 'admin' && (
                <th className="text-right p-4 min-w-[100px]">
                  <span className="font-medium text-foreground">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {attendanceData?.map((employee, index) => (
              <tr
                key={employee?.id}
                className={`border-b border-border hover:bg-muted/30 micro-interaction ${
                  selectedEmployees?.includes(employee?.id) ? 'bg-accent/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(employee?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedEmployees?.includes(employee?.id)}
                    onChange={(e) => handleRowSelection(employee?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={employee?.avatar}
                        alt={employee?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{employee?.name}</div>
                      <div className="text-sm text-muted-foreground">{employee?.department}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-foreground font-mono">
                    {formatTime(employee?.checkIn)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-foreground font-mono">
                    {formatTime(employee?.checkOut)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-foreground font-mono">
                    {calculateTotalHours(employee?.checkIn, employee?.checkOut)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-foreground font-mono">
                    {employee?.overtime || '0:00'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee?.status)}`}>
                    {employee?.status}
                  </span>
                </td>
                {userRole === 'admin' && (
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onManualCorrection(employee)}
                      className={`transition-opacity ${
                        hoveredRow === employee?.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {attendanceData?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No attendance records found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or date range.</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;