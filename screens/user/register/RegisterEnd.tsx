import { Button, Stack, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import Iconify from 'src/components/iconify';
import { PATH_AUTH } from 'src/routes/paths';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { pxToRem } from 'src/theme/typography';

type Props = {
  handleClose: VoidFunction;
};

type FormValuesProps = {
  // loginId: string;
  // password: string;
  afterSubmit?: string;
};

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */

export const RegisterEnd = observer(({ handleClose }: Props) => {
  const theme = useTheme();
  const { login, loginSns } = useAuthContext();
  const { state } = useLocation();
  const navigate = useNavigate();

  const onSubmit = async () => {
    // navigate(PATH_AUTH.login, { replace: true });
    navigate('', { state: null });
    loginSns(state.signupInfo);
  };

  // useEffect(() => {
  //   console.log('====================================');
  //   console.log('state', state);
  //   console.log('====================================');
  // }, []);

  return (
    <>
      <Stack
        justifyContent={'space-between'}
        sx={{ flex: 1, height: '100%', scrollMarginTop: '100px', pb: pxToRem(40), px: pxToRem(20) }}
      >
        <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Iconify
            icon={'ic:round-how-to-reg'}
            width={pxToRem(60)}
            color={theme.palette.primary.main}
          />
          <Typography
            variant={'Kor_28_r'}
            align={'center'}
            sx={{ mt: pxToRem(24), mb: pxToRem(22) }}
          >
            회원가입이
            <br />
            완료되었습니다!
          </Typography>
          <Typography variant={'Kor_16_r'} align={'center'} color={theme.palette.grey[500]}>
            로그인하시면 더욱 다양한 서비스와 혜택을 <br />
            제공 받으실 수 있습니다.
          </Typography>
        </Stack>
        <Button
          onClick={() =>
            loginSns(state.signupInfo).then(() => {
              if (localStorage.getItem('onePickCpnKey') !== null) {
                navigate('/user/coupon', { replace: true });
              }
            })
          }
          variant={'contained'}
          size={'large'}
          sx={{
            borderRadius: 3,
          }}
        >
          홈으로
        </Button>
      </Stack>
    </>
  );
});

export default RegisterEnd;
