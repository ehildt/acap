import { CSSProperties, ReactNode } from 'react';

export type PageMouseItemProps = {
  style?: CSSProperties;
  children?: ReactNode;
  onClick?: any;
  onMouseEnter?: any;
  onMouseLeave?: any;
};
