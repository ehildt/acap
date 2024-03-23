import type { Meta, StoryObj } from '@storybook/react';

import { Container } from '@/container/Container';

import { Skew } from './Skew';

export default {
  title: 'animation/skew',
  component: Skew,
  decorators: (render) => <div style={{ width: '200px' }}>{render()}</div>,
} satisfies Meta<typeof Skew>;

export const SkewSamples = {
  render: () => (
    <>
      <Skew x="1turn" y="3.5deg" x2="0" y2="0" ms={1000}>
        <Container>one</Container>
      </Skew>
      <Skew x="1turn" y="-3.5deg" x2="0" y2="0">
        <Container>two</Container>
      </Skew>
      <Skew x="2turn" y="3.5deg" x2="0" y2="1turn">
        <Container>three</Container>
      </Skew>
      <Skew x="0turn" y="-3.5deg" x2="1turn" y2="1turn">
        <Container>four</Container>
      </Skew>
    </>
  ),
} satisfies StoryObj<typeof Skew>;
