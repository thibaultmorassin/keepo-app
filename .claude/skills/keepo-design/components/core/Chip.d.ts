import * as React from 'react';

/** Toggleable filter and selection chip used in filter rows and category pickers. */
export interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  /** brand = green when selected; neutral = ink (used for the list filter row). */
  tone?: 'brand' | 'neutral';
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;
