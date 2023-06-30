import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import ExchangeOrderNoItems from './order-history-items/exchange/ExchangingOrderNoItems';
/*
 * ## ReadyOrderHistoryDetail 설명
 * 교환중
 */
export const ExchangeOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <ExchangeOrderNoItems />
    </>
  );
});

export default ExchangeOrderHistoryDetail;
