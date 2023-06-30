import { Box, Button, Paper, Toolbar, Typography, useTheme, Stack, Dialog, Tooltip, styled, TooltipProps, tooltipClasses } from '@mui/material';
import { useNavigate } from 'react-router';
import { PATH_ROOT } from 'src/routes/paths';
import { observer } from "mobx-react-lite";
import { useStores } from "src/models/root-store/root-store-context"
import { CallApiToStore } from 'src/utils/common';
import React, { useState, useEffect } from 'react';
import { numberComma } from 'src/utils/common';
import { IOrderItem } from 'src/models/order-item/OrderItem';
import { IAddress } from 'src/models/address/Address';
import { pxToRem } from 'src/theme/typography';
import OrderPopup from '../popup/OrderPopup';
import CAlert from 'src/components/CAlert';
import { IGoodsModel } from 'src/models/market-store/Goods';

type Props = {
  isFirst: boolean;
  totGoodsLen: number;
  totPaymentAmt: number;
  currencyCd?: string;
};

export const CartFooter = observer(({ isFirst, totGoodsLen, totPaymentAmt, currencyCd }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const rootStore = useStores();
  const { loadingStore, orderStore, marketStore, addressStore, responseStore } = rootStore;
  const [openPopup, setOpenPopup] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleOrder = async () => {
    // 결제하기 진입 전 goodsSid, goods, orderItem, tempAddr 초기화
    orderStore.setProps({
      goodsSid: 0,
      goods: {} as IGoodsModel,
      orderItem: {} as IOrderItem,
    });

    addressStore.setProps({
      tempAddr: {} as IAddress,
    });

    const cart = marketStore.cartStore.list.filter((item) => item.checkYn === true);

    CallApiToStore(orderStore.getGoodsCheck(cart), 'api', loadingStore)
      .then((res: any) => {
        if (responseStore.responseInfo.resultCode === 'S') {
          if (orderStore.goodsCheck.goodsAlertYn) {
            setOpenPopup(true);
            window.history.pushState(null,'',window.location.href);
          } else {
            if (orderStore.goodsCheck.alertYn) {
              setIsAlertOpen(orderStore.goodsCheck.alertYn);
              setAlertMsg(orderStore.goodsCheck.alertMsg!);
              setIsSuccess(true);
              window.history.pushState(null,'',window.location.href);
            } else {
              navigate(PATH_ROOT.market.payment, { replace: true });
            }
          }
        } else {
          if (responseStore.responseInfo) {
            setAlertMsg(responseStore.responseInfo.errorMessage || '');
            setIsAlertOpen(true);
            window.history.pushState(null,'',window.location.href);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const handleClosePopup = () => {
    setOpenPopup(false);
    navigate(-1);
  }

  useEffect(() => {
    window.addEventListener('popstate', () => {
      setOpenPopup(false);
      setIsAlertOpen(false);
    });
  }, []);


  return (
    <Stack>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar,
          borderRadius: pxToRem(30),
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            width: '100%',
            height: pxToRem(60),
            background: theme.palette.primary.main,
            borderRadius: pxToRem(30),
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            justifyContent: 'space-between',
            maxWidth: theme.breakpoints.values.md,
            px: '0px !important',
          }}
        >
          <Box sx={{ width: '40%', pl: pxToRem(20), textAlign: 'left', color: '#FFFFFF' }}>
            <Typography sx={{ fontSize: pxToRem(12), fontWeight: 600, lineHeight: pxToRem(12) }}> 총 주문금액 </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: pxToRem(2) }}>
              <Typography sx={{ fontSize: pxToRem(23), fontWeight: 600, lineHeight: pxToRem(23) }}> {numberComma(Number(totPaymentAmt))} </Typography>
              <Typography variant={'Kor_14_b'} sx={{ pl: pxToRem(2) }}> {currencyCd} </Typography>
            </Box>
          </Box>

          <CartTooltip
            open={totPaymentAmt < 21000}
            title={
              <React.Fragment>
                최소 주문금액은 &nbsp;
                <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>21,000원</span>이에요
              </React.Fragment>
            }
            sx={{ zIndex: theme.zIndex.modal-1 }}
            placement="top"
          >
            <Button
              id={`bnt-cart-placeOrder`}
              variant="contained"
              sx={{
                flex: 0.7,
                fontWeight: '600 !important',
                fontSize: `${pxToRem(16)} !important`,
                lineHeight: `${pxToRem(24)} !important`,
                color: '#202123',
                background: '#FFFFFF',
                mr: `${pxToRem(20)} !important`,
                '&.Mui-disabled, &:hover': {
                  color: '#202123',
                  background: '#FFFFFF',
                },
                borderRadius: `${pxToRem(10)} !important`,
                width: '60%'
              }}
              onClick={() => { handleOrder() }}
              disabled={totPaymentAmt === 0}
            >
              총 주문하기
              <Box
                component='span'
                sx={{
                  ml: pxToRem(4),
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: pxToRem(12),
                  lineHeight: pxToRem(26),
                  background: theme.palette.primary.main,
                  borderRadius: pxToRem(999),
                  px: pxToRem(10),
                }}
              >
                {totGoodsLen}
              </Box>
            </Button>
          </CartTooltip>
        </Toolbar>
      </Paper>

      <Dialog
        open={openPopup}
      >
        <OrderPopup 
          handleClosePopup={handleClosePopup}
          goodsCheck={orderStore.goodsCheck}
          currencyCd={marketStore.cartStore.payment.currencyCd?.value}
          isInfoOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
        />
      </Dialog>

      <CAlert
        alertContent={alertMsg}
        alertCategory="info"
        isAlertOpen={isAlertOpen}
        handleAlertClose={() => {
          setIsAlertOpen(false);
          isSuccess && navigate(PATH_ROOT.market.payment, { replace: true });
        }}
      />
    </Stack>
  );
});

export default CartFooter;

const CartTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#5D6066',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    width: 183,
    height: 34,
    fontWeight: 400,
    backgroundColor: '#5D6066',
    textAlign: 'center',
    paddingTop: theme.typography.pxToRem(8),
  },
}));