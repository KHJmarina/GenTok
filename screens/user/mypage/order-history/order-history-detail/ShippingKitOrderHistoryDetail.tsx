import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import PaymentinfoItems from './order-history-items/PaymentInfoItems';
import DeliveryInfoItems from './order-history-items/DeliveryInfoItems';
import ShippingKitOrderNoItems from './order-history-items/shipping-kit/ShippingKitOrderNoItems';
import { pxToRem } from 'src/theme/typography';
import { useNavigate, useParams } from 'react-router';
import { PATH_ROOT } from 'src/routes/paths';
import ExchangeAlert from '../../exchange-alert/ExchangeAlert';
import { Stack } from '@mui/system';
/*
 * ## ShippingKitOrderHistoryDetail 설명
 * 키트 배송중
 */
export const ShippingKitOrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { orderNo } = useParams();
  const [clickStatus, setClickStatus] = useState<string>('');
  const [openExchange, setOpenExchange] = useState(false);

  const exchangeEvent = () => {
    setOpenExchange(false);
    // navigate(-1);
    console.log("orderNo : " , orderNo)
    console.log("clickStatus : ", clickStatus);
    navigate(PATH_ROOT.customer.inquiry, {replace: true, state : {"orderNo" : orderNo , "clickStatus" : clickStatus} });
  };

  const openExchangeAlert = () => {
    setOpenExchange(true);
    window.history.pushState(null,'',window.location.href);
  };

  const exchangeAlertButtonSet = () => {
    return (
      <>
        <Button
          id={'btn-order-detail-dialog-exchange/cancle-cancel'}
          variant="outlined"
          size="large"
          onClick={() => {
            setOpenExchange(false);
            navigate(-1);
          }}
          sx={{
            mr: 1.5,
            borderRadius: 5,
            minWidth: '40%',
            border: `1px solid ${theme.palette.primary.dark}`,
            color: theme.palette.primary.dark,
          }}
        >
          닫기
        </Button>
        <Button
          id={'btn-order-detail-dialog-exchange/cancle-inquiry'}
          variant="contained"
          size="large"
          onClick={exchangeEvent}
          sx={{ color: '#fff', borderRadius: 5, minWidth: '40%' }}
        >
          문의하기
        </Button>
      </>
    );
  };
  
  useEffect(() => {
    // console.log("orderNo " , orderNo)
    window.addEventListener('popstate', () => {
      setOpenExchange(false)
      navigate(-1)
    })
    
  },[])

  return (
    <>
      <ShippingKitOrderNoItems />
      <DeliveryInfoItems />
      <PaymentinfoItems />
      
      <Stack sx={{ display:'flex', mx:pxToRem(20), mt:pxToRem(40), flexDirection:'row', justifyContent: 'space-between' }} >
        <Box
          id={'btn-order-detail-requestExchange'}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: pxToRem(500),
            backgroundColor: '#FFFFFF',
            border: '1px solid #C6C7CA',
            width: '49%',
            height: pxToRem(43),
            cursor: 'pointer',
            // mr:pxToRem(5)
          }}
          onClick={() => {
            setClickStatus('교환');
            openExchangeAlert();
          }}
        >
          <Typography
            sx={{
              fontSize: pxToRem(16),
              lineHeight: pxToRem(19.9),
              fontWeight: 500,
              color: '#9DA0A5',
              py:pxToRem(12)
            }}
          >
            교환요청
          </Typography>
        </Box>

        <Box
          id={'btn-order-detail-requestCancel'}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: pxToRem(500),
            backgroundColor: '#FFFFFF',
            border: '1px solid #C6C7CA',
            width: '49%',
            height: pxToRem(43),
            cursor: 'pointer',
            // ml:pxToRem(5)
          }}
          onClick={() => {
            setClickStatus('반품');
            openExchangeAlert();
          }}
        >
          <Typography
            sx={{
              fontSize: pxToRem(16),
              lineHeight: pxToRem(19.9),
              fontWeight: 500,
              color: '#9DA0A5',
              py:pxToRem(12)
            }}
          >
            반품요청
          </Typography>
        </Box>
      </Stack>
      {openExchange && (
        <ExchangeAlert
          isAlertOpen={openExchange}
          alertContent={
            '현재 제품이 출고된 상태로,<br/>교환/반품 요청은<br/>1:1문의를 이용해주세요.'
          }
          alertCategory={'question'}
          buttonSet={exchangeAlertButtonSet()}
          handleAlertClose={() => {
            setOpenExchange(false);
            navigate(-1);
          }}
          alertTitle={' '}
        />
      )}
    </>
  );
});

export default ShippingKitOrderHistoryDetail;
