import { Paper } from '@mui/material';
import React from 'react';
import { pxToRem } from 'src/theme/typography';

export interface ICardProps {
  children: React.ReactNode;
}

export const Card = ({ children }: ICardProps) => {
  return (
    <Paper
      sx={{
        borderRadius: 0,
        background: '#ffffff',
        padding: `${pxToRem(50)} ${pxToRem(20)}`,
      }}
      elevation={0}
    >
      {children}
    </Paper>
  );
};
