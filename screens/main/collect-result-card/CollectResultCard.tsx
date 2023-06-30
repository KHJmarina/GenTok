import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import { Typography, useTheme, Stack } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import Image from '../../../components/image/Image';
import resultCard from 'src/assets/images/main_resultCard.svg'
import { PATH_ROOT } from 'src/routes/paths';
import { useNavigate } from 'react-router';

/**
 * ## CollectResultCard 설명
 *
 */
export const CollectResultCard = observer(() => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
    <Stack sx={{p:pxToRem(20), pt:pxToRem(30), pb:pxToRem(40)}}>
      {/* 제목 */}
     <Box sx={{ textAlign:'left'}}>
       <Typography variant={'Kor_22_b'}>MBTI 결과 카드 모으기</Typography>
     </Box>

     {/* 내용 */}
      <Stack sx={{display:'flex', flexDirection:'row', p:pxToRem(15), pt:pxToRem(20), mt:pxToRem(16), border:`1px solid #eeeeee`, borderRadius:2, alignItems:'center', cursor:'pointer'}}
        onClick={() => navigate(`${PATH_ROOT.contents.root}`)}
        >
        <Image src={resultCard} effect={'opacity'} sx={{ height: '100%', width:'20%'}}/>
        <Box sx={{textAlign:'left', ml:2, width:'80%'}}>
          <Typography variant='Kor_16_b' sx={{display:'flex'}}>나를 발견하는 또 다른 재미!</Typography>
          <Typography variant='Kor_12_r'>MBTI 테스트를 통해 나의 유형 결과 카드를 받아보세요. 과연 나의 능력치는?</Typography>
        </Box>
      </Stack>
      </Stack>
    </>
  );
});

export default CollectResultCard;