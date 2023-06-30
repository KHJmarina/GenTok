import { Box, Divider, Typography, Stack, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { CHeader } from 'src/components/CHeader';
import { useNavigate } from 'react-router-dom';
import { pxToRem } from 'src/theme/typography';
import Image from 'src/components/image/Image';
import { PATH_ROOT } from 'src/routes/paths';
import { ReactComponent as Lutein } from 'src/assets/images/lutein.svg';
import { numberComma } from 'src/utils/common';
import { HEADER, SPACING } from 'src/config-global';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';

/**
 * ## OrderCancelResult 설명
 *
 */
export const OrderCancelResult = observer(() => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore } = rootStore;
  const theme = useTheme();

  const navigate = useNavigate();

  const options: any = {
    showMainIcon: 'logo',
    showCartIcon: true,
    showAlarmIcon: true,
  };

  return (
    <>
      <Stack sx={{ height: '100%', pb: `${HEADER.H_MOBILE}px` }}>
        <CHeader
          {...options}
        />
        <Stack sx={{ alignItems: 'center', mt:pxToRem(30),mb: pxToRem(100) }}>
          <OrderItemImage
            imgSrc={`${orderHistoryStore.orderHistory?.goodsList[0]?.img1Path}`}
            listSize={3}
          />
        </Stack>

        <Stack>
          <Typography variant="Kor_28_b" sx={{ mb: pxToRem(12) }}>
            취소 완료
          </Typography>
          <Typography
            sx={{ fontSize: theme.typography.pxToRem(16), color: '#5D6066', mb: pxToRem(40) }}
          >
            아쉬워요...🥲
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', mx: pxToRem(40), mb: pxToRem(40) }} justifyContent="center">
          <Button
            id={'btn-order-cancel-complete-goCancelDetail'}
            variant={'outlined'}
            sx={{
              borderRadius: pxToRem(500),
              minWidth: pxToRem(167),
              height: pxToRem(43),
              color: 'primary',
              mr: pxToRem(8),
              fontWeight: 500,
              fontSize: pxToRem(16),
              '&:hover': {
                background: 'none',
                color:'#FF5D0C', 
                border:'1px solid #FF5D0C'
              },
            }}
            onClick={() => {
              navigate(
                `/user/mypage/order-history/detail/${orderHistoryStore.orderHistory?.orderNo}`,
              );
            }}
          >
            취소 상세내역
          </Button>

          <Button
            id={'btn-order-cancel-complete-goHome'}
            variant={'contained'}
            sx={{
              borderRadius: pxToRem(500),
              minWidth: pxToRem(122),
              height: pxToRem(43),
              fontWeight: 500,
              fontSize: pxToRem(16),
              '&:hover':{ 
                background:'#FF5D0C !important'
              }
            }}
            onClick={() => {
              navigate(PATH_ROOT.root);
            }}
          >
            홈으로
          </Button>
        </Box>

        <Stack sx={{ mx: pxToRem(20) }}>
          <Box sx={{ borderBottom: '1px solid #EEEEEE' }} />
          <Box sx={{ display: 'flex', mx: pxToRem(20), my: pxToRem(16), alignItems: 'center' }}>
            <Typography
              variant="Kor_14_r"
              sx={{
                color: '#9DA0A5',
                textAlign: 'center',
                flex: '0 0 auto',
                width: pxToRem(76),
                mr: pxToRem(12),
              }}
            >
              환불 방법
            </Typography>
            {
              orderHistoryStore.orderHistory?.paymentList && orderHistoryStore.orderHistory?.paymentList.length > 0 && 
              <Typography variant='Kor_14_r' sx={{ textAlign: 'left' }}>
                {orderHistoryStore.orderHistory?.paymentList[0].paymentTypeCd?.value}
              </Typography>
            }
          </Box>

          <Box sx={{ borderBottom: '1px solid #EEEEEE' }} />
          <Box sx={{ display: 'flex', mx: pxToRem(20), my: pxToRem(16), alignItems: 'center' }}>
            <Typography
              variant="Kor_14_r"
              sx={{
                color: '#9DA0A5',
                textAlign: 'center',
                flex: '0 0 auto',
                width: pxToRem(76),
                mr: pxToRem(12),
              }}
            >
              {' '}
              환불 금액
            </Typography>
            <Typography
              variant="Kor_14_b"
              sx={{ color: theme.palette.primary.main, textAlign: 'left' }}
            >
              {orderHistoryStore.orderHistory?.paymentAmt != null &&
                `${numberComma(Number(orderHistoryStore.orderHistory?.paymentAmt))}${
                  orderHistoryStore.orderHistory?.currencyCd?.value
                }`}
            </Typography>
          </Box>

          <Box sx={{ borderBottom: '1px solid #EEEEEE' }} />
          <Box sx={{ display: 'flex', mx: pxToRem(20), my: pxToRem(16), alignItems: 'center' }}>
            <Typography
              variant="Kor_14_r"
              sx={{
                color: '#9DA0A5',
                textAlign: 'center',
                flex: '0 0 auto',
                width: pxToRem(76),
                mr: pxToRem(12),
              }}
            >
              상품 정보
            </Typography>
            <Typography sx={{ fontSize: pxToRem(14), textAlign: 'left' }}>
              {orderHistoryStore.orderHistory?.goodsList[0]?.goodsNm!}
              {orderHistoryStore.orderHistory?.goodsList.length! > 1 &&
                `포함 [총 ${orderHistoryStore.orderHistory?.goodsList.length}개]`}
            </Typography>
          </Box>
          <Box sx={{ borderBottom: '1px solid #EEEEEE' }} />
        </Stack>
      </Stack>
    </>
  );
});

export default OrderCancelResult;

const myOrderCardImgStyle = {
  position: 'absolute',
  border: '1px solid #EEEEEE',
  background: '#FFFFFF',
  width: pxToRem(80),
  height: pxToRem(80),
  borderRadius: pxToRem(10),
  left: pxToRem(0),
  top: pxToRem(8),
};

const myOrderBackGroundCardStyle = {
  position: 'absolute',
  borderWidth: '1px 1px 0 0',
  borderStyle: 'solid',
  borderColor: '#EEEEEE',
  width: pxToRem(80),
  height: pxToRem(80),
  borderRadius: pxToRem(10),
};
