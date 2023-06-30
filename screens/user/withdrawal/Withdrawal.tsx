import { Button, IconButton, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/models/root-store/root-store-context';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTheme } from '@mui/material/styles';
import { sendReactNativeMessage } from 'src/utils/common';

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
type Props = {
  handleClose: VoidFunction;
};
export const Withdrawal = observer(({ handleClose }: Props) => {
  const rootStore = useStores();
  const { userStore, loadingStore } = rootStore;

  const theme = useTheme();

  const onWithdrawal = () => {
    sendReactNativeMessage({
      type: 'withdrawal',
      payload: {
        data: 'withdrawal',
      },
    });
  };

  const text = userStore.user.loginId !== '' ? '탈퇴하기' : '내 정보 삭제';

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            background: '#FFFFFF',
            textAlign: 'center',
            p: 2,
          }}
        >
          <IconButton sx={{ position: 'absolute', left: 8, top: 11 }} onClick={handleClose}>
            <ArrowBackIosIcon fontSize={'small'} />
          </IconButton>
          <Typography variant={'h5'}>{text}</Typography>

          <Box sx={{ textAlign: 'left', p: 2, pt: 5 }}>
            <Typography variant={'body1'}>{text} 전 유의사항을 반드시 읽어주세요</Typography>
            <Typography variant={'body2'} sx={{ pt: 5, fontWeight: 900 }}>
              * 유의사항
            </Typography>
            <Typography variant={'body2'} sx={{ pt: 5 }}>
              GenTok 앱을 통해 입력하신 정보는 모두 삭제됩니다. 단, 의료법 및 생명윤리법에 근거하여
              의료기관과 유전자 검사 기관에 저장된 정보는 삭제되지 않습ㄴ다.
            </Typography>
          </Box>
        </Box>
        <Stack direction={'row'}>
          <Button
            variant={'contained'}
            color={'secondary'}
            size={'large'}
            sx={{ flex: 1, borderRadius: 0 }}
            onClick={onWithdrawal}
          >
            {text}
          </Button>
        </Stack>
      </Box>
    </>
  );
});

export default Withdrawal;
