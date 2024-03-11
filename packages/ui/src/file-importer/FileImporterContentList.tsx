import { FaFile, FaFileCsv, FaFileExcel, FaFilePdf, FaFileWord, FaRegFileImage } from 'react-icons/fa6';
import { parse } from 'yaml';

import { TreeViewer } from '@/file-viewers/tree-viewer/TreeViewer';
import { YmlViewer } from '@/file-viewers/yml-viewer/YmlViewer';

import { ImageViewer, JsonViewer, PageMenu, PageMenuItem, PdfViewer, Scrollbar, useFileImporterImmerStore } from '..';

type SUPPORTED_EXTENSIONS = 'pdf' | 'csv' | 'xlsx' | 'odt' | 'docx' | 'jpg' | 'png';

const SUPPORTED_ICONS = {
  pdf: <FaFilePdf size={'1.8rem'} />,
  csv: <FaFileCsv size={'1.8rem'} />,
  xlsx: <FaFileExcel size={'1.8rem'} />,
  odt: <FaFileWord size={'1.8rem'} />,
  docx: <FaFileWord size={'1.8rem'} />,
  jpg: <FaRegFileImage size={'1.8rem'} />,
  png: <FaRegFileImage size={'1.8rem'} />,
};

function mapFileExtensionToIcon(extension: SUPPORTED_EXTENSIONS) {
  const icon = SUPPORTED_ICONS[extension];
  if (icon) return icon;
  return <FaFile size={'1.8rem'} />;
}

type PropsFileImporterContentList = {
  files: Array<any>;
};

export function FileImporterContentList(props: PropsFileImporterContentList) {
  const fileSlice = useFileImporterImmerStore();

  const items = props.files?.map((f, idx) => {
    return (
      <PageMenuItem key={idx} onClick={() => fileSlice.setSelectedFile(f)}>
        <div className="file-card">
          <div data-icon>{mapFileExtensionToIcon(f.extension)}</div>
          <div data-content>
            <span data-name="filename">{f.name}</span>
            <span>{f.size}</span>
            <span>{f.lastModified}</span>
          </div>
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
      <div className="file-importer-content-preview">
        <Scrollbar>
          {fileSlice.selectedFile?.extension === 'json' && fileSlice.toggleTreeView && (
            <TreeViewer data={JSON.parse(fileSlice.selectedFile.buffer.toString())} />
          )}
          {fileSlice.selectedFile?.extension === 'yml' && fileSlice.toggleTreeView && (
            <TreeViewer data={parse(fileSlice.selectedFile.buffer.toString())} />
          )}
          {fileSlice.selectedFile?.extension === 'json' && !fileSlice.toggleTreeView && (
            <JsonViewer json={fileSlice.selectedFile.buffer.toString()} />
          )}
          {fileSlice.selectedFile?.extension === 'yml' && !fileSlice.toggleTreeView && (
            <YmlViewer yml={parse(fileSlice.selectedFile.buffer.toString())} />
          )}
          {fileSlice.selectedFile?.extension === 'pdf' && (
            <PdfViewer base64={fileSlice.selectedFile.buffer.toString('base64')} />
          )}
          {fileSlice.selectedFile?.extension === 'jpg' && (
            <ImageViewer
              base64={fileSlice.selectedFile.buffer.toString('base64')}
              mimeType={fileSlice.selectedFile.mimeType}
            />
          )}
        </Scrollbar>
      </div>
    </div>
  );
}
