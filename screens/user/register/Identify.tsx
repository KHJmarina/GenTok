import { Button, Dialog, Slide, Stack, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useStores } from 'src/models/root-store/root-store-context';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { sendReactNativeMessage } from 'src/utils/common';
import InputId from './input-id/InputId';
import { isObject } from 'lodash';
import { IUserSnapshot } from 'src/models/user/user';
import AlreadyExist from './AlreadyExist';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { PATH_AUTH } from 'src/routes/paths';
import { load, remove, save } from 'src/utils/storage';
import { toJS } from 'mobx';
import InputRcmndCode from './input-rcmnd-code/InputRcmndCode';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import CStepLiner from 'src/components/CStepLiner';
import BackHeader from 'src/components/BackHeader';
import { pxToRem } from 'src/theme/typography';

type Props = {
  handleClose?: VoidFunction;
};

/**
 * ## 회원가입 - 2.본인인증
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */

export const Identify = observer(({ handleClose }: Props) => {
  const theme = useTheme();
  const rootStore = useStores();
  const { userStore, loadingStore } = rootStore;
  const { REACT_APP_API_URL } = process.env;
  const [open, setOpen] = useState(false);
  const [openRecomend, setOpenRecomend] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  /**
   * 다음페이지로 이동
   */
  const handleNext = () => {
    setOpen(true);
  };

  /**
   * 본인인증
   */
  // function myFunc(e: any) {
  // console.log(e);
  // }
  const verification = async () => {
    let url: string = '';

    if (state.loginType === 'sns' || state.loginType === 'app') {
      url = `${REACT_APP_API_URL}/common/v1/user/verification/signup/sns`;
    } else {
      url = `${REACT_APP_API_URL}/common/v1/user/verification/signup`;
    }
    // console.log('🌈 ~ verification ~ url:', url);

    setTimeout(() => {
      if (userStore.os) {
        sendReactNativeMessage({
          type: 'verfication',
          payload: {
            url: url,
          },
        });
      } else {
        const win = window.open(url, '본인인증 중...', `width=400,height=500`);
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
      // console.log('e', event, e);
    }

    if (data.type === 'webpackWarnings') {
      return;
    }

    // console.log('본인인증 후 콜백 포스트메시지', data);

    // app sns 본인인증 후 콜백
    /**
     * from app
     */
    if (data.type === 'verifySuccess') {
      console.log('본인인증 성공', data.payload);
      const result = data.payload.result;
      if (result.resultCode === 'S') {
        switch (result.statusCode) {
          case '1100':
            // console.log('// 일반회원가입 -> 본인인증 -> 본인인증성공');
            navigate('', {
              state: {
                ...state,
                verifyKey: result.data,
              },
            });
            handleNext();
            break;
          case '1101':
            // console.log('// app sns login -> 회원가입 -> 추천인코드 입력');
            // await save('regInfoFoApp', {
            //   snsKey: regInfo.snsKey,
            //   verifyKey: data.payload.result.data,
            // })
            navigate('', {
              state: {
                ...state,
                snsKey: state.snsKey,
                verifyKey: result.data,
              },
            });
            setOpenRecomend(true);
            break;

          case '2100':
            // console.log('// SNS 로그인 -> 본인인증 -> 가입된 계정 존재 -> 계정 통합 질문');
            navigate(PATH_AUTH.existId, {
              replace: true,
              state: {
                ...state,
                existInfo: result.data,
                verifyKey: result.data.verifyKey,
              },
            });
            break;

          case '2101':
            // console.log('// SNS 로그인 -> 본인인증 -> 가입된 계정 존재 -> 계정 통합 질문');
            navigate(PATH_AUTH.existId, {
              replace: true,
              state: {
                ...state,
                existInfo: result.data,
                verifyKey: result.data.verifyKey,
              },
            });
            break;

          case '2200':
            // console.log('// SNS 로그인 -> 본인인증 -> 가입된 계정 존재 -> 계정 통합 질문');
            navigate(PATH_AUTH.existId, {
              replace: true,
              state: {
                ...state,
                existInfo: result.data,
                verifyKey: result.data.verifyKey,
              },
            });
            break;

          default:
            break;
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
        // console.log(event);
        // console.log('====================================');
      }
      // console.log('🚀 ~ listener ~ JSON.parse(event.data):', JSON.parse(event.data));
    }

    /**
     * from Web
     */
    if (data.resultCode === 'S' && data.statusCode) {
      // console.log('🚀 본인인증 ~ data:', data);
      // console.log('🚀 본인인증 ~ state:', state);
      switch (data.statusCode) {
        case '1100':
          // console.log('// 일반회원가입 -> 본인인증 -> 본인인증성공');
          navigate('', {
            state: {
              ...state,
              verifyKey: data.data,
            },
          });
          handleNext();
          break;
        case '1101':
          if (state.loginType === 'sns') {
            // console.log('// SNS 로그인 -> 회원가입 -> SNS 본인인증 -> 본인인증성공');
            navigate('', {
              state: {
                ...state,
                snsKey: state.snsKey,
                verifyKey: data.data,
              },
            });
            setOpenRecomend(true);
          }
          break;

        case '2100':
          // console.log('// 일반회원가입 -> 본인인증 -> ID/PW 가입정보 존재'); // loginId -> null
          navigate(PATH_AUTH.existId, {
            replace: true,
            state: {
              ...state,
              existInfo: data.data,
            },
          });
          break;
        case '2101':
          // console.log('// 일반회원가입 -> 본인인증 -> SNS 가입정보 만 존재');
          navigate(PATH_AUTH.existId, {
            replace: true,
            state: {
              ...state,
              existInfo: data.data,
              verifyKey: data.data.verifyKey,
              snsKey: null,
            },
          });
          break;
        case '2200':
          // console.log('// SNS 로그인 -> 본인인증 -> 가입된 계정 존재 -> 계정 통합 질문', state); // loginId -> null
          // TODO 본인인증후 통합해야하는데 verifyKey 가 없음 추가필요
          navigate(PATH_AUTH.existId, {
            replace: true,
            state: {
              ...state,
              existInfo: data.data,
              verifyKey: data.data.verifyKey,
            },
          });
          break;
          // snsTypeCdList === [], loginId 도 null -_-
          break;
      }
    }
  };

  useEffect(() => {
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

  return (
    <>
      <Stack
        justifyContent={'space-between'}
        sx={{
          flex: 1,
          height: '100%',
          scrollMarginTop: '100px',
        }}
      >
        <BackHeader
          title={'회원가입'}
          handleClose={() => {
            handleClose && handleClose();
            !handleClose && window.history.back();
          }}
        />
        <CStepLiner step={2} totalStep={5} />

        <Stack
          sx={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            px: pxToRem(20),
            mt: pxToRem(75),
            pb: pxToRem(40),
          }}
        >
          <Typography variant={'Kor_22_r'} mb={pxToRem(40)} textAlign={'center'}>
            회원 가입을 하기 위해
            <br />
            먼저 본인 인증이 필요해요.
          </Typography>
          <Button
            fullWidth
            variant={'outlined'}
            size={'large'}
            onClick={verification}
            sx={{ borderRadius: 3 }}
          >
            <Iconify icon={'ph:device-mobile'} />
            본인인증하기
          </Button>
        </Stack>
      </Stack>

      {open && (
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          open={open}
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
              setOpen(false);
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
              setOpen(false);
            }}
          />
        </Dialog>
      )}

      {openRecomend && (
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          open={openRecomend}
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
              '@media (max-width: 600px)': {
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
              setOpenRecomend(false);
            }
          }}
          sx={{
            margin: '0 !important',
            zIndex: 101,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <InputRcmndCode
            handleClose={() => {
              setOpenRecomend(false);
            }}
          />
        </Dialog>
      )}
    </>
  );
});

export default Identify;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});
