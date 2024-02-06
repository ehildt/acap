import { useDimensionsWithStyle } from 'libs';
import { forwardRef, useRef } from 'react';

import { useMouseEventProxy, useScrollbarCn, useScrollDirectionLtr, useScrollDirectionRtl } from './Scrollbar.hooks';
import { ScrollbarProps } from './Scrollbar.modal';

/**
 * @param ref (`optional`) the RefObject from which the width & height will be derived.
 * if ref is not provided, then the scrollbar will travers the DOM till it finds
 * a width & height. However if the width and height is defined in style, then the
 * width & height from ref has no effect. if style & ref are both undefined, then the
 * the width & height both take 100% in size.
 * @param props (`optional`) overflow defaults to hidden.
 * @return ReactNode
 */
export const Scrollbar = forwardRef(function Scrollbar(props: ScrollbarProps, ref?: any) {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  useScrollDirectionLtr(scrollbarRef, props);
  useScrollDirectionRtl(scrollbarRef, props);

  return (
    <div
      ref={scrollbarRef}
      className={useScrollbarCn(props)}
      style={useDimensionsWithStyle(props, ref ?? scrollbarRef)}
      onClick={useMouseEventProxy(scrollbarRef, props.onClick)}
      onMouseEnter={useMouseEventProxy(scrollbarRef, props.onMouseEnter)}
      onMouseLeave={useMouseEventProxy(scrollbarRef, props.onMouseLeave)}
      onContextMenu={useMouseEventProxy(scrollbarRef, props.onContextMenu)}
    >
      {props.children}
    </div>
  );
});

Scrollbar.defaultProps = {
  overflow: 'auto',
  direction: 'ltr',
  behavior: 'smooth',
} satisfies ScrollbarProps;
