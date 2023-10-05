import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';

import { Button } from '@/components/buttons';

import { Scrollbar as Component } from './Scrollbar';
import { ScrollbarItem } from './ScrollbarItem';

export default {
  title: 'scrollbars/scrollbar',
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [list, addList] = useState([
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin orci nisi, tincidunt non ornare vitae, venenatis quis ipsum. Ut ut ullamcorper arcu, in iaculis purus. Maecenas sit amet diam ex. Fusce pretium mi a enim commodo dictum. Praesent eu tortor ut lorem mollis dignissim a et eros. Ut vitae magna commodo nisl mattis congue. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus accumsan ligula a augue luctus aliquam.`,
    `Suspendisse mattis accumsan metus, sed lobortis tortor semper eu. Integer nec mattis augue. Nullam egestas vitae tortor sollicitudin tempor. Pellentesque eu ligula nec justo ornare scelerisque a sit amet dui. Suspendisse accumsan magna nec nibh eleifend egestas. Nunc at augue vel eros bibendum posuere. Mauris tincidunt sodales lorem at tempor. Aenean ornare lectus euismod quam laoreet volutpat. Aenean id felis faucibus, faucibus massa in, finibus erat. Curabitur ut erat non urna semper finibus non quis eros. Nullam pharetra sagittis enim, at bibendum leo convallis ut. Nunc maximus nunc id tellus lacinia, eu lacinia ex mattis. Etiam hendrerit fermentum nulla, id sollicitudin turpis sodales sed. Etiam id eros iaculis, sollicitudin nisi ut, ultricies est. Nunc facilisis quis felis sed tempor.`,
    `Integer ante augue, ultrices quis dui vel, dictum lobortis justo. Sed maximus ultrices leo id ornare. Cras venenatis lectus ut urna vulputate condimentum. Aliquam vitae feugiat augue. Sed non dignissim nibh, at luctus nisl. Integer quis consectetur orci. Praesent consequat magna et diam accumsan malesuada. Etiam vehicula, eros tincidunt blandit mollis, ex diam semper sem, quis malesuada urna neque non leo.`,
    `Nulla facilisi. Curabitur quis nibh quis justo laoreet scelerisque non in sapien. Vestibulum ac arcu accumsan dui iaculis varius ut ut mi. Donec a ex orci. Fusce est urna, efficitur nec quam nec, sollicitudin lobortis ante. Integer pharetra vehicula ex nec lacinia. Pellentesque volutpat egestas turpis eget facilisis. Nunc ullamcorper nulla ac aliquam lacinia. Pellentesque sed lacus mi. Integer auctor sapien ligula, at sollicitudin quam pellentesque sit amet. Suspendisse rutrum at mi sit amet efficitur. Fusce tortor tortor, lacinia vel massa nec, mattis consectetur elit. Fusce quis venenatis purus.`,
    `Phasellus eget justo nulla. Proin mollis arcu sit amet elit pharetra, vel lobortis risus porta. Nulla lobortis fringilla ex. Cras interdum quam at augue iaculis, eget dapibus orci hendrerit. Praesent placerat eros sit amet leo facilisis elementum. Donec dapibus condimentum mi eu ornare. Integer non arcu nec ipsum hendrerit scelerisque a et nisl.`,
  ]);

  const content = list.map((l, idx) => (
    <ScrollbarItem key={idx}>
      <p style={{ width: '60vw', backgroundColor: `rgb(${15 * idx}, ${5 * idx}, ${10 * idx})` }}>{l}</p>
    </ScrollbarItem>
  ));

  return (
    <>
      <Button
        text="top"
        iconBefore={<FaPlusCircle />}
        onClick={() => {
          addList((list) => ['X', ...list]);
        }}
      />

      <div style={{ width: '40vw', height: '50vh', marginBlock: '1rem' }}>
        <Component {...args}>{content}</Component>
      </div>

      <Button
        text="bottom"
        iconBefore={<FaPlusCircle />}
        onClick={() => {
          addList((list) => [...list, 'X']);
        }}
      />
    </>
  );
};

export const ScrollbarLtrTopY = Template.bind({});
ScrollbarLtrTopY.args = {
  behavior: 'smooth',
  stickY: 'top',
  stickX: 'left',
  direction: 'ltr',
  overflow: 'y',
  style: { color: 'green' },
  onClick(scrollbarItem, scrollbar) {
    console.log('scrollbar height: ', scrollbar.scrollHeight);
    console.log('item height', scrollbarItem.scrollHeight);
    console.log('current scroll height', scrollbar.scrollTop + scrollbar.offsetHeight);
  },
};

export const ScrollbarLtrBottomAuto = Template.bind({});
ScrollbarLtrBottomAuto.args = {
  behavior: 'smooth',
  stickY: 'bottom',
  stickX: 'left',
  direction: 'ltr',
  overflow: 'auto',
};

export const ScrollbarRtlTopY = Template.bind({});
ScrollbarRtlTopY.args = {
  behavior: 'smooth',
  stickY: 'top',
  stickX: 'right',
  direction: 'rtl',
  overflow: 'y',
};

export const ScrollbarRtlBottomAuto = Template.bind({});
ScrollbarRtlBottomAuto.args = {
  behavior: 'smooth',
  stickY: 'bottom',
  stickX: 'right',
  direction: 'rtl',
  overflow: 'auto',
};
