import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import AdditionalOrderNoItems from './order-history-items/additional/AdditionalOrderNoItems';
/*
 * ## AdditionalHistoryDetail 설명
 * 추가 주문 상세내역(인체유래물연구 동의한 경우)
 */
export const AdditionalHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
        <AdditionalOrderNoItems />
        <DeliveryInfoItems />
        <PaymentinfoItems />
    </>
  );
});

export default AdditionalHistoryDetail;
