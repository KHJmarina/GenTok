import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Review from './Review';
export default {
  title: 'Screens/Market',
  component: Review,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Review>;
const Template: ComponentStory<typeof Review> = (args) => <Review />;
export const ReviewScreen = Template.bind({});
