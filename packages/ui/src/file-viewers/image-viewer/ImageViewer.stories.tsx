import type { Meta, StoryObj } from '@storybook/react';

import { base64 } from './base64.jpg';
import { ImageViewer } from './ImageViewer';

export default {
  title: 'viewers/image-viewer',
  component: ImageViewer,
} satisfies Meta<typeof ImageViewer>;

export const Default = {
  render: () => (
    <div style={{ width: '45dvw', height: '45dvh' }}>
      <ImageViewer mimeType="image/jpeg" base64={base64} />
    </div>
  ),
} satisfies StoryObj<typeof ImageViewer>;
