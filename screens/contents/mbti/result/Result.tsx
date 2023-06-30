import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Button, Grid, Stack, Typography, useTheme, Divider, Slide, LinearProgress, LinearProgressProps, alpha, Dialog, IconButton, Tooltip, TooltipProps, tooltipClasses, styled } from '@mui/material';
import Iconify from 'src/components/iconify';
import { ReactComponent as IconDownload } from 'src/assets/icons/ico-download.svg';
import { ReactComponent as IconShare } from 'src/assets/icons/ico-share.svg';
import { ReactComponent as IconHeart } from 'src/assets/icons/ico-heart.svg';
import { ReactComponent as IconRefresh } from 'src/assets/icons/ico-refresh.svg';
import { ReactComponent as IconOnePick } from 'src/assets/icons/ico-onepick.svg';
import { ReactComponent as IconHeartOn } from 'src/assets/icons/ico-heart-on.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close.svg';
import { grey } from '@mui/material/colors';
import GoodsItem from 'src/screens/home/goods-item/GoodsItem';
import { HEADER, SPACING } from 'src/config-global';
import html2canvas from 'html2canvas';
import { detectMobileDevice, sendReactNativeMessage, CallApiToStore } from 'src/utils/common';
import share from 'src/utils/share';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useNavigate, useParams } from 'react-router';
import { PATH_ROOT } from '../../../../routes/paths';
import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import OnepickSplash from '../../onepick/onepick-splash/OnepickSplash';
import { useScroll } from 'framer-motion';
import { pxToRem } from 'src/theme/typography';
import { ReactComponent as CandyIcon } from 'src/assets/icons/ico-candy.svg';
import { GoodsImages } from 'src/screens/market/components/GoodsImages';
import { IconButtonCart } from 'src/screens/market/assets/icons/IconCart';
import { IGoodsModel } from 'src/models/market-store/Goods';
import Image from 'src/components/image/Image';
import CAlert from 'src/components/CAlert';
import CShareAlert from 'src/components/CShareAlert';
import { Comment } from '../../comment/Comment';
import Scratch from 'src/screens/event/scratch/Scratch';

/**
 * ## Result 설명
 *
 */
