import { CSSProperties, ReactNode } from 'react';

export type ExtendedCSSProperties = {
  '--animation-skew-speedMS'?: string;
  '--animation-skew-speedMS2'?: string;
  '--animation-skewX'?: string;
  '--animation-skewY'?: string;
  '--animation-skewX2'?: string;
  '--animation-skewY2'?: string;
} & CSSProperties;

export type SkewProps = {
  children: ReactNode;
  style?: CSSProperties;
  ms?: number;
  ms2?: number;
  x?: string;
  y?: string;
  x2?: string;
  y2?: string;
};
