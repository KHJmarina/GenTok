import { Box, Stack, Typography, Button, Divider } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { HEADER } from 'src/config-global';
import { useNavigate } from 'react-router';
import Image from 'src/components/image/Image';
import { PATH_ROOT } from 'src/routes/paths';
import { numberComma } from 'src/utils/common';
import { pxToRem } from "src/theme/typography";
import { CHeader } from 'src/components/CHeader';

/**
 * ## OrderResult 설명
 *
 */

function createData(
  title: string,
  content: string,
) {
  return { title, content };
}

export const OrderResult = observer(() => {

  const rootStore = useStores();
  const { loadingStore, orderStore } = rootStore;
  const theme = useTheme();

  const navigate = useNavigate();

  const options: any = {
    showMainIcon: 'logo',
    showCartIcon: true,
    showAlarmIcon: true,
  };

  return (
    <Stack 
      spacing={2}
      sx={{
        flex: 1,
        pb: `${(HEADER.H_MOBILE * 1.5)}px`,
        overflowY: 'auto',
        scrollMarginTop: '100px',
      }}
    >
      <CHeader
        {...options}
      />
      <Stack sx={{ m: pxToRem(16) }}>
        <Image 
          src='/assets/images/temp/order-result.svg'
          sx={{ mx: pxToRem(80), my: pxToRem(40) }}
          onError={(e: any) => {
            e.target.src = '/assets/default-goods.svg';
          }}
        />
        <Typography sx={{ fontSize: pxToRem(28), fontWeight: 700, mb: pxToRem(40) }}>주문 완료!</Typography>
        <Box sx={{ display: 'flex' }} justifyContent='center'>
          <Button
            id={`btn-cart-completeOrder-checkOrderDetail`}
            variant={'outlined'}
            sx={{ mb: pxToRem(8), borderRadius: pxToRem(50), minWidth: 130, height: 43, color: 'primary', mr: pxToRem(8), 
              '&:hover':{ background:'none', color:'#FF5D0C', border:'1px solid #FF5D0C'}
            }}
            onClick={() => {navigate(`/user/mypage/order-history/detail/${orderStore.orderResult.orderNo}`)}}
          >
            주문 상세보기
          </Button>
          
          <Button
            id={`btn-cart-completeOrder-goHome`}
            variant={'contained'}
            sx={{ mb: pxToRem(8), borderRadius: pxToRem(50), minWidth: 130, height: 43, '&:hover':{ background:'#FF5D0C !important' }  }}
            onClick={() => {navigate(PATH_ROOT.root)}}
          >
            홈으로
          </Button>
        </Box>
        
        <Box sx={{ mt: pxToRem(40), mx: pxToRem(20) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', borderTop: `1px solid ${theme.palette.divider}`, borderBottom: `1px solid ${theme.palette.divider}`, py: pxToRem(16) }}>
            <Typography variant='Kor_14_r' sx={{ color: '#9DA0A5', textAlign: 'center', flex: '0 0 auto', width: 80 }}>주문번호</Typography>
            <Typography sx={{ fontSize: pxToRem(17), fontWeight: 600, textAlign: 'left' }}>{orderStore.orderResult.orderNo}</Typography>
          </Box>
          
          {orderStore.orderResult.addr && (
            <Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}`, py: pxToRem(16) }}>
                <Typography sx={{ color: '#9DA0A5', fontSize: pxToRem(14), textAlign: 'center', flex: '0 0 auto', width: 80 }}> 배송지</Typography>
                <Typography sx={{ textAlign: 'left'}}>
                  {orderStore.orderResult.rcipntNm}<br/>
                  {orderStore.orderResult.phoneNo}<br/>
                  {orderStore.orderResult.addr}<br/>
                  ({orderStore.orderResult.zoneCd})<br/>
                </Typography>
              </Box>
            </Stack>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}`, py: pxToRem(16) }}>
            <Typography variant='Kor_14_r' sx={{ color: '#9DA0A5', textAlign: 'center', flex: '0 0 auto', width: 80 }}>결제정보</Typography>
            {
              orderStore.orderResult.paymentList && orderStore.orderResult.paymentList.length > 0 && 
              <Typography variant='Kor_14_r' sx={{ textAlign: 'left' }}>
                {orderStore.orderResult.paymentList[0].paymentTypeCd?.value}
              </Typography>
            }
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}`, py: pxToRem(16) }}>
            <Typography variant='Kor_14_r' sx={{ color: '#9DA0A5', textAlign: 'center', flex: '0 0 auto', width: 80 }}>결제금액</Typography>
            {
              orderStore.orderResult.paymentList && orderStore.orderResult.paymentList.length > 0 && 
              <Typography variant='Kor_14_r' sx={{ textAlign: 'left' }}>
                {numberComma(Number(orderStore.orderResult.paymentList[0].paymentAmt))}
                {orderStore.orderResult.paymentList[0].currencyCd?.value}
              </Typography>
            }
          </Box>
        </Box>
      </Stack>

    </Stack>
  );
});

export default OrderResult;
