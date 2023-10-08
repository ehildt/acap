import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { SelectBoxInputProps } from './SelectBoxInput.model';
import style from './SelectBoxInput.module.scss';

export function SelectBoxInput(props: SelectBoxInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [shake, setShake] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current?.offsetWidth) setWidth(() => ref.current!.offsetWidth);
  }, [ref.current, refInput.current]);

  return (
    <div
      className={cn(style.selectBoxInput, { [style.doShake]: shake })}
      onMouseEnter={() => {
        refInput.current?.focus();
      }}
      onMouseLeave={() => {
        refInput.current?.blur();
        refInput.current!.value = '';
      }}
    >
      <input
        ref={refInput}
        style={{ width }}
        type="text"
        placeholder={props.placeholder}
        onChange={(e) => {
          if (e.target.value?.length && !parseInt(e.target.value, 10)) {
            setShake(() => true);
            setTimeout(() => setShake(() => false), 500);
            e.target.value = '';
          }
        }}
      />
      <input
        ref={ref}
        type="button"
        value={props.label}
        onClick={() => {
          if (!refInput.current?.value) {
            setShake(() => true);
            setTimeout(() => setShake(() => false), 500);
            refInput.current?.focus();
          } else {
            props.onClick(refInput.current.value);
            refInput.current.value = '';
            refInput.current?.focus();
          }
        }}
      />
    </div>
  );
}

SelectBoxInput.defaultProps = {
  label: 'take',
} as SelectBoxInputProps;
