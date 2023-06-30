import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { createRef, useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Button, Card, Stack, Typography, useTheme, Divider } from '@mui/material';
import { ReactComponent as IconDownload } from 'src/assets/icons/ico-download.svg';
import { ReactComponent as IconShare } from 'src/assets/icons/ico-share.svg';
import { ReactComponent as IconHeart } from 'src/assets/icons/ico-heart.svg';
import { ReactComponent as IconRefresh } from 'src/assets/icons/ico-refresh.svg';
import { ReactComponent as IconOnePick } from 'src/assets/icons/ico-onepick.svg';
import { ReactComponent as IconHeartOn } from 'src/assets/icons/ico-heart-on.svg';
import { grey } from '@mui/material/colors';
import { HEADER, SPACING } from 'src/config-global';
import html2canvas from 'html2canvas';
import {
  detectMobileDevice, sendReactNativeMessage, numberComma, CallApiToStore,
} from 'src/utils/common';
import share from 'src/utils/share';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useNavigate, useParams } from 'react-router';
import Recommend from '../../recommend/Recommend';
import { pxToRem } from 'src/theme/typography';
import Header from 'src/layouts/mobile/Header';
import CShareAlert from 'src/components/CShareAlert';
import { Comment } from '../../comment/Comment';

/**
 * ## Result 설명
 *
 */
