import * as React from 'react';

/** First-run / filtered-to-nothing state. Always offers the next action. */
export interface EmptyStateProps {
  title: string;
  body?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
