import cn from 'classnames';
import { CSSProperties, ReactNode, useRef, useState } from 'react';

import { useMouseMove } from './PageMenu.hooks';

type PageMouseItemProps = {
  style?: CSSProperties;
  children?: ReactNode;
  onMouseEnter?: any;
  onMouseLeave?: any;
};

export function PageMenuItem(props: PageMouseItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [isActive, setActive] = useState<boolean>(false);

  return (
    <li
      ref={ref}
      style={props.style}
      className={cn(['menu-item', { 'menu-item--active': isActive }])}
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
      <div className="menu-item-content">{props.children}</div>
    </li>
  );
}
