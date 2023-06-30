import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import RefundedOrderNoItems from './order-history-items/refund/RefundedOrderNoItems';
/*
 * ## RefundedOrderHistoryDetail 설명
 * 반품 완료
 */
export const ExchangeOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <RefundedOrderNoItems />
    </>
  );
});

export default ExchangeOrderHistoryDetail;
