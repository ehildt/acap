import cn from 'classnames';
import { useState } from 'react';

import { RowProps } from './YmlViewer.model';
import { YmlViewerRow } from './YmlViewerRow';
import style from './YmlViewerRow.module.scss';

export function YmlRowObject(props: RowProps) {
  const [highlight, setHighlight] = useState(false);
  const keys = Object.keys(props.kvPair.value);

  const ymlViewRows = keys.map((innerKey, index) => (
    <YmlViewerRow
      key={`${innerKey?.toString()}_${index}`}
      kvPair={{ key: innerKey.toString(), value: props.kvPair.value[innerKey] }}
      separate={true}
    />
  ));

  return (
    <div
      className={cn([props.className, { [style.ymlViewerRowHoveredRed]: highlight }])}
      key={props.kvPair.key}
      onMouseEnter={() => setHighlight(true)}
      onMouseLeave={() => setHighlight(false)}
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(JSON.stringify(props.kvPair, null, 4));
      }}
    >
      {props.kvPair.key && <span style={highlight ? { color: 'red' } : {}}>{props.kvPair.key}</span>}
      {props.kvPair.key && <span>:</span>}
      {ymlViewRows}
    </div>
  );
}
