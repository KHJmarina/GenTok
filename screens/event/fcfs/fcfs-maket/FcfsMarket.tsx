import { Box, Stack, Typography, styled, useTheme, Button, Container } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useLocation, useNavigate, useParams } from 'react-router';
import { PATH_ROOT } from 'src/routes/paths';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CHeader from 'src/components/CHeader';
import { pxToRem } from 'src/theme/typography';
import { CallApiToStore } from 'src/utils/common';
import { ReactComponent as IconMachine } from 'src/assets/icons/ico-machine.svg';
import { MbtiCardOne } from 'src/screens/user/mypage/mbti-card/mbti-card-item/MbtiCardOne';
import { MbtiCardMany } from 'src/screens/user/mypage/mbti-card/mbti-card-item/MbtiCardMany';
import Slider from 'react-slick';
import DnaDetailGoldCard from 'src/screens/user/mypage/dna-result/dna-result-detail/detail-card/DnaDetailGoldCard';
import DnaDetailCard from 'src/screens/user/mypage/dna-result/dna-result-detail/detail-card/DnaDetailCard';
import { convertCtegryToValue } from 'src/screens/user/mypage/Mypage';
import FcfsMarketGoldCard from './FcfsMarketGoldCard';
import FcfsMarketCard from './FcfsMarketCard';
import { m } from 'framer-motion';
import { IDnaResultCard } from 'src/models';
import Image from 'src/components/image';
import { ReactComponent as TwinkleStars } from '../../../user/mypage/dna-result/dna-result-detail/detail-card/stars.svg';
import { Icon } from '@iconify/react';
import { useScrollable } from 'src/hooks/useScrollable';
import { MotionContainer, varFade } from 'src/components/animate';

/**
 * ## FcfsMarket 설명
 *
 */

const marketCardList = [{
  goodsNm: '운동 후 회복능력',
  testResultImgPath: "/assets/images/fcfs/card-01.png",
  testResultNm: "무통의 근육맨",
  testResultSummary: "파스는 패스!",
  thumbnlPath: "/assets/images/fcfs/card-01.png",
},
{
  goodsNm: '불면증',
  testResultImgPath: "/assets/images/fcfs/card-02.png",
  testResultNm: "퀵수면 모드",
  testResultSummary: "머리만 닿으면 딥슬립",
  thumbnlPath: "/assets/images/fcfs/card-02.png",
},
{
  goodsNm: '원형탈모',
  testResultImgPath: "/assets/images/fcfs/card-03.png",
  testResultNm: "뿌리깊은 모낭",
  testResultSummary: "힘들어도 무너지지 않아",
  thumbnlPath: "/assets/images/fcfs/card-03.png",
},
{
  goodsNm: '식욕',
  testResultImgPath: "/assets/images/fcfs/card-04.png",
  testResultNm: "싱겁게먹기동호회 회장",
  testResultSummary: "먹어봤자 티스푼",
  thumbnlPath: "/assets/images/fcfs/card-04.png",
},
{
  goodsNm: '남성형 탈모',
  testResultImgPath: "/assets/images/fcfs/card-05.png",
  testResultNm: "불멸의 머털도사",
  testResultSummary: "신묘한 머리카락",
  thumbnlPath: "/assets/images/fcfs/card-05.png",
}
]



export const FcfsMarket = observer(() => {

  const theme = useTheme();
  const rootStore = useStores();
  const { loadingStore, mbtiCardStore, dnaResultStore, dnaCardDetailStore } = rootStore;
  const navigate = useNavigate();
  const [isRender, setIsRender] = useState(false);

  const getMine = async () => {
    CallApiToStore(mbtiCardStore.get(), 'api', loadingStore)
      .then(() => {
        setIsRender(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getMine();
  }, []);


  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setWidth(Math.max(Math.min(window.innerWidth, 768) - 24, 300));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 'none',
    repeat: Infinity,
  } as const;

  useEffect(() => {
    const handleResize = () => {
      setWidth(Math.max(Math.min(window.innerWidth, 768) - 24, 300));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const dragRef = useRef<HTMLDivElement>(null);
  useScrollable(dragRef, 'x');

  return (
    <>
      <Box sx={{ width: '100%', mb: pxToRem(40), cursor: 'pointer' }}>
        <Container
          component={MotionContainer}
          sx={{
            width: '100%',
            px: 0,
            '@media (min-width: 600px)': {
              px: 0
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
                ml: pxToRem(28),
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
                width: 'fit-content',
                mr: pxToRem(28),
              }}
            >
              {/* {dnaResultStore.myResult.resultList.map((card, i: number) => */}
              {marketCardList.map((card, i: number) =>
                <FcfsMarketGoldCard key={`fcfs-market-${i}`} dnaCard={card} />
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* 이동버튼 */}
      <Stack sx={{ justifyContent: 'center', width: '100%', px: pxToRem(20), pt: pxToRem(0) }}>
        <Button
          variant={'contained'}
          disabled={false}
          size={'large'}
          type={'submit'}
          sx={{
            borderRadius: pxToRem(50),
            fontWeight: 600,
            lineHeight: 24 / 16,
            fontSize: pxToRem(16),
            letterSpacing: '-0.03em',
            pt: pxToRem(12),
          }}
          // onClick={() => navigate(`${PATH_ROOT.market}`)}
          onClick={() => {
            window.location.href = '/intro/intro.html';
          }}
        >
          젠톡 서비스 Tok! 만나보기 <Box component={Icon} icon={'ep:arrow-right-bold'} sx={{ cursor: 'pointer', color: '#ffffff', ml: 1 }}></Box>
        </Button>
      </Stack>
    </>
  );
});

export default FcfsMarket;
