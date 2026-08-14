import * as React from 'react';

/**
 * The one primary action on a screen. Pill, display type, spring press.
 * @startingPoint section="Core" subtitle="Pill actions in five intents" viewport="700x200"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** primary = the safe/covered action · claim = starting a warranty claim */
  variant?: 'primary' | 'secondary' | 'ghost' | 'claim' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
  /** Stretch to the container — how the sticky bottom CTA is built. */
  full?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
