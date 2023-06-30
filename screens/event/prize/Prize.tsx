import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import { useNavigate } from 'react-router';
import { CallApiToStore } from 'src/utils/common';
import moment from 'moment';
import { toJS } from 'mobx';
// style
import Box from '@mui/material/Box';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import CHeader from 'src/components/CHeader';
import { pxToRem } from 'src/theme/typography';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
// image
import { ReactComponent as PrizeWin } from 'src/assets/images/scratch-win.svg';
import { ReactComponent as PrizeLose } from 'src/assets/images/scratch-lose.svg';
import { ReactComponent as PrizeAlreadyDone } from 'src/assets/images/scratch-alreadyDone.svg';
import { ReactComponent as SmileIcon } from 'src/assets/images/eventResult.svg';
// flipClock
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import './flipclock.css';

/**
 * ## Prize 설명
 *
 */
type Props = {
  handleClose: VoidFunction;
  resultData: any;
}
export const Prize = observer(({ handleClose, resultData }: Props) => {

  const rootStore = useStores();
  const { eventStore, loadingStore, responseStore } = rootStore;
  const { REACT_APP_API_URL, REACT_APP_IMAGE_STORAGE } = process.env;
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();

  const [event, setEvent] = useState<any>(eventStore.event);

  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: () => {
      // navigate('/', { replace: true });
      handleClose();
    },
    showHomeIcon: true,
  };

  const getEvent = async () => {
    CallApiToStore(eventStore.get(101), 'api', loadingStore).then(() => {
      eventStore.pagination_all.setProps({ size: 10 });
      // 임시 태스트용
      event.setProps({
        // startTime: moment().add(1000, 'seconds').format('HH:mm:ss'),
        endTime: '23:59:59',
      });
      setEvent(toJS(eventStore.event));
    });
  };
  useEffect(() => {
    getEvent()
  }, [])


  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let interval: any;

    const check = () => {
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      const startTime = moment(moment().format('YYYY-MM-DD') + ' ' + event.startTime);
      const endTime = moment(moment().format('YYYY-MM-DD') + ' ' + event.endTime);

      const open = moment(now).isBetween(startTime, endTime);
      if (!open) {
        clearInterval(interval);
        setIsOpen(open);
      }
    }
    if (isOpen) {
      interval = setInterval(check, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    }
  }, [isOpen]);

  const [startTime, setStartTime] = useState<string | number | Date>(0);
  useEffect(() => {
    if (event.startTime) {

      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      const startTime = moment(moment().format('YYYY-MM-DD') + ' ' + event.startTime);
      const endTime = moment(moment().format('YYYY-MM-DD') + ' ' + event.endTime);

      const open = moment(now).isBetween(startTime, endTime);
      setIsOpen(isOpen => isOpen = open);

      setStartTime(moment(moment().format('YYYY-MM-DD') + ' ' + event.startTime).toDate().getTime())
    }
  }, [event])

  return (
    <>
      <Box sx={{ background: '#FFF' }}>
        <CHeader title={'이벤트'} {...options} />
        <Stack
          sx={{
            display: 'flex',
            flex: 1,
            height: '100%',
            px: pxToRem(20),
            py: pxToRem(20),
            justifyContent: 'space-between',
            textAlign: 'center',
          }}
        >
          {
            resultData && resultData.data?.success ?
              <>
                <Stack sx={{ alignItems: 'center' }}>
                  <Stack sx={{ justifyContent: 'center', pt: pxToRem(10) }}>
                    <Typography sx={{ fontWeight: 700, lineHeight: pxToRem(32), fontSize: pxToRem(30), wordBreak: 'keep-all', color: '#FF7F3F' }}>축하합니다!</Typography>
                    <Typography variant={'Kor_16_r'} sx={{ textAlign: 'center', py: pxToRem(15), color: '#5D6066' }}>
                      오늘의 좋은 기운과 함께<br /> 젠톡 All Package 무료 쿠폰을 넣어드렸어요
                    </Typography>
                    <PrizeWin style={{ width: '220', height: '220' }} />
                  </Stack>


                  <Stack sx={{ textAlign: 'left', pt: pxToRem(30), pb: pxToRem(80) }}>
                    <Typography variant={'Kor_12_r'}>・ 발행된 쿠폰은{' '}
                      <p style={{ color: theme.palette.primary.main, display: 'inline-block', fontWeight: 700, margin: 0 }}>[마이페이지-쿠폰함]</p>에서 확인하실 수 있습니다.</Typography>
                    <Typography variant={'Kor_12_r'}>・ 각 쿠폰은 한 번씩만 받을 수 있습니다.</Typography>
                    <Typography variant={'Kor_12_r'}>・ 발행된 쿠폰은 발행일로부터 7일 이내 사용 가능합니다.</Typography>
                  </Stack>

                  <Button
                    size={'large'}
                    onClick={() => {
                      // navigate('/user/coupon')
                      navigate('/market/goods/75')
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
                      쿠폰 사용하기
                    </Typography>
                  </Button>
                </Stack>
              </>
              :
              resultData && resultData.errorCode === 'EVENT-9001' ?
                <>
                  <Stack sx={{ alignItems: 'center', p: pxToRem(20), pb: pxToRem(80) }}>
                    <Stack sx={{ justifyContent: 'center', pt: pxToRem(10) }}>
                      <Typography sx={{ fontWeight: 700, lineHeight: pxToRem(32), fontSize: pxToRem(30), wordBreak: 'keep-all', color: '#FF7F3F' }}>
                        아쉬워요...
                      </Typography>
                      <Typography variant={'Kor_16_r'} sx={{ textAlign: 'center', py: pxToRem(15), color: '#5D6066' }}>
                        오늘 선착순 이벤트가 마감되었어요 <br /> 내일 다시 도전해 보세요!
                      </Typography>
                      <PrizeLose style={{ width: '220', height: '220' }} />
                    </Stack>

                    {!isOpen &&
                      <Stack sx={{ pt: pxToRem(20) }}>
                        <Typography variant={'Kor_14_b'} sx={{ textAlign: 'center', py: pxToRem(15), color: '#202123' }}>
                          다음 이벤트 오픈까지
                        </Typography>
                        <FlipClockCountdown
                          onComplete={() => { setIsOpen(true) }}
                          duration={0.7}
                          renderMap={[false, true, true, true]}
                          separatorStyle={{ color: 'black', size: '6px' }}
                          to={startTime}
                          digitBlockStyle={{ width: 40, height: 60, fontSize: 35 }}
                        />
                      </Stack>}

                    <Stack
                      onClick={() => { navigate('/event/scratch') }}
                      sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#FAFAFA', width: '100%', p: pxToRem(15), mt: pxToRem(25), borderRadius: pxToRem(10) }}>
                      <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <SmileIcon />
                        <Stack sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', mx: 2 }}>
                          <Typography variant={'Kor_14_b'} sx={{ color: theme.palette.primary.main }}>
                            좌절금지
                          </Typography>
                          <Typography variant={'Kor_12_r'} sx={{ textAlign: 'left', color: '#5D6066' }}>
                            지금 바로 반값 할인 쿠폰에 도전하세요.
                          </Typography>
                        </Stack>
                      </Stack>
                      <Box component={Icon} icon={'ep:arrow-right-bold'} sx={{ pointer: 'cursor', color: '#DFE0E2' }}></Box>
                    </Stack>

                    <Button
                      size={'large'}
                      onClick={() => {
                        handleClose()
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
                          100% 할인 쿠폰은 <br /> 한 번만 발급 가능합니다.
                        </Typography>
                        <PrizeAlreadyDone style={{ width: '220', height: '220' }} />
                      </Stack>

                      <Button
                        size={'large'}
                        onClick={() => {
                          handleClose()
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

export default Prize;

const useStyles = makeStyles(() => ({
  couponInfo: {
    '& .MuiAccordionSummary-content': {
      my: `${pxToRem(12)} !important`,
    },
    '& .MuiButtonBase-root': {
      height: `${pxToRem(56)} !important`,
      minHeight: `${pxToRem(56)} !important`,
    },
    '&.MuiAccordion-root.Mui-expanded': {
      mt: 0,
      backgroundColor: '#FAFAFA',
      boxShadow: 'none',
    },
    '&.MuiAccordion-root.Mui-expanded:before': {
      opacity: 1,
    },
  },
}));
