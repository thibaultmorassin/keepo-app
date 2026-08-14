import * as React from 'react';

/** 2–4 exclusive short options in one sunken track. */
export interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
