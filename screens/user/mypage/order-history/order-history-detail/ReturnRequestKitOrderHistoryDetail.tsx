import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';

import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import ReturnRequestKitOrderNoItems from './order-history-items/return-request-kit/ReturnRequestKitOrderNoItems';
/*
 * ## ReturnRequestKitOrderHistoryDetail 설명
 * 키트 반송 요청
 */
export const ReturnRequestKitOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <ReturnRequestKitOrderNoItems />
      <DeliveryInfoItems />
      <PaymentinfoItems />
    </>
  );
});

export default ReturnRequestKitOrderHistoryDetail;
