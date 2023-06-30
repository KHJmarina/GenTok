import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useStores } from "../../../../models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { PATH_AUTH, PATH_PAGE, PATH_ROOT } from '../../../../routes/paths';
import { Card, Container, Stack, Typography, Button } from '@mui/material';
import { MotionContainer, varFade } from 'src/components/animate';
import { motion, m, useScroll, useSpring } from 'framer-motion';
import { grey } from '@mui/material/colors';
import { pxToRem } from 'src/theme/typography';
import MycardItem from '../mycard/mycard-item/MycardItem';
import { useScrollable } from 'src/hooks/useScrollable';

/**
 * ## RecentMycard 설명
 *
 */
interface Props {
  data: any;
}

export const RecentMycard = observer(({ data }: Props) => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 'none',
    repeat: Infinity,
  } as const;

  const dragRef = useRef<HTMLDivElement>(null);
  useScrollable(dragRef, 'x');

  
  // useEffect(()=> {
  //   console.log("data : " , data);
  // })
  
  return (
    <>
      <Stack component={m.div} variants={varFade().in} direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ pb: 2.5, px: 2.5 }}>
        <Typography variant={'h4'} sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: pxToRem(22) }}>
          유전자 카드
        </Typography>
        <Box onClick={() => navigate(`${PATH_ROOT.user.mypage.dnaResult}?ctegrySid=0&page=list`, {state:{prevPage: 'myPage'}})} sx={{cursor:'pointer'}}>
          <Typography variant={'body2'} color={grey[500]} fontSize={pxToRem(13)}>더보기</Typography>
        </Box>
      </Stack>
      {
        data && data.length > 0 ? (
          <Box 
            sx={{ 
              width: '100%', 
              mb: 5 , 
              cursor:'pointer'
            }}>
            <Container component={MotionContainer} sx={{
              height: 1,
              width: '100%',
              px: 0,
              '@media (min-width: 600px)' : {
                px : 0
                
              }
            }}>
              <Stack
                component={m.div}
                variants={varFade().in}
                sx={{
                  width: '100%',
                  overflowX: 'scroll',
                  '&::-webkit-scrollbar': {
                    height: pxToRem(1),
                  },
                  '&::-webkit-scrollbar-thumb:horizontal': {
                    backgroundColor: theme.palette.primary.main,
                    height: pxToRem(1),
                    ml : pxToRem(20),
                    mr : pxToRem(20)
                  },
                  '&::-webkit-scrollbar-thumb': {
                    ml: pxToRem(20),
                    mr : pxToRem(20)
                  },
                  '&::-webkit-scrollbar-track': {
                    ml: pxToRem(20),
                    mr : pxToRem(20),
                    backgroundColor: '#EEEEEE',
                  },
                  pb: 2.5,
                }}
                ref={dragRef}
              >
                <Stack
                  direction={'row'} spacing={1.5}
                  component={m.div}
                  animate={{ x: ['0%', '-100%'] }}
                  transition={transition}
                  sx={{
                    width:'fit-content',
                    pr: pxToRem(20),
                  }}
                >
                  {
                    <MycardItem data={data} />
                  }
                </Stack>
              </Stack>
            </Container>
          </Box>
        ) : (
          <Box sx={{ paddingX: '10%', paddingBottom: 3 }}>
            <Stack display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} direction="column" spacing={2} sx={{
              padding: 2.5
            }}>
              <Typography variant={'body1'} color={'#9DA0A5'}>나는 어떤 유전자를 가지고 있을까?</Typography>
              <Button
                variant={'outlined'}
                size={'large'}
                onClick={() => {
                  navigate(PATH_ROOT.market.root);
                }}
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
                유전자 마켓
              </Button>
            </Stack>
          </Box>
        )
      }
    </>
  );
});

export default RecentMycard;