import Box from '@mui/material/Box';
import { Typography, Stack } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { useStores } from '../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { m } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import { numberComma } from 'src/utils/common';
import { useScrollable } from 'src/hooks/useScrollable';

/**
 * ## OrderItems 설명
 *
 */

export const OrderItems = observer(() => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const sliderRef = useRef<any>();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  const dragRef = useRef<HTMLDivElement>(null);
  useScrollable(dragRef, 'x');

  // const transition = {
  //   repeatType: 'loop',
  //   ease: 'linear',
  //   duration: 'none',
  //   repeat: Infinity,
  // } as const;

  return (
    <>
      {
        (orderHistoryStore.orderHistory?.goodsList && orderHistoryStore.orderHistory?.goodsList.length > 1) &&
        <Box
          sx={{
            textAlign: 'left',
            mt:pxToRem(23),
            mb: pxToRem(23),
          }}
        >
          <Typography
            variant={'Kor_16_b'}
            sx={{
              textAlign: 'left',
              color: '#202123',
              mx: pxToRem(20),
            }}
          >
            주문상품 전체보기
          </Typography>

          <Box 
            sx={{ 
              width: '100%', 
              // overflowX: 'scroll',
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none',
              }, 
              mr:'0!important',
              
            }}
            ref={dragRef}
          > 
            <Box>
                <Stack
                  direction={'row'}
                  spacing={1.5}
                  component={m.div}
                >
                  {orderHistoryStore.orderHistory?.goodsList.map((item: any, index: number) => {
                    return (
                      <Stack
                        key={`${index}`}
                        minWidth={pxToRem(80)}
                        sx={{
                          textAlign: 'center',
                          my: `${pxToRem(8)} !important`,
                          alignItems: 'center',
                          borderRadius: 2,
                          ml: index == 0 ? pxToRem(20) : 0,
                          cursor:'pointer'
                        }}
                        // onClick={() => {
                        //   navigate(`/market/goods/${item.goodsSid}`);
                        // }}
                      >
                        <Box sx={{ textAlign: 'left' }}
                          onClick={() => {
                            navigate(`/market/goods/${item.goodsSid}`);
                          }}
                        >
                          <Box
                            component={'img'}
                            src={
                              item.img1Path
                              ? REACT_APP_IMAGE_STORAGE + (item.img1Path)
                              : '/assets/default-goods.svg'
                            }
                            sx={{
                              width: pxToRem(80),
                              height: pxToRem(80),
                              border: '1px solid #F5F5F5',
                              borderRadius: pxToRem(10),
                            }}
                            onError={(e: any) => {
                              e.target.src = '/assets/default-goods.svg';
                            }}
                            draggable={false}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              // whiteSpace: 'nowrap',
                              whiteSpace: 'normal',
                              width:'5rem'
                            }}
                          >
                            <Typography variant={'Kor_12_r'} color={'#202123'} sx={{ mt: 0, pt: 1 }}>
                              {item.goodsNm}
                            </Typography>
                            <Typography variant={'Kor_12_b'}>
                              {numberComma(Number(item.goodsAmt))}{item.currencyCd.value}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    );
                  })}
                </Stack>
            </Box>
          </Box>
        </Box>
      }
    </>
  );
});
export default OrderItems;

const SliderStyle = styled('div')({
  '.slick-slide': {
    padding: '50px 80px 50px 80px',
    display: 'flex !important',
    justifyContent: 'center !important',
  },
  '.slick-dots li': {
    margin: 0,
  },
  '.slick-dots li button:before': {
    opacity: 100,
    color: '#EEEEEE',
  },
  '.slick-dots li.slick-active button:before': {
    opacity: 100,
    color: '#FF7F3F',
  },
});
