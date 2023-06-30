import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import { Button, Card, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { detectMobileDevice } from 'src/utils/common';
import { DialogAnimate } from 'src/components/animate';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close.svg';
import moment from 'moment';
import { useLocation } from 'react-router';

/**
 * ## InstallPopup 설명
 *
 */
const PACKAGE_NAME = 'app.macrogen.gentok';
const APP_STORE_URL = 'https://apps.apple.com/kr/app/gentok';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=gentok';
export const InstallPopup = observer(() => {

  const rootStore = useStores();
  const { userStore, loadingStore } = rootStore;
  const theme = useTheme();

  const { pathname } = useLocation();

  const excludes = ['/login', '/register', '/find-user', '/find-password', '/exist-id', '/category', '/setting'];

  const [openInstallAlert, setOpenInstallAlert] = useState(false);

  // TODO install guide popup is disabled.
  const isMobile = false; //detectMobileDevice(navigator.userAgent);

  useEffect(() => {
    if (isMobile && !excludes.includes(pathname)) {
      const pop = localStorage.getItem('installPopup');
      if (pop) {
        const obj = JSON.parse(pop);
        if (obj.type === 'install') {

        } else if (obj.type === 'donotshow') {
          if (moment() > moment(obj.payload.time).add(1, 'days')) {
            setTimeout(() => {
              if (userStore.os === '') {
                setOpenInstallAlert(true);
              }
            }, 1000)
          }
        }
      } else {
        setTimeout(() => {
          if (userStore.os === '') {
            setOpenInstallAlert(true);
          }
        }, 1000)
      }
    }
  }, [isMobile]);

  const windowState = useRef<Boolean>(true);
  useEffect(() => {
    return () => {
      window.removeEventListener('focus', () => { });
      window.removeEventListener('blur', () => { });
    }

  }, [])

  const installHandler = () => {
    setOpenInstallAlert(false);

    window.addEventListener('focus', () => {
      windowState.current = true;
    });

    window.addEventListener('blur', () => {
      windowState.current = false;
    });

    const ua = navigator.userAgent.toLowerCase();
    // if (ua.indexOf("android") > -1) {
    //   const url = 'intent://gentok.net/#Intent;scheme=https;package=app.macrogen.gentok;end';
    //   window.location.replace(url);
    // } else {
    //   window.location.href = `${PACKAGE_NAME}://`;
    // }

    // dlink로 처리
    window.location.href = `https://nmgentok.page.link/gentok`;

    setTimeout(() => {
      if (windowState.current === true) {
        redirectStore();
      }
    }, 500);

  }

  const closeHandler = () => {
    setOpenInstallAlert(false);
    localStorage.setItem('installPopup', JSON.stringify({
      type: 'donotshow',
      payload: {
        time: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    }));
  }

  const redirectStore = () => {
    const ua = navigator.userAgent.toLowerCase();
    // if (window.confirm("스토어로 이동하시겠습니까?")) {
    window.location.href = ua.indexOf("android") > -1 ? PLAY_STORE_URL : APP_STORE_URL;
    // }
  };


  return (
    <>
      <DialogAnimate
        open={openInstallAlert}
        sx={{
          '.MuiDialog-container > .MuiBox-root': { alignItems: 'center' },
        }}
        PaperProps={{
          sx: {
            maxWidth: 240,
          },
        }}
      >
        <Card sx={{ background: '#ffffff' }}>

          <Stack direction="row" sx={{ justifyContent: 'space-between', p: 2, pb: 0 }}>
            <Box
              component="img"
              src={'/logo/Gentok-Logo.svg'}
              width={100}
            />
            <IconButton size={'small'} onClick={() => setOpenInstallAlert(false)}>
              <CloseIcon stroke={theme.palette.common.black} />
            </IconButton>
          </Stack>

          <Stack
            sx={{
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 2,
            }}
          >
            <Typography variant={'Kor_16_r'}
              sx={{ color: theme.palette.common.black, textAlign: 'center' }}
            >
              젠톡 앱에서 쉽고 편리하게<br /> 더많은 기능을 이용해보세요
            </Typography>
          </Stack>
          <Stack
            spacing={1}
            sx={{ justifyContent: 'center', p: 2, marginBottom: 2 }}
          >
            <Button
              id={'app-install'}
              variant={'contained'}
              color={'primary'}
              size={'medium'}
              onClick={installHandler}
              sx={{
                borderRadius: 5,
                fontSize: '16px',
                fontWeight: 700,
                '&:hover': { background: 'none', color: '#FF5D0C', border: '1px solid #FF5D0C' }
              }}
            >
              앱에서 보기
            </Button>
            <Button
              id={'app-install-cancel'}
              variant={'text'}
              size={'small'}
              onClick={closeHandler}
              sx={{
                color: '#777777',
                minWidth: '40%',
                fontWeight: 100,
                '&:hover': { background: '#ffffff !important' }
              }}
            >
              오늘은 그냥 볼게요
            </Button>
          </Stack>
        </Card>
      </DialogAnimate>
    </>
  );
});

export default InstallPopup;