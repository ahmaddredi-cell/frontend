/**
 * Notification Utility
 * 
 * This utility provides a consistent way to show notifications throughout the application
 * using react-hot-toast. It includes functions for showing different types of notifications
 * (success, error, info, etc.) with predefined styles and behavior.
 */

// Import toast without type references since TypeScript can infer them
import toast from 'react-hot-toast';

// Define our own types to avoid dependency on missing type declarations
type ToastOptions = {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  style?: React.CSSProperties;
  className?: string;
  icon?: React.ReactNode;
  id?: string;
};

// Default options for all toasts
const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-center',
};

// Custom styling based on notification type
const getToastStyles = (type: 'success' | 'error' | 'info' | 'warning'): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    minWidth: '300px',
    maxWidth: '400px',
    direction: 'rtl' as 'rtl', // For Arabic UI - explicitly typed as 'rtl'
  };

  // Type-specific styles
  switch (type) {
    case 'success':
      return {
        ...baseStyle,
        background: '#10b981',
        color: 'white',
      };
    case 'error':
      return {
        ...baseStyle,
        background: '#ef4444',
        color: 'white',
      };
    case 'warning':
      return {
        ...baseStyle,
        background: '#f59e0b',
        color: 'white',
      };
    case 'info':
      return {
        ...baseStyle,
        background: '#3b82f6',
        color: 'white',
      };
    default:
      return baseStyle;
  }
};

/**
 * Show a success notification
 * @param message The message to display
 * @param options Additional toast options
 */
export const showSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
    style: getToastStyles('success'),
  });
};

/**
 * Show an error notification
 * @param message The message to display
 * @param options Additional toast options
 */
export const showError = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
    style: getToastStyles('error'),
  });
};

/**
 * Show an info notification
 * @param message The message to display
 * @param options Additional toast options
 */
export const showInfo = (message: string, options?: ToastOptions) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    style: getToastStyles('info'),
    icon: '💬',
  });
};

/**
 * Show a warning notification
 * @param message The message to display
 * @param options Additional toast options
 */
export const showWarning = (message: string, options?: ToastOptions) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    style: getToastStyles('warning'),
    icon: '⚠️',
  });
};

/**
 * Show a loading notification
 * @param message The message to display
 * @param options Additional toast options
 * @returns Toast ID that can be used to update or dismiss the toast
 */
export const showLoading = (message: string, options?: ToastOptions) => {
  return toast.loading(message, {
    ...defaultOptions,
    ...options,
    duration: Infinity, // Loading toasts should remain until explicitly dismissed
    style: {
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      background: '#f3f4f6',
      color: '#1f2937',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      direction: 'rtl' as 'rtl', // For Arabic UI
    } as React.CSSProperties,
  });
};

/**
 * Update an existing toast
 * @param toastId The ID of the toast to update
 * @param message The new message
 * @param type The new type of toast
 */
export const updateToast = (
  toastId: string, 
  message: string, 
  type: 'success' | 'error' | 'info' | 'warning'
) => {
  toast.dismiss(toastId);
  
  switch (type) {
    case 'success':
      return showSuccess(message);
    case 'error':
      return showError(message);
    case 'info':
      return showInfo(message);
    case 'warning':
      return showWarning(message);
  }
};

/**
 * Dismiss a specific toast
 * @param toastId The ID of the toast to dismiss
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Export main toast library for advanced use cases
export { toast };

// Default export as object with all methods
const notifications = {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  loading: showLoading,
  update: updateToast,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
  toast,
};

export default notifications;
