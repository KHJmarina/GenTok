import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../../../models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { Stack, Typography, Divider } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import parse from 'html-react-parser';
/**
 * ## LabInfo 설명
 *
 */
interface Props {
  labAddr:any;
  labCertifPeriod:any
}
export const LabInfo = observer(( { labAddr, labCertifPeriod } : Props ) => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <Stack sx ={{ textAlign:'left', mx: pxToRem(20), my:pxToRem(40) }} >
        <Typography variant='Kor_16_b' sx={{ mb: pxToRem(20) }} > 검사실정보 </Typography>
        <Typography variant='Kor_14_r' sx={{ color : '#BDBDBD' , mb: pxToRem(8) }} > 보건복지부 제 47호 유전자 검사기관 </Typography>
      
        <Typography variant='Kor_14_r' sx={{ lineHeight: pxToRem(22) }} > 
          {parse(labAddr.replace(/(?:\r\n|\r|\n)/gi, '<br/>'))} 
        </Typography>
        <Divider sx={{ border:'0.5px solid #EEEEEE', my: pxToRem(16)}} ></Divider>
        <Typography variant='Kor_14_r' sx={{ color : '#BDBDBD' , mb: pxToRem(8) }} >DTC 유전자검사기관</Typography>
        <Typography variant='Kor_14_r' sx={{ lineHeight: pxToRem(22) }} > 
          인증 유효기간 : {labCertifPeriod} <br />
          검사역량인증처리기관 : 국가생명윤리정책원
        </Typography>
      </Stack>
    </>
  );
});

export default LabInfo;