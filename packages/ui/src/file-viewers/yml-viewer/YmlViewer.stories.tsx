import type { Meta, StoryObj } from '@storybook/react';

import { Container } from '@/container/Container';

import { YmlViewer } from './YmlViewer';
import { YmlViewerMenu } from './YmlViewerMenu';

export default {
  title: 'viewers/yml-viewer',
  component: YmlViewer,
  decorators: [(story) => <>{story()}</>],
} satisfies Meta<typeof YmlViewer>;

export const DefaultYmlViewer = {
  render: () => (
    <Container>
      <YmlViewerMenu />
      <hr />
      <YmlViewer
        yml={{
          name: 'eugen',
          isSexy: false,
          addresses: [{ city: 'bukarest' }, { city: 'moenchengladbach' }],
          magic: { firebolt: 'lvl2' },
        }}
      />
    </Container>
  ),
} satisfies StoryObj<typeof YmlViewer>;
