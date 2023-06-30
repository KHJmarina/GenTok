import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../models/root-store/root-store-context';
import { Button, Dialog, Typography, useTheme, Stack } from '@mui/material';
import { ReactComponent as OnePickCandyBg } from 'src/assets/images/onepick-candy-bg.svg';
import { ReactComponent as OnePickCandyCate1 } from 'src/assets/images/onepick-candy-cate-1.svg';
import { ReactComponent as OnePickCandyCate2 } from 'src/assets/images/onepick-candy-cate-2.svg';
import { ReactComponent as OnePickCandyCate3 } from 'src/assets/images/onepick-candy-cate-3.svg';
import { ReactComponent as OnePickCandyCate4 } from 'src/assets/images/onepick-candy-cate-4.svg';
import { ReactComponent as OnePickCandyCate5 } from 'src/assets/images/onepick-candy-cate-5.svg';
import { ReactComponent as OnePickCandyCate6 } from 'src/assets/images/onepick-candy-cate-6.svg';
import { ReactComponent as DownIcon } from 'src/assets/icons/ico-down-c.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close.svg';
import { motion } from 'framer-motion';
import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import { TEST_TYPES } from 'src/components/test-types-svg';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_PAGE, PATH_ROOT } from 'src/routes/paths';
import { ICoupon } from 'src/models/coupon/Coupon';
import Image from 'src/components/image';
import CAlert from 'src/components/CAlert';

/**
 * ## OnepickResult 설명
 *
 */
interface Props {
  coupon?: ICoupon;
  handleClose: VoidFunction;
  retry: VoidFunction;
}
export const OnepickResult = observer(({ coupon, handleClose, retry }: Props) => {
  const rootStore = useStores();
  const { couponStore, loadingStore } = rootStore;
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const theme = useTheme();
  const { user, isAuthenticated } = useAuthContext();
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openHas, setOpenHas] = useState(false);
  const navigate = useNavigate();

  const params = useParams();
  const { mbtiSid, mbtiTestResultTypeId } = params;
  

  const [errorMsg, setErrorMsg] = useState('');
  const couponDown = () => {
    if (coupon?.haveCpn) {
      setOpenHas(true);
    } else {
      couponDownAction();
    }
  };
  const couponDownAction = () => {
    couponStore
      .downloadByMBTI(coupon?.cpnTypeId || null, coupon?.onePickCpnKey)
      .then((res: any) => {
        if (res.responseInfo.resultCode === 'F') {
          setErrorMsg(res.responseInfo.errorMessage);
          setOpenError(true);
        } else {
          setOpenSuccess(true);
        }
      });
  };

  let candy_bg;
  const candy_style = { width: '100%', minWidth: '244px', minHeight: '124px' };
  switch (coupon?.goods.ctegryList[0].ctegrySid) {
    case 1:
      candy_bg = <OnePickCandyCate4 style={{ ...candy_style }} />;
      break;
    case 2:
      candy_bg = <OnePickCandyCate5 style={{ ...candy_style }} />;
      break;
    case 3:
      candy_bg = <OnePickCandyCate6 style={{ ...candy_style }} />;
      break;
    case 4:
      candy_bg = <OnePickCandyCate3 style={{ ...candy_style }} />;
      break;
    case 5:
      candy_bg = <OnePickCandyCate1 style={{ ...candy_style }} />;
      break;
    case 6:
      candy_bg = <OnePickCandyCate2 style={{ ...candy_style }} />;
      break;

    default:
      candy_bg = <OnePickCandyCate1 style={{ ...candy_style }} />;
      break;
  }

  return (
    <>
      <Box>
        <Box sx={{ position: 'absolute', right: 24, top: 24, zIndex: 3 }} onClick={handleClose}>
          <CloseIcon stroke={theme.palette.common.black} />
        </Box>
        <Box sx={{ position: 'relative', mt: '15px' }}>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              ml: '-30px',
              zIndex: 3,
              bottom: 80,
              width: 60,
              height: 60,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 1,
              }}
            >
              {coupon?.goods.thumbnlPath && (
                <Image src={REACT_APP_IMAGE_STORAGE + coupon?.goods.thumbnlPath || ''} />
              )}
            </motion.div>
          </Box>
          <Box sx={{ zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <OnePickCandyBg style={{ width: '100%' }} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{
                position: 'absolute',
                margin: '0 auto',
                zIndex: 2,
                left: '50%',
                bottom: '40px',
                translate: '-50%',
              }}
            >
              {candy_bg}
              {/* <OnePickCandyCate1 style={{ width: '100%', minWidth: '244px', minHeight: '124px' }} /> */}
            </motion.div>
          </Box>
        </Box>
        <Stack sx={{ textAlign: 'center', mt: '-20px' }}>
          {isAuthenticated ? (
            <Typography variant={'Kor_24_b'}>
              {user?.nickNm}님을 위한
              <br />
              원픽쿠폰 받아가기
            </Typography>
          ) : (
            <Typography variant={'Kor_24_b'}>
              당신을 위한
              <br />
              원픽쿠폰 받아가기
            </Typography>
          )}
          <Typography variant={'Kor_16_r'} sx={{ px: 8, pt: 2, pb: 1, wordBreak: 'keep-all' }}>
            {coupon?.cpnTypeSummary}
          </Typography>
          <Typography variant={'Kor_16_r'} sx={{ px: 8 }}>
            <span style={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              {coupon?.cpnTypeNm} 쿠폰
            </span>
            으로
            <br />
            DNA 분석 결과를 무료로 확인하세요.
          </Typography>

          <Stack spacing={1} sx={{ p: 3 }}>
            <Button
              color={'primary'}
              variant={'contained'}
              size={'large'}
              sx={{ borderRadius: 4, fontSize: '1rem' }}
              onClick={couponDown}
            >
              <DownIcon style={{ marginRight: 4 }} /> 쿠폰 다운받기
            </Button>
            <Button
              color={'primary'}
              variant={'outlined'}
              size={'large'}
              sx={{ borderRadius: 4, fontSize: '1rem' }}
              onClick={retry}
            >
              쿠폰 다시뽑기
            </Button>
          </Stack>
        </Stack>
      </Box>

      {openError && (
        <CAlert
          isAlertOpen={true}
          alertTitle={errorMsg}
          hasCancelButton={false}
          alertCategory={'error'}
          handleAlertClose={() => {
            if (errorMsg === '로그인 후 이용 가능합니다.') {
              coupon?.onePickCpnKey && localStorage.setItem('onePickCpnKey', coupon.onePickCpnKey);
              navigate('/login', { replace: true });
            } else {
              setOpenError(false);
              handleClose();
            }
          }}
        ></CAlert>
      )}
      {openHas && (
        <CAlert
          isAlertOpen={true}
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
        ></CAlert>
      )}
      {openSuccess && (
        <Dialog
          open={openSuccess}
          PaperProps={{
            sx: {
              p: 4,
              borderRadius: 4,
            },
          }}
          onClose={() => {
            setOpenSuccess(false);
          }}
          sx={{
            margin: '0 !important',
            zIndex: theme.zIndex.modal,
            padding: 0,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 700, textAlign: 'center' }}>
            DNA 쿠폰이 다운되었습니다
            <br />
            쿠폰함에서 확인하세요.
          </Typography>
          <Button
            variant="contained"
            size={'medium'}
            sx={{ mt: 3, borderRadius: 3 }}
            onClick={() => {
              setOpenSuccess(false);
              navigate(PATH_ROOT.user.coupon, { replace: true, state: {'backUrl' : params} });
            }}
          >
            쿠폰함
          </Button>
        </Dialog>
      )}
    </>
  );
});

export default OnepickResult;
