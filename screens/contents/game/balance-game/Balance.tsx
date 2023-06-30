import { Box, Button, ButtonGroup, Dialog, Stack, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import {
  IBalanceResultList,
  IGameQuestion,
  IGameQuestionItem,
  IGameQuestionItemSnapshot,
  useStores,
} from 'src/models';
import { CallApiToStore } from 'src/utils/common';
import { TypeAnimation } from 'react-type-animation';
import _, { isNull, isUndefined } from 'lodash';
import { bgBlur } from 'src/utils/cssStyles';
import Comment from '../../comment/Comment';
import Iconify from 'src/components/iconify/Iconify';
import BackHeader from 'src/components/BackHeader';
import { pxToRem } from 'src/theme/typography';
import CHeader from 'src/components/CHeader';
interface Props {
  index: number;
  total: number;
  question: IGameQuestion;
  handleClose: VoidFunction;
  handleNext: VoidFunction;
  contentSid: number;
  gameQuestnSid: number;
  // selectAnswer: (item: IGameQuestionItem) => void;
  // answers: IGameQuestionItem[];
}

const Balance = observer(
  ({ total, question, handleClose, index, handleNext, contentSid, gameQuestnSid }: Props) => {
    const rootStore = useStores();
    const { gameStore, loadingStore, responseStore } = rootStore;
    const theme = useTheme();
    const { REACT_APP_IMAGE_STORAGE } = process.env;

    const [answers, setAnswers] = useState<IGameQuestionItem[]>([]);
    const [openChoice, setOpenChoice] = useState(false);
    const [openResult, setOpenResult] = useState(false); //결과화면 open
    const [saveFailAlert, setSaveFailAlert] = useState(false); //답변제출 경고창
    const [errorMessage, setErrorMessage] = useState(''); //에러메세지

    const styles = {
      default: {
        border: '1px solid transparent',
        fontWeight: 400,
      },
      selected: {
        border: '1px solid primary',
      },
    };

    const getResult = (answer: IGameQuestionItemSnapshot) => {
      CallApiToStore(gameStore.postAnswer(answer), 'api', loadingStore)
        .then(() => {
          if (gameStore.result) {
            setOpenResult(true);
          }
          // else if (responseStore.responseInfo.errorMessage) {
          //   setErrorMessage(responseStore.responseInfo.errorMessage);
          //   setSaveFailAlert(true);
          // }
          else {
            setErrorMessage('알 수 없는 오류가 발생하였습니다.');
            setSaveFailAlert(true);
          }
        })
        .catch((e) => console.log(e));
    };

    useEffect(() => {
      setAnswers([]);
    }, []);

    const getQuestnAttrByKey = (attrKey: string) => {
      const questnDfAttr = JSON.parse(question.questnDfAttr);
      const questnAttr = question?.questnAttr && JSON.parse(question.questnAttr);

      let value = questnAttr[attrKey];
      const isUnKnwon: boolean = isUndefined(value) || isNull(value) || isNaN(value);
      // console.log(questnDfAttr, questnAttr, isUnKnwon ? questnDfAttr[attrKey] : value);
      return isUnKnwon ? questnDfAttr[attrKey] : value;
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
        <Stack sx={{ flex: 1 }}>
          <CHeader title={'밸런스 게임'} {...options} />
          <Stack justifyContent={'space-between'} sx={{ p: pxToRem(20), textAlign: 'center' }}>
            <Box>
              <Typography variant={'Kor_16_b'} color={'primary'} mb={pxToRem(8)}>
                {index + '/' + total}
              </Typography>
              <Typography variant={'Kor_24_b'} sx={{ wordBreak: 'keep-all' }}>
                <TypeAnimation
                  sequence={[
                    `${question.questn}`, // Types 'One'
                    () => {
                      setOpenChoice(true);
                    },
                  ]}
                  cursor={false}
                  speed={99}
                />
              </Typography>
              <Stack
                alignItems={'center'}
                justifyContent={'center'}
                position={'relative'}
                mt={pxToRem(20)}
              >
                <ButtonGroup
                  fullWidth
                  sx={{
                    minHeight: pxToRem(200),
                  }}
                >
                  {openChoice &&
                    question.itemList.map((item: IGameQuestionItem, i: number) => {
                      const cardAttr = item.itemCardAttr
                        ? JSON.parse(item.itemCardAttr)
                        : JSON.parse(item.itemCardDfAttr);

                      const hasSelect = answers.filter(
                        (r: IGameQuestionItem) => r.gameQuestnItemSid === item.gameQuestnItemSid,
                      )[0];
                      // console.log('🌈 ~ openChoice&&question.itemList.map ~ hasSelect:', hasSelect);
                      return (
                        <Button
                          key={`quest-${question.gameSid}-${question.gameQuestnSid}-answer-${i}`}
                          variant={'contained'}
                          onClick={() => {
                            getResult(item);
                          }}
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          sx={{
                            wordBreak: 'keep-all',
                            ...(hasSelect && hasSelect.gameQuestnItemSid === item.gameQuestnItemSid
                              ? styles.selected
                              : styles.default),
                            '&:hover': { ...styles.selected },
                            borderRadius: pxToRem(15),
                            p: 0,
                            background: cardAttr.bgCol,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '100%',
                              height: '100%',
                              wordBreak: 'keep-all',
                              color: cardAttr.txtCol,
                              fontSize: cardAttr.fontSize,
                              fontWeight: 600,
                              p: pxToRem(20),
                              ...(question.itemDataTypeCd.code === 440202
                                ? {
                                    background: `url("${
                                      REACT_APP_IMAGE_STORAGE &&
                                      REACT_APP_IMAGE_STORAGE + item.itemData
                                    }") no-repeat center center / cover`,
                                  }
                                : {}),
                            }}
                          >
                            {item.itemText}
                          </Box>
                        </Button>
                      );
                    })}
                </ButtonGroup>

                {gameStore.result && openResult === true && (
                  <Box
                    width={'100%'}
                    minHeight={200}
                    sx={{
                      position: 'absolute',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      borderRadius: pxToRem(15),
                      ...bgBlur({ blur: 1, color: theme.palette.common.black }),
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex', // response ok 시 open
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {openResult === true &&
                        gameStore.result.balanceResultList && // response ok 시 open
                        gameStore.result.balanceResultList.map(
                          (item: IBalanceResultList, i: number) => {
                            return (
                              <Box
                                width={'100%'}
                                textAlign={'center'}
                                key={`quest-${question.gameSid}-${question.gameQuestnSid}-answer-${i}`}
                              >
                                <Typography
                                  variant="h1"
                                  fontWeight={900}
                                  color={theme.palette.common.white}
                                  sx={
                                    item.winner
                                      ? {
                                          animation: 'win 0.7s 0.3s ease-in-out 1 normal forwards',
                                          '@keyframes win': {
                                            '0%': {
                                              transform: 'scale(1.0)',
                                            },
                                            '100%': {
                                              transform: 'scale(1.5)',
                                            },
                                          },
                                        }
                                      : {
                                          animation: 'lose 0.7s 0.3s ease-in-out 1 normal forwards',
                                          '@keyframes lose': {
                                            '0%': {
                                              transform: 'scale(1.0)',
                                            },
                                            '100%': {
                                              transform: 'scale(0.9)',
                                            },
                                          },
                                        }
                                  }
                                >
                                  {item.choiceRate}%
                                </Typography>
                                <Typography
                                  variant="Eng_14_r"
                                  component={'h5'}
                                  color={theme.palette.common.white}
                                >
                                  ({item.choiceCnt})
                                </Typography>
                              </Box>
                            );
                          },
                        )}
                    </Box>
                    <Button
                      variant="text"
                      sx={{
                        color: theme.palette.common.white,
                        position: 'absolute',
                        bottom: pxToRem(14),
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontVariant: 'Kor_16_r',
                      }}
                      onClick={() => {
                        if (index === gameStore.questions.length) {
                          handleClose();
                        } else {
                          handleNext();
                        }
                      }}
                    >
                      {index === gameStore.questions.length ? '다시하기 ' : '다음 '}
                      <Iconify
                        ml={1}
                        width={13}
                        icon={'material-symbols:arrow-forward-ios'}
                        sx={{
                          animation: 'arrow 0.7s ease-in-out infinite alternate',
                          '@keyframes arrow': {
                            '0%': {
                              transform: 'translateX(0)',
                            },
                            '100%': {
                              transform: 'translateX(5px)',
                            },
                          },
                        }}
                      />
                    </Button>
                  </Box>
                )}
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  position={'absolute'}
                  sx={{
                    width: pxToRem(40),
                    height: pxToRem(40),
                    backgroundColor: getQuestnAttrByKey('vsBgCol'),
                    borderRadius: '50%',
                  }}
                >
                  <Typography variant="Eng_16_b" color={getQuestnAttrByKey('vsTxtCol')}>
                    VS
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
          <Comment contentSid={contentSid} contentsType={'game'} gameQuestnSid={gameQuestnSid} />
        </Stack>

        {/* saveFailAlert : 저장 실패 경고창*/}
        <Dialog
          open={saveFailAlert}
          PaperProps={{
            sx: {
              p: '25px !important',
              borderRadius: '25px !important',
              '@media (max-width: 600px)': {
                p: 5,
                borderRadius: '25px !important',
              },
            },
          }}
          onClose={() => {
            setSaveFailAlert(false);
          }}
          sx={{
            margin: '0 !important',
            zIndex: theme.zIndex.modal,
            padding: 0,
          }}
        >
          <Typography variant="body1">
            {responseStore.responseInfo.resultCode === 'S' ? '저장되었습니다' : errorMessage}
          </Typography>
          <Button
            variant="contained"
            size={'medium'}
            sx={{ mt: 3, borderRadius: 3 }}
            onClick={() => {
              setSaveFailAlert(false);
            }}
          >
            확인
          </Button>
        </Dialog>
      </>
    );
  },
);

export default Balance;
