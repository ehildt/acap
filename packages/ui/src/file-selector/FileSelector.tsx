import './FileSelector.scss';

import { useRef } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { FaEye, FaEyeSlash, FaFileImport } from 'react-icons/fa6';
import { GiPlantRoots } from 'react-icons/gi';

import { useFileImporterImmerStore } from '..';
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
        <GiPlantRoots
          size={'2rem'}
          onClick={fileSlice.setToggleTreeView}
          cursor={'pointer'}
          color={fileSlice.toggleTreeView ? 'lime' : 'grey'}
        />
        {fileSlice.toggleLeafNodeValues ? (
          <FaEye
            onClick={fileSlice.setToggleLeafNodeValues}
            size={'2rem'}
            cursor={'pointer'}
            color={fileSlice.toggleLeafNodeValues ? 'skyblue' : 'grey'}
          />
        ) : (
          <FaEyeSlash onClick={fileSlice.setToggleLeafNodeValues} size={'2rem'} cursor={'pointer'} color="grey" />
        )}
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
