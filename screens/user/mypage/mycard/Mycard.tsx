import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useStores } from "../../../../models/root-store/root-store-context"
import { PATH_AUTH, PATH_PAGE, PATH_ROOT } from '../../../../routes/paths';
import {
  useTheme,
  Stack,
  Divider,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Tab,
  Tabs,
  Drawer,
  Card,
  alpha,
} from '@mui/material';
import share from 'src/utils/share';
import { blue, grey } from '@mui/material/colors';
import Iconify from 'src/components/iconify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CustomerHeader } from 'src/components/CustomerHeader';
import { HEADER } from 'src/config-global';
import Carousel from 'src/components/carousel';
import { MotionContainer, varFlip, varBounce } from 'src/components/animate';
import { VariantsType } from 'src/components/animate/types';
import { motion, m, useScroll, useSpring } from 'framer-motion';
import { CallApiToStore, numberComma } from 'src/utils/common';

import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close-small.svg';
import { ReactComponent as CheckIcon } from 'src/assets/icons/ico-check.svg';
import { ReactComponent as IconPlay } from 'src/assets/icons/ico-play.svg';
import { ReactComponent as IconShare } from 'src/assets/icons/ico-share.svg';
import { ReactComponent as IconFlip } from 'src/assets/icons/ico-flip.svg';
import { pxToRem } from 'src/theme/typography';

/**
 * ## Mycard 설명
 *
 */
