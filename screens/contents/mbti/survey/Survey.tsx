import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import {
  Button,
  Card,
  Dialog,
  LinearProgress,
  Slide,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { m, useScroll, useSpring } from 'framer-motion';
import Countdown, { CountdownApi, CountdownRenderProps, zeroPad } from 'react-countdown';
import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import Result from '../result/Result';
import { bgBlur } from 'src/utils/cssStyles';
import { IMbtiQuestion } from 'src/models/mbti-question/MbtiQuestion';
import { IMbtiQuestionItem } from 'src/models';
import { TypeAnimation } from 'react-type-animation';
import { TransitionGroup } from 'react-transition-group';
import { merge } from 'lodash';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-header-back.svg';
import { pxToRem } from 'src/theme/typography';
import TextMaxLine from 'src/components/text-max-line';
import BackHeader from 'src/components/BackHeader';
import CHeader from 'src/components/CHeader';
import { useLocation, useNavigate } from 'react-router';
import { PATH_ROOT } from 'src/routes/paths';

/**
 * ## Survey 설명
 *
 */
interface Props {
  index: number;
  total: number;
  question: IMbtiQuestion;
  handleClose: VoidFunction;
  selectAnswer: (item: IMbtiQuestionItem) => void;
  answers: IMbtiQuestionItem[];
  handleNext: VoidFunction;
}

type RedirectLocationState = {
  redirectTo: Location;
};
export const Survey = observer(
  ({ index, total, question, handleClose, selectAnswer, answers, handleNext }: Props) => {
    const rootStore = useStores();
    const { mbtiStore, loadingStore } = rootStore;
    const theme = useTheme();

    const { scrollXProgress } = useScroll();
    const navigate = useNavigate();
    const { state: locationState } = useLocation();
    const { redirectTo } = (locationState as RedirectLocationState) || {
      pathname: '',
      search: '',
    };

    const typoAniDuration = 99;
    const remainTime = 0; //3000; // 남은 선택시간..

    // const progress = index / total * 100;
    const [progress, setProgress] = useState(((index - 1) / total) * 100);

    const [openResult, setOpenResult] = useState(false);

    const [selected, setSelected] = useState<IMbtiQuestionItem | null>(null);

    const styles = {
      default: {
        color: '#202123',
        borderColor: 'divider',
        fontSize: pxToRem(16),
        p: 2,
        fontWeight: 400,
        background: 'none',
        wordBreak: 'keep-all',
      },
      selected: {
        color: '#202123',
        borderColor: 'primary',
        fontSize: pxToRem(16),
        p: 2,
        fontWeight: 600,
        background: 'none',
        wordBreak: 'keep-all',
      },
    };

    const [countdownApi, setCountdownApi] = useState<CountdownApi | null>(null);
    const setRef = (countdown: Countdown | null): void => {
      if (countdown) {
        setCountdownApi(countdown.getApi());
      }
    };

    useEffect(() => {
      setTimeout(() => {
        setProgress((index / total) * 100);
      }, 500);
    }, []);

    const [openChoice, setOpenChoice] = useState(false);

    const countdownRenderer = ({
      total,
      hours,
      minutes,
      seconds,
      completed,
      formatted,
    }: CountdownRenderProps) => {
      if (completed) {
        return <></>;
      } else if (countdownApi?.isStarted()) {
        return (
          <>
            <Stack>
              <Typography variant="subtitle2">남은 선택 시간..</Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  transition: 'all .14s ease-out',
                  color: theme.palette.text.primary,
                  fontSize: '4rem',
                  fontWeight: 7000,
                }}
              >
                {seconds}
                {/* {zeroPad(minutes)}:{zeroPad(seconds)} */}
              </Typography>
            </Stack>
          </>
        );
      }
    };

    const options: any = {
      showMainIcon: 'back',
      handleMainIcon: () => {
        handleClose();
      },
      showXIcon: true,
      // handleX: () => {handleX();}
    };

    return (
      <>
        <Stack sx={{ flex: 1 }}>
          <CHeader title={mbtiStore.mbti.mbtiNm} {...options} />
          <Stack
            justifyContent={'space-between'}
            sx={{ flex: 1, p: '20px', pt: '11px', textAlign: 'center' }}
          >
            <Box>
              <Typography
                variant={'body2'}
                sx={{
                  textAlign: 'right',
                  fontSize: pxToRem(12),
                  fontWeight: 300,
                  color: '#DFE0E2',
                }}
              >
                {' '}
                {index}/{mbtiStore.questions.length}
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ height: '3px' }} />
            </Box>
            <Stack>
              <Box>
                <Typography
                  variant={'h3'}
                  color={'primary'}
                  sx={{ fontSize: pxToRem(21), fontWeight: 600 }}
                >
                  Q{index}
                </Typography>
                <Typography
                  variant={'Kor_24_b'}
                  component={'h3'}
                  sx={{ p: '20px', color: '#202123', wordBreak: 'keep-all' }}
                >
                  <TypeAnimation
                    sequence={[
                      `${question.questn}`, // Types 'One'
                      () => {
                        setOpenChoice(true);
                      },
                    ]}
                    // wrapper="div"
                    cursor={false}
                    speed={typoAniDuration}
                    // repeat={Infinity}
                  />
                </Typography>
              </Box>
            </Stack>
            <Stack spacing={1} justifyContent={'flex-end'} sx={{ minHeight: 200 }}>
              <Box
                sx={{
                  display: selected !== null ? 'flex' : 'none',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Slide direction="up" in={selected !== null} mountOnEnter unmountOnExit>
                  <Card
                    sx={{
                      display: 'flex',
                      width: '95%',
                      height: '30%',
                      ...bgBlur({ color: theme.palette.background.default }),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Countdown
                      key={'countdown'}
                      ref={setRef}
                      date={Date.now() + remainTime}
                      renderer={countdownRenderer}
                      autoStart={true}
                      onComplete={() => {
                        // setSelected(0);
                        // setOpenResult(true);
                        selected && selectAnswer(selected);
                        setSelected(null);
                      }}
                    />
                  </Card>
                </Slide>
              </Box>

              {openChoice &&
                question.itemList.map((item: IMbtiQuestionItem, i: number) => {
                  const hasSelect = answers.filter(
                    (r: IMbtiQuestionItem) => r.mbtiQuestnItemSid === item.mbtiQuestnItemSid,
                  )[0];
                  // console.log('🌈 ~ openChoice&&question.itemList.map ~ hasSelect:', hasSelect)
                  return (
                    // <Slide key={`answer-${i}`} direction="up" in={openChoice} mountOnEnter unmountOnExit>
                    <Button
                      key={`quest-${question.mbtiSid}-${question.mbtiQuestnSid}-answer-${i}`}
                      variant={'outlined'}
                      onClick={() => {
                        setSelected(item);
                        countdownApi?.start();
                      }}
                      disableFocusRipple
                      disableRipple
                      disableTouchRipple
                      sx={{
                        ...(hasSelect && hasSelect.mbtiQuestnItemSid === item.mbtiQuestnItemSid
                          ? styles.selected
                          : styles.default),
                        '&:hover': { ...styles.selected },
                        borderRadius: '15px',
                      }}
                    >
                      {item.itemText}
                    </Button>
                    // </Slide>
                  );
                })}
            </Stack>
          </Stack>
        </Stack>

        {openResult && (
          <Dialog
            fullWidth
            hideBackdrop
            maxWidth={'md'}
            open={openResult}
            TransitionComponent={Transition}
            PaperProps={{
              sx: {
                p: 0,
                m: '0 !important',
                maxHeight: '100%',
                minHeight: '100%',
                borderRadius: '0 !important',
                overflowY: 'initial',
              },
            }}
            onClose={() => {
              setOpenResult(false);
            }}
            sx={{
              margin: '0 !important',
              zIndex: 100,
              padding: 0,
              borderRadius: 0,
              '& .MuiDialog-container': {
                overflowY: 'auto',
              },
            }}
            onBackdropClick={undefined}
          >
            <Result handleClose={() => setOpenResult(false)} />
          </Dialog>
        )}
      </>
    );
  },
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default Survey;
