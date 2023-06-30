import { Box, Grid, Paper, styled, useTheme, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { pxToRem } from 'src/theme/typography';
import { GoodsImages } from '../components/GoodsImages';
import { textAlign } from '@mui/system';

export interface IPackageItemViewProps {
  data: IGoodsModel;
  onClick: () => void;
}

export const PackageItemView = observer(({ data, onClick }: IPackageItemViewProps) => {
  const theme = useTheme();

  return (
    <Grid item sm={6} xs={6} md={6}>
      <Item theme={theme}>
        <Box className="image">
          <Box onClick={onClick} flex={1}>
            <GoodsImages goods={data} />
          </Box>
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
            <></>
          )}
        </Box>

        <Box sx={{ minHeight: 13 * 8, textAlign: 'left', mt: 1 }}>
          <Typography variant="Kor_18_b" component="p" className={'title'} onClick={onClick}>
            {data.goodsNm}
          </Typography>
          <Typography variant="Kor_14_r" component="p" className={'summary'}>
            {data.goodsSummary}
          </Typography>
          <Box sx={{ opacity: data.purchaseYn || data.saleStateCd?.code !== 200102 ? 0.2 : 1 }}>
            <Typography variant="Kor_14_b" component="p" className={'selPrice'}>
              {data.dispDscntRate != null && data.dispDscntRate > 0 && (
                <span style={{ color: theme.palette.primary.main, paddingRight: pxToRem(4) }}>
                  {data.dispDscntRate}%
                </span>
              )}
              {data.goodsAmtKWN}
              {data.currencyCd?.value}
            </Typography>
            {data.goodsAmtKWN != data.priceKWN && (
              <Typography variant="Kor_12_b" component="p" className={'oriPrice'}>
                {data.priceKWN}
                {data.currencyCd?.value}
              </Typography>
            )}
          </Box>
        </Box>
      </Item>
    </Grid>
  );
});

const Item = styled(Paper)(({ theme }) => ({
  textAlign: 'center',
  border: 'solid 1px transparent',
  display: 'flex',
  flexDirection: 'column',

  // marginBottom: pxToRem(4),
  paddingBottom: pxToRem(4),

  '.image': {
    position: 'relative',
    border: 'solid 1px #eee',
    borderRadius: pxToRem(8),
    overflow: 'hidden',
    minHeight: pxToRem(160),
  },
  '.title': { pt: 1, textAlign: 'left !important' },
  '.summary': { pt: 0, lineHeight: pxToRem(22) },
  '.selPrice': { pt: 1, color: '#000000', textAlign: 'left !important' },
  '.oriPrice': { color: '#C6C7CA', textDecoration: 'line-through' },
}));
