import cn from 'classnames';
import { useState } from 'react';

import { RowProps } from './JsonViewer.model';
import { JsonViewerRow } from './JsonViewerRow';
import style from './JsonViewerRow.module.scss';

export function JsonRowArray(props: RowProps) {
  const [highlight, setHighlight] = useState(false);
  const length = props.kvPair.value.length;

  const jsonViewerRows = props.kvPair.value.map((item: any, index: number) => (
    <JsonViewerRow
      key={`${index.toString()}_${index}`}
      kvPair={{ key: index.toString(), value: item }}
      separate={length - 1 > index}
    />
  ));

  return (
    <div
      className={cn([props.className, { [style.jsonViewerRowHoveredPurple]: highlight }])}
      key={props.kvPair.key}
      onMouseEnter={() => setHighlight(true)}
      onMouseLeave={() => setHighlight(false)}
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(JSON.stringify(props.kvPair, null, 4));
      }}
    >
      {props.kvPair.key && <span style={highlight ? { color: 'magenta' } : {}}>{props.kvPair.key}</span>}
      {props.kvPair.key && <span>:</span>}
      <span style={highlight ? { color: 'magenta' } : {}}>{'['}</span>
      {jsonViewerRows}
      <span style={highlight ? { color: 'magenta' } : {}}>{']'}</span>
      {props.separate && ','}
    </div>
  );
}
