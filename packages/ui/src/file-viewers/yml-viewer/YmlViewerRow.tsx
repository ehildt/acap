import { YmlRowArray } from './YmlRowArray';
import { YmlRowItem } from './YmlRowItem';
import { YmlRowObject } from './YmlRowObject';
import { RowProps } from './YmlViewer.model';
import style from './YmlViewerRow.module.scss';

export function YmlViewerRow(props: RowProps) {
  const item = props.kvPair.value;
  if (item === null) return <YmlRowItem {...props} className={style.ymlViewerRowNull} />;
  if (typeof item === 'string') return <YmlRowItem {...props} className={style.ymlViewerRowString} />;
  if (typeof item === 'number') return <YmlRowItem {...props} className={style.ymlViewerRowNumber} />;
  if (typeof item === 'boolean') return <YmlRowItem {...props} className={style.ymlViewerRowBoolean} />;
  if (Array.isArray(item)) return <YmlRowArray {...props} className={style.ymlViewerRowArray} />;
  if (typeof item === 'object') return <YmlRowObject {...props} className={style.ymlViewerRowObject} />;
}
