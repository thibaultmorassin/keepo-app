import * as React from 'react';

/**
 * One owned item in the list: icon tile, name, meta, remaining-time pill.
 * @startingPoint section="Data" subtitle="Item rows in all three warranty states" viewport="700x240"
 */
export interface ItemRowProps {
  name: string;
  /** "Darty Beaugrenelle · sept. 2024" — store then purchase month. */
  meta: string;
  status?: 'covered' | 'expiring' | 'expired';
  /** Short remaining time: "28 j", "7 mois", "Expirée". */
  remaining?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function ItemRow(props: ItemRowProps): JSX.Element;
