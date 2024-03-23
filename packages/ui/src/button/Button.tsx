import { useMouseEventProxy } from './Button.hooks';
import { ButtonProps, ExtendedCSSProperties } from './Button.modal';
import style from './Button.module.scss';

// wip on scss
// support colors textContent and bgColor
// support button style and textContent style
export function Button(props: ButtonProps) {
  const iconBefore = props?.iconBefore;
  const iconAfter = props?.iconAfter;
  const onClick = useMouseEventProxy(props.onClick);

  const extendedStyle: ExtendedCSSProperties = {
    '--clr-button-hover': props.hoverColor,
    '--clr-button': props.color,
    '--clr-button-border': props.borderColor,
    '--clr-button-border-hover': props.borderHoverColor,
    '--clr-button-background': props.backgroundColor,
    '--clr-button-background-hover': props.backgroundHoverColor,
  };

  return (
    <button
      type="button"
      className={style.button}
      style={{ ...props.style, ...extendedStyle }}
      onClick={onClick}
      disabled={props.disabled}
    >
      {iconBefore}
      {props.children}
      {iconAfter}
    </button>
  );
}

Button.defaultProps = {} satisfies ButtonProps;
