import { ExtendedCSSProperties, SkewProps } from './Skew.modal';
import style from './Skew.module.scss';

export function Skew(props: SkewProps) {
  const extendedStyle: ExtendedCSSProperties = {
    '--animation-skew-speedMS': props.ms ? `${props.ms}ms` : undefined,
    '--animation-skew-speedMS2': props.ms2 ? `${props.ms2}ms` : undefined,
    '--animation-skewX': props.x,
    '--animation-skewY': props.y,
    '--animation-skewX2': props.x2,
    '--animation-skewY2': props.y2,
  };

  console.log(extendedStyle);

  return (
    <div className={style.skew} style={props.style}>
      <div className={style.skewContent} style={extendedStyle}>
        {props.children}
      </div>
    </div>
  );
}
