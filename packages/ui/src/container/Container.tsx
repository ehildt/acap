import { CSSProperties, ReactNode } from 'react';

import style from './Container.module.scss';

type ContainerProps = {
  children: ReactNode;
  outerStyle?: CSSProperties;
  innerStyle?: CSSProperties;
};

export function Container(props: ContainerProps) {
  return (
    <div className={style.container} style={props.outerStyle}>
      <div className={style.containerContent} style={props.innerStyle}>
        {props.children}
      </div>
    </div>
  );
}
