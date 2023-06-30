import Box from '@mui/material/Box';
import { Stack, Typography, Divider, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../../../models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import CheckIcon from '@mui/icons-material/Check';
import palette from 'src/theme/palette';

/**
 * ## QCResultInfo 설명
 *
 */

interface Props {
  qcResult : any;
}

export const QCResultInfo = observer(( { qcResult } : Props) => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
     <Stack sx ={{ textAlign:'left', my: pxToRem(40), mx: pxToRem(20)}} >
        <Typography variant='Kor_16_b'  > 정도관리 결과 안내 </Typography>
        <Typography variant='Kor_14_r'sx={{ my: pxToRem(20), lineHeight:pxToRem(22)  }} > 
          본 검사는 microarray 내 심어진 SNP marker의 각 allele별 signal을 이용하여 유전형을 판독하는 검사로서, 매 검사 시 chip control probe 결과를 확인하여 검사 과정에 문제가 없었는지 확인하고 있습니다. 
        </Typography>
        <Divider sx={{ borderWidth: '0.5px', borderColor:'#EEEEEE !important' }} ></Divider>
        
        <Box sx={{ my:  pxToRem(16) , display:'flex', flexDirection:'column' }} >
          <Typography variant='Kor_14_r' sx={{ color : '#BDBDBD'}} > 내부정도관리 결과 </Typography>
          <Typography variant='Kor_14_r' sx={{ mt: pxToRem(8), lineHeight:pxToRem(22)  }} > 
            본 검사 대상물은 마크로젠 분자유전검사실 내부정도관리 지침에 따른 기준을 통과하였습니다.
          </Typography>
        </Box>
        <Divider sx={{ borderWidth: '0.5px', borderColor:'#EEEEEE !important' }} ></Divider>
        
        <Box sx={{ my:  pxToRem(16) , display:'flex', flexDirection:'column'}} >
          <Typography variant='Kor_14_r' sx={{ color : '#BDBDBD'}} > 외부정도관리 결과 </Typography>
          <Typography variant='Kor_14_r' sx={{ mt: pxToRem(8) , mb: pxToRem(20), lineHeight:pxToRem(22) }} > 
            마크로젠 유전검사실은 한국유전자검사평가원에서 연 2 회 시행하는 외부정도 관리를 통해 검사 과정의 품질관리가 매우 우수함을 의미하는 A등급을 획득하여 엄격히 관리되고 있습니다.
          </Typography>
        
            <Table sx={{ borderCollapse:'separate'}} >
              <TableHead>
                <TableRow >
                  <TableCell align="center" colSpan={2} sx={{ backgroundColor:'#FAFAFA', borderRadius: '20px 20px 0 0',  border: '1px solid #EEEEEE', p:pxToRem(8) }} >
                    <Typography variant='Eng_14_r' sx={{ color: '#202123' }} >QC Result</Typography>
                  </TableCell>
                </TableRow>
                {/* <TableRow>
                <TableCell sx={{ width: '50%' }} > passed </TableCell>
                  <TableCell sx={{ width: '50%' }} > failed </TableCell>
                </TableRow> */}
              </TableHead>
              <TableBody>
                <TableRow sx= {{ display : ' flex ' }}> 
                  <TableCell sx={{ display:'flex', alignItems:'center', width : '50%', justifyContent: 'space-between', borderRadius:'0 0 0 20px', border: '1px solid #EEEEEE', p: pxToRem(20) }} > 
                    <Typography> passed </Typography>
                    {qcResult == true  ? <CheckIcon sx={{ color: theme.palette.primary.main }} /> : null }
                  </TableCell>
                  <TableCell sx={{ display:'flex', alignItems:'center', width : '50%', justifyContent: 'space-between', borderRadius:'0 0 20px 0', border: '1px solid #EEEEEE', p: pxToRem(20)  }} > 
                    <Typography> failed </Typography>
                    {qcResult == false  ? <CheckIcon sx={{ color: theme.palette.primary.main }} /> : null }
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
        </Box>
    </Stack>
    <Divider></Divider>
    </>
  );
});

export default QCResultInfo;