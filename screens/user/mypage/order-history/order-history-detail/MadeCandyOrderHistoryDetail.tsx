import Box from '@mui/material/Box';
import { Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import { PATH_ROOT } from '../../../../../routes/paths';

import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import MadeCandyOrderNoItems from './order-history-items/made-candy/MadeCandyOrderNoItems';

/**
 * ## MadeCandyOrderHistoryDetail 설명
 * 결과 생성 완료
 */
export const MadeCandyOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <>
      <MadeCandyOrderNoItems />
      <DeliveryInfoItems />
      <PaymentinfoItems />
    </>
  );
});

export default MadeCandyOrderHistoryDetail;
