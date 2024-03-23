import { CSSProperties, ReactNode } from 'react';

export type ExtendedCSSProperties = {
  '--animation-rotate-speedMS'?: string;
  '--animation-rotate-speedMS2'?: string;
  '--animation-rotateX'?: string;
  '--animation-rotateY'?: string;
  '--animation-rotateZ'?: string;
  '--animation-rotateX2'?: string;
  '--animation-rotateY2'?: string;
  '--animation-rotateZ2'?: string;
} & CSSProperties;

export type RotateProps = {
  children: ReactNode;
  style?: CSSProperties;
  ms?: number;
  ms2?: number;
  x?: string;
  y?: string;
  z?: string;
  x2?: string;
  y2?: string;
  z2?: string;
};
