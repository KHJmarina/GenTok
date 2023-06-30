import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';

import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import MakingCandyOrderNoItems from './order-history-items/making-candy/MakingCandyOrderNoItems';

/**
 * ## MakingCandyOrderHistoryDetail  설명
 * 결과 생성중
 */
export const MakingCandyOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <MakingCandyOrderNoItems />
      <DeliveryInfoItems />
      <PaymentinfoItems />
    </>
  );
});

export default MakingCandyOrderHistoryDetail;
