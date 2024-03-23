import { CSSProperties, ReactElement, ReactNode } from 'react';

export type ProxyFunc = (target: HTMLElement, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

export type ExtendedCSSProperties = {
  '--clr-button'?: string;
  '--clr-button-hover'?: string;
  '--clr-button-background'?: string;
  '--clr-button-background-hover'?: string;
  '--clr-button-border'?: string;
  '--clr-button-border-hover'?: string;
} & CSSProperties;

export type ButtonProps = {
  onClick?: ProxyFunc;
  children?: ReactNode;
  iconAfter?: ReactElement;
  iconBefore?: ReactElement;
  hoverColor?: string;
  borderHoverColor?: string;
  backgroundHoverColor?: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  style?: CSSProperties;
  disabled?: boolean;
};
