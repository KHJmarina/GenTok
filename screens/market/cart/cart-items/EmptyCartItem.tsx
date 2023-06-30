import { Box, Stack, Typography, Divider, Button, Checkbox, useTheme } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from 'react';
import { useStores } from "src/models/root-store/root-store-context";
import { useNavigate } from 'react-router';
import Iconify from 'src/components/iconify';
import { ReactComponent as IconNoCandy } from 'src/assets/icons/ico-cart-no-candy.svg';
import { ReactComponent as IconCandy } from 'src/assets/icons/ico-candy.svg';
import { PATH_ROOT } from 'src/routes/paths';
import { CallApiToStore } from 'src/utils/common';
import { pxToRem } from 'src/theme/typography';
import { useScrollable } from 'src/hooks/useScrollable';
import { RecentCandyItem } from './RecentCandyItem';

/**
 * ## EmptyCartItem 설명
 *
 */

export const EmptyCartItem = observer(() => {

  const rootStore = useStores();
  const { loadingStore, marketStore } = rootStore;
  const navigate = useNavigate();
  const theme = useTheme();

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
    <Stack sx={{ m: `${pxToRem(9)} 0 0 0 !important` }}>
      <Stack
        direction={'row'}
        sx={{ m: pxToRem(20), mt: 0, alignItems: 'center' }}
        justifyContent="space-between"
      >
        <Box sx={{ display: 'flex' }} alignItems="center">
          <Checkbox
            icon={
              <Iconify
                icon={'material-symbols:check-circle-outline-rounded'}
                color={'#DFE0E2'}
              />
            }
            checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
            disabled={true}
            disableRipple
            sx={{ m: 0 }}
          />
          <Typography sx={{ lingHeight: pxToRem(24) }}> 전체선택 </Typography>
        </Box>

        <Typography variant={'Kor_14_b'} sx={{ lingHeight: pxToRem(22) }}> 선택삭제 </Typography>
      </Stack>

      <Stack sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box 
          sx={{
            height: pxToRem(300),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mb: pxToRem(20),
          }}
        >
          <IconNoCandy fill={'#9DA0A5'} width={24} height={24} style={{ marginBottom: pxToRem(20)}} />
          <Typography variant={'Kor_16_r'} color={'#C6C7CA'} sx={{ mb: pxToRem(30) }}> 상품이 없습니다 </Typography>

          <Button
            id={`bnt-cart-goMarket`}
            variant='outlined'
            sx={{ 
              borderRadius: pxToRem(500), 
              color: 'primary', 
              width: pxToRem(185), 
              height: pxToRem(43), 
              fontSize: pxToRem(16), 
              fontWeight: 500,
              lineHeight: pxToRem(19.09),
              '&:hover': {
                background: 'none',
                color:'#FF5D0C', 
                border:'1px solid #FF5D0C'
              },
            }}
            onClick ={ () => {navigate(PATH_ROOT.market.root)} }>
            상품 담으러 가기
          </Button>
        </Box>
        <Divider sx={{ borderColor: '#FAFAFA', borderWidth: 4, mb: pxToRem(40) }} />

        <Box sx={{ display: 'flex', alignItems: 'center', mx: pxToRem(20), mb: pxToRem(11) }}>
          <IconCandy />
          <Typography variant={'Kor_20_b'} sx={{ ml: pxToRem(8) }}> 최근 본 상품 </Typography>
        </Box>
        { marketStore.recentCandyStore.list?.length > 0
          ? <RecentCandyItem recentCandyList={marketStore.recentCandyStore.list}/>
          : (
            <Box 
              sx={{
                height: pxToRem(300),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mb: pxToRem(20),
              }}
            >
              <IconNoCandy fill={'#9DA0A5'} width={24} height={24} style={{ marginBottom: pxToRem(20)}} />
              <Typography variant={'Kor_16_r'} color={'#C6C7CA'} sx={{ mb: pxToRem(30) }}> 최근 본 상품이 없습니다 </Typography>
            </Box>
          )
        }
      </Stack> 
    </Stack>
  );
});

export default EmptyCartItem;