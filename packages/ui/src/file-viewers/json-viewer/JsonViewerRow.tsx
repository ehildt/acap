import { JsonRowArray } from './JsonRowArray';
import { JsonRowItem } from './JsonRowItem';
import { JsonRowObject } from './JsonRowObject';
import { RowProps } from './JsonViewer.model';
import style from './JsonViewerRow.module.scss';

export function JsonViewerRow(props: RowProps) {
  const item = props.kvPair.value;
  if (item === null) return <JsonRowItem {...props} className={style.jsonViewerRowNull} />;
  if (Array.isArray(item)) return <JsonRowArray {...props} className={style.jsonViewerRowArray} />;
  if (typeof item === 'object') return <JsonRowObject {...props} className={style.jsonViewerRowObject} />;
  if (typeof item === 'string') return <JsonRowItem {...props} className={style.jsonViewerRowString} />;
  if (typeof item === 'number') return <JsonRowItem {...props} className={style.jsonViewerRowNumber} />;
  if (typeof item === 'boolean') return <JsonRowItem {...props} className={style.jsonViewerRowBoolean} />;
  return null;
}
