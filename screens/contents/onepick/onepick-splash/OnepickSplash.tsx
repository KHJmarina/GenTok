import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useStores } from '../../../../models/root-store/root-store-context';
import { Dialog, Fade, Slide, useTheme } from '@mui/material';
import { ReactComponent as OnePickSplash } from 'src/assets/images/onepick-splash.svg';
import { motion, useAnimationControls } from 'framer-motion';
import OnepickResult from '../onepick-result/OnepickResult';
import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import Blower from './blower/Blower';
import { useParams } from 'react-router-dom';
import CAlert from 'src/components/CAlert';
import { ICoupon } from 'src/models/coupon/Coupon';

/**
 * ## OnepickSplash 설명
 *
 */
interface Props {
  handleClose: VoidFunction;
  onePickCpnKey: string | null | undefined;
}
const showProp = {
  opacity: 1,
};
const hideProp = {
  opacity: 0,
};
export const OnepickSplash = observer(({ handleClose, onePickCpnKey }: Props) => {
  const rootStore = useStores();
  const { couponStore, loadingStore, mbtiStore } = rootStore;
  const theme = useTheme();
  const [show, setShow] = useState(true);
  const [result, setResult] = useState(false);

  const params = useParams();
  const { mbtiSid, mbtiTestResultTypeId } = params;

  const [openAlert, setOpenAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [coupon, setCoupon] = useState<ICoupon>();
  const count = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mbtiSid) {
        couponStore.getRandomByMBTI(mbtiSid, onePickCpnKey).then((res: any) => {
          if (res.responseInfo.resultCode === 'F') {
            setErrorMsg(res.responseInfo.errorMessage);
            setOpenAlert(true);
          } else {
            setCoupon(res.coupon);
            setShow(false);
            setTimeout(() => {
              setResult(true);
            }, 1000);
          }
        });
      }
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [count.current]);

  return (
    <>
      <Box
        sx={{
          height: '100%',
          flex: 1,
          justifyContent: 'flex-start',
          alignContent: 'flex-start',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={show ? showProp : hideProp}
          transition={{ duration: 1 }}
        >
          {/* <OnePickSplash style={{ width: '100%', height: '100%' }} /> */}
          <Blower />
        </motion.div>
      </Box>

      {result && (
        <Dialog
          key={`mbti-result`}
          fullWidth
          hideBackdrop
          keepMounted
          maxWidth={'md'}
          open={result}
          TransitionComponent={Transition}
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              p: 0,
              m: '0 !important',
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              boxShadow: 'none',
            },
          }}
          onClose={() => {
            setResult(false);
          }}
          sx={{
            margin: '0 !important',
            zIndex: 1200,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <OnepickResult
            coupon={coupon}
            handleClose={handleClose}
            retry={() => {
              setResult(false);
              setShow(true);
              count.current++;
            }}
          />
        </Dialog>
      )}

      {openAlert && (
        <CAlert
          isAlertOpen={true}
          alertTitle={errorMsg}
          hasCancelButton={false}
          alertCategory={'error'}
          handleAlertClose={() => {
            setOpenAlert(false);
            handleClose();
          }}
        ></CAlert>
      )}
    </>
  );
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default OnepickSplash;
