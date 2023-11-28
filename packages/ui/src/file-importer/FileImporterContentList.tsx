import { useRef, useState } from 'react';
import { FaFile, FaFileCsv, FaFileExcel, FaFilePdf, FaFileWord, FaRegFileImage } from 'react-icons/fa6';

import { ImageViewer } from '../file-viewers/image-viewer/ImageViewer';

import { PageMenu, PageMenuItem, Scrollbar } from '..';
import { PdfViewer } from '../file-viewers/pdf-viewer/PdfViewer';
import { useImageRenderer } from './FileImporter.hooks';

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
  const [file, setFile] = useState<any>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preRef = useRef<HTMLParagraphElement>(null);

  const items = props.files?.map((f, idx) => {
    return (
      <PageMenuItem
        key={idx}
        onClick={() => {
          setFile(f);
          if (f.extension !== 'txt' && f.extension !== 'json') {
            useImageRenderer(f, canvasRef);
          } else {
            if (f.extension === 'json' || f.extension === 'txt') {
              preRef.current!.innerText = f.buffer.toString('utf8');
            }
          }
        }}
      >
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
      <div className="file-importer-content-tags">tags are mine</div>
      <div className="file-importer-content-preview">
        <Scrollbar>
          {file?.extension !== 'pdf' && file?.extension !== 'jpg' && <p ref={preRef} />}
          {file?.extension === 'jpg' && (
            <ImageViewer mimeType={file.mimeType} base64={file.buffer.toString('base64')} />
          )}
          {file?.extension === 'pdf' && <PdfViewer base64={file.buffer.toString('base64')} scale={0.59} />}
        </Scrollbar>
      </div>
    </div>
  );
}
