import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({
  selectedCount,
  onBulkAction,
  onClearSelection
}) => {
  const [selectedAction, setSelectedAction] = useState('');

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'activate', label: 'Activate Selected' },
    { value: 'deactivate', label: 'Deactivate Selected' },
    { value: 'export', label: 'Export Selected' },
    { value: 'delete', label: 'Delete Selected' }
  ];

  const handleApplyAction = () => {
    if (selectedAction && selectedCount > 0) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedCount} employee{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              options={bulkActionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              className="min-w-48"
            />
            
            <Button
              variant="default"
              size="sm"
              onClick={handleApplyAction}
              disabled={!selectedAction}
              iconName="Play"
              iconPosition="left"
            >
              Apply
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          iconName="X"
          iconPosition="left"
        >
          Clear Selection
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;