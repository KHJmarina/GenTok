import {
  Button,
  Checkbox,
  FormGroup,
  Stack,
  Typography,
  useTheme,
  Dialog,
  Slide,
  Divider,
  Alert,
  Box,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/models/root-store/root-store-context';
import React, { useEffect, useState } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { CallApiToStore, sendReactNativeMessage } from 'src/utils/common';
import Iconify from 'src/components/iconify';
import Identify from '../register/Identify';
import AgreeDetail from './AgreeDetail';
import { useLocation, useNavigate } from 'react-router-dom';
import { ITermsSnapshot } from 'src/models/terms/Terms';
import parse from 'html-react-parser';
import { ITermsAgreeSnapshot } from 'src/models/terms-agree/TermsAgree';
import Header from 'src/components/PageHeader';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import BackHeader from 'src/components/BackHeader';
import CStepLiner from 'src/components/CStepLiner';
import { pxToRem } from 'src/theme/typography';
import { PATH_AUTH } from 'src/routes/paths';
import { isObject } from 'lodash';
import '../../setting/terms-setting/terms-style.css';

type Props = {
  handleClose: VoidFunction;
};

/**
 * ## 회원가입 - 1.약관동의
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
export const AgreeInfo = observer(({ handleClose }: Props) => {
  const theme = useTheme();
  const rootStore = useStores();
  const { termsStore, loadingStore } = rootStore;
  const { state } = useLocation();
  const navigate = useNavigate();

  const [check, setCheck] = useState<any>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openIdentify, setOpenIdentify] = useState(false);

  const listener = async (event: any) => {
    try {
      if (!isObject(event.data)) {
        const data = JSON.parse(event.data);
        if (data.type === 'handleHistoryBack') {
          setOpenDialog(false);
          setOpenIdentify(false);
        }
      }
    } catch (e) { }
  };
  useEffect(() => {
    try {
      document.addEventListener('message', listener);
      window.addEventListener('message', listener);
    } catch (e) { }
    return () => {
      try {
        document.removeEventListener('message', listener);
        window.removeEventListener('message', listener);
      } catch (e) { }
    };
  }, []);

  useEffect(() => {
    // console.log('🌈 ~ AgreeInfo ~ state:', state)
    CallApiToStore(termsStore.getRegTerms(), 'api', loadingStore).then(() => {
      const temp: any = [];
      termsStore.termss.map((t: any) =>
        temp.push({ id: t.termsSid, checked: false, agrmntMustYn: t.agrmntMustYn, ver: t.ver }),
      );
      setCheck(temp);
    });
  }, []);

  const viewTerms = async (termsSid: number) => {
    await termsStore.get(termsSid).then(() => {
      setOpenDialog(true);
    });
  };

  const handleNext = () => {
    const termsAgreementList: ITermsAgreeSnapshot[] = [];
    check.map((c: any) => {
      termsAgreementList.push({
        termsSid: c.id,
        agrmntYn: c.checked,
        ver: '', //c.ver
      });
    });
    navigate('', {
      state: {
        ...state,
        termsAgreementList: termsAgreementList,
      },
    });
    setOpenIdentify(true);
  };

  return (
    <>
      <Stack
        justifyContent={'space-between'}
        sx={{
          flex: 1,
          height: '100%',
          scrollMarginTop: '100px',
        }}
      >
        <BackHeader
          title={'회원가입'}
          handleClose={() => {
            // handleClose && handleClose();
            // !handleClose && window.history.back();
            navigate(PATH_AUTH.login, { replace: true });
          }}
        />
        <CStepLiner step={1} totalStep={5} />

        <Stack
          sx={{ flex: 1, alignItems: 'center', px: pxToRem(20), pb: pxToRem(40), mt: pxToRem(75) }}
        >
          {/* <Stack sx={{ height: '100%', mt: pxToRem(75) }}> */}
          <Typography variant={'Kor_22_r'} mb={pxToRem(55)} textAlign={'center'}>
            원활한 서비스 이용을 위해
            <br />
            이용약관에 동의해 주세요.
          </Typography>
          <Box sx={{ width: '100%', mb: pxToRem(35) }}>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignContent={'center'}
              alignItems={'center'}
            >
              <Typography variant={'Kor_16_b'}>약관에 모두 동의</Typography>
              <Checkbox
                disableRipple
                disableFocusRipple
                disableTouchRipple
                sx={{ p: 0 }}
                icon={
                  <Iconify
                    icon={'material-symbols:check-circle-rounded'}
                    color={theme.palette.grey[400]}
                  />
                }
                checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
                checked={
                  check.length > 0 &&
                  check.filter((c: any) => c.checked === true).length === check.length
                }
                onClick={(e: any) => {
                  if (e.nativeEvent.target.checked !== undefined) {
                    const temp: any = [];
                    check.map((t: any) =>
                      temp.push({ ...t, checked: e.nativeEvent.target.checked }),
                    );
                    setCheck(temp);
                  }
                }}
              />
            </Stack>

            <Divider
              sx={{
                mt: pxToRem(15),
                mb: pxToRem(35),
                borderWidth: pxToRem(0.5),
                borderColor: theme.palette.common.black,
              }}
            />

            <Stack gap={pxToRem(8)}>
              {termsStore.termss.map((term: ITermsSnapshot, i: number) => {
                return (
                  <Stack
                    key={`terms-${i}`}
                    justifyContent={'space-between'}
                    direction={'row'}
                    // alignContent={'center'}
                    // alignItems={'center'}
                    textAlign={'left'}
                  >
                    <Typography variant={'Kor_14_r'}>
                      {term.agrmntMustYn ? '[필수] ' : '[선택] '} {term.termsNm}
                      {term.contsYn && (
                        <Button
                          variant={'text'}
                          color="inherit"
                          size={'small'}
                          onClick={() => viewTerms(term.termsSid)}
                          sx={{
                            pl: 0,
                            fontWeight: 400,
                            fontSize: pxToRem(12),
                            textDecoration: 'underline',
                            transform: 'translate(-8px,-0.5px)',
                          }}
                        >
                          보기
                        </Button>
                      )}
                    </Typography>
                    <Checkbox
                      disableRipple
                      disableFocusRipple
                      disableTouchRipple
                      name="agree"
                      sx={{ p: 0 }}
                      icon={
                        <Iconify
                          icon={'material-symbols:check-circle-outline-rounded'}
                          color={theme.palette.grey[400]}
                        />
                      }
                      checkedIcon={
                        <Iconify icon={'material-symbols:check-circle-outline-rounded'} />
                      }
                      checked={
                        check.filter((c: any) => c.id === term.termsSid && c.checked === true)
                          .length > 0
                      }
                      onClick={(e: any) => {
                        if (e.nativeEvent.target.checked !== undefined) {
                          setCheck(
                            check.map((c: any) =>
                              c.id === term.termsSid
                                ? { ...c, checked: e.nativeEvent.target.checked }
                                : c,
                            ),
                          );
                        }
                      }}
                    />
                  </Stack>
                );
              })}
            </Stack>
          </Box>
          {/* </Stack> */}
          <Stack width={'100%'} mt={'auto'}>
            <Button
              disabled={
                check.length < 1 ||
                check.filter((c: any) => c.agrmntMustYn === true && c.checked === true).length <
                check.filter((c: any) => c.agrmntMustYn === true).length
              }
              variant={'contained'}
              size={'large'}
              onClick={handleNext}
              sx={{ borderRadius: 3 }}
            >
              동의 후 본인 인증하기
            </Button>
          </Stack>
        </Stack>
      </Stack>

      {openDialog && (
        <Dialog
          keepMounted
          // maxWidth={'md'}
          open={openDialog}
          PaperProps={{
            sx: {
              width: '90%',
              maxHeight: '70%',
              minHeight: '70%',
              borderRadius: pxToRem(20),
            },
          }}
        >
          <DialogTitle
            sx={{
              position: 'sticky',
              top: 0,
              textAlign: 'left',
              px: pxToRem(20),
              pt: pxToRem(28),
              pb: pxToRem(20),
              background: theme.palette.background.paper,
              fontVariant: 'Kor_18_b',
            }}
          >
            {parse(termsStore.terms.termsNm)}
          </DialogTitle>
          <DialogContentText sx={{ px: pxToRem(20), fontVariant: 'Kor_14_r', overflowY: 'auto' }}>
            {parse(termsStore.terms.termsConts)}
          </DialogContentText>
          <DialogActions sx={{ p: '0 !important' }}>
            <Button
              size={'large'}
              sx={{ alignSelf: 'end', p: '0 !important', mr: pxToRem(8), mb: pxToRem(17) }}
              variant="text"
              onClick={() => setOpenDialog(false)}
            >
              <Typography variant="Kor_18_b">확인</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {openIdentify && (
        <Dialog
          fullWidth
          hideBackdrop
          keepMounted
          maxWidth={'md'}
          open={openIdentify}
          TransitionComponent={Transition}
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              p: 0,
              m: 0,
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              '@media (max-width: 600px)': {
                margin: 0,
              },
              boxShadow: 'none',
            },
          }}
          onClose={(e: any, reason: string) => {
            if (reason === 'backdropClick') {
              e.preventDefault();
              e.stopPropagation();
            } else {
              setOpenIdentify(false);
            }
          }}
          sx={{
            margin: '0 !important',
            zIndex: 101,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <Identify
            handleClose={() => {
              setOpenIdentify(false);
            }}
          />
        </Dialog>
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

export default AgreeInfo;
