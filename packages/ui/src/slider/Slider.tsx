import { forwardRef, useRef } from 'react';

import { useChangeEventProxy, useWheelEventProxy } from './Slider.hooks';
import { SliderProps } from './Slider.modal';
import style from './Slider.module.scss';

export const Slider = forwardRef(function Slider(props: SliderProps, forwardedRef?: any) {
  const ref = forwardedRef ?? useRef<HTMLInputElement>(null);
  return (
    <div
      className={style.slider}
      onWheel={useWheelEventProxy(ref, props.onWheel)}
      onMouseEnter={() => {
        ref.current?.focus();
      }}
      onMouseLeave={() => {
        ref.current?.blur();
      }}
    >
      <input
        onChange={useChangeEventProxy(props.onChange)}
        ref={ref}
        type="range"
        min="0"
        step="0.1"
        max="5"
        defaultValue={props.defaultValue}
        className={style.sliderField}
        placeholder={props.label}
        name={`slider_${props.label}`}
      />

      <label htmlFor={`slider_${props.label}`} className={style.sliderLabel}>
        {props.label}
      </label>
    </div>
  );
});

Slider.defaultProps = {
  defaultValue: '1',
  max: '5',
  min: '0',
  step: '0.1',
} as Partial<SliderProps>;