interface Props {
  handleClose?: VoidFunction;
  type?: string;
}
export const Result = observer(({ handleClose, type = 'mbti' }: Props) => {
  const { user, isAuthenticated } = useAuthContext();
  const rootStore = useStores();
  const { userStore, mbtiStore, marketStore, couponStore, responseStore, loadingStore } = rootStore;
  const theme = useTheme();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const navigate = useNavigate();
  const { REACT_APP_API_URL } = process.env;

  const params = useParams();
  const { mbtiSid, mbtiTestResultTypeId } = params;

  const [loading, setLoading] = useState(true);
  const [onePickCpnKey, setOnePickCpnKey] = useState<string | null | undefined>('');
  const [shareOpen, setShareOpen] = useState(false)


  useEffect(() => {
    // mbtiSid
    setOnePickCpnKey(mbtiStore.result?.onePickCpnKey);
    if (mbtiSid && mbtiTestResultTypeId) {
      CallApiToStore(mbtiStore.getResult(mbtiSid, mbtiTestResultTypeId), 'api', loadingStore).then(
        () => {
          setLoading(false);
        },
      );
    }
  }, []);

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 60,
    repeat: Infinity,
  } as const;

  const onCapture = () => {
    const node = document.getElementById('result-card');
    if (node) {
      html2canvas(node, {
        useCORS: true,
        scale: 1,
      }).then((canvas: any) => {
        // document.body.appendChild(canvas);
        onSaveAs(canvas.toDataURL('image/png'), mbtiStore.result?.resultTypeNm + '.png');
      });
    }
  };

  const isMobile = detectMobileDevice(navigator.userAgent);

  const onSaveAs = (uri: any, filename: string) => {
    if (userStore.os !== '') {
      sendReactNativeMessage({
        type: 'saveResultCardImage',
        payload: {
          url: uri,
        },
      });
    } else {
      const el = document.createElement('a');
      document.body.appendChild(el);
      el.setAttribute('href', uri);
      // el.setAttribute('target', '_blank');
      el.setAttribute('download', filename);
      el.click();
      document.body.removeChild(el);
    }
  };

  const scrollContent = createRef();
  const [showCouponButton, setShowCouponButton] = useState(false);

  const handleShare = async () => {
    const res = await share({
      title: mbtiStore.mbti.mbtiNm,
      text: mbtiStore.mbti.mbtiDescr || mbtiStore.mbti.mbtiNm,
      url: window.location.href,
    });

    if (res === 'copiedToClipboard') {
      alert('링크를 클립보드에 복사했습니다.');
    } else if (res === 'failed') {
      alert('공유하기가 지원되지 않는 환경입니다.');
    }
  };


  // TODO dark, light 두가지에 따라 결과카드 디자인 변경

  // const [progress, setProgress] = useState(0);
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 70 ? 100 : prevProgress + Math.random() * 30));
  //   }, 250);
  //   return () => {
  //     clearInterval(timer);
  //     mbtiStore.resetResult();
  //   };

  // }, [])

  const resultCardAttr = (mbtiStore.result?.resultCardAttr &&
    JSON.parse(mbtiStore.result.resultCardAttr)) || {
    bgColor: '#FFF3F1',
    txtColor: '#000000',
  };
  const bgColor = resultCardAttr.bgCol;
  const txtColor = resultCardAttr.txtCol;

  const resultDescr =
    (mbtiStore.result?.resultDescr && JSON.parse(mbtiStore.result.resultDescr)) || [];

  const handleLike = () => {
    // 이모션(400101 : 좋아요, 400102: 싫어요)
    const emotionCd = mbtiStore.mbti.myEmotionCd?.code === 400101 ? 400102 : 400101;
    CallApiToStore(mbtiStore.addLike(mbtiStore.mbti.mbtiSid, emotionCd), 'api', loadingStore).then(
      () => { },
    );
  };

  // useEffect(() => {
  //   if (progress >= 100) {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 1000)
  //   }
  // }, [progress]);

  const [openOnpick, setOpenOnpick] = useState(false);

  // if (loading) {
  //   return (
  //     <Stack id="wraps" ref={scrollContent} sx={{ flex: 1, height: '100%', pt: `${HEADER.H_MOBILE + SPACING}px` }}>
  //       <Stack sx={{ background: '#FFF', p: '20px', alignItems: 'center', position: 'fixed', top: 0, zIndex: 1 }}>
  //         <Typography sx={{ maxWidth: '80%', fontSize: '20px', fontWeight: 500, lineHeight: '24px', color: '#202123' }}>
  //           MBTI 결과
  //         </Typography>
  //       </Stack>
  //       <Stack sx={{ flex: 1, justifyContent: 'center', p: 3, pb: 30 }}>
  //         <Typography variant={'h4'} sx={{ color: '#000' }}>
  //           결과를 불러오는 중입니다.
  //         </Typography>
  //         <LinearProgressWithLabel value={progress} />
  //       </Stack>
  //     </Stack>
  //   )
  // }

  const { scrollYProgress, scrollY } = useScroll();
  useEffect(() => {
    scrollYProgress.on('change', (v) => {
      if (v > 0.15) {
        setShowCouponButton(true);
      } else {
        setShowCouponButton(false);
      }
    });
  }, [scrollYProgress]);

  /**
   * recommend ..
   */
  useEffect(() => {
    marketStore.findMarketMainGoods();
  }, []);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const handleOnClickCart = useCallback(
    (data: IGoodsModel) => {
      if (data.saleStateCd?.code !== 200102) {
        setAlertMessage('판매중인 상품이 아닙니다.');
        setAlertOpen(true);
        return;
      }
      if (!!data.purchaseYn) {
        setAlertMessage('이미 구매한 상품입니다.');
        setAlertOpen(true);
        return;
      }
      marketStore?.toggleGoodsToCart(data);
    },
    [marketStore],
  );

  const handleOnSelect = useCallback(
    (data: IGoodsModel) => {
      navigate(`/market/goods/${data.goodsSid!}`);
    },
    [navigate],
  );

  const [openAlert, setOpenAlert] = useState(false);

  const checkDrawStts = () => {
    navigate('/event/scratch', { replace: true })
    // couponStore.checkDrawStts(onePickCpnKey, mbtiSid).then((res: any) => {
    //   if (res.responseInfo.resultCode === 'S') {
    //     setOpenOnpick(true);
    //   } else {
    //     if (res.responseInfo.resultCode === 'F') {
    //       setAlertMessage(res.responseInfo.errorMessage);
    //       setOpenAlert(true);
    //     } else {
    //       alert('알 수 없는 오류가 발생하였습니다.');
    //     }
    //   }
    // });
  };

  if (!loading && mbtiStore.result) {
    return (
      <>
        <Stack
          id="wraps"
          ref={scrollContent}
          sx={{ flex: 1, height: '100%' }}
        // onScroll={() => {
        //   setShowCouponButton((scrollContent.current as HTMLElement).scrollTop > 200)
        // }}
        >
          <Stack sx={{ p: '20px', pt: '10px', textAlign: 'left' }} id={'result-card'}>
            <Stack spacing={2} justifyContent={'center'} sx={{}}>
              <Box sx={{ background: bgColor, mb: '24px', borderRadius: '20px', width: '100%' }}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <Stack
                    justifyContent={'center'}
                    alignContent={'center'}
                    sx={{ py: '48px', px: '20px', textAlign: 'center' }}
                  >
                    <Typography sx={{ fontSize: pxToRem(18), color: alpha(txtColor, 0.4) }}>
                      {mbtiStore.result?.resultTypeSubNm}
                    </Typography>
                    <Typography variant={'Kor_30_b'} component={'h2'} sx={{ color: txtColor }}>
                      {mbtiStore.result?.resultTypeNm}
                    </Typography>
                    {/* <Box component={'img'} src={REACT_APP_IMAGE_STORAGE + (mbtiStore.result.thumbnlPath || '/assets/placeholder.svg')} width={'100%'} maxWidth={335} sx={{ my: '32px' }} /> */}
                    <Image
                      id="shareImage"
                      src={
                        REACT_APP_IMAGE_STORAGE +
                        (mbtiStore.result.thumbnlPath || '/assets/placeholder.svg')
                      }
                      width={'100%'}
                      maxWidth={335}
                      sx={{ my: '32px' }}
                    />
                  </Stack>
                  <Stack
                    data-html2canvas-ignore
                    direction={'row'}
                    spacing={1}
                    justifyContent={'flex-end'}
                    sx={{ position: 'absolute', bottom: 0, right: 0, p: '20px' }}
                  >
                    <Box
                      sx={{
                        borderRadius: '50%',
                        background: txtColor === '#000000' ? '#FFFFFF' : '#FFFFFF2a',
                        p: 1,
                        width: 40,
                        height: 40,
                      }}
                      onClick={onCapture}
                    >
                      <IconDownload fill={txtColor} />
                    </Box>
                    {/* <Box sx={{ borderRadius: '50%', background: txtColor === '#000000' ? '#FFFFFF' : '#FFFFFF2a', p: 1, width: 40, height: 40 }}><IconShare width={20} height={20} fill={txtColor} /></Box> */}
                  </Stack>
                </Box>
              </Box>

              {resultDescr.map((item: any, i: number) => {
                const tt = item.title.replace(
                  /__nickNm__/gi,
                  isAuthenticated ? user?.userNm + '님' : '당신',
                );
                return (
                  <Stack key={'result-desc-' + i} spacing={1} sx={{ pb: 2 }}>
                    <Typography variant={'Kor_22_b'} component={'h5'}> {tt} </Typography>
                    <Box
                      sx={{
                        px: '20px',
                        '& li': {
                          fontSize: '1rem',
                          fontWeight: 400,
                          lineHeight: '24px',
                          letterSpacing: '-0.03em',
                          color: '#5D6066',
                        },
                      }}
                    >
                      <Typography component={'ul'}>
                        {item.contents.map((str: string, j: number) => {
                          const content = str.replace(
                            /__nickNm__/gi,
                            isAuthenticated ? user?.userNm + '님' : '당신',
                          );
                          return (<Typography
                            key={`desc-${i}-${j}`}
                            component={item.listStyleType ? 'li' : 'span'}
                            sx={{ listStyle: item.listStyleType ? `${item.listStyleType}` : '4' }}
                          >
                            {content}
                          </Typography>)
                        })}
                      </Typography>
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
            {(mbtiStore.result.best || mbtiStore.result.worst) && (
              <Stack
                // data-html2canvas-ignore
                spacing={2}
                sx={{ py: '20px' }}
              >
                <Typography variant={'Kor_22_b'}>단짝 추천</Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={1} sx={{ borderRadius: '10px' }}>
                    <Grid item xs={6} sx={{ display: 'flex', p: 0, m: 0 }}>
                      {mbtiStore.result.best && (
                        <Stack
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          sx={{
                            p: '20px',
                            border: '1px solid ' + theme.palette.divider,
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant={'Kor_16_b'}
                            component={'h6'}
                            sx={{ color: '#202123' }}
                          >
                            {mbtiStore.result.best.summary}
                          </Typography>
                          <Box
                            component={'img'}
                            src={
                              REACT_APP_IMAGE_STORAGE +
                              (mbtiStore.result.best.thumbnlPath || '/assets/placeholder.svg')
                            }
                            width={'100%'}
                            sx={{ my: 2 }}
                          />
                          <Typography variant={'Kor_14_r'} sx={{ color: '#5D6066' }}>
                            {mbtiStore.result.best.typeNm}
                          </Typography>
                        </Stack>
                      )}
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex', p: 0, m: 0, flexGrow: 1 }}>
                      {mbtiStore.result.worst && (
                        <Stack
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          sx={{
                            p: '20px',
                            border: '1px solid ' + theme.palette.divider,
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant={'Kor_16_b'} component={'h6'}>
                            {mbtiStore.result.worst.summary}
                          </Typography>
                          <Box
                            component={'img'}
                            src={
                              REACT_APP_IMAGE_STORAGE +
                              (mbtiStore.result.worst.thumbnlPath || '/assets/placeholder.svg')
                            }
                            width={'100%'}
                            sx={{ my: 2 }}
                          />
                          <Typography variant={'Kor_14_r'} sx={{ color: '#5D6066' }}>
                            {mbtiStore.result.worst.typeNm}
                          </Typography>
                        </Stack>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            )}

            <Stack
              data-html2canvas-ignore
              direction={'row'}
              justifyContent={'center'}
              spacing={1.5}
              sx={{ py: '20px' }}
            >
              <Box
                sx={{
                  minWidth: 70,
                  minHeight: 70,
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: '#FAFAFA',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                // onClick={handleShare}
                onClick={() => { setShareOpen(true) }}
              >
                <IconShare fill={'#9DA0A5'} width={28} height={28} />
                <Typography variant={'Kor_12_r'} component={'div'} sx={{ color: '#9DA0A5' }}>
                  공유하기
                </Typography>
              </Box>
            </Stack>

            <Stack data-html2canvas-ignore sx={{ py: 3 }}>
              <Button
                variant={'outlined'}
                size={'large'}
                sx={{ borderColor: grey[400], borderRadius: 4, color: grey[400] }}
                onClick={() => {
                  navigate(`/contents/mbti/${mbtiSid}`);
                }}
              >
                <IconRefresh fill={grey[400]} /> 테스트 다시하기
              </Button>
            </Stack>
          </Stack>

          <Divider />

          <Comment contentSid={Number(mbtiSid)} contentsType={'mbti'} />

          <Divider />


          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ padding: '20px', pt: '25px' }}
          >
            <Typography variant={'Kor_22_b'} sx={{ display: 'flex', alignItems: 'center' }}>
              <CandyIcon style={{ marginRight: 8, alignSelf: 'baseline' }} />
              <span style={{}}>추천 유전자</span>
            </Typography>

            <Box
              onClick={() => navigate(PATH_ROOT.market.root, { replace: true })}
              sx={{ pb: '3px' }}
            >
              <Typography variant={'Kor_13_r'} color={grey[500]}>
                더보기
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ flexGrow: 1, pb: 6 }}>
            <Grid container spacing={1} justifyContent={'space-between'} sx={{ px: '20px' }}>
              {marketStore.mainGoods.map((item, index) => {
                return (
                  <Grid item xs={6} sm={6} md={6} key={`suggestion-${item.goodsSid}`}>
                    <Box sx={gridStyles.suggestion_cartAndImage}>
                      <Box onClick={() => handleOnSelect(item)} flex={1} sx={{}}>
                        <GoodsImages goods={item} />
                      </Box>
                      {!item.packageYn && (
                        <IconButtonCart
                          onClick={() => handleOnClickCart(item)}
                          active={!!item.inCartYn}
                          sx={gridStyles.suggestion_cartButton}
                        />
                      )}
                    </Box>

                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                    >
                      <Typography
                        variant="Kor_18_b"
                        component={'div'}
                        sx={gridStyles.suggestion_title}
                      // onClick={onSelect}
                      >
                        {item.goodsNm}
                      </Typography>
                      <Typography
                        variant="Kor_14_b"
                        component={'div'}
                        sx={gridStyles.suggestion_summary}
                      >
                        {item.goodsSummary}
                      </Typography>
                      <Typography
                        variant="Kor_14_b"
                        component={'div'}
                        sx={gridStyles.suggestion_selPrice}
                      >
                        {item.dispDscntRate != null && item.dispDscntRate > 0 && (
                          <span
                            style={{ color: theme.palette.primary.main, paddingRight: pxToRem(4) }}
                          >
                            {item.dispDscntRate}%
                          </span>
                        )}
                        {item.goodsAmtKWN}
                        {item.currencyCd?.value}
                      </Typography>
                      {item.goodsAmtKWN != item.priceKWN && (
                        <Typography
                          variant="Kor_12_b"
                          component={'div'}
                          sx={gridStyles.suggestion_oriPrice}
                        >
                          {item.priceKWN}
                          {item.currencyCd?.value}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Stack>
        <Slide direction="up" in={showCouponButton && !openOnpick} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'fixed',
              left: 0,
              right: 0,
              zIndex: 999999,
              bottom: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              color={'primary'}
              variant={'contained'}
              size={'large'}
              onClick={() => {
                checkDrawStts();
              }}
              sx={{
                height: 70,
                width: '100%',
                maxWidth: 'md',
                borderRadius: 4,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                boxShadow: theme.shadows[24],
              }}
            >
              <IconOnePick /> &nbsp; 반값 할인 쿠폰 응모하기
            </Button>
          </Box>
        </Slide>

        {alertOpen && (
          <CAlert
            isAlertOpen={alertOpen}
            alertCategory={'error'}
            alertContent={alertMessage}
            handleAlertClose={() => {
              setAlertOpen(false);
            }}
          />
        )}

        {openAlert && (
          <Dialog
            open={openAlert}
            PaperProps={{
              sx: {
                minWidth: '300px',
                p: '25px !important',
                borderRadius: '25px !important',
              },
            }}
            onClose={() => {
              setOpenAlert(false);
            }}
            sx={{
              margin: '0 !important',
              zIndex: theme.zIndex.modal,
              padding: 0,
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'end', p: 0, mb: 2 }}>
              <CloseIcon
                stroke={theme.palette.common.black}
                onClick={() => {
                  setOpenAlert(false);
                }}
              />
            </Stack>
            <Typography variant="body1" align="center">
              {alertMessage}
            </Typography>
            <Stack direction={'row'} gap={1}>
              <Button
                variant="outlined"
                size={'large'}
                sx={{ mt: 3, borderRadius: 3, width: '100%' }}
                onClick={() => {
                  setOpenAlert(false);
                  navigate('/contents/mbti');
                }}
              >
                유형테스트
              </Button>
              <Button
                variant="contained"
                size={'large'}
                sx={{ mt: 3, borderRadius: 3, width: '100%' }}
                onClick={() => {
                  setOpenAlert(false);
                  navigate('/');
                }}
              >
                홈으로
              </Button>
            </Stack>
          </Dialog>
        )}

        {/* {openOnpick && (
          <Dialog
            key={`mbti-result`}
            fullWidth
            hideBackdrop
            keepMounted
            maxWidth={'md'}
            open={openOnpick}
            TransitionComponent={Transition}
            disableEscapeKeyDown
            PaperProps={{
              sx: {
                p: '0 !important',
                m: '0 !important',
                maxHeight: '100%',
                minHeight: '100%',
                borderRadius: '0 !important',
                boxShadow: 'none',
              },
            }}
            onClose={() => {
              setOpenOnpick(false);
            }}
            sx={{
              margin: '0 !important',
              zIndex: 1200,
              padding: '0 !important',
              borderRadius: 0,
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <OnepickSplash
              onePickCpnKey={onePickCpnKey}
              handleClose={() => {
                setOpenOnpick(false);
              }}
            />
          </Dialog>
        )} */}

        {shareOpen && (
          <CShareAlert
            isAlertOpen={true}
            alertTitle={'친구에게 공유하기'}
            handleAlertClose={() => {
              setShareOpen(false);
            }}
            shareData={{
              title: mbtiStore.result?.resultTypeNm,
              desc: mbtiStore.result?.resultTypeSubNm,
              path: 'contents',
              type: 'MBTI',
              Sid: params.mbtiSid,
              img: REACT_APP_IMAGE_STORAGE && REACT_APP_IMAGE_STORAGE + mbtiStore.result.thumbnlPath,
              url: `https://gentok.net/contents/mbti/${params.mbtiSid}/result/type/${mbtiStore.result?.mbtiTestResultTypeId}`,
              contsResult: mbtiStore.result?.mbtiTestResultTypeId
            }}
          />
        )}
      </>
    );
  } else {
    return <>{/* 결과를 불러오는 중입니다 */}</>;
  }
});

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const gridStyles = {
  suggestion_title: {
    pt: 1,
  },
  suggestion_summary: {
    pt: 0.5,
    textAlign: 'left',
  },
  suggestion_selPrice: {
    pt: 1,
  },
  suggestion_oriPrice: {
    fontWeight: 600,
    color: '#C6C7CA',
    textDecoration: 'line-through',
  },
  suggestion_cartAndImage: {
    position: 'relative',
    border: 'solid 1px #eee',
    borderRadius: 1,
    overflow: 'hidden',
    minHeight: pxToRem(160),
  },
  suggestion_cartButton: {
    position: 'absolute',
    bottom: pxToRem(10),
    right: pxToRem(10),
    padding: 0,
  },
  suggestion_productImage: { width: pxToRem(160), height: pxToRem(160), padding: 0, margin: 0 },
};

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`.${tooltipClasses.tooltip}`]: {
    borderRadius: '8px',
    bottom: '-10px',
    zIndex: 999999
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#5D6066',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#5D6066',
  },
}));

export default Result;
