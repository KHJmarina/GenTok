import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Slide,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
// 로그인  계정 이미지
import naver_imm from '../../../../assets/images/naver.svg';
import kakao_imm from '../../../../assets/images/kakao.svg';
import google_imm from '../../../../assets/images/google.svg';
import facebook_imm from '../../../../assets/images/facebook.svg';
import apple_imm from '../../../../assets/images/apple.svg';
import naverDisable_imm from '../../../../assets/images/naverDisable.svg';
import kakaoDisable_imm from '../../../../assets/images/kakaoDisable.svg';
import googleDisable_imm from '../../../../assets/images/googleDisable.svg';
import facebookDisable_imm from '../../../../assets/images/facebookDisable.svg';
import appleDisable_imm from '../../../../assets/images/appleDisable.svg';
// sns 로그인
import { useLocation, useNavigate } from 'react-router-dom';
import { sendReactNativeMessage } from 'src/utils/common';
import { isObject, replace } from 'lodash';
// routes
import { PATH_AUTH } from '../../../../routes/paths';
// 스타일
import FormProvider from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { CallApiToStore } from 'src/utils/common';
import { IUserSnapshot } from 'src/models/user/user';
import _ from 'lodash';
import CAlert from 'src/components/CAlert';
import { toJS } from 'mobx';
import { useAuthContext } from 'src/auth/useAuthContext';
import { TransitionProps } from 'react-transition-group/Transition';
import { Identify } from 'src/screens/user/register/Identify';
import React from 'react';
import { pxToRem } from 'src/theme/typography';

/**
 * ## Profile 설명
 *
 */

type RedirectLocationState = {
  redirectTo: Location;
};
interface propTypes {
  handleClose: VoidFunction;
}

