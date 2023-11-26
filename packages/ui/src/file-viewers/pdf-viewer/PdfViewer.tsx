import './PdfViewer.overwrite.scss';

import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { Document, Page, pdfjs } from 'react-pdf';

import style from './PdfViewer.module.scss';

// TODO: get the file from window.location/../pdf.worker.min.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type PdfViewerProps = {
  base64: string;
  scale?: number;
  formatter?: (currentPage: number, totalPages: number) => string;
};

export function PdfViewer(props: PdfViewerProps) {
  const [pages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <div className={style.pdfViewer}>
      <div className={style.pdfViewerContainer}>
        <Document
          file={`data:application/pdf;base64,${props.base64}`}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
          }}
        >
          {pages && <Page pageNumber={currentPage} scale={props.scale ?? 1} renderAnnotationLayer={false} />}
        </Document>
      </div>
      <div className={style.pdfViewerButtonMenu}>
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage((val) => val - 1)}>
          <FaChevronLeft size={'1.5rem'} />
        </button>
        <p>{props.formatter?.(currentPage, pages) ?? `Page ${currentPage} of ${pages}`}</p>
        <button disabled={currentPage >= pages} onClick={() => setCurrentPage((val) => val + 1)}>
          <FaChevronRight size={'1.5rem'} />
        </button>
      </div>
    </div>
  );
}
