import { Box, Stack, Typography, Divider, Dialog, Slide } from '@mui/material';
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ReactComponent as IconDelete } from 'src/assets/icons/ico-payment-delete.svg';
import { CouponList } from 'src/screens/market/market-payment/coupon/CouponList';
import { pxToRem } from 'src/theme/typography';
import { numberComma } from 'src/utils/common';
import { NumericFormat } from 'react-number-format';
import { styled } from '@mui/material/styles';
import { IPaymentModel } from 'src/models/market-store/Payment';
import { TransitionProps } from '@mui/material/transitions';

/**
 * ## DiscountItem 설명
 *
 */

interface Props {
  goods: any;
  usePoint: number;
  setUsePoint: any;
  setNotiMessage: any;
  setOpenNoti: any;
  openCoupon: boolean;
  setOpenCoupon: any;
}

export const DiscountItem = observer(({ 
  goods, usePoint, setUsePoint, setNotiMessage, setOpenNoti, openCoupon, setOpenCoupon
}: Props) => {

  const rootStore = useStores();
  const { mypageStore, pointStore, orderStore } = rootStore;
  const theme = useTheme();

  const navigate = useNavigate();
  const [openDiscount, setOpenDiscount] = useState(true);
  const [point, setPoint] = useState(pointStore.point.pointBlncVal || 0);
  const [thousandPoint, setThousandPoint] = useState('');
  const payment = orderStore.amtInfo.payment as IPaymentModel;
  const totPaymentAmt = orderStore.amtInfo.payment.totPaymentAmt;

  const handleToggle = () => {
    setOpenDiscount(!openDiscount);
  };

  const handleCoupon = () => {
    setOpenCoupon(true);
    window.history.pushState(null,'',window.location.href);
  }

  const handlePoint = (event: React.ChangeEvent<HTMLInputElement>) => {
    let usePoint = 0;
    const inputPoint = Number(event.target.value.replace(',', ''));
    if(totPaymentAmt < inputPoint) {
      setOpenNoti(true);
      setNotiMessage('최대 사용 가능 포인트는 '+ numberComma(totPaymentAmt) + 'p 입니다.');
      setUsePoint(totPaymentAmt);
      usePoint = totPaymentAmt;
      setThousandPoint(numberComma(totPaymentAmt));
    } else {
      if(point < inputPoint) {
        setOpenNoti(true);
        setNotiMessage('최대 사용 가능 포인트는 '+ numberComma(point) + 'p 입니다.');
        setUsePoint(point);
        usePoint = point;
        setThousandPoint(numberComma(point));
      } else {
        setUsePoint(inputPoint);
        usePoint = inputPoint;
        setThousandPoint(event.target.value);
      }
    }

    orderStore.orderItem.setProps({
      pointAmt: usePoint,
    });
    
  }

  const resetUsePoint = () => {
    setUsePoint(0);
    setThousandPoint('0');

    orderStore.orderItem.setProps({
      pointAmt: 0,
    });
  }

  const useAllPoint = () => {
    let usePoint = 0;
    if(totPaymentAmt < point) {
      setUsePoint(totPaymentAmt);
      usePoint = totPaymentAmt;
      setThousandPoint(numberComma(totPaymentAmt));
    } else {
      setUsePoint(point);
      usePoint = point;
      setThousandPoint(numberComma(point));
    }

    orderStore.orderItem.setProps({
      pointAmt: usePoint,
    });
  }
  
  useEffect(() => {
    if (usePoint > 0) {
      setThousandPoint(numberComma(usePoint));
    }
    
    window.addEventListener('popstate', () => {
      setOpenCoupon(false);
    })
    
  },[openCoupon])

  return (
    <>
      <Stack sx={{ m: pxToRem(20) }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }} justifyContent='space-between' onClick={() => {handleToggle()}}>
          <Typography variant={'Kor_18_b'}>쿠폰 / 포인트</Typography>
          { !openDiscount && 
            <Typography variant={'Kor_14_r'} sx={{ color: '#9DA0A5', ml: 'auto', mr: pxToRem(14) }}>
              {orderStore.orderItem.cpnList.length === 0 && usePoint === 0 ? '쿠폰과 포인트를 선택해 주세요.' : '쿠폰 ' + orderStore.orderItem.cpnList.length + '장 / ' + usePoint + 'p 사용'}
            </Typography>
          }
          <Box sx={{ color: '#9DA0A5', mt: 0.5 }}> 
              {openDiscount ? <ArrowUpIcon style={{ cursor: 'pointer' }}/>: <ArrowDownIcon style={{ cursor: 'pointer' }}/>}
          </Box>
        </Box>

        { openDiscount && 
          (
            <Box sx={{ textAlign: 'left', mt: pxToRem(16) }}>
              <Typography sx={{ mb: pxToRem(8), fontWeight: 600 }}>쿠폰</Typography>
              <Box
                sx={{ display: 'flex', color: mypageStore.myAvailCnt > 0 ? '#202123' : '#9DA0A5', fontWeight: 400, border: '1px solid #EEEEEE', borderRadius: pxToRem(4), height: pxToRem(43), alignItems: 'center', mb: pxToRem(20) }}
                justifyContent='space-between'
                onClick={() => { handleCoupon()}}>
                {payment.totCpnDscntAmt > 0 
                  ? <Typography sx={{ fontSize: pxToRem(14), ml: pxToRem(12) }}>{numberComma(payment.totCpnDscntAmt)}{payment.currencyCd?.value} 할인</Typography>
                  : <Typography sx={{ fontSize: pxToRem(14), ml: pxToRem(12) }}>사용 가능 쿠폰 {mypageStore.myAvailCnt}장</Typography>
                }
                <Box sx={{ color: mypageStore.myAvailCnt > 0 ? '#202123' : '#C6C7CA', mt: 0.5 }}>
                  <ArrowRightIcon sx={{ mr: 1 , cursor:'pointer'}} />
                </Box>
              </Box>

              <Typography sx={{ mb: pxToRem(8), fontWeight: 600 }}>포인트</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(8), width: '100%' }}>
                <Box sx={{ position:'relative', width: '70%', height: pxToRem(40), mr: pxToRem(8) }}>
                  <PointStyle theme={theme}>
                    <NumericFormat 
                      type="text" 
                      className='inputPoint'
                      value={thousandPoint === '0' ? '' : thousandPoint}
                      placeholder={'0'}
                      thousandsGroupStyle="thousand" 
                      thousandSeparator="," 
                      onChange={handlePoint}
                      disabled={point === 0 ? true : false}
                    />
                  
                    {usePoint > 0 && 
                      <IconDelete style={{ position: 'absolute', top: '23%', right: '5%' }} onClick={() => {resetUsePoint()}}/>
                    }
                  </PointStyle>
                </Box>
                <Box 
                  id={'btn-cart-payment-useAllPoint'}
                  sx={{ backgroundColor: '#FAFAFA', borderRadius: pxToRem(5), width: '30%', height: pxToRem(44), textAlign: 'center', pt: pxToRem(13), cursor: point>0 ? 'pointer':'default' }}
                  onClick={() => {useAllPoint()}}
                >
                  <Typography sx={{ fontWeight: 500, lineHeight: pxToRem(16.71), height: '100%' }}>모두 사용</Typography>
                </Box>
              </Box>
              <Typography variant={'Kor_12_r'}>보유 포인트 <Box component='span' sx={{ fontWeight: 600, ml: pxToRem(4) }}>{numberComma(point)}p</Box></Typography>
            </Box>
          )
        }
      </Stack>
      <Divider sx={{ borderColor: '#FAFAFA' }} />

      {openCoupon && (
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          hideBackdrop
          disableEscapeKeyDown
          open={openCoupon}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              p: 0,
              m: '0 !important',
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              boxShadow: 'none',
            },
          }}
          onClose={() => {
            setOpenCoupon(false);
          }}
          sx={{
            margin: '0 !important',
            zIndex: 100,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <CouponList
            handleClose={()=> {
              setOpenCoupon(false);
              navigate(-1);
            }}
            goods={goods}
            currencyCd={payment.currencyCd?.value}
          />
        </Dialog>
      )}
    </>
  );
});

export default DiscountItem;

const PointStyle = styled('div')(({ theme }) => ({
  height: '100%',
  '.inputPoint': {
    width: '100%',
    height: '100%',
    fontSize: pxToRem(14),
    borderRadius: pxToRem(5),
    border: `1px solid #EEEEEE`,
    paddingLeft: pxToRem(12),
  },
  '.inputPoint:focus': {
    outline: 'none',
    border: `1px solid ${theme.palette.primary.main}`
  }
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});