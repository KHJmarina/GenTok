import Box from '@mui/material/Box';
import { Divider, Stack, Typography } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../../../models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import moment from 'moment';
/**
 * ## ReportCode 설명
 *
 */

interface Props {
  analssInfo: any;
}
export const ReportCode = observer(({ analssInfo }: Props) => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  useEffect(() => {
  }, []);
  
  return (
    <>
      <Stack sx ={{ textAlign:'left', my: pxToRem(40), mx: pxToRem(20)}} >
        <Typography variant='Kor_14_b' sx={{ color : '#C6C7CA' }} > 리포트코드 </Typography>
        <Typography variant='Eng_18_b'> {analssInfo.kitNo} </Typography>
        <Box sx= {{ mt: pxToRem(20)  }}>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign:'left', mb:pxToRem(8) }} >
            <Typography variant='Kor_14_b' sx={{ width: pxToRem(130) }} > 검체접수일 </Typography>
            <Typography variant='Eng_14_r'> {analssInfo.requestDt ? moment(analssInfo.requestDt).format('YYYY.MM.DD') : ''} </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign:'left', mb:pxToRem(8) }} >
            <Typography variant='Kor_14_b'sx={{ width: pxToRem(130) }}> 검체적합성 </Typography>
            <Typography variant='Kor_14_r'> {analssInfo.sampleSuitability} </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign:'left', mb:pxToRem(8) }} >
            <Typography variant='Kor_14_b' sx={{ width: pxToRem(130) }}> 검체의 출처 및 종류 </Typography>
            <Typography variant='Kor_14_r'> {analssInfo.sampleType} </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign:'left', mb:pxToRem(8) }} >
            <Typography variant='Kor_14_b' sx={{ width: pxToRem(130) }}> 검사방법 </Typography>
            <Typography variant='Eng_14_r'>{analssInfo.method} </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign:'left', mb:pxToRem(8) }} >
            <Typography variant='Kor_14_b' sx={{ width: pxToRem(130) }}> 결과보고일 </Typography>
            <Typography variant='Eng_14_r'> {analssInfo.completeDt ? moment(analssInfo.completeDt).format('YYYY.MM.DD') : ''} </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign:'left' }} >
            <Typography variant='Kor_14_b' sx={{ width: pxToRem(130) }}> 버전 </Typography>
            <Typography variant='Eng_14_r'> {analssInfo.analysisVersion} </Typography>
          </Box>
        </Box>
      </Stack>
      <Divider></Divider>
    </>
  );
});

export default ReportCode;