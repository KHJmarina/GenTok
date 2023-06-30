import { Button, Stack, Typography, Tabs, Tab, Box, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';
import { PATH_AUTH } from 'src/routes/paths';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { useStores } from 'src/models';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-arrow-left.svg';
import { pxToRem } from 'src/theme/typography';
import BackHeader from 'src/components/BackHeader';
import CAlert from 'src/components/CAlert';
import { useState } from 'react';
import { async } from '@firebase/util';
import { ReactComponent as IcoKakao } from 'src/assets/icons/ico-kakao.svg';
import { ReactComponent as IcoNaver } from 'src/assets/icons/ico-naver.svg';
import { ReactComponent as IcoFacebook } from 'src/assets/icons/ico-facebook.svg';
import { ReactComponent as IcoApple } from 'src/assets/icons/ico-apple.svg';
import { ReactComponent as IcoGoogle } from 'src/assets/icons/ico-google.svg';

type Props = {
  handleClose: VoidFunction;
  defaultTab: string;
};

/**
 * ## Id찾기_3.결과화면
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
const FindUserEnd = observer(({ defaultTab, handleClose }: Props) => {
  const rootStore = useStores();
  const { userStore, responseStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  const { REACT_APP_API_URL } = process.env;

  const email = userStore.user.loginId || null;
  const mobileNum = userStore.user.phoneNo;

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [disabled, setDisabled] = useState(false);

  /**아이디 전송 */
  const sendId = async (type: string) => {
    setDisabled(true);
    const data = { key: userStore.user.key };
    await fetch(`${REACT_APP_API_URL}/common/v1/user/find/loginid/send/${type}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(async (res) => {
      setDisabled(false);
      const json = await res.json();
      if (json.resultCode === 'S') {
        setAlertMsg('가입된 정보로 아이디가 발송되었습니다.');
        setIsAlertOpen(true);
      } else {
        setAlertMsg(json.errorMessage);
        setIsAlertOpen(true);
      }
    });
  };

  const snsinfo: any = {
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

  return (
    <>
      <Stack
        justifyContent={'space-between'}
        sx={{ flex: 1, height: '100%', scrollMarginTop: '100px' }}
      >
        <BackHeader
          title={'아이디 찾기'}
          handleClose={() => {
            window.history.back();
          }}
        />

        <TabContext value={defaultTab}>
          <Stack display={'flex'} flex={1} sx={{ flex: 1 }}>
            <Stack sx={{ borderBottom: 1, borderColor: 'divider', mb: pxToRem(56) }}>
              <Tabs
                value={defaultTab}
                onChange={handleClose}
                variant="fullWidth"
                aria-label="find id tabs"
                sx={{
                  fontVariant: 'Kor_16_b',
                  '& .MuiTab-root': {
                    m: '0 !important',
                  },
                }}
              >
                <Tab
                  label="본인인증 후 찾기"
                  sx={{
                    width: '50%',
                    '&:not(.Mui-selected)': {
                      color: theme.palette.grey[400],
                    },
                  }}
                  value={'tab1'}
                />
                <Tab
                  label="회원 정보로 찾기"
                  sx={{
                    width: '50%',
                    '&:not(.Mui-selected)': {
                      color: theme.palette.grey[400],
                    },
                  }}
                  value={'tab2'}
                />
              </Tabs>
            </Stack>

            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flex: 1,
                width: '100%',
              }}
            >
              {/* Tab1 */}
              <TabPanel
                value={'tab1'}
                sx={{
                  width: '100%',
                  padding: `0 ${pxToRem(20)} ${pxToRem(40)} ${pxToRem(20)}`,
                }}
              >
                <Stack
                  sx={{ display: 'flex', width: '100%', flex: 1, height: '100%' }}
                  justifyContent={'space-between'}
                >
                  {responseStore.responseInfo.resultCode === 'S' &&
                    userStore.user.loginId !== '' && (
                      <>
                        <Stack>
                          <Typography
                            variant={'Kor_16_r'}
                            component={'h4'}
                            align={'center'}
                            mb={pxToRem(4)}
                          >
                            회원님의 아이디입니다.
                          </Typography>
                          <Typography variant="Eng_18_b" align="center">
                            {email}
                          </Typography>
                        </Stack>
                        <Stack direction={'row'} gap={pxToRem(12)} width={'100%'}>
                          <Button
                            variant={'outlined'}
                            size={'large'}
                            onClick={() => {
                              navigate(PATH_AUTH.findPassword, { replace: true });
                            }}
                            sx={{
                              mt: 'auto',
                              width: '100%',
                              borderRadius: 3,
                            }}
                          >
                            비밀번호 찾기
                          </Button>
                          <Button
                            fullWidth
                            variant={'contained'}
                            size={'large'}
                            onClick={() => {
                              navigate(PATH_AUTH.login, {
                                state: { loginId: email },
                                replace: true,
                              });
                            }}
                            sx={{
                              borderRadius: 3,
                            }}
                          >
                            로그인
                          </Button>
                        </Stack>
                      </>
                    )}

                  {responseStore.responseInfo.resultCode === 'S' &&
                    userStore.user.loginId === '' && (
                      <>
                        <Stack>
                          <Typography variant={'Kor_16_r'} align={'center'}>
                            아래의 sns 계정으로만 가입되어있습니다.
                          </Typography>

                          <Stack
                            direction={'row'}
                            sx={{
                              width: '100%',
                              gap: pxToRem(16),
                              justifyContent: 'center',
                            }}
                          >
                            {userStore.user.snsTypeCdList &&
                              userStore.user.snsTypeCdList.map(
                                (
                                  row: {
                                    code: number | null;
                                    value: string | null;
                                    pcode: number | null;
                                  },
                                  i: number,
                                ) => {
                                  return (
                                    <Stack
                                      key={`sns-info-${i}`}
                                      mt={pxToRem(30)}
                                      sx={{
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          height: pxToRem(50),
                                          width: pxToRem(50),
                                          color: row.value && snsinfo[row.value].color,
                                          background: row.value && snsinfo[row.value].bg,
                                          borderRadius: '50%',
                                          mb: pxToRem(8),
                                        }}
                                      >
                                        {row.value && snsinfo[row.value].ico}
                                      </Box>
                                      <Typography variant="Kor_16_b" align="center">
                                        {row.value && snsinfo[row.value].text}
                                      </Typography>
                                    </Stack>
                                  );
                                },
                              )}
                          </Stack>
                        </Stack>

                        <Stack direction={'row'} gap={1}>
                          <Button
                            variant={'outlined'}
                            size={'large'}
                            onClick={() => {
                              navigate(PATH_AUTH.login, { replace: true });
                            }}
                            sx={{ mt: 'auto', width: '100%', borderRadius: 3 }}
                          >
                            로그인
                          </Button>
                          <Button
                            fullWidth
                            variant={'contained'}
                            size={'large'}
                            onClick={() => {
                              navigate(PATH_AUTH.register, { replace: true });
                            }}
                            sx={{ borderRadius: 3, mt: 'auto', width: '100%' }}
                          >
                            회원가입
                          </Button>
                        </Stack>
                      </>
                    )}

                  {responseStore.responseInfo.resultCode !== 'S' && (
                    <>
                      <Typography variant={'Kor_16_r'} align={'center'}>
                        {responseStore.responseInfo.errorMessage}
                      </Typography>
                      <Button
                        fullWidth
                        variant={'contained'}
                        size={'large'}
                        onClick={() => {
                          navigate(PATH_AUTH.register, { replace: true });
                        }}
                        sx={{
                          mt: 'auto',
                          width: '100%',
                          borderRadius: 3,
                        }}
                      >
                        회원가입 하러가기
                      </Button>
                    </>
                  )}
                </Stack>
              </TabPanel>

              {/* Tab2 */}
              <TabPanel
                value={'tab2'}
                sx={{
                  width: '100%',
                  padding: `0 ${pxToRem(20)} ${pxToRem(40)} ${pxToRem(20)}`,
                }}
              >
                <Stack
                  sx={{ display: 'flex', width: '100%', flex: 1, height: '100%' }}
                  justifyContent={'space-between'}
                >
                  {responseStore.responseInfo.resultCode === 'S' &&
                    userStore.user.loginId !== '' && (
                      <>
                        <Stack flex={1} alignItems={'center'}>
                          <Typography variant={'Kor_16_r'} mb={pxToRem(4)}>
                            회원님의 아이디입니다.
                          </Typography>
                          <Typography variant="Eng_18_b">{email}</Typography>

                          <Stack
                            display={'flex'}
                            flexDirection={'column'}
                            width={'100%'}
                            gap={pxToRem(10)}
                            p={pxToRem(24)}
                            mt={pxToRem(32)}
                            sx={{
                              backgroundColor: theme.palette.grey[200],
                              borderRadius: pxToRem(10),
                            }}
                          >
                            <Stack
                              direction={'row'}
                              display={'flex'}
                              justifyContent={'space-between'}
                              alignItems={'center'}
                            >
                              <Typography
                                variant="Kor_16_r"
                                maxWidth={'70%'}
                                sx={{ wordBreak: 'break-all' }}
                              >
                                {email}
                              </Typography>
                              <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                sx={{
                                  borderRadius: 3,
                                  fontWeight: 300,
                                  color: theme.palette.common.black,
                                  '&:disabled': {
                                    fontSize: ' .8rem',
                                  },
                                }}
                                onClick={() => {
                                  sendId('email');
                                }}
                                disabled={disabled}
                              >
                                아이디 발송
                              </Button>
                            </Stack>
                            <Stack
                              direction={'row'}
                              justifyContent={'space-between'}
                              alignItems={'center'}
                            >
                              <Typography variant="Kor_16_r">{mobileNum}</Typography>
                              <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                sx={{
                                  borderRadius: 3,
                                  fontWeight: 300,
                                  color: theme.palette.common.black,
                                  '&:disabled': {
                                    fontSize: ' .8rem',
                                  },
                                }}
                                onClick={() => {
                                  sendId('sms');
                                }}
                                disabled={disabled}
                              >
                                아이디 발송
                              </Button>
                            </Stack>
                          </Stack>
                          <Typography
                            mt={pxToRem(20)}
                            variant="Kor_12_r"
                            color={theme.palette.grey[500]}
                          >
                            ※ 회원정보에 등록된 이메일/휴대폰번호로 아이디가 발송됩니다.
                          </Typography>
                        </Stack>
                        <Stack direction={'row'} gap={1}>
                          <Button
                            variant={'outlined'}
                            size={'large'}
                            onClick={() => {
                              navigate(PATH_AUTH.findPassword, { replace: true });
                            }}
                            sx={{ mt: 'auto', width: '100%', borderRadius: 3 }}
                          >
                            비밀번호 찾기
                          </Button>
                          <Button
                            variant={'contained'}
                            size={'large'}
                            onClick={() => {
                              navigate(PATH_AUTH.login, { replace: true });
                            }}
                            sx={{ mt: 'auto', width: '100%', borderRadius: 3 }}
                          >
                            로그인
                          </Button>
                        </Stack>
                      </>
                    )}
                  {responseStore.responseInfo.resultCode === 'S' &&
                    userStore.user.loginId === '' && (
                      <>
                        <Stack>
                          <Typography variant={'Kor_16_r'} align={'center'}>
                            아래의 sns 계정으로만 가입되어있습니다.
                          </Typography>

                          <Stack
                            direction={'row'}
                            sx={{
                              width: '100%',
                              gap: pxToRem(16),
                              justifyContent: 'center',
                            }}
                          >
                            {userStore.user.snsTypeCdList &&
                              userStore.user.snsTypeCdList.map(
                                (
                                  row: {
                                    code: number | null;
                                    value: string | null;
                                    pcode: number | null;
                                  },
                                  i: number,
                                ) => {
                                  return (
                                    <Stack
                                      key={`sns-info-${i}`}
                                      mt={pxToRem(30)}
                                      sx={{
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          height: pxToRem(50),
                                          width: pxToRem(50),
                                          color: row.value && snsinfo[row.value].color,
                                          background: row.value && snsinfo[row.value].bg,
                                          borderRadius: '50%',
                                          mb: pxToRem(8),
                                        }}
                                      >
                                        {row.value && snsinfo[row.value].ico}
                                      </Box>
                                      <Typography variant="Kor_16_b" align="center">
                                        {row.value && snsinfo[row.value].text}
                                      </Typography>
                                    </Stack>
                                  );
                                },
                              )}
                          </Stack>
                        </Stack>

                        <Stack direction={'row'} gap={1}>
                          <Button
                            variant={'outlined'}
                            size={'large'}
                            onClick={() => {
                              navigate(PATH_AUTH.login, { replace: true });
                            }}
                            sx={{ mt: 'auto', width: '100%', borderRadius: 3 }}
                          >
                            로그인
                          </Button>
                          <Button
                            fullWidth
                            variant={'contained'}
                            size={'large'}
                            onClick={() => {
                              navigate(PATH_AUTH.register, { replace: true });
                            }}
                            sx={{ borderRadius: 3, mt: 'auto', width: '100%' }}
                          >
                            회원가입
                          </Button>
                        </Stack>
                      </>
                    )}
                  {responseStore.responseInfo.resultCode !== 'S' && (
                    <>
                      <Typography variant={'Kor_16_r'} align={'center'}>
                        {responseStore.responseInfo.errorMessage}
                      </Typography>
                      <Button
                        fullWidth
                        variant={'contained'}
                        size={'large'}
                        onClick={() => {
                          navigate(PATH_AUTH.register, { replace: true });
                        }}
                        sx={{ borderRadius: 3, mt: 'auto', width: '100%' }}
                      >
                        회원가입 하러가기
                      </Button>
                    </>
                  )}
                </Stack>
              </TabPanel>
            </Box>
          </Stack>
        </TabContext>
      </Stack>
      <CAlert
        isAlertOpen={isAlertOpen}
        alertCategory={'f2d'}
        alertContent={alertMsg}
        handleAlertClose={() => {
          setIsAlertOpen(false);
        }}
      />
    </>
  );
});

export default FindUserEnd;
