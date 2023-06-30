import { Button, Drawer, Stack, Typography, useTheme, Dialog, Box } from '@mui/material';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CHeader } from 'src/components/CHeader';
import CAlert from 'src/components/CAlert';
import { HEADER } from 'src/config-global';
import { IAddress } from 'src/models/address/Address';
import { ICartModel } from 'src/models/market-store/Cart';
import { IOrderItem } from 'src/models/order-item/OrderItem';
import { useStores } from 'src/models/root-store/root-store-context';
import { PATH_ROOT } from 'src/routes/paths';
import { CallApiToStore, detectMobileDevice, sendReactNativeMessage } from 'src/utils/common';
import { AddressItem } from './payment-items/AddressItem';
import { AgreeItem } from './payment-items/AgreeItem';
import { AmtInfoItem } from './payment-items/AmtInfoItem';
import { DiscountItem } from './payment-items/DiscountItem';
import { GoodsItem } from './payment-items/GoodsItem';
import { MethodItem } from './payment-items/MethodItem';
import { PaymentFooter } from './PaymentFooter';
import { IMyCoupon } from 'src/models/mypage/Mypage';
import PaymentAlert from './payment-items/PaymentAlert';
import { isObject } from 'lodash';
import { pxToRem } from 'src/theme/typography';
import { IGoodsModel } from 'src/models/market-store/Goods';

/**
 * ## MarketPayment 설명
 *
 */

