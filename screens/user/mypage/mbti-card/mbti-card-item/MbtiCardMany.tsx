import { Box, Stack, Typography, Container } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useRef } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import { pxToRem } from 'src/theme/typography';
import { MotionContainer, varFade } from 'src/components/animate';
import { m } from 'framer-motion';
import { IMbtiResult } from 'src/models/mbti-result/MbtiResult';
import Image from 'src/components/image/Image';
import { ReactComponent as IconRight } from 'src/assets/icons/ico-right.svg';
import { useScrollable } from 'src/hooks/useScrollable';

/**
 * ## MbtiCardMany 설명
 *
 */

interface Props {
  mbtiCards: IMbtiResult[];
}

export const MbtiCardMany = observer(({ mbtiCards }: Props) => {

  const rootStore = useStores();
  const theme = useTheme();
  const navigate = useNavigate();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 'none',
    repeat: Infinity,
  } as const;

  const dragRef = useRef<HTMLDivElement>(null);
  useScrollable(dragRef, 'x');

  return (
    <Box sx={{ width: '100%', mb: pxToRem(40), cursor:'pointer' }}>
      <Container 
        component={MotionContainer} 
        sx={{
          width: '100%',
          px:0,
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
            '&::-webkit-scrollbar-thumb:horizontal': {
              backgroundColor: theme.palette.primary.main,
              height: pxToRem(1),
              ml: pxToRem(28),
              mr: pxToRem(28),
            },
            '&::-webkit-scrollbar-thumb': {
              ml: pxToRem(28),
              mr: pxToRem(28),
            },
            '&::-webkit-scrollbar-track': {
              ml : pxToRem(28),
              mr: pxToRem(28),
              backgroundColor: '#EEEEEE',
            },
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
              mr: pxToRem(28),
            }}
          >
            {mbtiCards.map((mbti: IMbtiResult, index: number)=>{
              return(
                <Stack 
                  key={index} 
                  sx={{
                    textAlign: 'center',
                    backgroundColor: `${mbti.resultCardAttr}` ? JSON.parse(`${mbti.resultCardAttr}`).bgCol : '#FFF3F1',
                    color: `${mbti.resultCardAttr}` ? JSON.parse(`${mbti.resultCardAttr}`).txtCol : '#000000',
                    borderRadius: pxToRem(20),
                    mb: `${pxToRem(20)} !important`,
                    ml: index == 0 ? pxToRem(28) : 0
                  }}
                  minWidth={pxToRem(240)}
                  onClick={() => navigate(`/contents/mbti/${mbti.mbtiSid}/result/type/${mbti.mbtiTestResultTypeId}`, {replace: true,})}
                >
                  <Stack sx={{ px: pxToRem(20), pt: pxToRem(48), pb: pxToRem(46), position: 'relative' }}>
                    <Box sx={{ pb: pxToRem(30) }}>
                      <Typography variant={'Kor_14_r'}>{mbti.resultTypeSubNm}</Typography><br />
                      <Typography variant={'Kor_20_b'}>{mbti.resultTypeNm}</Typography>
                    </Box>
                    <Image
                      draggable={false} 
                      src={ mbti.thumbnlPath ? (REACT_APP_IMAGE_STORAGE + mbti.thumbnlPath) : 'assets/default-goods.svg'} 
                      ratio={'1/1'}
                      width={pxToRem(200)}
                      height={pxToRem(200)}
                    />
                    <IconRight 
                      style={{
                        position: 'absolute',
                        width: pxToRem(32),
                        height: pxToRem(32),
                        right: pxToRem(10),
                        bottom: pxToRem(10),
                      }}/>
                  </Stack>
                </Stack>
              )
            })}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
});

export default MbtiCardMany;