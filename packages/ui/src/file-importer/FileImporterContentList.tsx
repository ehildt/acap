import { useRef, useState } from 'react';
import { FaFile, FaFileCsv, FaFileExcel, FaFilePdf, FaFileWord, FaRegFileImage } from 'react-icons/fa6';

import { JsonViewer, PageMenu, PageMenuItem, Scrollbar } from '..';

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
      <div className="file-importer-content-tags">tags are mine</div>
      <div className="file-importer-content-preview">
        <Scrollbar>{file?.extension === 'json' && <JsonViewer json={file.buffer.toString()} />}</Scrollbar>
      </div>
    </div>
  );
}
