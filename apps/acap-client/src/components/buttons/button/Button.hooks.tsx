import cn from 'classnames';

import { ButtonProps, ProxyFunc } from './Button.modal';

export function useButtonTextContent(props: ButtonProps) {
  const buttonTextCn = useButtonTextCn(props);
  const buttonText = props.text ?? null;
  if (!buttonText) return buttonText;
  if (!props.valueProxy) return <span className={buttonTextCn}>{buttonText}</span>;
  return <span className={buttonTextCn}>{props.valueProxy(buttonText)}</span>;
}

export function useIconBefore(props: ButtonProps) {
  if (props.iconBefore) return <span className={useButtonIconBeforeCn(props)}>{props.iconBefore}</span>;
}

export function useIconAfter(props: ButtonProps) {
  if (props.iconAfter) return <span className={useButtonIconAfterCn(props)}>{props.iconAfter}</span>;
}

export function useButtonCn(props: ButtonProps) {
  return cn(['button', `button--${props.bgColor}`]);
}

function useButtonTextCn(props: ButtonProps) {
  return cn(['button__text', `button__text--${props.color}`]);
}

function useButtonIconBeforeCn(props: ButtonProps) {
  return cn([{ button__iconBefore: props.iconBefore }, { 'button__iconBefore--margin-right': props.text }]);
}

function useButtonIconAfterCn(props: ButtonProps) {
  return cn([{ button__iconAfter: props.iconAfter }, { 'button__iconAfter--margin-left': props.text }]);
}

export function useMouseEventProxy(callback?: ProxyFunc) {
  return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    callback?.(e.target as HTMLElement, e);
  };
}
