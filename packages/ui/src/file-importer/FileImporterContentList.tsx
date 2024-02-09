import { useRef, useState } from 'react';
import { FaFile, FaFileCsv, FaFileExcel, FaFilePdf, FaFileWord, FaRegFileImage } from 'react-icons/fa6';
import { parse } from 'yaml';

import { TreeViewer } from '@/file-viewers/tree-viewer/TreeViewer';
import { YmlViewer } from '@/file-viewers/yml-viewer/YmlViewer';

import { ImageViewer, JsonViewer, PageMenu, PageMenuItem, PdfViewer, Scrollbar, useFileImporterImmerStore } from '..';

type SUPPORTED_EXTENSIONS = 'pdf' | 'csv' | 'xlsx' | 'odt' | 'docx' | 'jpg' | 'png';

const SUPPORTED_ICONS = {
  pdf: <FaFilePdf />,
  csv: <FaFileCsv />,
  xlsx: <FaFileExcel />,
  odt: <FaFileWord />,
  docx: <FaFileWord />,
  jpg: <FaRegFileImage />,
  png: <FaRegFileImage />,
};

function mapFileExtensionToIcon(extension: SUPPORTED_EXTENSIONS) {
  const icon = SUPPORTED_ICONS[extension];
  if (icon) return icon;
  return <FaFile />;
}

type PropsFileImporterContentList = {
  files: Array<any>;
};

export function FileImporterContentList(props: PropsFileImporterContentList) {
  const fileSlice = useFileImporterImmerStore();
  const [file, setFile] = useState<any>();
  const ref = useRef(null);
  const items = props.files?.map((f, idx) => {
    return (
      <PageMenuItem key={idx} onClick={() => setFile(f)}>
        <div className="file-card">
          {mapFileExtensionToIcon(f.extension)} {f.name} <br />
          {f.size} {f.lastModified}
        </div>
      </PageMenuItem>
    );
  });

  return (
    <div className="file-importer-content">
      <div className="file-importer-content-list">
        <Scrollbar behavior="smooth" overflow="y" direction="rtl">
          <PageMenu>{items}</PageMenu>
        </Scrollbar>
      </div>
      <div ref={ref} className="file-importer-content-preview">
        <Scrollbar overflow={fileSlice.toggleTreeView ? 'hidden' : 'auto'}>
          {file?.extension === 'json' && fileSlice.toggleTreeView && (
            <TreeViewer object={JSON.parse(file.buffer.toString())} ref={ref} />
          )}
          {file?.extension === 'yml' && fileSlice.toggleTreeView && (
            <TreeViewer object={parse(file.buffer.toString())} ref={ref} />
          )}
          {file?.extension === 'json' && !fileSlice.toggleTreeView && <JsonViewer json={file.buffer.toString()} />}
          {file?.extension === 'yml' && !fileSlice.toggleTreeView && <YmlViewer yml={parse(file.buffer.toString())} />}
          {file?.extension === 'pdf' && <PdfViewer base64={file.buffer.toString('base64')} />}
          {file?.extension === 'jpg' && (
            <ImageViewer base64={file.buffer.toString('base64')} mimeType={file.mimeType} />
          )}
        </Scrollbar>
      </div>
    </div>
  );
}
