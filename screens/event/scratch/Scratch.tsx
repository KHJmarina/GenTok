import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import { Button, Dialog, Slide, Stack, Tooltip, tooltipClasses, TooltipProps, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import { pxToRem } from 'src/theme/typography';
import CHeader from 'src/components/CHeader';
import Image from 'src/components/image';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Prize from '../prize/Prize';
import { useAuthContext } from 'src/auth/useAuthContext';
import ScratchCard from 'react-scratchcard-v2';
import { CallApiToStore } from 'src/utils/common';
import { PATH_AUTH, PATH_ROOT } from 'src/routes/paths';
import successImage from '../../../assets/images/scratchSuccess.svg';
import loseImage from '../../../assets/images/scratchLose.svg';
import { alpha, styled } from '@mui/system';
import ScratchPrize from '../prize/scratchPrize';


/**
 * ## Scratch 설명
 *
 */
type Props = {
  handleClose: VoidFunction;
}
export const Scratch = observer(({ handleClose }: Props) => {

  const rootStore = useStores();
  const { eventStore, loadingStore, responseStore } = rootStore;
  const theme = useTheme();
  const { REACT_APP_API_URL, REACT_APP_IMAGE_STORAGE } = process.env;
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState<string | boolean>(false)
  const { user, isAuthenticated } = useAuthContext();

  const navigate = useNavigate();
  const event = eventStore.event;

  const classes = useStyles();

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

  const getEvent = async () => {
    CallApiToStore(eventStore.get(100), 'api', loadingStore).then(() => {
      eventStore.pagination_all.setProps({ size: 10 });
      if (event.prtcptnYn === true && event.winYn === false) {
        setResultData({
          errorCode: 'EVENT-9002'
        });
        setOpenResult(true);
      } else if (event.prtcptnYn === true && event.winYn === true) {
        setResultData({
          errorCode: 'EVENT-9003'
        });
        setOpenResult(true);
      }
    });
  };

  useEffect(() => {
    if (eventStore.event.eventSid === 0) {
      getEvent()
    }
  }, [eventStore.event])

  const [openResult, setOpenResult] = useState(false);
  const [result, setResult] = useState('');
  const [resultData, setResultData] = useState<any>();
  const getCoupon = () => {

    if (!isAuthenticated) {
      // navigate('/login', { state: `${PATH_ROOT.event.scratch}` });
      sessionStorage.setItem('afterUrl', '/event/scratch');
      navigate(PATH_AUTH.login);
      return;
    }

    fetch(REACT_APP_API_URL + `/common/v1/event/100/prtcptn/allPack50Cpn`, {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('accessToken') ? 'Bearer ' + localStorage.getItem('accessToken') : ''
      }
    }).then(async (res) => {
      const json = await res.json();
      console.log('🌈 ~ getCoupon ~ json:', json)
      // 처음 참여 ( 당첨 | 당첨X )
      if (json.resultCode === 'S') {
        setResult(json.data?.winYn === true ? 'success' : 'lose')
      } else {
        // 이미 참여 ( 이미 참여해서 당첨 | 당첨X 했을 경우 )
        if ((json.errorCode === 'EVENT-9002' || json.errorCode === 'EVENT-9003')) {
          setOpenResult(true);
          setResultData(json)
        } else {
          setAlertMsg(json.errorMessage)
          setOpenAlert(true);
        }
      }
    }).catch((e) => {
      console.log('🌈 ~ getCoupon ~ e:', e)
    })
  }

  // Y축 드래그 고정
  const disableTouchMove = (event: any) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (event.prtcptnYn === true && event.winYn === false) {
      setResultData({
        errorCode: 'EVENT-9002'
      });
      setOpenResult(true);
    } else if (event.prtcptnYn === true && event.winYn === true) {
      setResultData({
        errorCode: 'EVENT-9003'
      });
      setOpenResult(true);
    }
  }, [event]);

  useEffect(() => {
    document.addEventListener('touchmove', disableTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchmove', disableTouchMove);
    };
  }, []);

  return (
    <>
      <Stack
        sx={{
          flex: 1,
          height: '100%',
          overflowY: 'hidden',
          backgroundImage: "url('/assets/background/scratch-background.svg')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '100%',
          '&::-webkit-scrollbar': {
            display: 'none',
          }
        }}>
        <CHeader title={'이벤트'} {...options} />
        <Stack
          className='classes.couponInfo'
          sx={{ alignItems: 'center', pt: pxToRem(20), overflow: 'hidden' }}>
          <Typography variant='Eng_14_b' sx={{ color: '#FF7F3F', bgcolor: '#FFF4C9', borderRadius: pxToRem(999), mt: pxToRem(30), py: pxToRem(5), px: pxToRem(20), textAlign: 'cetner' }}>
            {event.eventNm}
          </Typography>

          <Stack sx={{ pt: pxToRem(20), pb: pxToRem(10), textAlign: 'center' }}>
            <Typography variant='Eng_28_b' sx={{ color: '#fff', textDecoration: 'underline', fontWeight: 700, lineHeight: pxToRem(36), fontSize: pxToRem(26), wordBreak: 'keep-all' }}>
              {event.eventConts?.split('\n')[0]}
            </Typography>
            <Typography variant='Eng_28_b' sx={{ color: '#FFF4C9', fontWeight: 700, lineHeight: pxToRem(36), fontSize: pxToRem(26), wordBreak: 'keep-all' }}>
              {event.eventConts?.split('\n')[1]}
            </Typography>
          </Stack>

          <Stack>
            <Typography variant='Kor_18_b' sx={{ pt: pxToRem(10), pb: pxToRem(45), color: '#fff', fontWeight: 600, lineHeight: pxToRem(26), fontSize: pxToRem(18), wordBreak: 'keep-all' }}>
              스크래치 쿠폰을 긁어보세요
            </Typography>
          </Stack>
          <Box sx={{
            position: 'relative',
            '& .ScratchCard__Container': {
              display: 'flex',
              width: 'auto !important',
              justifyContent: 'center',
              textAlign: 'center',
            },
            '& .ScratchCard__Result *': {
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
            }
          }}>
            <ScratchCard
              width={315}
              height={196}
              image={'/assets/background/scratchImage.png'}
              finishPercent={70}
              fadeOutOnComplete={true}
              brushSize={15}
              onComplete={() => {
                getCoupon();
              }}
            >
            </ScratchCard>
            <Box>
              {/* 스크레치 뒷배경 이미지 */}
              <Box sx={{
                position: 'absolute',
                display: 'flex',
                top: -1,
                left: '-157px !important',
                width: 'auto !important',
                justifyContent: 'center',
                textAlign: 'center',
              }}>
                {result === '' ? <Image src={'/assets/background/scratchBgi.png'} sx={{ width: '315px', height: '196' }} /> : <></>}
              </Box>
              {/* 손 이미지 */}
              <Box sx={{ textAlign: 'center', position: 'absolute', top: '-50px', right: '-188px', zIndex: 4 }}>
                {result === '' ? <Image src={'/assets/background/scratchHand.png'} sx={{ width: '120px', height: '120px' }} /> : <></>}
              </Box>
              {/* 결과이미지 */}
              <Box sx={{
                position: 'absolute',
                display: 'flex',
                top: 0,
                left: '-158px !important',
                width: 'auto !important',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                {result === 'success' ?
                  <Image src={successImage} sx={{ width: '315px', height: '196px', zIndex: 5 }} /> :
                  result === 'lose' ?
                    <Image src={loseImage} sx={{ width: '315px', height: '196px', zIndex: 5 }} /> :
                    <></>}
              </Box>
            </Box>
          </Box>

        </Stack>

        {/* 유의사항 */}
        {/* <Accordion
              sx={{ borderRadius: '0 !important', pt:pxToRem(25), pb:pxToRem(100), px:pxToRem(20), '&::before' : { opacity:0 }}}
              className={classes.couponInfo}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ borderBottom: '1px solid #EEE', py: pxToRem(4), color:'#fff',
                '&::after' : {
                  borderBottom:`1px solid '#fff`,
                }
              }}
              >
                <Typography>유의사항 확인하기</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ color: '#FAFAFA' }}>
                <Box p={pxToRem(20)}>
                  <Typography variant="caption" display={'list-item'} textAlign={'left'}>
                    발급된 쿠폰은 ID 1개당 1회만 사용이 가능합니다.
                  </Typography>
                  <Typography variant="caption" display={'list-item'} textAlign={'left'}>
                    사용기간 만료 시 사용이 불가합니다.
                  </Typography>
                  <Typography variant="caption" display={'list-item'} textAlign={'left'}>
                    사용기간이 만료되거나 사용한 쿠폰은 보유 목록에서 자동으로 삭제됩니다.
                  </Typography>
                  <Typography variant="caption" display={'list-item'} textAlign={'left'}>
                    결제 취소 시 이용기간이 남아 있는 쿠폰인 경우 재발급됩니다.
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion> */}

        {
          event.prtcptnYn === true && result === '' ?
            <Button size={'large'} sx={{
              bgcolor: '#ffffff',
              color: theme.palette.text.disabled,
              height: pxToRem(50),
              maxWidth: 'md',
              width: '100%',
              borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
              position: 'fixed',
              bottom: 0,
              '&:hover': {
                bgcolor: '#FFFFFF',
                color: theme.palette.text.disabled,
              }
            }}
              onClick={() => { }}
            >
              이미참여한 이벤트 입니다
            </Button>
            :
            isAuthenticated ?
              <Button
                size={'large'}
                onClick={() => result === 'success' ? navigate('/market/goods/75') : result === 'lose' ? navigate('/') : getCoupon()}
                disabled={false}
                sx={{
                  bgcolor: '#ffffff',
                  color: theme.palette.primary.main,
                  height: pxToRem(50),
                  maxWidth: 'md',
                  width: '100%',
                  borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
                  position: 'fixed',
                  bottom: 0,
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.8),
                    color: theme.palette.primary.main,
                  }
                }}
              >
                <Typography variant="Kor_18_b">
                  {result === 'success' ? '쿠폰 사용하기' : result === 'lose' ? '홈으로' : '당첨 확인하기'}
                </Typography>
              </Button>
              :
              <BootstrapTooltip title={<><span style={{ color: '#FF7F3F' }}>로그인</span> 후 참여가 가능해요</>} open={true}>
                <Button
                  size={'large'}
                  onClick={() => result === 'success' ? navigate('/market/goods/75') : result === 'lose' ? navigate('/') : getCoupon()}
                  disabled={false}
                  sx={{
                    bgcolor: '#ffffff',
                    color: theme.palette.primary.main,
                    height: pxToRem(50),
                    maxWidth: 'md',
                    width: '100%',
                    borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
                    position: 'fixed',
                    bottom: 0,
                    '&:hover': {
                      bgcolor: alpha('#fff', 0.8),
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  <Typography variant="Kor_18_b">
                    {result === 'success' ? '쿠폰 사용하기' : result === 'lose' ? '홈으로' : '당첨 확인하기'}
                  </Typography>
                </Button>
              </BootstrapTooltip>
        }
      </Stack>
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
              handleClose();
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
          <ScratchPrize handleClose={() => {
            setOpenResult(false);
            navigate('/', { replace: true });
            // handleClose && handleClose();
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
              {/* {responseStore.responseInfo.errorCode === '401' ? '취소' : '확인'} */}
              {'확인'}
            </Button>
          </Stack>
        </Dialog>
      }
    </>
  );
});

export default Scratch;


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


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

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