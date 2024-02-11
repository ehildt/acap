import { useEffect, useRef, useState } from 'react';
import { CustomNodeElementProps, Tree } from 'react-d3-tree';

import { useMapKeyValueToTreeData } from './TreeViewer.hooks';
import { TreeViewerProps } from './TreeViewer.modal';
import style from './TreeViewer.module.scss';
import { TreeViewerNode } from './TreeViewerNode';

export function TreeViewer(props: TreeViewerProps) {
  const data = useMapKeyValueToTreeData(props.data);
  const ref = useRef<any>(null);
  const [width, setWidth] = useState(1);

  useEffect(() => {
    if (ref?.current) setWidth(() => ref?.current?.clientWidth);
  }, [ref.current]);

  return (
    <div className={style.treeViewer} ref={ref}>
      <div className={style.treeViewerContent}>
        <Tree
          onNodeClick={({ data }: any) => navigator.clipboard.writeText(JSON.stringify(data, null, 4))}
          data={data}
          orientation="vertical"
          initialDepth={1}
          translate={{ x: width / 2, y: 150 }}
          svgClassName={style.svgTree}
          shouldCollapseNeighborNodes
          pathClassFunc={(i) => (i.target.children ? style.svgBranchPath : style.svgLeafPath)}
          renderCustomNodeElement={(props: CustomNodeElementProps) => <TreeViewerNode {...props} />}
        />
      </div>
    </div>
  );
}
