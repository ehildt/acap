import './FileImporter.scss';

import { Buffer } from 'buffer';
import { CSSProperties, useLayoutEffect, useState } from 'react';

import { FileSelector } from '../file-selector/FileSelector';
import { useIsFileSizeExceeded } from './FileImporter.hooks';
import { useFileImporterImmerStore } from './FileImporter.store';
import { FileImporterContentList } from './FileImporterContentList';

type FileImporterProps = {
  style?: CSSProperties;
};

function loadFileContents(files: Array<File>) {
  const uploadedOn = new Date();
  return files?.map(async (file) => {
    const words = file.name.split('.');
    const extension = words.pop();
    const name = words.toString();
    return {
      uploadedOn,
      extension,
      name,
      mimeType: file.type,
      lastModified: file.lastModified,
      buffer: Buffer.from(await file.arrayBuffer()),
      size:
        file.size < 1000000
          ? `${parseFloat((file.size / 1024).toFixed(2))} KB`
          : `${parseFloat((file.size / 1024 ** 2).toFixed(2))} MB`,
    };
  });
}

export function FileImporter(props: FileImporterProps) {
  const [files, setFiles] = useState<any>([]);
  const fileSlice = useFileImporterImmerStore();
  const isFileSizeExceeded = useIsFileSizeExceeded(50_000_000, fileSlice.files);

  useLayoutEffect(() => {
    if (fileSlice.files?.length) {
      const promises = loadFileContents(fileSlice.files);
      Promise.all(promises).then((data) => {
        setFiles(data);
      });
    }
  }, [fileSlice.files]);

  return (
    <div className="file-importer">
      <div className="file-importer-menu">
        <FileSelector onChange={async ({ files }) => fileSlice.selectFiles(files)} />
        {isFileSizeExceeded && <p>file size exceeded</p>}
      </div>
      {Boolean(files?.length) && <FileImporterContentList files={files} />}
    </div>
  );
}
