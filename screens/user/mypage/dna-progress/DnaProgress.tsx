import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme, Typography, Stack } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { ReactComponent as ExclamMark } from 'src/assets/icons/icon-exclamationMark.svg';
import { ReactComponent as ErrorOutline } from 'src/assets/icons/error_outline.svg';
import { pxToRem } from 'src/theme/typography';

/**
 * ## DnaProgress 설명
 *
 */
interface Props {
  cnt?: number;
  totalCnt?: number;
}

export const DnaProgress = observer(({
  cnt = 0,
  totalCnt = 73,
}: Props) => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: pxToRem(12),
    borderRadius: pxToRem(100),
    [`&.${linearProgressClasses.colorPrimary}`]: {
      // backgroundColor: alpha(theme.palette.mode === 'light' ? theme.palette.primary.main : '#308fe8', 0.5),
      backgroundColor: theme.palette.mode === 'light' ? '#FAFAFA' : '#308fe8',
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: pxToRem(100),
      backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : '#308fe8',
    },
  }));

  const progressStyle = theme.palette.mode === 'light' ? '#C6C7CA' : '#FFFFFF';

  return (
    <>
      {/* <Box sx={{ flexGrow: 1, width: '100%' }}> */}
      <Stack zIndex={1} sx={{ textAlign: 'left', width: '100%' }}>
        <BorderLinearProgress variant="determinate" value={Number((cnt / totalCnt * 100).toFixed(2))} />
        <Stack direction="row" justifyContent={'space-between'} sx={{ pt: 1 }}>
          <Typography variant={'Kor_14_r'} display={'inline'} color={progressStyle} sx={{ mt: 0 }}><ErrorOutline fill={progressStyle} style={{ marginBottom: -3.5 }} /> 완성까지 
            <Typography variant={'Kor_14_b'} display={'inline'} color={progressStyle} sx={{ mt: 0 }}> {totalCnt - cnt}개</Typography>
            <Typography variant={'Kor_14_r'} display={'inline'} color={progressStyle} sx={{ mt: 0 }}> 남았어요!</Typography>
          </Typography>
        </Stack>
      </Stack>
      {/* </Box> */}
    </>
  );
});

export default DnaProgress;