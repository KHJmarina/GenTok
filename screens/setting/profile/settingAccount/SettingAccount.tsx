import React from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import {
  Box,
  Button,
  Dialog,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Slide,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { TransitionProps } from '@mui/material/transitions';
import { CallApiToStore } from 'src/utils/common';
import SettingWithdrawal from '../SettingWithdrawal';
import { IUserSnapshot } from 'src/models/user/user';
import { useAuthContext } from 'src/auth/useAuthContext';
import { reset } from 'numeral';
import _ from 'lodash';
import CAlert from 'src/components/CAlert';
import { SnsRelease } from './SnsRelease';
import { pxToRem } from 'src/theme/typography';
import BackHeader from 'src/components/BackHeader';
/**
 * ## Profile 설명
 *
 */
type Props = {
  handleClose: VoidFunction;
  data: Boolean;
};

export const SettingAccount = observer(({ handleClose, data }: Props) => {
  const rootStore = useStores();
  const { loadingStore, userStore, responseStore, marketStore } = rootStore;
  const theme = useTheme();
  const auth = useAuthContext();
  const { logout } = useAuthContext();
  const [dialogType, setDialogType] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [check, setCheck] = useState({
    eng: false,
    num: false,
    len: false,
    match: false,
    pw: false,
    beforePw: false,
  });
  const [loginAccount, setLoginAccount] = useState(auth.user);
  // alert
  const [releaseAlert, setReleaseAlert] = useState(false); // 해제하시겠습니까?
  const [noReleaseAlert, setNoReleaseAlert] = useState(false); // 해제가 불가합니다

  const LoginSchema = Yup.object().shape({
    pwd: Yup.string()
      .required('비밀번호를 입력해주세요')
      .matches(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{10}/, '형식에 맞지 않는 비밀번호 입니다.'),
    confirmPwd: Yup.string().required('비밀번호 확인을 입력해주세요'),
  });

  const regLen = /^.{10}/;
  const regpw = /(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W))/;

  const defaultValues = {
    oldPwd: '',
    pwd: '',
    confirmPwd: '',
  };

  const methods = useForm<IUserSnapshot>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = methods;

  // 비밀번호 변경하기
  const onSubmit = async (data: IUserSnapshot) => {
    if (_.isEmpty(errors)) {
      if (data === null) {
      } else {
        await CallApiToStore(userStore.changeOldPwd(data), 'api', loadingStore)
          .then(() => {
            if (responseStore.responseInfo.resultCode === 'S') {
              userStore.setRegisterInfo(data);
              reset();
              setOpenAlert(true);
            } else if (responseStore.responseInfo.errorMessage) {
              setOpenAlert(true);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }
    setOpen(false);
    reset();
  };

  // 회원탈퇴 open
  const onDialog = (type: string = '') => {
    setDialogType(type);
    setOpen(true);
  };

  useEffect(() => {
    auth.initialize();
  }, []);

  return (
    <>
      <Stack
        sx={{
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <BackHeader title="계정 관리" handleClose={handleClose} />
        <>
          <Stack
            sx={{
              height: '100%',
              pt: pxToRem(12),
              pb: pxToRem(20),
              px: pxToRem(20),
            }}
          >
            <SnsRelease handleClose={handleClose} />
          </Stack>
          <Divider sx={{ borderBottomWidth: pxToRem(1), bgcolor: theme.palette.action.hover }} />
        </>

        {auth.user?.pwdLoginYn === false ? null : (
          <Stack>
            <Stack sx={{ p: pxToRem(20), pt: pxToRem(27) }}>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                {/* 비밀번호 변경 */}
                <Stack spacing={1} sx={{ flex: 1, width: '100%', mb: pxToRem(15) }}>
                  <Typography variant={'Kor_16_b'}>비밀번호 변경</Typography>
                  <RHFTextField
                    name="oldPwd"
                    label=""
                    placeholder="현재 비밀번호"
                    type={showPassword ? 'text' : 'password'}
                    variant={'standard'}
                    onKeyUp={() => {
                      if (getValues('pwd') !== undefined || getValues('confirmPwd') !== null) {
                        setCheck({
                          ...check,
                          // beforePw: getValues('oldPwd') === userStore.user.pwd, //저장누르면 기존 oldPw와 비교
                        });
                      }
                    }}
                    sx={{ mt: pxToRem(20) }}
                  />
                  {/* 현재비밀번호 비교하는 코드 */}
                  {/* {getValues('pwd') ? (
              <Typography
                variant="body2"
                sx={{ display: 'flex', alignItems: 'center' }}
                color={check.match ? theme.palette.secondary.main : theme.palette.error.main}
              >
                {getValues('pwd') !== null || getValues('pwd') !== undefined
                  ? check.match
                    ? '비밀번호 일치'
                    : '비밀번호 불일치'
                  : null}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{ display: 'flex', alignItems: 'center' }}
                color={theme.palette.grey[500]}
              >
                {''}
              </Typography>
            )} */}
                </Stack>

                {/* 새 비밀번호 */}
                <Stack
                  spacing={1}
                  sx={{ flex: 1, width: '100%', mt: pxToRem(50), mb: pxToRem(10) }}
                >
                  <Typography variant={'Kor_16_b'}>새 비밀번호</Typography>
                  <Box sx={{ flex: 1, width: '100%', mt: pxToRem(8) }}>
                    <RHFTextField
                      name="pwd"
                      label=""
                      placeholder="비밀번호"
                      type={showPassword ? 'text' : 'password'}
                      variant={'standard'}
                      onKeyUp={() => {
                        if (getValues('pwd') !== undefined || getValues('pwd') !== null) {
                          setCheck({
                            ...check,
                            len: regLen.test(getValues('pwd')),
                            match: getValues('pwd') === getValues('confirmPwd'),
                            pw: regpw.test(getValues('pwd')),
                          });
                        }
                      }}
                    />

                    <Typography
                      variant="Kor_12_r"
                      sx={{ display: 'flex', alignItems: 'center', mt: pxToRem(8) }}
                      color={check.len ? theme.palette.secondary.light : theme.palette.grey[500]}
                    >
                      <Iconify
                        width={20}
                        icon={'ph:check-light'}
                        border={`solid ${pxToRem(3)} white`}
                        borderColor={theme.palette.common.white}
                        color={check.len ? theme.palette.secondary.light : theme.palette.grey[300]}
                      />
                      10자 이상 입력
                    </Typography>
                    <Typography
                      variant="Kor_12_r"
                      sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(16) }}
                      color={check.pw ? theme.palette.secondary.light : theme.palette.grey[500]}
                    >
                      <Iconify
                        width={20}
                        icon={'ph:check-light'}
                        border={`solid ${pxToRem(2)} white`}
                        borderColor={theme.palette.common.white}
                        color={check.pw ? theme.palette.secondary.light : theme.palette.grey[300]}
                      />
                      영문/숫자/특수문자(공백제외)만 허용하며, 2개 이상 조합
                    </Typography>
                  </Box>

                  <Box mt={pxToRem(16)}>
                    <RHFTextField
                      name="confirmPwd"
                      label=""
                      placeholder="비밀번호 확인"
                      type={showPassword ? 'text' : 'password'}
                      variant={'standard'}
                      onKeyUp={() => {
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
                      }}
                    />
                    {getValues('confirmPwd') ? (
                      <Typography
                        variant="Kor_12_r"
                        sx={{ display: 'flex', alignItems: 'center', mt: pxToRem(8) }}
                        color={
                          check.match ? theme.palette.secondary.light : theme.palette.error.light
                        }
                      >
                        <Iconify
                          width={20}
                          icon={check.match ? 'ph:check-light' : 'ph:x-bold'}
                          border={`solid ${pxToRem(2)} white`}
                          borderColor={theme.palette.common.white}
                          color={
                            check.match ? theme.palette.secondary.light : theme.palette.error.light
                          }
                        />
                        동일한 비밀번호를 입력해 주세요.
                      </Typography>
                    ) : (
                      <Typography
                        variant="Kor_12_r"
                        sx={{ display: 'flex', alignItems: 'center', mt: pxToRem(8) }}
                        color={theme.palette.grey[500]}
                      >
                        <Iconify
                          width={20}
                          icon={'ph:check-light'}
                          border={`solid ${pxToRem(2)} white`}
                          borderColor={theme.palette.common.white}
                          color={theme.palette.grey[300]}
                        />
                        동일한 비밀번호를 입력해 주세요.
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </FormProvider>
            </Stack>
            <Stack padding={pxToRem(20)}>
              <Button
                variant={'contained'}
                disabled={!check.len || !check.pw || !check.match} //pw확인도 추가해야함
                size={'large'}
                onClick={(e) => {
                  onSubmit(getValues());
                }}
                sx={{ borderRadius: 3, mt: pxToRem(40), mb: pxToRem(10), py: 3, p: pxToRem(20) }}
              >
                변경하기
              </Button>
            </Stack>
            <Divider sx={{ borderBottomWidth: pxToRem(1), bgcolor: theme.palette.action.hover }} />
          </Stack>
        )}

        <List sx={{ width: '100%', py: pxToRem(20), pl: pxToRem(20) }}>
          <ListItem
            onClick={() => onDialog('withdrawal')}
            sx={{ justifyContent: 'space-between', p: 0 }}
          >
            <Typography variant={'Kor_16_b'}>
              회원탈퇴
              <Typography
                variant={'Kor_14_r'}
                component={'div'}
                sx={{ color: theme.palette.grey[500] }}
              >
                개인정보와 설정이 모두 삭제됩니다
              </Typography>
            </Typography>
            <ListItemIcon sx={{ mr: pxToRem(20) }}>
              <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
            </ListItemIcon>
          </ListItem>
        </List>
      </Stack>
      {/* 회원탈퇴 */}
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
          sx={{
            margin: '0 !important',
            zIndex: 100,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <SettingWithdrawal
            handleClose={() => {
              setOpen(false);
            }}
          />
          ;
        </Dialog>
      )}

      {/* 변경 결과 alert */}
      <Dialog
        open={openAlert}
        PaperProps={{
          sx: {
            maxWidth: 'md',
            maxHeight: '80%',
            p: '25px !important',
            borderRadius: '25px !important',
            '.MuiDialog-container > .MuiBox-root': { alignItems: 'center' },
          },
        }}
        onClose={() => {
          setOpenAlert(false);
        }}
        sx={{
          margin: '0 !important',
          zIndex: theme.zIndex.modal,
          padding: 0,
        }}
      >
        {responseStore.responseInfo.resultCode === 'S' ? (
          <Typography variant="body1">비밀번호가 변경되었습니다.</Typography>
        ) : (
          <Typography variant="body1">{responseStore.responseInfo.errorMessage} </Typography>
        )}
        <Button
          variant="contained"
          size={'medium'}
          sx={{ mt: 3, borderRadius: 3 }}
          onClick={() => {
            if (responseStore.responseInfo.resultCode === 'S') {
              setOpenAlert(false);
              logout();
              marketStore.cartStore.reset();
            } else {
              setOpenAlert(false);
            }
          }}
        >
          확인
        </Button>
      </Dialog>
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

export default SettingAccount;
