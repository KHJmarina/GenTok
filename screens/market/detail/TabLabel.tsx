import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { pxToRem } from 'src/theme/typography';

export interface TabLabelProps {
  label: string;
  count?: number;
  selected?: boolean;
}

export const TabLabel = (props: TabLabelProps) => {
  const [color, setColor] = useState('#BDBDBD');
  const [fontWeight, setFontWeight] = useState(400);
  useEffect(() => {
    setColor(props.selected ? '#ff6930' : '#BDBDBD');
    setFontWeight(props.selected ? 600 : 400);
  }, [props.selected]);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontSize: pxToRem(17),
        fontWeight,
        color: props.selected ? '#212121' : '#BDBDBD',
      }}
    >
      {props.label}

      <span
        style={{
          marginLeft: '8px',
          color,
        }}
      >
        {props.count && props.count >= 1 ? props.count : ''}
      </span>
    </Box>
  );
};
