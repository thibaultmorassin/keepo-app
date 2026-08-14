import * as React from 'react';

/**
 * A stored receipt or manual, with a paper-sliver thumbnail.
 * @startingPoint section="Data" subtitle="Receipt / document rows" viewport="700x200"
 */
export interface DocumentRowProps {
  name: string;
  /** "PDF · 214 Ko · ajouté le 4 sept. 2024" */
  meta: string;
  tone?: 'plain' | 'tint';
  action?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function DocumentRow(props: DocumentRowProps): JSX.Element;
