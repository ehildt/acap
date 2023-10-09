import './FileImporter.scss';

import { Buffer } from 'buffer';
import { useFileSelectorStore } from 'libs';
import { CSSProperties, useEffect, useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';

import { PageMenu, PageMenuItem } from '../';
import { FileSelector } from '../';
import { Scrollbar } from '../';
import { useIsFileSizeExceeded } from './FileImporter.hooks';

type FileImporterProps = {
  style?: CSSProperties;
};

function loadFileContents(files: Array<File>) {
  const uploadedOn = new Date();
  return files?.map(async (file) => {
    const fileKilobyte = parseFloat((file.size / 1024).toFixed(2));
    const fileMegabyte = parseFloat((file.size / 1024 ** 2).toFixed(2));
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
      size: file.size < 1000000 ? `${fileKilobyte} KB` : `${fileMegabyte} MB`,
    };
  });
}

export function FileImporter(props: FileImporterProps) {
  const [files, setFiles] = useState<any>([]);
  const fileSlice = useFileSelectorStore();
  const isFileSizeExceeded = useIsFileSizeExceeded(50_000_000, fileSlice.files);

  useEffect(() => {
    if (fileSlice.files?.length) {
      const promises = loadFileContents(fileSlice.files);
      Promise.all(promises).then((data) => {
        console.log(data);
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

      {Boolean(files?.length) && (
        <div className="file-importer-content">
          <div className="file-importer-content-list">
            <Scrollbar behavior="smooth" overflow="auto" direction="rtl" stickY="top" style={props.style}>
              <PageMenu>
                {files.map((f: any, idx: number) => (
                  <PageMenuItem key={idx}>
                    {f.name}
                    {f.extension === 'pdf' ? <FaFilePdf /> : null}
                  </PageMenuItem>
                ))}
              </PageMenu>
            </Scrollbar>
          </div>

          <div className="file-importer-content-preview">
            <canvas />
          </div>
        </div>
      )}
    </div>
  );
}
