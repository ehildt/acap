import cn from 'classnames';

import { useFileImporterImmerStore } from '@/file-importer/FileImporter.store';

import style from './JsonRowItem.module.scss';
import { RowProps } from './JsonViewer.model';

export function JsonRowItem(props: RowProps) {
  const str = useFileImporterImmerStore();
  return (
    <div className={props.className} key={props.kvPair.key}>
      <span>{props.kvPair.key}</span>
      <span>:</span>
      <span className={cn({ [style.blurText]: !str.toggleLeafNodeValues })}>
        {props.kvPair.value?.toString() ?? 'null'}
      </span>
      {props.separate && ','}
    </div>
  );
}
