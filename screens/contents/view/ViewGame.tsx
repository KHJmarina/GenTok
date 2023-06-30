import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Card, Stack, Typography, useTheme, Divider, Chip, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as IconPlay } from 'src/assets/icons/ico-play.svg';
import { ReactComponent as IconShare } from 'src/assets/icons/ico-share.svg';
import { ReactComponent as IconHeart } from 'src/assets/icons/ico-heart.svg';
import share from 'src/utils/share';
import { CallApiToStore, numberComma } from 'src/utils/common';
import _ from 'lodash';
import Recommend from '../recommend/Recommend';
import Comment from '../comment/Comment';
import { IGameSnapshot } from 'src/models';
import { pxToRem } from 'src/theme/typography';
import parse from 'html-react-parser';
import Iconify from 'src/components/iconify/Iconify';
import CShareAlert from 'src/components/CShareAlert';
import CHeader from 'src/components/CHeader';
import { PATH_ROOT } from 'src/routes/paths';
import { Helmet } from 'react-helmet-async';
import { toJS } from 'mobx';
import { useAuthContext } from 'src/auth/useAuthContext';
import CAlert from 'src/components/CAlert';

/**
 * ## ViewGame 설명
 *
 */
interface Props {
  type?: string;
}
export const ViewGame = observer(({type = 'game'}: Props) => {
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const rootStore = useStores();
  const { loadingStore, gameStore, commentStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const scrollRef = useRef<any>(null);
  const params = useParams();
  const { id = '' } = params;
  const { REACT_APP_API_URL } = process.env;

  const { isAuthenticated } = useAuthContext();

  const [shareOpen, setShareOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  // 게임 컨텐츠
  const [content, setContent] = useState<IGameSnapshot | null>(null);
  const getContent = () => {
    scrollRef.current?.scrollIntoView();
    CallApiToStore(gameStore.get(Number(id)), 'api', loadingStore)
      .then(() => {
        scrollRef.current?.scrollIntoView();
        setContent(gameStore.game);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    setContent(null);
    getContent();
    return () => {
      gameStore.resetQuestion();
      commentStore.resetComments();
    };
  }, [id, navigate]);

  const handleClose = () => {
    // if (redirectTo && redirectTo.pathname !== '') {
    //   navigate(redirectTo.pathname + redirectTo.search);
    // } else {
    navigate(-1);
    // }
  };

  // 좋아요
  const handleLike = async () => {
    // 이모션(400101 : 좋아요, 400102: 싫어요)
    if (isAuthenticated) {
      const emotionCd = gameStore.game.myEmotionCd?.code === 400101 ? 400102 : 400101;
    if (gameStore.game.myEmotionCd?.code === 400101) {
      await gameStore.removeLike(gameStore.game.gameSid);
    } else {
      await gameStore.addLike(gameStore.game.gameSid, emotionCd);
    }
    gameStore.get(Number(id)).then(() => {
      setContent(gameStore.game);
    });
  } else {
    setAlertMessage('로그인 후 이용 가능합니다.');
    setAlertOpen(true);
  }
  };

  // 게임 문항 전체 조회
  const [currentIndex, setCurrentIndex] = useState(-1);
  const getQuestions = () => {
    CallApiToStore(gameStore.getQuestions(Number(id)), 'api', loadingStore)
      .then(() => {
        // _.shuffle([...toJS(gameStore.questions[0].itemList)]);
        // setAnswers(gameStore.questions[0].itemList);
      })
      .then(() => {
        setCurrentIndex(0);
      })
      .catch((e) => {
        console.log('e', e);
      });
  };

  const options: any = {
    showMainIcon: 'back',
    showHomeIcon: true,
    showCartIcon: true,
    handleMainIcon: () => {console.log(navigate(-1));
    }
  };
  
  

  return (
    <>
      {content && (
        <Stack
          sx={{
            flex: 1,
            height: '100%',
            pb: 4,
          }}
          ref={scrollRef}
        >
          <CHeader title={gameStore.game.gameTypeCd ? gameStore.game.gameTypeCd.value + ' 게임' : 'TITLE'} {...options} />
          <Stack spacing={3} sx={{ textAlign: 'left', p: pxToRem(20), pt: pxToRem(6) }}>
            <Card elevation={0} sx={{ boxShadow: 'none', background: '#ffffff' }}>
              <Box
                id="shareImage" 
                component={'img'}
                src={REACT_APP_IMAGE_STORAGE + (content.thumbnlPath || '/assets/placeholder.svg')}
                width={'100%'}
                height={'100%'}
                sx={{
                  borderRadius: '15px',
                }}
              />
              <Stack
                direction={'row'}
                alignContent={'center'}
                alignItems={'center'}
                justifyContent={'center'}
                spacing={2}
                sx={{width: '100%',p: '14px 16px',position: 'absolute',bottom: 0,background:
                'radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(255, 255, 255, 0.33) 0%, rgba(0, 0, 0, 0) 100%)',backdropFilter: 'blur(6px)',borderRadius: '15px',}}>
                <Typography
                  variant={'Kor_12_r'}
                  color={'white'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <IconPlay style={{ marginRight: 4 }} stroke={'white'} width={20} height={20} />{' '}
                  {numberComma(content.prtcptnCnt)}
                </Typography>
                {/* <Typography variant={'Kor_12_r'} color={'white'} sx={{ display: 'flex', alignItems: 'center' }} >
                  <IconShare style={{ marginRight: 4 }} fill={'white'} width={20} height={20} />{' '}
                  {numberComma(content.shareCnt || undefined)}
                </Typography>
                <Divider sx={{ height: 14, borderWidth: 1 }} /> */}
                <Typography
                  variant={'Kor_12_r'}
                  color={'white'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <IconHeart style={{ marginRight: 4 }} stroke={'white'} width={20} height={20} />{' '}
                  {numberComma(content.likeCnt || 0 || undefined)}
                </Typography>
              </Stack>
            </Card>

            <Box sx={{ pt: pxToRem(16), pb: pxToRem(4) }}>
              <Typography variant={'Kor_28_b'} component={'h3'}>
                {content.gameNm}
              </Typography>
              {content.gameTag ? (
                <Stack direction={'row'} spacing={'4px'} sx={{ mt: 1,whiteSpace: 'nowrap', overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none'} }}>
                  {content.gameTag.split(' ').map((tag: string, i: number) => {
                    
                    return (
                      <Chip
                        key={`tag-${i}`}
                        label={tag}
                        color={'primary'}
                        variant={'outlined'}
                        size={'small'}
                        sx={{ height: '22px', fontSize: pxToRem(12), fontWeight: 400 }}
                      />
                    );
                  })}
                </Stack> ) : null}
            </Box>

            <Typography variant={'Kor_16_r'}>
              {parse(content.gameDescr?.replace(/\n/gi, '<br />') || '')}
            </Typography>

            <Button
              variant={'contained'}
              size={'large'}
              color={'primary'}
              sx={{ mt: 1, borderRadius: 4, fontSize: pxToRem(22), fontWeight: 600, p: 1 }}
              onClick={() => {
                getQuestions();
                navigate(`${PATH_ROOT.contents.game + '/' + gameStore.game.gameSid + '/start'}`);
              }}
            >
              시작하기
            </Button>

            <Stack direction={'row'} justifyContent={'center'} spacing={1.5} sx={{ pt: '2px' }}>
              <Box
                sx={{minWidth: 70,maxHeight: 70,borderRadius: '50%',display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center',background: gameStore.game.myEmotionCd?.code === 400101 ? '' : '#FAFAFA',textAlign: 'center',cursor: 'pointer',border: gameStore.game.myEmotionCd?.code === 400101 ? '1px solid #eeeeee' : '',}}
                onClick={handleLike}>
                {gameStore.game.myEmotionCd?.code === 400101 ? (
                  <>
                    <Iconify
                      icon={'ph:heart-straight-fill'}
                      width={25}
                      color={theme.palette.primary.main}
                    />
                    <Typography
                      variant={'Kor_12_r'}
                      component={'div'}
                      sx={{ color: theme.palette.primary.main }}
                    >
                      {numberComma(content.likeCnt || 0)}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Iconify icon={'ph:heart-straight-bold'} width={25} color={'#9DA0A5'} />
                    <Typography variant={'Kor_12_r'} component={'div'} sx={{ color: '#9DA0A5' }}>
                      {numberComma(content.likeCnt || 0)}
                    </Typography>
                  </>
                )}
              </Box>

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
                onClick={() => {
                  setShareOpen(true);
                }}
              >
                <IconShare fill={'#9DA0A5'} width={28} height={28} />
                <Typography variant={'Kor_12_r'} component={'div'} sx={{ color: '#9DA0A5' }}>
                  공유하기
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Divider />
          {currentIndex < 0 ? <Comment contentSid={Number(id)} contentsType={'game'} /> : <></>}
          <Divider />
          <Recommend type={'game'} />
        </Stack>
      )}
      {shareOpen && (
        <CShareAlert
          isAlertOpen={true}
          alertTitle={'친구에게 공유하기'}
          handleAlertClose={() => {
            setShareOpen(false);
          }}
          shareData={{
            title:content?.gameNm, 
            desc:content?.gameDescr, 
            thumbnlPath:content?.thumbnlPath, 
            path: 'content', 
            type:'게임', 
            Sid: params.id, 
            img:REACT_APP_IMAGE_STORAGE&&REACT_APP_IMAGE_STORAGE + content?.thumbnlPath, 
            url:`https://gentok.net/contents/game/${params.id}` 
          }}
        />
      )}
      {/* 비로그인 시 좋아요 선택 불가 alert */}
      <CAlert
        isAlertOpen={alertOpen}
        alertCategory={'f2d'}
        alertTitle={alertMessage}
        hasCancelButton={false}
        handleAlertClose={() => {
          setAlertOpen(false);
        }}
      ></CAlert>
    </>
  );
});

export default ViewGame;
