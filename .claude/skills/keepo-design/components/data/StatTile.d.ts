import * as React from 'react';

/** Small number + label tile; three across inside the brand hero card. */
export interface StatTileProps {
  value: React.ReactNode;
  label: string;
  tone?: 'onBrand' | 'plain' | 'covered' | 'expiring' | 'expired';
  style?: React.CSSProperties;
}
export declare function StatTile(props: StatTileProps): JSX.Element;
