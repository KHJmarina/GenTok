import { Button, MenuItem, Select, Stack, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useAuthContext } from 'src/auth/useAuthContext';
import BackHeader from 'src/components/BackHeader';
import CAlert from 'src/components/CAlert';
import CTextField, { selectOptions } from 'src/components/forms/CTextField';
import FormProvider from 'src/components/hook-form';
import { ICodeGroupSnapshot } from 'src/models';
import { IUserSnapshot } from 'src/models/user/user';
import { pxToRem } from 'src/theme/typography';
import { CallApiToStore, sendReactNativeMessage } from 'src/utils/common';
import { useStores } from '../../../models/root-store/root-store-context';

/**
 * ## SettingWithdrawal 설명
 *
 */
type Props = {
  handleClose: VoidFunction;
};
export const setSelectOption = (
  code: string | number | boolean | null,
  value: string,
  pcode: string | number | null,
) => {
  return {
    code: code ? code : null,
    value: value ? value : '',
    pcode: pcode,
  };
};
export const SettingWithdrawal = observer(({ handleClose }: Props) => {
  const rootStore = useStores();
  const { userStore, loadingStore, codeStore, marketStore } = rootStore;
  const theme = useTheme();
  const auth = useAuthContext();

  const navigate = useNavigate();

  const [alertOpen, setAlertOpen] = useState(false);
  const [handleAlertClose, setHandleAlertClose] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [options, setOptions] = useState<selectOptions[]>([]);
  const [groupCdSid, setGroupCdSid] = useState(0);
  const [directOpen, setDirectOpen] = useState(false);
  const [text, setText] = useState('');

  const defaultValues = {
    withdrawal: '',
  };

  const methods = useForm<IUserSnapshot>({
    // resolver: yupResolver(LoginSchema),
    // defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  // 탈퇴
  const onWithdrawal = async () => {
    const wthdReason: any = getValues();
    await CallApiToStore(
      userStore.withdrawal(groupCdSid, wthdReason.textAreaKey),
      'api',
      loadingStore,
    )
      .then(() => {
        auth.logout();
        marketStore.cartStore.reset();
        setDirectOpen(false);
        setAlertOpen(false);
        setTimeout(() => {
          alert('정상적으로 탈퇴되었습니다.');
        }, 100);
        sendReactNativeMessage({
          type: 'withdrawal',
          payload: {
            data: 'withdrawal',
          },
        });
        navigate('/');
      })
      .catch((e) => { });
  };
  // 탈퇴 이유 api 목록 조회
  const getsCodeGroup = async () => {
    await CallApiToStore(codeStore.getsCodeGroup(), 'api', loadingStore);
    let wList: selectOptions[] = [];
    codeStore.codeGroup.forEach((w: ICodeGroupSnapshot) => {
      const data: selectOptions = setSelectOption(w.groupCdSid, w.groupCdNm, null);
      wList.push(data);
    });
    setOptions(wList);
  };

  useEffect(() => {
    getsCodeGroup();
  }, []);

  return (
    <>
      <BackHeader title="회원 탈퇴" handleClose={handleClose} />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          pt: pxToRem(20),
          px: pxToRem(20),
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant={'Kor_22_b'} component={'div'}>
            탈퇴하기 전 확인해주세요
          </Typography>
          <Typography variant={'Kor_14_r'} sx={{ mt: pxToRem(16) }} component={'div'}>
            GenTok 탈퇴 시 삭제/유지되는 정보를 확인하세요. 한번 삭제된 정보는 복구가 불가능합니다.
          </Typography>
          <Typography
            variant={'Kor_14_r'}
            component={'div'}
            sx={{
              pt: pxToRem(16),
              ml: pxToRem(6),
              color: theme.palette.grey[500],
              lineHeight: pxToRem(25),
            }}
          >
            ・ 계정 및 프로필 정보 삭제
            <br />
            ・ 포인트 삭제 (혜택포함)
            <br />
            ・ 내 정보 삭제
            <br />・ 쿠폰 삭제
          </Typography>
          <Stack sx={{ display: 'flex' }}>
            <Typography
              variant={'Kor_16_b'}
              sx={{ textAlign: 'left', mt: pxToRem(35), mb: pxToRem(8) }}
            >
              탈퇴 사유
            </Typography>
            <FormProvider methods={methods} onSubmit={handleSubmit(onWithdrawal)}>
              <Select
                label={''}
                name={'withdrawal'}
                variant={'outlined'}
                defaultValue={0}
                fullWidth
                sx={{
                  textAlign: 'left',
                  '& .MuiSelect-select': {
                    p: pxToRem(10),
                  },
                }}
                onChange={(e: any) => {
                  setGroupCdSid(e.target.value);
                  reset();
                  setText('');
                }}
              >
                <MenuItem // MUI warning 제거를 위해
                  disabled
                  value="0"
                >
                  <span color="#DFE3E8">선택하세요</span>
                </MenuItem>
                {options.map((row: any, i: number) => {
                  return (
                    <MenuItem key={`reason-${i + 1}`} value={row.code}>
                      {row.value}
                    </MenuItem>
                  );
                })}
              </Select>

              {/* 탈퇴 이유 : 직접 입력 */}
              {groupCdSid === 17 ? (
                <Stack
                  direction="row"
                  sx={{
                    mt: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    overflow: 'auto',
                    width: '100%',
                  }}
                >
                  <Box width={'100%'} margin={'auto'} py={1}>
                    <CTextField
                      label={'탈퇴 사유를 작성해주세요'}
                      name={'textAreaKey'}
                      multiline
                      variant={'outlined'}
                      multilineHeight={50}
                      onChangeCallback={(e: any) => {
                        setText(e.target.value);
                      }}
                      maxLength={5000}
                    ></CTextField>
                  </Box>
                </Stack>
              ) : null}
            </FormProvider>
          </Stack>
        </Box>

        <Stack>
          <Button
            disabled={groupCdSid < 1 || (groupCdSid === 17 && text === '')}
            variant={'contained'}
            size={'large'}
            onClick={() => {
              setAlertOpen(true);
            }}
            sx={{ borderRadius: pxToRem(50) }}
          >
            완료
          </Button>
        </Stack>
      </Box>

      {alertOpen && (
        <CAlert
          isAlertOpen={true}
          alertTitle={'탈퇴를 진행 하시겠습니까?'}
          hasCancelButton={false}
          alertCategory={'error'}
          callBack={() => {
            onWithdrawal();
          }}
          handleAlertClose={() => {
            setAlertOpen(false);
          }}
        ></CAlert>
      )}
    </>
  );
});

export default SettingWithdrawal;
