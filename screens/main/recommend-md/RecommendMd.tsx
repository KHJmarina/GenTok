import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"        
import { Typography, useTheme, Stack,  } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import { PATH_ROOT } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import { useAuthContext } from 'src/auth/useAuthContext';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { IconButtonCart } from 'src/screens/market/assets/icons/IconCart';
import { GoodsImages } from 'src/screens/market/components/GoodsImages';
import { toJS } from 'mobx';

/**
 * ## RecommendMd 설명
 *
 */
export const RecommendMd = observer(() => {

  const rootStore = useStores();
  const { loadingStore, marketStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [data, setData] = useState<IGoodsModel[]>([]);
  
  useEffect(() => {
    if (marketStore.mainPackage.length > 0) {
      setData(marketStore.mainPackage.slice(0,2));
    }
  }, [marketStore.mainPackage, marketStore.mainPackage.length]);
  

  const handleOnClickCart = useCallback(
    (data: IGoodsModel) => {
      if (!isAuthenticated) {
        setAlertMessage('로그인 후 이용 가능합니다.');
        setAlertOpen(true);
        return;
      }

      if (data.saleStateCd?.code !== 200102) {
        setAlertMessage('판매중인 상품이 아닙니다.');
        setAlertOpen(true);
        return;
      }
      
      if (!!data.purchaseYn) {
        setAlertMessage('이미 구매한 상품입니다.');
        setAlertOpen(true);
        return;
      }
      marketStore?.toggleGoodsToCart(data);
    },
    [isAuthenticated, marketStore],
  );
  
  const handleOnSelect = useCallback(
    (data: IGoodsModel) => {
      navigate(`/market/goods/${data.goodsSid!}`);
    },
    [navigate],
  );

  return (
    <>
      <Box id="market-main--popular">
      {/* 제목 */}
      <Stack
          direction={'row'}
          justifyContent={'space-between'}
          sx={{ px:pxToRem(20), pt:pxToRem(50), textAlign:'left', alignItems: 'end'  }}
        >
          <Typography variant={'Kor_22_b'} sx={{ display: 'flex' }}>
          <Typography variant={'Kor_22_b'}>MD추천<br/>패키지 기획 특가</Typography>
          </Typography>

          <Box onClick={() => navigate(PATH_ROOT.market.list)} sx={{ pb: '3px' }}>
            <Typography variant={'Kor_13_r'} color={'#AAAAAA'} sx={{ cursor: 'pointer' }}>
              더보기
            </Typography>
          </Box>
        </Stack>

        {/* 내용 */}
      <Box sx={{ mt: 1, flexGrow: 1, flex: 1, p:pxToRem(20) }}>
        <Grid container columns={12} spacing={2}>
          {/* -----------------------------------------------------------------------------  */}
          {data.length === 0 && (
            <Grid item xs={12} sm={12} md={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="Kor_18_b">상품이 없습니다.</Typography>
              </Box>
            </Grid>
          )}
          {data.map((item: any) => (
            <Grid item xs={6} sm={6} md={6} key={`suggestion-${item.goodsSid}`}>
              <Box sx={gridStyles.suggestion_cartAndImage}>
                <Box onClick={() => handleOnSelect(item)} flex={1} sx={{}}>
                  <GoodsImages goods={item} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography
                  variant="Kor_18_b"
                  component={'div'}
                  sx={gridStyles.suggestion_title}
                  // onClick={onSelect}
                >
                  {item.goodsNm}
                </Typography>
                <Typography variant="Kor_14_r" component={'div'} sx={gridStyles.suggestion_summary}>
                  {item.goodsSummary} 
                </Typography>
                <Typography
                  variant="Kor_14_b"
                  component={'div'}
                  sx={gridStyles.suggestion_selPrice}
                >
                  {item.dispDscntRate != null && item.dispDscntRate > 0 && (
                    <span style={{ color: theme.palette.primary.main, paddingRight: pxToRem(4) }}>
                      {item.dispDscntRate}% 
                    </span>
                  )}
                  {item.goodsAmtKWN}
                  {item.currencyCd?.value}
                </Typography>
                {item.goodsAmtKWN != item.priceKWN && (
                  <Typography
                    variant="Kor_12_b"
                    component={'div'}
                    sx={gridStyles.suggestion_oriPrice}
                  >
                    {item.priceKWN}
                    {item.currencyCd?.value}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
          {/* -----------------------------------------------------------------------------  */}
        </Grid>
      </Box>
    </Box>
    </>
  );
});

export default RecommendMd;

const gridStyles = {
  suggestion_title: {
    pt: 1,
    textAlign:'left',
    cursor: 'pointer'
  },
  suggestion_summary: {
    pt: 0.5,
    textAlign: 'left',
  },
  suggestion_selPrice: {
    pt: 1,
  },
  suggestion_oriPrice: {
    fontWeight: 600,
    color: '#C6C7CA',
    textDecoration: 'line-through',
  },
  suggestion_cartAndImage: {
    position: 'relative',
    border: 'solid 1px #eee',
    borderRadius: 1,
    overflow: 'hidden',
    minHeight: pxToRem(160),
    cursor: 'pointer',
  },
  suggestion_cartButton: {
    position: 'absolute',
    bottom: pxToRem(10),
    right: pxToRem(10),
    padding: 0,
    cursor: 'pointer',
  },
  suggestion_productImage: { width: pxToRem(160), height: pxToRem(160), padding: 0, margin: 0 },
};