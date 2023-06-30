import { Box, Grid, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useStores } from 'src/models';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { ReactComponent as IconTimer } from '../assets/icons/ico-timer.svg';
import { GoodsImages } from '../components/GoodsImages';
import { IconButtonCart } from '../assets/icons/IconCart';
import { pxToRem } from 'src/theme/typography';
import { useNavigate } from 'react-router';
import CAlert from 'src/components/CAlert';
import { useAuthContext } from 'src/auth/useAuthContext';

export interface IGoodsMainGoodsListProps {}

export const GoodsMainGoodsList = observer(({}: IGoodsMainGoodsListProps) => {
  const navigate = useNavigate();
  const { marketStore } = useStores();
  const theme = useTheme();
  const [data, setData] = useState<IGoodsModel[]>([]);
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (marketStore.mainGoods.length > 0) {
      setData(marketStore.mainGoods);
    }
  }, [marketStore.mainGoods, marketStore.mainGoods.length]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
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
    <Box id="market-main--popular">
      <Box sx={{ display: 'flex', gap: 1, mt: 5, alignItems: 'center' }}>
        <IconTimer width={24} height={24} />
        <Typography variant="Kor_22_b">
          지금 이 순간 <span style={{ color: theme.palette.primary.main }}>#많이 찾는</span>
        </Typography>
      </Box>
      <Box sx={{ mt: 2, flexGrow: 1, flex: 1 }}>
        <Grid container columns={12} spacing={2}>
          {/* -----------------------------------------------------------------------------  */}
          {data.length === 0 && (
            <Grid item xs={12} sm={12} md={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="Kor_18_b">상품이 없습니다.</Typography>
              </Box>
            </Grid>
          )}
          {data.map((item) => (
            <Grid item xs={6} sm={6} md={6} key={`suggestion-${item.goodsSid}`}>
              <Box sx={gridStyles.suggestion_cartAndImage}>
                <Box onClick={() => handleOnSelect(item)} flex={1} sx={{}}>
                  <GoodsImages goods={item} />
                </Box>
                {!item.packageYn && (
                  <IconButtonCart
                    id="btn-market-main--popular-cart-button"
                    onClick={() => handleOnClickCart(item)}
                    active={!!item.inCartYn}
                    sx={gridStyles.suggestion_cartButton}
                  />
                )}
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
      <CAlert
        isAlertOpen={alertOpen}
        alertCategory={'f2d'}
        alertTitle={alertMessage}
        hasCancelButton={false}
        handleAlertClose={() => {
          setAlertOpen(false);
        }}
        // callBack={onDelete}
      ></CAlert>
    </Box>
  );
});

const gridStyles = {
  suggestion_title: {
    pt: 1,
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
  },
  suggestion_cartButton: {
    position: 'absolute',
    bottom: pxToRem(10),
    right: pxToRem(10),
    padding: 0,
  },
  suggestion_productImage: { width: pxToRem(160), height: pxToRem(160), padding: 0, margin: 0 },
};
