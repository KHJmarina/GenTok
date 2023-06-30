import Box from '@mui/material/Box';
import { Stack, FormControlLabel, Typography, Checkbox } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState, useCallback } from 'react';
import { useStores } from '../../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import Iconify from 'src/components/iconify';
import { pxToRem } from 'src/theme/typography';
import { CustomTextField } from 'src/components/custom-input';
import { useForm } from 'react-hook-form';
import { ReactComponent as IconCoin } from 'src/assets/icons/ico-coin.svg';
import FormProvider from 'src/components/hook-form';
import { CallApiToStore } from 'src/utils/common';
import { IQuestionItemList } from 'src/models/dna-card-question-item/DnaCardQuestionItem';
/**
 * ## DuplicateChoice 설명
 *
 */
interface Props {
  index: number;
  question: any;
  handleNext: any;
}
export const DuplicateChoice = observer(({ index, question, handleNext }: Props) => {
  const rootStore = useStores();
  const { dnaCardQuestionItemStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [inputCount, setInputCount] = useState(0);
  const [etcChecked, setEtcChecked] = useState(false);
  const [active, setActive] = useState<boolean>(false);
  const [etcValue, setEtcValue] = useState<any>(null);
  const [checkedLists, setCheckedLists] = useState<any>([]);
  const [etcQuestnItemSid, setEtcQuestnItemSid] = useState<number>(0);
  const [checkedTextFormatLists, setCheckedTextFormatLists] = useState<any>([]);
  
  const methods = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async () => {
    const QuestionItemList: IQuestionItemList[] = [];
    checkedLists.map((questnItemSid: any, index : number) => {
      QuestionItemList.push(
        {
          surveyQuestnItemSid: questnItemSid,
          answerText: etcQuestnItemSid == questnItemSid ? etcValue : null,
        },
      );
    })

    const param: any = getValues();
    param.questnItemList = QuestionItemList;

    const survey = question?.surveySid!;
    const questionItemSid = question?.surveyQuestnSid!;

  await CallApiToStore(
      dnaCardQuestionItemStore.addDnaCardSurvey(param, survey, questionItemSid),
      'api',
      loadingStore,
    ).then(() => {
      setCheckedLists([])
      setCheckedTextFormatLists([])
    })
    .catch((e) => console.log(e));
  };

  //체크값 관리하기
  const onCheckedElement = useCallback(
    (checked: any, surveyQuestnItemSid: number, textFormat : string) => {
      const checkListCopy = [...checkedLists]
      const checkedTextFormatListCopy=[...checkedTextFormatLists]
      
      if (checked) {
        checkListCopy.push(surveyQuestnItemSid)
        setCheckedLists(checkListCopy);
        
        checkedTextFormatListCopy.push(textFormat);
        setCheckedTextFormatLists(checkedTextFormatListCopy);
        
        if(checkListCopy.length>0){
          setActive(true);
        } else if(checkListCopy.length === 0){
          setActive(false);
        }
        
        if(checkedTextFormatListCopy.includes('기타')){
          setEtcChecked(true);
          if(inputCount!== 0){
            setActive(true);
          }else{
            setActive(false);
          }
        }
      
      } else if (!checked && checkedLists.includes(surveyQuestnItemSid)) {

        const result = checkedLists.filter((el: any) => el !== surveyQuestnItemSid);
        setCheckedLists(result);
        
        const textFormatResult = checkedTextFormatLists.filter((element:any) => element !== textFormat)
        setCheckedTextFormatLists(textFormatResult);
        
        if(result.length>0){
          setActive(true);
        }else if(result.length ==0){
          setActive(false);
        }
        if(textFormatResult.includes('기타')){
          if(inputCount!=0){
            setActive(true);
          }else{
            setActive(false);
          }
          setEtcChecked(true)
        }
      }
    },
    [checkedLists, checkedTextFormatLists, inputCount],
  );

  const handleInput = (e: any) => {
    setInputCount(e.target.value.length);
    setEtcValue(e.target.value);
    setActive(false);

    if (e.target.value.length > 0) {
      setActive(true);
    }
  };

  useEffect(() => {
  }, []);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          {question.itemList.map((item: any, i: number) => {
            return (
              <Stack key={i}>
                <FormControlLabel
                  value={item.surveyQuestnItemSid}
                  control={
                    <Checkbox
                      icon={
                        <Iconify
                          icon={'material-symbols:check-circle-outline-rounded'}
                          color={'#DFE0E2'}
                        />
                      }
                      value={item.itemTextFormat}
                      checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
                      sx={{ ml: 0, p: 0, mr: pxToRem(10) }}
                      disableRipple
                      checked={checkedLists.includes(item.surveyQuestnItemSid) ? true : false}
                    />
                  }
                  label={item.itemTextFormat}
                  sx={{ mx: pxToRem(20), mt: i == 0 ? 0 : pxToRem(20) }}
                  onChange={(e: any) => {
                    if (e.target.checked && e.currentTarget.value == '기타') {
                      setEtcChecked(true);
                      setEtcQuestnItemSid(item.surveyQuestnItemSid);
                    } else {
                      setEtcChecked(false);
                    }
                    onCheckedElement(e.currentTarget.checked, item.surveyQuestnItemSid, item.itemTextFormat);
                  }}
                />

                {etcChecked && item.extraInputYn  ? (
                  <CustomTextField
                    key={i + `textField`}
                    multiline
                    name="주관식"
                    placeholder={item.inputPlhldr}
                    required
                    sx={{
                      borderRadius: pxToRem(5),
                      fontVariant: 'Kor_14_r',
                      '& .MuiOutlinedInput-root': {
                        alignItems: 'flex-end',
                        border: inputCount > 0 ? '1px solid #FF7F3F' : '',
                        '&.Mui-focused': {
                          boxShadow: 'none !important',
                        },
                        p: pxToRem(10),
                      },
                      mx: pxToRem(20),
                      mt: pxToRem(18),
                    }}
                    onChange={handleInput}
                  ></CustomTextField>
                ) : null}
              </Stack>
            );
          })}
        </Stack>
        <Box
          id={`bnt-result-survey-getPoint`}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            border: active == true ? 'none' : '1px solid #C6C7CA', 
            width: pxToRem(156),
            height: pxToRem(43),
            m: 'auto',
            mt: pxToRem(30),
            mb: pxToRem(20),
            cursor: active == true ? 'pointer' : 'default',
            backgroundColor: active == true ? theme.palette.primary.main : '#FFFFFF',
          }}
          onClick={(e: any) => {
            if (active == true) {
              onSubmit();
              handleNext();
            } else {
              e.preventDefault();
            }
          }}
        >
          <IconCoin style={{ width: pxToRem(24), height: pxToRem(24) }} />
          <Typography
            sx={{
              ml: 1,
              fontSize: pxToRem(18),
              fontWeight: 500,
              color: active == true ? '#FFFFFF' : '#C6C7CA',
            }}
          >
            10P 받기
          </Typography>
        </Box>
      </FormProvider>
    </>
  );
});

export default DuplicateChoice;

