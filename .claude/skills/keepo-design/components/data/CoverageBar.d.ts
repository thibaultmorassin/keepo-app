import * as React from 'react';

/**
 * Warranty elapsed-time bar with headline and purchase→expiry endpoints.
 * @startingPoint section="Data" subtitle="Coverage timeline bar" viewport="700x200"
 */
export interface CoverageBarProps {
  /** Percent of the warranty period ELAPSED (96 = almost over). */
  pct: number;
  status?: 'covered' | 'expiring' | 'expired';
  headline?: string;
  note?: string;
  from?: string;
  to?: string;
  style?: React.CSSProperties;
}
export declare function CoverageBar(props: CoverageBarProps): JSX.Element;
