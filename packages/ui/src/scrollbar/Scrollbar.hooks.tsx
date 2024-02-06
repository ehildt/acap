import cn from 'classnames';
import { RefObject, useCallback, useEffect } from 'react';

import { ProxyFunc, ScrollbarProps } from './Scrollbar.modal';
import style from './Scrollbar.module.scss';

export function useScrollbarCn(props: ScrollbarProps) {
  return cn([
    style.scrollbar,
    { [style.scrollbarLtr]: props.direction === 'ltr' },
    { [style.scrollbarRtl]: props.direction === 'rtl' },
    { [style.scrollbarOverflow]: props.overflow },
    { [style.scrollbarOverflowY]: props.overflow === 'y' },
    { [style.scrollbarOverflowX]: props.overflow === 'x' },
    { [style.scrollbarOverflowAuto]: props.overflow === 'auto' },
  ]);
}

export function useMouseEventProxy(ref: RefObject<HTMLDivElement>, callback?: ProxyFunc) {
  return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (ref.current && callback) callback(e.target as HTMLElement, ref.current);
  };
}

export function useScrollDirectionLtr(ref: RefObject<HTMLDivElement>, props: ScrollbarProps) {
  const scroll = useScroll(ref, props);
  useEffect(() => {
    if (!ref.current || props.direction === 'rtl') return;
    else if (props.stickY === 'top' && props.stickX === 'left') scroll.topLeft();
    else if (props.stickY === 'top' && props.stickX === 'right') scroll.topRight();
    else if (props.stickY === 'bottom' && props.stickX === 'left') scroll.bottomLeft();
    else if (props.stickY === 'bottom' && props.stickX === 'right') scroll.bottomRight();
    else if (props.stickY === 'bottom') scroll.bottom();
    else if (props.stickY === 'top') scroll.top();
    else if (props.stickX === 'left') scroll.left();
    else if (props.stickX === 'right') scroll.right();
  }, [props.children]);
}

export function useScrollDirectionRtl(ref: RefObject<HTMLDivElement>, props: ScrollbarProps) {
  const scroll = useScroll(ref, props);
  useEffect(() => {
    if (!ref.current || props.direction === 'ltr') return;
    else if (props.stickY === 'top' && props.stickX === 'left') scroll.topLeft();
    else if (props.stickY === 'top' && props.stickX === 'right') scroll.topRightRtl();
    else if (props.stickY === 'bottom' && props.stickX === 'left') scroll.bottomLeft();
    else if (props.stickY === 'bottom' && props.stickX === 'right') scroll.bottomRightRtl();
    else if (props.stickY === 'bottom') scroll.bottom();
    else if (props.stickY === 'top') scroll.top();
    else if (props.stickX === 'left') scroll.left();
    else if (props.stickX === 'right') scroll.rightRtl();
  }, [props.children]);
}

function useScroll(ref: RefObject<HTMLDivElement>, props: ScrollbarProps) {
  const bottom = useCallback(() => {
    ref.current?.scroll({
      top: ref.current.scrollHeight,
      left: ref.current.scrollLeft,
      behavior: props.behavior,
    });
  }, [ref.current, props.behavior]);

  const top = useCallback(() => {
    ref.current?.scroll({
      top: 0,
      left: ref.current.scrollLeft,
      behavior: props.behavior,
    });
  }, [ref.current, props.behavior]);

  const left = useCallback(() => {
    ref.current?.scroll({
      top: ref.current.scrollTop,
      left: 0,
      behavior: props.behavior,
    });
  }, [ref.current, props.behavior]);

  const right = useCallback(() => {
    ref.current?.scroll({
      top: ref.current.scrollTop,
      left: ref.current.scrollWidth,
      behavior: props.behavior,
    });
  }, [ref.current, props.behavior]);

  const rightRtl = useCallback(() => {
    ref.current?.scroll({
      top: ref.current.scrollTop,
      left: -ref.current.scrollWidth,
      behavior: props.behavior,
    });
  }, [ref.current, props.behavior]);

  const bottomRight = useCallback(() => {
    ref.current?.scroll({
      top: ref.current.scrollHeight,
      left: ref.current.scrollWidth,
      behavior: props.behavior,
    });
  }, [ref.current, props.behavior]);

  const bottomRightRtl = useCallback(() => {
    ref.current?.scroll({
      top: ref.current.scrollHeight,
      left: -ref.current.scrollWidth,
      behavior: props.behavior,
    });
  }, [ref.current, props.behavior]);

  const bottomLeft = useCallback(() => {
    ref.current?.scroll({
      top: ref.current.scrollHeight,
      left: 0,
      behavior: props.behavior,
    });
  }, [ref.current, props.behavior]);

  const topRight = useCallback(() => {
    ref.current?.scroll({
      top: 0,
      left: ref.current.scrollWidth,
      behavior: props.behavior,
    });
  }, [ref.current, props.behavior]);

  const topRightRtl = useCallback(() => {
    ref.current?.scroll({
      top: 0,
      left: -ref.current.scrollWidth,
      behavior: props.behavior,
    });
  }, [ref.current, props.behavior]);

  const topLeft = useCallback(() => {
    ref.current?.scroll({
      top: 0,
      left: 0,
      behavior: props.behavior,
    });
  }, [ref.current, props.behavior]);

  return {
    topRight,
    topRightRtl,
    topLeft,
    bottomRight,
    bottomRightRtl,
    bottomLeft,
    bottom,
    top,
    left,
    right,
    rightRtl,
  };
}
