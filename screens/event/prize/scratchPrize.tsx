import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useStores } from "../../../models/root-store/root-store-context"
import { Button, Stack, Typography } from '@mui/material';
import CHeader from 'src/components/CHeader';
import { pxToRem } from 'src/theme/typography';
import './flipclock.css';
import { ReactComponent as PrizeAlreadyDone } from 'src/assets/images/scratch-alreadyDone.svg';
import { useNavigate } from 'react-router';

/**
 * ## Prize 설명
 *
 */
type Props = {
  handleClose: VoidFunction;
  resultData: any;
}
export const ScratchPrize = observer(({ handleClose, resultData }: Props) => {
  const rootStore = useStores();

  const navigate = useNavigate();

  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: () => {
      handleClose();
    },
    showHomeIcon: true,
  };

  return (
    <>
      <Box sx={{ background: '#FFF' }}>
        <CHeader title={'이벤트'} {...options} />
        <Stack sx={{ display: 'flex', flex: 1, height: '100%', px: pxToRem(20), py: pxToRem(20), justifyContent: 'space-between', textAlign: 'center', }}
        >
          {
            resultData && resultData.errorCode === 'EVENT-9002' ?
              <>
                <Stack sx={{ alignItems: 'center' }}>
                  <Stack sx={{ justifyContent: 'center', pt: pxToRem(10) }}>
                    <Typography sx={{ fontWeight: 700, lineHeight: pxToRem(32), fontSize: pxToRem(30), wordBreak: 'keep-all', color: '#FF7F3F' }}>
                      이미 참여하셨군요
                    </Typography>
                    <Typography variant={'Kor_16_r'} sx={{ textAlign: 'center', py: pxToRem(15), color: '#5D6066' }}>
                      내일 다시 도전해 보세요!
                    </Typography>
                    <PrizeAlreadyDone style={{ width: '220px', height: '220px' }} />
                  </Stack>

                  <Button
                    size={'large'}
                    onClick={() => {
                      // handleClose()
                      navigate('/')
                    }}
                    disabled={false}
                    variant={'contained'}
                    sx={{
                      height: pxToRem(60),
                      maxWidth: 'md',
                      width: '100%',
                      borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
                      position: 'fixed',
                      bottom: 0
                    }}
                  >
                    <Typography variant="Eng_16_b">
                      확인
                    </Typography>
                  </Button>
                </Stack>
              </>
              :
              <>
                <Stack sx={{ alignItems: 'center' }}>
                  <Stack sx={{ justifyContent: 'center', pt: pxToRem(10) }}>
                    <Typography sx={{ fontWeight: 700, lineHeight: pxToRem(32), fontSize: pxToRem(30), wordBreak: 'keep-all', color: '#FF7F3F' }}>
                      이미 당첨되셨군요!
                    </Typography>
                    <Typography variant={'Kor_16_r'} sx={{ textAlign: 'center', py: pxToRem(15), color: '#5D6066' }}>
                      반값 찬스 쿠폰은 <br /> 한 번만 발급 가능합니다.
                    </Typography>
                    <PrizeAlreadyDone style={{ width: '220px', height: '220px' }} />
                  </Stack>
                  <Button
                    size={'large'}
                    onClick={() => {
                      // handleClose()
                      navigate('/')
                    }}
                    disabled={false}
                    variant={'contained'}
                    sx={{
                      height: pxToRem(60),
                      maxWidth: 'md',
                      width: '100%',
                      borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
                      position: 'fixed',
                      bottom: 0
                    }}
                  >
                    <Typography variant="Eng_16_b">
                      확인
                    </Typography>
                  </Button>
                </Stack>
              </>
          }
        </Stack>
      </Box>
    </>
  );
});

export default ScratchPrize;
