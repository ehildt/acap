import { RowProps } from './JsonViewer.model';

export function JsonRowItem(props: RowProps) {
  return (
    <div className={props.className} key={props.kvPair.key}>
      <span>{props.kvPair.key}</span>
      <span>:</span>
      <span>{props.kvPair.value?.toString() ?? 'null'}</span>
      {props.separate && ','}
    </div>
  );
}
