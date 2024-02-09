import { CSSProperties, ReactNode } from 'react';

import style from './Container.module.scss';

type ContainerProps = {
  children: ReactNode;
  styleContainer?: CSSProperties;
  styleContent?: CSSProperties;
};

export function Container(props: ContainerProps) {
  return (
    <div className={style.container} style={props.styleContainer}>
      <div className={style.containerContent} style={props.styleContent}>
        {props.children}
      </div>
    </div>
  );
}
