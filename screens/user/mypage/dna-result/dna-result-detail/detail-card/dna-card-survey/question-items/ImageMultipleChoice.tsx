import Box from '@mui/material/Box';
import { Stack, RadioGroup, Radio, FormControlLabel, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import Iconify from 'src/components/iconify';
import { pxToRem } from 'src/theme/typography';
import { makeStyles } from '@material-ui/core/styles';
import Image from 'src/components/image';
import { ReactComponent as IconCoin } from 'src/assets/icons/ico-coin.svg';
import FormProvider from 'src/components/hook-form';
import { CallApiToStore } from 'src/utils/common';
import { IQuestionItemList } from 'src/models/dna-card-question-item/DnaCardQuestionItem';
import { useForm } from 'react-hook-form';

/**
 * ## ImageMultipleChoice 설명
 *
 */
interface Props {
  index: number;
  question: any;
  handleNext: any;
}
export const ImageMultipleChoice = observer(({ index, question, handleNext }: Props) => {
  const rootStore = useStores();
  const { dnaCardQuestionItemStore, loadingStore } = rootStore;
  const theme = useTheme();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const [value, setValue] = useState('');
  const [active, setActive] = useState<boolean>(false);
  const [questnItemSid, setQuestnItemSid] = useState(0);

  const radioCheckedIcon = (
    <Iconify icon={'material-symbols:radio-button-checked'} sx={{ stroke: '#BDBDBD' }} />
  );

  const handleChange = (e: any) => {
    setValue(e.target.value);
    setActive(true);
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
        <Stack>
          {question.itemList.map((item: any, i: number) => {
            return (
              <RadioGroup
                sx={{ ml: 1, fontSize: pxToRem(16) }}
                key={i}
                value={value}
                onChange={(e: any) => {
                  setQuestnItemSid(item.surveyQuestnItemSid);
                  handleChange(e);
                }}
              >
                <FormControlLabel
                  value={item.itemTextFormat}
                  control={<Radio disableRipple checkedIcon={radioCheckedIcon} />}
                  label={item.itemTextFormat}
                  sx={{ ml: 1 }}
                />
                <Image
                  src={
                    question.thumbnlPath
                      ? `${REACT_APP_IMAGE_STORAGE}${question.thumbnlPath}`
                      : '/assets/default-goods.svg'
                  }
                  sx={{ maxWidth: '100%', height: 'auto' }}
                />
              </RadioGroup>
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

export default ImageMultipleChoice;
