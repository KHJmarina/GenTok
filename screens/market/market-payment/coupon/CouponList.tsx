import { observer } from 'mobx-react-lite';
import { Box, useTheme, Typography, Stack, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models';
import { pxToRem } from 'src/theme/typography';
import CHeader from 'src/components/CHeader';
import { CouponFooter } from "./CouponFooter";
import { IMyCouponByGoods, ICpn } from 'src/models/mypage/Mypage';
import { toJS } from 'mobx';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { numberComma, CallApiToStore } from 'src/utils/common';
import moment from 'moment';
import { HEADER } from 'src/config-global';
import { ICartModel } from 'src/models/market-store/Cart';
import { ReactComponent as IcoCoupon } from 'src/assets/icons/ico-coupon.svg';
import { IMyCoupon } from 'src/models/mypage/Mypage';
import CAlert from 'src/components/CAlert';
import Iconify from 'src/components/iconify';

/**
 * ## CouponList 설명
 *
 */

type Props = {
  handleClose: any,
  goods: any,
  currencyCd: any,
};

type CouponType = {
  cpnId: number,
}

export const CouponList = observer(({ handleClose, goods, currencyCd }: Props) => {
  const theme = useTheme();
  const rootStore = useStores();
  const { loadingStore, mypageStore, orderStore, marketStore, responseStore } = rootStore;
  const [goodsCpnList, setGoodsCpnList] = useState<IMyCouponByGoods[]>([]);
  const [cartCpnList, setCartCpnList] = useState<IMyCouponByGoods[]>([]);
  const [useCpnList, setUseCpnList] = useState<CouponType[]>(orderStore.orderItem.cpnList);
  const [goodsList, setGoodsList] = useState<ICartModel[]>([]);
  const [openError, setOpenError] = useState(false);       // api 호출 후 에러 알림
  const [errorMsg, setErrorMsg] = useState('');            // api 호출 후 에러 메시지
  const [cartChk, setCartChk] = useState(false);

  const options: any = {
    showMainIcon: 'none',
    showXIcon: true,
    handleX: () => {
      handleClose();
    },
  };

  useEffect(() => {
    // 장바구니 상품 리스트
    let tempCart = new Array<ICartModel>();
    if (orderStore.goods.goodsSid != 0) {
      tempCart.push(orderStore.goods);
    } else {
      tempCart = marketStore.cartStore.list.filter((item) => item.checkYn === true);
    }
    setGoodsList(tempCart);
    
    // 상품 쿠폰 (사용 가능 쿠폰만)
    const goodsCpnTemp = mypageStore.myCouponsByGoods.filter((coupon) => coupon.isGoodsCpn === true && coupon.useYn === true);
    setGoodsCpnList([...goodsCpnTemp]);

    // 장바구니 쿠폰
    const cartCpnTemp = mypageStore.myCouponsByGoods.filter((coupon) => coupon.isGoodsCpn === false);
    setCartCpnList(cartCpnTemp);

    let isCartChk = true;
    cartCpnTemp.map((cpns, index) => {
      cpns.cpnList.map((cpn, cpnIndex) => {
        useCpnList.map((useCpn, useCpnIndex) => {
          if (cpn.cpnId === useCpn.cpnId) {
            isCartChk = false;
          }
        });
      })
    });
    setCartChk(isCartChk);
  },[]);

  const notApplyCartCpn = (event: boolean) => {
    let tempArr = [...useCpnList];
    
    cartCpnList.map((cpns, index) => {
      cpns.cpnList.map((cartCpn, cartCpnIndex) => {
        if (cartCpn) {
          tempArr.forEach((tempCpn, index)=> {
            if (tempCpn.cpnId === cartCpn.cpnId) {
              tempArr.splice(index, 1);
            }
          });
        }
      });
    });
    setUseCpnList([...tempArr]);
    setCartChk(event);
  };

  const applyCoupon = () => {
    const tempCpnList = [] as IMyCoupon[];

    useCpnList.map((coupon, index) => {
      let obj = Object.create({}, {
        cpnId: {value: coupon.cpnId},
      });
      tempCpnList.push(obj);
    });

    CallApiToStore(
      orderStore.getAmtInfo(orderStore.goodsCheck.kitIncludeYn, goodsList, tempCpnList),
      'api',
      loadingStore
    )
    .then(() => {
      if (responseStore.responseInfo.resultCode === 'S') {
        handleClose();
        
        const cpnList = mypageStore.myCouponsByGoods;
        cpnList.map((cpns, index) => {
          cpns?.cpnList.map((cpn, cpnIndex) =>{
            useCpnList.map((useCpn, useCpnIndex) => {
              if (cpn.cpnId === useCpn.cpnId) {
                cpn.setProps({ selectYn: true });
              }
            });
          });
        });

        orderStore.orderItem.setProps({
          cpnList: useCpnList,
        });
      } else {
        if (responseStore.responseInfo) {
          setErrorMsg(responseStore.responseInfo.errorMessage || '');
          setOpenError(true);
        }
      }
    })
    .catch((e) => {
      console.log(e);
    });
  };

  const onChangeCpn = (cpns: IMyCouponByGoods, event: SelectChangeEvent) => {
    if (!cpns.isGoodsCpn && cartChk) {
      setCartChk(false);
    }

    let tempArr = [...useCpnList];

    const cpnList = mypageStore.myCouponsByGoods.find((coupons, index) => coupons === cpns)?.cpnList;
    cpnList?.map((cpn, index) => {
      if (cpn.cpnId === Number(event.target.value)) {
        let obj = Object.create({}, {
          cpnId: {value: cpn.cpnId},
        });
        tempArr = [...tempArr, obj];

      } else {
        tempArr.forEach((tempCpn, index)=> {
          if (tempCpn.cpnId === cpn.cpnId) {
            tempArr.splice(index, 1);
          }
        });
      }
    });
    setUseCpnList([...tempArr]);
  };

  const getSelectCpn = (cpnList : ICpn[]) => {
    let cpnId = 0;
    cpnList.map((cpn, index) => {
      useCpnList.map((useCpn, useCpnIndex) => {
        if (cpn.cpnId === useCpn.cpnId) {
          cpnId = cpn.cpnId;
        }
      });
    });
    if (cpnId === 0) {
      return 'none';
    } else {
      return String(cpnId);
    }
  }

  const getCpnDc = (cpnList : ICpn[]) => {
    let cpnDc = '';
    cpnList.map((cpn, index) => {
      useCpnList.map((useCpn, useCpnIndex) => {
        if (cpn.cpnId === useCpn.cpnId) {
          if (cpn.dcType?.code === 20101) {  // Discount Ratio(할인율) 
            cpnDc = '할인율 ' + cpn.cpnDcRate + '%';
          } else if (cpn.dcType?.code === 20103) {  //  Cash(할인금액)
            cpnDc = '할인금액 ' + cpn.cpnDcAmt + currencyCd;
          }
        }
      });
    });
    return cpnDc;
  }

  return (
    <>
      <CHeader title="쿠폰 선택" {...options} />
      <Box sx={{ pb: `${HEADER.H_MOBILE * 2}px` }}>
        <Typography variant='Kor_14_b' sx={{ pl: pxToRem(20), py: pxToRem(11), backgroundColor: '#FAFAFA', width: '100%', height: pxToRem(44), borderTop: '1px solid #EEEEEE', display: 'flex' }}>상품 쿠폰</Typography>
        <Box sx={{ mx: pxToRem(20) }}>
          {goodsCpnList.length > 0 
            ? (goodsCpnList.map((goodsCpns: any, index: number) => {
                return(
                  <Stack key = {`goodsCpn-${index}`} sx={{ borderBottom: index != goodsCpnList.length -1 ? '1px solid #EEEEEE' : null, mt: index === 0 ? pxToRem(20) : pxToRem(16) }}>
                    <Typography variant='Kor_16_b' sx={{ lineHeight: pxToRem(24), mb: pxToRem(4), color: goodsCpns.useYn ? '#202123' : '#C6C7CA' }}>{goodsCpns.goodsNm}</Typography>
                    <Typography variant='Kor_12_r' sx={{ lineHeight: pxToRem(18), color: goodsCpns.useYn ? theme.palette.primary.main : '#C6C7CA', mb: pxToRem(8) }}>
                      { goodsCpns.useYn 
                        ? `${getCpnDc(goodsCpns.cpnList)}`
                        : ''
                      }
                    </Typography>
                    <Select
                      id={`goodsCpnSelectId-${index}`}
                      value={getSelectCpn(goodsCpns.cpnList)}
                      onChange={(event: SelectChangeEvent) =>
                        onChangeCpn(goodsCpns, event)
                      }
                      disabled={!goodsCpns.useYn}
                      sx={{
                        height: pxToRem(44),
                        mb: pxToRem(16)
                      }}
                    >
                      <MenuItem disabled value={'none'}>
                        선택하세요
                      </MenuItem>
                      {goodsCpns.cpnList.map((goodsCpn: any, index: number) => (
                        <MenuItem key={goodsCpn.cpnId} value={String(goodsCpn.cpnId)} sx={{ fontSize: pxToRem(14), fontWeight: 400 }} disabled={!goodsCpn.useYn}>
                          {goodsCpn.cpnNm}
                          {'&nbsp;/' && goodsCpn.minGoodsAmt != null && goodsCpn.minGoodsAmt > 0 && numberComma(goodsCpn.minGoodsAmt) && '이상 결제 시'}
                          &nbsp;/&nbsp;~{moment(goodsCpn.cpnExpDate).format('YYYY년 MM월 DD일 까지')}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                )
            }))
            : <EmptyCoupon />
          }
        </Box>

        <Typography variant='Kor_14_b' sx={{ pl: pxToRem(20), py: pxToRem(11), backgroundColor: '#FAFAFA', width: '100%', height: pxToRem(44), display: 'flex' }}>장바구니 쿠폰</Typography>
        {cartCpnList.length > 0 && (
          <Box sx={{ display: 'flex', mx: pxToRem(20), mt: pxToRem(20) }} alignItems="center">
            <Checkbox
              icon={
                <Iconify
                  icon={'material-symbols:check-circle-outline-rounded'}
                  color={'#DFE0E2'}
                />
              }
              checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
              checked={cartChk}
              onClick={(e: any) => {
                if (e.nativeEvent.target.checked !== undefined) {
                  notApplyCartCpn(e.nativeEvent.target.checked);
                }
              }}
              disableRipple
              sx={{ m: 0, p: 0, pr: pxToRem(8) }}
              disabled={cartChk}
            />
            <Typography sx={{ lingHeight: pxToRem(24) }}>쿠폰 적용 안함</Typography>
          </Box>
        )}

        <Box sx={{ mx: pxToRem(20) }}>
          {cartCpnList.length > 0 
            ? (cartCpnList.map((cartCpns: any, index: number) => {
                return(
                  <Stack key = {`cartCpn-${index}`} sx={{ borderBottom: index != cartCpnList.length -1 ? '1px solid #EEEEEE' : null, mt: index === 0 ? pxToRem(20) : pxToRem(16) }}>
                    <Typography variant='Kor_12_r' sx={{ lineHeight: pxToRem(18), color: theme.palette.primary.main, mb: pxToRem(8) }}>{getCpnDc(cartCpns.cpnList)}</Typography>
                    <Select
                      id={`cartCpnSelectId-${index}`}
                      value={getSelectCpn(cartCpns.cpnList)}
                      onChange={(event: SelectChangeEvent) =>
                        onChangeCpn(cartCpns, event)
                      }
                      sx={{
                        textAlign: 'left',
                        height: pxToRem(44),
                        mb: pxToRem(16)
                      }}
                    >
                      <MenuItem disabled value={'none'}>
                        선택하세요
                      </MenuItem>
                      {cartCpns.cpnList.map((cartCpn: any, index: number) => (
                        <MenuItem key={cartCpn.cpnId} value={String(cartCpn.cpnId)} sx={{ fontSize: pxToRem(14), fontWeight: 400 }} disabled={!cartCpn.useYn}>
                          {cartCpn.cpnNm}
                          {'&nbsp;/&nbsp;' && cartCpn.minGoodsAmt != null && cartCpn.minGoodsAmt > 0 && numberComma(cartCpn.minGoodsAmt) && '이상 결제 시'}
                          {/*  /&nbsp;~{moment(cartCpn.cpnExpDate).format('YYYY년 MM월 DD일 까지')} */}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
            )}))
            : <EmptyCoupon />
          }
        </Box>
        
      </Box>
      <CouponFooter applyCoupon={applyCoupon}/>

      <CAlert
        alertContent={errorMsg}
        alertCategory="info"
        isAlertOpen={openError}
        handleAlertClose={() => {
          setOpenError(false);
        }}
      />
    </>
  );
});

export default CouponList;

export const EmptyCoupon = () => {
  return(
    <Box
      width="100%"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: pxToRem(20),
      }}
    >
      <IcoCoupon fill="#C6C7CA" />
      <Typography variant="body1" color={'#C6C7CA'} pt={pxToRem(12)}>
        보유한 쿠폰이 없습니다.
      </Typography>
    </Box>
  );
}