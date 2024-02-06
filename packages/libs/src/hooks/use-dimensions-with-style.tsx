import { CSSProperties, RefObject } from 'react';

import { useDimensions } from './use-dimensions';

type DimensionsProps = {
  style?: CSSProperties;
};

export function useDimensionsWithStyle(props: DimensionsProps, parentRef?: RefObject<HTMLElement | null>) {
  let clientHeight;
  let clientWidth;

  if (!props.style?.width || !props.style?.height) {
    const dimensions = useDimensions(parentRef);
    clientHeight = dimensions.height;
    clientWidth = dimensions.width;
  }

  const width = props.style?.width ?? clientWidth ?? '100%';
  const height = props.style?.height ?? clientHeight ?? '100%';

  return {
    ...props.style,
    width: typeof width === 'string' ? width : `${width}px`,
    height: typeof height === 'string' ? height : `${height}px`,
  };
}
