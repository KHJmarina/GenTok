import Box from '@mui/material/Box';
import {
  Stack,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as IconCoin } from 'src/assets/icons/ico-coin.svg';
import FormProvider from 'src/components/hook-form';
import { CallApiToStore } from 'src/utils/common';
import { IQuestionItemList } from 'src/models/dna-card-question-item/DnaCardQuestionItem';
import { useForm } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';

/**
 * ## DateDropdown 설명
 *
 */

interface Props {
  index: number;
  question: any;
  handleNext: any;
}
export const DateDropdown = observer(({ index, question, handleNext }: Props) => {
  const rootStore = useStores();
  const { dnaCardQuestionItemStore, loadingStore } = rootStore;
  const theme = useTheme();
  const classes = useStyles();
  const [active, setActive] = useState<boolean>(false);
  const [active2, setActive2] = useState<boolean>(false);
  const [questnItemSid, setQuestnItemSid] = useState(0);
  const [yearValue, setYearValue] = useState('');
  const [monthValue, setMonthValue] = useState('');
  
  const yearOptions = [1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 
    1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 
    1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 
    1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 
    1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 
    1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 
    1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 
    1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 
    2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 
    2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]
  
  const monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  
  const handleChangeYear = (e: SelectChangeEvent) => {
    setYearValue(e.target.value)
    if (e.target.value != '') {
      setActive(true);
    }
  };

  const handleChangeMonth = (e: SelectChangeEvent) => {
    setMonthValue(e.target.value as string);
    if (e.target.value != '') {
      setActive2(true);
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
      answerText: `${yearValue} 년 ${monthValue} 월`,
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
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}  >
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent:'center',
            mx:'1.5rem',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mr: pxToRem(10) }}>
              <Select
                name={'year'}
                id="select-year"
                value={yearValue}
                displayEmpty
                onChange={(e:any) => {
                  setQuestnItemSid(question.itemList[0].surveyQuestnItemSid)
                  handleChangeYear(e)
                }}
                className={classes.select}
                inputProps={{ 'aria-label': 'select' }}
                sx={{
                  color: '#9DA0A5',
                  width: pxToRem(130),
                  height: pxToRem(44),
                  borderRadius: pxToRem(4),
                }}
              >
                <MenuItem disabled value=''>
                  <em style={{ fontStyle: 'normal', textAlign:'left' }}>선택</em>
                </MenuItem>
                {yearOptions.map((year: any, i: number) => (
                  <MenuItem key={i} value={year}>{year}</MenuItem>
                ))}
                
              </Select>
            <Typography sx={{ ml: pxToRem(10) }} >년</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center',  ml: pxToRem(10) }}>
              <Select
                value={monthValue}
                id="select-month"
                displayEmpty
                onChange={(e:any) => {
                  setQuestnItemSid(question.itemList[0].surveyQuestnItemSid)
                  handleChangeMonth(e)
                }}
                className={classes.select}
                sx={{
                  color: '#9DA0A5',
                  width: pxToRem(90),
                  height: pxToRem(44),
                  borderRadius: pxToRem(4),
                }}
              >
                <MenuItem disabled value=''>
                  <em style={{ fontStyle: 'normal', textAlign:'left' }}>선택</em>
                </MenuItem>
                {monthOptions.map((month: any, i: number) => (
                  <MenuItem key={i} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            <Typography sx={{  ml: pxToRem(10) }}>월</Typography>
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
            border: active == true  && active2 == true ? 'none' : '1px solid #C6C7CA', //'#FAFAFA',
            width: pxToRem(156),
            height: pxToRem(43),
            m: 'auto',
            mt: pxToRem(30),
            mb: pxToRem(20),
            cursor: active == true  && active2 == true ? 'pointer' : 'default',
            backgroundColor: active == true  && active2 == true ? theme.palette.primary.main : '#FFFFFF',
          }}
          // onClick={(e: any) => (active == true ? handleNext() : e.preventDefault())}
          onClick={(e: any) => {
            if (active == true && active2 == true) {
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
              color: active == true  && active2 == true ? '#FFFFFF' : '#C6C7CA',
            }}
          >
            10P 받기
          </Typography>
        </Box>
      </FormProvider>
    </>
  );
});

export default DateDropdown;

const useStyles = makeStyles(() => ({
  formControl: {
    '& .MuiSelect-select': {
    },
  },
  select: {
    '& .MuiOutlinedInput-input': {
      textAlign: 'left',
      color: '#9DA0A5',
    },
    '& . MuiSelect-select': {
    },
    '& .MuiSvgIcon-root': {
      color: '#C6C7CA',
    },
  },
}));
