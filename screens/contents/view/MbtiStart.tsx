import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { useTheme, Dialog, Slide } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import Survey from '../mbti/survey/Survey';
import { CallApiToStore } from 'src/utils/common';
import { IMbtiSnapshot } from 'src/models/mbti/Mbti';
import { IMbtiQuestion } from 'src/models/mbti-question/MbtiQuestion';
import {IMbtiQuestionItem } from 'src/models/mbti-question-item/MbtiQuestionItem';
import { merge } from 'lodash';
import Result from '../mbti/result/Result';
import BackHeader from 'src/components/BackHeader';
import CHeader from 'src/components/CHeader';
import { PATH_ROOT } from 'src/routes/paths';
import { toJS } from 'mobx';

/**
 * ## View 설명
 *
 */
interface Props {
  type?: string;
}
type RedirectLocationState = {
  redirectTo: Location;
};
export const MbtiStart = observer(({}: Props) => {
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const rootStore = useStores();
  const { mbtiStore, commentStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: locationState } = useLocation();
  const { redirectTo } = (locationState as RedirectLocationState) || {
    pathname: '',
    search: '',
  };
  const params = useParams();
  const { id = '' } = params;

  // mbti 컨텐츠 조회
  const [content, setContent] = useState<IMbtiSnapshot | null>(null);
  const getContent = () => {
    CallApiToStore(mbtiStore.get(Number(id)), 'api', loadingStore)
    .then((res: any) => {
        setContent(mbtiStore.mbti);
        getQuestions()
      })
      .catch((e) => {
        console.log(e);
      });
  }


  const getQuestions = () => {
    CallApiToStore(mbtiStore.getQuestions(mbtiStore.mbti.mbtiSid), 'api', loadingStore)
      .then(() => {
      })
      .catch((e) => {
        console.log('e', e);
      });
  };

  useEffect(() => {
    console.log("🚀 ~ file: MbtiStart.tsx:68 ~ useEffect ~ getContent:", getContent)
    setContent(null);
    commentStore.resetComments();    
    mbtiStore.resetMbti();
    getContent();
    return () => {
      mbtiStore.resetMbti();
      mbtiStore.resetQuestion();
      commentStore.resetComments();
    };
  }, [id, navigate]);

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<IMbtiQuestionItem[]>([]);

  // mbti 답변 조회
  const [openResult, setOpenResult] = useState(false);
  const selectAnswer = (item: IMbtiQuestionItem) => {
    setAnswers(merge([...answers.filter((r) => r.mbtiQuestnSid !== item.mbtiQuestnSid), item]));
    // console.log('🌈 ~ selectAnswer ~ answers:', toJS(answers))
    if (currentIndex + 1 === mbtiStore.questions.length) {
      answers.push(item);
      getResult();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getResult = () => {
    CallApiToStore(mbtiStore.postAnswer(answers), 'api', loadingStore)
      .then(() => {
        window.location.replace(`/contents/mbti/${id}/result/type/${mbtiStore.result?.mbtiTestResultTypeId}`)
      })
      .catch((e) => console.log(e));
  };

  const handleNextMbti = () => {
    if (currentIndex + 1 === mbtiStore.questions[0].itemList.length) {
      alert('END');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <>
      {mbtiStore.questions.map((question: IMbtiQuestion, i: number) => {
        return currentIndex >= i ? (
          <Dialog
            key={`mbti-question-${i}`}
            fullWidth
            hideBackdrop
            keepMounted
            maxWidth={'md'}
            open={currentIndex >= i}
            TransitionComponent={Transition}
            disableEscapeKeyDown
            PaperProps={{
              sx: {
                p: 0,
                m: '0 !important',
                maxHeight: '100%',
                minHeight: '100%',
                borderRadius: '0 !important',
                boxShadow: 'none',
              },
            }}
            onClose={(e: any, reason: string) => {
              if (reason === 'backdropClick') {
                e.preventDefault();
                e.stopPropagation();
              } else {
                setCurrentIndex(currentIndex - 1);
              }
            }}
            sx={{
              margin: '0 !important',
              zIndex: 100,
              padding: 0,
              borderRadius: 0,
            }}
          >
            <Survey
              handleClose={() => {
                getContent();
                if (currentIndex === 0) {
                  navigate(-1);
                } else {
                  setCurrentIndex(currentIndex - 1);
                }
              }}
              // handleX={()=>{getContent(); setCurrentIndex(-1);}}
              question={question}
              answers={answers}
              selectAnswer={selectAnswer}
              index={i + 1}
              total={mbtiStore.questions.length}
              handleNext={handleNextMbti}
            />
          </Dialog>
        ) : null;
      })}

      {openResult && (
        <Dialog
          key={`mbti-result`}
          fullWidth
          hideBackdrop
          keepMounted
          maxWidth={'md'}
          open={openResult}
          TransitionComponent={Transition}
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              p: 0,
              m: '0 !important',
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              boxShadow: 'none',
              overflowY: 'auto',
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
          }}
        >
          <Result
            handleClose={() => {
              setOpenResult(false);
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

export default MbtiStart;
