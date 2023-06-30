import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { json, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import naver_imm from '../../../assets/images/naver.svg';
import kakao_imm from '../../../assets/images/kakao.svg';
import google_imm from '../../../assets/images/google.svg';
import fb_imm from '../../../assets/images/facebook.svg';
import apple_imm from '../../../assets/images/apple.svg';
import { ReactComponent as IcoKakao } from 'src/assets/icons/ico-kakao.svg';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  Alert,
  Box,
  Checkbox,
  Dialog,
  Slide,
  Button,
  Typography,
  useTheme,
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import Iconify from '../../../components/iconify';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { Identify } from 'src/routes/elements';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { isObject } from 'lodash';
import { useStores } from 'src/models';
import { observer } from 'mobx-react-lite';
import { sendReactNativeMessage } from 'src/utils/common';
import CAlert from 'src/components/CAlert';
import BackHeader from 'src/components/BackHeader';
import { pxToRem } from 'src/theme/typography';
import Image from 'src/components/image/Image';
import { jwtDecode, setSession } from 'src/auth/utils';
import base64 from 'base-64';
import { styled } from '@mui/system';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
};
type Props = {
  handleClose?: VoidFunction;
};
type RedirectLocationState = {
  redirectTo: Location;
};

const Login = observer(({ handleClose }: Props) => {
  const { REACT_APP_API_URL } = process.env;
  const rootStore = useStores();
  const { userStore, responseStore, errorAlertStore, marketStore } = rootStore;
  const { login, loginSns } = useAuthContext();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [check, setCheck] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();
  const { state } = useLocation();
  const { state: locationState } = useLocation();
  // const [useSnsLogin, setUseSnsLogin] = useState(process.env.NODE_ENV === 'development'); // SNS 로그인 사용X (임시) 개발모드에서 풀어둠.
  const [useSnsLogin, setUseSnsLogin] = useState(true); // SNS 로그인 사용X (임시) 개발모드에서 풀어둠.
  const { redirectTo } = (locationState as RedirectLocationState) || {
    pathname: '',
    search: '',
  };
  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('아이디를 입력해주세요').trim(),
    password: Yup.string().required('비밀번호를 입력해주세요'),
  });

  const defaultValues = {
    email: (localStorage.getItem('rememberId') !== null && localStorage.getItem('rememberId') !== '')
      ? base64.decode(localStorage.getItem('rememberId') || '')
      : state
        ? state.loginId
        : '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  })

  const {
    reset,
    setError,
    clearErrors,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  // dynamic link -> login
  const searchParams = new URLSearchParams(document.location.search);
  const dlink = searchParams.get('dlink');
  console.log('dlink : ', redirectTo)

  let afterUrl: string = '';
  if (dlink) {
    sessionStorage.setItem('afterUrl', new URL(dlink).pathname);
  } else if (locationState && locationState.refere) {
    console.log('저장되고?');

    sessionStorage.setItem('afterUrl', new URL(locationState.refere).pathname);
  }
  const moveAfterUrl = () => {
    // console.log(sessionStorage.getItem('afterUrl'));
    navigate(sessionStorage.getItem('afterUrl') || '/', { replace: true, state: null });
    sessionStorage.removeItem('afterUrl');
  };

  const onSubmit = async (data: FormValuesProps) => {
    if (check === true && getValues('email').length > 0) {
      localStorage.setItem('rememberId', base64.encode(getValues('email')));
    } else {
      localStorage.removeItem('rememberId');
    }
    localStorage.removeItem('auth-errors');

    try {
      await login(data.email, data.password);
      marketStore.cartStore.getCart({ page: 1, size: 100 });
      localStorage.setItem('latestSnsLogin', '');

      if (redirectTo && redirectTo.pathname !== '') {
        navigate(redirectTo.pathname + redirectTo.search, { replace: true, state: null });
      } else if (sessionStorage.getItem('afterUrl')) {
        moveAfterUrl();
      } else {
        if (localStorage.getItem('onePickCpnKey') !== null) {
          navigate('/user/coupon', { replace: true, state: null });
        } else {
          navigate('/', { replace: true, state: null });
        }
      }
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message,
      });
    }
  };

  const [openRegister, setOpenRegister] = useState(false);

  // SNS LOGIN --------------------------------------
  const snsLogin = (type: string) => {
    let W: number = 400;

    switch (type) {
      case 'naver':
        W = 600;
        break;
      case 'kakao':
        W = 400;
        break;
      case 'facebook':
        W = 600;
        break;
      case 'apple':
        W = 600;
        break;
      case 'google':
        W = 400;
        break;
    }
    navigate('', {
      state: {
        snsType: type,
      },
    });
    sendReactNativeMessage({
      type: 'getOSType',
      payload: {},
    });

    setTimeout(() => {
      const url = `${REACT_APP_API_URL}/common/v1/user/login/${type}`;
      if (userStore.os) {
        sendReactNativeMessage({
          type: type + 'Login',
          payload: {
            url: url,
          },
        });
      } else {
        const win = window.open(url, '본인인증 중...', `width=${W},height=550`);
      }
    }, 100);
  };

  const listener = async (event: any) => {
    let data: any;
    try {
      if (isObject(event.data)) {
        return;
      }
      if (!isObject(event.data)) {
        data = JSON.parse(event.data);
      }
    } catch (e) {
      console.log('e', event, e);
    }
    if (data.type === 'os') {
      return;
    }

    const saveSnsLoginType = (t: string) => {
      localStorage.setItem('latestSnsLogin', t);
    }

    /************************************************************************************************
     * RN comm.
     */
    let res: any;

    // {"resultCode":"F","errorCode":"4004","errorMessage":"Not Found"}
    // from react native..............................................
    switch (data.type) {
      // sns login webview
      case 'snsLoginSuccess':
        res = data.payload;
        if (res.resultCode === 'S' && res.statusCode === '1000') {
          loginSns(res.data).then(() => {

            marketStore.cartStore.getCart({ page: 1, size: 100 });

            if (localStorage.getItem('onePickCpnKey') !== null) {
              navigate('/user/coupon', { replace: true, state: null });
            } else if (sessionStorage.getItem('afterUrl')) {
              moveAfterUrl();
            }
            // else if (state.referrer) {
            //   navigate(state.referrer, { state: null });
            // }
          });
        } else if (res.resultCode === 'S' && res.statusCode === '2000') {
          navigate(PATH_AUTH.register, {
            state: {
              snsKey: res.data,
              loginType: 'app',
              snsType: 'apple', //data.payload.type,
            },
            replace: true,
          });
          window.removeEventListener('message', listener);
        } else if (res.resultCode === 'S' && res.statusCode === '2200') {
          // 이미 존재 계정 통합 화면으로 ㄱㄱ
        }
        break;

      case 'appDirectLogin':
        let snsTypeCd = '';
        switch (data.payload.type) {
          case 'kakao':
            snsTypeCd = '900001';
            break;
          case 'naver':
            snsTypeCd = '900002';
            break;
          case 'google':
            snsTypeCd = '900003';
            break;
          case 'facebook':
            snsTypeCd = '900004';
            break;
          case 'apple':
            snsTypeCd = '900005';
            break;
        }

        fetch(REACT_APP_API_URL + '/common/v1/user/login/app/sns', {
          method: 'POST',
          body: JSON.stringify({
            snsTypeCd: snsTypeCd,
            snsId: data.payload.result,
          }),
        })
          .then(async (r: any) => {
            const res = await r.json();

            if (res.resultCode === 'S') {
              saveSnsLoginType(snsTypeCd);
              marketStore.cartStore.getCart({ page: 1, size: 100 });
              switch (res.statusCode) {
                case '1000': // 로그인 성공
                  loginSns(res.data);
                  marketStore.cartStore.getCart({ page: 1, size: 100 });
                  if (localStorage.getItem('onePickCpnKey') !== null) {
                    navigate('/user/coupon', { replace: true, state: null });
                  } else if (sessionStorage.getItem('afterUrl')) {
                    moveAfterUrl();
                  }
                  break;
                case '2000':
                  navigate(PATH_AUTH.register, {
                    state: {
                      snsKey: res.data,
                      loginType: 'app',
                      snsType: data.payload.type,
                    },
                    replace: true,
                  });
                  break;
                case '2200':
                  navigate(PATH_AUTH.existId, {
                    state: {
                      snsType: data.payload.type,
                    },
                    replace: true,
                  });
                  break;
              }
            }
          })
          .catch((e) => {
            saveSnsLoginType('');
            console.log('🌈 ~ listener ~ e:', e);
          });

        return;

        break;
    }
    // end from react native....

    // from window.open.....
    if (data.resultCode === 'S') {
      switch (data.statusCode) {
        case '1000': // 로그인 성공
          loginSns(data.data).then(() => {
            const json: any = jwtDecode(data.data.access_token.toString());
            console.log('🌈 ~ loginSns ~ json.loginType:', json.loginType)
            saveSnsLoginType(json.loginType.code);
            marketStore.cartStore.getCart({ page: 1, size: 100 });
            if (localStorage.getItem('onePickCpnKey') !== null) {
              navigate('/user/coupon', { replace: true, state: null });
            } else if (sessionStorage.getItem('afterUrl')) {
              moveAfterUrl();
            }
          });
          break;

        case '2000': // SNS 로그인 -> 회원정보 없음 -> 회원가입
          navigate(PATH_AUTH.register, {
            state: {
              snsKey: data.data,
              snsType: data.type,
              loginType: 'sns',
            },
          });
          break;

        default:
          setOpenAlert(true);
          setAlertMessage('Login 알 수 없는 오류가 발생했습니다.');
          break;
      }
    }
  };

  useEffect(() => {
    if (state && state.snsLoginExec) {
      navigate('', { state: null });
      snsLogin(state.snsLoginExec);
    }
    try {
      document.addEventListener('message', listener);
      window.addEventListener('message', listener);
    } catch (e) { }

    return () => {
      try {
        document.removeEventListener('message', listener);
        window.removeEventListener('message', listener);
      } catch (e) { }
    };
  }, []);

  useEffect(() => {
    const refresh = localStorage.getItem('refreshToken');
    const rememberMe = localStorage.getItem('rememberMe');

    if (refresh && rememberMe) {
      (async () => {
        return await fetch(REACT_APP_API_URL + '/common/v1/user/login/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: refresh }),
        })
          .then(async (res) => {
            const json = await res.json();
            if (json.data.access_token) {
              setSession(json.data.access_token);
              localStorage.removeItem('auth-errors');
              localStorage.setItem('refreshToken', json.data.refresh_token);
              localStorage.setItem('rememberMe', 'true');
              if (sessionStorage.getItem('afterUrl')) {
                window.location.replace(sessionStorage.getItem('afterUrl') || '/');
              } else {
                window.location.reload();
              }
            }
          })
          .catch((e) => {
            return e;
          });
      })();
    }
  }, []);

  useEffect(() => {
    if (check === true) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
  }, [check]);

  useEffect(() => {
    if (localStorage.getItem('rememberMe')) {
      setCheck(true);
    } else {
      setCheck(false);
    }
    localStorage.removeItem('rememberId');
    navigate('', { replace: true, state: null }); // 회원가입시도 -> 이미 ID/PW 계정이 있는 경우 가져온 state reset
  }, []);

  const [errorMessage1, setErrorMessage1] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const [errorMessage3, setErrorMessage3] = useState('');

  useEffect(() => {
    setErrorMessage1(localStorage.getItem('common_refresh_error') || '');
    setErrorMessage2(JSON.stringify(localStorage.getItem('auth_error')));
    setErrorMessage3(JSON.stringify(localStorage.getItem('auth-errors')));
  }, [localStorage]);

  const [viewError, setViewError] = useState(false);

  const lastestLoginType = localStorage.getItem('latestSnsLogin') || '';

  return (
    <Stack
      display={'flex'}
      height={'100%'}
      flex={1}
      sx={{
        m: '0 auto',
        maxWidth: theme.breakpoints.values.md,
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <BackHeader
        title={'로그인'}
        handleClose={() => {
          handleClose && handleClose();
          !handleClose && window.history.back();
        }}
      />

      <Stack
        flex={1}
        height={'100%'}
        sx={{
          background: '#FFFFFF',
          p: pxToRem(20),
        }}
      >

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack flex={1} height={'100%'} justifyContent={'center'}>
            <Stack spacing={pxToRem(16)} sx={{ width: '100%' }}>
              {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

              <RHFTextField
                name="email"
                type={'email'}
                label="아이디(이메일)"
                variant={'standard'}
                onFocus={() => clearErrors()}
                onKeyUp={(e: any) => {
                  e.target.value = e.target.value.replace(/\s/gi, '');
                }}
              />

              <RHFTextField
                name="password"
                label="비밀번호"
                type={showPassword ? 'text' : 'password'}
                variant={'standard'}
                onFocus={() => clearErrors()}
                onKeyUp={(e: any) => {
                  e.target.value = e.target.value.replace(/\s/gi, '');
                }}
              />

              <Stack direction={'row'} alignItems={'center'} width={'100%'}>
                <Checkbox
                  name="rememberMe"
                  icon={
                    <Iconify
                      icon={'material-symbols:check-circle-rounded'}
                      color={theme.palette.grey[400]}
                    />
                  }
                  checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
                  checked={!!check}
                  onClick={(e: any) => {
                    if (e.nativeEvent.target.checked !== undefined) {
                      setCheck(e.nativeEvent.target.checked);
                    }
                  }}
                  sx={{ p: 0, mr: pxToRem(6) }}
                />
                <Typography
                  variant="Kor_14_r"
                  onClick={() => {
                    setCheck(!check);
                  }}
                >
                  로그인 상태 유지
                </Typography>
              </Stack>
            </Stack>

            <LoadingButton
              fullWidth
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitSuccessful || isSubmitting}
              sx={{
                mt: pxToRem(36),
                bgcolor: 'primary.main',
                borderRadius: 4,
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                },
              }}
            >
              로그인
            </LoadingButton>
            {useSnsLogin && (
              <Button
                fullWidth
                size="large"
                type="button"
                variant="contained"
                sx={{
                  mt: pxToRem(8),
                  bgcolor: '#FFE600',
                  borderRadius: 4,
                  color: '#392020',
                  '&:hover': {
                    bgcolor: '#FFE600',
                    color: '#392020',
                  },
                }}
                onClick={() => {
                  snsLogin('kakao');
                }}
              >
                <IcoKakao width={pxToRem(16)} />
                <Typography variant="button" sx={{ ml: pxToRem(8) }}>
                  카카오로 3초 로그인
                </Typography>
              </Button>
            )}
            <Box my={pxToRem(30)} display={'flex'} justifyContent={'center'}>
              <Stack
                direction={'row'}
                justifyContent={'space-evenly'}
                alignItems={'center'}
                sx={{ fontVariant: 'Kor_14_r' }}
                gap={pxToRem(8)}
              // sx={{ p: 2, mt: 1.5, mb: 3 }}
              >
                <Button
                  variant={'text'}
                  color="inherit"
                  onClick={() => {
                    navigate(PATH_AUTH.findId, { state: null });
                  }}
                  sx={{ fontWeight: 400, p: 0 }}
                >
                  아이디 찾기
                </Button>
                <Iconify icon={'fluent:divider-short-16-regular'} />
                <Button
                  variant={'text'}
                  color="inherit"
                  onClick={() => {
                    navigate(PATH_AUTH.findPassword, { state: null });
                  }}
                  sx={{ fontWeight: 400, p: 0 }}
                >
                  비밀번호 찾기
                </Button>
                <Iconify icon={'fluent:divider-short-16-regular'} />
                <Button
                  variant={'text'}
                  color="inherit"
                  onClick={() => {
                    navigate(PATH_AUTH.register, { state: null });
                  }}
                  sx={{ fontWeight: 400, p: 0 }}
                >
                  회원가입
                </Button>
              </Stack>
            </Box>
            {useSnsLogin && (
              <Stack alignItems={'center'} mb={pxToRem(40)}>
                <Typography variant={'Kor_16_b'} my={pxToRem(30)}>
                  SNS 계정으로 로그인 하기
                </Typography>
                <Box width={'100%'}>
                  <Stack
                    direction={'row'}
                    sx={{
                      width: '100%',
                      gap: pxToRem(16),
                      justifyContent: 'center',
                    }}
                  >
                    <BootstrapTooltip title="최근 로그인" open={lastestLoginType === '900002'}>
                      <Box
                        component={'img'}
                        src={naver_imm}
                        width={pxToRem(50)}
                        height={pxToRem(50)}
                        onClick={() => {
                          snsLogin('naver');
                        }}
                      />
                    </BootstrapTooltip>
                    <BootstrapTooltip title="최근 로그인" open={lastestLoginType === '900001'}>
                      <Box
                        component={'img'}
                        src={kakao_imm}
                        width={pxToRem(50)}
                        height={pxToRem(50)}
                        onClick={() => {
                          snsLogin('kakao');
                        }}
                      />
                    </BootstrapTooltip>
                    {/* <BootstrapTooltip title="최근 로그인" open={lastestLoginType === '900004'}>
                    <Box
                      component={'img'}
                      src={fb_imm}
                      width={pxToRem(50)}
                      height={pxToRem(50)}
                      onClick={() => {
                        snsLogin('facebook');
                      }}
                    />
                    </BootstrapTooltip> */}
                    <BootstrapTooltip title="최근 로그인" open={lastestLoginType === '900005'}>
                      <Box
                        component={'img'}
                        src={apple_imm}
                        width={pxToRem(50)}
                        height={pxToRem(50)}
                        onClick={() => {
                          snsLogin('apple');
                        }}
                      />
                    </BootstrapTooltip>
                    <BootstrapTooltip title="최근 로그인" open={lastestLoginType === '900003'}>
                      <Box
                        component={'img'}
                        src={google_imm}
                        width={pxToRem(50)}
                        height={pxToRem(50)}
                        onClick={() => {
                          snsLogin('google');
                        }}
                      />
                    </BootstrapTooltip>
                  </Stack>
                </Box>
              </Stack>
            )}
            <Box
              onClick={() => setViewError(true)}
              sx={{ position: 'fixed', bottom: 0, right: 0, fontSize: '9px', color: '#FFF' }}
            >
              view log
            </Box>
          </Stack>
        </FormProvider>
      </Stack>

      {viewError && errorMessage1 && errorMessage1 !== 'null' && (
        <Alert
          sx={{ m: 3, fontSize: '12px' }}
          onClick={() => {
            localStorage.removeItem('common_refresh_error');
          }}
        >
          Refresh
          <br />
          {errorMessage1}
        </Alert>
      )}
      {viewError && errorMessage2 && errorMessage2 !== 'null' && (
        <Alert
          sx={{ m: 3, fontSize: '12px' }}
          onClick={() => {
            localStorage.removeItem('auth_error');
          }}
        >
          Auth
          <br />
          {errorMessage2}
        </Alert>
      )}
      {viewError && errorMessage3 && errorMessage3 !== 'null' && (
        <Alert
          sx={{ m: 3, fontSize: '12px' }}
          onClick={() => {
            localStorage.removeItem('auth-errors');
          }}
        >
          Auth2
          <br />
          {errorMessage3}
        </Alert>
      )}

      <CAlert isAlertOpen={openAlert} alertCategory={'f2d'}></CAlert>

      {openRegister && (
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          open={openRegister}
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
            setOpenRegister(false);
          }}
          sx={{
            margin: '0 !important',
            zIndex: 101,

            padding: 0,
            borderRadius: 0,
          }}
        >
          <Identify
            handleClose={() => {
              setOpenRegister(false);
            }}
          />
        </Dialog>
      )}
    </Stack>
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

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`.${tooltipClasses.tooltip}`]: {
    borderRadius: '4px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#FF7F3F',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#FF7F3F',
  },
}));

export default Login;
