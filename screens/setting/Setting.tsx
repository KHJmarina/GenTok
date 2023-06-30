import React from 'react';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import {
  List,
  useTheme,
  Stack,
  Typography,
  ListItem,
  ListItemIcon,
  Slide,
  Dialog,
  Avatar,
  CircularProgress,
  Divider,
} from '@mui/material';
import profile_avata from 'src/assets/images/profile_avata.svg';
import { useNavigate } from 'react-router';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { TransitionProps } from '@mui/material/transitions';
import { CallApiToStore } from 'src/utils/common';
import { SettingProfile } from './profile/SettingProfileEdit';
import SettingAlarm from './alarm/SettingAlarm';
import SettingTerms from './terms-setting/SettingTerms';
import SettingAccount from './profile/settingAccount/SettingAccount';
import { HEADER } from 'src/config-global';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useCommonContext } from 'src/components/CommonContext';
import { PATH_ROOT } from '../../routes/paths';
import { pxToRem } from 'src/theme/typography';
import BackHeader from 'src/components/BackHeader';
import CHeader from 'src/components/CHeader';

/**
 * ## Setting 설명
 *
 */

type Props = {
  handleClose: VoidFunction;
};

export const Setting = observer(() => {
  const rootStore = useStores();
  const { termsStore, loadingStore, userStore, responseStore, marketStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthContext();
  const commonContext = useCommonContext();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  const auth = useAuthContext();
  const [loginAccount, setLoginAccount] = useState(auth.user);
  const [dialogType, setDialogType] = useState<string>('');
  const [termsOpen, setTermsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loading, setLoading] = useState(true);

  // 약관 메뉴 목록 조회 gets
  const getDatas = async () => {
    CallApiToStore(termsStore.gets(), 'api', loadingStore).then(() => {
      setLoading(false);
    });
  };
  // 약관 메뉴 목록별 상세내용 get
  const getDetail = async (termsSid: number) => {
    CallApiToStore(termsStore.get(termsSid), 'api', loadingStore)
      .then((e) => {
        setTermsOpen(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // 프로필 이미지 get
  const getProfileImage = () => {
    if (user?.profileImgPath) {
      if (user?.profileImgPath.substr(0, 4) === 'http') {
        return user?.profileImgPath;
      } else {
        return REACT_APP_IMAGE_STORAGE + user?.profileImgPath;
      }
    } else {
      return profile_avata;
    }
  };
  const onDialog = (type: string = '') => {
    setDialogType(type);
    setOpen(true);
  };
  const closeTermsDialog = () => {
    setTermsOpen(false);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  const dialogContent = () => {
    switch (dialogType) {
      case 'profile':
        return <SettingProfile handleClose={closeDialog} />;
        break;
      case 'account':
        return <SettingAccount handleClose={closeDialog} data={auth.user?.pwdLoginYn} />;
        break;
      case 'alarm':
        return <SettingAlarm handleClose={closeDialog} />;
        break;
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  const options: any = {
    showMainIcon: 'back',
    showHomeIcon: true,
  };
  return (
    <>
      <Stack
        sx={{
          position: 'sticky',
          scrollMarginTop: '150px',
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <CHeader title="설정" {...options} />
        <Stack
          spacing={2}
          sx={{
            pb: `${HEADER.H_MOBILE}px`,
          }}
        >
          {isAuthenticated && (
            <>
              <Stack
                sx={{
                  pl: pxToRem(20),
                  borderBottom: 0,
                  background: '#FFFFFF',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                }}
              >
                <List sx={{ p: 0 }}>
                  <ListItem onClick={() => onDialog('profile')} sx={{ ...listStyle }}>
                    <Box sx={{ display: 'flex' }}>
                      <Avatar
                        src={getProfileImage()}
                        sx={{ width: pxToRem(60), height: pxToRem(60) }}
                      />
                      {user?.nickNm === '' || user?.nickNm === null ? (
                        <Typography variant={'Kor_16_r'} sx={{ my: 'auto', ml: pxToRem(12) }}>
                          닉네임을 설정해주세요.
                        </Typography>
                      ) : (
                        <Typography variant={'Kor_16_r'} sx={{ my: 'auto', ml: pxToRem(12) }}>
                          {user?.nickNm}님, 안녕하세요.
                        </Typography>
                      )}
                    </Box>
                    <ListItemIcon sx={{ mr: pxToRem(20) }}>
                      <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
                    </ListItemIcon>
                  </ListItem>

                  <ListItem
                    onClick={() => onDialog('account')}
                    sx={{ justifyContent: 'space-between', p: 0, mt: pxToRem(9) }}
                  >
                    <Typography variant={'Kor_16_r'}>계정관리</Typography>
                    <ListItemIcon sx={{ mr: pxToRem(20) }}>
                      <Typography
                        variant={'body2'}
                        sx={{ color: theme.palette.grey[500], mr: pxToRem(8) }}
                      >
                        {user?.loginId === 'N/A' ? null : user?.loginId}
                      </Typography>
                      <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
                    </ListItemIcon>
                  </ListItem>
                </List>
              </Stack>

              <Divider sx={{ borderWidth: 1 }} />

              <Stack
                sx={{
                  pl: pxToRem(20),
                  borderBottom: 0,
                  background: '#FFFFFF',
                  textAlign: 'left',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                }}
              >
                <List
                  sx={{
                    width: '100%',
                    py: 2,
                    m: 0,
                  }}
                >
                  <Typography variant={'Kor_14_r'} sx={{ mb: pxToRem(25), color: '#C6C7CA' }}>
                    알림
                  </Typography>
                  <ListItem
                    onClick={() => onDialog('alarm')}
                    sx={{ justifyContent: 'space-between', p: 0, m: 0, mt: pxToRem(22) }}
                  >
                    <Typography variant={'Kor_16_r'}>알림설정</Typography>
                    <ListItemIcon sx={{ mr: pxToRem(20) }}>
                      <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
                    </ListItemIcon>
                  </ListItem>
                </List>
              </Stack>

              <Divider sx={{ borderWidth: 1 }} />
            </>
          )}

          {loading && termsStore.termss.length < 0 ? (
            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress sx={{ width: 70, height: 70 }} color={'info'} />
            </Box>
          ) : (
            <Stack
              sx={{
                pl: pxToRem(20),
                pb: pxToRem(10),
                textAlign: 'left',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <List
                sx={{
                  width: '100%',
                  p: 0,
                  m: 0,
                }}
              >
                <Typography variant={'Kor_14_r'} sx={{ mb: pxToRem(27), color: '#C6C7CA' }}>
                  약관 및 정책
                </Typography>
                {termsStore.termss?.map((termsMenu, i: number) => {
                  return (
                    <ListItem
                      onClick={() => {
                        getDetail(termsMenu.termsSid);
                      }}
                      sx={{ justifyContent: 'space-between', p: 0, m: 0, mt: pxToRem(20) }}
                      key={`term` + i}
                    >
                      <Typography variant={'Kor_16_r'} sx={{}}>
                        {termsMenu.termsNm}
                      </Typography>
                      <ListItemIcon sx={{ mr: pxToRem(20) }}>
                        <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
                      </ListItemIcon>
                    </ListItem>
                  );
                })}
              </List>
            </Stack>
          )}

          <Divider sx={{ borderWidth: 1 }} />
          <Stack
            sx={{
              pl: pxToRem(20),
              borderBottom: 0,
              background: '#FFFFFF',
              textAlign: 'left',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <List
              sx={{
                width: '100%',
                p: 0,
                m: 0,
              }}
            >
              <ListItem onClick={() => { }} sx={{ p: 0, m: 0, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography variant={'Kor_16_r'}>버전정보</Typography>
                  <Typography
                    variant={'Kor_16_r'}
                    sx={{ color: theme.palette.secondary.dark, ml: pxToRem(8) }}
                  >
                    {commonContext.appVersion.appCurrVer || '0'}
                  </Typography>
                </Box>
                <Typography
                  variant={'Kor_14_r'}
                  sx={{ color: theme.palette.grey[500], textAlign: 'end', mr: pxToRem(20) }}
                >
                  최신 버전입니다.
                </Typography>
              </ListItem>
            </List>
          </Stack>
          <Divider sx={{ borderWidth: 1 }} />

          {isAuthenticated && (
            <Stack
              sx={{
                pl: pxToRem(20),
                borderBottom: 0,
                background: '#FFFFFF',
                textAlign: 'left',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <List
                sx={{
                  width: '100%',
                  p: 0,
                }}
              >
                <ListItem
                  onClick={() => {
                    logout();
                    marketStore.cartStore.reset();
                    navigate(PATH_ROOT.root);
                  }}
                  sx={{ ...listStyle }}
                >
                  <Typography variant={'body1'}>로그아웃</Typography>
                </ListItem>
              </List>
            </Stack>
          )}
        </Stack>
      </Stack>

      {/* 약관 */}
      {termsOpen && (
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          hideBackdrop
          disableEscapeKeyDown
          open={termsOpen}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              p: 0,
              m: '0 !important',
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              boxShadow: 'none',
            },
          }}
          onClose={() => {
            setOpen(false);
          }}
          sx={{
            margin: '0 !important',
            zIndex: 100,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <SettingTerms handleClose={closeTermsDialog} />
        </Dialog>
      )}

      {/* 프로필, 계정, 알림 */}
      {open && (
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          hideBackdrop
          disableEscapeKeyDown
          open={open}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              p: 0,
              m: '0 !important',
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              boxShadow: 'none',
            },
          }}
          onClose={(e: any, reason: string) => {
            if (reason === 'backdropClick') {
              e.preventDefault();
              e.stopPropagation();
            } else {
              setOpen(false);
            }
          }}
          sx={{
            margin: '0 !important',
            zIndex: 100,
            padding: 0,
            borderRadius: 0,
          }}
        >
          {dialogContent()}
        </Dialog>
      )}
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

const listStyle = {
  p: 0,
  py: pxToRem(10),
  justifyContent: 'space-between',
  background: '#FFFFFF',
};
export default Setting;
