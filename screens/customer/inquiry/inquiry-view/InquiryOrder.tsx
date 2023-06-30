import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
// style
import {Stack,Typography,useTheme,Dialog,Slide,Box} from '@mui/material';
import { useStores } from 'src/models/root-store/root-store-context';
import { pxToRem } from 'src/theme/typography';
import 'yet-another-react-lightbox/styles.css';
import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import InquiryOrderHistory from '../inquiry-order-history/InquiryOrderHistory';
import InquirySelectOrder from './InquirySelectOrder';
import { Icon } from '@iconify/react';
import { toJS } from 'mobx';
import { CallApiToStore } from 'src/utils/common';


/**
 * ## InquiryOrder 설명
 *
 */
interface Props {
  orderYn: boolean;
  marketOrder: any;
  onStateChange?: any;
  select?:any
  inquiryOrder? : any
}

export const setSelectOption = ( code: string | number | boolean | null, value: string, pcode: string | number | null ) => { 
  return { code: code ? code : null, value: value ? value : '', pcode: pcode }};

export const InquiryOrder = observer(({ orderYn = false, marketOrder, onStateChange, select,inquiryOrder }: Props) => {
  const rootStore = useStores();
  const { inquiryStore } = rootStore;
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [selectBoxOpen, setSelectBoxOpen] = useState(true);
  const [selectOrder, setSelectOrder] = useState();  
  const [orderDetailYn, setOrderDetailYn] = useState(false);  
  
  // 하위 컴포넌트에서 주문내역 값 전달 받기 + 상위로 보내기
  const getSelectOrder = (req : any) => {
    setSelectOrder(req)
    select(req);
  }

  // 선택한 주문내역 삭제
  const getHandleClose = (req :any) => {
    // setSelectBoxOpen(req)
  }

  useEffect(()=>{
    inquiryStore.inquiry.order !== null || undefined ? setOrderDetailYn(true) : setOrderDetailYn(false)    
  },[inquiryStore.inquiry])  

  return (
    <>
    {/* 주문 목록 select */}
      {orderYn && (
        <Stack mt={pxToRem(20)} sx={{position:'relative'}}>
          <Typography variant={'Kor_16_b'} textAlign={'left'}>
            상품 선택
          </Typography>
          <Typography variant={'Kor_12_r'} sx={{textAlign: 'left',pt: pxToRem(9),pb: pxToRem(4),color: theme.palette.grey[400]}}>
            문의하실 내용과 관련있는 주문상품을 선택해 주세요.
          </Typography>

          <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', border:`1px solid ${theme.palette.grey[400]}`, borderRadius:pxToRem(4), p:pxToRem(9)}}
            onClick={()=>{
              if(marketOrder.orderNo !== ''){
                setOpen(false)
              } else{
                setOpen(true);
              }
              setSelectBoxOpen(true)}}>
            <Box><Typography variant='Kor_16_r' sx={{display:'inline-block', color: marketOrder.orderNo !== '' ? '#919EAB' : '#212B36'}}>주문 상품 선택</Typography></Box>
            <Box component={Icon} icon={'material-symbols:navigate-next'} sx={{cursor:'pointer', color: marketOrder.orderNo !== '' ? '#919EAB' : '#212B36' }}></Box>
          </Box>
        </Stack>
      )}

      { (inquiryOrder.order?.orderDt || selectOrder !== undefined || (marketOrder.orderDt !== null || undefined) ) && 
        <InquirySelectOrder inquiryOrder={inquiryOrder} order={ marketOrder.orderNo !== '' ? marketOrder : selectOrder} handleClose={getHandleClose} marketOrderYn={marketOrder.orderNo !== ''}/> 
      }

      {/* 주문 목록 리스트 */}
      {open && (
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          hideBackdrop
          disableEscapeKeyDown
          open={open}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              p: 0,
              m: '0 !important',
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              boxShadow: 'none',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            },
          }}
          onClose={() => {
            setOpen(false);
            inquiryStore.resetInquiry();
          }}
          sx={{
            margin: '0 !important',
            zIndex: 1200,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <InquiryOrderHistory handleClose={() => {setOpen(false); setSelectBoxOpen(true)}} orderDetailYn={()=>{setOrderDetailYn(true)}} select={getSelectOrder}/>
        </Dialog>
      )}
    </>
  );
});
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});
export default InquiryOrder;
