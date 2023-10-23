import { useLayoutEffect, useRef } from 'react';
import { FaFile, FaFileCsv, FaFileExcel, FaFilePdf, FaFileWord, FaRegFileImage } from 'react-icons/fa6';

import { PageMenu, PageMenuItem, Scrollbar } from '..';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const items = props.files.map((f, idx) => (
    <PageMenuItem key={idx} onClick={() => useImageRenderer(f, canvasRef)}>
      <div className="file-card">
        {mapFileExtensionToIcon(f.extension)} {f.name} <br />
        {f.size} {f.lastModified}
      </div>
    </PageMenuItem>
  ));

  useLayoutEffect(() => {
    if (props.files?.length) {
      const file = props.files.find((f) => f.extension === 'jpg');
      if (file) useImageRenderer(file, canvasRef);
    }
  }, []);

  return (
    <div className="file-importer-content">
      <div className="file-importer-content-list">
        <Scrollbar behavior="smooth" overflow="y" direction="rtl">
          <PageMenu>{items}</PageMenu>
        </Scrollbar>
      </div>

      <canvas ref={canvasRef} className="file-importer-content-preview" itemType="*/*" />
    </div>
  );
}
