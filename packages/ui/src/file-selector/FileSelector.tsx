import './FileSelector.scss';

import { useRef } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { FaFileImport } from 'react-icons/fa6';

import { JsonViewerMenu } from '@/file-viewers/json-viewer/JsonViewerMenu';
import { PdfViewerMenu } from '@/file-viewers/pdf-viewer/PdfViewerMenu';

import { useFileImporterImmerStore } from '..';
import { useChangeEventProxy } from './FileSelector.hooks';
import { FileSelectorProps } from './FileSelector.modal';

export function FileSelector(props: FileSelectorProps) {
  const inputRef = useRef<any>(null);
  const fileSlice = useFileImporterImmerStore();

  return (
    <div className="file-selector">
      <div className="file-selector-button" onClick={() => inputRef.current?.click()}>
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
      <div className="file-selector-current-file">
        <span>{fileSlice.selectedFile?.name}</span>
      </div>
      <div className="file-selector-menu">
        {fileSlice.selectedFile?.extension === 'pdf' && <PdfViewerMenu formatter={(p, t) => `${p} / ${t}`} />}
        {fileSlice.selectedFile?.extension === 'json' && <JsonViewerMenu />}
        <FaSave size={'2rem'} color="orange" />
        <FaEdit size={'2rem'} color="yellow" />
      </div>
    </div>
  );
}

FileSelector.defaultProps = {
  label: 'Select File(s)',
  accept: '*/*',
} satisfies FileSelectorProps;
