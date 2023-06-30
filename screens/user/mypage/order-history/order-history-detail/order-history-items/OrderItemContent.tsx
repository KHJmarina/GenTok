import { Box } from '@mui/material';
import {
  Stack,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { pxToRem } from 'src/theme/typography';
import { numberComma } from 'src/utils/common';
import { useTheme } from '@mui/material';
import { getOrderStateValue } from 'src/models';

type Props = {
  data: any,
  isCancel?: boolean,
};

export const OrderItemContent = observer(({ data, isCancel=false }: Props) => {
  const theme = useTheme();

  return (
    <Stack sx={{ ml: pxToRem(15), textAlign: 'left' }}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        sx={(data.goodsList.length > 1 ? multiGoodsStyle : singleGoodsStyle)}
      >
        <Box 
        sx={{ 
          display: 'inline-flex',
          flexWrap: 'wrap',
          overflow:'hidden',
          whiteSpace:'normal',
          // textOverflow:'ellipsis',
          wordBreak:'keep-all'
        }}
        // direction={'row'} 
        // width='100%' 
        >
        <Typography variant={'Kor_18_b'} display={'inline'} sx={{
          color: '#202123',
          // overflow: 'hidden',
          // whiteSpace: 'nowrap',
          // textOverflow: 'ellipsis',
          // maxWidth: (data?.goodsList?.length! > 1 ? '50%' : '100%'),
          // maxWidth: '46%',
          mb: pxToRem(8),
        }}>
          {data?.goodsList[0].goodsSid == 74  // kit box가 첫번째 상품인 경우 다른 상품부터 노출
          ?  data?.goodsList[1].goodsNm
          : data?.goodsList[0]?.goodsNm!}
          
          {
          data?.goodsList && data?.goodsList.length > 1 ? (
            <>
              <span style={{color: '#202123'}}>&nbsp;포함&nbsp;</span>
              <span style={{color: theme.palette.primary.main}}>[총 {data?.goodsList.length}개]</span>
            </>
          ) : ''
        }
        </Typography>
        {/* {
          data?.goodsList && data?.goodsList.length > 1 ? (
            // <Box>
            <>
              <Typography variant={'Kor_18_b'} display={'inline'} sx={{color: '#202123'}}>&nbsp;포함
              
              </Typography>
              <Typography variant={'Kor_18_b'} display={'inline'} sx={{color: theme.palette.primary.main}}>&nbsp;[총 {data?.goodsList.length}개]</Typography>
            </>
            // </Box>
          ) : ''
        } */}
        </Box>
      
        <Typography variant='Kor_14_b' sx={{ textDecoration: isCancel ? 'line-through' : null }}>
          {numberComma(Number(data?.paymentAmt))}
          {(data?.goodsList[0]?.currencyCd! && data?.goodsList[0].currencyCd?.value!) || '원'}
        </Typography> 
        
        <Typography variant={'Kor_14_r'}> 
          {/* {data?.orderStateCd.value} */}
          {getOrderStateValue(data.orderStateCd?.code, data.orderStateCd?.value, data.exchangeStateCd?.code, data.cancelReqYn, data.takeBackYn)}
        </Typography>
      </Box>
    </Stack>
  )
});

export default OrderItemContent;

const multiGoodsStyle = {
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  // ml: pxToRem(10),
  // height: 90,
  width: '100%',
  // mb: 1.5,
  mt:pxToRem(3)
}

const singleGoodsStyle = {
  alignItems: 'flex-start',
  justifyContent: 'center',
  // justifyContent: 'flex-start',
  // mt: pxToRem(s10),
  height: '100%',
  width: '100%',
  
  // mb: 1.5,
}