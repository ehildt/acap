import { useDimensionsWithStyle } from 'libs';
import { CSSProperties, forwardRef, MutableRefObject } from 'react';
import { Tree } from 'react-d3-tree';

import { Container } from '@/container/Container';

import { useMapKeyValueToTreeData } from './TreeViewer.hooks';
import style from './TreeViewer.module.scss';

type TreeViewerProps = {
  object: any;
  style?: CSSProperties;
  ref?: MutableRefObject<null>;
};

export const TreeViewer = forwardRef(function TreeViewer(props: TreeViewerProps, ref?: any) {
  const data = useMapKeyValueToTreeData(props.object);
  const { height, width } = useDimensionsWithStyle(props, ref);
  const renderColor = (props: any) => {
    if (props.attributes?.string) return style.leafNodeOrange;
    if (props.attributes?.number !== undefined) return style.leafNodeBlue;
    if (props.attributes?.boolean !== undefined) return style.leafNodeLime;
    if (props.attributes?.null) return style.leafNodeGray;
    if (Array.isArray(props.children)) return style.leafNodeArray;
    return null;
  };

  return (
    <Container styleContainer={{ height }} styleContent={{ height, width }}>
      <Tree
        ref={ref}
        onNodeClick={({ data }: any) => navigator.clipboard.writeText(JSON.stringify(data, null, 4))}
        data={data}
        orientation="vertical"
        translate={{ x: (ref?.current?.clientWidth ?? 1) / 2, y: 70 }}
        initialDepth={1}
        svgClassName={style.svgTree}
        renderCustomNodeElement={(props: any) => {
          return (
            <g>
              <circle
                className={`${renderColor(props.nodeDatum)} ${style.leafNodeHover}`}
                fill={props.nodeDatum.color}
                onClick={(e) => {
                  props.onNodeClick(e);
                  props.toggleNode(e);
                }}
                onMouseOut={props.OnNodeMouseOut}
                onMouseOver={props.OnNodeMouseOver}
                cx={0}
                cy={0}
              />
              <text className={style.leafNodeTextGold} x={0} y={-30} textAnchor="middle">
                {props.nodeDatum.name}
              </text>
              <text className={style.leafNodeTextGold} x={0} y={35} textAnchor="middle">
                {props.nodeDatum.attributes?.string}
                {props.nodeDatum.attributes?.number}
                {props.nodeDatum.attributes?.boolean?.toString()}
                {props.nodeDatum.attributes?.null}
              </text>
            </g>
          );
        }}
      />
    </Container>
  );
});
