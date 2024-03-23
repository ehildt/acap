import { ExtendedCSSProperties, RotateProps } from './Rotate.modal';
import style from './Rotate.module.scss';

export function Rotate(props: RotateProps) {
  const extendedStyle: ExtendedCSSProperties = {
    '--animation-rotate-speedMS': props.ms ? `${props.ms}ms` : undefined,
    '--animation-rotate-speedMS2': props.ms2 ? `${props.ms2}ms` : undefined,
    '--animation-rotateX': props.x,
    '--animation-rotateY': props.y,
    '--animation-rotateZ': props.z,
    '--animation-rotateX2': props.x2,
    '--animation-rotateY2': props.y2,
    '--animation-rotateZ2': props.z2,
  };
  return (
    <div className={style.rotate} style={props.style}>
      <div className={style.rotateContent} style={extendedStyle}>
        {props.children}
      </div>
    </div>
  );
}
