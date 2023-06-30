import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { Card, Container, Stack, styled, Typography, Button } from '@mui/material';
import Carousel, { CarouselArrowIndex } from 'src/components/carousel';
import { ReactComponent as CandyIcon } from 'src/assets/icons/ico-recent-candy.svg';
import { MotionContainer, varFade } from 'src/components/animate';
import { grey } from '@mui/material/colors';
import { TEST_TYPES } from 'src/components/test-types-svg';
import { motion, m, useScroll, useSpring } from 'framer-motion';
import Image from 'src/components/image/Image';

/**
 * ## RecentCandy 설명
 *
 */
export const RecentCandy = observer(() => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  const tempCnt = 10;  //TODO recent play array OR recent play array length

  const transition = {
    repeatType: 'loop',
    // ease: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
    ease: 'linear',
    duration: 'none',
    repeat: Infinity,
  } as const;

  const colors: any = {
    'A': '#FCC800', 'B': '#008FF8', 'C': '#FF8872', 'D': '#69CA90', 'E': '#5A75FF', 'F': '#5B4DF7'
  };
  
  const bgColors: any = {
    'A': '#FFF9E5', 'B': '#FFF9E5', 'C': '#FFF9E5', 'D': '#FFF9E5', 'E': '#FFF9E5', 'F': '#FFF9E5'
  };

  return (
    <>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ py: 2, px: 3 }}>
        <Typography variant={'h4'} sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
          <CandyIcon style={{ marginRight: 8 }} />
          최근 본 상품
        </Typography>
      </Stack>
      { tempCnt > 0 ? 
        (<Box sx={{ px: 2.5, width: '100%' }}>
          <Container component={MotionContainer} sx={{
            height: 1,
            width: '100%',
            px: 0,
          }}>
            <Stack
              component={m.div}
              variants={varFade().in}
              sx={{
                width: '100%',
                overflowX: 'scroll',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                pb: 1.5,
              }}
            >
              <Stack
                direction={'row'} spacing={2}
                component={m.div}
                animate={{ x: ['0%', '-100%'] }}
                transition={transition}
                sx={{
                }}
              >
                {
                  [...Array(tempCnt)].map((_, i: number) => { //최대 10개
                    // let n = Math.round(Math.random() * 49);
                    // n = n < 0 ? 0 : n;
                    return (
                      <Stack maxWidth={120} key={`recent-candy-1-${i}`} sx={{ textAlign: 'left', mb: 1 }}
                        // onClick={() => {
                        //   navigate('/test/mbti/' + data.id)
                        // }}
                      >
                        <svg width="120" height="120" viewBox='0 0 60 60' style={{backgroundColor: bgColors[TEST_TYPES[i].type], borderRadius: 2}}>
                          <motion.path fill={colors[TEST_TYPES[i].type]} d={TEST_TYPES[i].svg} />
                        </svg>
                        {/* <Image src={`${TEST_TYPES[i].svg}`} ratio={'1/1'} sx={{ borderRadius: 2, width: '120px', height: '120px' }} /> */}
                        <Typography variant={'caption'} color={'text.secondary'} sx={{ mt: 0, pt: 1 }}>{TEST_TYPES[i].name}</Typography>
                        <Stack direction={'row'} spacing={1}>
                          <Typography variant={'subtitle2'} sx={{ mt: '0 !important', py: 0.5 }}>{TEST_TYPES[i].name}</Typography>
                        </Stack>
                      </Stack>
                    )
                  })
                }
              </Stack>
            </Stack>
          </Container>
        </Box>) : 
        (<Box sx={{ paddingX: '10%', paddingBottom: 3 }}>
          <Stack display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} direction="column" spacing={2} sx={{
            padding: 2.5
          }}>
            <Typography variant={'body1'} color={'#9DA0A5'}>나는 어떤 DNA를 가지고 있을까?</Typography>
            <Button
              variant={'outlined'}
              size={'large'}
              // onClick={() => {
              //   navigate('/', { replace: true });
              // }}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 3,
                '&:hover': {
                  color: '#FF5D0C',
                  border: '1px solid #FF5D0C',
                  background:'none',
                },
                cursor:'pointer'
              }}
            >
              DNA 마켓
            </Button>
          </Stack>
        </Box>)
      }
    </>
  );
});

export default RecentCandy;