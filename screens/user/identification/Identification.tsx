import { Fab, Slide, Stack, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { APP_NAME, HEADER, SPACING } from 'src/config-global';
import { useStores } from "src/models/root-store/root-store-context";
import Image from '../../../components/image';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
export const Identification = observer(() => {

  const theme = useTheme();
  const rootStore = useStores();
  const { loadingStore } = rootStore;

  const verify = async () => {
  }

  return (
    <>
      <Stack
        sx={{
          py: 0,
          pt: `${HEADER.H_MOBILE + SPACING}px`,
          pb: `${HEADER.H_MOBILE + SPACING}px`,
          m: 'auto',
          maxWidth: theme.breakpoints.only('lg'),
          minHeight: '100vh',
          textAlign: 'center',
          justifyContent: 'space-between',
        }}
      >

        <Box sx={{ margin: '10vh auto' }}>

          <Image alt="GenTok" src="/assets/images/agree-illust.png" sx={{ pl: 8, pr: 8, mb: { xs: 4, md: 2, lg: 4 } }} />

          <Typography variant={'body1'}>{APP_NAME} 서비스를 이용하시려면 본인 인증이 필요합니다.</Typography>
          <Typography variant={'body1'}>아래의 본인 인증 버튼을 눌러주세요.</Typography>


        </Box>
        <Box>
          <Fab aria-label='본인인증' color={'secondary'} variant={'extended'} sx={{ width: '100%' }} onClick={verify}>본인인증</Fab>
        </Box>

      </Stack>
    </>
  );
});


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});
export default Identification;