export const MarketPayment = observer(() => {
  const rootStore = useStores();
  const { loadingStore, marketStore, orderStore, addressStore, responseStore, mypageStore, termsStore, pointStore, userStore } =
    rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { REACT_APP_API_URL } = process.env;

  const [openNoti, setOpenNoti] = useState(false);         // 유효성 검사 알림
  const [notiMessage, setNotiMessage] = useState('');      // 유효성 검사 알림 메시지
  const [openError, setOpenError] = useState(false);       // api 호출 후 에러 알림
  const [errorMsg, setErrorMsg] = useState('');            // api 호출 후 에러 메시지
  const [openAlert, setOpenAlert] = useState(false);       // 결제 화면 이동 알림
  const [openCoupon, setOpenCoupon] = useState(false);     // 쿠폰 선택 화면
  const [from, setFrom] = useState('');
  const [termssCheck, setTermssCheck] = useState<any>([]);
  const [usePoint, setUsePoint] = useState(0);
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const { state } = useLocation();
  const getAmtInfo = useCallback( // 구매 상품 + 금액 조회
    async (goodsList: ICartModel[], couponList?: IMyCoupon[]) => {
      if (!couponList && orderStore.orderItem.cpnList.length != 0) {
        couponList = [...orderStore.orderItem.cpnList] as IMyCoupon[];
      }

      CallApiToStore(
        orderStore.getAmtInfo(orderStore.goodsCheck.kitIncludeYn, goodsList, (!couponList || couponList.length === 0) ? [] : couponList),
        'api',
        loadingStore,
      )
        .then(() => {
          if (responseStore.responseInfo.resultCode === 'S') {
            if(!isDone) {
              getCoupons(goodsList);
            }
          } else {
            if (responseStore.responseInfo) {
              setFrom('getAmtInfo');
              setErrorMsg(responseStore.responseInfo.errorMessage || '');
              setOpenError(true);
              window.history.pushState(null,'',window.location.href);
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }, [loadingStore, orderStore, responseStore.responseInfo],
  );

  const getCoupons = useCallback(async (goodsList: ICartModel[]) => { // 쿠폰 조회
    CallApiToStore(mypageStore.getCouponsByGoods(), 'api', loadingStore)
      .then(() => {
        let availCnt = 0;

        // 쿠폰 사용 가능 여부 판단
        mypageStore.myCouponsByGoods.map((cpns, index) => {
          if (cpns.isGoodsCpn) {
            goodsList.map((goods) => {
              if (goods.goodsSid === cpns.goodsId) {
                cpns.setProps(
                  {useYn: true}
                );

                cpns.cpnList.map((cpn, cpnIndex) => {
                  if (goods.goodsAmt != null && cpn.minGoodsAmt != null && (goods.goodsAmt > cpn.minGoodsAmt)) {
                    cpn.setProps(
                      {useYn: true}
                    );
                    availCnt = availCnt + 1;
                  }
                });
              }
            });
          } else {
            cpns.cpnList.map((cpn, cpnIndex) => {
              if (orderStore.amtInfo.payment.totPaymentAmt > (cpn.minGoodsAmt || 0)) {
                cpn.setProps(
                  {useYn: true}
                );
              }
              availCnt = availCnt + 1;
            });
          }
        });

        mypageStore.setMyAvailCnt(availCnt);
        setIsDone(true);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [loadingStore, marketStore.cartStore.list, mypageStore, state?.goods]);

  const getsByLoc = async () => { // 약관 조회
    CallApiToStore(termsStore.getsByLoc(820004), 'api', loadingStore)
      .then(() => {
        const temp: any = [];
        let termsList: any = [];
        if (orderStore.orderItem.termsAgreementList.length != 0) {
          termsList = orderStore.orderItem.termsAgreementList;
        } else {
          termsList = termsStore.termss;
        };

        termsList.map((t: any) => {
          let obj = Object.create({}, {
            termsSid: { value: t.termsSid },
            // agrmntYn: {value: t.agrmntYn}
            agrmntYn: { value: true }
          });
          temp.push(obj);
        });
        orderStore.orderItem.setProps({ termsAgreementList: temp });
        setTermssCheck(temp);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getPoint = () => {  // 포인트 조회
    CallApiToStore(pointStore.getPoint(), 'api', loadingStore)
      .then(() => {
        if (orderStore.orderItem.pointAmt > 0) {
          setUsePoint(orderStore.orderItem.pointAmt);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    let goodsList = new Array<ICartModel>();
    if (state?.goods) {
      goodsList.push(state?.goods);
    } else {
      if (orderStore.goods.goodsSid != 0) {
        goodsList.push(orderStore.goods);
      } else {
        goodsList = marketStore.cartStore.list.filter((item) => item.checkYn === true);
        if (!goodsList) {
          orderStore.setProps({
            orderItem: {} as IOrderItem,
          });
        };
      }
    }
    getAmtInfo(goodsList);
    getsByLoc();
    getPoint();
  }, [getAmtInfo, getCoupons, marketStore.cartStore.list, state?.goods, termsStore]);

  const onSubmit = useCallback(() => {
    const orderItem = orderStore.orderItem;
    const termsList = orderStore.orderItem.termsAgreementList;

    if (orderItem.goodsList.length === 0) {
      setNotiMessage('구매할 상품이 없습니다');
      setOpenNoti(true);
    } else if (orderStore.amtInfo.dlivryYn && !orderItem.addr && !addressStore.tempAddr.totAddr) {
      setNotiMessage('배송지를 선택해주세요');
      setOpenNoti(true);
      // } else if (orderStore.amtInfo.dlivryYn && !orderItem.dlivryReqCd) {
      //   setNotiMessage('배송 시 요청사항을 선택해주세요');
      //   setOpenNoti(true);
    } else if (orderStore.amtInfo.dlivryYn && orderItem.dlivryReqCd === 13 && !orderItem.dlivryReqMemo) {
      setNotiMessage('배송 요청사항을 입력해주세요');
      setOpenNoti(true);
      // } else if ( termsList.length > 0 && termsList.filter((t: any) => t.agrmntYn === true).length < termsList.length) {
      //   setNotiMessage('결제 진행을 위해 [결제 진행 필수 동의]에\n체크해주세요');
      //   setOpenNoti(true);
    } else {
      // setOpenAlert(true);
      checkBuy();
    }
  }, [addressStore, orderStore]);

  const checkBuy = async () => {
    if (addressStore.tempAddr.totAddr) {
      orderStore.orderItem.setProps({
        rcipntNm: addressStore.tempAddr.rcipntNm,
        phoneNo: addressStore.tempAddr.phonePrefix + '-' + addressStore.tempAddr.phoneNo,
        zoneCd: addressStore.tempAddr.zone,
        addr: addressStore.tempAddr.totAddr,
      });
    }

    const goodsArr = new Array();
    orderStore.amtInfo.goodsList.map((goods) => {
      let goodsObj = { goodsSid: goods.goodsSid };
      goodsArr.push(goodsObj);
    });

    const cpnArr = new Array();
    orderStore.orderItem.cpnList.map((coupon) => {
      let cpnObj = { cpnId: coupon.cpnId };
      cpnArr.push(cpnObj);
    });

    orderStore.orderItem.setProps({
      goodsList: goodsArr,
      goodsAmt: orderStore.amtInfo.payment.totGoodsAmt,
      dscntAmt: orderStore.amtInfo.payment.totCpnDscntAmt,
      paymentAmt: orderStore.amtInfo.payment.totPaymentAmt - orderStore.orderItem.pointAmt,
      cpnList: cpnArr,
    });

    CallApiToStore(orderStore.setOrder(orderStore.orderItem), 'api', loadingStore)
      .then(() => {
        if (responseStore.responseInfo.resultCode === 'S') {
          // navigate(PATH_ROOT.market.order.result);
          setOpenAlert(true);
          window.history.pushState(null,'',window.location.href);

        } else {

          // 주문 실패
          if (responseStore.responseInfo) {
            setFrom('setOrder');
            setErrorMsg(responseStore.responseInfo.errorMessage || '');
            setOpenError(true);
            window.history.pushState(null,'',window.location.href);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openPayment = () => {
    // if app
    if (userStore.os) {
      sendReactNativeMessage({
        type: 'payment',
        payload: {
          url: `${REACT_APP_API_URL}/common/v1/order/${orderStore.orderResult.orderNo}/pay/mobile`,
        },
      });

    } else {
      if (detectMobileDevice(navigator.userAgent)) {
        // @ts-ignore
        window.payWin = window.open(`${REACT_APP_API_URL}/common/v1/order/${orderStore.orderResult.orderNo}/pay/mobile`, 'payment', 'width=400,height=500');

      } else {
        // @ts-ignore
        window.payWin = window.open(`${REACT_APP_API_URL}/common/v1/order/${orderStore.orderResult.orderNo}/pay`, 'payment', 'width=820,height=600');
      }

      // 사용자가 window.payWin 브라우저 닫기 버튼을 클릭 해 닫은 경우 결제 진행중 팝업창 닫기
      const interval = setInterval(() => {
        // @ts-ignore
        if (window.payWin && window.payWin.closed) {
          setIsPaymentInProgress(false);
          clearInterval(interval);
        }
      }, 1000);
    }

  }

  const handleViewResult = () => {
    // 결제 완료 후 장바구니 API 호출
    marketStore?.cartStore.getCart({ page: 1, size: 100 });
    
    orderStore.setProps({ // 결제 성공 시 goodsSid, goods, orderItem 초기화
      goodsSid: 0,
      goods: {} as IGoodsModel,
      orderItem: {} as IOrderItem,
    });
    navigate(PATH_ROOT.market.order.result);
  }

  // TODO 결제 결과 리스너
  const listener = async (event: any) => {
    let data: any;
    try {
      if (isObject(event.data)) return;
      if (!isObject(event.data)) {
        data = JSON.parse(event.data);
        setIsPaymentInProgress(false);
      }
    } catch (e) {
    }
    if (data.type === 'webpackWarnings') return;

    /**
     * from app
     */
    if (data.type === 'paymentSuccess') {
      // console.log('결제 성공', data.payload);
      const result = data.payload.result;
      if (result.resultCode === 'S') {
        if (result.data) {
          handleViewResult();
        } else {
          setErrorMsg('오류가 발생했습니다.');
          setOpenError(true);
          window.history.pushState(null,'',window.location.href);
        }
      } else if (data.resultCode === 'F') {
        // 결제 실패
        setErrorMsg(result.errorMessage);
        setOpenError(true);
        window.history.pushState(null,'',window.location.href);
      } else {
        setErrorMsg('오류가 발생했습니다.');
        setOpenError(true);
        window.history.pushState(null,'',window.location.href);
      }
    } else if (data.type === 'paymentFailed') {
      setErrorMsg(data.payload.result.errorMessage);
      setOpenError(true);
      window.history.pushState(null,'',window.location.href);
    }

    /**
     * from Web
     */
    if (data.resultCode === 'S' && data.data) {
      handleViewResult();
    } else if (data.resultCode === 'F') {
      // 결제 실패
      setErrorMsg(data.errorMessage);
      setOpenError(true);
      window.history.pushState(null,'',window.location.href);
    } else {

      // TODO 그외 처리

    }
  };

  const closePayWin = () => {
    // @ts-ignore
    if (window.payWin) {
      // @ts-ignore
      window.payWin.close();
    }
  }

  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", closePayWin);
      document.addEventListener("beforeunload", closePayWin);
    })();

    return () => {
      closePayWin();
      window.removeEventListener("beforeunload", closePayWin);
      document.removeEventListener("beforeunload", closePayWin);
    };
  }, []);


  useEffect(() => {
    try {
      document.addEventListener('message', listener);
      window.addEventListener('message', listener);
    } catch (e) { }

    return () => {
      try {
        document.removeEventListener('message', listener);
        window.removeEventListener('message', listener);
      } catch (e) { }
    };
  }, []);
  
  useEffect(() => {
    window.addEventListener('popstate', () => {
      setOpenAlert(false); 
      setOpenError(false);
    })
  });


  // const paymentAlertButtonSet = () => {
  //   return (
  //     <>
  //       <Button variant='outlined' size='large' onClick={() => { setOpenAlert(false) }}
  //         sx={{
  //           mr: 1.5, borderRadius: 5, minWidth: '40%', border: `1px solid ${theme.palette.primary.dark}`, color: theme.palette.primary.dark,
  //           '&:hover': { background: 'none', border: '1px solid #FF5D0C', color: '#FF5D0C' }
  //         }}>취소</Button>
  //       <Button variant='contained' size='large' onClick={() => { setOpenAlert(false); checkBuy(); }}
  //         sx={{ color: '#fff', borderRadius: 5, minWidth: '40%', '&:hover': { background: '#FF5D0C !important' } }}>확인</Button>
  //     </>
  //   )
  // }

  const paymentAlertButtonSet = () => {
    return (
      <>
        <Button variant='outlined' size='large'
          sx={{
            mr: 1.5, borderRadius: 5, minWidth: '40%', border: `1px solid ${theme.palette.primary.dark}`, color: theme.palette.primary.dark,
            '&:hover': { background: 'none', border: '1px solid #FF5D0C', color: '#FF5D0C' }
          }}
          onClick={() => {
            // TODO 주문삭제 api call
            setOpenAlert(false);
            navigate(-1);
          }}
        >취소</Button>
        <Button variant='contained' size='large' onClick={() => { setOpenAlert(false); navigate(-1); openPayment(); setIsPaymentInProgress(true); }}
          sx={{ color: '#fff', borderRadius: 5, minWidth: '40%', '&:hover': { background: '#FF5D0C !important' } }}>확인</Button>
      </>
    )
  }

  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: () => {
      navigate(-1);
      orderStore.setProps({
        goodsSid: 0,
        goods: {} as IGoodsModel,
        orderItem: {} as IOrderItem,
      });
      addressStore.setProps({
        tempAddr: {} as IAddress,
      });
    },
  };

  return (
    <>
      <Dialog
        open={isPaymentInProgress}
        PaperProps={{
          sx: {
            px: '80px !important',
            py: '50px !important',
            borderRadius: '25px !important',
            '@media (max-width: 600px)': {
              p: 5,
              borderRadius: '25px !important',
            },
          },
        }}
        sx={{
          margin: '0 !important',
          zIndex: theme.zIndex.modal,
          padding: 0,
        }}
      >
        <Box
          component="img"
          src={'/logo/Gentok-Logo.svg'}
          sx={{ mb: pxToRem(30) }}
        />
        <Typography variant='body1' sx={{ textAlign: 'center' }}>
          현재 결제가 진행중이에요.
        </Typography>
      </Dialog>

      <Stack
        spacing={2}
        sx={{
          flex: 1,
          pb: `${HEADER.H_MOBILE * 1.5}px`,
          overflowY: 'auto',
          scrollMarginTop: '100px',
        }}
      >
        <CHeader
          title="결제하기"
          {...options}
        />
        {isDone && 
          <Stack sx={{ m: '0 !important' }}>
            <Stack>
              <Drawer
                open={openNoti}
                onClose={() => {
                  setOpenNoti(false);
                }}
                PaperProps={{
                  sx: {
                    borderRadius: 1.25,
                    color: '#F93D40',
                    border: '1px solid #F93D40',
                    textAlign: 'center',
                    mx: 'auto',
                    mb: 2,
                    p: 2,
                    maxWidth: theme.breakpoints.values.md,
                  },
                }}
                anchor={'bottom'}
              >
                <Typography sx={{ fontSize: theme.typography.pxToRem(16), fontWeight: 600 }}>
                  {notiMessage}
                </Typography>
              </Drawer>

              {orderStore.amtInfo.dlivryYn && <AddressItem />}
              {/* <BuyerItem /> */}
              <GoodsItem />
              <DiscountItem
                goods={state?.goods}
                usePoint={usePoint}
                setUsePoint={setUsePoint}
                setNotiMessage={setNotiMessage}
                setOpenNoti={setOpenNoti}
                openCoupon={openCoupon}
                setOpenCoupon={setOpenCoupon}
              />
              <MethodItem />
              <AmtInfoItem
                usePoint={usePoint}
              />
              <AgreeItem
                termssCheck={termssCheck}
                setTermssCheck={setTermssCheck}
              />
              {!openCoupon && (
                <PaymentFooter
                  onSubmit={onSubmit}
                  totPaymentAmt={orderStore.amtInfo.payment.totPaymentAmt - usePoint}
                />
              )}
            </Stack>

            {openAlert &&
              <PaymentAlert
                isAlertOpen={openAlert}
                alertContent={'확인 버튼을 누르면 결제화면으로 이동합니다.'}
                alertCategory={'question'}
                buttonSet={paymentAlertButtonSet()}
                handleAlertClose={() => { setOpenAlert(false); navigate(-1); }}
                alertTitle={' '}
              />
            }
          </Stack>
        }
      </Stack>

      <CAlert
        alertContent={errorMsg}
        alertCategory="info"
        isAlertOpen={openError}
        handleAlertClose={() => {
          setOpenError(false);
          navigate(-1);
          orderStore.orderItem.goodsList.length === 0 && from === 'getAmtInfo' && navigate(-1);
        }}
      />
    </>
  );
});

export default MarketPayment;
