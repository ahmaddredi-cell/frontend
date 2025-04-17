// Type definitions for react-hot-toast
declare module 'react-hot-toast' {
  import { ReactNode } from 'react';

  export type ToasterPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

  export interface ToastOptions {
    id?: string;
    icon?: ReactNode;
    duration?: number;
    position?: ToasterPosition;
    style?: React.CSSProperties;
    className?: string;
    ariaProps?: {
      role: string;
      'aria-live': 'assertive' | 'off' | 'polite';
    };
  }

  export interface Toast {
    id: string;
    type: string;
    message: string | ReactNode;
    icon?: ReactNode;
    duration?: number;
    position?: ToasterPosition;
    style?: React.CSSProperties;
    className?: string;
    createdAt: number;
    visible: boolean;
    height?: number;
  }

  export interface ToasterProps {
    position?: ToasterPosition;
    toastOptions?: ToastOptions;
    reverseOrder?: boolean;
    gutter?: number;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
    children?: (toast: Toast) => ReactNode;
  }

  // Toast component
  export const Toaster: React.FC<ToasterProps>;

  // Main toast functions
  export function toast(message: string | ReactNode, options?: ToastOptions): string;
  export function toast(
    message: string | ReactNode,
    options?: ToastOptions & { id: string }
  ): void;

  // Variant functions
  export namespace toast {
    function success(message: string | ReactNode, options?: ToastOptions): string;
    function error(message: string | ReactNode, options?: ToastOptions): string;
    function loading(message: string | ReactNode, options?: ToastOptions): string;
    function custom(message: string | ReactNode, options?: ToastOptions): string;
    function dismiss(toastId?: string): void;
    function remove(toastId?: string): void;
    function promise<T>(
      promise: Promise<T>,
      msgs: {
        loading: string | ReactNode;
        success: string | ReactNode | ((data: T) => string | ReactNode);
        error: string | ReactNode | ((err: any) => string | ReactNode);
      },
      opts?: ToastOptions
    ): Promise<T>;
  }

  // Default export
  export default toast;
}
