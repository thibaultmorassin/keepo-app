import * as React from 'react';

/** Round 42px (or 34px) icon-only control: back, more, close. */
export interface IconButtonProps {
  children: React.ReactNode;
  /** Required — icon-only controls always need an accessible name. */
  label: string;
  variant?: 'surface' | 'ghost' | 'brand' | 'inverse';
  size?: 'sm' | 'md';
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
