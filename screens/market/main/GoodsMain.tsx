import { Box, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { GoodsMainGoodsList } from './GoodsMainGoodsList';
import { GoodsMainPackageList } from './GoodsMainPackageList';
import { RecommendDna } from './RecommendDna';
import { Slider } from './Slider';

export interface IGoodsMainProps {}

export const GoodsMain = observer(({}: IGoodsMainProps) => {
  const theme = useTheme();

  return (
    <Box id="market-main--container" sx={{ overflow: 'hidden', p: 2.5, width: '100%' }}>
      <RecommendDna />

      <Box sx={{ display: 'flex', height: theme.spacing(10), width: '100%', mt: 5 }}>
        <Box id="market-main--banner-top" sx={{ flex: 1, width: '400%', display: 'flex' }}>
          <Slider direction="left" rotate={-3} />
        </Box>
      </Box>

      <GoodsMainGoodsList />

      <Box sx={{ display: 'flex', height: theme.spacing(10), width: '100%', mt: 5 }}>
        <Box id="market-main--banner-bottom" sx={{ flex: 1, width: '400%', display: 'flex' }}>
          <Slider direction="right" rotate={3} />
        </Box>
      </Box>

      <GoodsMainPackageList />
    </Box>
  );
});
