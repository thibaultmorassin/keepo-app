import * as React from 'react';

/**
 * Transient confirmation pill, floated above the tab bar.
 * @startingPoint section="Feedback" subtitle="Toasts, step bar, empty state" viewport="700x320"
 */
export interface ToastProps {
  message: string;
  tone?: 'success' | 'neutral' | 'warning' | 'error';
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
