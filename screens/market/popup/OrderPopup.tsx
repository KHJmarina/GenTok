import { Box, Stack, Slide, Paper, Toolbar, Button, Typography } from '@mui/material';
import { PATH_ROOT } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../models/root-store/root-store-context';
import { numberComma } from 'src/utils/common';
import { useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import { ReactComponent as IconMarketBell } from 'src/assets/icons/ico-market-bell.svg';
import CloseIcon from '@mui/icons-material/Close';
import { IOrderItem } from 'src/models/order-item/OrderItem';
import { IAddress } from 'src/models/address/Address';
import CAlert from 'src/components/CAlert';
import { IGoodsCheckModel } from 'src/models/order/Order';
import { getSnapshot } from 'mobx-state-tree';
import { IGoodsModel } from 'src/models/market-store/Goods';

/**
 * ## OrderPopup 설명
 *
 */

type Props = {
  handleClosePopup: any;
  isFirst?: boolean;
  goodsCheck: IGoodsCheckModel;
  currencyCd?: string;
  isInfoOpen: any;
  setIsInfoOpen: any;
};
export const OrderPopup = observer(
  ({ handleClosePopup, isFirst, goodsCheck, currencyCd, isInfoOpen, setIsInfoOpen }: Props) => {
    const navigate = useNavigate();
    const rootStore = useStores();
    const { orderStore, addressStore } = rootStore;
    const theme = useTheme();
    const [alertMsg, setAlertMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSuggestion, setIsSuggestion] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false);

    useEffect(() => {
      setShowToolbar(true);

      // 추천 상품 세팅
      orderStore.goods.setProps({
        goodsSid: goodsCheck.goodsSid,
        goodsNm: goodsCheck.goodsNm,
        goodsAmt: goodsCheck.goodsAmt,
      });
    }, []);

    const handleClose = () => {
      if (!goodsCheck.continueYn) {
        handleClosePopup();
      } else {
        if (isFirst) {
          handleClosePopup();
        } else {
          handleBuy();
        }
      }
    };

    const handleBuy = async () => {
      // 결제하기 진입 전 orderItem, tempAddr 초기화
      orderStore.setProps({
        orderItem: {} as IOrderItem,
      });

      addressStore.setProps({
        tempAddr: {} as IAddress,
      });

      if (goodsCheck.alertYn) {
        setIsInfoOpen(goodsCheck.alertYn);
        setAlertMsg(goodsCheck.alertMsg!);
        setIsSuccess(true);
      } else {
        if (isSuggestion) {
          handleClosePopup();
          setTimeout(() => {
            navigate('/market/payment/', { state: { goods: getSnapshot(orderStore.goods), replace: true } });
          }, 300);
        } else {
          orderStore.setProps({
            goodsSid: 0,
            goods: {} as IGoodsModel,
          });
          handleClosePopup();
          setTimeout(() => {
            navigate(PATH_ROOT.market.payment, { replace: true });
          }, 300);
        }
      }
    };

    const handleAlertClose = () => {
      setIsInfoOpen(false);
      if (isSuccess) {
        if (isSuggestion) {
          handleClosePopup();
          setTimeout(() => {
            navigate('/market/payment/', { state: { goods: getSnapshot(orderStore.goods), replace: true } });
          }, 300);
        } else {
          orderStore.setProps({
            goodsSid: 0,
            goods: {} as IGoodsModel,
          });
          setTimeout(() => {
            navigate(PATH_ROOT.market.payment, { replace: true });
          }, 300);
        }
      }
    };

    return (
      <Stack>
        {!isInfoOpen && (
          <Slide direction="up" in={showToolbar} mountOnEnter unmountOnExit>
            <Paper
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: theme.zIndex.appBar,
                borderRadius: 4,
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
                  maxWidth: theme.breakpoints.values.md,
                  height: 308.6,
                  background: '#FFFFFF',
                  borderRadius: pxToRem(30),
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  justifyContent: 'center',
                }}
              >
              <Stack sx={{ direction: 'row', width: '100%' }}>
                <Box sx={{ alignSelf: 'flex-end', mt: pxToRem(20), cursor: 'pointer' }} onClick={() => {handleClosePopup()}}>
                  <CloseIcon />
                </Box>
                <Stack sx={{ mb: pxToRem(40) }}>
                  <Box sx={{ alignSelf: 'center' }}>
                    <IconMarketBell />
                  </Box>
                  <Typography variant='Kor_14_r' sx={{ my: pxToRem(20), textAlign: 'center', lineHeight: pxToRem(22) }}>
                    고객님의 누적 구매 예정 금액은 <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>{numberComma(goodsCheck.estimatedAccumPaymentAmt)}{currencyCd}</span> 입니다.<br/>
                    고객님은 {goodsCheck.goodsNm}을<br/>
                    <span style={{ fontWeight: 600 }}>{numberComma(goodsCheck.goodsAmt || 0)}{currencyCd}</span>에 구매하실 수 있습니다. (키트비 제외)
                  </Typography>
                  {
                    goodsCheck.goodsSid != null &&
                    <Button 
                      id={'btn-cart-package-buy-ok'}
                      sx={{ 
                        width: 335,
                        height: 50,
                        mb: pxToRem(20),
                        borderRadius: pxToRem(999),
                        color: '#FFFFFF',
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                          color: '#FFFFFF',
                          background: theme.palette.primary.main,
                        },
                        alignSelf: 'center',
                      }}
                      onClick={() => {setIsSuggestion(true); handleBuy(); }}
                    >
                      {goodsCheck.goodsNm} 구매하기
                    </Button>
                  }
                  <Typography 
                    id={`btn-cart-package-buy-cancel`}
                    sx={{ 
                      fontSize: pxToRem(12), 
                      lineHeight: pxToRem(22), 
                      color: '#5D6066', 
                      textDecorationLine: 'underline',  
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={handleClose}
                  >
                    { goodsCheck.estimatedAccumPaymentAmt >= 42000
                      ? '좀 더 생각해 볼게요'
                      : ( isFirst ? '다음에 구매할게요' : '그냥 구매할게요' )
                    }
                  </Typography>
                </Stack>
              </Stack>
            </Toolbar>
          </Paper>
        </Slide>
      )}

      <CAlert
        alertContent={alertMsg}
        alertCategory="info"
        isAlertOpen={isInfoOpen}
        handleAlertClose={() => {handleAlertClose()}}
      />
    </Stack>
  );
});

export default OrderPopup;