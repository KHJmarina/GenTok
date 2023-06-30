import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import CanceledOrderNoItems from './order-history-items/cancel/CanceledOrderNoItems';
/*
 * ## CanceledOrderHistoryDetail 설명
 * 취소 완료
 */
export const CanceledOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <CanceledOrderNoItems />
      <DeliveryInfoItems />
      <PaymentinfoItems />
    </>
  );
});

export default CanceledOrderHistoryDetail;
