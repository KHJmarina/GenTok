import { Box, Stack, Checkbox, Typography, Divider, Dialog } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image/Image';
import CAlert from 'src/components/CAlert';
import CloseIcon from '@mui/icons-material/Close';
import { CartFooter } from 'src/screens/market/cart/CartFooter';
import { CallApiToStore, getImagePath } from 'src/utils/common';
import { ICartModel } from 'src/models/market-store/Cart';
import { numberComma } from 'src/utils/common';
import { pxToRem } from 'src/theme/typography';
import OrderPopup from '../../popup/OrderPopup';

/**
 * ## CartItem 설명
 *
 */

export const CartItem = observer( () => {

  const rootStore = useStores();
  const { loadingStore, marketStore, orderStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [checkCnt, setCheckCnt] = useState(0);
  const [allCheck, setAllCheck] = useState(false);
  const [goodsSid, setGoodsSid] = useState(0);
  const [call, setCall] = useState('');
  const [totalCnt, setTotalCnt] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const deleteGoods = () => {
    if(call === 'check' && allCheck) {  // 전체 삭제
      CallApiToStore(marketStore.cartStore.truncate(), 'api', loadingStore)
        .then(() => {})
        .catch((e) => {console.error(e);});
    } else {
      const cart = new Array<ICartModel>();

      if(call == 'individual') { // 개별 삭제
        const goods = marketStore.cartStore.list.find((item) => item.goodsSid === goodsSid);
        if(goods) {
          cart.push(goods);
        }

      } else {  // 선택 삭제
        marketStore.cartStore.list.map((goods, index) => {
          if(goods.checkYn) {
            cart.push(goods);
          }
        });
      }
      
      CallApiToStore(marketStore.cartStore.removeGoodsList(cart), 'api', loadingStore)
        .then(() => {
          const checkList = marketStore.cartStore.list.filter((item) => item.checkYn === true);
          setCheckCnt(checkList.length);
          setTotalCnt(marketStore.cartStore.list.length);
          if(checkList.length === marketStore.cartStore.list.length) {
            setAllCheck(true);         
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } 
  }

  const checkGoods = (goods: any, check: boolean, first: boolean) => {
    let cngGoodsAmt = marketStore.cartStore.payment.cngGoodsAmt;  // 체크 박스 선택 후 총 상품 금액
    let cngDscntAmt = marketStore.cartStore.payment.cngDscntAmt;  // 체크 박스 선택 후 할인금액

    if(check) {
      cngGoodsAmt = cngGoodsAmt + goods.price!;
      cngDscntAmt = cngDscntAmt + (goods.price! - goods.goodsAmt!);
    } else {
      cngGoodsAmt = cngGoodsAmt - goods.price!;
      cngDscntAmt = cngDscntAmt - (goods.price! - goods.goodsAmt!);
    }

    marketStore.cartStore.payment.setProps({
      cngGoodsAmt: cngGoodsAmt,
      cngDscntAmt: cngDscntAmt,
    });

    goods.setProps({ checkYn: check });
    const checkList = marketStore.cartStore.list.filter((goods) => goods.checkYn === false );
    setAllCheck(checkList.length > 0 ? false : true);
    setCheckCnt(marketStore.cartStore.list.length - checkList.length);

    if(!first && goods.goodsSid === marketStore.cartStore.recentGoodsSid) {
      marketStore.cartStore.updateRecentGoodsSid(0);
    }
  }
  
  const checkAll = (event: boolean, first: boolean) => {
    (marketStore.cartStore.list.map((goods, index) => {
      goods.setProps({checkYn: event});
    
      if(!first) {
        if(goods.goodsSid === marketStore.cartStore.recentGoodsSid) {
          marketStore.cartStore.updateRecentGoodsSid(0);
        }
      }
    }));
    setAllCheck(event);

    if(event) {
      setCheckCnt(marketStore.cartStore.list.length);
      marketStore.cartStore.payment.setProps({
        cngDscntAmt: marketStore.cartStore.payment.totDscntAmt,
        cngGoodsAmt: marketStore.cartStore.payment.totGoodsAmt,
      });
    } else {
      setCheckCnt(0); 
      marketStore.cartStore.payment.setProps({
        cngDscntAmt: 0,
        cngGoodsAmt: 0,
      });
    }
  }

  const clickSelectDelete = () => {
    if(checkCnt > 0) {
      setOpenAlert(true); 
      window.history.pushState(null,'',window.location.href);
      setCall('check');
    }
  }

  const handleClosePopup = () => {
    setOpenPopup(false);
    setIsFirst(false);
    navigate(-1);
    setOpenAlert(false); 
    setIsInfoOpen(false);
  };

  useEffect(() => {
    window.addEventListener('popstate', () => {
      setOpenAlert(false); 
      setOpenPopup(false);
      setIsFirst(false);
      setIsInfoOpen(false);
    })
    
    CallApiToStore(marketStore.cartStore.getCart({ page: 1, size: 100 }), 'api', loadingStore)
    .then(() => {
      setTotalCnt(marketStore.cartStore.pagination.totalElements);
      (marketStore.cartStore.list.map((goods, index) => {
        if(goods.goodsSid === marketStore.cartStore.recentGoodsSid) {
          if(marketStore.cartStore.list.length === 1) {
            checkAll(true, true);
          } else {
            checkGoods(goods, true, true);
          }
        } else {
          goods.setProps({checkYn: false});
        }
      }));
    })
    .catch((e) => {
      console.log(e);
    });
    
    marketStore.cartStore.payment.setProps({
      cngGoodsAmt: 0,
      cngDscntAmt: 0,
    });

    // 장바구니 진입 상품 추천
    CallApiToStore(orderStore.getCartEnter(), 'api', loadingStore)
      .then(() => {
        if (orderStore.cartEnter.goodsAlertYn) {
          setOpenPopup(true);
          window.history.pushState({isPopup : true},'',window.location.href);
        }
      })
      .catch((e) => {
        console.log(e);
      });

  }, [marketStore]);

  return (
    <Stack sx={{ zIndex: 0, m: `${pxToRem(9)} 0 0 0 !important` }}>
      <Stack
        direction={'row'}
        sx={{ m: pxToRem(20), mt: 0, alignItems: 'center' }}
        justifyContent="space-between"
      >
        <Box sx={{ display: 'flex' }} alignItems="center">
          <Checkbox
            icon={
              <Iconify
                icon={'material-symbols:check-circle-outline-rounded'}
                color={'#DFE0E2'}
              />
            }
            checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
            checked={allCheck}
            onClick={(e: any) => {
              if (e.nativeEvent.target.checked !== undefined) {
                checkAll(e.nativeEvent.target.checked, false);
              }
            }}
            disabled={marketStore.cartStore.list.length === 0 ? true : false || marketStore.cartStore.isPending}
            disableRipple
            sx={{ m: 0, p: 0, pr: pxToRem(8) }}
          />
          <Typography sx={{ lingHeight: pxToRem(24) }}> {marketStore.cartStore.list.length === 0  ? '전체선택' : `전체선택 (${checkCnt}/${totalCnt})`} </Typography>
        </Box>

        <Typography variant={'Kor_14_b'} sx={{ lingHeight: pxToRem(22), cursor:'pointer' }} onClick={() => { clickSelectDelete() }}> 선택삭제 </Typography>
      </Stack>

      <Stack sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
        { marketStore.cartStore.list.map((goods, index) => {
          return(
            <Stack key={index}>
              <Stack direction={'row'} sx={{ display: 'flex', p: pxToRem(20), borderBottom: marketStore.cartStore.list.length-1 != index ? '1px solid #EEEEEE' : null }}>
                <Box sx={{ width: pxToRem(20), height: pxToRem(20), mr: pxToRem(10) }}>
                  <Checkbox
                    icon={
                      <Iconify
                        icon={'material-symbols:check-circle-outline-rounded'}
                        color={'#DFE0E2'}
                      />
                    }
                    checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
                    sx={{ m: 0, p: 0 }}
                    checked={goods.checkYn}
                    onClick={() => { checkGoods(goods, !goods.checkYn, false) }}
                    disableRipple
                    disabled={marketStore.cartStore.isPending}
                  />
                </Box>

                <Box sx={{ display: 'flex', mr: pxToRem(28), cursor: 'pointer', }} onClick={() => {navigate(`/market/goods/${goods.goodsSid!}`, { replace: true })}}>
                  <Image
                    src={ getImagePath(goods?.img1Path!)}
                    sx={{ 
                      width: pxToRem(80), 
                      height: pxToRem(80), 
                      border: '1px solid #F5F5F5', 
                      borderRadius: pxToRem(10), 
                      flex: '0 0 auto', 
                      mr: pxToRem(11) 
                    }}
                    onError={(e: any) => {
                      e.target.src = '/assets/default-goods.svg';
                    }}
                  />

                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant={'Kor_18_b'}> {goods.goodsNm} </Typography><br />
                    <Typography variant={'Kor_14_r'} sx={{ mb: pxToRem(8) }}> {goods.goodsSummary} </Typography>
                    <Stack direction={'row'} spacing={0.5}>
                      { goods.dispDscntRate != null && goods.dispDscntRate > 0 && (
                        <Typography variant={'Eng_14_b'} sx={{ color: '#FF7F3F' }}>{goods.dispDscntRate}%</Typography>
                      )}
                      <Typography variant={'Kor_14_b'}> {numberComma(Number(goods.goodsAmt))}{goods.currencyCd?.value} </Typography>
                    </Stack>
                    { goods.goodsAmt != goods.price && goods.price && (
                      <Typography variant={'caption'} sx={{ color: '#C6C7CA', textDecoration: 'line-through', lineHeight: pxToRem(14.32) }}>
                        {numberComma(Number(goods.price))}{goods.currencyCd?.value}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box sx={{ marginLeft: 'auto', width: pxToRem(24), height: pxToRem(24) }}>
                  <CloseIcon onClick={() => 
                    { setOpenAlert(true); 
                    setGoodsSid(goods.goodsSid!); 
                    setCall('individual');
                    window.history.pushState(null,'',window.location.href);
                    }} style={{ cursor:'pointer' }} />
                </Box>
              </Stack>
            </Stack>
          );
        })}

        <Divider sx={{ borderColor: '#FAFAFA', borderWidth: pxToRem(4), mb: pxToRem(28) }} />

        <Stack sx={{ mx: pxToRem(20), mb: pxToRem(50) }}>
          <Box sx={{ display: 'flex', my: pxToRem(8) }} justifyContent="space-between">
            <Typography variant={'Kor_16_r'}>총 상품금액</Typography>
            <Typography variant={'subtitle1'}>
              {numberComma(Number(marketStore.cartStore.payment.cngGoodsAmt))} 
              <Typography variant={'Kor_14_r'}> {marketStore.cartStore.payment.currencyCd?.value} </Typography>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', my: pxToRem(8) }} justifyContent="space-between">
            <Typography variant={'Kor_16_r'}>상품할인금액</Typography>
            <Box sx={{ display: 'flex' }}>
              <Typography variant={'subtitle1'}>
                {marketStore.cartStore.payment.cngDscntAmt != 0 && ('-')}
                {numberComma(Number(marketStore.cartStore.payment.cngDscntAmt))}
                <Typography variant={'Kor_14_r'}> {marketStore.cartStore.payment.currencyCd?.value} </Typography>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(14), mt: pxToRem(16), borderTop: `1px solid ${theme.palette.divider}`, }} justifyContent="space-between">
            <Typography variant={'Kor_16_b'} sx={{ mt: pxToRem(16) }}>결제예정금액</Typography>
            <Typography variant={'Eng_22_b'} sx={{ color: '#FF6F00', mt: pxToRem(16) }}>
              {numberComma(Number(marketStore.cartStore.payment.cngGoodsAmt - marketStore.cartStore.payment.cngDscntAmt))}
              <Typography variant={'Kor_14_r'}> {marketStore.cartStore.payment.currencyCd?.value} </Typography>
            </Typography>
          </Box>
          <Typography variant={'Kor_12_r'} sx={{ color: '#C6C7CA', textAlign: 'right' }}>
            쿠폰/포인트는 결제하기에서 사용 가능합니다
          </Typography>
        </Stack>
      </Stack> 
      <CartFooter
        isFirst={isFirst}
        totGoodsLen={checkCnt}
        totPaymentAmt={marketStore.cartStore.payment.cngGoodsAmt - marketStore.cartStore.payment.cngDscntAmt}
        currencyCd={marketStore.cartStore.payment.currencyCd?.value}
      />

      <CAlert
        id1={`btn-cart-main-dialog-delete-no`}
        id2={`btn-cart-main-dialog-delete-yes`}
        isAlertOpen={openAlert}
        hasCancelButton={true}
        alertCategory={'question'}
        handleAlertClose={() => {
          setOpenAlert(false);
          navigate(-1);
        }}
        handleAlertCancel={() => {setOpenAlert(false); navigate(-1);}}
        callBack={deleteGoods}
        alertTitle={'정말 삭제하시겠습니까?'}
      />

      <Dialog
        open={openPopup}
      >
        <OrderPopup 
          handleClosePopup={handleClosePopup}
          isFirst={isFirst}
          goodsCheck={orderStore.cartEnter}
          currencyCd={marketStore.cartStore.payment.currencyCd?.value}
          isInfoOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
        />
      </Dialog>
    </Stack>
  );
});

export default CartItem;
