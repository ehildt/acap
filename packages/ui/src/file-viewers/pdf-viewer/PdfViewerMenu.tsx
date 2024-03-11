import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

import { usePdfViewImmerStore } from './PdfViewer.store';
import style from './PdfViewerMenu.module.scss';

type PdfViewerMenuProps = {
  formatter?: (currentPage: number, totalPages: number) => string;
};

export function PdfViewerMenu(props: PdfViewerMenuProps) {
  const store = usePdfViewImmerStore();

  return (
    <div className={style.pdfViewerMenu}>
      <button disabled={store.currentPage <= 1} onClick={() => store.setCurrentPage(store.currentPage - 1)}>
        <FaChevronLeft size={'2rem'} color={store.currentPage > 1 ? 'unset' : 'grey'} />
      </button>
      <p>{props.formatter?.(store.currentPage, store.pages) ?? `Page ${store.currentPage} of ${store.pages}`}</p>
      <button disabled={store.currentPage >= store.pages} onClick={() => store.setCurrentPage(store.currentPage + 1)}>
        <FaChevronRight size={'2rem'} color={store.currentPage >= store.pages ? 'gray' : 'unset'} />
      </button>
    </div>
  );
}
