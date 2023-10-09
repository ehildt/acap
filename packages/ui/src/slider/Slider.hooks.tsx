import { ChangeEvent, WheelEvent } from 'react';

import { ProxyOnChange, ProxyOnWheel } from './Slider.modal';

export function useChangeEventProxy(callback?: ProxyOnChange) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    callback?.(e.target as HTMLInputElement, e);
  };
}

export function useWheelEventProxy(ref: any, callback?: ProxyOnWheel) {
  return (e: WheelEvent<HTMLElement>) => {
    if (!ref.current) return;
    if (e.deltaY < 0) ref.current.value = (parseFloat(ref.current.value) + 0.1).toString();
    else ref.current.value = (parseFloat(ref.current.value) - 0.1).toString();
    callback?.(ref.current as HTMLInputElement, e);
  };
}
