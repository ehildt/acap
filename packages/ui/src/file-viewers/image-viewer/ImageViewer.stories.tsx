import type { Meta, StoryObj } from '@storybook/react';

import { base64 } from './base64.jpg';
import { ImageViewer } from './ImageViewer';

export default {
  title: 'viewers/image-viewer',
  component: ImageViewer,
} satisfies Meta<typeof ImageViewer>;

export const Default = {
  render: () => <ImageViewer mimeType="image/jpeg" base64={base64} />,
} satisfies StoryObj<typeof ImageViewer>;
