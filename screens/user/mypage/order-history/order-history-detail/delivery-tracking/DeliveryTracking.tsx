import Box from '@mui/material/Box';
import { Stack, Typography, Divider } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { CHeader } from 'src/components/CHeader';
import { useNavigate, useParams } from 'react-router';
import { pxToRem } from 'src/theme/typography';
import { DeliveryFaq } from './delivery-faq/DeliveryFaq';
import { DeliveryItems } from './delivery-items/DeliveryItems';
import { DeliveryStatus } from './delivery-status/DeliveryStatus';
import { ReactComponent as IconDelivery } from 'src/assets/icons/ico-delivery.svg';
import { CallApiToStore } from 'src/utils/common';
import { toJS } from 'mobx';
import { IDeliveryTracking } from 'src/models';
import moment from 'moment';
import { IOrderHistory } from 'src/models/order-history/OrderHistory';
/**
 * ## DeliveryTracking 설명
 *
 */
interface Props {
  type?: string
}
export const DeliveryTracking = observer(({
}: Props) => {
  const rootStore = useStores();
  const { deliveryTrackingStore,orderHistoryStore,loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  
  const options: any = {
    showMainIcon: 'back',
  };

  return (
    <>
      <Stack>
        <CHeader
          title={'배송조회'}
          {...options}
        />
        <Box sx={{ py: pxToRem(16) }}>
        {orderHistoryStore.orderHistory?.orderStateCd?.code == 210105 ? 
          ( <Box>
            <Typography variant={'Kor_18_b'}> 키트가 배송 중이에요 </Typography>
            <IconDelivery />
          </Box> ):''}
          
        {orderHistoryStore.orderHistory?.orderStateCd?.code == 210106 ? 
        ( <Box>
          <Typography variant={'Kor_18_b'}>
            <span style={{ color: '#FF7F3F' }}>{orderHistoryStore.orderHistory.analssCmpltnDt
            ? moment(orderHistoryStore.orderHistory?.analssCmpltnDt!).format('M/DD(dd)') 
            : ''
          }</span> 키트가 배송 완료됐어요 
          </Typography>
          <IconDelivery />
        </Box> ):''}  
      
      
        {orderHistoryStore.orderHistory?.orderStateCd?.code == 210107 ? 
        ( <Box>
        <Typography variant={'Kor_18_b'}> 키트가 반송 중이에요 </Typography>
          <IconDelivery />
        </Box> ):''}
        
        
        {/* {type ==  null ? 
        ( <Box>
        <Typography variant={'Kor_18_b'}> 키트가 배송 중이에요</Typography>
          <IconDelivery />
        </Box> ):''} */}

        </Box>
        <Divider sx={{ height: pxToRem(8) }} />
        
        <DeliveryItems />
        <DeliveryStatus />
        <DeliveryFaq />
      </Stack>
    </>
  );
});
function shippingCandy() {
  <Box>
    <Typography variant={'Kor_18_b'}> 키트가 배송 중이에요</Typography>
    <IconDelivery />
  </Box>
}

function deliveredCandy() {
  <Typography variant={'Kor_18_b'}>
    <span style={{ color: '#FF7F3F' }}>2/21(화)</span> 키트가 배송 완료됐어요
  </Typography>
}

function completeReturnRequestKit() { //키트 반송 신청 완료(반송중)
  <Typography variant={'Kor_18_b'}> 키트가 배송 중이에요</Typography>
}
export default DeliveryTracking;
