import { CSSProperties, ReactNode } from 'react';

import style from './Container.module.scss';

type ContainerProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export function Container(props: ContainerProps) {
  return (
    <div className={style.container}>
      <div className={style.containerContent} style={props.style}>
        {props.children}
      </div>
    </div>
  );
}
