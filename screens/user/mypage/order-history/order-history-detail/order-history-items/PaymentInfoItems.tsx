import Box from '@mui/material/Box';
import {
  Stack,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
  ListItem
  
} from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../../../../models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'src/theme/typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { numberComma } from 'src/utils/common';
import { ICouponInfo, IOrderHistoryPayment } from 'src/models/order-history-payment/OrderHistoryPayment';

/**
 * ## PaymentinfoItems 설명
 *
 */

const useStyles = makeStyles(() => ({
  accordion: {
    '&.MuiAccordion-root.Mui-expanded': {
      mt: 0,
      margin:0,
      boxShadow : 'none'
      },
      overflowX: 'scroll',
      background: '#FFFFFF',
      '&::-webkit-scrollbar': {
        display: 'none',
       },
       justifyContent: 'center',
      '&.MuiAccordion-root.Mui-expanded:before': {
        opacity: 1,
      },
     
  },
  deliveryInfo:{
    '& .MuiAccordionSummary-content' :{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  },

}));

export const PaymentinfoItems = observer(() => {

  const rootStore = useStores();
  const { loadingStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [paymentList, setPaymentList] = useState<IOrderHistoryPayment[]>(new Array<IOrderHistoryPayment>());
  const [paymentInfo, setPaymentInfo] = useState<IOrderHistoryPayment>({} as IOrderHistoryPayment);
  
  const handleClickAccdn = () => {
    setOpen(!open);
    // console.log(open);
  }

  useEffect(() => {
    let paymentList = new Array<IOrderHistoryPayment>();
    if(orderHistoryStore.orderHistory?.paymentList && orderHistoryStore.orderHistory?.paymentList?.length > 0) {
      paymentList = orderHistoryStore.orderHistory?.paymentList;
      setPaymentList(paymentList);
      setPaymentInfo(paymentList[0]);
    }
  }, []);

  return (
    <>
      <Accordion 
        className={classes.accordion}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.action.disabled }} />}
          sx={{ mx: pxToRem(20), px: 0 }}
          className={classes.deliveryInfo}
          onClick={handleClickAccdn}
        >
          <Typography variant={'Kor_18_b'}>결제 정보</Typography>
          { !open && 
            <Typography variant={'Kor_14_r'}>
              { paymentList && paymentList.length > 0
                ? numberComma(Number(paymentInfo.paymentAmt)) + paymentInfo.currencyCd?.value
                : '-'
              }
            </Typography>
          }
        </AccordionSummary>

        <AccordionDetails
          sx={{ mx: pxToRem(20), p: 0, mt: pxToRem(8), mb: pxToRem(20) }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(12) }}>
            <Typography variant={'Kor_14_r'} sx={{ color: '#5D6066', flex: '0 0 auto', width: pxToRem(88), textAlign: 'left' }} > 주문 금액</Typography>
            <Typography variant={'Kor_14_b'} sx={{ color: '#202123', flex: 'auto', width: pxToRem(286), textAlign: 'right' }} >
              { paymentList && paymentList.length > 0
                ? numberComma(Number(paymentInfo.priceAmt)) + paymentInfo.currencyCd?.value
                : '-'
              }
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(12) }}>
            <Typography variant={'Kor_14_r'} sx={{ color: '#5D6066', flex: '0 0 auto', width: pxToRem(88), textAlign: 'left', alignSelf: 'flex-start' }} > 결제 방법</Typography>
            <Typography variant={'Kor_14_r'} sx={{ color: '#202123', flex: 'auto', width: pxToRem(286), textAlign: 'right' }} >
              { paymentList && paymentList.length > 0
                ? paymentInfo.paymentTypeCd?.value
                : '-'
              }
              {/* <Box>
                <Typography 
                  sx={{ 
                    fontSize: pxToRem(12), fontWeight:400, color:theme.palette.primary.main,
                    textDecoration:'underline', mt:0.1
                  }}>
                  영수증보기
                </Typography>
              </Box> */}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(12) }}>
            <Typography variant={'Kor_14_r'} sx={{ color: '#5D6066', flex: '0 0 auto', width: pxToRem(88), textAlign: 'left' }}> 상품 할인</Typography>
            { paymentList && paymentList.length > 0
              ? (
                <Typography variant={'Kor_14_r'} sx={{ color: '#202123', flex: 'auto', width: pxToRem(286), textAlign: 'right' }}>
                  {paymentInfo.goodsDscntRate > 0  && <span style={{fontVariant:'Kor_12_r', color:theme.palette.primary.main, marginRight:pxToRem(8) }}>{paymentInfo.goodsDscntRate}% 할인</span>}
                  {Number(paymentInfo.goodsDscntAmt) > 0 && '-'}
                  {numberComma(Number(paymentInfo.goodsDscntAmt))}
                  {paymentInfo.currencyCd?.value}
                </Typography>
              )
              : (
                <Typography variant={'Kor_14_r'} sx={{ color: '#202123', flex: 'auto', width: pxToRem(286), textAlign: 'right' }}>
                  -
                </Typography>
              )
            }
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(12) }}>
            <Typography variant={'Kor_14_r'} sx={{ color: '#5D6066', flex: '0 0 auto', width: pxToRem(88), textAlign: 'left', alignSelf: 'flex-start' }}>쿠폰 할인</Typography>
            { paymentList && paymentList.length > 0
              ? (
                paymentInfo.cpnList && paymentInfo.cpnList.length > 0
                ? (
                  <Stack sx={{ ml: 'auto' }}>
                    {paymentInfo.cpnList.map((coupon: ICouponInfo, index: number) => (
                      <Box key={`coupon-${index}`} sx={{ textAlign: 'right', mb: pxToRem(4) }}>
                        <Typography variant={'Kor_14_r'} sx={{ color: '#202123', flex: 'auto', width: pxToRem(286) }} >
                          <span style={{fontVariant:'Kor_12_r', color: '#9DA0A5', marginRight:pxToRem(8) }}>{coupon.cpnNm}</span>
                          {Number(coupon.cpnStblAmt) > 0 && '-'}
                          {numberComma(Number(coupon.cpnStblAmt))}
                          {paymentInfo.currencyCd?.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )
                : (
                  <Typography variant={'Kor_14_r'} sx={{ color: '#202123', flex: 'auto', width: pxToRem(286), textAlign: 'right' }} >
                    0{paymentInfo.currencyCd?.value}
                  </Typography>
                )
              )
              : <Typography variant={'Kor_14_r'} sx={{ color: '#202123', flex: 'auto', width: pxToRem(286), textAlign: 'right' }} >
                  -
                </Typography>
            }
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(12) }}>
            <Typography variant={'Kor_14_r'} sx={{ color: '#5D6066', flex: '0 0 auto', width: pxToRem(88), textAlign: 'left' }}>포인트 할인</Typography>
            <Typography variant={'Kor_14_r'} sx={{color: '#202123', flex: 'auto', width: pxToRem(286), textAlign: 'right' }}>
              { paymentList && paymentList.length > 0
                ? ( Number(paymentInfo.pointAmt) > 0 
                    ? '-' + numberComma(Number(paymentInfo.pointAmt)) 
                    : '0'
                  )
                  + paymentInfo.currencyCd?.value
                : '-'
              }
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(12), borderTop: '1px solid #EEEEEE' }}>
            <Typography variant={'Kor_14_b'} sx={{ color: '#202123', flex: '0 0 auto', width: pxToRem(88), textAlign: 'left', mt: pxToRem(12) }}>결제 금액</Typography>
            <Typography variant={'Kor_18_b'} sx={{ color: theme.palette.primary.main , flex: 'auto', width: pxToRem(286), textAlign: 'right', mt: pxToRem(12) }}>
              { paymentList && paymentList.length > 0
                ? numberComma(Number(paymentInfo.paymentAmt)) + paymentInfo.currencyCd?.value
                : '-'
              }
            </Typography>
          </Box>
          
          <List sx={{ listStyleType: 'disc', pl: '1.25rem', color:'#9DA0A5', fontSize:pxToRem(14) }} >
            <ListItem sx={{ display: 'list-item', p: 0 }}>
              <Typography variant={'Kor_12_r'} >
                PG사 또는 카드사에서 제공하는 즉시 할인은 최종 결제 금액에 반영되지 않습니다.
              </Typography>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <Divider sx={{ borderWidth: pxToRem(4) }}></Divider>
    </>
  );
});

export default PaymentinfoItems;