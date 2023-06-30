import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';
import moment from 'moment';
import { CallApiToStore } from 'src/utils/common';
import { pxToRem } from 'src/theme/typography';
import Image from 'src/components/image/Image';
import { useNavigate } from 'react-router';
import CAlert from 'src/components/CAlert';
import { PATH_AUTH } from 'src/routes/paths';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close.svg';

type Props = {
  handleClose?: VoidFunction;
  getData: VoidFunction;
};

/**
 * ## Detail 설명
 *
 */
export const Detail = observer(({ handleClose, getData }: Props) => {
  const rootStore = useStores();
  const { eventStore, loadingStore, responseStore } = rootStore;
  const theme = useTheme();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const [openAlert, setOpenAlert] = useState(false);

  const navigate = useNavigate();
  const event = eventStore.event;

  const handleClick = async () => {
    if (event.eventTypeCd.code === 410001 && event.buttonLink) {
      if (event.buttonLink.startsWith('/')) {
        navigate(event.buttonLink);
      } else if (event.buttonLink.startsWith('http')) {
        window.open(event.buttonLink, 'target=_blank');
      } else {
        alert('이동할 수 없는 링크입니다.');
      }
    } else if (event.eventTypeCd.code === 410002) {
      CallApiToStore(eventStore.post(event.eventSid), 'api', loadingStore).then(() => {
        if (responseStore.responseInfo.resultCode === 'S') {
          setOpenAlert(true);
          CallApiToStore(eventStore.get(event.eventSid), 'api', loadingStore);
          // eventStore.resetEvents();
          getData();
        } else if (responseStore.responseInfo.errorMessage) {
          setOpenAlert(true);
        }
      });
    }
  };

  return (
    <>
      <Box
        p={0}
        m={0}
        width={'100%'}
        sx={{
          position: 'relative',
        }}
      >
        <Box position={'sticky'} top={0} sx={{ width: '100%' }}>
          {/* close button */}
          <Stack
            direction={'row'}
            justifyContent={'flex-end'}
            spacing={1}
            position={'absolute'}
            top={pxToRem(25)}
            right={pxToRem(25)}
            zIndex={theme.zIndex.tooltip}
          >
            <Iconify
              icon="ic:outline-close"
              onClick={handleClose}
              sx={{
                color: theme.palette.common.black,
                width: 26,
                height: 26,
              }}
            />
          </Stack>
          {/* image */}
          <Image
            src={
              event.thumbnlPath
                ? REACT_APP_IMAGE_STORAGE + event.thumbnlPath
                : '/assets/placeholder.svg'
            }
            onError={(e: any) => {
              e.target.src = '/assets/placeholder.svg';
            }}
            disabledEffect
          />
        </Box>

        {/* contents */}
        <Box
          position={'relative'}
          sx={{
            transform: `translateY(-${pxToRem(25)})`,
            // scrollMarginY: -pxToRem(25),
            borderRadius: `${pxToRem(25)}  ${pxToRem(25)}  0 0 !important`,

            backgroundColor: theme.palette.common.white,
            px: pxToRem(20),
            pt: pxToRem(28),
            width: '100%',
            minHeight: '90vh',
            // '@media (min-width: 900px)': {
            //   minHeight: '55vh',
            // },
            // textAlign: 'center',
            // justifyContent: 'space-between',
          }}
        >
          {/* contents Detail */}
          <Box textAlign={'left'}>
            <Box mb={pxToRem(26)}>
              <Typography
                variant="Kor_22_b"
                component={'div'}
                sx={{
                  wordBreak: 'keep-all',
                }}
              >
                {event.eventNm}
              </Typography>
              <Typography
                variant="Kor_14_r"
                component={'div'}
                color={theme.palette.grey[500]}
                mt={1}
              >
                {moment(event.applyStDay).format('YYYY.MM.DD')}~
                {moment(event.applyEdDay).format('YYYY.MM.DD')}
              </Typography>
            </Box>
            <Divider sx={{ borderWidth: 1 }} />
            <Box mt={pxToRem(30)}>
              <Typography variant="Kor_16_b" component={'div'}>
                혜택
              </Typography>
              <Typography variant="Kor_16_r" component={'div'} mt={1}>
                {event.eventConts}
              </Typography>
            </Box>
            {/*<Box mt={pxToRem(24)}>
              <Typography variant="subtitle1">기간</Typography>
              <Typography variant="body2" mt={1}>
                {'YYYY.MM.DD(dd)~YYYY.MM.DD(dd)'}
              </Typography>
              <Typography variant="body2" color={theme.palette.grey[500]}>
                {'*유의사항'}
              </Typography>
            </Box>*/}
            <Box mt={pxToRem(24)}>
              <Typography variant="Kor_16_b" component={'div'}>
                대상
              </Typography>
              <Typography variant="Kor_16_r" component={'div'} mt={1}>
                {event.rewardNm}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* button */}
        {event.buttonYn === true ? (
          <Button
            variant="contained"
            size={'large'}
            onClick={handleClick}
            disabled={!!event.prtcptnYn}
            sx={{
              height: pxToRem(60),
              maxWidth: 'md',
              width: '100%',
              borderRadius: `${pxToRem(30)}  ${pxToRem(30)}  0 0 !important`,
              position: 'fixed',
              bottom: 0,
            }}
          >
            <Typography variant="Kor_18_b">
              {event.prtcptnYn === true ? '참여완료' : event.buttonNm}
            </Typography>
          </Button>
        ) : (
          <Box
            sx={{
              height: pxToRem(25),
              maxWidth: 'md',
              width: '100%',
              position: 'fixed',
              bottom: 0,
              backgroundColor: theme.palette.common.white,
            }}
          />
        )}
      </Box>

      {/* alert */}
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
        {/* {responseStore.responseInfo.errorCode === '401' && (
          <Stack direction="row" sx={{ justifyContent: 'flex-end', p: 0 }}>
            <IconButton size={'large'} onClick={() => setOpenAlert(false)}>
              <CloseIcon stroke={theme.palette.common.black} />
            </IconButton>
          </Stack>
        )} */}
        {responseStore.responseInfo.resultCode === 'S' ? (
          <Typography variant="Kor_16_r" textAlign={'center'}>
            응모가 정상적으로 이루어졌습니다.
          </Typography>
        ) : (
          <Typography variant="Kor_16_r" textAlign={'center'}>
            {responseStore.responseInfo.errorMessage}
          </Typography>
        )}

        <Stack direction={'row'} display={'flex'} justifyContent={'space-between'} gap={1}>
          {responseStore.responseInfo.errorCode === '401' && (
            <Button
              fullWidth
              variant="contained"
              size={'medium'}
              sx={{ mt: 3, borderRadius: 3 }}
              onClick={() => {
                setOpenAlert(false);
                navigate(PATH_AUTH.login, { state: { referrer: document.referrer } });
              }}
            >
              로그인
            </Button>
          )}
          <Button
            fullWidth
            variant={responseStore.responseInfo.errorCode === '401' ? 'outlined' : 'contained'}
            size={'medium'}
            sx={{ mt: 3, borderRadius: 3 }}
            onClick={() => {
              setOpenAlert(false);
            }}
          >
            {/* 확인 */}
            {responseStore.responseInfo.errorCode === '401' ? '취소' : '확인'}
          </Button>
        </Stack>
      </Dialog>

      {/* <CAlert
        isAlertOpen={openAlert}
        alertCategory={'f2d'}
        alertTitle="이벤트"
        alertContent={
          responseStore.responseInfo.resultCode === 'S'
            ? '응모가 정상적으로 이루어졌습니다.'
            : responseStore.responseInfo.errorMessage || undefined
        }
        hasXbutton={responseStore.responseInfo.errorCode === '401' ? true : false}
        hasCancelButton={responseStore.responseInfo.errorCode === '401' ? true : false}
        callBack={() => {
          if (responseStore.responseInfo.errorCode === '401') {
            navigate(PATH_AUTH.login, { state: { referer: Detail } });
          } else {
          }
        }}
        handleAlertClose={() => {
          setOpenAlert(false);
        }}
      /> */}
    </>
  );
});

export default Detail;
