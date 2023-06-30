import {
  Typography,
  Button,
  Dialog,
  useTheme,
  Stack,
  styled,
  TooltipProps,
  Tooltip,
  tooltipClasses,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useStores } from 'src/models';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { GoodsImages } from '../components/GoodsImages';
import { CallApiToStore } from 'src/utils/common';
import { IOrderItem } from 'src/models/order-item/OrderItem';
import { IAddress } from 'src/models/address/Address';
import { toJS } from 'mobx';
import { getSnapshot } from 'mobx-state-tree';
import CAlert from 'src/components/CAlert';
import { ICartModel } from 'src/models/market-store/Cart';
import { pxToRem } from 'src/theme/typography';
import { PATH_ROOT } from 'src/routes/paths';
import OrderPopup from './OrderPopup';

export interface IFooterBuyProps {
  goods?: IGoodsModel;
  onClose?: (isAddCart?: boolean) => void;
}

export const FooterBuy = ({ goods, onClose }: IFooterBuyProps) => {
  const navigate = useNavigate();
  const { marketStore, orderStore, loadingStore, addressStore, responseStore } = useStores();

  const [showAddCartResult, setShowAddCartResult] = useState(false);
  const theme = useTheme();
  const [openPopup, setOpenPopup] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOnClickAddToCart = useCallback(() => {
    goods && marketStore?.cartStore.addGoods(goods.goodsSid!);
    setShowAddCartResult(true);
  }, [goods, marketStore?.cartStore]);

  const handleOnClickJustBuy = useCallback(async () => {
    const cart = new Array<ICartModel>();
    if (goods) {
      cart.push(goods);
    }

    goods &&
      CallApiToStore(orderStore.getGoodsCheck(cart), 'api', loadingStore).then((res: any) => {
        if (responseStore.responseInfo.resultCode === 'S') {
          orderStore.setProps({ goodsSid: goods.goodsSid!, goods: toJS(goods) });
          if (orderStore.goodsCheck.goodsAlertYn) {
            setOpenPopup(true);
          } else {
            if (orderStore.goodsCheck.alertYn) {
              setIsAlertOpen(orderStore.goodsCheck.alertYn);
              setAlertMsg(orderStore.goodsCheck.alertMsg!);
              setIsSuccess(true);
            } else {
              // 결제하기 진입 전 orderItem, tempAddr 초기화
              orderStore.setProps({
                orderItem: {} as IOrderItem,
              });
              addressStore.setProps({
                tempAddr: {} as IAddress,
              });
              navigate(PATH_ROOT.market.payment, { state: { goods: getSnapshot(goods) } });
            }
          }
        } else {
          if (responseStore.responseInfo) {
            setAlertMsg(responseStore.responseInfo.errorMessage || '');
            setIsAlertOpen(true);
          }
        }
      });
  }, [addressStore, goods, loadingStore, navigate, orderStore]);

  const handleClosePopup = () => {
    console.log('handleClosePopup')
    setOpenPopup(false);
  };

  const handleOnClickClose = useCallback(() => {
    onClose && onClose(showAddCartResult);
  }, [onClose, showAddCartResult]);

  const handleOnClickGoToCart = useCallback(() => {
    navigate(PATH_ROOT.market.cart);
  }, [navigate]);

  const handleSucess = useCallback(() => {
    if (goods) {
      navigate(PATH_ROOT.market.payment, { state: { goods: toJS(goods) } });
      orderStore.setProps({
        goods: toJS(goods),
        goodsSid: goods.goodsSid!,
        orderItem: {} as IOrderItem,
      });
    }
    addressStore.setProps({
      tempAddr: {} as IAddress,
    });
  }, [goods, orderStore, addressStore]);

  return (
    <Stack spacing={2} sx={{ p: 2.5, pt: 2, pb: 0 }}>
      {!showAddCartResult ? (
        <>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ p: 1 }}
          >
            <Typography
              variant={'body1'}
              sx={{ textAlign: 'left', color: '#000000', fontWeight: 400 }}
            >
              주문금액
            </Typography>

            <Typography
              variant={'body1'}
              sx={{
                textAlign: 'left',
                color: '#000000',
                fontSize: pxToRem(26),
                lineHeight: pxToRem(32),
                fontWeight: 900,
              }}
            >
              {goods?.goodsAmtKWN}
              <span
                style={{
                  fontSize: pxToRem(16),
                  lineHeight: pxToRem(19),
                  fontWeight: 500,
                }}
              >
                {goods?.currencyCd?.value}
              </span>
            </Typography>
          </Stack>

          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ gap: 1, margin: '0 !important' }}
          >
            {goods?.cartAllowedYn && (
              <Button
                variant="outlined"
                sx={{
                  flex: 1,
                  borderRadius: 4,
                  fontSize: pxToRem(16),
                  fontWeight: 500,
                  lineHeight: pxToRem(19),
                  pt: 1.5,
                  pb: 1.5,
                }}
                onClick={handleOnClickAddToCart}
              >
                장바구니
              </Button>
            )}
            {goods?.immedPurchsYn && (
              <Button
                variant="contained"
                sx={{
                  flex: 1,
                  borderRadius: 4,
                  fontSize: pxToRem(16),
                  fontWeight: 500,
                  lineHeight: pxToRem(19),
                  pt: 1.5,
                  pb: 1.5,
                }}
                onClick={handleOnClickJustBuy}
              >
                바로구매
              </Button>
            )}
          </Stack>
        </>
      ) : (
        // ADD CART RESULT --------------------------------------------------------------------------------
        <>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ p: 1, gap: 1 }}
          >
            <GoodsImages goods={goods} sx={{ width: '80px', height: '80px' }} />
            <Typography
              variant={'body1'}
              sx={{
                textAlign: 'left',
                color: '#000000',
                fontWeight: 400,
                fontSize: pxToRem(16),
                lineHeight: pxToRem(24),
              }}
            >
              장바구니에 담았습니다.
            </Typography>

            <Button
              variant="outlined"
              sx={{
                flex: '0 0 auto',
                borderRadius: 2,
                fontSize: pxToRem(12),
                fontWeight: 500,
                lineHeight: '14.32px',
                pt: 1,
                pb: 1,
                // pl: '19px',
                // pr: '19px',
              }}
              onClick={handleOnClickGoToCart}
            >
              바로가기
            </Button>
          </Stack>

          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ gap: 1, margin: '0 !important' }}
          >
            <Button
              variant="contained"
              sx={{
                flex: 1,
                borderRadius: 4,
                fontSize: pxToRem(16),
                fontWeight: 500,
                lineHeight: pxToRem(19),
                pt: 1.5,
                pb: 1.5,
              }}
              onClick={handleOnClickClose}
            >
              닫기
            </Button>
          </Stack>
        </>
      )}

      <Dialog open={openPopup}>
        <OrderPopup
          handleClosePopup={handleClosePopup}
          goodsCheck={orderStore.goodsCheck}
          currencyCd={marketStore.cartStore.payment.currencyCd?.value}
        />
      </Dialog>

      <CAlert
        alertContent={alertMsg}
        alertCategory="info"
        isAlertOpen={isAlertOpen}
        handleAlertClose={() => {
          setIsAlertOpen(false);
          isSuccess && handleSucess();
          !isSuccess && handleOnClickClose();
        }}
      />
    </Stack>
  );
};

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
