import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import { ReactComponent as IconCandy } from 'src/assets/icons/ico-candy.svg';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { GoodsImages } from '../components/GoodsImages';
import { Card } from '../components/Card';
import { pxToRem } from 'src/theme/typography';
import { useNavigate } from 'react-router';
import { useStores } from 'src/models';
import { useCallback, useState } from 'react';
import { IconButtonCart } from '../assets/icons/IconCart';
import CAlert from 'src/components/CAlert';
import { observer } from 'mobx-react-lite';
import { useAuthContext } from 'src/auth/useAuthContext';
export interface ISuggestionProps {
  data: IGoodsModel[];
}

export const Suggestion = observer(({ data }: ISuggestionProps) => {
  // console.log('Suggestion render', JSON.stringify(data));
  const theme = useTheme();
  const navigate = useNavigate();
  const { marketStore } = useStores();

  const { isAuthenticated } = useAuthContext();
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

  const handleOnClick = (item: IGoodsModel) => {
    navigate(`/market/goods/${item.goodsSid}`);
  };

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconCandy />
          <Typography
            variant="Kor_20_b"
            component="div"
            sx={{
              textAlign: 'left',
            }}
          >
            추천 유전자
          </Typography>
        </Box>

        {/* <Button
          variant="text"
          sx={{
            color: '#a0a0a0',
            fontWeight: 500,
            fontSize: pxToRem(13),
            lineHeight: pxToRem(26),
            justifyContent: 'flex-end !important',
          }}
        >
          더보기
        </Button> */}
      </Box>

      {/* <Box sx={{ display: 'flex', gap: 2 }}> */}
      <Grid container columns={12} spacing={2}>
        {/* -----------------------------------------------------------------------------  */}
        {data.map((item) => (
          <Grid item xs={6} sm={6} md={6} lg={6} key={`suggestion-${item.goodsSid}`}>
            <Box
              sx={{
                ...gridStyles.suggestion_cartAndImage,
                border: 'solid 1px #eeeeee',
                borderRadius: 1,
              }}
            >
              <Box flex={1} sx={{}} onClick={() => handleOnClick(item)}>
                <GoodsImages goods={item} />
              </Box>
              {!item.packageYn && (
                <IconButtonCart
                  onClick={() => handleOnClickCart(item)}
                  active={!!item.inCartYn}
                  sx={gridStyles.suggestion_cartButton}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography
                variant="Kor_18_b"
                component={'p'}
                sx={gridStyles.suggestion_title}
                // onClick={onSelect}
              >
                {item.goodsNm}
              </Typography>
              <Typography variant="Kor_14_r" component={'p'} sx={gridStyles.suggestion_summary}>
                {item.goodsSummary}
              </Typography>
              <Typography variant="Kor_14_b" component={'p'} sx={gridStyles.suggestion_selPrice}>
                {item.dispDscntRate != null && item.dispDscntRate > 0 && (
                  <span style={{ color: theme.palette.primary.main, paddingRight: pxToRem(4) }}>
                    {`${item.dispDscntRate}%`}
                  </span>
                )}
                {item.goodsAmtKWN}
                {item.currencyCd?.value}
              </Typography>
              {item.goodsAmtKWN != item.priceKWN && (
                <Typography variant="Kor_12_b" component={'p'} sx={gridStyles.suggestion_oriPrice}>
                  {item.priceKWN}
                  {item.currencyCd?.value}
                </Typography>
              )}
            </Box>
          </Grid>
        ))}

        {/* -----------------------------------------------------------------------------  */}
      </Grid>
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
    </Card>
  );
});

const gridStyles = {
  suggestion_container: { display: 'flex', flexDirection: 'column' },
  suggestion_title: {
    pt: 1,
    textAlign: 'left',
  },
  suggestion_summary: {
    textAlign: 'left',
    pt: 0.5,
  },
  suggestion_selPrice: {
    textAlign: 'left',
    pt: 1,
  },
  suggestion_oriPrice: {
    textAlign: 'left',
    fontWeight: 600,
    color: '#C6C7CA',
    textDecoration: 'line-through',
  },
  suggestion_cartAndImage: {
    position: 'relative',
    border: 'solid 1px #eee',
    borderRadius: 1,
    // width: pxToRem(160),
    // height: pxToRem(160),
    overflow: 'hidden',
  },
  suggestion_cartButton: {
    position: 'absolute',
    padding: 0,
    bottom: pxToRem(10),
    right: pxToRem(10),
  },
  suggestion_productImage: { width: pxToRem(160), height: pxToRem(160), padding: 0, margin: 0 },
};
