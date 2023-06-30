import {
  Button,
  Stack,
  Typography,
  useTheme,
  Dialog,
  Slide,
  IconButton,
  Alert,
  InputAdornment,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Link,
  Tabs,
  Box,
  Tab,
  Chip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Iconify from 'src/components/iconify';
import { PATH_AUTH } from 'src/routes/paths';
import { useNavigate } from 'react-router-dom';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FindPwByUserInfo from './FindPwByEmail';
import FindPasswordEnd from './FindPasswordEnd';
import { TabContext, TabPanel } from '@mui/lab';
import { IUserSnapshot } from 'src/models/user/user';
import { CallApiToStore } from 'src/utils/common';
import { useStores } from 'src/models';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-arrow-left.svg';
import BackHeader from 'src/components/BackHeader';
import { pxToRem } from 'src/theme/typography';

type Props = {
  handleClose: VoidFunction;
  defaultTab: string;
  certifyKey: string;
};

/**
 * ## 비밀번호 찾기_3.비밀번호 변경
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */

const NewPassword = observer(({ defaultTab, handleClose, certifyKey }: Props) => {
  const theme = useTheme();
  const rootStore = useStores();
  const { userStore, loadingStore, responseStore } = rootStore;
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [check, setCheck] = useState({
    eng: false,
    num: false,
    len: false,
    match: false,
    pw: false,
  });

  const findPwSchema = Yup.object().shape({
    pwd: Yup.string()
      .required('비밀번호를 입력해주세요')
      .matches(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{10,}$/, '형식에 맞지 않는 비밀번호 입니다.'),
    confirmPwd: Yup.string().required('비밀번호 확인을 입력해주세요'),
  });

  const regEng = /[A-Z|a-z]/;
  const regNum = /[0-9]/;
  const regLen = /^.{10,}$/;
  const regpw = /(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W))/;

  const defaultValues = {
    pwd: '',
    confirmPwd: '',
  };

  const methods = useForm<IUserSnapshot>({
    resolver: yupResolver(findPwSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const handleNext = () => {
    setOpen(true);
  };

  const onSubmit = async (data: IUserSnapshot) => {
    const newData = { ...data, certifyKey: certifyKey };
    CallApiToStore(userStore.changePwd(newData), 'api', loadingStore).then(() => {
      if (responseStore.responseInfo.resultCode === 'S') {
        handleNext();
      }
    });
  };

  // useEffect(() => {
  //   console.log(certifyKey);
  // }, []);

  return (
    <>
      <Stack sx={{ flex: 1, height: '100%', scrollMarginTop: '100px' }}>
        <BackHeader
          title={'비밀번호 찾기'}
          handleClose={() => {
            window.history.back();
          }}
        />

        {/* <TabContext value={defaultTab}>
          <Tabs
            value={defaultTab}
            onChange={handleClose}
            variant="fullWidth"
            aria-label="find id tabs"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: pxToRem(56),
              '& .MuiTab-root': {
                m: '0 !important',
              },
            }}
          >
            <Tab
              label="휴대폰 인증"
              sx={{
                width: '50%',
                '&:not(.Mui-selected)': {
                  color: theme.palette.grey[400],
                },
              }}
              value={'tab1'}
            />
            <Tab
              label="이메일 인증"
              sx={{
                width: '50%',
                '&:not(.Mui-selected)': {
                  color: theme.palette.grey[400],
                },
              }}
              value={'tab2'}
            />
          </Tabs>
        </TabContext> */}

        <Stack
          sx={{
            flex: 1,
            height: '100%',
            px: pxToRem(20),
            pb: pxToRem(40),
          }}
        >
          <Stack sx={{ flex: 1, width: '100%', height: '100%', mt: pxToRem(56) }}>
            <Typography variant={'Kor_16_r'} textAlign={'center'} component={'h4'} mb={pxToRem(40)}>
              새로운 비밀번호를 입력해주세요.
            </Typography>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Box>
                <RHFTextField
                  name="pwd"
                  label="비밀번호"
                  type={showPassword ? 'text' : 'password'}
                  variant={'standard'}
                  onKeyUp={(e: any) => {
                    if (getValues('pwd') !== undefined || getValues('pwd') !== null) {
                      setCheck({
                        ...check,
                        // eng: regEng.test(getValues('password')),
                        // num: regNum.test(getValues('password')),
                        len: regLen.test(getValues('pwd')),
                        match: getValues('pwd') === getValues('confirmPwd'),
                        pw: regpw.test(getValues('pwd')),
                      });
                    }
                    e.target.value = e.target.value.replace(/\s/gi, '');
                  }}
                />
                <Typography
                  mt={pxToRem(16)}
                  variant="Kor_12_r"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color={check.len ? theme.palette.secondary.light : theme.palette.grey[500]}
                >
                  <Iconify
                    width={pxToRem(14)}
                    mr={pxToRem(4)}
                    icon={'ph:check-light'}
                    color={check.len ? theme.palette.secondary.light : theme.palette.grey[300]}
                  />
                  10자 이상 입력
                </Typography>
                <Typography
                  variant="Kor_12_r"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color={check.pw ? theme.palette.secondary.light : theme.palette.grey[500]}
                >
                  <Iconify
                    width={pxToRem(14)}
                    mr={pxToRem(4)}
                    icon={'ph:check-light'}
                    color={check.pw ? theme.palette.secondary.light : theme.palette.grey[300]}
                  />
                  영문/숫자/특수문자(공백제외)만 허용하며, 2개 이상 조합
                </Typography>
              </Box>

              <Box mt={pxToRem(10)}>
                <RHFTextField
                  name="confirmPwd"
                  label="비밀번호 확인"
                  type={showPassword ? 'text' : 'password'}
                  variant={'standard'}
                  onKeyUp={(e: any) => {
                    if (getValues('pwd') === getValues('confirmPwd')) {
                      setCheck({
                        ...check,
                        match: getValues('pwd') === getValues('confirmPwd'),
                      });
                    } else {
                      setCheck({
                        ...check,
                        match: false,
                      });
                    }
                    e.target.value = e.target.value.replace(/\s/gi, '');
                  }}
                />
                <Stack mt={pxToRem(16)} direction={'row'} sx={{ alignItems: 'baseline' }}>
                  {getValues('confirmPwd') ? (
                    <Typography
                      variant="Kor_12_r"
                      sx={{ display: 'flex', alignItems: 'center' }}
                      color={
                        check.match ? theme.palette.secondary.light : theme.palette.error.light
                      }
                    >
                      <Iconify
                        width={pxToRem(14)}
                        mr={pxToRem(4)}
                        icon={check.match ? 'ph:check-light' : 'ph:x-bold'}
                        color={
                          check.match ? theme.palette.secondary.light : theme.palette.error.light
                        }
                      />
                      동일한 비밀번호를 입력해 주세요.
                    </Typography>
                  ) : (
                    <Typography
                      variant="Kor_12_r"
                      component={'h6'}
                      sx={{ display: 'flex', alignItems: 'center' }}
                      color={theme.palette.grey[500]}
                    >
                      <Iconify
                        width={pxToRem(14)}
                        mr={pxToRem(4)}
                        icon={'ph:check-light'}
                        color={theme.palette.grey[300]}
                      />
                      동일한 비밀번호를 입력해 주세요.
                    </Typography>
                  )}
                </Stack>
              </Box>
            </FormProvider>
          </Stack>
          <Button
            fullWidth
            disabled={!check.pw || !check.len || (!check.match && isSubmitting)}
            size="large"
            variant="contained"
            sx={{ borderRadius: 3 }}
            onClick={handleSubmit(onSubmit)}
          >
            완료
          </Button>
        </Stack>
      </Stack>

      {open && (
        <Dialog
          fullWidth
          hideBackdrop
          keepMounted
          maxWidth={'md'}
          open={open}
          TransitionComponent={Transition}
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
          <FindPasswordEnd
            handleClose={() => {
              setOpen(false);
            }}
          />
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

export default NewPassword;
