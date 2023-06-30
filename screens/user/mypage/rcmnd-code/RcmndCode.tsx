import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  TextField,
  Dialog,
  IconButton,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from 'src/models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import Image from 'src/components/image/Image';
import { HEADER, SPACING } from 'src/config-global';
import { CustomerHeader } from 'src/components/CustomerHeader';
import { copyToClipboard } from 'src/utils/copyToClipboard';
import { useAuthContext } from 'src/auth/useAuthContext';
import { CallApiToStore } from 'src/utils/common';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import { pxToRem } from 'src/theme/typography';
import CHeader from 'src/components/CHeader';
/**
 * ## RcmndCode 설명
 *
 */
export const RcmndCode = observer(() => {
  const rootStore = useStores();
  const { rcmndCodeStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();

  const getCode = async () => {
    CallApiToStore(rcmndCodeStore.gets(), 'api', loadingStore).then(() => {});
  };

  const options: any = {
    showMainIcon: 'back',
    showHomeIcon: true,
  };

  useEffect(() => {
    getCode();
  }, []);

  return (
    <>
      <Stack sx={{ height: '100%', overflow: 'auto' }}>
        <CHeader title="추천인 코드" {...options} />

        <Box
          sx={{
            background: `linear-gradient(35.75deg, #F86400 0%, #FF8B17 69.27%)`,
            // width:pxToRem(375),
            // height:pxToRem(460),
            pt: pxToRem(44),
            pb: pxToRem(36),
          }}
        >
          <Typography
            color={'#FFDF63'}
            sx={{
              pt: 1,
              fontSize: pxToRem(27),
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: pxToRem(32),
            }}
          >
            친구도 받고 나도 받는
          </Typography>
          <Typography
            color={'white'}
            sx={{
              // pt: 1,
              fontSize: pxToRem(44),
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: pxToRem(53.54),
            }}
          >
            친구초대 쿠폰
          </Typography>
          <Image
            src={'/assets/images/temp/rcmnd-code-image.svg'}
            alignItems={'center'}
            sx={{ pt: pxToRem(19), pb: pxToRem(2), m: 'auto' }}
          />
          <Typography
            color={'white'}
            sx={{
              fontSize: pxToRem(18),
              fontWeight: 400,
              letterSpacing: '-3%',
              lineHeight: pxToRem(26),
            }}
          >
            추천인과 신규친구
          </Typography>
          <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Typography
              color={'white'}
              sx={{
                fontSize: pxToRem(18),
                fontWeight: 400,
                letterSpacing: '-3%',
                lineHeight: pxToRem(26),
              }}
            >
              {' '}
              모두에게&nbsp;{' '}
            </Typography>
            <Typography
              color={'white'}
              sx={{
                fontSize: pxToRem(18),
                fontWeight: 600,
                letterSpacing: '-3%',
                lineHeight: pxToRem(26),
              }}
            >
              {' '}
              친구초대 쿠폰 &nbsp;
            </Typography>
            <Typography
              color={'white'}
              sx={{
                fontSize: pxToRem(18),
                fontWeight: 400,
                letterSpacing: '-3%',
                lineHeight: pxToRem(26),
              }}
            >
              지급!{' '}
            </Typography>
          </Stack>
        </Box>
        <Stack sx={{ px: 2.5, pt: 2.5 }}>
          <Typography variant={'subtitle1'} sx={{ textAlign: 'left', pb: 1 }} fontWeight={700}>
            {user?.nickNm ? user?.nickNm : user?.userNm}님의 초대코드는
          </Typography>
          <Box
            sx={{
              height: 70,
              borderRadius: 1,
              backgroundColor: '#FAFAFA',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography variant={'h4'} fontWeight={600}>
              {rcmndCodeStore.rcmndCodes}
            </Typography>
          </Box>
          <Button
            id={'btn-my-rcmndCode-copyCode'}
            variant={'contained'}
            size={'large'}
            color={'primary'}
            sx={{
              borderRadius: 3,
              mt: 3,
              mb: pxToRem(56),
              '&:hover': { background: '#FF5D0C !important' },
            }}
            onClick={() => copyToClipboard(rcmndCodeStore.rcmndCodes)}
          >
            추천인 코드 복사
          </Button>
        </Stack>
      </Stack>
    </>
  );
});

export default RcmndCode;
