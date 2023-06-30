import { Box, Stack, Typography, Button, Divider, Checkbox, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { CustomerHeader } from 'src/components/CustomerHeader';
import { HEADER } from 'src/config-global';
import { useNavigate } from 'react-router';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image/Image';
import { ICartModel } from 'src/models/market-store/Cart';
import { numberComma } from 'src/utils/common';
import { pxToRem } from 'src/theme/typography';

/**
 * ## GoodsItem 설명
 *
 */

export const GoodsItem = observer(() => {

  const rootStore = useStores();
  const { loadingStore, orderStore } = rootStore;
  const theme = useTheme();

  const navigate = useNavigate();
  const [openGoods, setOpenGoods] = useState(true);
  const [openGoodsTotal, setOpenGoodsTotal] = useState(false);
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const goodsList = orderStore.amtInfo.goodsList;

  const handleToggle = () => {
    setOpenGoods(!openGoods);
  };

  const handleGoodsTotal = () => {
    setOpenGoodsTotal(!openGoodsTotal);
  };

  useEffect(() => {
    const tempArr = new Array();
    goodsList.map((goods) => {
      let tempObj = {goodsSid: goods.goodsSid};
      tempArr.push(tempObj);
    });
    
    orderStore.orderItem.setProps({
      goodsList: tempArr,
    });
  },[]);

  return (
    <>
      <Stack sx={{ m: pxToRem(20) }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }} justifyContent='space-between' onClick={() => handleToggle()}>
          <Typography variant={'Kor_18_b'} sx={{ fontWeight: 600 }}>주문상품</Typography>
          {!openGoods && <Typography sx={{ fontSize: pxToRem(14), color: '#9DA0A5', ml: 'auto', mr: pxToRem(14) }}>{goodsList.length}건</Typography>}
          <Box sx={{ color: '#9DA0A5', mt: 0.5 }}> 
            {openGoods ? <ArrowUpIcon style={{ cursor: 'pointer' }}/> : <ArrowDownIcon style={{ cursor: 'pointer' }}/>}
          </Box>
        </Box>

        {openGoods && 
          (
            <Stack>
              {openGoodsTotal
                ? (<Stack>
                    {goodsList.map((goods:ICartModel, index: number) => (
                      <Stack key={index}>
                        <Stack direction={'row'} sx={{ display: 'flex', borderBottom: goodsList.length-1 != index ? '1px solid #EEEEEE' : null }} >
                          <Box sx={{ display: 'flex', my: 2 }}>
                            <Image
                              src={ goods?.img1Path ? (REACT_APP_IMAGE_STORAGE + goods?.img1Path) : '/assets/default-goods.svg'}
                              sx={{ borderRadius: 1, width: 90, height: 90, border: '1px solid', borderColor: '#F5F5F5', mr: pxToRem(11) }}
                              onError={(e: any) => {
                                e.target.src = '/assets/default-goods.svg';
                              }}
                            />
                          </Box>

                          <Box sx={{ textAlign: 'left', my: 2 }}>
                            <Typography variant={'h5'} sx={{ fontWeight: 600 }}>{goods.goodsNm}</Typography>
                            {goods.goodsSummary && <Typography sx={{ fontSize: pxToRem(14), color: '#202123', mb: 1 }}>{goods.goodsSummary}</Typography>}
                            <Stack direction={'row'} spacing={1}>
                              { goods.dispDscntRate != null && goods.dispDscntRate > 0 && (
                                <Typography variant={'subtitle2'} sx={{ color: '#FF7F3F' }}> {goods.dispDscntRate}% </Typography>
                              )}
                              <Typography variant={'subtitle2'}>{numberComma(Number(goods.goodsAmt))}{goods.currencyCd?.value}</Typography>
                            </Stack>
                            { goods.goodsAmt != goods.price && goods.price != null && goods.price > 0 && (
                              <Typography variant={'caption'} sx={{ color: '#C6C7CA', textDecoration: 'line-through' }}>
                                {numberComma(Number(goods.price))}{goods.currencyCd?.value}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack> 
                )
                : (goodsList.length > 0
                    && (
                        <Stack direction={'row'} sx={{ display: 'flex' }} >
                          <Box sx={{ display: 'flex', my: 2 }}>
                            <Image
                              src={ goodsList[0]?.img1Path ? (REACT_APP_IMAGE_STORAGE + goodsList[0]?.img1Path) : '/assets/default-goods.svg'}
                              sx={{ borderRadius: 1, width: 90, height: 90, border: '1px solid', borderColor: '#F5F5F5', mr: pxToRem(11) }}
                              onError={(e: any) => {
                                e.target.src = '/assets/default-goods.svg';
                              }}
                            />
                          </Box>
      
                          <Box sx={{ textAlign: 'left', my: 2 }}>
                            <Typography variant={'h5'} sx={{ fontWeight: 600 }}>{goodsList[0].goodsNm}</Typography>
                            {goodsList[0].goodsSummary && <Typography sx={{ fontSize: pxToRem(14), color: '#202123', mb: 1 }}>{goodsList[0].goodsSummary}</Typography>}
                            <Stack direction={'row'} spacing={1}>
                              { goodsList[0].dispDscntRate != null && goodsList[0].dispDscntRate > 0 && (
                                <Typography variant={'subtitle2'} sx={{ color: '#FF7F3F' }}> {goodsList[0].dispDscntRate}% </Typography>
                              )}
                              <Typography variant={'subtitle2'}>{numberComma(Number(goodsList[0].goodsAmt))}{goodsList[0].currencyCd?.value}</Typography>
                            </Stack>

                            { goodsList[0].goodsAmt != goodsList[0].price && goodsList[0].price && (
                              <Typography variant={'caption'} sx={{ color: '#C6C7CA', textDecoration: 'line-through' }}>
                                {numberComma(Number(goodsList[0].price))}{goodsList[0].currencyCd?.value}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                    )
                )
              }
              
              {goodsList.length > 1 &&
                (
                  <Stack>
                    <Divider sx={{ borderColor: '#EEEEEE', borderWidth: 0.5, borderStyle: 'dashed' }} />
                    <Box sx={{ display: 'flex', py: pxToRem(13) }} justifyContent='center' onClick={() => handleGoodsTotal()}>
                      <Typography variant='Kor_14_b'>총 <Box component='span' sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>{goodsList.length}건 </Box> 
                        전체보기 {openGoodsTotal && ' 닫기'}
                      </Typography>
                      {openGoodsTotal ? <ArrowUpIcon style={{ cursor: 'pointer' }}/>: <ArrowDownIcon style={{ cursor: 'pointer' }}/>}
                    </Box>
                  </Stack>
                )
              }
            </Stack>
          )
        }
      </Stack> 
      <Divider sx={{ borderColor: '#FAFAFA' }}/>
    </>
  );
});

export default GoodsItem;