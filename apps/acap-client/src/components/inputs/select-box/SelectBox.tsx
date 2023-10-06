import cn from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';

import { SelectedBoxProps } from './SelectBox.model';
import style from './SelectBox.module.scss';
import { SelectBoxInput } from './SelectBoxInput';

const CUSTOM_INPUT_SYMBOLS = '🍀ヅ💕';

export function SelectBox(props: SelectedBoxProps) {
  const defaultItem = props.items.at(props.defaultIndex);
  const [name, setName] = useState<string>(defaultItem!.name);
  const [value, setValue] = useState<string | number>(defaultItem!.value);
  const [selectable, setSelectable] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const ref = useRef<HTMLUListElement>(null);
  const refSpan = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current?.offsetWidth) setWidth(() => ref.current!.offsetWidth);
    if (refSpan.current?.offsetHeight) setHeight(() => refSpan.current!.offsetHeight);
  }, [ref.current, refSpan.current]);

  const elements = useMemo(() => {
    const fragments = props.items.map((item, index) => (
      <li
        className={cn({ [style.selected]: item.name === name }, { [style.disabled]: item.name === name })}
        data-value={item.value}
        data-name={item.name}
        key={`select-box-item_${index}`}
        onClick={(e: any) => {
          setValue(() => e.target.getAttribute('data-value'));
          setName(() => e.target.getAttribute('data-name'));
          props.onClick(e.target.getAttribute('data-value'));
        }}
      >
        {item.name}
      </li>
    ));

    if (props.customInput) {
      fragments.push(
        <li
          data-type="input"
          data-name={name}
          data-value={value}
          key={`select-box-item_${props.items.length + 1}`}
          className={cn({ [style.disabled]: name === CUSTOM_INPUT_SYMBOLS })}
        >
          <SelectBoxInput
            label="SUBMIT"
            placeholder={CUSTOM_INPUT_SYMBOLS}
            onClick={(value) => {
              setValue(() => value);
              setName(() => CUSTOM_INPUT_SYMBOLS);
              props.onClick(value);
            }}
          />
        </li>,
      );
    }

    return fragments;
  }, [props.items, value]);

  return (
    <div
      className={style.selectBox}
      onMouseOver={() => setSelectable(() => true)}
      onMouseLeave={() => setSelectable(() => false)}
    >
      <span ref={refSpan} style={{ width: `${width}px` }} className={cn({ [style.selected]: selectable })}>
        {name}
      </span>
      <ul
        ref={ref}
        style={{ marginTop: `${height}px` }}
        className={cn(style.selectBoxItems, { [style.selectBoxItemsSelectable]: selectable })}
      >
        {elements}
      </ul>
    </div>
  );
}

SelectBox.defaultProps = {
  defaultIndex: 0,
  customInput: false,
} as SelectedBoxProps;
