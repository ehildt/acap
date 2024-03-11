import type { Meta, StoryObj } from '@storybook/react';

import { Container } from './Container';

export default {
  title: 'containers/container',
  component: Container,
  decorators: [(story) => <div style={{ width: '20dvw' }}>{story()}</div>],
} satisfies Meta<typeof Container>;

export const DefaultContainer = {
  render: () => (
    <Container>
      <span>some content</span>
    </Container>
  ),
} satisfies StoryObj<typeof Container>;

export const ContainersWithStyle = {
  render: () => (
    <div style={{ textAlign: 'center' }}>
      <Container styleContainer={{ backgroundColor: 'grey', margin: '0.5rem' }}>
        <span>some content</span>
      </Container>
      <Container styleContainer={{ backgroundColor: 'limegreen', margin: '0.5rem' }}>
        <span>some content</span>
      </Container>
      <Container styleContainer={{ backgroundColor: 'pink', margin: '0.5rem' }}>
        <span>some content</span>
      </Container>
    </div>
  ),
} satisfies StoryObj<typeof Container>;

export const ContainersWithContentStyle = {
  render: () => (
    <div style={{ textAlign: 'center' }}>
      <Container styleContent={{ backgroundColor: 'grey', color: 'black' }} styleContainer={{ margin: '0.5rem' }}>
        <span>some content</span>
      </Container>
      <Container styleContent={{ backgroundColor: 'lime', color: 'black' }} styleContainer={{ margin: '0.5rem' }}>
        <span>some content</span>
      </Container>
      <Container styleContent={{ backgroundColor: 'skyblue', color: 'black' }} styleContainer={{ margin: '0.5rem' }}>
        <span>some content</span>
      </Container>
    </div>
  ),
} satisfies StoryObj<typeof Container>;
