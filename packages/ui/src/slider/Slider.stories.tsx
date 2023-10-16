import type { Meta, StoryObj } from '@storybook/react';

import { Slider } from './Slider';

export default {
  title: 'sliders/slider',
  component: Slider,
} satisfies Meta<typeof Slider>;

export const DefaultSlider = {
  render: () => <Slider label="DefaultSlider" />,
} satisfies StoryObj<typeof Slider>;

export const SliderWithOnWheelEvent = {
  render: () => <Slider label="SliderWithOnWheelEvent" onWheel={console.log} />,
} satisfies StoryObj<typeof Slider>;
