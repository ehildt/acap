import type { Meta, StoryObj } from '@storybook/react';

import { Container } from '@/container/Container';

import { Rotate } from './Rotate';

export default {
  title: 'animation/rotate',
  component: Rotate,
  decorators: (render) => <div style={{ width: '200px' }}>{render()}</div>,
} satisfies Meta<typeof Rotate>;

export const RotateSamples = {
  render: () => (
    <>
      <Rotate x="1turn" y="10deg" z="5deg" x2="2turn" y2="-10deg" z2="-5deg" ms2={500}>
        <Container>one</Container>
      </Rotate>
      <Rotate x="1turn" y="-3.5deg" z="0">
        <Container>two</Container>
      </Rotate>
      <Rotate x="2turn" y="3.5deg" z="0">
        <Container>three</Container>
      </Rotate>
      <Rotate x="0turn" y="-3.5deg" z="0">
        <Container>four</Container>
      </Rotate>
    </>
  ),
} satisfies StoryObj<typeof Rotate>;