interface Props {
  // type?: string
}
export const Mycard = observer(({
  // type = 'dna',
}:Props) => {
  const { type = '' } = useParams();
  const tempFilterCode = [
    {
      code: '10001',
      value: '전체',
      pcode: '100',
    },
    {
      code: '10002',
      value: '운동',
      pcode: '100',
    },
    {
      code: '10003',
      value: '피부/모발',
      pcode: '100',
    },
    {
      code: '10004',
      value: '식습관',
      pcode: '100',
    },
    {
      code: '10005',
      value: '개인특성',
      pcode: '100',
    },
    // {
    //   code: '10006',
    //   value: '개인특성',
    //   pcode: '100',
    // },
  ];
  const makeFilterDropdown = () => {
    const dropdownList = tempFilterCode.map((filter) => {
      return (
        <Stack key={`type-filter-${filter.code}`} direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            setCardType(filter);
            setOpenCardType(false);
          }}
        >
          <Typography variant={'body1'} sx={{ textAlign: 'left', color: 'text.primary' }}>
            {filter.value}
          </Typography>
          <CheckIcon fill={cardType.code === filter.code ? theme.palette.secondary.main : theme.palette.grey[300]} />
        </Stack>
      )
    })

    return dropdownList;
  };

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  let firstIndex = type === 'mbti' ? 1 : 0;

  const [tabValue, setTabValue] = useState(firstIndex);
  const [testResultFilter, setTestResultFilter] = useState(false);

  const [cardType, setCardType] = useState({
    code: '10001',
    value: '전체',
    pcode: '100',
  });
  const [openCardType, setOpenCardType] = useState(false);
  const [viewStyle, setViewStyle] = useState<'card'|'grid'>('card');

  const [flip, setFlip] = useState(false);

  const contentRef = useRef<any>(null);
  const carouselRef = useRef<Carousel | null>(null);
  const [currentIndex, setCurrentIndex] = useState(firstIndex);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    carouselRef.current?.slickGoTo(newValue)
    contentRef.current?.scrollIntoView(100);
    setTabValue(newValue);
  };

  const handleShare = async () => {
    // alert('https 환경에서 정상작동 합니다.');

    const res = await share({
      title: '테스트 타이틀',
      text: '테스트 텍스트' || '',
      url: 'https://devf2d.surfinn.kr/contents/mbti/1' // TODO add short url
    });

    if (res === "copiedToClipboard") {
      alert("링크를 클립보드에 복사했습니다.");
    } else if (res === "failed") {
      alert("공유하기가 지원되지 않는 환경입니다.");
    }
  }

  const handleFlip = () => {
    setFlip(!flip);
  }

  function a11yProps(index: number) {
    return {
      id: `mycard-tab-${index}`,
      'aria-controls': `mycard-tabpanel-${index}`,
    };
  }

  const carouselSettings = {
    dots: false,
    arrows: false,
    autoplay: false,
    draggable: true,
    slidesToShow: 1,
    initialSlide: firstIndex,
    rtl: false,
    speed: 400,
    infinite: true,
    // easing: 'easeOut',
    centerMode: false,
    swipeToSlide: true,
    adaptiveHeight: false,
    beforeChange: (current: number, next: number) => setTabValue(next),
  };

  const transition: VariantsType = {
    durationIn: 1,
    durationOut: 1,
    easeIn: 'easeIn',
    easeOut: 'easeOut',
  };

  useEffect(() => {
    const changeIndex = type === 'mbti' ? 1 : 0;
    setTabValue(changeIndex);
  }, [type])

  useEffect(() => {
    setCardType({
      code: '10001',
      value: '전체',
      pcode: '100',
    });
  }, [])

  return (
    <>
      <CustomerHeader
        title="나의 카드"
        handleClose={() => {
          navigate(-1);
        }}
      />
      <Stack sx={{
        position: 'sticky',
        top: 0,
        height: 40,
        minHeight: 40,
        zIndex: 101,
        // px: 3,
        py: {
          md: 2,
        },
        pb: {
          xs: 2
        },
        borderBottom: 0,
        overflowX: 'scroll',
        background: '#FFFFFF',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        justifyContent: 'center',
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="mycard tabs"
          variant="fullWidth"
          sx={{
            minHeight: 38,
            height: 38,
            '& .MuiTab-root:not(:last-of-type)': {
              mr: 2
            },
          }}
        >
          <Tab
            label="DNA"
            {...a11yProps(0)}
            sx={{
              '&:not(.Mui-selected)': {
                color: theme.palette.grey[400],
              },
            }}
          />
          <Tab
            label="MBTI"
            {...a11yProps(1)}
            sx={{
              '&:not(.Mui-selected)': {
                color: theme.palette.grey[400],
              },
            }}
          />
        </Tabs>
      </Stack>
      <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto', scrollMarginTop: '100px' }}>

        <Box sx={{ flex: 1, scrollMarginTop: '130px', height: '100%', width: '100%', }} ref={contentRef}>

          <Carousel ref={carouselRef} {...carouselSettings}>
            <Box sx={{ flexGrow: 1 }}>
              <Stack
                spacing={2}
                sx={{
                  px: 2.5,
                }}
              >
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <Button
                    variant={'text'}
                    disableFocusRipple
                    disableRipple
                    disableTouchRipple
                    endIcon={<Iconify width={14} icon={'ep:arrow-down'} />}
                    sx={{ color: alpha(theme.palette.common.black, .7), '&:hover': { background: 'none' } }}
                    onClick={() => {
                      setOpenCardType(true);
                    }}
                  >
                    {`${cardType.value}(73)`}  {/* 선택한 결과 카드 필터링 및 해당 결과 건 수 표시 */}
                  </Button>
                  <Button
                    sx={{
                      fontWeight: 600,
                      fontSize: pxToRem(12),
                      color: testResultFilter ? '#202123' : '#C6C7CA',
                    }}
                    onClick={
                      ()=>{
                        setTestResultFilter(!testResultFilter);
                      }
                    }
                  >
                    <CheckIcon fill={testResultFilter ? theme.palette.primary.main : '#C6C7CA'} />
                    검사완료 카드만 보기
                  </Button>
                </Stack>
                <Box sx={flipCard}>
                  <Box sx={[flipCardInner, flip ? flipEvent : {}]}>
                    <Card elevation={0} sx={[{ boxShadow: 'none', background: '#ECF8F1' }, flipCardFront]}>
                      <Stack sx={{px: 2.5, pt: 5, pb: 10}}>
                        {
                          // <Box component={'img'} src={'/assets/placeholder.svg'} width={'100%'} />
                        }
                        <Typography variant='subtitle1' sx={{ color: '#69CA90' }}>식욕</Typography>
                        <Box component={'img'} src={'/assets/images/temp/dna-item-image-2.svg'} width={'100%'} maxHeight={360} />
                        <Typography sx={{ fontSize: pxToRem(28), fontWeight: 700, color: '#202123' }}>떠오르는 먹방 유튜버</Typography>
                        <Typography variant='body1' sx={{ color: '#202123' }}>일상이 라이브 먹방</Typography>
                      </Stack>
                      <Stack direction={'row'} alignItems={'center'} justifyContent={'flex-end'} sx={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        width: '100%',
                      }}>
                        <Box
                          display={'flex'}
                          sx={[{
                            mr: 1,
                          }, cardButtonStyle]}
                          onClick={()=>{
                            handleShare();
                          }}>
                            <IconShare fill={'#202123'} width={20} height={20} />
                        </Box>
                        <Box
                          display={'flex'}
                          sx={cardButtonStyle}
                          onClick={()=>{
                            handleFlip();
                          }}>
                            <IconFlip fill={'#202123'} width={20} height={20} />
                        </Box>
                      </Stack>
                    </Card>
                    <Card elevation={0} sx={[{ boxShadow: 'none', background: '#ECF8F1' }, flipCardBack]}>
                      <Stack sx={{px: 2.5, pt: 5, pb: 10}}>
                        {
                          // <Box component={'img'} src={'/assets/placeholder.svg'} width={'100%'} />
                        }
                        <Typography variant='subtitle1' sx={{ color: '#69CA90' }}>식욕(뒷면)</Typography>
                        <Box component={'img'} src={'/assets/images/temp/dna-item-image-2.svg'} width={'100%'} maxHeight={360} />
                        <Typography sx={{ fontSize: pxToRem(28), fontWeight: 700, color: '#202123' }}>떠오르는 먹방 유튜버</Typography>
                        <Typography variant='body1' sx={{ color: '#202123' }}>일상이 라이브 먹방</Typography>
                      </Stack>
                      <Stack direction={'row'} alignItems={'center'} justifyContent={'flex-end'} sx={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        width: '100%',
                      }}>
                        <Box
                          display={'flex'}
                          sx={[{
                            mr: 1,
                          }, cardButtonStyle]}
                          onClick={()=>{
                            handleShare();
                          }}>
                            <IconShare fill={'#202123'} width={20} height={20} />
                        </Box>
                        <Box
                          display={'flex'}
                          sx={cardButtonStyle}
                          onClick={()=>{
                            setFlip(!flip);
                          }}>
                            <IconFlip fill={'#202123'} width={20} height={20} />
                        </Box>
                      </Stack>
                    </Card>
                  </Box>
                </Box>
                <Box sx={[foldResultCardStyle, { backgroundColor: '#FFF9E5', mt: '20px !important' }]}>
                  <Typography variant='subtitle2' color='#FCC800'>아연 농도</Typography>
                </Box>
                <Box sx={[{ backgroundColor: '#E5F4FE' }, foldResultCardStyle]}>
                  <Typography variant='subtitle2' color='#008FF8'>근력 운동 적합성</Typography>
                </Box>
                <Box sx={[{ backgroundColor: '#FFF3F1' }, foldResultCardStyle]}>
                  <Typography variant='subtitle2' color='#FF8872'>기미/주근깨</Typography>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              MBTI
            </Box>
          </Carousel>
        </Box>
        <Box sx={{
          position: 'absolute',
          width: 60,
          height: 60,
          right: 10,
          bottom: 10,
          borderRadius: 999,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: theme.palette.primary.main,
          p: 0,
          zIndex: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Button onClick={()=>{
            setViewStyle(viewStyle === 'card' ? 'grid' : 'card');
          }}>
            {
              viewStyle === 'card' ? (
                <Box sx={{
                  position: 'relative',
                  width: 24,
                  height: 24,
                }}>
                  <Box sx={[gridButtonIconStyle, {
                    left: 2,
                    top: 2,
                  }]} />
                  <Box sx={[gridButtonIconStyle, {
                    left: 13,
                    top: 2,
                  }]} />
                  <Box sx={[gridButtonIconStyle, {
                    left: 2,
                    top: 13,
                  }]} />
                  <Box sx={[gridButtonIconStyle, {
                    left: 13,
                    top: 13,
                  }]} />
                </Box>
              ) : (
                <Box sx={{
                  position: 'relative',
                  width: 24,
                  height: 24,
                }}>
                  <Box sx={[gridButtonIconStyle, {
                    left: 5,
                    top: 1,
                    width: 14,
                    height: 18,
                  }]} />
                  <Box sx={[gridButtonIconStyle, {
                    left: 6,
                    top: 22,
                    width: 12,
                    height: 0,
                  }]} />
                </Box>
              )
            }
          </Button>
        </Box>

      </Stack>
      <Drawer
        open={openCardType}
        onClose={() => { setOpenCardType(false) }}
        PaperProps={{
          sx: {
            pb: 3,
            width: '100%',
            borderRadius: 3,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
        anchor={'bottom'}
      >
        <Stack spacing={2} sx={{ p: 4 }}>
          <Stack direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant={'h6'} sx={{ textAlign: 'left', color: '#000000', fontWeight: 700 }}>
              카드 유형을 선택해주세요.
            </Typography>
            <CloseIcon fill={theme.palette.common.black} onClick={() => { setOpenCardType(false) }} />
          </Stack>
          {
            makeFilterDropdown()
          }
        </Stack>
      </Drawer>
    </>
  );
});

export default Mycard;

const cardButtonStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  width: 44,
  height: 44,
  py: 0.5,
  px: 1.5,
  background: 'rgba(255, 255, 255, 0.8)',
  // backdropFilter: 'blur(6px)',
  borderRadius: '50%',
}

const foldResultCardStyle = {
  px: 2.5,
  pt: 2,
  pb: 4,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  mt: '-20px !important',
  border: '4px solid #FFFFFF',
}

/** 카드 뒤집기 css */
const flipCard = {
  width: '100%',
  height: 550,
  // border: '1px solid #f1f1f1',
  perspective: '1000px',
}
const flipCardInner = {
  position: 'relative',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  transition: 'transform 0.8s',
  transformStyle: 'preserve-3d',
}
const flipCardFront = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  WebkitBackfaceVisibility: 'hidden', /* Safari */
  backfaceVisibility: 'hidden',
}
const flipCardBack = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  WebkitBackfaceVisibility: 'hidden', /* Safari */
  backfaceVisibility: 'hidden',
  transform: 'rotateY(180deg)',
}
const flipEvent = {
  transform: 'rotateY(180deg)',
}

const gridButtonIconStyle = {
  position: 'absolute',
  width: 9,
  height: 9,
  border: '1.8px solid #FFFFFF',
  borderRadius: 0.125,
}