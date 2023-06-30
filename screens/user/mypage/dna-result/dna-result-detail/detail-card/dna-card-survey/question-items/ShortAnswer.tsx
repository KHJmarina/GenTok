import Box from '@mui/material/Box';
import { Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import { CustomTextField } from 'src/components/custom-input';
import { ReactComponent as IconCoin } from 'src/assets/icons/ico-coin.svg';
import FormProvider from 'src/components/hook-form';
import { CallApiToStore } from 'src/utils/common';
import { IQuestionItemList } from 'src/models/dna-card-question-item/DnaCardQuestionItem';
import { useForm } from 'react-hook-form';

/**
 * ## ShortAnswer 설명
 *
 */

interface Props {
  index: number;
  question: any;
  handleNext: any;
}
export const ShortAnswer = observer(({ index, question, handleNext }: Props) => {
  const rootStore = useStores();
  const { dnaCardQuestionItemStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [inputCount, setInputCount] = useState(0);
  const [active, setActive] = useState<boolean>(false);
  const [etcValue, setEtcValue] = useState<any>(null);
  const [questnItemSid, setQuestnItemSid] = useState(0);

  const handleInput = (e: any) => {
    setInputCount(e.target.value.length);
    setEtcValue(e.target.value);
    if (e.target.value.length > 9) {
      setActive(true);
    } else {
      setActive(false);
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
      answerText: etcValue,
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

  useEffect(() => {}, []);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          sx={{
            borderRadius: pxToRem(5),
          }}
        >
          <CustomTextField
            multiline
            name="주관식"
            // placeholder="내용을 작성해 주세요.(최소 10자이상)"
            placeholder={question.itemList[0].inputPlhldr}
            // fullWidth
            required
            sx={{
              borderRadius: pxToRem(5),

              px: pxToRem(12),
              py: pxToRem(10),
              fontVariant: 'Kor_14_r',
              '& .MuiOutlinedInput-root': {
                alignItems: 'flex-end',
                border: inputCount > 0 ? '1px solid #FF7F3F' : '',
                '&.Mui-focused': {
                  boxShadow: 'none !important',
                },
              },
            }}
            onChange={(e: any) => {
              setQuestnItemSid(question?.itemList[0]?.surveyQuestnItemSid);
              handleInput(e);
            }}
            inputProps={{
              minLength: 10,
              maxLength: 500,
              style: {
                height: pxToRem(95),
                fontVariant: 'Kor_14_r',
              },
            }}
            InputProps={{
              endAdornment: (
                // <InputAdornment position="end"sx={{ color: inputCount == 0 ? '#DFE0E2' : '#202123' }}>{inputCount}
                //   <Typography component={'span'}  sx={{ color: '#DFE0E2' }}>/500</Typography>
                // </InputAdornment>
                <Typography
                  variant={'Kor_12_r'}
                  component={'span'}
                  sx={{ color: inputCount == 0 ? '#DFE0E2' : '#202123' }}
                >
                  {inputCount}
                  <Typography variant={'Kor_12_r'} component={'span'} sx={{ color: '#DFE0E2' }}>
                    /500
                  </Typography>
                </Typography>
              ),
            }}
          ></CustomTextField>
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

export default ShortAnswer;
