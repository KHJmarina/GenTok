import { alpha, Stack, styled, Switch, SwitchProps, useTheme } from '@mui/material';
import { pink } from '@mui/material/colors';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import BackHeader from 'src/components/BackHeader';
import CFormSetItem from 'src/components/CFormSetItem';
import { CustomerHeader } from 'src/components/CustomerHeader';
import FormProvider from 'src/components/hook-form';
import { HEADER } from 'src/config-global';
import { useStores } from 'src/models/root-store/root-store-context';
import theme from 'src/theme';
import { pxToRem } from 'src/theme/typography';
import { CallApiToStore } from 'src/utils/common';
import AlarmSwitch from './AlarmSwitch';

/**
 * ## Alarm 설명
 *
 */

type Props = {
  handleClose: VoidFunction;
};
export const SettingAlarm = observer(({ handleClose }: Props) => {
  const rootStore = useStores();
  const { loadingStore, settingAlarmStore } = rootStore;
  const [loading, setLoading] = useState(true);
  const methods = useForm<any>({});
  const theme = useTheme();

  // 알림 목록 조회
  const getSettingAlarmList = async () => {
    CallApiToStore(settingAlarmStore.get(), 'api', loadingStore).then(() => {
      setLoading(false);
    });
  };

  // 알림 변경
  const onChangeCallback = (e: any) => {
    CallApiToStore(settingAlarmStore.update(e.target), 'api', loadingStore);
  };

  useEffect(() => {
    getSettingAlarmList();
  }, []);

  return (
    <>
      <BackHeader title="알림설정" handleClose={handleClose} />
      <Stack
        sx={{
          flex: 1,
          pb: `${HEADER.H_MOBILE * 2}px`,
          overflowY: 'auto',
          scrollMarginTop: pxToRem(100),
        }}
      >
        <Stack
          sx={{
            pt: pxToRem(13),
            pl: pxToRem(20),
            pr: pxToRem(8),
          }}
        >
          {!loading && (
            <FormProvider methods={methods}>
              <CFormSetItem sx={{ width: '100%' }}>
                <AlarmSwitch
                  size={'medium'}
                  label={'푸시알림'}
                  name={'push'}
                  defaultValue={settingAlarmStore.settingAlarm.pushNotifYn}
                  sx={{
                    ...AlarmStyle,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                  onChangeCallback={onChangeCallback}
                ></AlarmSwitch>
                <AlarmSwitch
                  size={'medium'}
                  label={'이벤트/프로모션 알림'}
                  name={'event'}
                  sx={{
                    ...AlarmStyle,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                  defaultValue={settingAlarmStore.settingAlarm.eventNotifYn}
                  onChangeCallback={onChangeCallback}
                ></AlarmSwitch>
                <AlarmSwitch
                  size={'medium'}
                  label={'마케팅 정보 알림'}
                  name={'marketing'}
                  sx={{
                    ...AlarmStyle,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                  defaultValue={settingAlarmStore.settingAlarm.mktgNotifYn}
                  onChangeCallback={onChangeCallback}
                ></AlarmSwitch>
                <AlarmSwitch
                  size={'medium'}
                  label={'이메일 수신'}
                  name={'email'}
                  sx={{
                    ...AlarmStyle,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                  defaultValue={settingAlarmStore.settingAlarm.emailNotifYn}
                  onChangeCallback={onChangeCallback}
                ></AlarmSwitch>
                <AlarmSwitch
                  size={'medium'}
                  label={'알림/SMS 수신'}
                  name={'sms'}
                  sx={{
                    ...AlarmStyle,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                  defaultValue={settingAlarmStore.settingAlarm.smsNotifYn}
                  onChangeCallback={onChangeCallback}
                ></AlarmSwitch>
              </CFormSetItem>
            </FormProvider>
          )}
        </Stack>
      </Stack>
    </>
  );
});

const AlarmStyle = {
  '& .MuiFormControlLabel-root': {
    p: 0,
    '& .MuiFormHelperText-root': {
      display: `none !important`,
    },
    ' & .MuiTypography-root': {
      fontWeight: 400,
      lineHeight: 32 / 16,
      fontSize: pxToRem(16),
      letterSpacing: '-0.01em',
      wordBreak: 'keep-all',
    },
    '& .MuiSwitch-root': {
      width: '72px',
      height: '42px',
      '& .MuiButtonBase-root': {
        width: '-180px',
        '& .MuiSwitch-thumb': {
          width: 19,
          height: 18,
          boxShadow: 'none',
          color: `#ffffff !important`,
          transform: 'translateX(0px)',
        },
        ' .MuiTouchRipple-root': {
          transform: 'translateX(50px)',
        },
      },
    },
  },
  '& .MuiSwitch-switchBase': {
    left: 3,
    padding: 12,
    '&.Mui-checked': {
      transform: `translateX(22px) !important`,
    },
    '&.Mui-disabled': {
      '& .MuiSwitch-thumb': { opacity: 1 },
      '&+.MuiSwitch-track': { opacity: 0.48 },
    },
  },
};

export default SettingAlarm;
