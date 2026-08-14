import * as React from 'react';

/**
 * Full-width radio row — the claim flow's issue picker.
 * @startingPoint section="Forms" subtitle="Radio rows and toggles" viewport="700x280"
 */
export interface OptionRowProps {
  label: string;
  description?: string;
  selected?: boolean;
  onSelect?: () => void;
  style?: React.CSSProperties;
}
export declare function OptionRow(props: OptionRowProps): JSX.Element;
