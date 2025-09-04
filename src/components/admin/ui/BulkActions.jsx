import React, { useState } from 'react';
import { Button, Modal } from './index';
import '../../../styles/components/ui/BulkActions.scss';

const BulkActions = ({
  selectedItems = new Set(),
  totalItems = 0,
  actions = [],
  onAction,
  onClearSelection,
  className = '',
  position = 'top',
  ...props
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const selectedCount = selectedItems.size;

  if (selectedCount === 0) {
    return null;
  }

  const handleActionClick = (action) => {
    if (action.requiresConfirmation) {
      setPendingAction(action);
      setShowConfirmModal(true);
    } else {
      executeAction(action);
    }
  };

  const executeAction = async (action) => {
    setIsExecuting(true);
    try {
      await onAction?.(action.key, Array.from(selectedItems));
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsExecuting(false);
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      executeAction(pendingAction);
    }
  };

  const baseClass = 'admin-bulk-actions';
  const classes = [
    baseClass,
    `${baseClass}--${position}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <div className={classes} {...props}>
        <div className={`${baseClass}__content`}>
          <div className={`${baseClass}__selection-info`}>
            <span className={`${baseClass}__selected-count`}>
              {selectedCount} of {totalItems} selected
            </span>
            
            {selectedCount === totalItems && totalItems > 1 && (
              <span className={`${baseClass}__all-selected`}>
                All items selected
              </span>
            )}
          </div>

          <div className={`${baseClass}__actions`}>
            {actions.map((action) => (
              <Button
                key={action.key}
                variant={action.variant || 'outline'}
                size="small"
                leftIcon={action.icon}
                onClick={() => handleActionClick(action)}
                disabled={
                  isExecuting ||
                  (action.minSelection && selectedCount < action.minSelection) ||
                  (action.maxSelection && selectedCount > action.maxSelection)
                }
                className={`${baseClass}__action ${action.className || ''}`}
              >
                {action.label}
              </Button>
            ))}
            
            <Button
              variant="ghost"
              size="small"
              onClick={onClearSelection}
              disabled={isExecuting}
              className={`${baseClass}__clear`}
              aria-label="Clear selection"
            >
              ✕
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && pendingAction && (
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title={pendingAction.confirmTitle || `Confirm ${pendingAction.label}`}
          size="medium"
        >
          <div className={`${baseClass}__confirm-content`}>
            <div className={`${baseClass}__confirm-icon`}>
              {pendingAction.confirmIcon || '⚠️'}
            </div>
            
            <div className={`${baseClass}__confirm-text`}>
              <p>
                {pendingAction.confirmMessage || 
                 `Are you sure you want to ${pendingAction.label.toLowerCase()} ${selectedCount} item${selectedCount !== 1 ? 's' : ''}?`}
              </p>
              
              {pendingAction.confirmWarning && (
                <div className={`${baseClass}__confirm-warning`}>
                  <strong>Warning:</strong> {pendingAction.confirmWarning}
                </div>
              )}
            </div>
          </div>

          <div className={`${baseClass}__confirm-actions`}>
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              disabled={isExecuting}
            >
              Cancel
            </Button>
            
            <Button
              variant={pendingAction.confirmVariant || 'danger'}
              onClick={handleConfirmAction}
              loading={isExecuting}
              leftIcon={pendingAction.icon}
            >
              {pendingAction.confirmButtonText || pendingAction.label}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

// Predefined common bulk actions
export const commonBulkActions = {
  delete: {
    key: 'delete',
    label: 'Delete',
    icon: '🗑️',
    variant: 'danger',
    requiresConfirmation: true,
    confirmTitle: 'Delete Items',
    confirmIcon: '🗑️',
    confirmMessage: 'This action cannot be undone.',
    confirmWarning: 'All selected items will be permanently deleted.',
    confirmButtonText: 'Delete',
    confirmVariant: 'danger'
  },
  
  archive: {
    key: 'archive',
    label: 'Archive',
    icon: '📦',
    variant: 'secondary',
    requiresConfirmation: true,
    confirmTitle: 'Archive Items',
    confirmIcon: '📦',
    confirmMessage: 'Selected items will be moved to archive.',
    confirmButtonText: 'Archive'
  },
  
  export: {
    key: 'export',
    label: 'Export',
    icon: '📤',
    variant: 'outline'
  },
  
  duplicate: {
    key: 'duplicate',
    label: 'Duplicate',
    icon: '📋',
    variant: 'outline'
  },
  
  markAsRead: {
    key: 'mark-read',
    label: 'Mark as Read',
    icon: '✓',
    variant: 'outline'
  },
  
  markAsUnread: {
    key: 'mark-unread',
    label: 'Mark as Unread',
    icon: '●',
    variant: 'outline'
  },
  
  assignTag: {
    key: 'assign-tag',
    label: 'Assign Tag',
    icon: '🏷️',
    variant: 'outline'
  },
  
  changeStatus: {
    key: 'change-status',
    label: 'Change Status',
    icon: '🔄',
    variant: 'outline'
  }
};

export default BulkActions;