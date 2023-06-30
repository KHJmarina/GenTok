import { Box } from '@mui/material';
import { Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { pxToRem } from 'src/theme/typography';
import { numberComma } from 'src/utils/common';
import { useTheme } from '@mui/material';
import { getOrderStateValue } from 'src/models';
import { toJS } from 'mobx';
import { useEffect, useState } from 'react';

type Props = {
  inquiry?: any;
  order?: any;
  inquiryOrder?: any;
  isCancel?: boolean;
  reset?: boolean;
};

export const IOrderItemContent = observer(({ inquiryOrder, order, isCancel = false, inquiry, reset }: Props) => {
  const theme = useTheme();    

  const [ selectOrder, setSelectOrder ] = useState<any>(order)
  const [ apiSelectOrder, setApiSelectOrder ] = useState<any>(inquiryOrder)  
  console.log(reset);
  useEffect(()=>{
    if(reset === false){
      setSelectOrder('')
      setApiSelectOrder('')
    }
  }, [reset])
  console.log(reset);
  

  return (
    <Stack sx={{ ml: pxToRem(15), textAlign: 'left' }}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        sx={selectOrder?.goodsList && order?.goodsList.length > 1 || apiSelectOrder && apiSelectOrder.order?.goodsList.length > 1 ? multiGoodsStyle : singleGoodsStyle}
      >
        <Box sx={{display: 'inline-flex',flexWrap: 'wrap',}}>
          <Typography
            variant={'Kor_16_b'}
            display={'inline'}
            sx={{
              color: '#202123', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
              maxWidth:  selectOrder?.goodsList?.length! > 1 ||  inquiryOrder && apiSelectOrder.order?.goodsList?.length! > 1 ? '50%' : '100%',
            }}
          >
            {selectOrder?.goodsList && selectOrder?.goodsList[0]?.goodsNm! || apiSelectOrder && apiSelectOrder.order?.goodsList[0]?.goodsNm!}
          </Typography>
          {selectOrder?.goodsList && selectOrder?.goodsList.length > 1 || apiSelectOrder && apiSelectOrder.order?.goodsList.length > 1 ? (
            <>
              <Typography variant={'Kor_16_b'} display={'inline'} sx={{ color: '#202123' }}>
                &nbsp;포함
              </Typography>
              <Typography variant={'Kor_16_b'} display={'inline'} sx={{ color: theme.palette.primary.main }}>
                &nbsp;[총 {selectOrder?.goodsList.length || apiSelectOrder.order?.goodsList.length }개]
              </Typography>
            </>):(<Box></Box>)}
        </Box>

        <Typography variant="Kor_12_r" sx={{ textDecoration: isCancel ? 'line-through' : null }}>
          {selectOrder && (numberComma(Number(selectOrder?.paymentAmt))) || apiSelectOrder.order && (numberComma(Number(apiSelectOrder.order?.paymentAmt)))}
          {(selectOrder?.goodsList && (selectOrder?.goodsList[0]?.currencyCd! && selectOrder?.goodsList[0].currencyCd?.value!) || 
          inquiryOrder && (apiSelectOrder.order?.goodsList[0]?.currencyCd! && apiSelectOrder.order?.goodsList[0].currencyCd?.value!)) || '원'}
        </Typography>
      </Box>
    </Stack>
  );
});

export default IOrderItemContent;

const multiGoodsStyle = {
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  // ml: pxToRem(10),
  // height: 90,
  width: '100%',
  // mb: 1.5,
  // mt: pxToRem(3),
};

const singleGoodsStyle = {
  alignItems: 'flex-start',
  justifyContent: 'center',
  // justifyContent: 'flex-start',
  // mt: pxToRem(s10),
  height: '100%',
  width: '100%',

  // mb: 1.5,
};
