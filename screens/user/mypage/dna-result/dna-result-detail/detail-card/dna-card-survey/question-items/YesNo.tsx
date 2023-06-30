import Box from '@mui/material/Box';
import { Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form';
import { CallApiToStore } from 'src/utils/common';
import { IQuestionItemList } from 'src/models/dna-card-question-item/DnaCardQuestionItem';
import { ReactComponent as IconCoin } from 'src/assets/icons/ico-coin.svg';

/**
 * ## YesNo 설명
 *
 */

interface Props {
  index: number;
  question: any;
  handleNext: any;
}

export const YesNo = observer(({ index, question, handleNext }: Props) => {
  const rootStore = useStores();
  const { dnaCardQuestionItemStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [selectYes, setSelectYes] = useState<boolean>(false);
  const [selectNo, setSelectNo] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [questnItemSid, setQuestnItemSid] = useState(0);

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
      answerText: null,
    });

    const param: any = getValues();
    param.questnItemList = QuestionItemList;

    const survey = question?.surveySid!;
    const questionItemSid = question?.surveyQuestnSid!;

    await CallApiToStore(
      dnaCardQuestionItemStore.addDnaCardSurvey(param, survey, questionItemSid),
      'api',
      loadingStore,
    ).then(() => {}).catch;
  };

  useEffect(() => {}, []);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ mx: pxToRem(24) }}>
            <Box
              sx={{
                borderRadius: '100%',
                width: pxToRem(64),
                height: pxToRem(64),
                backgroundColor: selectYes ? theme.palette.primary.main : '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column-reverse',
                justifyContent: 'space-around',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectYes(true);
                setSelectNo(false);
                setActive(true);
                setQuestnItemSid(question.itemList[0].surveyQuestnItemSid);
              }}
            >
              <ThumbUpOffAltIcon
                sx={{
                  color: selectYes ? '#FFFFFF' : '#13DB95',
                }}
              />
            </Box>
            <Typography variant={'Kor_14_r'} sx={{ mt: pxToRem(9) }}>
              {question.itemList[0].itemTextFormat}
            </Typography>
          </Box>

          <Box sx={{ mx: pxToRem(24) }}>
            <Box
              sx={{
                borderRadius: '100%',
                width: pxToRem(64),
                height: pxToRem(64),
                backgroundColor: selectNo ? theme.palette.primary.main : '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column-reverse',
                justifyContent: 'space-around',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectNo(true);
                setSelectYes(false);
                setActive(true);
                setQuestnItemSid(question.itemList[1].surveyQuestnItemSid);
              }}
            >
              <ThumbDownOffAltIcon sx={{ color: selectNo ? '#FFFFFF' : '#FE6164' }} />
            </Box>
            <Typography variant={'Kor_14_r'} sx={{ mt: pxToRem(9) }}>
              {question.itemList[1].itemTextFormat}
            </Typography>
          </Box>
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

export default YesNo;
