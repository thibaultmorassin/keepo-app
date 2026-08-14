import * as React from 'react';

/**
 * Small status pill. The status word IS the colour system.
 * @startingPoint section="Core" subtitle="Status pills: covered, expiring, expired, claim, Pro" viewport="700x160"
 */
export interface BadgeProps {
  children: React.ReactNode;
  status?: 'covered' | 'expiring' | 'expired' | 'claim' | 'pro' | 'inverse';
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
