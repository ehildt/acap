import type { Meta, StoryObj } from '@storybook/react';

import { SelectBox } from './SelectBox';

const meta = {
  title: 'inputs/select-box',
  component: SelectBox,
  tags: ['autodocs'],
  args: {
    defaultIndex: 0,
    customInput: false,
  },
  decorators: [
    (story) => (
      <ul style={{ display: 'flex', backgroundColor: 'red' }}>
        <li>uahhaha</li>
        <li>{story()}</li>
        <li>uahhaha</li>
        <li>{story()}</li>
      </ul>
    ),
  ],
} satisfies Meta<typeof SelectBox>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    items: [
      { name: 'Take 3', value: 3 },
      { name: 'Take 5', value: 5 },
      { name: 'Take 8', value: 8 },
      { name: 'Take 13', value: 13 },
      { name: 'Take 21', value: 21 },
    ],
  },
  render: (args) => <SelectBox {...args} />,
};

export const Take8: Story = {
  args: {
    items: [
      { name: 'Take 3', value: 3 },
      { name: 'Take 5', value: 5 },
      { name: 'Take 8', value: 8 },
      { name: 'Take 13', value: 13 },
      { name: 'Take 21', value: 21 },
    ],
    defaultIndex: 3,
    customInput: true,
  },
  render: (args) => <SelectBox {...args} />,
};
