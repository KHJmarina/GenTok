import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  LinearProgress,
  Slide,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { IGameQuestion, IGameQuestionItem, IGameQuestionItemSnapshot, useStores } from 'src/models';
import { CallApiToStore } from 'src/utils/common';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-arrow-left.svg';
import { TypeAnimation } from 'react-type-animation';
import { toJS } from 'mobx';
import _, { isNull, isUndefined } from 'lodash';
import { TransitionProps } from '@mui/material/transitions';
import Result, { GameResult } from '../result/GameResult';
import BackHeader from 'src/components/BackHeader';
import { pxToRem } from 'src/theme/typography';
import { m } from 'framer-motion';
import { varBounce, varFade } from 'src/components/animate';
import CHeader from 'src/components/CHeader';
interface Props {
  total: number;
  question: IGameQuestion;
  handleClose: VoidFunction;
  handleNext: VoidFunction;
  //   vsAttr: IGameQuestion;
  //   selectAnswer: (item: IGameQuestionItem) => void;
  //   answers: IGameQuestionItem[];
}

const Worldcup = observer(({ total, question, handleClose, handleNext }: Props) => {
  const rootStore = useStores();
  const { gameStore, loadingStore } = rootStore;
  const theme = useTheme();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [openResult, setOpenResult] = useState(false);
  const [openChoice, setOpenChoice] = useState(false);
  const [answers, setAnswers] = useState<IGameQuestionItemSnapshot[]>([]);
  const [displays, setDisplays] = useState<IGameQuestionItemSnapshot[]>([]);
  const [winners, setWinners] = useState<IGameQuestionItemSnapshot[]>([]);

  // const [isClick, setIsClick] = useState(false);
  // n강 계산
  const [roundNum, setRoundNum] = useState(total);

  const onClick = (answer: IGameQuestionItemSnapshot) => {
    setCurrentIndex(currentIndex + 1);
    if (currentIndex + 1 === roundNum / 2) {
      setRoundNum(roundNum / 2);
    }

    if (answers.length <= 2) {
      if (winners.length === 0) {
        getResult(answer);
      } else if (winners.length === 1) {
        setRoundNum(2);
        let updatedAnswer = [...winners, answer];
        setAnswers(updatedAnswer);
        setDisplays([updatedAnswer[0], updatedAnswer[1]]);
        setCurrentIndex(0);
        setWinners([]);
      } else {
        let updatedAnswer = [...winners, answer];
        setAnswers(updatedAnswer);
        setDisplays([updatedAnswer[0], updatedAnswer[1]]);
        setCurrentIndex(0);
        setWinners([]);
      }
    } else if (answers.length > 2) {
      setWinners([...winners, answer]);
      setDisplays([answers[2], answers[3]]);
      setAnswers(answers.slice(2));
      handleNext();
    }
  };

  const getResult = (answer: IGameQuestionItemSnapshot) => {
    CallApiToStore(gameStore.postAnswer(answer), 'api', loadingStore)
      .then(() => {
        setOpenResult(true);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    setAnswers([]);
    // gameStore.questions[0].itemList.sort(() => Math.random() - 0.5);
    _.shuffle([...gameStore.questions[0].itemList]);
    setAnswers(gameStore.questions[0].itemList);
    setDisplays([gameStore.questions[0].itemList[0], gameStore.questions[0].itemList[1]]);
    //   console.log(displays);
    //   setDisplays([gameStore.questions[0].itemList[1], gameStore.questions[0].itemList[2]]);
  }, []);

  const getQuestnAttrByKey = (attrKey: string) => {
    const questnDfAttr = JSON.parse(question.questnDfAttr);
    const questnAttr = question?.questnAttr && JSON.parse(question.questnAttr);

    let value = questnAttr[attrKey];
    const isUnKnwon: boolean = isUndefined(value) || isNull(value) || isNaN(value);
    // console.log(questnDfAttr, questnAttr, isUnKnwon ? questnDfAttr[attrKey] : value);
    return isUnKnwon ? questnDfAttr[attrKey] : value;

    // getQuestnAttrByKey('vsBgCol');
  };

  const styles = {
    default: {
      border: '1px solid transparent',
      fontWeight: 400,
    },
    selected: {
      border: '1px solid primary',
      fontWeight: 600,
    },
  };
  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: () => {
      handleClose();
    },
    showXIcon: true,
  };

  return (
    <>
      <CHeader title={'월드컵 게임'} {...options} />
      <Stack
        sx={{
          display: 'flex',
          flex: 1,
          height: '100%',
          px: pxToRem(20),
          justifyContent: 'space-between',
          textAlign: 'center',
        }}
      >
        {roundNum > 1 && (
          <Stack sx={{ mt: pxToRem(54), mb: pxToRem(55) }}>
            <Typography variant={'Kor_16_b'} component={'h5'} color={'primary'}>
              {roundNum === 2 ? '결승전' : roundNum === 4 ? '준결승전' : roundNum + '강'}
            </Typography>
            <Typography variant={'Kor_16_b'} component={'h5'} color={'primary'} pb={pxToRem(25)}>
              {currentIndex + 2 / 2 + '/' + roundNum / 2}
            </Typography>
            <Typography variant={'Kor_28_b'} color={'text.primary'} sx={{ wordBreak: 'keep-all' }}>
              <TypeAnimation
                sequence={[
                  `${question.questn}`, // Types 'One'
                  () => {
                    setOpenChoice(true);
                  },
                ]}
                // wrapper="div"
                cursor={false}
                speed={99}
                // repeat={Infinity}
              />
            </Typography>
          </Stack>
        )}
        <Stack justifyContent={'flex-start'} sx={{ flex: 1 }}>
          <Stack
            direction={getQuestnAttrByKey('itemAlign') === 'vertical' ? 'column' : 'row'}
            alignItems={'center'}
            justifyContent={'center'}
            gap={pxToRem(10)}
            position={'relative'}
          >
            {openChoice &&
              displays.map((item: IGameQuestionItemSnapshot, i: number) => {
                const cardAttr = item.itemCardAttr
                  ? JSON.parse(item.itemCardAttr)
                  : JSON.parse(item.itemCardDfAttr);

                // const hasSelect = displays.filter(
                //   (r: IGameQuestionItemSnapshot) => r.gameQuestnItemSid === item.gameQuestnItemSid,
                // )[0];

                return (
                  <Box
                    width={'100%'}
                    key={`quest-${question.gameSid}-${question.gameQuestnSid}-answer-${i}`}
                  >
                    {getQuestnAttrByKey('itemAlign') !== 'vertical' &&
                    question.itemDataTypeCd.code === 440202 ? (
                      <Stack display={'flex'} flex={1}>
                        <Button
                          onClick={() => {
                            onClick(item);
                          }}
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          sx={{
                            borderRadius: pxToRem(15),
                            width: '100%',
                            p: 0,
                            // ...(hasSelect && hasSelect.gameQuestnItemSid === item.gameQuestnItemSid
                            //   ? styles.selected
                            //   : styles.default),
                            '&:hover': { ...styles.selected },
                            height: pxToRem(250),
                          }}
                        >
                          <Box
                            // component={m.div}
                            // animate={isClick ? 'win' : ''}
                            // initial={['left', 'right']}
                            // variants={{
                            //   left: { x: ['-100%', '10%', '0%'] },
                            //   right: { x: ['100%', '-10%', '0%'] },

                            //   win: { y: '-100%', opacity: 0, staggerDirection: -1 },
                            //   lose: { y: '100%', opacity: 0, staggerDirection: -1 },
                            // }}
                            // onClick={(e: any) => {
                            //   console.log(e.target);
                            //   // setIsClick(e.target)
                            //   setIsClick(true);
                            // }}
                            // transition={{ ease: 'easeInOut', duration: 0.7 }}
                            sx={{
                              borderRadius: pxToRem(15),
                              width: '100%',
                              height: '100%',
                              background: `${cardAttr.bgCol} url("${
                                REACT_APP_IMAGE_STORAGE && REACT_APP_IMAGE_STORAGE + item.itemData
                              }") no-repeat center center / cover`,
                            }}
                          />
                        </Button>

                        <Typography
                          variant="Eng_16_r"
                          height={pxToRem(80)}
                          mt={pxToRem(10)}
                          sx={{
                            color: cardAttr.txtCol,
                            fontSize: cardAttr.fontSize,
                            fontWeight: 600,
                            wordBreak: 'keep-all',
                          }}
                        >
                          {item.itemText}
                        </Typography>
                      </Stack>
                    ) : (
                      <Button
                        // variant={
                        //   // hasSelect && hasSelect.gameQuestnItemSid === item.gameQuestnItemSid
                        //   //   ? 'outlined'
                        //   //   : 'contained'
                        //   'contained'
                        // }
                        onClick={() => {
                          onClick(item);
                        }}
                        disableFocusRipple
                        disableRipple
                        disableTouchRipple
                        sx={{
                          borderRadius: pxToRem(15),
                          width: '100%',
                          minHeight: pxToRem(180),
                          p: 0,
                          // ...(hasSelect && hasSelect.gameQuestnItemSid === item.gameQuestnItemSid
                          //   ? styles.selected
                          //   : styles.default),
                          '&:hover': { ...styles.selected },
                          ...(getQuestnAttrByKey('itemAlign') === 'vertical'
                            ? { height: pxToRem(180) }
                            : { height: pxToRem(250) }),
                        }}
                      >
                        <Box
                          sx={{
                            borderRadius: pxToRem(15),
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            wordBreak: 'keep-all',
                            p: pxToRem(10),
                            ...(question.itemDataTypeCd.code === 440202
                              ? {
                                  background: `${cardAttr.bgCol} url("${
                                    REACT_APP_IMAGE_STORAGE &&
                                    REACT_APP_IMAGE_STORAGE + item.itemData
                                  }") no-repeat center center / cover`,
                                }
                              : { background: cardAttr.bgCol }),
                          }}
                        >
                          <Typography
                            sx={{
                              color: cardAttr.txtCol,
                              fontSize: cardAttr.fontSize,
                              fontWeight: 600,
                            }}
                          >
                            {item.itemText}
                          </Typography>
                        </Box>
                      </Button>
                    )}
                  </Box>
                );
              })}
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              position={'absolute'}
              sx={{
                width: pxToRem(40),
                height: pxToRem(40),
                backgroundColor: () => {
                  // console.log(question.questnAttr, question.questnDfAttr);
                  return getQuestnAttrByKey('vsBgCol');
                },
                borderRadius: '50%',
                ...(getQuestnAttrByKey('itemAlign') !== 'vertical' &&
                question.itemDataTypeCd.code === 440202
                  ? { transform: 'translateY(-100%)' }
                  : {}),
              }}
            >
              <Typography
                // component={m.div}
                // animate={{ scale: '110%' }}
                // transition={{ ease: 'easeInOut', duration: 'infinite' }}
                variant="Eng_16_b"
                color={getQuestnAttrByKey('vsTxtCol')}
              >
                VS
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>
      {openResult && (
        <Dialog
          key={`game-result`}
          fullWidth
          hideBackdrop
          keepMounted
          maxWidth={'md'}
          open={openResult}
          scroll={'body'}
          TransitionComponent={Transition}
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              p: 0,
              m: '0 !important',
              maxWidth: '100% !important',
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              background: '#ffffff',
              boxShadow: 'none',
              overflowY: 'initial',
              textAlign: 'center',
            },
          }}
          onClose={(e: any, reason: string) => {
            if (reason === 'backdropClick') {
              e.preventDefault();
              e.stopPropagation();
            } else {
              setOpenResult(false);
            }
          }}
          sx={{
            margin: '0 !important',
            zIndex: 100,
            padding: 0,
            borderRadius: 0,
            background: '#ffffff',
          }}
        >
          <GameResult
            handleClose={() => {
              setOpenResult(false);
              handleClose();
            }}
          />
        </Dialog>
      )}
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
export default Worldcup;
