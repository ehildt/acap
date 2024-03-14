import cn from 'classnames';

import { useFileImporterImmerStore } from '@/file-importer/FileImporter.store';

import style from './YmlRowItem.module.scss';
import { RowProps } from './YmlViewer.model';

export function YmlRowItem(props: RowProps) {
  const str = useFileImporterImmerStore();
  console.log(props.kvPair.key);
  return (
    <div className={props.className} key={props.kvPair.key}>
      <span>{props.kvPair.key}</span>
      {props.separate && <span>:</span>}
      <span className={cn({ [style.blurText]: !str.toggleLeafNodeValues })}>
        {props.kvPair.value?.toString() ?? 'null'}
      </span>
    </div>
  );
}
