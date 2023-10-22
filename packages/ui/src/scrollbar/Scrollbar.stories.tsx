import type { Meta, StoryObj } from '@storybook/react';

import { Scrollbar } from './Scrollbar';

export default {
  title: 'scrollbars/scrollbar',
  component: Scrollbar,
  decorators: [(story) => <div style={{ width: '20dvw' }}>{story()}</div>],
} satisfies Meta<typeof Scrollbar>;

export const DefaultScrollbar = {
  render: () => (
    <Scrollbar>
      <span>element 1</span>
      <span>element 2</span>
      <span>element 3</span>
    </Scrollbar>
  ),
} satisfies StoryObj<typeof Scrollbar>;

export const ScrollbarRtl = {
  render: () => (
    <Scrollbar direction="rtl" style={{ height: '10dvh' }}>
      <span>element 1</span>
      <span>element 2</span>
      <span>element 3</span>
      <span>element 4</span>
      <span>element 5</span>
      <span>element 6</span>
    </Scrollbar>
  ),
} satisfies StoryObj<typeof Scrollbar>;
