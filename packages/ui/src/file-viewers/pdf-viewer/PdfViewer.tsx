import './PdfViewer.overwrite.scss';

import { Document, Page, pdfjs } from 'react-pdf';

import { Container } from '@/container/Container';

import style from './PdfViewer.module.scss';
import { usePdfViewImmerStore } from './PdfViewer.store';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type PdfViewerProps = {
  base64: string;
  scale?: number;
  formatter?: (currentPage: number, totalPages: number) => string;
};

export function PdfViewer(props: PdfViewerProps) {
  const { pages, setPages, currentPage } = usePdfViewImmerStore();

  return (
    <Container>
      <div className={style.pdfViewer}>
        <div className={style.pdfViewerContainer}>
          <Document
            file={`data:application/pdf;base64,${props.base64}`}
            onLoadSuccess={({ numPages }) => {
              setPages(numPages);
            }}
          >
            {pages && <Page pageNumber={currentPage} renderAnnotationLayer={false} />}
          </Document>
        </div>
      </div>
    </Container>
  );
}
