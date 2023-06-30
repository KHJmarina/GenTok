import { Button, Dialog, Slide, Stack, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useStores } from 'src/models/root-store/root-store-context';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { CallApiToStore } from 'src/utils/common';
import InputId from './input-id/InputId';
import { useNavigate } from 'react-router';
import { PATH_AUTH } from 'src/routes/paths';
import { useLocation } from 'react-router';
import { ReactComponent as IcoKakao } from 'src/assets/icons/ico-kakao.svg';
import { ReactComponent as IcoNaver } from 'src/assets/icons/ico-naver.svg';
import { ReactComponent as IcoFacebook } from 'src/assets/icons/ico-facebook.svg';
import { ReactComponent as IcoApple } from 'src/assets/icons/ico-apple.svg';
import { ReactComponent as IcoGoogle } from 'src/assets/icons/ico-google.svg';
import { useAuthContext } from 'src/auth/useAuthContext';
import BackHeader from 'src/components/BackHeader';
import CStepLiner from 'src/components/CStepLiner';
import { pxToRem } from 'src/theme/typography';

type Props = {
  handleClose?: VoidFunction;
};

/**
 * ## 회원가입 - 3.이미 가입된 계정
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */

export const ExistId = observer(({ handleClose }: Props) => {
  const theme = useTheme();
  const rootStore = useStores();
  const { userStore, loadingStore, responseStore } = rootStore;
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login, loginSns } = useAuthContext();

  const [openReg, setOpenReg] = useState(false);

  const auth = useAuthContext();

  // useEffect(() => {
  //   console.log('state', state);
  // }, []);

  if (!state.existInfo) {
    console.log('empty existInfo');
    return <></>;
  }

  const buttons: any = {
    Kakao: {
      text: '카카오',
      bg: '#FFE600',
      color: '#000000',
      ico: <IcoKakao />,
    },
    Naver: {
      text: '네이버',
      bg: '#4AB749',
      color: '#FFFFFF',
      ico: <IcoNaver />,
    },
    Facebook: {
      text: '페이스북',
      bg: '#455E99',
      color: '#FFFFFF',
      ico: <IcoFacebook />,
    },
    Apple: {
      text: '애플',
      bg: '#000000',
      color: '#FFFFFF',
      ico: <IcoApple />,
    },
    Google: {
      text: '구글',
      bg: '#FAFAFA',
      color: '#000000',
      ico: <IcoGoogle />,
    },
  };

  const handleLogin = () => {
    setOpenReg(true);
  };

  const handleIntegration = async () => {
    await CallApiToStore(userStore.integration(state), 'api', loadingStore).then(() => {
      if (responseStore.responseInfo.resultCode === 'S') {
        loginSns(userStore.loginInfo).then(() => {
          if (localStorage.getItem('onePickCpnKey') !== null) {
            navigate('/user/coupon', { replace: true });
          }
        });
        // navigate(PATH_AUTH.login, {
        //   state: {
        //     snsLoginExec: state.snsType, // 현재 로그인중인 type 처리
        //     verifyKey: state.existInfo.verifyKey,
        //   },
        //   replace: true,
        // });
      } else {
        alert('계정통합에 실패하였습니다.');
        navigate(PATH_AUTH.login, { replace: true });
      }
    });
  };

  return (
    <>
      <Stack
        justifyContent={'space-between'}
        sx={{ flex: 1, height: '100%', scrollMarginTop: '100px' }}
      >
        <BackHeader
          title={'회원가입'}
          handleClose={() => {
            handleClose && handleClose();
            !handleClose && window.history.back();
          }}
        />
        <CStepLiner step={5} totalStep={5} />

        {/* <Stack flex={1} width={'100%'} justifyContent={'space-between'} alignItems={'center'}> */}
        <Stack
          justifyContent={'space-between'}
          sx={{ flex: 1, alignItems: 'center', px: pxToRem(20), mt: pxToRem(75), pb: pxToRem(40) }}
        >
          {/* ======================안내문구 분기처리(계정종류별)============================== */}
          <Box sx={{ textAlign: 'center' }}>
            {
              // ID/PW 는 있고 sns 는 없는 경우
              state.existInfo.loginId !== null && state.existInfo.snsTypeCdList.length < 1 && (
                <>
                  <Typography variant={'Kor_22_r'} component={'h3'}>
                    이미 가입된 이메일이 있습니다.
                  </Typography>
                  <Typography
                    variant={'Eng_18_b'}
                    component={'h4'}
                    sx={{ fontWeight: 700, mt: pxToRem(4), mb: pxToRem(20) }}
                  >
                    {state.existInfo.loginId}
                  </Typography>
                  <Typography variant="Kor_16_r" color={theme.palette.grey[400]}>
                    기존 계정으로 로그인을 원하시면
                    <br />
                    이메일로 로그인 버튼을 클릭해주세요.
                  </Typography>
                </>
              )
            }
            {
              // ID/PW 도 있고 sns 도 있는 경우
              state.existInfo.loginId !== null && state.existInfo.snsTypeCdList.length > 0 && (
                <>
                  <Typography variant={'Kor_22_r'} component={'h3'}>
                    이미 가입된 이메일이 있습니다.
                  </Typography>
                  <Typography
                    variant={'Eng_18_b'}
                    component={'h4'}
                    sx={{ fontWeight: 700, mt: pxToRem(4), mb: pxToRem(20) }}
                  >
                    {state.existInfo.loginId}
                  </Typography>
                  <Typography variant="Kor_16_r" color={theme.palette.grey[400]}>
                    기존 계정으로 로그인을 원하시면
                    <br />
                    아래에서 선택해 주세요.
                  </Typography>
                </>
              )
            }
            {
              // ID/PW 는 없고 sns 는 있는 경우
              state.existInfo.loginId === null && state.existInfo.snsTypeCdList.length > 0 && (
                <>
                  <Typography variant={'Kor_22_r'} component={'h3'} mb={pxToRem(20)}>
                    이미 연결된 SNS 계정이 있습니다.
                  </Typography>
                  <Typography variant="Kor_16_r" color={theme.palette.grey[400]}>
                    기존 SNS계정으로 로그인을 원하시면
                    <br />
                    아래에서 선택해주세요.
                  </Typography>
                </>
              )
            }

            {/* ============================sns 가입계정 list============================= */}
            <Box
              sx={{
                mt: pxToRem(40),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {state.existInfo.snsTypeCdList.map(
                (row: { code: number; value: string }, i: number) => {
                  return (
                    <Button
                      key={`sns-button-${i}`}
                      size={'large'}
                      variant={'contained'}
                      sx={{
                        justifyContent: 'space-between',
                        width: pxToRem(200),
                        color: buttons[row.value].color,
                        background: buttons[row.value].bg,
                        borderRadius: 4,
                        mb: pxToRem(8),
                      }}
                      onClick={() => {
                        navigate(PATH_AUTH.login, {
                          state: {
                            snsLoginExec: row.value.toLowerCase(),
                          },
                          replace: true,
                        });
                      }}
                    >
                      {buttons[row.value].ico}
                      <Typography variant="Kor_16_b">{buttons[row.value].text} 로그인</Typography>
                    </Button>
                  );
                },
              )}
            </Box>
          </Box>
          {/* ==================버튼 분기처리(계정종류 및 회원가입경로, app/web별)============================= */}
          {
            // ID/PW 없는 경우 + 일반회원가입 => 회원가입
            state.existInfo.loginId === null &&
              state.loginType !== 'sns' &&
              state.loginType !== 'app' && (
                <Button
                  variant={'contained'}
                  size={'large'}
                  sx={{ width: '100%', borderRadius: 3 }}
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  회원가입 계속하기
                </Button>
              )
          }
          {
            // ID/PW 없는 경우 + sns 회원가입 => 계정통합(web)
            state.existInfo.loginId === null && state.loginType === 'sns' && (
              <Button
                variant={'contained'}
                size={'large'}
                sx={{ width: '100%', borderRadius: 3 }}
                onClick={() => {
                  handleIntegration();
                }}
              >
                계정 통합하기
              </Button>
            )
          }
          {
            // ID/PW 없는 경우 + sns 회원가입 => 계정통합(app)
            state.existInfo.loginId === null && state.loginType === 'app' && (
              <Button
                variant={'contained'}
                size={'large'}
                sx={{ width: '100%', borderRadius: 3 }}
                onClick={() => {
                  handleIntegration();
                }}
              >
                계정 통합하기
              </Button>
            )
          }
          {
            // ID/PW 있는 경우 + 일반회원가입 => email login
            state.existInfo.loginId !== null &&
              state.loginType !== 'sns' &&
              state.loginType !== 'app' && (
                <Button
                  variant={'contained'}
                  size={'large'}
                  sx={{ width: '100%', borderRadius: 3 }}
                  onClick={() => {
                    navigate(PATH_AUTH.login, {
                      state: { loginId: state.existInfo.loginId || undefined },
                      replace: true,
                    });
                  }}
                >
                  이메일로 로그인
                </Button>
              )
          }
          {
            // ID/PW 있는 경우 + sns 회원가입 => email login | 계정통합(web)
            state.existInfo.loginId !== null && state.loginType === 'sns' && (
              <Stack direction={'row'} width={'100%'} gap={pxToRem(8)}>
                <Button
                  variant={'outlined'}
                  size={'large'}
                  sx={{ width: '100%', borderRadius: 3 }}
                  onClick={() => {
                    navigate(PATH_AUTH.login, {
                      state: { loginId: state.existInfo.loginId || undefined },
                      replace: true,
                    });
                  }}
                >
                  이메일로 로그인
                </Button>
                <Button
                  variant={'contained'}
                  size={'large'}
                  sx={{ width: '100%', borderRadius: 3 }}
                  onClick={() => {
                    handleIntegration();
                  }}
                >
                  계정 통합하기
                </Button>
              </Stack>
            )
          }
          {
            // ID/PW 있는 경우 + sns 회원가입 => email login | 계정통합(app)
            state.existInfo.loginId !== null &&
              state.loginType === 'app' &&
              state.snsKey !== null && (
                <Stack direction={'row'} width={'100%'} gap={pxToRem(8)}>
                  <Button
                    variant={'outlined'}
                    size={'large'}
                    sx={{ width: '100%', borderRadius: 3 }}
                    onClick={() => {
                      navigate(PATH_AUTH.login, {
                        state: { loginId: state.existInfo.loginId },
                        replace: true,
                      });
                    }}
                  >
                    이메일로 로그인
                  </Button>
                  <Button
                    variant={'contained'}
                    size={'large'}
                    sx={{ width: '100%', borderRadius: 3 }}
                    onClick={() => {
                      handleIntegration();
                    }}
                  >
                    계정 통합하기
                  </Button>
                </Stack>
              )
          }
        </Stack>
      </Stack>

      {
        // sns계정만 존재 -> 일반회원가입 시 ID 입력화면 dialog
        openReg && (
          <Dialog
            fullWidth
            keepMounted
            maxWidth={'md'}
            open={openReg}
            TransitionComponent={Transition}
            hideBackdrop
            disableEscapeKeyDown
            PaperProps={{
              sx: {
                p: 0,
                m: 0,
                maxHeight: '100%',
                minHeight: '100%',
                borderRadius: '0 !important',
                [theme.breakpoints.down('sm')]: {
                  margin: 0,
                },
                boxShadow: 'none',
              },
            }}
            onClose={(e: any, reason: string) => {
              if (reason === 'backdropClick') {
                e.preventDefault();
                e.stopPropagation();
              } else {
                setOpenReg(false);
              }
            }}
            sx={{
              margin: '0 !important',
              zIndex: 101,
              padding: 0,
              borderRadius: 0,
            }}
          >
            <InputId
              handleClose={() => {
                setOpenReg(false);
              }}
            />
          </Dialog>
        )
      }
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

export default ExistId;
