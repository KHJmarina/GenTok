import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import CompleteReturnRequestKitOrderNoItems from './order-history-items/return-request-kit/CompleteReturnRequestKitOrderNoItems';
/*
 * ## CompleteReturnRequestKitOrderHistoryDetail 설명
 * 키트 반송 신청 완료
 */
export const CompleteReturnRequestKitOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
        <CompleteReturnRequestKitOrderNoItems />
        <DeliveryInfoItems />
        <PaymentinfoItems />
    </>
  );
});

export default CompleteReturnRequestKitOrderHistoryDetail;