interface Props {
  handleClose: VoidFunction;
  type?: string;
}
export const GameResult = observer(({ handleClose, type = 'game' }: Props) => {
  const { user, isAuthenticated } = useAuthContext();
  const rootStore = useStores();
  const { userStore, mbtiStore, loadingStore, gameStore } = rootStore;
  const theme = useTheme();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false)
  const { REACT_APP_API_URL } = process.env;

  const [dot, setDot] = useState(true); //TODO dot 여부는 api로 수정 예정
  const [dotStyle, setDotStyle] = useState('');

  const params = useParams();
  const { gameSid, gameTestResultTypeId } = params;


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
      }).then((canvas: any) => {
        onSaveAs(canvas.toDataURL('image/png'), gameStore.result?.resultTitle + '.png');
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
      // title: gameStore.game.gameNm,
      // text: gameStore.game.gameDescr || gameStore.game.gameNm,
      url: window.location.href,
    });

    if (res === 'copiedToClipboard') {
      alert('링크를 클립보드에 복사했습니다.');
    } else if (res === 'failed') {
      alert('공유하기가 지원되지 않는 환경입니다.');
    }
  };

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 70 ? 100 : prevProgress + Math.random() * 30));
    }, 250);
    return () => {
      clearInterval(timer);
      gameStore.resetResult();
    };
  }, []);

  const resultCardAttr = (gameStore.result?.resultCardAttr &&
    JSON.parse(gameStore.result.resultCardAttr)) || {
    bgColor: '#FFF3F1',
    txtColor: '#000000',
  };
  const bgColor = resultCardAttr.bgCol || '#000';
  const txtColor = resultCardAttr.txtCol || '#fff';

  const resultDescr =
    (gameStore.result?.resultDescr && JSON.parse(gameStore.result.resultDescr)) || [];

  const handleLike = () => {
    // 이모션(400101 : 좋아요, 400102: 싫어요)
    const emotionCd = gameStore.game.myEmotionCd?.code === 400101 ? 400102 : 400101;
    CallApiToStore(gameStore.addLike(gameStore.game.gameSid, emotionCd), 'api', loadingStore).then(
      () => { },
    );
  };

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [progress]);

  if (gameStore.result) {
    return (
      <>
        <Header />
        <Stack
          id="wraps"
          ref={scrollContent}
          sx={{
            m: '0 auto',
            maxWidth: 'md',
            flex: 1,
            height: '100%',
            overflow: 'auto',
            pt: `${HEADER.H_MOBILE + SPACING}px`,
          }}
          onScroll={() => {
            setShowCouponButton((scrollContent.current as HTMLElement).scrollTop > 500);
          }}
        >
          {/* 게임결과 카드 */}
          <Stack
            id={'result-card'}
            spacing={2}
            sx={{ flex: 1, textAlign: 'left', p: pxToRem(20), pt: pxToRem(6) }}
          >
            <Card sx={{ background: bgColor, mb: 1, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                <Stack
                  justifyContent={'center'}
                  alignItems={'center'}
                  sx={{ my: 8, textAlign: 'center', borderRadius: 2, width: '100%' }}
                >
                  <Typography
                    sx={{
                      fontWeight: 400,
                      lineHeight: 26 / 18,
                      fontSize: pxToRem(18),
                      letterSpacing: '-0.03em',
                      color: txtColor,
                    }}
                  >
                    {gameStore.result?.resultSubTitle}
                  </Typography>
                  <Typography variant={'Kor_30_b'} sx={{ color: txtColor, width: '90%' }}>
                    {gameStore.result?.resultTitle}
                  </Typography>
                  <Box
                    id="shareImage"
                    component={'img'}
                    src={
                      REACT_APP_IMAGE_STORAGE +
                      (gameStore.result.thumbnlPath || '/assets/placeholder.svg')
                    }
                    sx={{ my: 2, borderRadius: 2, width: '90%' }}
                  />
                </Stack>
                <Stack
                  data-html2canvas-ignore
                  direction={'row'}
                  spacing={1}
                  justifyContent={'flex-end'}
                  sx={{ position: 'absolute', bottom: 0, right: 0, p: 3 }}
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
                  {/* <Box
                    sx={{
                      borderRadius: '50%',
                      background: txtColor === '#000000' ? '#FFFFFF' : '#FFFFFF2a',
                      p: 1,
                      width: 40,
                      height: 40,
                    }}
                    onClick={handleShare}
                  >
                    <IconShare width={20} height={20} fill={txtColor} />
                  </Box> */}
                </Stack>
              </Box>
            </Card>

            {resultDescr.map((item: any, i: number) => {
              const tt = item.title?.replace(
                /__nickNm__/gi,
                isAuthenticated ? user?.userNm + '님' : '당신',
              );
              return (
                <Stack key={'result-desc-' + i} spacing={1} sx={{ pb: 2 }}>
                  <Typography variant={'Kor_22_b'}>{tt}</Typography>
                  <Typography variant="Kor_16_r" sx={{ px: pxToRem(20) }}>
                    <Typography component={'ul'}>
                      {item.contents.map((str: string, j: number) => {
                        const content = str.replace(
                          /__nickNm__/gi,
                          isAuthenticated ? user?.userNm + '님' : '당신',
                        );
                        return (<Typography
                          key={`desc-${i}-${j}`}
                          component={item.listStyleType ? 'li' : 'span'}
                          sx={{ listStyle: item.listStyleType ? item.listStyleType : '' }}
                        >
                          {content}
                        </Typography>)
                      })}
                    </Typography>
                  </Typography>
                </Stack>
              );
            })}

            <Stack
              data-html2canvas-ignore
              direction={'row'}
              justifyContent={'center'}
              spacing={1.5}
            >
              <Box
                sx={{
                  minWidth: 86,
                  minHeight: 86,
                  borderRadius: '50%',
                  p: 2,
                  background: grey[50],
                  textAlign: 'center',
                }}
                onClick={handleLike}
              >
                {gameStore.game.myEmotionCd?.code === 400101 ? (
                  <IconHeartOn width={32} height={32} />
                ) : (
                  <IconHeart stroke={'#9DA0A5'} width={32} height={32} />
                )}
                <Typography variant={'body2'} color={grey[500]} sx={{ mt: -1 }}>
                  {numberComma(gameStore.game.likeCnt || 0)}
                </Typography>
              </Box>

              <Box
                sx={{
                  minWidth: 86,
                  minHeight: 86,
                  borderRadius: '50%',
                  p: 2,
                  background: grey[50],
                  textAlign: 'center',
                }}
                onClick={() => { setShareOpen(true); }}
              >
                <IconShare fill={'#9DA0A5'} width={32} height={32} />
                <Typography variant={'body2'} color={grey[500]} sx={{ mt: -1 }}>
                  공유하기
                </Typography>
              </Box>
            </Stack>

            <Stack data-html2canvas-ignore sx={{ py: 2 }}>
              <Button
                variant={'outlined'}
                size={'large'}
                sx={{ borderColor: grey[400], borderRadius: 4, color: grey[400] }}
                onClick={handleClose}
              >
                <IconRefresh fill={grey[400]} /> 게임 다시하기
              </Button>
            </Stack>


          </Stack>

          <Divider />

          <Comment contentSid={Number(gameStore.result.gameSid)} contentsType={'game'} />

          <Divider />

          <Recommend />
        </Stack>
        {shareOpen && (
          <CShareAlert
            isAlertOpen={true}
            alertTitle={'친구에게 공유하기'}
            handleAlertClose={() => {
              setShareOpen(false);
            }}
            shareData={{
              title: gameStore.result?.resultTitle,
              desc: gameStore.result?.resultSubTitle,
              path: 'contents',
              type: '게임',
              Sid: params.id,
              img: REACT_APP_IMAGE_STORAGE && REACT_APP_IMAGE_STORAGE + gameStore.result.thumbnlPath,
              url: `https://gentok.net/contents/game/${params.id}`,
            }}
          />
        )}
      </>
    );
  } else {
    return <>결과가 없습니다</>;
  }
});

export default GameResult;