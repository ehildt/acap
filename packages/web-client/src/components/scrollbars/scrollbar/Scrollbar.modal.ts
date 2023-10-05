import { CSSProperties, ReactNode } from 'react';

type ScrollStickY = 'top' | 'bottom';
type ScrollStickX = 'left' | 'right';
type ScrollOverflow = 'x' | 'y' | 'auto' | 'hidden';
type ScrollBehavior = 'smooth' | 'auto';
type ScrollDirection = 'ltr' | 'rtl';

export type ProxyFunc = (item: HTMLElement, scrollbar: HTMLDivElement) => void;

export type ScrollbarProps = {
  children?: ReactNode;
  stickY?: ScrollStickY;
  stickX?: ScrollStickX;
  overflow?: ScrollOverflow;
  direction?: ScrollDirection;
  behavior?: ScrollBehavior;
  style?: CSSProperties;
  onClick?: ProxyFunc;
  onMouseEnter?: ProxyFunc;
  onMouseLeave?: ProxyFunc;
  onContextMenu?: ProxyFunc;
};
