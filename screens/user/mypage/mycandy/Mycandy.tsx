import { Container, Stack, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { m } from 'framer-motion';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { MotionContainer, varFade } from 'src/components/animate';
import { useScrollable } from 'src/hooks/useScrollable';
import MycandyItem from './mycandy-item/MycandyItem';
import { pxToRem } from 'src/theme/typography';
import { ref } from 'yup';

/**
 * ## Mycandy 설명
 *
 */
interface Props {
  data: any;
}

export const Mycandy = observer(({ data }: Props) => {
  // const rootStore = useStores();
  // const { loadingStore } = rootStore;
  const theme = useTheme();

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 'none',
    repeat: Infinity,
  } as const;

  const dragRef = useRef<HTMLDivElement>(null);
  useScrollable(dragRef, 'x');

  return (
    <>
      <Box sx={{ 
        width: '100%' ,
        display:'flex'
        }}>
        <Container
          component={MotionContainer}
          sx={{
            height: 1,
            width: '100%',
            px: 0,
            '@media (min-width: 600px)' : {
              px : 0
            }
          }}
        >
          <Stack
            component={m.div}
            variants={varFade().in}
            sx={{
              width: '100%',
              overflowX: 'scroll',
              '&::-webkit-scrollbar': {
                height: pxToRem(1)
              },
              '&::-webkit-scrollbar-thumb:horizontal': { // 스크롤바 막대
                backgroundColor: theme.palette.primary.main,
                height: pxToRem(1),
                ml : pxToRem(20),
                mr : pxToRem(20),
              },
              '&::-webkit-scrollbar-track': { // 스크롤바 배경
                ml : pxToRem(20),
                mr : pxToRem(20),
                backgroundColor: '#EEEEEE',
              },
              
              pb: 2.5,
            }}
            ref={dragRef}
          >
            <Stack
              direction={'row'}
              spacing={1.5}
              component={m.div}
              animate={{ x: ['0%', '-100%'] }}
              transition={transition}
              sx={{
                width:'fit-content',
                pr: pxToRem(20),
                
              }}
            >
              {<MycandyItem data={data} />}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
});

export default Mycandy;
