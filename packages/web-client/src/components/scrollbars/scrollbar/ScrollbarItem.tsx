import { CSSProperties, ReactNode } from 'react';

type ScrollbarItem = {
  style?: CSSProperties;
  children?: ReactNode;
};

export function ScrollbarItem(props: ScrollbarItem) {
  return (
    <div style={props.style} className="scrollbar__item">
      {props.children}
    </div>
  );
}
