import cn from 'classnames';
import { useState } from 'react';

import { RowProps } from './YmlViewer.model';
import { YmlViewerRow } from './YmlViewerRow';
import style from './YmlViewerRow.module.scss';

export function YmlRowArray(props: RowProps) {
  const [highlight, setHighlight] = useState(false);

  const ymlViewerRows = props.kvPair.value.map((item: any, index: number) => (
    <YmlViewerRow key={`${index.toString()}_${index}`} kvPair={{ key: '-', value: item }} />
  ));

  return (
    <div
      className={cn([props.className, { [style.ymlViewerRowHoveredPurple]: highlight }])}
      key={props.kvPair.key}
      onMouseEnter={() => setHighlight(true)}
      onMouseLeave={() => setHighlight(false)}
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(JSON.stringify(props.kvPair, null, 4));
      }}
    >
      {props.kvPair.key && <span style={highlight ? { color: 'magenta' } : {}}>{props.kvPair.key}</span>}
      {props.separate && <span>:</span>}
      {ymlViewerRows}
    </div>
  );
}
