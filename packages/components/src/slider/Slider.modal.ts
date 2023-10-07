import { ChangeEvent, WheelEvent } from 'react';

export type ProxyOnChange = (target: HTMLInputElement, e: ChangeEvent<HTMLInputElement>) => void;
export type ProxyOnWheel = (target: HTMLInputElement, e: WheelEvent<HTMLElement>) => void;

export type SliderProps = {
  label: string;
  min?: string;
  step?: string;
  max?: string;
  defaultValue?: string;
  onChange?: ProxyOnChange;
  onWheel?: ProxyOnWheel;
};
