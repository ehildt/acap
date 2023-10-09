import { CSSProperties, ReactElement } from 'react';

export type ProxyFunc = (target: HTMLElement, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

export type ButtonProps = {
  onClick?: ProxyFunc;
  color: string;
  bgColor: string;
  text?: string;
  valueProxy?: (value: string) => typeof value;
  iconAfter?: ReactElement;
  iconBefore?: ReactElement;
  style?: CSSProperties;
  styleText?: CSSProperties;
  disabled?: boolean;
};
