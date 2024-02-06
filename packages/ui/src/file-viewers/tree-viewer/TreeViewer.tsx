import { useDimensionsWithStyle } from 'libs';
import { CSSProperties, forwardRef, MutableRefObject } from 'react';
import { Tree } from 'react-d3-tree';

import { Container } from '@/container/Container';

import { useMapKeyValueToTreeData } from './TreeViewer.hooks';
import style from './TreeViewer.module.scss';

type TreeViewerProps = {
  object: any;
  style: CSSProperties;
  ref?: MutableRefObject<null>;
};

export const TreeViewer = forwardRef(function TreeViewer(props: TreeViewerProps, ref?: any) {
  const data = useMapKeyValueToTreeData(props.object);
  const { height } = useDimensionsWithStyle(props, ref);
  return (
    <Container style={{ height, width: 'auto' }}>
      <Tree
        data={data}
        translate={{ y: parseInt(height, 10) / 2, x: 50 }}
        initialDepth={1}
        svgClassName={style.svgTree}
        branchNodeClassName={style.branchNode}
        leafNodeClassName={style.leafNode}
        rootNodeClassName={style.rootNode}
      />
    </Container>
  );
});
