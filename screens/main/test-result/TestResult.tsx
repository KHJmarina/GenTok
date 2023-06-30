import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import { Button, Stack, Typography, useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import Mycandy from 'src/screens/user/mypage/mycandy/Mycandy';
import DnaProgress from 'src/screens/user/mypage/dna-progress/DnaProgress';
import { PATH_AUTH, PATH_ROOT } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import { IMypage } from 'src/models';
import { CallApiToStore } from 'src/utils/common';
import { useAuthContext } from 'src/auth/useAuthContext';
import { HEADER } from 'src/config-global';
import { Icon } from '@iconify/react';

/**
 * ## TestResult 설명
 *
 */
export const TestResult = observer(() => {

  const rootStore = useStores();
  const { loadingStore, mypageStore, pointStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();

  const [mypageData, setMypageData] = useState<IMypage>();

  useEffect(() => {
    if (isAuthenticated) {
      CallApiToStore(mypageStore.get(), 'api', loadingStore).then(() => {
        setMypageData(mypageStore.mypage);
      });
    }
  }, [mypageStore.mypage.order?.purchsConfirmYn]);

  return (
    <>
      {isAuthenticated && mypageData && <Box
        position={'relative'}
        width={'100%'}
        top={10}
        left={0}
        paddingTop={pxToRem(30)}
        display={'flex'}
        // alignItems={'flex-start'}
        flexDirection={'column'}
        sx={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          textAlign: 'center',
        }}
      >
        <Stack
          direction={'column'}
          justifyContent={'center'}
          sx={{ height: '100%', width: '100%' }}
        >
          <Stack mb={1}>
            <Stack direction={'row'} sx={{
              px: 2.5,
              mb: 1,
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              {/* 제목 */}
              <Typography variant='Kor_22_b' sx={{ textAlign: 'left' }}>나의 검사 결과</Typography>
              <Stack
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`${PATH_ROOT.user.mypage.dnaResult}?ctegrySid=0&page=slide`)}
              >
                <Typography component='span' color='#000000' sx={{
                  fontSize: pxToRem(22),
                  fontWeight: 600,
                  textAlign: 'right',
                }}>
                  {mypageData.myDnaTestResult?.cnt}
                  <Typography
                    component='span' color='#DFE0E2' sx={{
                      fontSize: pxToRem(22),
                      fontWeight: '300',
                      fontFamily: '-apple-system,sans-serif',
                      textAlign: 'right'
                    }}
                  >/</Typography>
                  <Typography component='span' color='#DFE0E2' sx={{
                    fontSize: pxToRem(22),
                    fontWeight: 600,
                    textAlign: 'right',
                  }}>{`${mypageData.myDnaTestResult?.totalCnt}`}</Typography>
                </Typography>
              </Stack>
            </Stack>

            {/* progress bar */}
            <Box px={2.5} mb={5}>
              <DnaProgress totalCnt={mypageData.myDnaTestResult?.totalCnt} cnt={mypageData.myDnaTestResult?.cnt} />
            </Box>

            {/* 유전자 */}
            <Mycandy data={mypageData.myDnaTestResult?.ctegryResultList} />

            {/* 이동버튼 */}
            <Stack sx={{ justifyContent: 'center', width: '100%', px: pxToRem(20), pt: pxToRem(20) }}>
              <Button
                variant={'contained'}
                disabled={false}
                size={'large'}
                type={'submit'}
                sx={{
                  borderRadius: pxToRem(50),
                  fontWeight: 600,
                  lineHeight: 24 / 16,
                  fontSize: pxToRem(16),
                  letterSpacing: '-0.03em',
                  pt: pxToRem(12),
                }}
                onClick={() => navigate(`${PATH_ROOT.user.mypage.dnaResult}?ctegrySid=0&page=slide`)}
              >
                검사결과 확인하기<Box component={Icon} icon={'ep:arrow-right-bold'} sx={{ cursor: 'pointer', color: '#ffffff', ml: 1 }}></Box>
              </Button>
            </Stack>

          </Stack>
        </Stack>
      </Box>}
    </>
  );
});

export default TestResult;