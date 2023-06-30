import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme, Stack, Button, Chip, Typography, Dialog } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { createRef, forwardRef, useRef, useState } from 'react';
import Countdown, { CountdownApi, CountdownRenderProps, zeroPad } from 'react-countdown';
import { useForm } from 'react-hook-form';
import CAlert from 'src/components/CAlert';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import { IUserSnapshot } from 'src/models/user/user';
import { pxToRem } from 'src/theme/typography';
import * as Yup from 'yup';

type Props = {
  handleNext: VoidFunction;
  setCertifyKey: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * ## 비밀번호 찾기_2-1.휴대폰 인증
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
const FindPwByMobile = observer(({ handleNext, setCertifyKey }: Props) => {
  const theme = useTheme();
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [chpDisabled, setChpDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [isAlertOpen, setISAlertOpen] = useState(false);
  const [certiDisplay, setCertiDisplay] = useState('none');
  const [certiDisable, setCertiDisable] = useState(false);
  const { REACT_APP_API_URL } = process.env;
  const findPwSchema = Yup.object().shape({
    userNm: Yup.string().required('이름을 입력해주세요').trim(),
    loginId: Yup.string()
      .required('아이디를 입력해주세요')
      .email('형식에 맞지 않는 이메일 주소입니다.')
      .trim(),
    phoneNo: Yup.string()
      .required('휴대폰 번호를 입력해주세요')
      .matches(/^[0-9]{2,3}[0-9]{3,4}[0-9]{4}$/, '형식에 맞지 않는 휴대폰 번호입니다.'),
    certifyNo: Yup.number()
      .typeError('형식에 맞지 않는 인증번호입니다.')
      .required('인증번호를 입력해주세요'),
  });

  const defaultValues = {
    userNm: '',
    loginId: '',
    phoneNo: '',
    certifyNo: '',
  };

  const methods = useForm<any>({
    resolver: yupResolver(findPwSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const [countdownApi, setCountdownApi] = useState<CountdownApi | null>(null);
  const [tempCertiKey, setTempCertiKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [chipLabel, setChipLabel] = useState('인증번호 전송');

  const certInput = createRef<any>();

  const setRef = (countdown: Countdown | null): void => {
    if (countdown) {
      setCountdownApi(countdown.getApi());
    }
  };
  const countdownRenderer = ({ minutes, seconds }: CountdownRenderProps) => {
    if (countdownApi?.isCompleted()) {
      return <></>;
    } else if (countdownApi?.isStarted()) {
      return (
        <Typography
          sx={{
            transition: 'all .14s ease-out',
            color: theme.palette.error.light,
          }}
        >
          {zeroPad(minutes)}:{zeroPad(seconds)}
        </Typography>
      );
    }
  };

  /** 인증번호 전송 */
  const sendCertiNum = async () => {
    const data = getValues();
    await fetch(`${REACT_APP_API_URL}/common/v1/user/certify/phone`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(async (res) => {
      const temp: any = await res.json();
      setCertiDisplay('block'); // 인증번호 입력창 표시
      setChpDisabled(true); // 인증번호 전송버튼 비활성화

      if (temp.resultCode === 'S') {
        countdownApi?.start(); // 인증번호 입력 카운트다운시작
        setTempCertiKey(temp.data);
        setOpen(true); // 입력안내 모달 오픈
        setChipLabel('인증번호 재전송');
        setBtnDisabled(false);
        certInput.current?.focus();
        certInput.current.autocomplete = 'one-time-code';
      } else {
        setCertiDisplay('none');
        setErrorMessage(temp.errorMessage);
        setISAlertOpen(true);
        setChipLabel('인증번호 전송');
      }
    });
  };

  /**인증번호 확인 */
  const onSubmit = async (data: IUserSnapshot) => {
    const newData = { ...data, certifyKey: tempCertiKey };
    await fetch(`${REACT_APP_API_URL}/common/v1/user/certify/check`, {
      method: 'POST',
      body: JSON.stringify(newData),
    }).then(async (res) => {
      const temp: any = await res.json();
      if (temp.resultCode === 'S') {
        setCertifyKey(tempCertiKey);
        countdownApi?.stop();
        handleNext();
      }
      // else if (temp.errorMessage === '계정정보를 찾을 수 없습니다.') {
      //   setCertiDisplay('none'); // 인증번호 입력창 표시
      //   setChpDisabled(false);
      //   setErrorMessage(temp.errorMessage);
      //   setISAlertOpen(true);
      //   setBtnDisabled(true);
      //   setValue('certifyNo', '');
      //   countdownApi?.stop();
      // }
      else {
        setChpDisabled(false);
        setErrorMessage(temp.errorMessage);
        setISAlertOpen(true);
        setBtnDisabled(true);
        setValue('certifyNo', '');
      }
    });
  };

  const countDownNow = useRef(Date.now());

  return (
    <>
      <Stack
        flex={1}
        sx={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'space-between' }}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={pxToRem(16)}>
            <RHFTextField
              name="userNm"
              label="이름"
              type={'text'}
              variant={'standard'}
              onKeyUp={(e: any) => {
                setChpDisabled(
                  !!(errors.phoneNo || errors.userNm || errors.loginId) ||
                    getValues('userNm') === '' ||
                    getValues('loginId') === '' ||
                    getValues('phoneNo') === '',
                );
                e.target.value = e.target.value.replace(/\s/gi, '');
              }}
              sx={{ whiteSpace: 'pre-line' }}
            />
            <RHFTextField
              name="loginId"
              label="아이디(이메일)"
              type={'email'}
              variant={'standard'}
              onKeyUp={(e: any) => {
                setChpDisabled(
                  !!(errors.phoneNo || errors.userNm || errors.loginId) ||
                    getValues('userNm') === '' ||
                    getValues('loginId') === '' ||
                    getValues('phoneNo') === '',
                );
                e.target.value = e.target.value.replace(/\s/gi, '');
              }}
            />
            <RHFTextField
              name="phoneNo"
              label="휴대폰 번호"
              type={'tel'}
              variant={'standard'}
              onKeyUp={(e: any) => {
                setChpDisabled(
                  !!(errors.phoneNo || errors.userNm || errors.loginId) ||
                    getValues('userNm') === '' ||
                    getValues('loginId') === '' ||
                    getValues('phoneNo') === '',
                );
                e.target.value = e.target.value.replace(/[^0-9]/gi, '');
              }}
              inputProps={{
                maxLength: 11,
              }}
              InputProps={{
                endAdornment: (
                  <Chip
                    size="small"
                    label={chipLabel}
                    variant={'outlined'}
                    sx={{
                      color: theme.palette.grey[500],
                      padding: pxToRem(8),
                      mb: pxToRem(7),
                    }}
                    onClick={sendCertiNum}
                    disabled={chpDisabled}
                  />
                ),
              }}
            />

            <RHFTextField
              name="certifyNo"
              label="인증번호를 입력하세요."
              type={'tel'}
              variant={'standard'}
              onKeyUp={(e: any) => {
                // setBtnDisabled(false);
                e.target.value = e.target.value.replace(/[^0-9]/gi, '');
              }}
              // ref={certInput}
              sx={{
                display: certiDisplay,
              }}
              disabled={certiDisable}
              focused={true}
              onFocus={(e) => {
                e.target.autocomplete = 'one-time-code';
              }}
              inputProps={{
                autoComplete: 'one-time-code',
                focused: 'true',
                ref: certInput,
              }}
              InputProps={{
                endAdornment: (
                  <Countdown
                    key={'countdown'}
                    ref={setRef}
                    date={countDownNow.current + 180000}
                    renderer={countdownRenderer}
                    autoStart={false}
                    onComplete={() => {
                      setBtnDisabled(true);
                      setCertiDisable(true);
                      setCertiDisplay('none'); // 인증번호 입력창 표시
                      setChpDisabled(false);
                      countdownApi?.stop();
                    }}
                  />
                ),
              }}
            />
            {
              // <Typography align="left" variant="Kor_12_r" color={theme.palette.error.light}>
              //   {errorMessage}
              // </Typography>
            }
          </Stack>
        </FormProvider>
        <Button
          disabled={btnDisabled || isSubmitting}
          variant={'contained'}
          size={'large'}
          onClick={handleSubmit(onSubmit)}
          sx={{ borderRadius: 3 }}
        >
          다음
        </Button>
      </Stack>

      {/* alert */}
      <CAlert
        isAlertOpen={isAlertOpen}
        alertCategory={'f2d'}
        alertContent={errorMessage}
        handleAlertClose={() => {
          setISAlertOpen(false);
        }}
      />

      <Dialog
        open={open}
        PaperProps={{
          sx: {
            p: pxToRem(28),
            borderRadius: pxToRem(20),
          },
        }}
        onClose={() => {
          setOpen(false);
        }}
        sx={{
          margin: '0 !important',
          zIndex: theme.zIndex.modal,
          padding: 0,
        }}
      >
        <Typography variant="Kor_16_r" textAlign={'center'}>
          인증번호가 발송되었습니다. <br />
          3분 안에 인증번호를 입력해 주세요.
        </Typography>
        <Button
          variant="contained"
          size={'medium'}
          sx={{ mt: pxToRem(28), borderRadius: 3 }}
          onClick={() => {
            setOpen(false);
          }}
        >
          확인
        </Button>
      </Dialog>
    </>
  );
});

export default FindPwByMobile;
