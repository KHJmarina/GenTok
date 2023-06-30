import Box from '@mui/material/Box';
import { Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import { PATH_ROOT } from '../../../../../routes/paths';
import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import ReadyOrderNoItems from './order-history-items/ready/ReadyOrderNoItems';
import { pxToRem } from 'src/theme/typography';
import { ReactComponent as IconInqueryCandy } from 'src/assets/icons/ico-inquery-candy.svg';

/*
 * ## ReadyOrderHistoryDetail 설명
 * 배송준비중
 */
export const ReadyOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { orderNo } = useParams();
  
  const [clickStatus, setClickStatus] = useState<string>('');
  
  return (
    <>
        <ReadyOrderNoItems />
        <DeliveryInfoItems />
        <PaymentinfoItems />
        <Box sx={{ alignSelf: 'center' }}>
          <IconInqueryCandy style={{marginTop: pxToRem(40), marginBottom:pxToRem(20)}}/>
          <Typography sx={{ color: '#9DA0A5', fontSize: pxToRem(14), fontWeight: 400 }}>
            현재 출고 준비 중으로 <br /> 주문 취소는
            <span style={{ color: theme.palette.primary.main }}> 1:1문의</span>를 이용 해 주세요.
          </Typography>
          <Box
            id={'btn-order-detail-goInquiry'}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'center',
              borderRadius: pxToRem(500),
              backgroundColor: '#FFFFFF',
              border: '1px solid #9DA0A5',
              m: pxToRem(20),
              width: pxToRem(335),
              height: pxToRem(43),
              mb: pxToRem(40),
              cursor:'pointer'
            }}
            onClick={() => navigate(PATH_ROOT.customer.inquiry,{ replace: true,  state : {"orderNo" : orderNo , "clickStatus" : '반품'} })}
          >
            <Typography
              variant={'Kor_12_r'}
              sx={{ color: '#9DA0A5', fontSize: pxToRem(16), fontWeight: 500 }}
            >
              문의하러 가기
            </Typography>
          </Box>
        </Box>
    </>
  );
});

export default ReadyOrderHistoryDetail;
