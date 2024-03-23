import type { Meta, StoryObj } from '@storybook/react';
import { FaHeart, FaPlus, FaSmile } from 'react-icons/fa';

import { Skew } from '@/animation/skew/Skew';

import { Button } from './Button';

export default {
  title: 'buttons/button',
  component: Button,
} satisfies Meta<typeof Button>;

export const DefaultButton = {
  render: () => <Button onClick={() => confirm('button clicked!')}>clickMe</Button>,
} satisfies StoryObj<typeof Button>;

export const DefaultWithStyle = {
  render: () => (
    <Button style={{ background: 'gray', fontWeight: 'bolder', borderColor: 'rgba(130,200,80, 1)' }}>withStyle</Button>
  ),
} satisfies StoryObj<typeof Button>;

export const ButtonWithHover = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button color="green" hoverColor="yellowgreen">
        colors
      </Button>
      <Button hoverColor="pink" color="plum" borderColor="green" borderHoverColor="yellowgreen">
        colors
      </Button>
      <Button
        hoverColor="black"
        color="plum"
        borderColor="white"
        borderHoverColor="red"
        backgroundColor="black"
        backgroundHoverColor="gray"
      >
        colors
      </Button>
    </div>
  ),
} satisfies StoryObj<typeof Button>;

export const ButtonIcons = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button iconBefore={<FaSmile />}>iconBefore</Button>
      <Button iconAfter={<FaSmile />}>iconAfter</Button>
      <Button
        iconAfter={<FaPlus size={'2rem'} color="yellowgreen" />}
        iconBefore={<FaHeart size={'2rem'} color="pink" />}
      >
        <Skew x="0turn" y="0deg" x2="1turn" y2="360deg">
          before & after
        </Skew>
      </Button>
      <Button
        iconAfter={<FaPlus size={'2rem'} color="yellowgreen" />}
        iconBefore={<FaHeart size={'2rem'} color="pink" />}
      />
    </div>
  ),
} satisfies StoryObj<typeof Button>;
