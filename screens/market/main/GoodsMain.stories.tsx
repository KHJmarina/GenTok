import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GoodsMain } from './GoodsMain'
export default {
  title: 'Components/Market/GoodsMain',
  component: GoodsMain,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof GoodsMain>;
const Template: ComponentStory<typeof GoodsMain> = (args) => <GoodsMain {...args} />;
export const Default = Template.bind({});
Default.args = {
  
};
