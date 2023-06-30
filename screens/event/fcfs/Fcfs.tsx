import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import {
  Accordion as MuiAccrodion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  styled,
  alpha, Button, Dialog, Divider, Skeleton, Slide, Stack, Typography, useTheme, TooltipProps, Tooltip, tooltipClasses, LinearProgress
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { pxToRem } from 'src/theme/typography';
import { Share } from 'src/screens/contents/share/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Countdown, { CountdownApi, CountdownRenderProps, zeroPad } from 'react-countdown';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Prize from '../prize/Prize';
import { useAuthContext } from 'src/auth/useAuthContext';
import { CallApiToStore } from 'src/utils/common';
import { PATH_AUTH, PATH_ROOT } from 'src/routes/paths';
import { Icon } from '@iconify/react';
import CHeader from 'src/components/CHeader';
import { toJS } from 'mobx';
import Image from 'src/components/image';
import fcfsBanner from '../../../assets/images/fcfsBanner.jpg'
import fcfsMarket from '../../../assets/images/fcfsMarket.jpg'
import fcfsFcfs from '../../../assets/images/fcfsFcfs.jpg'
import fcfsGun from '../../../assets/images/fcfsGun.jpg'
import fcfsShareBg from '../../../assets/images/fcfsShareBg.jpg'
import Footer from 'src/screens/home/footer/Footer';
import FamilySite from 'src/screens/home/family-site/FamilySite';
import FcfsMarket from './fcfs-maket/FcfsMarket';
import FcfsMarketCard from './fcfs-maket/FcfsMarketGoldCard';
import { ReactComponent as FaqQ } from 'src/assets/icons/faq-q.svg';
import { ReactComponent as Logo } from 'src/assets/images/gentok-logo-white.svg';

// flipClock
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import './flipclock2.css';


/**
 * ## Fcfs 설명
 *
 */
type Props = {
  handleClose: VoidFunction;
}
export const Fcfs = observer(() => {

  const rootStore = useStores();
  const { eventStore, loadingStore, responseStore, homeStore } = rootStore;
  const theme = useTheme();
  const { REACT_APP_API_URL, REACT_APP_IMAGE_STORAGE } = process.env;
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState(false)
  const { user, isAuthenticated } = useAuthContext();

  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(eventStore.event);

  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: () => {
      navigate(-1);
    },
    showHomeIcon: true,
    handleX: () => {
      navigate(-1)
    }
  };
  const END_TIME = '23:59:59';

  const getEvent = async () => {
    CallApiToStore(eventStore.get(101), 'api', loadingStore).then(() => {
      eventStore.pagination_all.setProps({ size: 10 });
      // 임시 태스트용
      // event.setProps({
      //   startTime: moment().add(5, 'seconds').format('HH:mm:ss'),
      // });
      setEvent(toJS(eventStore.event));
      console.log(toJS(event));

    });
  };

  useEffect(() => {
    if (eventStore.event.eventSid !== 101) {
      getEvent()
    }
  }, [])

  const [openLoading, setOpenLoading] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  const [resultData, setResultData] = useState();


  const getCoupon = () => {
    if (!isAuthenticated) {
      // navigate(PATH_AUTH.login, { state: `${PATH_ROOT.event.fcfs}` });
      sessionStorage.setItem('afterUrl', '/event/fcfs');
      navigate(PATH_AUTH.login);
      return;
    }
    setOpenLoading(true);

    // !apply
    fetch(REACT_APP_API_URL + `/common/v1/fcfs/101/apply`, {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('accessToken') ? 'Bearer ' + localStorage.getItem('accessToken') : ''
      }
    })
      .then(async (res) => {

        const json = await res.json();
        // 선착순 통과
        if (json.resultCode === 'S') {
          getRank();
        }
        // 선착순 마감(9001) 또는 이미 참여(9002)
        else if (json.resultCode === 'F' &&
          (
            json.errorCode === 'EVENT-9001' || // 마감 -> 아쉬워요
            json.errorCode === 'EVENT-9002' || // 이미 참여
            json.errorCode === 'EVENT-9003 ' // 이미 당첨
          )) {
          setOpenLoading(false);
          setOpenResult(true);
          setResultData(json)
        } else {
          setOpenLoading(false);
          setAlertMsg(json.errorMessage)
          setOpenAlert(true);
        }
      })
      .catch((e) => {
        console.log('🌈 ~ getCoupon ~ e apply:', e);
      });

    // !rank
    const getRank = () => fetch(REACT_APP_API_URL + `/common/v1/fcfs/101/rank`, {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('accessToken') ? 'Bearer ' + localStorage.getItem('accessToken') : ''
      }
    }).then(async (res) => {
      const json = await res.json();
      // 선착순 통과
      if (json.resultCode === 'S') {
        const passKey = json.data.passKey;
        if (passKey) {
          getAction(passKey)
        } else {
          setTimeout(getRank, 1000)
        }
      }
    }).catch((e) => {
      console.log('🌈 ~ getCoupon ~ e rank:', e)
    })

    // !action
    const getAction = (passKey: any) => fetch(REACT_APP_API_URL + `/common/v1/fcfs/101/action?passKey=${passKey}`, {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('accessToken') ? 'Bearer ' + localStorage.getItem('accessToken') : ''
      }
    }).then(async (res) => {
      const json = await res.json();
      setOpenLoading(false);
      if (json.resultCode === 'S') {
        setOpenResult(true); // 당첨 | 당첨X
        setResultData(json)
      } else {
        setAlertMsg(json.errorMessage)
        setOpenAlert(true);
      }
    }).catch((e) => {
      setOpenLoading(false);
      console.log('🌈 ~ getCoupon ~ e action:', e)
    })
  }

  const [countdownApi, setCountdownApi] = useState<CountdownApi | null>(null);
  const setRef = (countdown: Countdown | null): void => {
    if (countdown) {
      setCountdownApi(countdown.getApi());
    }
  };

  const countdownRenderer = ({
    total,
    hours,
    minutes,
    seconds,
    completed,
    formatted,
  }: CountdownRenderProps) => {
    if (completed) {
      return (
        // <>
        //   {
        //     isAuthenticated ?
              <Button
                variant={'contained'}
                size={'large'}
                sx={{
                  // backgroundColor: theme.palette.common.white,
                  height: pxToRem(60),
                  maxWidth: 'md',
                  width: '100%',
                  borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
                  position: 'fixed',
                  bottom: 0,
                  overflow: 'hidden',
                  zIndex: 4,
                  // '&:hover':{
                  //   bgcolor:alpha('#fff', 0.8),
                  //   color:theme.palette.primary.main,
                  // }
                }}
                onClick={getCoupon}
              >
                {event.buttonNm}
                <Box component={Icon} icon={'ep:arrow-right-bold'} sx={{ pointer: 'cursor', ml: 1 }}></Box>
              </Button>
        //       :
        //       <BootstrapTooltip title={<><span style={{ color: '#FF7F3F' }}>로그인</span> 후 참여가 가능해요</>} open={true}>
        //         <Button
        //           variant={'contained'}
        //           size={'large'}
        //           sx={{
        //             // backgroundColor: theme.palette.common.white,
        //             height: pxToRem(60),
        //             maxWidth: 'md',
        //             width: '100%',
        //             borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
        //             position: 'fixed',
        //             bottom: 0,
        //             overflow: 'hidden',
        //             zIndex: 4,
        //             // '&:hover':{
        //             //   bgcolor:alpha('#fff', 0.8),
        //             //   color:theme.palette.primary.main,
        //             // }
        //           }}
        //           onClick={getCoupon}
        //         >
        //           {event.buttonNm}
        //           <Box component={Icon} icon={'ep:arrow-right-bold'} sx={{ pointer: 'cursor', ml: 1 }}></Box>
        //         </Button>
        //       </BootstrapTooltip>
        //   }
        // </>
      )
    } else if (countdownApi?.isStarted()) {
      return (
        <>
          {/* {
            isAuthenticated ?
              <Button
                variant={'contained'}
                size={'large'}
                disabled
                sx={{
                  height: pxToRem(60),
                  maxWidth: 'md',
                  width: '100%',
                  borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
                  position: 'fixed',
                  bottom: 0,
                  overflow: 'hidden',
                  zIndex: 4,
                }}
              >
                <Typography variant={'Kor_22_b'}>
                  {zeroPad(hours)}시 {zeroPad(minutes)}분 {zeroPad(seconds)}초 남음
                </Typography>
              </Button>
              :
              <BootstrapTooltip title={<><span style={{ color: '#FF7F3F' }}>로그인</span> 후 참여가 가능해요</>} open={true}> */}
                <Button
                  variant={'contained'}
                  size={'large'}
                  // disabled
                  onClick={() => {
                    sessionStorage.setItem('afterUrl', '/event/fcfs')
                    navigate('/login', { replace: true });
                  }}
                  sx={{
                    background: 'rgb(198, 199, 202)',
                    color: '#FFFFFF',
                    height: pxToRem(60),
                    maxWidth: 'md',
                    width: '100%',
                    borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
                    position: 'fixed',
                    bottom: 0,
                    overflow: 'hidden',
                    zIndex: 4,
                  }}
                >
                  <Typography variant={'Kor_22_b'}>
                    {zeroPad(hours)}시 {zeroPad(minutes)}분 {zeroPad(seconds)}초 남음
                  </Typography>
                </Button>
              {/* </BootstrapTooltip>
          } */}
        </>
      );
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [remainTime, setRemainTime] = useState(0);
  useEffect(() => {
    let interval: any;

    const check = () => {
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      const startTime = moment(moment().format('YYYY-MM-DD') + ' ' + event.startTime);
      const endTime = moment(moment().format('YYYY-MM-DD') + ' ' + END_TIME);

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
  const [startTime1, setStartTime1] = useState<string | number | Date>(0);
  useEffect(() => {
    if (event.startTime) {

      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      const startTime = moment(moment().format('YYYY-MM-DD') + ' ' + event.startTime);
      const endTime = moment(moment().format('YYYY-MM-DD') + ' ' + END_TIME);
      // const endTimeOri = moment(moment(startTime).add(1, 'minutes').format('YYYY-MM-DD') + ' ' + event.endTime);
      const endTimeOri = moment(moment(startTime).add(1, 'minutes'));


      const open = moment(now).isBetween(startTime, endTime);
      setIsOpen(isOpen => isOpen = open);
      setStartTime(startTime.format('YYYY-MM-DD HH:mm:ss'));

      // 시작전이면
      if (moment(now) < moment(startTime)) {
        setStartTime1(startTime1 => startTime1 = moment(startTime).format('YYYY-MM-DD HH:mm:ss'));
        // 이벤트 시작후 1분후
        // } else if (moment(now) > moment(endTimeOri)) {
      } else {
        setStartTime1(startTime1 => startTime1 = moment(moment().format('YYYY-MM-DD') + ' ' + event.startTime).add(1, 'days').format('YYYY-MM-DD HH:mm:ss'));
      }

      if (!open) {
        const seconds = moment.duration(startTime.diff(now)).asSeconds();
        if (seconds < 0) {
          setRemainTime(moment.duration(moment(moment().add(1, 'days').format('YYYY-MM-DD') + ' ' + event.startTime).diff(now)).asSeconds() * 1000);
        } else {
          setRemainTime(seconds * 1000);
        }
      }
    }
  }, [event])


  const [flipCardWidth, setFlipCardWidth] = useState(46.5);
  const setFlipCardSize = () => {
    const el = document.getElementById('simple-layout');
    if (el) {
      setFlipCardWidth(flipCardWidth => flipCardWidth = (el?.clientWidth - 94) / 6);
    }
  }
  useEffect(() => {
    setFlipCardSize();
    window.addEventListener('resize', setFlipCardSize)
    return () => {
      window.removeEventListener('resize', setFlipCardSize)
    }
  }, [])

  const classes = useStyles();

  return (
    <>
      <Stack sx={{ mb: pxToRem(40) }}>
        <CHeader title={'이벤트'} {...options} />

        {/* 배너 */}
        <Image src={fcfsBanner} />

        {/* 마켓 */}
        <Image src={fcfsMarket} />

        <FcfsMarket />

        {/* 선착순 이벤트 */}
        <Image src={fcfsFcfs} sx={{ lineHeight: 0 }} />

        {<Stack sx={{ pt: pxToRem(10), background: '#EA69A2', }}>
          <Stack direction={'row'} justifyContent={'space-between'} sx={{ px: '20px' }}>
            <Typography variant={'Kor_22_b'} sx={{ color: '#FFFFFF' }}>
              오픈까지
            </Typography>
            <Typography variant={'Kor_14_b'} sx={{ color: '#FFFFFF', background: '#8A0D8C', p: '4px 8px' }}>
              매일 오전10시 01분 선착순 무료
            </Typography>
          </Stack>
          <Box sx={{ p: '20px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <FlipClockCountdown
              onComplete={() => {
                // setIsOpen(true)
              }}
              duration={0.7}
              renderMap={[false, true, true, true]}
              separatorStyle={{ color: 'black', size: '6px' }}
              showLabels={false}
              to={startTime1}
              // digitBlockStyle={{ width: 46.5, height: 70, fontSize: 38 }}
              digitBlockStyle={{ width: flipCardWidth, height: flipCardWidth * 1.5, fontSize: flipCardWidth * .8 }}
            />
          </Box>
        </Stack>}

        <Image src={fcfsGun} sx={{ lineHeight: 0 }} />

        {/* 공유하기 */}
        <Image src={fcfsShareBg} sx={{ lineHeight: 0 }} />
        <Stack
          sx={{ alignItems: 'center', pb: pxToRem(40), overflow: 'hidden', background: '#f6de6c' }}>
          <Box sx={{ background: '#FFFFFF', borderRadius: 5, textAlign: 'center', px: 2 }}>
            <Share
              shareData={{
                title: event.eventNm,
                desc: event.eventConts,
                path: 'event',
                type: '이벤트',
                Sid: event.eventSid,
                img: event.thumbnlPath ? REACT_APP_IMAGE_STORAGE + event.thumbnlPath : '',
                url: process.env.NODE_ENV === 'production' ? window.location.href + `?eventId=${event.eventSid}` : `https://devf2d.surfinn.kr/event?eventSid=${event.eventSid}`
              }}
              handleAlertClose={() => { }}
            />
          </Box>
        </Stack>

        <Stack sx={{ p: '20px', mt: '20px', textAlign: 'left' }}>
          <Typography variant={'Kor_20_b'}>자주 찾는 질문</Typography>
          <Accordion square elevation={0} sx={{ width: '100%', borderRadius: '0 !important', pt: pxToRem(10), px: 0, boxShadow: 'none !important' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#DFE0E2' }} />}
              aria-controls="panel1a-content">
              <FaqQ />
              <Typography variant={'Kor_14_b'} sx={{ ml: 1 }}>젠톡 유전자 검사, 왜 무료로도 제공하나요?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant={'Kor_14_r'} sx={{ color: '#5D6066' }}>
                젠톡 유전자 검사 서비스를 제공하는 글로벌 유전체 분석 전문기업 마크로젠의 미션은 전세계 모두에게 ‘내 몸 설계도’를 제공하여 보다 건강한 세상을 만드는 것입니다. <br /><br />
                1997년 설립된 마크로젠은 국내 1위 유전체 분석 기업으로, 이전에는 어렵게 느껴지고 비용 부담이 있었던 유전자 검사를 쉽고 부담 없이 받을 수 있도록 제공하여 각자 타고난 유전 정보를 기반으로 똑똑한 건강관리를 할 수 있게 돕고자 합니다.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion square elevation={0} sx={{ width: '100%', borderRadius: '0 !important', px: 0, boxShadow: 'none !important' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#DFE0E2' }} />}
              aria-controls="panel1a-content">
              <FaqQ />
              <Typography variant={'Kor_14_b'} sx={{ ml: 1 }}>선착순 신청은 어떻게 하나요?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant={'Kor_14_r'} sx={{ color: '#5D6066' }}>
                매일 오전 10시 01분에 신청이 오픈됩니다. <br /><br />
                무료 검사 받기 버튼을 눌러 무료 혜택을 받아보세요. 선착순 당첨 결과에 따라 무료 유전자 검사를 받을 수 있습니다.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Typography variant={'Kor_20_b'} sx={{ mt: '40px', pb: '10px' }}>유의사항</Typography>

          <ul
            style={{
              ...theme.typography.Kor_12_r,
              margin: 0,
              paddingLeft: '1.5em',
              lineHeight: pxToRem(22),
              color: '#5D6066',
            }}
          >
            <li>본 이벤트는 젠톡 회원에게만 제공되는 특별한 서비스로, 젠톡 회원이라면 누구나 참여할 수 있어요.</li>
            <li>젠톡 유전자 검사 키트, 분석 비용, 왕복 택배비까지 검사 관련 모든 비용은 무료예요.</li>
            <li>발행된 쿠폰은 발행일로부터 7일 이내 사용 가능합니다.</li>
            <li>본 이벤트는 각 회원당 1일 1회만 참여 가능하며, 검사 변경 및 철회는 불가능해요.</li>
            <li>본 이벤트 당첨 시, 마이페이지에서 쿠폰을 사용하여 유전자 검사를 무료 신청할 수 있어요.</li>
            <li>본 이벤트는 당사 사정에 따라 사전 고지 없이 조기 종료되거나 변동사항이 발생할 수 있어요.</li>
          </ul>

        </Stack>

      </Stack>

      <Divider />
      <Footer />
      <FamilySite />
      <Stack >
        {
          !isOpen
            ?
            remainTime > 0 &&
            <Countdown
              key={'countdown-fcfs'}
              ref={setRef}
              date={Date.now() + remainTime}
              renderer={countdownRenderer}
              autoStart={true}
              onComplete={() => {
              }}
            />
            :
            isAuthenticated ?
              <Button
                variant={'contained'}
                size={'large'}
                sx={{
                  // backgroundColor: theme.palette.common.white,
                  height: pxToRem(60),
                  maxWidth: 'md',
                  width: '100%',
                  borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
                  position: 'fixed',
                  bottom: 0,
                  overflow: 'hidden',
                  zIndex: 4,
                  // '&:hover':{
                  //   bgcolor:alpha('#fff', 0.8),
                  //   color:theme.palette.primary.main,
                  // }
                }}
                onClick={getCoupon}
              >
                {event.buttonNm}
                <Box component={Icon} icon={'ep:arrow-right-bold'} sx={{ pointer: 'cursor', ml: 1 }}></Box>
              </Button>
              :
              <BootstrapTooltip title={<><span style={{ color: '#FF7F3F' }}>로그인</span> 후 참여가 가능해요</>} open={true}>
                <Button
                  variant={'contained'}
                  size={'large'}
                  sx={{
                    // backgroundColor: theme.palette.common.white,
                    height: pxToRem(60),
                    maxWidth: 'md',
                    width: '100%',
                    borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
                    position: 'fixed',
                    bottom: 0,
                    overflow: 'hidden',
                    zIndex: 4,
                    // '&:hover':{
                    //   bgcolor:alpha('#fff', 0.8),
                    //   color:theme.palette.primary.main,
                    // }
                  }}
                  onClick={getCoupon}
                >
                  {event.buttonNm}
                  <Box component={Icon} icon={'ep:arrow-right-bold'} sx={{ pointer: 'cursor', ml: 1 }}></Box>
                </Button>
              </BootstrapTooltip>
        }
      </Stack>
      {
        openLoading &&
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          open={openLoading}
          TransitionComponent={Transition}
          // hideBackdrop
          PaperProps={{
            sx: {
              p: 0,
              m: '0 !important',
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              boxShadow: 'none',
              overflowY: 'initial',
            },
          }}
          onClose={(e: any, reason: string) => {
          }}
          sx={{
            '& .MuiDialog-container': {
              overflowY: 'auto',
            },
            margin: '0 !important',
            zIndex: theme.zIndex.modal,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <Stack
            sx={{
              display: 'flex',
              flex: 1,
              width: '100%',
              height: '100%',
              px: pxToRem(20),
              py: pxToRem(20),
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              background: '#FF7F3F',
            }}
          >
            <Typography variant={'Kor_16_b'} sx={{ color: '#FFFFFF', mb: 4 }}>
              결과 확인 중입니다<br />
              잠시만 기다려 주세요
            </Typography>
            <Logo />
            <LinearProgress sx={{
              width: '100%', mt: 4,

              backgroundColor: '#FFFFFF',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#FFC3A5'
              }
            }} />
          </Stack>
        </Dialog>
      }
      {
        openResult &&
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          open={openResult}
          TransitionComponent={Transition}
          // hideBackdrop
          PaperProps={{
            sx: {
              p: 0,
              m: '0 !important',
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              boxShadow: 'none',
              overflowY: 'initial',
            },
          }}
          onClose={(e: any, reason: string) => {
            if (reason === 'backdropClick') {
              e.preventDefault();
              e.stopPropagation();
            } else {
              setOpenResult(false);
            }
          }}
          sx={{
            '& .MuiDialog-container': {
              overflowY: 'auto',
            },
            margin: '0 !important',
            zIndex: theme.zIndex.modal,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <Prize handleClose={() => {
            setOpenResult(false);
            navigate('/', { replace: true });
          }} resultData={resultData}
          />
        </Dialog>
      }
      {
        openAlert &&
        <Dialog
          open={openAlert}
          PaperProps={{
            sx: {
              p: '25px !important',
              borderRadius: '25px !important',
              minWidth: '250px',
            },
          }}
          onClose={() => {
            setOpenAlert(false);
          }}
          sx={{
            margin: '0 !important',
            zIndex: theme.zIndex.modal,
            padding: 0,
          }}
        >
          <Typography variant="Kor_16_r" textAlign={'center'}>
            {alertMsg}
          </Typography>
          <Stack direction={'row'} display={'flex'} justifyContent={'space-between'} gap={1}>
            <Button
              fullWidth
              variant={responseStore.responseInfo.errorCode === '401' ? 'outlined' : 'contained'}
              size={'medium'}
              sx={{ mt: 3, borderRadius: 3 }}
              onClick={() => {
                setOpenAlert(false);
              }}
            >
              {responseStore.responseInfo.errorCode === '401' ? '취소' : '확인'}
            </Button>
          </Stack>
        </Dialog>
      }
    </>
  );
});

export default Fcfs;

const useStyles = makeStyles(() => ({
  couponInfo: {
    '& .MuiAccordionSummary-root': {
      p: `${pxToRem(0)} !important`,
      backgroundColor: 'none',
    },
    '& .MuiAccordionSummary-content': {
      my: `${pxToRem(12)} !important`,
    },
    '& .MuiButtonBase-root': {
      height: `${pxToRem(50)} !important`,
      minHeight: `${pxToRem(56)} !important`,
    },
    '&.MuiAccordion-root.Mui-expanded': {
      mt: 0,
      backgroundColor: alpha('#fff', 0),
      boxShadow: 'none',
    },
    '&.MuiAccordion-root.Mui-expanded:before': {
      // opacity: 1,
      backgroundColor: "none",
    },
  },
}));

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`.${tooltipClasses.tooltip}`]: {
    borderRadius: '8px',
    bottom: '-10px',
    zIndex: 999999
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#5D6066',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#5D6066',
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});


const Accordion = styled(MuiAccrodion)(({ theme }) => ({
  '&.MuiAccordion-root': {
    border: 0,
    '&:before': {
      display: 'none',
    },
    minHeight: pxToRem(52),
    '&.Mui-expanded': {
      boxShadow: 'none',
      borderRadius: 0,
      backgroundColor: '#fff',
      minHeight: pxToRem(52),
      margin: 0,
    },
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  '&.MuiAccordionDetails-root': {
    padding: `20px 0`,
    borderBottom: '1px solid #ebebeb',
    textAlign: 'left',
  },
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  '&.MuiAccordionSummary-root': {
    minHeight: pxToRem(52),
    borderBottom: '1px solid #ebebeb',
    paddingLeft: 0,
    margin: '0',
    '&.Mui-expanded': {
      minHeight: pxToRem(52),
      margin: '0',
    },
    '& .MuiAccordionSummary-content': {
      alignItems: 'center',
      margin: '12px 0',
      '&.Mui-expanded': {
        margin: '12px 0',
      },
    },
  },
}));
