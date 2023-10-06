import './Button.scss';

import { useButtonCn, useButtonTextContent, useIconAfter, useIconBefore, useMouseEventProxy } from './Button.hooks';
import { ButtonProps } from './Button.modal';

// wip on scss
// support colors textContent and bgColor
// support button style and textContent style
export function Button(props: ButtonProps) {
  const buttonCn = useButtonCn(props);
  const textContent = useButtonTextContent(props);
  const iconBefore = useIconBefore(props);
  const iconAfter = useIconAfter(props);
  const onClick = useMouseEventProxy(props.onClick);

  return (
    <button type="button" className={buttonCn} style={props.style} onClick={onClick} disabled={props.disabled}>
      {iconBefore}
      {textContent}
      {iconAfter}
    </button>
  );
}

Button.defaultProps = {
  color: 'black',
  bgColor: 'white',
} satisfies ButtonProps;
