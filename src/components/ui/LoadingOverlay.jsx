import React from 'react';

import Button from './Button';

const LoadingOverlay = ({ 
  isVisible = false, 
  message = 'Loading...', 
  progress = null,
  onCancel = null,
  type = 'default' // 'default', 'fullscreen', 'inline'
}) => {
  if (!isVisible) return null;

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Loading Spinner */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
        {progress !== null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      {/* Loading Message */}
      <div className="text-center">
        <p className="text-foreground font-medium">{message}</p>
        {progress !== null && (
          <div className="mt-2 w-64 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Cancel Button */}
      {onCancel && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="mt-4"
        >
          Cancel
        </Button>
      )}
    </div>
  );

  if (type === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-card p-8 rounded-lg border border-border elevation-3 max-w-sm w-full mx-4">
          <LoadingContent />
        </div>
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingContent />
      </div>
    );
  }

  // Default overlay
  return (
    <div className="absolute inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
      <div className="bg-card p-6 rounded-lg border border-border elevation-2">
        <LoadingContent />
      </div>
    </div>
  );
};

// Skeleton Loading Component
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  showAvatar = false,
  showButton = false 
}) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      )}
      {Array.from({ length: lines })?.map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      ))}
      {showButton && (
        <div className="flex space-x-2 pt-2">
          <div className="h-9 bg-muted rounded w-20"></div>
          <div className="h-9 bg-muted rounded w-16"></div>
        </div>
      )}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex space-x-4 mb-4 pb-2 border-b border-border">
        {Array.from({ length: columns })?.map((_, index) => (
          <div key={index} className="flex-1 h-4 bg-muted rounded"></div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows })?.map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 mb-3">
          {Array.from({ length: columns })?.map((_, colIndex) => (
            <div key={colIndex} className="flex-1 h-4 bg-muted rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingOverlay;