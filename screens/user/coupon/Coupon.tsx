import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../models/root-store/root-store-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATH_AUTH, PATH_PAGE, PATH_ROOT } from '../../../routes/paths';
import {
  useTheme,
  Stack,
  Divider,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CHeader } from 'src/components/CHeader';
import { HEADER } from 'src/config-global';

import { ReactComponent as IcoCoupon } from 'src/assets/icons/ico-coupon.svg';
import { pxToRem } from 'src/theme/typography';
import { numberComma, CallApiToStore } from 'src/utils/common';
import { fDate, fToNow } from 'src/utils/formatTime';
import { IMyCoupon } from 'src/models/mypage/Mypage';
import { makeStyles } from '@material-ui/core/styles';
import CAlert from 'src/components/CAlert';

/**
 * ## Coupon 설명
 *
 */
type RedirectLocationState = {
  redirectTo: Location;
};
export const Coupon = observer(() => {
  const rootStore = useStores();
  const { loadingStore, mypageStore, couponStore, responseStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();
  const {state: state} = useLocation()
  const { state: locationState } = useLocation();
  const { redirectTo } = (locationState as RedirectLocationState) || {
    pathname: '',
  }  

  useEffect(() => {
    if (redirectTo && redirectTo.pathname !== '') {
      navigate(redirectTo.pathname, { replace: true, state: {'backUrl' : null}  });
    }
  },[]);

  const [myCouponList, setMyCouponList] = useState<IMyCoupon[]>();

  useEffect(() => {
    getMyCoupon();
    const interval = setInterval(() => refreshCoupon(), 10000);
    return () => clearInterval(interval);
  }, []);

  const refreshCoupon = () => {
    //24시에 만료된 쿠폰 비활성화를 위해 갱신
    let now = new Date();
    let currentTime = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    if (now.getHours() == 0 && now.getMinutes() == 0 && now.getSeconds() < 10) {
      getMyCoupon();
    }
  };

  const getMyCoupon = () => {
    CallApiToStore(mypageStore.getCoupons(), 'api', loadingStore)
      .then(() => {
        setMyCouponList(mypageStore.myCoupons);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const convertNumberToDate = (date: number) => {
    return fDate(date, 'yyyy.MM.dd');
  };

  const getDistanceDay = (date: number) => {
    const today = new Date();
    const expDay = new Date(date);

    const Difference_In_Time = expDay.getTime() - today.getTime();

    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    const difference = Math.ceil(Difference_In_Days);

    return difference > 0 ? difference : 0;
  };

  const [alertMsg, setAlertMsg] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [openHas, setOpenHas] = useState(false);

  const couponDownAction = () => {
    couponStore
      .downloadByMBTI(null, localStorage.getItem('onePickCpnKey') || null)
      .then((res: any) => {
        localStorage.removeItem('onePickCpnKey');
        if (res.responseInfo.resultCode === 'F') {
          setAlertTitle('쿠폰뽑기 실패');
          setAlertMsg(res.responseInfo.errorMessage);
          setIsAlertOpen(true);
        } else {
          getMyCoupon();
          setAlertTitle('');
          setAlertMsg('DNA 쿠폰이 다운되었습니다');
          setIsAlertOpen(true);
        }
      });
  };
  useEffect(() => {
    if (localStorage.getItem('onePickCpnKey')) {
      couponStore.checkDrawStts(localStorage.getItem('onePickCpnKey')).then((res1: any) => {
        if (res1.responseInfo.resultCode === 'S') {
          console.log(res1);
          if (res1.coupon.haveCpn === true) {
            setOpenHas(true);
          } else {
            couponDownAction();
          }
        } else {
          if (res1.responseInfo.errorMessage) {
            localStorage.removeItem('onePickCpnKey');
            setAlertMsg(res1.responseInfo.errorMessage);
            setIsAlertOpen(true);
          }
        }
      });
    }
  }, [localStorage.getItem('onePickCpnKey')]);
  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: ()=>{
      if(!state) {
        navigate(-1)
      } else {navigate(`${PATH_ROOT.contents.mbti}/${state?.backUrl.mbtiSid}/result/type/${state?.backUrl.mbtiTestResultTypeId}`)}
    },
    showHomeIcon: true
  };

  return (
    <>
      <CHeader
        title="쿠폰함"
        {...options}
      />
      <Stack
        spacing={pxToRem(16)}
        sx={{
          flex: 1,
          pb: `${HEADER.H_MOBILE}px`,
          overflowY: 'auto',
          scrollMarginTop: '100px',
        }}
      >
        {myCouponList && (
          <Stack
            sx={{
              background: '#FAFAFA',
              px: pxToRem(20),
              py: pxToRem(32),
            }}
          >
            {myCouponList.length > 0 ? (
              myCouponList.map((data, index) => (
                <Box
                  key={`coupon-item-${index}`}
                  position={'relative'}
                  sx={{
                    my: pxToRem(8),
                    boxShadow: '3px 3px 15px rgba(0, 0, 0, 0.05)',
                    // background: "#FFFFFF",
                    borderRadius: pxToRem(10),
                  }}
                  // onClick={()=>{
                  //   navigate(PATH_ROOT.market.list)
                  // }}
                >
                  <Stack
                    position={'absolute'}
                    spacing={pxToRem(8)}
                    sx={{
                      width: pxToRem(12),
                      justifyContent: 'center',
                      alignItems: 'center',
                      left: '63%',
                      top: pxToRem(-6),
                    }}
                  >
                    <Box
                      sx={[
                        couponDotStyle,
                        {
                          boxShadow: '-3px -3px 15px rgb(0 0 0 / 5%)',
                        },
                      ]}
                    />
                    <Box
                      sx={{
                        // position: 'absolute',
                        width: 0,
                        height: pxToRem(88),
                        // left: '53%',
                        // top: 57,
                        border: '1px dashed #EEEEEE',
                      }}
                    />
                    <Box sx={couponDotStyle} />
                  </Stack>
                  <Box
                    sx={{
                      width: '100%',
                      height: pxToRem(116),
                      left: 0,
                      top: 0,

                      background: '#FFFFFF',
                      borderRadius: pxToRem(12),
                    }}
                  >
                    <Stack direction={'row'} height="100%" alignItems={'center'}>
                      <Stack
                        direction={'column'}
                        sx={{
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          width: '63%',
                          pl: pxToRem(24),
                          py: pxToRem(23),
                        }}
                      >
                        <Typography variant="h5" fontWeight={600} color={'#202123'} pb={pxToRem(8)}>
                          {data.cpnNm}
                        </Typography>
                        {data.minGoodsAmt != 0 && (
                          <Typography variant="caption" color={'#9DA0A5'}>{`${numberComma(
                            data.minGoodsAmt || 0,
                          )}원 이상 구매 시 사용`}</Typography>
                        )}
                        <Typography variant="caption" color={'#9DA0A5'}>
                          {convertNumberToDate(data.cpnExpDate)} 까지
                        </Typography>
                      </Stack>

                      <Box
                        width="37%"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <IcoCoupon />
                        <Typography
                          variant="subtitle2"
                          color={theme.palette.primary.main}
                          pt={pxToRem(4)}
                        >
                          {getDistanceDay(data.cpnExpDate) === 0
                            ? '오늘까지'
                            : `D-${getDistanceDay(data.cpnExpDate)}`}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              ))
            ) : (
              <Box
                width="100%"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: pxToRem(20),
                }}
              >
                <IcoCoupon fill="#C6C7CA" />
                <Typography variant="body1" color={'#C6C7CA'} pt={pxToRem(12)}>
                  보유한 쿠폰이 없습니다.
                </Typography>
              </Box>
            )}
          </Stack>
        )}
        <Stack mt={'0 !important'}>
          <Accordion
            sx={{ borderRadius: '0 !important', background: '#FFFFFF' }}
            className={classes.couponInfo}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#9DA0A5' }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ borderBottom: '1px solid #EEEEEE', py: pxToRem(4), backgroundColor: '#FFFFFF' }}
            >
              <Typography>쿠폰 이용안내</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ background: '#FAFAFA' }}>
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
          </Accordion>
        </Stack>
      </Stack>
      {isAlertOpen && (
        <CAlert
          isAlertOpen={isAlertOpen}
          alertCategory={'error'}
          alertTitle={
            alertMsg === '매칭된 모든 DNA를 확인했어요.' ||
            alertMsg === '매칭된 쿠폰을 이미 사용했어요'
              ? alertTitle
              : undefined
          }
          alertContent={alertMsg}
          handleAlertClose={() => {
            setIsAlertOpen(false);
          }}
        />
      )}
      {openHas && (
        <CAlert
          isAlertOpen={openHas}
          alertTitle={'이전에 다운받은 쿠폰이 있습니다.'}
          alertContent={'이전 쿠폰을 삭제하고<br/>새로운 쿠폰을 다운받을까요?'}
          hasCancelButton={true}
          alertCategory={'error'}
          handleAlertClose={() => {
            setOpenHas(false);
            couponDownAction();
          }}
          handleAlertCancel={() => {
            setOpenHas(false);
          }}
        />
      )}
    </>
  );
});

export default Coupon;

const couponDotStyle = {
  width: pxToRem(12),
  height: pxToRem(12),
  background: '#F4F4F4',
  borderRadius: '50%',
};
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
