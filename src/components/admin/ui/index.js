export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
export { default as Modal } from './Modal';
export { default as Select } from './Select';
export { default as Table } from './Table';
export { default as toast, Toast, ToastProvider, TOAST_TYPES } from './Toast';

// useToast hook for easier toast management
import toast from './Toast';

export const useToast = () => {
  return {
    showToast: (message, type = 'info', options = {}) => {
      switch (type) {
        case 'success':
          return toast.success(message, options);
        case 'error':
          return toast.error(message, options);
        case 'warning':
          return toast.warning(message, options);
        case 'info':
        default:
          return toast.info(message, options);
      }
    },
    clearToasts: () => toast.clear()
  };
};
export { default as Breadcrumb } from './Breadcrumb';
export { default as FileUpload } from './FileUpload';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as BulkActions, commonBulkActions } from './BulkActions';
export { 
  default as Skeleton,
  TextSkeleton, 
  AvatarSkeleton, 
  CardSkeleton, 
  TableSkeleton, 
  ListSkeleton, 
  DashboardSkeleton 
} from './Skeleton';
export { 
  Form, 
  FormField, 
  FormSection, 
  FormActions, 
  Textarea, 
  Checkbox, 
  RadioGroup, 
  useForm, 
  validators 
} from './Form';