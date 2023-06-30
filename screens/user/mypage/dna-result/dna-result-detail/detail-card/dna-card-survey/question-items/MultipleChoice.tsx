import Box from '@mui/material/Box';
import { Stack, RadioGroup, Radio, FormControlLabel, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
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
 * ## MultipleChoice 설명
 *
 */
interface Props {
  index: number;
  question: any;
  handleNext: any;
}
export const MultipleChoice = observer(({ index, question, handleNext }: Props) => {
  const rootStore = useStores();
  const { dnaCardQuestionItemStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [value, setValue] = useState('');
  const [inputCount, setInputCount] = useState(0);
  const [active, setActive] = useState<boolean>(false);
  const [etcChecked, setEtcChecked] = useState(false);
  const [etcValue, setetcValue] = useState<any>(null);
  const [questnItemSid, setQuestnItemSid] = useState(0);

  const radioCheckedIcon = (
    <Iconify icon={'material-symbols:radio-button-checked'} sx={{ stroke: '#BDBDBD' }} />
  );

  const handleChange = (e: any) => {
    setValue(e.target.value);
    if (e.target.value == '기타') {
      setActive(false);
      setEtcChecked(true);
      if (inputCount > 0) {
        setActive(true);
      }
    } else {
      setActive(true);
      setEtcChecked(false);
    }
  };

  const handleInput = (e: any) => {
    setInputCount(e.target.value.length);
    setetcValue(e.target.value);
    setActive(false);
    if (e.target.value.length > 0) {
      setActive(true);
    }
  };

  const methods = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {
    // reset,
    // setError,
    getValues,
    // setValue,
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

  useEffect(() => {
    setEtcChecked(false);
  }, []);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          {question.itemList.map((item: any, i: number) => {
            return (
              <Stack key={i}>
                <RadioGroup
                  key={i}
                  sx={{ ml: 1, fontSize: pxToRem(16) }}
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
                    onClick={(e: any) => {
                      if (e.target.value == '기타') {
                        setEtcChecked(true);
                      } else {
                        setEtcChecked(false);
                      }
                    }}
                  />
                </RadioGroup>

                {etcChecked && item.extraInputYn == true ? (
                  <CustomTextField
                    key={i + `textField`}
                    multiline
                    name="주관식"
                    placeholder={item.inputPlhldr}
                    // fullWidth
                    required
                    sx={{
                      borderRadius: pxToRem(5),
                      // px: pxToRem(12),
                      // py: pxToRem(10),
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
                      // mt: pxToRem(18),
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

export default MultipleChoice;
