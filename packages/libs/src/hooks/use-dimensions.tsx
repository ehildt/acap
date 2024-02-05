import { RefObject, useEffect, useState } from 'react';

export function useDimensions(parentRef?: RefObject<HTMLElement | null>) {
  const [width, setClientWidth] = useState<number | undefined>();
  const [height, setClientHeight] = useState<number | undefined>();

  useEffect(() => {
    if (!parentRef?.current) return;
    let parentElement = parentRef.current.parentElement;
    let width = parentElement?.offsetWidth;
    let height = parentElement?.offsetHeight;

    while (width === 0 || height === 0) {
      if (!parentElement?.parentElement) break;
      parentElement = parentElement.parentElement;
      width = parentElement.offsetWidth;
      height = parentElement.offsetHeight;
    }

    setClientWidth(() => width);
    setClientHeight(() => height);
  }, [parentRef?.current]);

  return { width, height };
}
