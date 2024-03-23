import cn from 'classnames';

import { ButtonProps, ProxyFunc } from './Button.modal';
import style from './Button.module.scss';

export function useIconBefore(props: ButtonProps) {
  if (props.iconBefore) return <span className={useButtonIconBeforeCn(props)}>{props.iconBefore}</span>;
}

export function useIconAfter(props: ButtonProps) {
  if (props.iconAfter) return <span className={useButtonIconAfterCn(props)}>{props.iconAfter}</span>;
}

function useButtonIconBeforeCn(props: ButtonProps) {
  return cn([{ [style.buttonIconBefore]: props.iconBefore }, { [style.buttonIconBeforeMarginRight]: props.children }]);
}

function useButtonIconAfterCn(props: ButtonProps) {
  return cn([{ [style.buttonIconAfter]: props.iconAfter }, { [style.buttonIconBeforeMarginLeft]: props.children }]);
}

export function useMouseEventProxy(callback?: ProxyFunc) {
  return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    callback?.(e.target as HTMLElement, e);
  };
}
