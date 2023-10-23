import { ReactNode } from 'react';

import style from './PageMenu.module.scss';

type PageMenuProps = {
  children?: ReactNode;
};

export function PageMenu(props: PageMenuProps) {
  return <ul className={style.menu}>{props.children}</ul>;
}
