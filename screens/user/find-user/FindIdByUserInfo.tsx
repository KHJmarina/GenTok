import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme, Stack, Button, FormControlLabelProps } from '@mui/material';
import { values } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useStores } from 'src/models';
import { IUserSnapshot } from 'src/models/user/user';
import { pxToRem } from 'src/theme/typography';
import { CallApiToStore } from 'src/utils/common';
import * as Yup from 'yup';

type Props = {
  handleNext: VoidFunction;
};

/**
 * ## Id찾기_2-2.회원정보로찾기
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
const FindIdByUserInfo = observer(({ handleNext }: Props) => {
  const theme = useTheme();
  const rootStore = useStores();
  const { userStore, loadingStore } = rootStore;
  const [btnDisabled, setBtnDisabled] = useState(false);

  const findIdSchema = Yup.object().shape({
    userNm: Yup.string().required('이름을 입력해주세요').trim(),
    phoneNo: Yup.string()
      .required('휴대폰 번호를 입력해주세요')
      .matches(/^[0-9]{2,3}[0-9]{3,4}[0-9]{4}$/, '형식에 맞지 않는 휴대폰 번호입니다.'),
  });

  const defaultValues = {
    userNm: '',
    phoneNo: '',
  };

  const methods = useForm<IUserSnapshot>({
    resolver: yupResolver(findIdSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    setError,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data: IUserSnapshot) => {
    CallApiToStore(userStore.findIdByUserInfo(data), 'api', loadingStore).then(() => {
      handleNext();
    });
  };

  return (
    <Stack
      flex={1}
      sx={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'space-between' }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <RHFTextField
          name="userNm"
          label="이름"
          type={'text'}
          variant={'standard'}
          sx={{ mb: pxToRem(16) }}
          onKeyUp={(e: any) => {
            e.target.value = e.target.value.replace(/\s/gi, '');
          }}
        />
        <RHFTextField
          name="phoneNo"
          label="휴대폰 번호"
          type={'tel'}
          variant={'standard'}
          onKeyUp={(e: any) => {
            e.target.value = e.target.value.replace(/[^0-9]/gi, '');
          }}
          inputProps={{
            maxLength: 11,
          }}
        />
      </FormProvider>
      <Button
        disabled={btnDisabled && isSubmitting}
        variant={'contained'}
        size={'large'}
        onClick={handleSubmit(onSubmit)}
        sx={{ borderRadius: 3 }}
      >
        확인
      </Button>
    </Stack>
  );
});

export default FindIdByUserInfo;