export const SnsRelease = observer(({ handleClose }: propTypes) => {
  const rootStore = useStores();
  const { loadingStore, userStore, marketStore } = rootStore;

  const { REACT_APP_API_URL } = process.env;
  // sns로그인
  const { loginSns } = useAuthContext();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { state: locationState } = useLocation();
  const { redirectTo } = (locationState as RedirectLocationState) || {
    pathname: '',
    search: '',
  };
  const theme = useTheme();
  const auth = useAuthContext();
  const [openAlert, setOpenAlert] = useState(false);

  const [snsTypeCd, setSnsTypeCd] = useState('');

  // 계정 연결 조회
  const [success, setSuccess] = useState({
    naver: auth.user?.snsNaverYn,
    kakao: auth.user?.snsKakaoYn,
    facebook: auth.user?.snsFacebookYn,
    apple: auth.user?.snsAppleYn,
    google: auth.user?.snsGoogleYn,
  });

  // alert
  const [releaseAlert, setReleaseAlert] = useState(false); // 해제하시겠습니까?
  const [noReleaseAlert, setNoReleaseAlert] = useState(false); // 해제가 불가합니다
  const [loginAccount, setLoginAccount] = useState(auth.user?.loginType);

  const [defaultValues, setDefaultValues] = useState<any>(auth.user);
  const methods = useForm<IUserSnapshot>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

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
    // console.log('포스트메시지', event.data);
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

    /************************************************************************************************
     * RN comm.
     */
    let res: any;

    // {"resultCode":"F","errorCode":"4004","errorMessage":"Not Found"}
    // from react native..............................................
    switch (data.type) {
      // sns login webview
      case 'snsLoginSuccess':
        break;

      case 'appDirectLogin':
        console.log('🌈 ~ listener ~ login from app : ', data.payload.result);
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
            console.log('sns login from app ', res);
            // 로그인 성공
            if (res.resultCode === 'S') {
              switch (res.statusCode) {
                case '2000':
                  console.log(
                    "case '2000': // SNS 로그인 -> 회원정보 없음 -> 회원가입",
                    data.payload,
                  );
                  navigate(PATH_AUTH.register, {
                    state: {
                      snsKey: res.data,
                      loginType: 'app',
                      snsType: data.payload.type,
                    },
                    replace: true,
                  });
                  break;
                // case '2200':
                //   console.log('// SNS 로그인 -> 본인인증 -> 가입된 계정 존재 -> 계정 통합 질문');
                //   navigate(PATH_AUTH.existId, {
                //     state: {
                //       snsType: data.payload.type,
                //     },
                //     replace: true,
                //   });
                //   break;
              }
            }
          })
          .catch((e) => {
            console.log('🌈 ~ listener ~ e:', e);
          });

        return;

        break;
    }
    // end from react native....

    // from window.open.....
    // console.log('WEB 포스트메시지', data);
    // console.log('🚀 ~ listener ~ data.resultCode:', data.resultCode, data.statusCode);
    if (data.resultCode === 'S') {
      switch (data.statusCode) {
        case '1000': // 로그인 성공
          loginSns(data.data);
          break;

        // case '1100': // 일반회원가입 -> 본인인증 -> 본인인증성공
        //   navigate(PATH_AUTH.register, { replace: true });
        //   break;
        // case '1101': // SNS 로그인 -> 회원가입 -> SNS 본인인증 -> 본인인증성공
        //   navigate(PATH_AUTH.register, { replace: true });
        //   break;

        case '2000': // SNS 로그인 -> 회원정보 없음 -> 회원가입
          console.log("case '2000': // SNS 로그인 -> 회원정보 없음 -> 회원가입", data, state);
          auth.logout();
          marketStore.cartStore.reset();
          setTimeout(() => {
            navigate(PATH_AUTH.register, {
              state: {
                snsKey: data.data,
                snsType: data.type, // TODO type value return 추가 필요
                loginType: 'sns',
              },
            });
          }, 500);
          break;

        case '2100': // 일반회원가입 -> 본인인증 -> ID/PW 존재
          navigate(PATH_AUTH.existId, { replace: true, state: null });
          break;
        case '2101': // 일반회원가입 -> 본인인증 -> SNS 로그인 정보만 있을 경우(ID/PW 값 없는 경우)
          break;
        case '2200': // SNS 로그인 -> 본인인증 -> 가입된 계정 존재 -> 계정 통합 질문
          break;

        default:
          setOpenAlert(true);
          // setAlertMessage('Login 알 수 없는 오류가 발생했습니다.');
          break;
      }
    }
  };
  useEffect(() => {
    if (state && state.snsLoginExec) {
      console.log('snsLoginExec : ', state.snsLoginExec);
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

  // SNS Release --------------------------------------
  const onSubmit = async () => {
    CallApiToStore(userStore.releaseSns(snsTypeCd), 'api', loadingStore).then(() => {
      auth.initialize();
      handleClose();
      setSuccess({
        ...success,
        naver: auth.user?.snsNaverYn,
        kakao: auth.user?.snsKakaoYn,
        facebook: auth.user?.snsFacebookYn,
        apple: auth.user?.snsAppleYn,
        google: auth.user?.snsGoogleYn,
      });
    });
  };

  return (
    <>
      <Stack sx={{ width: '100%' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Typography variant={'Kor_16_b'}>로그인 관리</Typography>

          <Box
            width={'100%'}
            my={pxToRem(11)}
            sx={{
              [theme.breakpoints.down(376)]: {
                width: '100%',
              },
            }}
          >
            <Stack
              direction={'row'}
              sx={{
                width: '100%',
                gap: 0.5,
                justifyContent: 'center',
              }}
            >
              <Box textAlign={'center'} display={'flex'} flexDirection={'column'} mr={pxToRem(10)}>
                <Box
                  component={'img'}
                  src={success.naver ? naver_imm : naverDisable_imm}
                  width={55}
                  height={55}
                  mb={pxToRem(10)}
                  onClick={(e: any) => {
                    setSnsTypeCd('Naver');
                    if (!success.naver) {
                      snsLogin('naver');
                    } else if (loginAccount?.value === 'Naver') {
                      setNoReleaseAlert(true);
                    } else if (loginAccount === null || success.naver) {
                      setReleaseAlert(true);
                    }
                  }}
                />
                <Typography variant={'Kor_12_b'}>
                  {success.naver ? '연결완료' : '연결하기'}
                </Typography>
              </Box>

              <Box textAlign={'center'} display={'flex'} flexDirection={'column'} mr={pxToRem(10)}>
                <Box
                  component={'img'}
                  src={success.kakao ? kakao_imm : kakaoDisable_imm}
                  width={55}
                  height={55}
                  mb={pxToRem(10)}
                  onClick={(e: any) => {
                    // setSnsTypeCd(e.target.value);
                    setSnsTypeCd('Kakao');
                    if (!success.kakao) {
                      snsLogin('kakao');
                    } else if (loginAccount?.value === 'Kakao') {
                      setNoReleaseAlert(true);
                    } else if (loginAccount === null || success.kakao) {
                      setReleaseAlert(true);
                    }
                  }}
                />
                <Typography variant={'Kor_12_b'}>
                  {success.kakao ? '연결완료' : '연결하기'}
                </Typography>
              </Box>
              {/* <Box textAlign={'center'} display={'flex'} flexDirection={'column'} mr={pxToRem(10)}>
                <Box
                  component={'img'}
                  src={success.facebook ? facebook_imm : facebookDisable_imm}
                  width={55}
                  height={55}
                  mb={pxToRem(10)}
                  onClick={(e: any) => {
                    // setSnsTypeCd(e.target.value);
                    setSnsTypeCd('Facebook');
                    if (!success.facebook) {
                      snsLogin('facebook');
                    } else if (loginAccount?.value === 'Facebook') {
                      setNoReleaseAlert(true);
                    } else if (loginAccount === null || success.facebook) {
                      setReleaseAlert(true);
                    }
                  }}
                />
                <Typography variant={'Kor_12_b'}>
                  {success.facebook ? '연결완료' : '연결하기'}
                </Typography>
              </Box> */}
              <Box textAlign={'center'} display={'flex'} flexDirection={'column'} mr={pxToRem(10)}>
                <Box
                  component={'img'}
                  src={success.apple ? apple_imm : appleDisable_imm}
                  width={55}
                  height={55}
                  mb={pxToRem(10)}
                  onClick={(e: any) => {
                    // setSnsTypeCd(e.target.value);
                    setSnsTypeCd('Apple');
                    if (!success.apple) {
                      snsLogin('apple');
                    } else if (loginAccount?.value === 'Apple') {
                      setNoReleaseAlert(true);
                    } else if (loginAccount === null || success.apple) {
                      setReleaseAlert(true);
                    }
                  }}
                />
                <Typography variant={'Kor_12_b'}>
                  {success.apple ? '연결완료' : '연결하기'}
                </Typography>
              </Box>
              <Box textAlign={'center'} display={'flex'} flexDirection={'column'} mr={pxToRem(10)}>
                <Box
                  component={'img'}
                  src={success.google ? google_imm : googleDisable_imm}
                  width={55}
                  height={55}
                  mb={pxToRem(10)}
                  onClick={(e: any) => {
                    // setSnsTypeCd(e.target.value);
                    setSnsTypeCd('Google');
                    if (!success.google) {
                      snsLogin('google');
                    } else if (loginAccount?.value === 'Google') {
                      setNoReleaseAlert(true);
                    } else if (loginAccount === null || success.google) {
                      setReleaseAlert(true);
                    }
                  }}
                />
                <Typography variant={'Kor_12_b'}>
                  {success.google ? '연결완료' : '연결하기'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </FormProvider>

        {openRegister && (
          <Dialog
            fullWidth
            keepMounted
            maxWidth={'lg'}
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
      {/* 연결 해제 alert */}
      {releaseAlert && (
        <CAlert
          isAlertOpen={true}
          alertCategory={'success'}
          alertTitle={'연결된 계정을 해제하시겠습니까?'}
          hasCancelButton={true}
          handleAlertClose={() => {
            setReleaseAlert(false);
          }}
          callBack={onSubmit}
        ></CAlert>
      )}
      {/* 연결 해제 불가 alert */}
      {noReleaseAlert && (
        <CAlert
          isAlertOpen={true}
          alertCategory={'success'}
          alertTitle={'현재 로그인 중인 계정은 해제할 수 없습니다.'}
          hasCancelButton={false}
          handleAlertClose={() => {
            setNoReleaseAlert(false);
          }}
        ></CAlert>
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

export default SnsRelease;
