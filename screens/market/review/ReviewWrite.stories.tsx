import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ReviewWrite from './ReviewWrite';
export default {
  title: 'Screens/Market',
  component: ReviewWrite,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ReviewWrite>;
const Template: ComponentStory<typeof ReviewWrite> = (args) => <ReviewWrite />;
export const ReviewWriteScreen = Template.bind({});
