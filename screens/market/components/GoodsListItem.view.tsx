import { Box, Grid, IconButton, Paper, styled, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { pxToRem } from 'src/theme/typography';
import { IconButtonCart } from '../assets/icons/IconCart';
import { IconGoodsListCheck } from '../assets/icons/IconGoodsListCheck';
import { GoodsImages } from './GoodsImages';

export interface IGoodsListItemViewProps {
  data: IGoodsModel;
  listType: 'grid' | 'list';
  onToggleCart: () => void;
  onClick: () => void; // 상품 클릭
  onToggle: () => void; // 상품 선택 (체크박스)
}

export const GoodsListItemView = observer(
  ({ data, listType, onToggleCart, onClick, onToggle }: IGoodsListItemViewProps) => {
    const theme = useTheme();
    const [xs, sm, md] = useMemo(
      () => (listType === 'list' ? [12, 12, 12] : [6, 6, 6]),
      [listType],
    );
    return (
      <Grid item sm={sm} xs={xs} md={md}>
        <Item sx={[gridStyles.goodsDetail_container]}>
          <Box sx={gridStyles.goodsDetail_cartAndImage}>
            <Box onClick={onClick} flex={1}>
              <GoodsImages goods={data} />
            </Box>
            <IconButton
              sx={{ position: 'absolute', top: '10px', left: '10px', p: 0 }}
              onClick={onToggle}
            >
              <IconGoodsListCheck checked={data.isSelected} />
            </IconButton>

            {data.purchaseYn || data.saleStateCd?.code !== 200102 ? (
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
                }}
              >
                <Typography variant="Kor_12_b" component="p" sx={{ color: '#ffffff' }}>
                  {data.purchaseYn ? '구매완료' : '구매불가'}
                </Typography>
              </Box>
            ) : (
              !data.packageYn && (
                <IconButtonCart
                  onClick={onToggleCart}
                  active={data.inCartYn!}
                  sx={gridStyles.goodsDetail_CartButton}
                />
              )
            )}
          </Box>
          <Box sx={{ minHeight: 13 * 8, textAlign: 'left' }}>
            <Typography
              variant="Kor_18_b"
              component="p"
              sx={gridStyles.goodsDetail_title}
              onClick={onClick}
            >
              {data.goodsNm}
            </Typography>
            <Typography variant="Kor_14_r" component="p" sx={gridStyles.goodsDetail_summary}>
              {data.goodsSummary}
            </Typography>
            <Box sx={{ opacity: data.purchaseYn || data.saleStateCd?.code !== 200102 ? 0.2 : 1 }}>
              <Typography variant="Kor_14_b" component="p" sx={gridStyles.goodsDetail_selPrice}>
                {data.dispDscntRate != null && data.dispDscntRate > 0 && (
                  <span style={{ color: theme.palette.primary.main, paddingRight: pxToRem(4) }}>
                    {data.dispDscntRate}%
                  </span>
                )}
                {data.goodsAmtKWN}
                {data.currencyCd?.value}
              </Typography>
              {data.goodsAmtKWN != data.priceKWN && (
                <Typography variant="Kor_12_b" component="p" sx={gridStyles.goodsDetail_oriPrice}>
                  {data.priceKWN}
                  {data.currencyCd?.value}
                </Typography>
              )}
            </Box>
          </Box>
        </Item>
      </Grid>
    );
  },
);

const Item = styled(Paper)(({ theme }) => ({
  textAlign: 'center',
  border: 'solid 1px transparent',
  display: 'flex',
  flexDirection: 'column',

  // marginBottom: pxToRem(4),
  paddingBottom: pxToRem(4),
}));

const gridStyles = {
  goodsDetail_container: {},
  goodsDetail_title: {
    pt: 1,
    textAlign: 'left !important',
  },
  goodsDetail_summary: {
    pt: 0,
    lineHeight: pxToRem(22),
  },
  goodsDetail_selPrice: {
    pt: 1,
    color: '#000000',
    textAlign: 'left',
  },
  goodsDetail_oriPrice: {
    color: '#C6C7CA',
    textDecoration: 'line-through',
  },
  goodsDetail_cartAndImage: {
    position: 'relative',
    border: 'solid 1px #eee',
    borderRadius: 1,
    overflow: 'hidden',
    minHeight: pxToRem(160),
  },
  goodsDetail_CartButton: {
    position: 'absolute',
    bottom: pxToRem(10),
    right: pxToRem(10),
    padding: 0,
  },
  goodsDetail_productImage: { width: pxToRem(160), height: pxToRem(160), padding: 0, margin: 0 },
};
