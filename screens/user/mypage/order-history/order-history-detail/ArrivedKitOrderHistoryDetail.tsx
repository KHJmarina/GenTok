import { Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import ArrivedOrderNoItems from './order-history-items/arrived-kit/ArrivedKitOrderNoItems';

/**
 * ## ArrivedKitOrderHistoryDetail 설명
 * 키트 도착
 */
export const ArrivedKitOrderHistoryDetail = observer(() => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  
  return (
    <>
        <ArrivedOrderNoItems />
        <DeliveryInfoItems />
        <PaymentinfoItems />
    </>
  );
});

export default ArrivedKitOrderHistoryDetail;