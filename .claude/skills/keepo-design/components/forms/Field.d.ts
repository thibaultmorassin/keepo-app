import * as React from 'react';

/**
 * Labelled text input. Label is the uppercase micro style, always visible.
 * @startingPoint section="Forms" subtitle="Text, multiline and suffixed inputs" viewport="700x300"
 */
export interface FieldProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  /** Trailing unit rendered in mono — "€", "ans". */
  suffix?: string;
  style?: React.CSSProperties;
}
export declare function Field(props: FieldProps): JSX.Element;
