import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Card, Stack, Typography, Chip, Button, Dialog, Slide } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as IconPlay } from 'src/assets/icons/ico-play.svg';
import { ReactComponent as IconHeart } from 'src/assets/icons/ico-heart.svg';
import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import { CallApiToStore, numberComma } from 'src/utils/common';
import _ from 'lodash';
import { IGameQuestion, IGameSnapshot } from 'src/models';
import Worldcup from '../game/worldcup/Worldcup';
import Balance from '../game/balance-game/Balance';
import { pxToRem } from 'src/theme/typography';
import BackHeader from 'src/components/BackHeader';
import parse from 'html-react-parser';
import CHeader from 'src/components/CHeader';

/**
 * ## GameStart 설명
 *
 */
interface Props {
  type?: string;
}
export const GameStart = observer(({}: Props) => {
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const rootStore = useStores();
  const { loadingStore, gameStore, commentStore } = rootStore;
  const navigate = useNavigate();
  const scrollRef = useRef<any>(null);

  const params = useParams();
  const { id = '' } = params;

  const [open, setOpen] = useState(true);

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
    // navigate(redirectTo.pathname + redirectTo.search);
    // } else {
    navigate(-1);
    // }
  };

  // 게임 문항 전체 조회
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const handleNextWorldcup = () => {
    if (currentIndex + 1 === gameStore.questions[0].itemList.length) {
      alert('END');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handleNextBalance = () => {
    if (currentIndex + 1 === gameStore.questions.length) {
      alert('END');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: () => {
      navigate(-1);
    },
    showHomeIcon: true,
    showCartIcon: true,
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
          <CHeader
            title={gameStore.game.gameTypeCd ? gameStore.game.gameTypeCd.value + ' 게임' : 'TITLE'}
            {...options}
          />
          <Stack spacing={3} sx={{ textAlign: 'left', p: pxToRem(20), pt: pxToRem(6) }}>
            <Card elevation={0} sx={{ boxShadow: 'none', background: '#ffffff' }}>
              <Box
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
                sx={{
                  width: '100%',
                  p: '14px 16px',
                  position: 'absolute',
                  bottom: 0,
                  background:
                    'radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(255, 255, 255, 0.33) 0%, rgba(0, 0, 0, 0) 100%)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '15px',
                }}
              >
                <Typography
                  variant={'Kor_12_r'}
                  color={'white'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <IconPlay style={{ marginRight: 4 }} stroke={'white'} width={20} height={20} />{' '}
                  {numberComma(content.prtcptnCnt)}
                </Typography>

                <Typography
                  variant={'Kor_12_r'}
                  color={'white'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <IconHeart style={{ marginRight: 4 }} stroke={'white'} width={20} height={20} />
                  {numberComma(content.likeCnt || 0 || undefined)}
                </Typography>
              </Stack>
            </Card>

            <Box sx={{ pt: pxToRem(16), pb: pxToRem(4) }}>
              <Typography variant={'Kor_28_b'} component={'h3'}>
                {content.gameNm}
              </Typography>
              {content.gameTag ? (
                <Stack direction={'row'} spacing={1} sx={{ mt: 1 }}>
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
                </Stack>
              ) : null}
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
                setOpen(true);
              }}
            >
              시작하기
            </Button>
          </Stack>
        </Stack>
      )}
      {
        // 월드컵 게임
        gameStore.game.gameTypeCd &&
          gameStore.game.gameTypeCd.code === 430001 &&
          gameStore.questions.map((question: IGameQuestion, i: number) => {
            return currentIndex >= i ? (
              <Dialog
                key={`game-question-${i}`}
                fullWidth
                hideBackdrop
                keepMounted
                maxWidth={'md'}
                disableEscapeKeyDown
                open={open && currentIndex >= i}
                TransitionComponent={Transition}
                PaperProps={{
                  sx: {
                    p: 0,
                    m: '0 !important',
                    maxHeight: '100% !important',
                    minHeight: '100%',
                    borderRadius: '0 !important',
                    boxShadow: 'none',
                    overflowY: 'initial',
                  },
                }}
                onClose={(e: any, reason: string) => {
                  if (reason === 'backdropClick') {
                    e.preventDefault();
                    e.stopPropagation();
                  } else {
                    handleClose();
                  }
                }}
                sx={{
                  margin: '0 !important',
                  zIndex: 100,
                  padding: 0,
                  borderRadius: 0,
                }}
              >
        <Worldcup
                  total={gameStore.questions[0].itemList.length}
                  question={question}
                  handleClose={() => {
                    handleClose();
                  }}
                  handleNext={handleNextWorldcup}
                />

              </Dialog>
            ) : null;
          })
      }

      {
        // 밸런스 게임
        gameStore.game.gameTypeCd &&
          gameStore.game.gameTypeCd.code === 430002 &&
          gameStore.questions.map((question: IGameQuestion, i: number) => {
            return currentIndex >= i ? (
              <Dialog
                key={`game-question-${i}`}
                fullWidth
                hideBackdrop
                keepMounted
                maxWidth={'md'}
                disableEscapeKeyDown
                open={open && currentIndex >= i}
                TransitionComponent={Transition}
                PaperProps={{
                  sx: {
                    p: 0,
                    m: '0 !important',
                    maxHeight: '100%',
                    minHeight: '100%',
                    borderRadius: '0 !important',
                    '@media (max-width: 600px)': {
                      margin: 0,
                    },
                    boxShadow: 'none',
                  },
                }}
                onClose={(e: any, reason: string) => {
                  if (reason === 'backdropClick') {
                    e.preventDefault();
                    e.stopPropagation();
                  } else {
                    handleClose();
                  }
                }}
                sx={{
                  margin: '0 !important',
                  zIndex: 100,
                  padding: 0,
                  borderRadius: 0,
                }}
              >
                <Balance
                  total={gameStore.questions.length}
                  question={question}
                  handleClose={() => {
                    scrollRef.current?.scrollIntoView();
                    handleClose();
                  }}
                  handleNext={handleNextBalance}
                  contentSid={Number(id)}
                  gameQuestnSid={question.gameQuestnSid}
                  index={i + 1}
                />
              </Dialog>
            ) : null;
          })
      }
    </>
  );
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default GameStart;
