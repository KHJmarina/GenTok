import { Button, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import FormProvider from 'src/components/hook-form';
import { useStores } from 'src/models/root-store/root-store-context';
import * as Yup from 'yup';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CTextField from 'src/components/forms/CTextField';
import { useNavigate } from 'react-router-dom';
import { load, remove, save } from 'src/utils/storage';
import { useCommonContext } from '../../../components/CommonContext';

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
export const AddNick = observer(() => {
  const rootStore = useStores();
  const { userStore, loadingStore } = rootStore;

  const common = useCommonContext();

  const navigate = useNavigate();

  const { REACT_APP_API_URL } = process.env;
  const cheerio = require('cheerio');

  const valid = Yup.object({
    nick: Yup.string().min(1, '1자 이상 등록해주세요').max(12, '최대 12자 이내로 등록해주세요.'),
  });
  const methods = useForm<any>({
    resolver: yupResolver(valid),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      nick: userStore.user.userNm,
    },
  });

  const {
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async () => {
    if (_.isEmpty(errors)) {
      userStore.setUserName(getValues('nick'));
      const regist = await load('report_regist');
      if (regist !== '' && regist !== null) {
        common.onReportRegist(regist);
      } else {
        navigate('/report', { replace: true });
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 3,
        }}
      >
        <Box sx={{ textAlign: 'left', mt: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 500 }}>
            닉네임을
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 500, mb: 1.5 }}>
            등록해주세요.
          </Typography>
          <Typography variant="body2">원하시는 닉네임을 설정해주세요.</Typography>
          <Typography variant="body2" sx={{ mb: 4 }}>
            (최대 12자))
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <CTextField
              name={'nick'}
              label={''}
              variant={'standard'}
              sx={{ fontSize: 20, paddingBottom: 12 }}
            />
          </FormProvider>
        </Box>

        <Stack direction={'row'}>
          <Button
            variant={'contained'}
            color={'secondary'}
            size={'large'}
            sx={{ flex: 1, borderRadius: 5 }}
            onClick={onSubmit}
          >
            확인
          </Button>
        </Stack>
      </Box>
    </>
  );
});

export default AddNick;
