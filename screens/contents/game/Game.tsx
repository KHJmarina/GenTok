import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Button, Dialog, Slide, useTheme } from '@mui/material';
import Worldcup from './worldcup/Worldcup';
import { CallApiToStore } from 'src/utils/common';
import { IGameQuestion, IGameQuestionItem } from 'src/models';
import { TransitionProps } from '@mui/material/transitions';
import _, { merge } from 'lodash';
import { toJS } from 'mobx';

/**
 * ## Game 설명
 *
 */
export const Game = observer(() => {
  const rootStore = useStores();
  const { gameStore, loadingStore } = rootStore;
  const theme = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<IGameQuestionItem[]>([]);
  const [display, setDisplay] = useState<IGameQuestionItem[]>([]);
  const [winner, setWinner] = useState<IGameQuestionItem[]>([]);

  const getQuestions = async () => {
    await CallApiToStore(gameStore.getQuestions(1), 'api', loadingStore)
      .then(() => {
        setCurrentIndex(0);
        setAnswers(gameStore.questions[0].itemList);
        setDisplay([gameStore.questions[0].itemList[1], gameStore.questions[0].itemList[2]]);
      })
      .catch((e) => {
        console.log('e', e);
      });
  };

  const selectAnswer = (item: IGameQuestionItem) => {
    setAnswers(merge([...answers.filter((r) => r.gameQuestnSid !== item.gameQuestnSid), item]));
    // console.log('🌈 ~ selectAnswer ~ answers:', toJS(answers))
    if (currentIndex + 1 === gameStore.questions[0].itemList.length) {
      answers.push(item);
      getResult();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const getResult = () => {};

  // setDisplays([gameStore.questions[0].itemList[1], gameStore.questions[0].itemList[2]]);

  return (
    <>
      <Box>Game Screen</Box>
      <Button
        variant={'contained'}
        size={'large'}
        color={'primary'}
        sx={{ borderRadius: 4, fontSize: '1.4rem', p: 1 }}
        onClick={() => {
          getQuestions();
        }}
      >
        시작하기
      </Button>
      {gameStore.questions.map((question: IGameQuestion, i: number) => {
        return currentIndex >= i ? (
          <Dialog
            key={`game-question-${i}`}
            fullWidth
            hideBackdrop
            keepMounted
            maxWidth={'lg'}
            open={currentIndex >= i}
            TransitionComponent={Transition}
            disableEscapeKeyDown
            PaperProps={{
              sx: {
                p: 0,
                m: 0,
                maxHeight: '100%',
                minHeight: '100%',
                borderRadius: '0 !important',
                '@media (max-width: 600px)': {
                  margin: 0,
                },
                boxShadow: 'none',
              },
            }}
            onClose={() => {
              setCurrentIndex(currentIndex - 1);
            }}
            sx={{
              margin: '0 !important',
              zIndex: 100,
              padding: 0,
              borderRadius: 0,
            }}
          >
            {/* <Worldcup
              total={gameStore.questions[0].itemList.length}
              question={question}
              handleClose={() => {
                setCurrentIndex(currentIndex - 1);
              }}
              // selectAnswer={selectAnswer}
              // selectAnswer={() => {}}
              answers={[]}
            /> */}
          </Dialog>
        ) : null;
      })}
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

export default Game;
