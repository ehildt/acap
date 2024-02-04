import { RowProps } from './YmlViewer.model';

export function YmlRowItem(props: RowProps) {
  return (
    <div className={props.className} key={props.kvPair.key}>
      <span>{props.kvPair.key}</span>
      {props.separate && <span>:</span>}
      <span>{props.kvPair.value?.toString() ?? 'null'}</span>
    </div>
  );
}
