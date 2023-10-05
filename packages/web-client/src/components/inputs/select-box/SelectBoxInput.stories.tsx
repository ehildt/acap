import type { Meta, StoryObj } from '@storybook/react';

import { SelectBoxInput } from './SelectBoxInput';

const meta = {
  title: 'inputs/select-box-input',
  component: SelectBoxInput,
  tags: ['autodocs'],
  args: {
    label: 'ok',
  },
  decorators: [
    (story) => (
      <ul style={{ display: 'flex', backgroundColor: 'red' }}>
        <li>{story()}</li>
      </ul>
    ),
  ],
} satisfies Meta<typeof SelectBoxInput>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  render: (args) => <SelectBoxInput {...args} />,
};
