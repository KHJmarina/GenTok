// style
import { Box, Button, RadioGroup, FormControlLabel, Radio, Stack, Typography, useTheme } from '@mui/material';
import { useStores } from 'src/models/root-store/root-store-context';
import { CallApiToStore, numberComma } from 'src/utils/common';
import 'yet-another-react-lightbox/styles.css';
import CHeader from 'src/components/CHeader';
import { HEADER } from 'src/config-global';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { pxToRem } from 'src/theme/typography';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';
import { toJS } from 'mobx';
import Iconify from 'src/components/iconify';
import IOrderItemContent from '../inquiry-view/IOrderItemContent';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form';
/**
 * ## InquiryView 설명
 *
 */
interface Props {
  handleClose: VoidFunction;
  orderDetailYn?: any;
  data?: any;
  select?: any;
}

/**
 * ## InquiryOrderHistory 설명
 *
 */
export const InquiryOrderHistory = observer(({ handleClose, select, orderDetailYn}: Props) => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore, marketStore,inquiryStore } = rootStore;
  const theme = useTheme();

  const [radio, setRadio] = useState();  
  const headerOptions: any = { showMainIcon: 'none', showXIcon: true, handleX: () => {handleClose()}};
  const [selectOrder, setSelectOrder] = useState({});
  const sendSelectOrder = (radio:any) => {
    select(radio);
  };
 
  const makeDateFormat = (date: number) => {
    let tempDate = new Date(date);
    let year = tempDate.getFullYear();
    let month = ('0' + (1 + tempDate.getMonth())).slice(-2);
    let day = ('0' + tempDate.getDate()).slice(-2);

    return `${year}.${month}.${day}`;
  }; 



  const radioIcon = (<Iconify icon={'gg:radio-check'} color={'#DFE0E2'}/>);
  const radioCheckedIcon = (<Iconify icon={'mdi:record-circle'} />);

  const methods = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async () => {};  

  return (
    <>
      <CHeader title="주문 상품 선택" {...headerOptions} />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <RadioGroup
          name={'1'}
          sx={{ ml: 1, fontSize: pxToRem(16) }}
          onChange={(e: any) => {
            setRadio(e.target.value)     
            const data = toJS(inquiryStore.inquirysOrder).filter((s:any) => s.orderNo === e.target.value)
              setSelectOrder(data[0])
          }}
        >
            {inquiryStore.inquirysOrder?.map((item: any, index : any) => {
               return(
                <Stack key={index} spacing={2.5} sx={{ borderBottom: 0,background: '#FFFFFF', pb:pxToRem(10), '&::-webkit-scrollbar': {display: 'none',}, justifyContent: 'flex-start',}}>
                {/* 상단 날짜 & 주문번호 */}
                  <Box sx={{ textAlign: 'left', bgcolor: '#fafafa', py:pxToRem(10), px: pxToRem(20), }}>
                    <Typography sx={{ mr: 2 }} variant={'Kor_14_b'}>
                      {makeDateFormat(item?.orderDt)}
                    </Typography>
                    <Typography variant={'Kor_12_r'} sx={{ color: '#9DA0A5' }}>
                      {item?.orderNo}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', mt: pxToRem(12),pb: pxToRem(20), width:'100%' }} borderRadius={2}>
                    {/* 좌측 이미지 */}
                    <Stack sx={{justifyContent:'space-between', alignItems:'center',}}>
                      <Box sx={{display:'flex'}}>
                        <Radio disableRipple icon={radioIcon} checkedIcon={radioCheckedIcon} value={item.orderNo} />    
                        {/* 상품이미지 */}
                        <OrderItemImage
                          imgSrc={`${item?.goodsList[0]?.img1Path}`}
                          listSize={Number(`${item?.goodsList.length}`)}
                        />
                        {/* 우측 컨텐츠 */}
                        <Stack sx={{textAlign: 'left' }}>
                          <Box display={'flex'} flexDirection={'column'} sx={item?.goodsList && item?.goodsList.length > 1 ? multiGoodsStyle : singleGoodsStyle}>
                            <Box sx={{display: 'inline-flex',flexWrap: 'wrap',}}>
                              <Typography variant={'Kor_16_b'} display={'inline'} sx={{ color: '#202123', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth:  item?.goodsList?.length! > 1 ? '50%' : '100%',}}>
                                {item?.goodsList && item?.goodsList[0]?.goodsNm!}
                              </Typography>
                              {item?.goodsList && item?.goodsList.length > 1 ? (
                                <>
                                  <Typography variant={'Kor_16_b'} display={'inline'} sx={{ color: '#202123' }}>&nbsp;포함</Typography>
                                  <Typography variant={'Kor_16_b'} display={'inline'} sx={{ color: theme.palette.primary.main }}>&nbsp;[총 {item?.goodsList.length }개]</Typography>
                                </>):(<Box></Box>)}
                            </Box>
                            <Typography variant="Kor_12_r" >
                              {item && (numberComma(Number(item?.paymentAmt)))}
                              {item?.goodsList && (item?.goodsList[0]?.currencyCd! && item?.goodsList[0].currencyCd?.value!) || '원'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>   
              )             
            })} 
            </RadioGroup>
            </FormProvider>
            {inquiryStore.inquirysOrder.length <= 0 && <Typography variant={'body1'} color={theme.palette.grey[500]} sx={{mt: pxToRem(90), textAlign:'center' }} > 주문한 내역이 없습니다.</Typography>}
            <Stack spacing={2} sx={{flex: 1,pb: `${HEADER.H_MOBILE * 2}px`,overflowY: 'auto', width:'100%', }}>
              <Button
              variant="contained"
              size={'large'}
              onClick={() => {
                handleClose();
                sendSelectOrder(selectOrder);
                orderDetailYn()
              }}
              disabled={radio === null || radio === undefined}
              sx={{
                height: pxToRem(60),
                maxWidth: 'md',
                width: '100%',
                borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
                position: 'fixed',
                bottom: 0,
              }}
            >
              <Typography variant="Kor_18_b">선택 완료</Typography>
            </Button>
          </Stack>    
    </>
  );
});

export default InquiryOrderHistory;

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
