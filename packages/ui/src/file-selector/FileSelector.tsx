import './FileSelector.scss';

import { useRef } from 'react';
import { FaFileImport } from 'react-icons/fa';

import { Button, useFileImporterImmerStore } from '..';
import { useChangeEventProxy } from './FileSelector.hooks';
import { FileSelectorProps } from './FileSelector.modal';

export function FileSelector(props: FileSelectorProps) {
  const inputRef = useRef<any>(null);
  const fileSlice = useFileImporterImmerStore();

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <div className="file-selector" onClick={() => inputRef.current?.click()}>
        <FaFileImport size={'2rem'} />
        <label htmlFor={props.label}>{props.label}</label>
        <input
          type="file"
          ref={inputRef}
          name={props.label}
          style={{ display: 'none' }}
          accept={props.accept}
          onChange={useChangeEventProxy(props.onChange)}
          multiple
        />
      </div>
      <div className="file-menu">
        <Button onClick={fileSlice.setToggleTreeView} text="tree-view" />
      </div>
    </div>
  );
}

FileSelector.defaultProps = {
  label: 'Select File(s)',
  accept: '*/*',
} satisfies FileSelectorProps;
