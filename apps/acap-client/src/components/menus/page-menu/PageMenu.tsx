import './PageMenu.scss';

import { ReactNode } from 'react';

type PageMenuProps = {
  children?: ReactNode;
};

export function PageMenu(props: PageMenuProps) {
  return <ul className="menu">{props.children}</ul>;
}
