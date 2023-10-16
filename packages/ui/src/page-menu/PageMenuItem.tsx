import './PageMenuItem.scss';

import cn from 'classnames';
import { useRef, useState } from 'react';

import { useMouseMove } from './PageMenu.hooks';
import { PageMouseItemProps } from './PageMenuItem.model';
import style from './PageMenuItem.module.scss';

export function PageMenuItem(props: PageMouseItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [isActive, setActive] = useState<boolean>(false);

  return (
    <li
      ref={ref}
      style={props.style}
      className={cn([style.menuItem, { [style.menuItemActive]: isActive }])}
      onClick={() => props.onClick?.()}
      onMouseEnter={() => {
        setActive(() => true);
        props.onMouseEnter?.();
      }}
      onMouseLeave={() => {
        setActive(() => false);
        props.onMouseLeave?.();
      }}
      onMouseMove={(e) => {
        useMouseMove(ref, e);
      }}
    >
      <div className={style.menuItemContent}>{props.children}</div>
    </li>
  );
}
