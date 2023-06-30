import { Button, Stack, Typography } from '@mui/material';
import { isObject } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models';
import {
  addMessageListener,
  CallApiToStore,
  removeMessageListener,
  sendReactNativeMessage,
} from 'src/utils/common';

type Props = {
  handleNext: VoidFunction;
};

/**
 * ## Id찾기_2-1.본인인증후찾기
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
const FindIdByMobile = observer(({ handleNext }: Props) => {
  const rootStore = useStores();
  const { userStore, loadingStore } = rootStore;
  const { REACT_APP_API_URL } = process.env;

  /**휴대폰 인증 */
  const mobileAuth = async () => {
    let url: string = `${REACT_APP_API_URL}/common/v1/user/verification`;

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

    // web
    if (data.resultCode === 'S') {
      CallApiToStore(userStore.findIdByMobile({ verifyKey: data.data }), 'api', loadingStore).then(
        () => {
          handleNext();
        },
      );
    }

    // app
    if (data.type === 'verifySuccess') {
      CallApiToStore(
        userStore.findIdByMobile({ verifyKey: data.payload.result.data }),
        'api',
        loadingStore,
      ).then(() => {
        handleNext();
      });
    }
  };

  useEffect(() => {
    try {
      document.addEventListener('message', listener);
      window.addEventListener('message', listener);
    } catch (e) {}

    return () => {
      try {
        document.removeEventListener('message', listener);
        window.removeEventListener('message', listener);
      } catch (e) {}
    };
  }, []);

  return (
    <Stack sx={{ display: 'flex', flex: 1, height: '100%' }} justifyContent={'space-between'}>
      <Typography variant={'Kor_16_r'} align={'center'}>
        본인 주민등록번호로 가입된
        <br />
        휴대폰번호로 본인확인을 합니다.
      </Typography>
      <Button
        fullWidth
        variant={'contained'}
        size={'large'}
        onClick={mobileAuth}
        sx={{ borderRadius: 3 }}
      >
        휴대폰 인증
      </Button>
    </Stack>
  );
});

export default FindIdByMobile;
