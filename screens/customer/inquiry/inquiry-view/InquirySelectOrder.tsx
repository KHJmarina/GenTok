import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';

// style
import Box from '@mui/material/Box';
import { Button, Stack, Typography, useTheme, Card } from '@mui/material';
import { useStores } from 'src/models/root-store/root-store-context';
import { CallApiToStore, numberComma } from 'src/utils/common';
import { pxToRem } from 'src/theme/typography';
import 'yet-another-react-lightbox/styles.css';
import { toJS } from 'mobx';
import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import InquiryOrderHistory from '../inquiry-order-history/InquiryOrderHistory';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';
import { getOrderStateValue } from 'src/models/order-history/OrderHistory';
import { PATH_ROOT } from 'src/routes/paths';
import { ReactComponent as ArrowMore } from 'src/assets/icons/ico-arrow-more.svg';
import { useNavigate } from 'react-router';
import OrderHistoryDetailButtons from 'src/screens/user/mypage/order-history/order-history-buttons/OrderHistoryDetailButtons';
import palette from 'src/theme/palette';
import OrderItemContent from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemContent';
import IOrderItemContent from './IOrderItemContent';
import { Icon } from '@iconify/react';
import { ReactComponent as IcoClose } from 'src/assets/icons/ico-close.svg';
/**
 * ## InquiryView 설명
 *
 */
interface Props {
  order?: any;
  inquiryOrder?: any
  handleClose?: any
  delete?: boolean;
  marketOrderYn?: any;
}

export const InquirySelectOrder = observer(({ order, handleClose, inquiryOrder, marketOrderYn }: Props) => {
  const rootStore = useStores();
  const { inquiryStore, loadingStore, responseStore, orderHistoryStore } = rootStore;
  const navigate = useNavigate();
  const theme = useTheme();

  const [ selectOrder, setSelectOrder ] = useState<any>(order)
  const [ apiSelectOrder, setApiSelectOrder ] = useState<any>(inquiryOrder)
  const [open, setOpen] = useState(true)

  const makeDateFormat = (date: number) => {
    let tempDate = new Date(date);
    let year = tempDate.getFullYear();
    let month = ('0' + (1 + tempDate.getMonth())).slice(-2);
    let day = ('0' + tempDate.getDate()).slice(-2);

    return `${year}.${month}.${day}`;
  };   

  const handleRemove = (o: any) => {
    setOpen(false)
    order && delete order.orderNo
  }

  useEffect(()=>{    
    setOpen(true)
},[order])

  return (
    <>
    {open && (order?.orderNo !== undefined || inquiryOrder?.order !== undefined) && 
      <Card sx={{width: '100%',height: '100%',boxShadow: 'none',mt: selectOrder !== null ||  undefined ? pxToRem(30) : pxToRem(12), pb:pxToRem(15),bgcolor: '#FAFAFA', borderRadius: pxToRem(5)}}>
      <Box sx={{py: 1.5}}>
        <Stack direction={'row'} sx={{mx: pxToRem(20),display: 'flex',flexDirection: 'column', justifyContent:'space-between', alignItems:'left'}} >
          {/* 상단 날짜 & 주문번호 */}
          <Box sx={{display:'flex', justifyContent:'space-between',alignItems:'center', width:'100%' }}>
            
          <Box sx={{display:'flex', alignItems:'center'}}>
             <Typography sx={{ mr: 1, textAlign: 'left',  }} variant={'Kor_14_b'}> 
              {(order && makeDateFormat(order?.orderDt)) || (inquiryOrder.order && makeDateFormat(inquiryOrder.order?.orderDt))}
             </Typography>
             <Typography variant={'Kor_12_r'} sx={{ color: theme.palette.grey[400], textAlign: 'left',  }}> 
              {order?.orderNo || inquiryOrder.order?.orderNo}
            </Typography>
           </Box>
           {!marketOrderYn ? <Box component={Icon} icon={'ph:x-bold'} sx={{cursor:'pointer',color: theme.palette.action.disabled }} onClick={handleRemove}></Box> : <Box></Box>}
          </Box>

            <Box sx={{ display: 'flex', mt: pxToRem(12), width:'100%' }} borderRadius={2}>
              {/* 좌측 이미지 */}
              <Stack sx={{justifyContent:'space-between', alignItems:'center'}}>
              <Box sx={{display:'flex'}}>
                <OrderItemImage
                  imgSrc={ order && `${ order?.goodsList[0]?.img1Path}`|| inquiryOrder  && `${ inquiryOrder.order?.img1Path}` || undefined}
                  listSize={ order && Number(`${order?.goodsList.length}`) ||  inquiryOrder  && Number(`${inquiryOrder.order?.goodsList.length}`) || undefined}
                />
                {/* 우측 컨텐츠 */}
                <Stack sx={{textAlign: 'left' }}>
                  <Box display={'flex'} flexDirection={'column'} sx={order?.goodsList && order?.goodsList.length > 1 || inquiryOrder && inquiryOrder.order?.goodsList.length > 1 ? multiGoodsStyle : singleGoodsStyle}>
                    <Box sx={{display: 'inline-flex',flexWrap: 'wrap',}}>
                      <Typography variant={'Kor_16_b'} display={'inline'} sx={{ color: '#202123', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth:  order?.goodsList?.length! > 1 ||  inquiryOrder && inquiryOrder.order?.goodsList?.length! > 1 ? '50%' : '100%',}}>
                        {order?.goodsList && order?.goodsList[0]?.goodsNm! || inquiryOrder && inquiryOrder.order?.goodsList[0]?.goodsNm!}
                      </Typography>
                      {order?.goodsList && order?.goodsList.length > 1 || inquiryOrder && inquiryOrder.order?.goodsList.length > 1 ? (
                        <>
                          <Typography variant={'Kor_16_b'} display={'inline'} sx={{ color: '#202123' }}>&nbsp;포함</Typography>
                          <Typography variant={'Kor_16_b'} display={'inline'} sx={{ color: theme.palette.primary.main }}>&nbsp;[총 {order?.goodsList.length || inquiryOrder.order?.goodsList.length }개]</Typography>
                        </>):(<Box></Box>)}
                    </Box>

                    <Typography variant="Kor_12_r" >
                      {order && (numberComma(Number(order?.paymentAmt))) || inquiryOrder.order && (numberComma(Number(inquiryOrder.order?.paymentAmt)))}
                      {(order?.goodsList && (order?.goodsList[0]?.currencyCd! && order?.goodsList[0].currencyCd?.value!) || 
                      inquiryOrder && (inquiryOrder.order?.goodsList[0]?.currencyCd! && inquiryOrder.order?.goodsList[0].currencyCd?.value!)) || '원'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
            </Box>
        </Stack>
      </Box>
    </Card>}
    </>
  );
});
export default InquirySelectOrder;

const multiGoodsStyle = {
  alignItems: 'flex-start',
  justifyContent: 'center',
  ml: pxToRem(10),
  height: 70,
  width: '100%',
  // mb: 1.5,
  // mt: pxToRem(3),
};

const singleGoodsStyle = {
  alignItems: 'flex-start',
  justifyContent: 'center',
  ml: pxToRem(10),
  // justifyContent: 'flex-start',
  // mt: pxToRem(s10),
  height: '100%',
  width: '100%',
};