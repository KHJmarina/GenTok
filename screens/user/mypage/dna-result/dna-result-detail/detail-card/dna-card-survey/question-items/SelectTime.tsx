import Box from '@mui/material/Box';
import { Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import { makeStyles } from '@material-ui/core/styles';
import { CustomTextField } from 'src/components/custom-input';

import { ReactComponent as IconCoin } from 'src/assets/icons/ico-coin.svg';
import FormProvider from 'src/components/hook-form';
import { CallApiToStore } from 'src/utils/common';
import { IQuestionItemList } from 'src/models/dna-card-question-item/DnaCardQuestionItem';
import { useForm } from 'react-hook-form';

/**
 * ## SelectTime 설명
 *
 */
interface Props {
  index: number;
  question: any;
  handleNext: any;
}
export const SelectTime = observer(({ index, question, handleNext }: Props) => {
  const rootStore = useStores();
  const { dnaCardQuestionItemStore, loadingStore } = rootStore;
  const theme = useTheme();
  const classes = useStyles();
  const [inputCount, setInputCount] = useState(0);
  const [active, setActive] = useState<boolean>(false);
  const [validChk, setValidChk] = useState(false);
  const [timeValue, setTimeValue] = useState<any>(null);
  const [questnItemSid, setQuestnItemSid] = useState(0);

  const regExp = /^[0-9]{1,2}$/;
  const timeRegExp = /^[0-9]+$/;

  const handleInput = (e: any) => {
    setInputCount(e.target.value.length);

    if (e.target.value.length > 0 && e.target.value.length < 3) {
      setActive(true);
    } else {
      setActive(false);
    }

    console.log(e.target.value);
    if (
      !regExp.test(e.target.value) ||
      e.target.value.length > 2 ||
      !timeRegExp.test(e.target.value)
    ) {
      setValidChk(true);
      setActive(false);
      setTimeValue(e.target.value.replace(/[^0-9]/, ''));
    } else {
      setValidChk(false);
      setActive(true);
      setTimeValue(e.target.value);
    }
  };

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
    QuestionItemList.push({
      surveyQuestnItemSid: questnItemSid,
      answerText: `평균 ${timeValue} 시`,
    });

    const param: any = getValues();
    param.questnItemList = QuestionItemList;

    const survey = question?.surveySid!;
    const questionItemSid = question?.surveyQuestnSid!;

    await CallApiToStore(
      dnaCardQuestionItemStore.addDnaCardSurvey(param, survey, questionItemSid),
      'api',
      loadingStore,
    ).then(() => {});
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ mx: pxToRem(24) }}>
          <Stack
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            
          >
            <Box sx={{ mr: pxToRem(10) }}>
              <Typography variant={'Kor_14_r'} sx={{ color: '#5D6066' }}>평균</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex', 
                alignItems: 'center',
                mx: pxToRem(10)
              }}
            >
              <CustomTextField
                label={''}
                name={'timeSelect'}
                variant={'outlined'}
                placeholder={'시간'}
                onChange={(e: any) => {
                  setQuestnItemSid(question?.itemList[0]?.surveyQuestnItemSid);
                  handleInput(e);
                }}
                InputProps={{
                  classes: { input: classes.textField },
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  borderRadius: pxToRem(5),
                  '& .MuiOutlinedInput-root': {
                    width: pxToRem(149),
                    height: pxToRem(44),
                    p: pxToRem(10),
                    fontSize: pxToRem(14),
                    lineHeight: pxToRem(22),
                    fontWeight: 400,
                    border: inputCount > 0 ? '1px solid #FF7F3F' : '1px solid #EEEEEE',
                    '&.Mui-focused': {
                      boxShadow: 'none',
                    },
                  },
                }}
              ></CustomTextField>
              <Typography variant={'Kor_14_r'} sx={{ color: '#5D6066', ml: pxToRem(10) }}>시</Typography>
            </Box>
          </Stack>

          {validChk && (
            <Box sx={{ mt: pxToRem(10), textAlign: 'left' }}>
              <Typography variant={'Kor_12_r'} sx={{ color: '#F93D40' }}>
                {' '}
                숫자(최대 2자)만 작성 가능
              </Typography>
            </Box>
          )}
        </Stack>

        <Box
          id={`bnt-result-survey-getPoint`}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            border: active == true ? 'none' : '1px solid #C6C7CA', //'#FAFAFA',
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

export default SelectTime;

const useStyles = makeStyles(() => ({
  formControl: {
    '& .MuiSelect-select': {
    },
  },
  textField: {
    '&::placeholder': {
      fontVariant: 'Kor_14_r',
      color: '#9DA0A5',
    },
    padding: 0,
  },
}));
