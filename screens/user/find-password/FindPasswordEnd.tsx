import { Button, Stack, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import Iconify from 'src/components/iconify';
import { PATH_AUTH } from 'src/routes/paths';
import { useNavigate } from 'react-router-dom';
import { pxToRem } from 'src/theme/typography';

type Props = {
  handleClose: VoidFunction;
};

/**
 * ## 비밀번호 찾기_4.비밀번호 변경 완료
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */

export const FindPasswordEnd = observer(({ handleClose }: Props) => {
  const theme = useTheme();

  const navigate = useNavigate();
  useEffect(() => {}, []);

  return (
    <>
      <Stack
        justifyContent={'space-between'}
        sx={{ flex: 1, height: '100%', scrollMarginTop: '100px', pb: pxToRem(40), px: pxToRem(20) }}
      >
        <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Iconify
            icon={'material-symbols:lock'}
            width={pxToRem(60)}
            color={theme.palette.primary.main}
          />
          <Typography variant={'Kor_28_r'} align={'center'} sx={{ mt: pxToRem(24) }}>
            비밀번호가
            <br />
            변경되었습니다.
          </Typography>
        </Stack>
        <Stack>
          <Button
            size="large"
            variant="contained"
            sx={{ borderRadius: 3, width: '100%' }}
            onClick={() => {
              navigate(PATH_AUTH.login, { replace: true });
            }}
          >
            로그인
          </Button>
        </Stack>
      </Stack>
    </>
  );
});

export default FindPasswordEnd;
