import Box from '@mui/material/Box';
import { Typography, Stack, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';

import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import OrderNoItems from './order-history-items/first/FirstOrderNoItems';
import { pxToRem } from 'src/theme/typography';
import { useNavigate } from 'react-router';

/*
 * ## FirstOrderHistoryDetail 설명
 * 첫주문(결제완료)
 */
export const FirstOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
        <OrderNoItems />
        <DeliveryInfoItems />
        <PaymentinfoItems />
        
        {/* //결제 연동전까지 기능 제거 */}
        {!orderHistoryStore.orderHistory?.purchsConfirmYn && (
          <Box
            id={'btn-order-detail-cancleOrder'}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'center',
              borderRadius: pxToRem(500),
              backgroundColor: '#FFFFFF',
              border: '1px solid #9DA0A5',
              m: pxToRem(20),
              // width: pxToRem(335),
              width:'90%',
              height: pxToRem(43),
              // mb:pxToRem(110),
              cursor:'pointer'
            }}
            onClick={() => { navigate(`/user/mypage/order-history/cancel/${orderHistoryStore.orderHistory?.orderNo}`)}}
          >
            <Typography variant={'Kor_12_r'} sx={{ color : '#9DA0A5',fontSize: pxToRem(16), fontWeight:500 }}>
              주문 취소
            </Typography>
          </Box>
        )}
        

    </>
  );
});

export default FirstOrderHistoryDetail;
