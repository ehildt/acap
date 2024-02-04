import cn from 'classnames';
import { useState } from 'react';

import { RowProps } from './JsonViewer.model';
import { JsonViewerRow } from './JsonViewerRow';
import style from './JsonViewerRow.module.scss';

export function JsonRowObject(props: RowProps) {
  const [highlight, setHighlight] = useState(false);
  const keys = Object.keys(props.kvPair.value);

  const jsonViewRows = keys.map((innerKey, index) => (
    <JsonViewerRow
      separate={keys?.length - 1 > index}
      key={`${innerKey?.toString()}_${index}`}
      kvPair={{ key: innerKey.toString(), value: props.kvPair.value[innerKey] }}
    />
  ));

  return (
    <div
      className={cn([props.className, { [style.jsonViewerRowHoveredRed]: highlight }])}
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
      <span style={highlight ? { color: 'red' } : {}}>{'{'}</span>
      {jsonViewRows}
      <span style={highlight ? { color: 'red' } : {}}>{'}'}</span>
      {props.separate && ','}
    </div>
  );
}
