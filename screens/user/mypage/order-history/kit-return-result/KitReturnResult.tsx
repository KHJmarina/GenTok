import Box from '@mui/material/Box';
import {
  Stack,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Button,
  List,
  ListItem,
} from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../../../models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import { PATH_ROOT } from '../../../../../routes/paths';
import { pxToRem } from 'src/theme/typography';
import { CustomerHeader } from 'src/components/CustomerHeader';
import Image from 'src/components/image/Image';
import { CHeader } from 'src/components/CHeader';
import { HEADER } from 'src/config-global';
import img_truck from 'src/assets/images/img_truck.svg';
/**
 * ## KitReturnResult 설명
 *
 */
export const KitReturnResult = observer(() => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { state } = useLocation();

  const options: any = {
    showMainIcon: 'none',
    showXIcon: true
    // showCartIcon: true,
    // showAlarmIcon: true,
  };

  return (
    <>
    <Stack sx={{ height: '100%', pb: `${HEADER.H_MOBILE}px` }}>
      <CHeader
        title="키트 반송 요청"
        {...options}
      />
      <Stack alignItems={'center'} px={pxToRem(20)}>
        <Image src={img_truck} sx={{width: pxToRem(185), height: pxToRem(170), mb: pxToRem(20)}} />
        <Typography variant='Kor_28_b' color={'#212121'} mb={pxToRem(12)}>키트 반송 신청 완료!</Typography>
        <Typography variant='Kor_16_r' color={'#5D6066'}>반송 신청 후 3일 이내</Typography>
        <Typography variant='Kor_16_r' color={'#5D6066'}>택배기사님이 방문합니다.</Typography>

        <Button variant='contained'
          id={`btn-order-kitReturnResult-complete`}
          sx={{my: pxToRem(40), width: pxToRem(108), height: pxToRem(43), borderRadius: pxToRem(500),
            '&:hover':{ background:'#FF5D0C !important' } 
          }}
          onClick={()=>{navigate(-1)}}
        >
          확인
        </Button>

        <Box mb={pxToRem(100)}>
          <Stack direction={'row'} sx={kitReturnInfoBoxStyle}>
            <Box sx={{width: '30%'}}>
              <Typography component={'span'} variant='Kor_14_r' color={'#9DA0A5'}>주문번호</Typography>
            </Box>
            <Box sx={{width: '70%', ml: pxToRem(12)}}>
              <Typography component={'span'} fontSize={pxToRem(17)} fontWeight={600} color={'#202123'}>{state?.orderNo}</Typography>
            </Box>
          </Stack>
          <Stack direction={'row'} sx={[kitReturnInfoBoxStyle, {borderBottomWidth: '1px'}]}>
            <Box sx={{width: '30%'}}>
              <Typography component={'span'} variant='Kor_14_r' color={'#9DA0A5'}>회수 배송지</Typography>
            </Box>
            <Box sx={{width: '70%', ml: pxToRem(12)}}>
              <Typography component={'div'} color={'#202123'}>
                <Typography component={'p'} variant='body2'>{state?.rcipntNm}</Typography>
                <Typography component={'p'} variant='body2'>{state?.phoneNo}</Typography>
                <Typography component={'p'} variant='body2'>{`${state?.addr} (${state?.zoneCd})`}</Typography>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Stack>  
    </>
  );
});

export default KitReturnResult;

const kitReturnInfoBoxStyle = {
  textAlign: 'left',
  borderWidth: '1px 0 0 0',
  borderStyle: 'solid',
  borderColor: '#DFE0E2',
  width: '100%',
  px: pxToRem(20),
  py: pxToRem(16)
}