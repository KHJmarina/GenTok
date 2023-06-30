import React from 'react';
import { Box, Stack, List, Divider, Link, ListItemText, ListItemIcon, alpha, Typography, ListItemAvatar, Avatar, Dialog, Slide } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_AUTH, PATH_PAGE, PATH_ROOT } from '../../../routes/paths';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { toJS } from 'mobx';
import { ListItem } from '../../../layouts/mobile/nav/mobile/styles';
import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/useAuthContext';
import Footer from '../../../layouts/mobile/Footer';
import DnaProgress from './dna-progress/DnaProgress';
import { pxToRem } from 'src/theme/typography';
import { CallApiToStore, numberComma } from 'src/utils/common';
import { SettingProfile } from '../../setting/profile/SettingProfileEdit';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import Image from 'src/components/image/Image';

import avata_imm from 'src/assets/images/mypage_profile_avatar.svg';
import config_imm from 'src/assets/images/profile_config.svg';
import Mycandy from './mycandy/Mycandy';
import RecentMycard from './recent-mycard/RecentMycard';
import DnaTestStatus from './dna-test-status/DnaTestStatus';
import { IMypage } from 'src/models/mypage/Mypage';
import { IPoint } from 'src/models';
import CHeader from 'src/components/CHeader';
import MypageHeader from 'src/components/MypageHeader';
import { MypageNavConfig } from './MypageNavConfig';
/**
 * ## Mypage 설명
 *
 */
