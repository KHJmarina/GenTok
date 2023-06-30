import { Typography, Button, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@mui/material';
import { useStores } from 'src/models';
import { pxToRem } from 'src/theme/typography';
/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */

interface propTypes {
  handleClose: VoidFunction;
}

export const InquiryDetail = observer(({ handleClose }: propTypes) => {
  const theme = useTheme();
  const rootStore = useStores();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto',
        }}
      >
        <Typography variant={'Kor_28_b'} sx={{ textAlign: 'center', mb: pxToRem(20) }}>
          1:1문의가
          <br />
          접수 되었습니다.
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            minWidth: pxToRem(300),
            margin: 'auto',
            mb: pxToRem(20),
            color: theme.palette.grey[500],
          }}
        >
          문의에 대한 답변은 <b>[나의 문의 내역]</b>에서
          <br /> 확인하실 수 있습니다.
        </Typography>
        <Stack justifyContent={'space-between'} sx={{ flex: 1, height: '100%' }}>
          <Button
            variant={'contained'}
            size={'large'}
            onClick={handleClose}
            sx={{ borderRadius: pxToRem(50), minWidth: pxToRem(170), margin: 'auto' }}
          >
            나의 문의 내역
          </Button>
        </Stack>
      </Box>
    </>
  );
});
