import { Box, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useStores } from 'src/models';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { pxToRem } from 'src/theme/typography';
import { ReactComponent as IconDna } from '../assets/icons/ico-dna.svg';
import { GoodsImages } from '../components/GoodsImages';

export interface IGoodsMainPackageListProps {}

export const GoodsMainPackageList = observer(({}: IGoodsMainPackageListProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { marketStore } = useStores();
  const [data, setData] = useState<IGoodsModel[]>([]);

  useEffect(() => {
    if (marketStore.mainPackage.length > 0) {
      setData(marketStore.mainPackage);
    }
  }, [marketStore.mainPackage, marketStore.mainPackage.length]);

  const handleOnClick = useCallback(
    (data: IGoodsModel) => {
      navigate(`/market/goods/${data.goodsSid!}`);
    },
    [navigate],
  );

  return (
    <>
      {data.length > 0 && (
        <Box id="market-main--dna-set">
          <Box sx={{ display: 'flex', gap: 1, mt: 4, alignItems: 'center' }}>
            <IconDna width={24} height={24} />
            <Typography variant="Kor_22_b" sx={{ textAlign: 'left' }}>
              DNA도 <span style={{ color: theme.palette.primary.main }}>#셋뚜 셋뚜</span>
            </Typography>
          </Box>
          <Box sx={{ gap: 2, mt: 2.5 }}>
            {/* ======================================================================== */}
            {data.map((item) => (
              <Box
                key={`dna-package--${item.goodsSid}`}
                sx={{
                  display: 'flex',
                  borderBottom: 'solid 1px #eeeeee',
                  mb: 2,
                  '&:last-child': { border: 0 },
                }}
                onClick={() => {
                  handleOnClick(item);
                }}
              >
                <Box
                  sx={{
                    width: pxToRem(160),
                    height: pxToRem(160),
                    border: 'solid 1px #eeeeee',
                    borderRadius: 1,
                  }}
                >
                  <GoodsImages sx={{ width: pxToRem(160), height: pxToRem(160) }} goods={item} />
                </Box>
                <Box sx={{ flex: 1, pl: 2, pt: 1.5, pb: 1.5, pr: 0 }}>
                  <Typography variant="Kor_18_b" component="p" sx={{ textAlign: 'left', pb: 0.5 }}>
                    {item.goodsNm}
                  </Typography>
                  <Typography variant="Kor_14_r" component="p" sx={{ textAlign: 'left' }}>
                    {item.goodsSummary}
                  </Typography>
                </Box>
              </Box>
            ))}
            {/* ======================================================================== */}
          </Box>
        </Box>
      )}
    </>
  );
});