export const Mypage = observer(() => {

  const rootStore = useStores();
  const { pointStore, userStore, mypageStore, loadingStore, marketStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { themeMode } = useSettingsContext();
  const { user, isAuthenticated } = useAuthContext();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  const [open, setOpen] = useState(false);
  // const [mypageData, setMypageData] = useState<IMypage>();
  const [mypageData, setMypageData] = useState(false);
  // const [pointData, setPointData] = useState<IPoint>();
  const [pointData, setPointData] = useState(false);

  const colros = themeMode === 'light' ? '#000000' : '#FFFFFF';

  // 프로필 이미지 get
  const getProfileImage = () => {
    if (user?.profileImgPath) {
      if (user?.profileImgPath.substr(0, 4) === 'http') {
        return user?.profileImgPath;
      } else {
        return REACT_APP_IMAGE_STORAGE + user?.profileImgPath;
      }
    } else {
      return avata_imm;
    }
  };

  const onDialog = () => {
    setOpen(true);
    window.history.pushState(null, '', window.location.href);
  };
  const closeDialog = () => {
    setOpen(false);
    navigate(-1);
  };

  const auth = useAuthContext();
  const logout = () => {
    auth.logout();
    marketStore.cartStore.reset();
    navigate(`${PATH_ROOT.root}`, { replace: true });
  };

  useEffect(() => {
    window.scrollTo(0,0);
    // console.log(window.scrollTo  (0,0))
    if (!isAuthenticated) {
      navigate(`${PATH_AUTH.login}`, {
        replace: true,
      });
    } else {
      CallApiToStore(mypageStore.get(), 'api', loadingStore).then(() => {
        CallApiToStore(pointStore.getPoint(), 'api', loadingStore).then(() => {
          setMypageData(true)
        })
      });
    }
    window.addEventListener('popstate', () => {
      setOpen(false);
    })
    return () => {
      window.removeEventListener('popstate', () => { })
    }

  }, [mypageStore.mypage.order?.purchsConfirmYn, window.scroll]);

  const options: any = {
    showMainIcon: 'logo',
    showAlarmIcon: true,
    showCartIcon: true,
    showSettingIcon: true
  };



  return (
    // <Stack sx={{ overflow: 'hidden' }}>
      <>
      {
        mypageData &&
        <Box
          position={'relative'}
          width={'100%'}
          sx={{ backgroundColor: '#FFFFFF', pt: 2 }}
        >
          <Box position={'absolute'} sx={{
            top: 0,
            left: 0,
            zIndex: 0,
            width: '100%',
            backgroundColor: theme.palette.primary.main,
            height: 400,
          }} />
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'flex-start'}
            gap={pxToRem(12)}
            sx={{ p: 2.5 }}
          >
            <Box minHeight={82.78}>
              <List sx={{
                width: '100%',
                bgcolor: theme.palette.primary.main,
                // py: 2,
              }}>
                <ListItem disableRipple sx={{ pl: 0, '&:hover': { background: 'none' } }}>
                  <ListItemAvatar onClick={() => onDialog()}>
                    <Box position={'relative'} sx={{ backgroundColor: '#FFFFFF', borderRadius: '50%' }}>
                      <Avatar src={getProfileImage()} sx={{ width: pxToRem(80), height: pxToRem(80) }} />
                      <Image src={config_imm} disabledEffect sx={{
                        width: pxToRem(28),
                        height: pxToRem(28),
                        position: 'absolute',
                        right: '-7%',
                        bottom: '-7%',
                      }} />
                    </Box>
                  </ListItemAvatar>
                  <Stack>
                    <Typography variant={'h3'} sx={{ fontWeight: 700, color: "#FFFFFF", cursor: 'default' }}>{user?.nickNm ? user?.nickNm : user?.userNm}님</Typography>
                    <Typography variant={'body2'} sx={{ fontWeight: 400, color: "#FFFFFF", cursor: 'default' }}>
                      {/* {user?.pwdLoginYn ? user?.loginId : ''} */}
                      {user?.loginId == 'N/A' ? '' : user?.loginId}
                    </Typography>
                  </Stack>
                </ListItem>
              </List>
            </Box>
            <Stack direction={'row'} width={'100%'} zIndex={1}>
              <Stack id={'btn-my-main-coupon'} direction={'row'} justifyContent={'space-between'} alignItems={'center'}
                sx={[
                  couponNpointBoxStyle, {
                    mr: '2%',
                    cursor: 'pointer'
                  }]}
                onClick={() => {
                  navigate(`${PATH_ROOT.user.coupon}`)
                }}
              >
                <Typography variant='subtitle2' fontWeight={600}>받은쿠폰</Typography>
                <Typography variant='subtitle1' fontWeight={600}>{mypageStore.mypage.cpnCnt}</Typography>
              </Stack>
              <Stack id={'btn-my-main-point'} direction={'row'} justifyContent={'space-between'} alignItems={'center'}
                sx={[
                  couponNpointBoxStyle, {
                    cursor: 'pointer'
                  }
                ]}
                onClick={() => {
                  navigate(`${PATH_ROOT.user.point}`)
                }}
              >
                <Typography variant='subtitle2' fontWeight={600}>포인트</Typography>
                <Typography variant='subtitle1' fontSize={pxToRem(17)} fontWeight={600}>
                  {
                    pointStore.point.pointBlncVal
                      ? numberComma(pointStore.point.pointBlncVal)
                      : 0
                  }
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Box
            position={'relative'}
            width={'100%'}
            top={10}
            left={0}
            paddingTop={pxToRem(40)}
            paddingBottom={pxToRem(40)}
            display={'flex'}
            alignItems={'flex-start'}
            flexDirection={'column'}
            sx={{
              backgroundColor: '#FFFFFF',
              minHeight: '70vh',
              '@media (min-width: 900px)': {
                minHeight: '55vh',
              },
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              textAlign: 'center',
              // justifyContent: 'space-between',
            }}
          >
            <Stack
              direction={'column'}
              justifyContent={'center'}
              sx={{ height: '100%', width: '100%' }}
            >
              <Stack mb={5}>
                <Stack direction={'row'} sx={{
                  px: 2.5,
                  mb: 3,
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',

                }}>
                  <Typography sx={{
                    fontSize: pxToRem(30),
                    fontWeight: 300,
                    lineHeight: pxToRem(40),
                    textAlign: 'left',
                  }}>유전자 카드를<br />모아보세요</Typography>
                  <Stack
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`${PATH_ROOT.user.mypage.dnaResult}?ctegrySid=0&page=slide`)}
                  >
                    <Typography component='span' color='#000000' sx={{
                      fontSize: pxToRem(32),
                      fontWeight: 600,
                      textAlign: 'right',
                    }}>
                      {mypageStore.mypage.myDnaTestResult?.cnt}
                      <Typography
                        component='span' color='#DFE0E2' sx={{
                          fontSize: pxToRem(32),
                          fontWeight: '300',
                          fontFamily: '-apple-system,sans-serif',
                          textAlign: 'right'
                        }}
                      >/</Typography>
                      <Typography component='span' color='#DFE0E2' sx={{
                        fontSize: pxToRem(32),
                        fontWeight: 600,
                        textAlign: 'right',
                      }}>{`${mypageStore.mypage.myDnaTestResult?.totalCnt}`}</Typography>
                    </Typography>
                    <Typography variant='body2' sx={{
                      textAlign: 'right',
                    }}>
                      모은 카드
                    </Typography>
                  </Stack>
                </Stack>
                <Box px={2.5} mb={5}>
                  <DnaProgress totalCnt={mypageStore.mypage.myDnaTestResult?.totalCnt} cnt={mypageStore.mypage.myDnaTestResult?.cnt} />
                </Box>
                <Mycandy data={mypageStore.mypage.myDnaTestResult?.ctegryResultList} />
              </Stack>

              <DnaTestStatus data={mypageStore.mypage.order} />

              <RecentMycard data={mypageStore.mypage.myDnaTestResult?.resultList} />

              <Divider />

              <MypageNavConfig />

              <Box
                id={'btn-my-main-logout'}
                sx={{
                  mx: 2.5,
                  mt: pxToRem(24),
                  height: pxToRem(50),
                  background: '#FAFAFA',
                  borderRadius: pxToRem(10),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={logout}
              >
                <Typography variant={'Kor_14_r'} sx={{ color: '#9DA0A5' }}> 로그아웃 </Typography>
              </Box>

            </Stack>
          </Box>
          {/* {open ? null : <Footer />} */}
        </Box>
      }

      {open && (
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          open={open}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              p: 0,
              m: 0,
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              '@media (max-width: 600px)': {
                margin: 0,
              },
            },
          }}
          onClose={() => {
            setOpen(false);
            navigate(-1)
          }}
          sx={{
            margin: '0 !important',
            zIndex: 100,

            padding: 0,
            borderRadius: 0,
          }}
        >
          <SettingProfile handleClose={closeDialog} />
        </Dialog>
      )}
    {/* </Stack> */}
    </>
  );
});

export default Mypage;

export const convertCtegryToValue = (sid: number) => {
  switch (sid) {
    case 0: // DNA 카테고리 - 전체
      return 'all';
    case 1:
      return 'nutrient';
    case 2:
      return 'workOut';
    case 3:
      return 'skinHair';
    case 4:
      return 'eatingHabits';
    case 5:
      return 'personalCharacteristics';
    case 6:
    default:
      return 'healthcare';
  }
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const couponNpointBoxStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: 1.25,
  color: '#FFFFFF',
  width: '49%',
  px: 2,
  py: 1.5,
}

const processTextStyleOn = {
  fontColor: '#202123',
  pl: 1.5,
  fontWeight: 600,
}

const processTextStyleOff = {
  fontColor: '#9DA0A5',
  pl: 1.5,
  fontWeight: 400,
}