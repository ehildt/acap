import { CSSProperties, ReactNode } from 'react';

export type PageMouseItemProps = {
  style?: CSSProperties;
  children?: ReactNode;
  onMouseEnter?: any;
  onMouseLeave?: any;
};
