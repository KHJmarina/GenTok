import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../../models/root-store/root-store-context"
import { Dialog, useTheme, Button, Typography, Stack, Checkbox, FormControlLabel } from '@mui/material';
import Iconify from 'src/components/iconify';
import { CallApiToStore } from 'src/utils/common';
import { IMyCoupon } from 'src/models/mypage/Mypage';
import { IMypageStore } from 'src/models/mypage-store/MypageStore';
import moment from 'moment';
import { pxToRem } from 'src/theme/typography';
import { ICartModel } from 'src/models/market-store/Cart';
import { toJS } from 'mobx';

/**
 * ## CouponDialog 설명
 *
 */

type Props = {
  handleClose: any,
  open: boolean,
  getAmtInfo: any,
  goods: any,
  setUseCpnCnt: any,
};

export const CouponDialog = observer(({handleClose, open, getAmtInfo, goods, setUseCpnCnt}: Props) => {

  const rootStore = useStores();
  const { loadingStore, orderStore, mypageStore, marketStore } = rootStore;
  const theme = useTheme();
  const [unusedCheck, setUnusedCheck] = useState(mypageStore.myCoupons.filter((coupon) => coupon.checkYn === true).length === 0 ? true : false);  // 적용 안함
  const [cpnCheck, setCpnCheck] = useState<any>([]);  // 사용 쿠폰
  const [availCouponList, setAvailCouponList] = useState<any>(mypageStore.myCoupons.filter((coupon) => coupon.useYn === true));  // 사용 쿠폰
  const [unAvailCouponList, setUnAvailCouponList] = useState<any>(mypageStore.myCoupons.filter((coupon) => coupon.useYn === false));  // 사용 쿠폰
  
  const checkboxIcon = (
    <Iconify
      icon={'material-symbols:check-circle-outline-rounded'}
      color={'#DFE0E2'}
    />
  );

  const applyCoupon = () => {
    const tempArr = new Array();
    const cpnList = new Array<any>();

    if(unusedCheck) { // 쿠폰 적용 안함 선택 한 경우
      (mypageStore.myCoupons.map((coupon, index) => {
        coupon.setProps({checkYn: false});
      }));

      orderStore.orderItem.setProps({
        cpnList: [] as IMyCoupon[],
      });
    } else {  // 쿠폰 선택 한 경우
      availCouponList.map((coupon: any, index: number) => {
        if(cpnCheck[index].checked) {
          tempArr.push(coupon);

          let obj = Object.create({}, {
            cpnId: {value: coupon.cpnId},
          });
          cpnList.push(obj);
        }
        coupon.setProps({checkYn: cpnCheck[index].checked});
      });

      orderStore.orderItem.setProps({
        cpnList: cpnList,
      });
    }
      
    let goodsList = new Array<ICartModel>();
    if(goods) {
      goodsList.push(toJS(goods));
    } else {
      goodsList = marketStore.cartStore.list.filter((item) => item.checkYn === true);
    }
    getAmtInfo(goodsList, tempArr); 
    setUseCpnCnt(cpnList.length);
    handleClose();
  };

  useEffect(() => {
    const temp: any = [];
    availCouponList.map((coupon: any, index: number) =>
      temp.push({ index: index, checked: coupon.checkYn }),
    );
    unAvailCouponList.map((coupon: any, index: number) =>
      temp.push({ index: index, checked: coupon.checkYn }),
    );
    setCpnCheck(temp);
  },[mypageStore]);

  return (
    <>
      <Dialog
        open={open}
        PaperProps={{
          sx: {
            p: '20px !important',
            borderRadius: '20px !important',
            '@media (max-width: 600px)': {
              p: 5,
              borderRadius: '20px !important',
            },
            width: 335,
            maxHeight: '70%',
          },
        }}
        onClose={() => {
          handleClose();
        }}
        sx={{
          margin: '0 !important',
          zIndex: theme.zIndex.modal,
          padding: 0,
        }}
      >
        <Typography
          variant='Kor_18_b'
          sx={{ width: '100%', pb: 2.5 }}>쿠폰 선택</Typography>
        <Stack
          spacing={1}
          sx={{
            overflowY: 'auto',
            '&::-webkit-scrollbar': {display: 'none'}
          }}
        >
          <Stack
            justifyContent={'flex-start'}
            direction={'row'}
            alignItems={'center'}
          >
            <FormControlLabel
              sx={{ml: 0}}
              control={
                <Checkbox //default 쿠폰 적용 안함 체크박스
                  disableRipple
                  icon={checkboxIcon}
                  checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
                  checked={unusedCheck}
                  onClick={(e: any) => {
                    if (e.nativeEvent.target.checked !== undefined && e.nativeEvent.target.checked === true) {
                      const temp: any = [];
                      cpnCheck.map((c: any) =>
                        temp.push({ ...c, checked: false }),
                      );
                      setCpnCheck(temp);
                      setUnusedCheck(e.nativeEvent.target.checked);
                    }
                  }}
                  sx={checkBoxCommonStyle}
                />
              }
              label={
                <Typography variant={'Kor_18_r'} color={'#202123'}>쿠폰 적용 안함</Typography>
              }
            />
          </Stack>
          {
            mypageStore.myCoupons && mypageStore.myCoupons.length != 0 && (
              availCouponList.map((coupon: IMyCoupon, index: number) => {
                return (
                  <Stack key={`coupon-${coupon.cpnId}`} spacing={1}>
                    <Stack
                      justifyContent={'flex-start'}
                      direction={'row'}
                      alignItems={'center'}
                    >
                      { coupon.useYn
                        ? (
                          <FormControlLabel
                            sx={{ml: 0}}
                            control={
                              <Checkbox //사용가능 쿠폰 체크박스
                                disableRipple
                                icon={checkboxIcon}
                                checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
                                checked={cpnCheck.filter((c: any) => c.index === index && c.checked === true).length > 0}
                                onClick={(e: any) => {
                                  if (e.nativeEvent.target.checked !== undefined) {
                                    const temp: any = [];
                                    cpnCheck.map((c: any) =>
                                      c.index === index
                                      ? temp.push({ ...c, checked: e.nativeEvent.target.checked })
                                      : temp.push({ ...c })
                                    );
                                    setCpnCheck(temp);
                                    // setCpnCheck(
                                    //   cpnCheck.map((c: any) =>
                                    //     c.index === index
                                    //       ? { ...c, checked: e.nativeEvent.target.checked }
                                    //       : c,
                                    //   ),
                                    // );
                                    setUnusedCheck(temp.filter((item: any)=>item.checked === true).length === 0);
                                  }
                                }}
                                sx={checkBoxCommonStyle}
                              />
                            }
                            label={
                              <Typography variant={'Kor_18_b'} color={'#202123'}>사용가능</Typography>
                            }
                          />
                        ) : ''
                      }
                    </Stack>
                    <Box display={'flex'} justifyContent={'flex-end'}>
                      <Stack direction={'column'} sx={couponCardCommonStyle}>
                        <Typography variant='Kor_16_b' color={coupon.useYn ? '#202123' : '#C6C7CA'} pb={pxToRem(8)}> {coupon.cpnNm} </Typography>
                        {coupon.minGoodsAmt != 0 &&
                          <Typography variant='Kor_12_r' color={'#9DA0A5'}> {coupon.minGoodsAmt}원 이상 구매 시 사용 </Typography>
                        }
                        <Typography variant='Kor_12_r' color={'#9DA0A5'}> {moment(coupon.cpnExpDate).format('YYYY. MM. DD')} 까지 </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                )
              })
          )}
          {
            mypageStore.myCoupons && mypageStore.myCoupons.length != 0 && (
              unAvailCouponList.map((coupon: IMyCoupon, index: number) => {
                return (
                  <Stack key={`coupon-${coupon.cpnId}`} spacing={1}>
                    <Stack
                      justifyContent={'flex-start'}
                      direction={'row'}
                      alignItems={'center'}
                    >
                      { !coupon.useYn
                        ? (
                          <FormControlLabel
                            sx={{ml: 0}}
                            control={
                              <Checkbox //사용불가 쿠폰 체크박스
                                disableRipple
                                icon={
                                  <Iconify
                                    icon={'material-symbols:check-circle-rounded'}
                                    color={theme.palette.grey[400]}
                                  />
                                }
                                checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
                                checked={false}
                                onClick={(e: any) => {
                                  //사용불가 쿠폰은 선택 불가
                                }}
                                sx={checkBoxCommonStyle}
                              />
                            }
                            label={
                              <Typography variant={'Kor_18_b'} color={'#C6C7CA'}>사용불가</Typography>
                            }
                          />
                        ) : ''
                      }
                    </Stack>
                    <Box display={'flex'} justifyContent={'flex-end'}>
                      <Stack direction={'column'} sx={couponCardCommonStyle}>
                        <Typography variant='Kor_16_b' color={coupon.useYn ? '#202123' : '#C6C7CA'} pb={pxToRem(8)}> {coupon.cpnNm} </Typography>
                        {coupon.minGoodsAmt != 0 &&
                          <Typography variant='Kor_12_r' color={'#9DA0A5'}> {coupon.minGoodsAmt}원 이상 구매 시 사용 </Typography>
                        }
                        <Typography variant='Kor_12_r' color={'#9DA0A5'}> {moment(coupon.cpnExpDate).format('YYYY. MM. DD')} 까지 </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                )
              })
          )}

        </Stack>
        <Stack direction={'row'}>
          <Button
            id={`btn-cart-payment-useCoupon`}
            variant="outlined"
            size={'medium'}
            sx={{ mt: 3, borderRadius: 62.5, width: '49%', '&:hover':{ background:'none', color:'#FF5D0C', border:'1px solid #FF5D0C'}}}
            onClick={() => {
              handleClose();
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            size={'medium'}
            sx={{ mt: 3, ml: '2%', borderRadius: 62.5, width: '49%', '&:hover':{ background:'#FF5D0C !important' } }}
            onClick={() => {
              applyCoupon();
            }}
          >
            적용하기
          </Button>
        </Stack>
      </Dialog>
    </>
  );
});

export default CouponDialog;

const checkBoxCommonStyle = {
  p: 0,
  pr: 1
}
const couponCardCommonStyle = {
  justifyContent: 'flex-start',
  textAlign: 'left',
  width: '90%',
  p: 2,
  border: '1px solid #EEEEEE',
  borderRadius: 1.25,
}