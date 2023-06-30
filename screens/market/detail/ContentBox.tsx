import { Box, BoxProps } from '@mui/material';
import React from 'react';

export interface IContentBoxProps extends BoxProps {
  children: React.ReactNode;
}

export const ContentBox = ({ children, sx }: IContentBoxProps) => {
  return (
    <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column', pt: 2.5, ...sx }}>{children}</Box>
  );
};
