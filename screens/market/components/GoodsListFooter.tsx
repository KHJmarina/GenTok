import { Box, Button, Paper, Slide, Toolbar, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from 'src/auth/useAuthContext';
import CAlert from 'src/components/CAlert';
import { useStores } from 'src/models';
import { pxToRem } from 'src/theme/typography';

export interface IGoodsListFooterProps {}

export const GoodsListFooter = observer(({}: IGoodsListFooterProps) => {
  const {
    marketStore: { goodsStore, cartStore },
  } = useStores();
  const theme = useTheme();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthContext();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertCancelable, setAlertCancelable] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertCallbackUrl, setAlertCallbackUrl] = useState('');

  const handleClickCart = async () => {
    if (!isAuthenticated) {
      setAlertTitle('로그인 후 이용 가능합니다.');
      setAlertMessage('로그인 페이지로 이동하시겠습니까?');
      setAlertCancelable(true);
      setAlertCallbackUrl('/login');
      setAlertOpen(true);
      return;
    }
    const goodsSidList = goodsStore.goodsListCanAddToCart.map(
      (goods) => goods.goodsSid,
    ) as Array<number>;
    if (goodsSidList.length > 0) {
      await cartStore.addGoodsList(goodsSidList);
      cartStore.getCart();
      setAlertTitle('장바구니에 담았습니다.');
      setAlertMessage(`선택한 상품 중 ${goodsStore.goodsListCanAddToCart.length}개를 장바구니에 담았습니다.
      장바구니로 이동하시겠습니까?`);
      setAlertCancelable(true);
      setAlertCallbackUrl('/cart');
      setAlertOpen(true);
    } else {
      setAlertTitle('장바구니에 담을 상품이 없습니다.');
      setAlertMessage(
        `선택한 상품 ${goodsStore.selectedGoods.length}개 중 장바구니에 담을 수 있는 상품이 없습니다.`,
      );
      setAlertCancelable(false);
      setAlertCallbackUrl('');
      setAlertOpen(true);
    }
  };
  return (
    <>
      <Slide direction="up" in={goodsStore.isShowFooter} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar + 1,
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
              p: pxToRem(33),
              pt: pxToRem(18),
              pb: pxToRem(18),
              width: '100%',
              maxWidth: theme.breakpoints.values.md,
              height: 70,
              background: theme.palette.primary.main,
              borderRadius: 4,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              // boxShadow: theme.shadows[24],
              boxShadow: theme.shadows[24].replace(/0px (\d+)px/g, (match, p1) => {
                const value = Number(p1);
                return `0px ${value * -1}px`;
              }),
              display: 'flex',
              justifyContent: 'stretch',
            }}
          >
            <Box sx={{ width: '135px' }}>
              <Typography variant="Kor_18_b" color="#ffffff">
                {goodsStore.selectedGoods.length}개 선택
              </Typography>
            </Box>
            <Button
              disableRipple
              sx={{
                flex: 1,
                color: '#202123',
                backgroundColor: '#ffffff',
                fontWeight: 600,
                fontSize: pxToRem(18),
                lineHeight: pxToRem(26),
                letterSpacing: '-1%',
                ':hover': {
                  color: '#ffffff',
                },
              }}
              onClick={handleClickCart}
            >
              장바구니 담기
            </Button>
          </Toolbar>
        </Paper>
      </Slide>

      <CAlert
        isAlertOpen={alertOpen}
        alertCategory={'f2d'}
        alertTitle={alertTitle}
        alertContent={alertMessage}
        hasCancelButton={alertCancelable}
        handleAlertClose={() => {
          goodsStore.unSelectAllGoods();
          setAlertOpen(false);
        }}
        callBack={() => {
          goodsStore.unSelectAllGoods();
          alertCallbackUrl && navigate(alertCallbackUrl);
        }}
      ></CAlert>
    </>
  );
});
