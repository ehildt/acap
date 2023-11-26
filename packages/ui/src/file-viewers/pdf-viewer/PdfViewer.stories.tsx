import type { Meta, StoryObj } from '@storybook/react';

import { pdfBase64Example } from './base64.pdf';
import { PdfViewer } from './PdfViewer';

export default {
  title: 'viewers/pdf-viewer',
  component: PdfViewer,
  decorators: [(renderer) => <div style={{ width: 'fit-content' }}>{renderer()}</div>],
} satisfies Meta<typeof PdfViewer>;

export const DefaultPdfViewer = {
  render: () => (
    <PdfViewer
      base64={pdfBase64Example}
      scale={0.5}
      formatter={(currentPageNumber, totalPageCount) => `Page ${currentPageNumber} of ${totalPageCount}`}
    />
  ),
} satisfies StoryObj<typeof PdfViewer>;
