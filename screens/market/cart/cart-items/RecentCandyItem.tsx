import { Box, Stack, Typography, Container } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState, useRef } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useNavigate } from 'react-router';
import Image from 'src/components/image/Image';
import { IconButtonCart } from 'src/screens/market/assets/icons/IconCart';
import { m } from 'framer-motion';
import { MotionContainer, varFade } from 'src/components/animate';
import { CallApiToStore } from 'src/utils/common';
import { IGoodsModel } from 'src/models/market-store/Goods'
import { pxToRem } from 'src/theme/typography';
import { useScrollable } from 'src/hooks/useScrollable';

/**
 * ## RecentCandyItem 설명
 *
 */

interface Props {
  recentCandyList: IGoodsModel[];
}
export const RecentCandyItem = observer(({recentCandyList}: Props) => {

  const rootStore = useStores();
  const { loadingStore, marketStore } = rootStore;
  const navigate = useNavigate();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  const handleChangeInCart = (goods: IGoodsModel) => {
    CallApiToStore(marketStore.cartStore.addGoods(goods.goodsSid!), 'api', loadingStore)
    .then(() => { 
      goods.setProps({ inCartYn: !goods.inCartYn });
    })
    .catch((e) => {
      console.log(e);
    });
  };

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 'none',
    repeat: Infinity,
  } as const;

  const dragRef = useRef<HTMLDivElement>(null);
  useScrollable(dragRef, 'x');
  
  useEffect(() => {
    CallApiToStore(marketStore.recentCandyStore.search(), 'api', loadingStore)
      .then(() => { 
        // console.log(JSON.stringify(marketStore.recentCandyStore));
      })
      .catch((e) => {
        console.log(e);
      });
  },[marketStore]);

  return (
    <>
      { (!recentCandyList ||recentCandyList?.length != 0) && (
          <Box sx={{ px: pxToRem(20), width: '100%', cursor:'pointer' }}>
            <Container 
              component={MotionContainer} 
              sx={{
                height: 1,
                width: '100%',
                px: '0 !important',
              }}
            >
              <Stack
                component={m.div}
                variants={varFade().in}
                sx={{
                  width: '100%',
                  overflowX: 'scroll',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                  pb: 1.5,
                }}
                ref={dragRef}
              >
                <Stack
                  direction={'row'} spacing={2}
                  component={m.div}
                  animate={{ x: ['0%', '-100%'] }}
                  transition={transition}
                >
                  {recentCandyList.map((candy, index) => {
                    return(
                      <Stack key={index}>
                        <Box sx={{ position:'relative', mb: pxToRem(8), width: 170, height: 170 }}>
                          <Image 
                            src={candy?.img1Path ? (REACT_APP_IMAGE_STORAGE + candy?.img1Path) : '/assets/default-goods.svg'} 
                            ratio={'1/1'} 
                            sx={{ borderRadius: 2 , border: '1px solid #F5F5F5', minWidth: pxToRem(170), height: pxToRem(170) }}
                            onError={(e: any) => {
                              e.target.src = '/assets/default-goods.svg';
                            }}
                            onClick={() => {navigate(`/market/goods/${candy.goodsSid!}`)}}
                            draggable={false} 
                          />    
                          {candy.purchaseYn || candy.saleStateCd?.code !== 200102 ? (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: '#C6C7CA',
                                height: pxToRem(32),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: pxToRem(8),
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                              }}
                            >
                              <Typography variant="Kor_12_b" component="p" sx={{ color: '#FFFFFF' }}>
                                {candy.purchaseYn ? '구매완료' : '구매불가'}
                              </Typography>
                            </Box>
                          ) 
                          : (
                            !candy.packageYn && (
                              <IconButtonCart
                                onClick={() => {handleChangeInCart(candy)}}
                                active={candy.inCartYn!}
                                sx={{ position: 'absolute', bottom: pxToRem(10), right: pxToRem(10), padding: 0 }}
                              />
                            )
                          )}
                        </Box>

                        <Stack sx ={{ textAlign : 'left', width: 160 }} onClick={() => {navigate(`/market/goods/${candy.goodsSid!}`)}}>
                          <Typography variant={'Kor_18_b'} sx={{ flexGrow: 1 }}>{candy.goodsNm || ''} </Typography>
                          <Typography variant={'Kor_14_r'} sx={{ mb: pxToRem(8) }}> {candy?.goodsSummary || ''} </Typography>
                          <Stack direction={'row'} spacing={1}>
                            {candy?.dispDscntRate != null && candy?.dispDscntRate > 0 && (
                              <Typography variant={'Eng_14_b'} sx={{ color: '#FF7F3F' }}> {candy?.dispDscntRate || ''}% </Typography>
                            )}
                            {candy?.goodsAmt && (
                              <Typography variant={'Kor_14_b'}> {candy?.goodsAmt}{candy.currencyCd?.value} </Typography>
                            )}
                          </Stack>
                          {candy?.goodsAmt != candy?.price && candy?.price && (
                            <Typography sx={{ fontSize: pxToRem(12), color: '#C6C7CA', textDecoration: 'line-through', lineHeight: pxToRem(14.32) }}> {candy?.price || ''}{candy.currencyCd?.value} </Typography>
                          )}
                        </Stack>
                      </Stack>
                    )
                  })}
                </Stack>
              </Stack>
            </Container>
          </Box>
        )
      }
    </>
  );
});

export default RecentCandyItem;