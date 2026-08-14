import * as React from 'react';

/** Progress ticks for the 3-step claim flow. */
export interface StepBarProps {
  total?: number;
  current?: number;
  style?: React.CSSProperties;
}
export declare function StepBar(props: StepBarProps): JSX.Element;
