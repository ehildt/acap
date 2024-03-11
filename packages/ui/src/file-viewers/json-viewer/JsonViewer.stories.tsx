import type { Meta, StoryObj } from '@storybook/react';

import { JsonViewer } from './JsonViewer';

export default {
  title: 'viewers/json-viewer',
  component: JsonViewer,
  decorators: [(story) => <>{story()}</>],
} satisfies Meta<typeof JsonViewer>;

export const DefaultJsonViewer = {
  render: () => (
    <JsonViewer
      json={JSON.stringify({
        name: 'eugen',
        isSexy: false,
        addresses: [{ city: 'bukarest' }, { city: 'moenchengladbach' }],
      })}
    />
  ),
} satisfies StoryObj<typeof JsonViewer>;
