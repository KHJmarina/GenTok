import { Box, Button, Drawer, IconButton, Paper, Slide, Toolbar, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import CAlert from 'src/components/CAlert';
import { useStores } from 'src/models';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { pxToRem } from 'src/theme/typography';
// import share from 'src/utils/share';
import { ReactComponent as IconHartOn } from '../assets/icons/ico-heart-on.svg';
import { ReactComponent as IconHart } from '../assets/icons/ico-heart.svg';
import { ReactComponent as IconShare } from '../assets/icons/ico-share.svg';
import { FooterBuy } from './FooterBuy';
import { useNavigate } from 'react-router';
import CShareAlert from 'src/components/CShareAlert';

export interface IFooterProps {
  goods?: IGoodsModel;
  show?: boolean;
}

export const Footer = observer(({ goods, show = false }: IFooterProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { marketStore } = useStores();
  // console.log(JSON.stringify(goods, null, 2))
  const [showToolbar, setShowToolbar] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const { isAuthenticated } = useAuthContext();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertCancelable, setAlertCancelable] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handlePurchase = useCallback(() => {
    if (isAuthenticated) {
      setOpenForm(true);
    } else {
      setAlertTitle('로그인 후 이용 가능합니다.');
      setAlertMessage('로그인 페이지로 이동하시겠습니까?');
      setAlertCancelable(true);
      setAlertOpen(true);
    }
  }, [isAuthenticated]);

  const toggleEmotion = useCallback(() => {
    if (isAuthenticated) {
      if (goods) {
        if (goods.myEmotionCd) {
          marketStore.goodsStore.removeEmotion(goods.goodsSid!);
        } else {
          marketStore.goodsStore.addEmotion(goods.goodsSid!, 400101);
        }
      }
    } else {
      setAlertTitle('로그인 후 이용 가능합니다.');
      setAlertMessage('로그인 페이지로 이동하시겠습니까?');
      setAlertCancelable(true);
      setAlertOpen(true);
    }
  }, [goods, marketStore?.goodsStore, isAuthenticated]);

  const [openShare, setOpenShare] = useState(false);
  const handleShare = async () => {
    setOpenShare(true);
  };

  useEffect(() => {
    setShowToolbar(show);
  }, [show]);

  const shadows = useMemo(
    () =>
      theme.shadows[24].replace(/0px (\d+)px/g, (match, p1) => {
        const value = Number(p1);
        return `0px ${value * -1}px`;
      }),
    [theme],
  );

  return (
    <>
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
              p: pxToRem(33),
              pt: pxToRem(18),
              pb: pxToRem(18),
              width: '100%',
              maxWidth: theme.breakpoints.values.md,
              height: 60,
              background: theme.palette.primary.main,
              borderRadius: 4,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              // boxShadow: theme.shadows[24],
              boxShadow: shadows,
            }}
            // disableGutters
          >
            <Box
              sx={{
                display: 'flex',
                height: '44px',
                width: '110px',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <IconButton onClick={toggleEmotion} disableRipple sx={{ p: 0 }}>
                {goods?.myEmotionCd?.code === 400101 ? (
                  <IconHartOn stroke="#ffffff" fill="#ffffff" width={24} height={24} />
                ) : (
                  <IconHart fill="#ffffff" width={24} height={24} />
                )}
              </IconButton>
              <IconButton onClick={handleShare} disableRipple sx={{ p: 0 }}>
                <IconShare stroke="#ffffff" width={24} height={24} />
              </IconButton>
              <Box sx={{ pl: 2, borderRight: '1px solid #ffffff', height: '30px' }}></Box>
            </Box>

            <Button
              disableRipple
              sx={{
                flex: 1,
                color: '#ffffff',
                fontWeight: 600,
                fontSize: pxToRem(18),
                lineHeight: pxToRem(26),
                letterSpacing: '-2%',
                '&:disabled': {
                  color: '#ffffff',
                  // opacity: 0.5,
                  background: 'transparent',
                },
              }}
              disabled={goods?.saleStateCd?.code !== 200102 || !!goods?.purchaseYn}
              onClick={handlePurchase}
            >
              {
                goods?.purchaseYn
                  ? '구매한 상품입니다'
                  : goods?.saleStateCd?.code === 200102
                  ? '구매하기'
                  : '구매불가'
                // : goods?.saleStateCd?.value + ' 상품입니다.'
              }
            </Button>
          </Toolbar>
        </Paper>
      </Slide>

      {/* 주문하기 창 */}
      <Drawer
        open={openForm}
        onClose={() => {
          setOpenForm(false);
        }}
        PaperProps={{
          sx: {
            pb: 3,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '100%',
            maxWidth: theme.breakpoints.values.md,
            borderRadius: 3,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
        anchor={'bottom'}
      >
        <FooterBuy goods={goods} onClose={(isAddCart) => setOpenForm(false)} />
      </Drawer>

      <CAlert
        isAlertOpen={alertOpen}
        alertCategory={'f2d'}
        alertTitle={alertTitle}
        alertContent={alertMessage}
        hasCancelButton={alertCancelable}
        handleAlertClose={() => {
          setAlertOpen(false);
        }}
        callBack={() => {
          // 구매하기에서 로그인 안되어 있으면 콜백에서 로그인 페이지로 이동한다.
          // 의미상으로는 구매하기인 경우를 특정할 수 있는 값을 사용해야 한다.
          // 여기서는 구매하기, 좋아요와 클립보드 복사를 구분할 때 취소 버튼 여부로 구분하였다.
          alertCancelable && navigate('/login');
        }}
      ></CAlert>
      {openShare && (
        <CShareAlert
          isAlertOpen={true}
          alertTitle={'친구에게 공유하기'}
          handleAlertClose={() => {
            setOpenShare(false);
          }}
          shareData={{
            title: goods?.goodsNm,
            desc: goods?.goodsSummary,
            path: 'market',
            type: '상품',
            Sid: goods?.goodsSid,
            img:
              process.env.REACT_APP_IMAGE_STORAGE &&
              process.env.REACT_APP_IMAGE_STORAGE + goods?.img1Path,
            url:
              process.env.NODE_ENV === 'production'
                ? window.location.href
                : `https://gentok.net/market/goods/${goods?.goodsSid}`,
          }}
        />
      )}
    </>
  );
});
