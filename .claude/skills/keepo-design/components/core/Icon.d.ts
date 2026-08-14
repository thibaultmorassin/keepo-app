import * as React from "react";

/**
 * Renders one Lucide glyph. Keepo does not ship its own icon set —
 * Lucide at 2.25 stroke is the house style. See readme.md > Iconography.
 */
export interface IconProps {
  /** Lucide icon name, kebab-case: "shield-check", "scan-line", "receipt". */
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
