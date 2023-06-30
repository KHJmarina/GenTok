import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { YesNo } from '../dna-card-survey/question-items/YesNo';
import MultipleChoice from './question-items/MultipleChoice';
import ShortAnswer from './question-items/ShortAnswer';
import Scale from './question-items/Scale';
import ImageMultipleChoice from './question-items/ImageMultipleChoice';
import DateDropdown from './question-items/DateDropdown'
import SelectTime from './question-items/SelectTime';
import DuplicateChoice from './question-items/DuplicateChoice';

/**
 * ## QuestionItems 설명
 *
 */


interface Props {
  index: number;
  question: any ;
  handleNext : any
}

export const QuestionItems = observer(({ index, question, handleNext } : Props) => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();


  useEffect(() => {
  },[]);

  const answerButtons = () => {

    if (question.questnTypeCd.code == 440301) { // Yes/No
      return <YesNo index={index} question={question} handleNext={handleNext} />;
      
    } else if (question.questnTypeCd.code == 440302 && question.itemDataTypeCd.code == 440201
              && question.mltplChoiceYn == false) { //객관식, 중복선택X
      return <MultipleChoice index={index} question={question} handleNext={handleNext} />;
    
    }else if(question.questnTypeCd.code == 440302 && question.itemDataTypeCd.code == 440201 
            && question.mltplChoiceYn == true){ // 객관식, 중복선택 O
      return (<DuplicateChoice index={index} question={question} handleNext={handleNext} />);
    
    } else if (question.questnTypeCd.code == 440302 && question.itemDataTypeCd.code == 440202) { 
                // 객관식, 이미지
      return <ImageMultipleChoice index={index} question={question} handleNext={handleNext}/>;
      
    } else if (question.questnTypeCd.code  == 440303 && question.itemList[0].itemTextFormat == null) { // 주관식
      return <ShortAnswer index={index} question={question}  handleNext={handleNext} />;
      
    }else if(question.questnTypeCd.code  == 440303 && question.itemDataTypeCd.code == 440201 
            && (question.itemList[0].itemTextFormat == "__yyyy__ 년 __mm__ 월 __dd_ 일" || question.itemList[0].itemTextFormat == "‘__yyyy__ 년 __mm_ 월" )){ // 주관식, 날짜
      return(<DateDropdown index={index} question={question} handleNext={handleNext}/>);
      
    } else if(question.questnTypeCd.code  == 440303 && question.itemDataTypeCd.code == 440201 
            && (question.itemList[0].itemTextFormat == "총  __number__ 시간" || "평균 __HH__ 시")){ // 주관식, 시간
      return(<SelectTime index={index} question={question} handleNext={handleNext}/>)
      
    } else if (question.questnTypeCd.code  == 440304) { // 척도
      return <Scale index={index} question={question} handleNext={handleNext} />;
    } 
    
  };

  return <>{answerButtons()}</>;
});

export default QuestionItems;

