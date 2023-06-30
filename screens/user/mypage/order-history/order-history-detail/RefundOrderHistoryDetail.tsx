import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import RefundOrderNoItems from './order-history-items/refund/RefundOrderNoItems';
/*
 * ## ReadyOrderHistoryDetail 설명
 * 반품중
 */
export const ExchangeOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <RefundOrderNoItems />
    </>
  );
});

export default ExchangeOrderHistoryDetail;
