import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';

import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import DefaultOrderNoItems from './order-history-items/default-order-no-items/DefaultOrderNoItems';
import { pxToRem } from 'src/theme/typography';
import { useNavigate } from 'react-router';

/**
 * ## DefaultOrderHistoryDetail 설명
 * 정의 안 된 주문상세 공통 화면
 */
export const DefaultOrderHistoryDetail = observer(() => {

  const rootStore = useStores();
  const { loadingStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
        <DefaultOrderNoItems />
        <DeliveryInfoItems />
        <PaymentinfoItems />
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

export default DefaultOrderHistoryDetail;