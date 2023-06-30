import Box from '@mui/material/Box';
import {
  Stack,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  InputAdornment,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import Iconify from 'src/components/iconify';
import { pxToRem } from 'src/theme/typography';
import { makeStyles } from '@material-ui/core/styles';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { CustomTextField } from 'src/components/custom-input';
import { fontVariant } from 'html2canvas/dist/types/css/property-descriptors/font-variant';

import { useForm } from 'react-hook-form';
import { ReactComponent as IconCoin } from 'src/assets/icons/ico-coin.svg';
import FormProvider from 'src/components/hook-form';
import { CallApiToStore } from 'src/utils/common';
import { IQuestionItemList } from 'src/models/dna-card-question-item/DnaCardQuestionItem';

/**
 * ## Scale 설명
 *
 */
interface Props {
  index: number;
  question: any;
  handleNext: any;
}
export const Scale = observer(({ index, question, handleNext }: Props) => {
  const rootStore = useStores();
  const { dnaCardQuestionItemStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [selectNum, setSelectNum] = useState<number>(0);
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
    ).then(() => {});
  };

  useEffect(() => {}, []);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {question.itemList.map((item: any, i: number) => {
            return (
              <Stack key={i} sx={{ mx: pxToRem(8) }}>
                <Box
                  sx={{
                    width: pxToRem(46),
                    height: pxToRem(46),
                    borderRadius: '100%',
                    backgroundColor: selectNum == item.score ? '#FF7F3F' : '#FAFAFA',
                    color: selectNum == item.score ? '#FFFFFF' : '#202123',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                  onClick={() => {
                    setSelectNum(item.score);
                    setQuestnItemSid(item.surveyQuestnItemSid);
                    setActive(true);
                  }}
                >
                  <Typography variant="Kor_18_b">{item.score}</Typography>
                </Box>
                <Typography
                  variant="Kor_12_r"
                  sx={{ width: pxToRem(46), height: pxToRem(46), mt: pxToRem(5) }}
                >
                  {item.itemTextFormat} <br></br>
                </Typography>
              </Stack>
            );
          })}
        </Box>
        
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

export default Scale;

