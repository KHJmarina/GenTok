import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import CancelingOrderNoItems from './order-history-items/cancel/CancelingOrderNoItems';
/*
 * ## CancelingOrderHistoryDetail 설명
 * 취소 중
 */
export const CancelingOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <CancelingOrderNoItems />
      <DeliveryInfoItems />
      <PaymentinfoItems />
    </>
  );
});

export default CancelingOrderHistoryDetail;
