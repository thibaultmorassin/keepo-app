import * as React from "react";

/**
 * The surface primitive. Everything on a Keepo screen sits in one.
 * @startingPoint section="Core" subtitle="Surfaces: plain, sunken, brand, tint, inverse" viewport="700x260"
 */
export interface CardProps {
  children: React.ReactNode;
  tone?: "plain" | "sunken" | "brand" | "tint" | "inverse" | "outline";
  /** hero = 28px radius + roomier padding, for the top-of-screen summary. */
  size?: "card" | "hero";
  pad?: number | string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
