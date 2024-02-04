import { CSSProperties, forwardRef, MutableRefObject, RefObject, useEffect, useState } from 'react';
import { Tree } from 'react-d3-tree';

import { Container } from '@/container/Container';

import style from './TreeViewer.module.scss';

type TreeViewerProps = {
  object: any;
  style?: CSSProperties;
  ref?: MutableRefObject<null>;
};

function useParentDimensions(ref?: RefObject<HTMLElement | null>) {
  const [width, setClientWidth] = useState<number | undefined>();
  const [height, setClientHeight] = useState<number | undefined>();

  useEffect(() => {
    if (!ref?.current) return;
    let parentElement = ref.current.parentElement;
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
  }, [ref?.current]);

  return { width, height };
}

export function useParentDimensionsWithStyle(props: TreeViewerProps, parentRef?: RefObject<HTMLElement | null>) {
  let clientHeight;
  let clientWidth;

  if (!props.style?.width || !props.style?.height) {
    const dimensions = useParentDimensions(parentRef);
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

const mapKeyValueToTreeData = (value: any = {}, key: string | number = 'ROOT'): any => {
  if (value === null)
    return {
      name: key ?? 'null',
      attributes: {
        null: 'null',
      },
    };

  if (value === undefined)
    return {
      name: key ?? 'undefined',
      attributes: {
        null: 'undefined',
      },
    };

  if (typeof value === 'string')
    return {
      name: key,
      attributes: {
        string: value,
      },
    };

  if (typeof value === 'number')
    return {
      name: key,
      attributes: {
        number: value,
      },
    };

  if (typeof value === 'boolean')
    return {
      name: key,
      attributes: {
        boolean: value,
      },
    };

  if (Array.isArray(value))
    return {
      name: key,
      children: value.map((item, index) => mapKeyValueToTreeData(item, index)),
    };

  if (typeof value === 'object')
    return {
      name: key,
      children: Object.keys(value).map((key, index) => mapKeyValueToTreeData(value[key], key ?? index)),
    };
};

export const TreeViewer = forwardRef(function TreeViewer(props: TreeViewerProps, ref?: any) {
  const data = mapKeyValueToTreeData(props.object);
  const { height } = useParentDimensionsWithStyle(props, ref);
  return (
    <Container style={{ height, width: 'auto' }}>
      <Tree
        data={data}
        translate={{ y: parseInt(height, 10) / 2, x: 50 }}
        initialDepth={1}
        svgClassName={style.svgTree}
        branchNodeClassName={style.branchNode}
        leafNodeClassName={style.leafNode}
      />
    </Container>
  );
});
