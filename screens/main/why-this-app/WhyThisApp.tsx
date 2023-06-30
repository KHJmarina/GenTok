import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import { useTheme, Typography, Stack } from '@mui/material';
import Image from '../../../components/image/Image';
import { pxToRem } from 'src/theme/typography';
import why1 from 'src/assets/images/main_why1.svg'
import why2 from 'src/assets/images/main_why2.svg'
import why3 from 'src/assets/images/main_why3.svg'
import why4 from 'src/assets/images/main_why4.svg'

/**
 * ## WhyThisApp 설명
 *
 */
export const WhyThisApp = observer(() => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  const contents = [
    {num : '01', title1 :'국내 1위,', title2: '글로벌 최정상 수준의 분석 규모',content : '오랜 기간 축적된 경험과 노하우, 그리고 세계적 수준의 유전자 분석 규모를 보유하고 있습니다.', image : why1},
    {num : '02', title1 :` 가장 완벽한`, title2: '한국인 표준 유전체 지도 완성',content : '가장 정교한 ‘한국인 표준 서열‘ 완성을 통해 한국인의 유전서열을 누구보다 잘 이해하고 있습니다.', image : why2},
    {num : '03', title1 :` 최대 규모의`, title2: '한국인 데이터베이스',content : '국내 최대 규모의 한국인 유전체 데이터를 구축하여 한국인 특화 유전자 분석 서비스를 제공합니다.', image : why3},
    {num : '04', title1 :` 업계 최초`, title2: '개인정보보호 관리체계 인증',content : '유전체 업계 최초 개인정보보호 관리체계(PIMS) 인증을 획득하여 고객 정보의 보안을 약속합니다.', image : why4}
  ]

  return (
    <>
    {/* 제목 */}
     <Box sx={{px:pxToRem(20), pt:pxToRem(20), textAlign:'left'}}>
       <Typography variant={'Kor_22_b'}>왜 젠톡인가요?</Typography>
     </Box>

     {/* 내용 */}
     {contents.map((value:any, i:number) => {
      return(
        <Stack key={`main-why-${i}`} sx={{ px:pxToRem(20), pt:pxToRem(17)}}>
          <Stack sx={{display:'flex', flexDirection:'row', borderBottom: '1px solid #eeeeee', width:'100%'}}>
            <Typography variant='Eng_16_b' sx={{color : theme.palette.primary.main}}> {value.num} </Typography>
            <Box sx={{display:'flex', flexDirection:'column', textAlign:'left', ml:1.5, pb:pxToRem(27), width:'100%'}}>
              <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', pb:1}}>
                <Box>
                  <Typography variant='Kor_18_b'> {value.title1} </Typography><br/>
                  <Typography variant='Kor_18_b'> {value.title2} </Typography>
                </Box>
                <Image src={value.image} effect={'opacity'} sx={{ height: '100%'}}/>
              </Box>
              <Typography variant='Kor_14_r'> {value.content} </Typography>
            </Box>
          </Stack>
        </Stack>
      )
     })}
    </>
  );
});

export default WhyThisApp;