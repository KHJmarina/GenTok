import { Box, Stack, Typography, Button, Divider, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';
import { CallApiToStore } from 'src/utils/common';
import { pxToRem } from 'src/theme/typography';
import parse from 'html-react-parser';
import CAlert from 'src/components/CAlert';
import '../../../setting/terms-setting/terms-style.css';

/**
 * ## AgreeItem 설명
 *
 */

interface Props {
  termssCheck: any;
  setTermssCheck: any;
}

export const AgreeItem = observer(({ termssCheck, setTermssCheck }: Props) => {
  const rootStore = useStores();
  const { loadingStore, termsStore, orderStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // const checkboxIcon = (
  //   <Iconify
  //     icon={'material-symbols:check-circle-outline-rounded'}
  //     color={'#DFE0E2'}
  //   />
  // );
  // const checkedIcon = (
  //   <Iconify icon={'material-symbols:check-circle-outline-rounded'} />
  // );

  const viewTerms = async (termsSid: number) => {
    await termsStore.get(termsSid).then(() => {
      setOpenDialog(true);
    });
  };

  useEffect(() => {
    window.addEventListener('popstate', () => {
      setOpenDialog(false);
      setIsAlertOpen(false);
    })
  },[]);

  return (
    <>
      <Stack>
        <Stack sx={{ m: pxToRem(20), mb: 0 }}>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(8) }} justifyContent='space-between'>
            <Typography variant={'Kor_16_b'}>결제 진행 필수 전체 동의</Typography>
            <Checkbox
              disableRipple
              sx={{ m: 0 }}
              icon={
                <Iconify
                  icon={'material-symbols:check-circle-rounded'}
                  color={'#DFE0E2'}
                />
              }
              checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
              checked={
                termssCheck.length > 0 &&
                termssCheck.filter((t: any) => t.agrmntYn === true).length === termssCheck.length
              }
              onClick={(e: any) => {
                if (e.nativeEvent.target.checked !== undefined) {
                  const temp: any = [];
                  termssCheck.map((t: any) => {
                    let obj = Object.create({}, {
                      termsSid: {value: t.termsSid},
                      agrmntYn: {value: e.nativeEvent.target.checked}
                    });
                    temp.push(obj);
                  });
                  setTermssCheck(temp);
                  orderStore.orderItem.setProps({ termsAgreementList: temp });
                }
              }}
            />
          </Box>
          <Divider sx={{ borderColor: '#EEEEEE', borderWidth: pxToRem(0.5), mb: pxToRem(17) }}/> */}

          <Stack sx={{ mb: pxToRem(20) }}>
            {termsStore.termss.map((terms, index) => {
              return (
                <Stack
                  justifyContent={'space-between'}
                  direction={'row'}
                  alignContent={'center'}
                  alignItems={'center'}
                  key={index}
                  sx={{ mb: termsStore.termss.length - 1 != index ? pxToRem(16) : null }}
                >
                  <Typography sx={{ fontSize: pxToRem(12), fontWeight: 400, lineHeight: pxToRem(18) }}>
                    {terms.agrmntMustYn ? '[필수] ' : '[선택] '} {terms.termsNm}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: pxToRem(12),
                      fontWeight: 400,
                      lineHeight: pxToRem(18),
                      color: '#9DA0A5',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    onClick={() => { 
                      terms.contsYn 
                      ? viewTerms(terms.termsSid) 
                      : setIsAlertOpen(true); window.history.pushState(null,'',window.location.href);
                    }}
                  >
                    보기
                  </Typography>

                  {/* <Button
                    disableRipple
                    variant={'text'}
                    color="inherit"
                    size={'small'}
                    onClick={() => { terms.contsYn ? viewTerms(terms.termsSid) : setIsAlertOpen(true) }}
                    sx={{
                      p: 0,
                      fontWeight: 400,
                      fontSize: pxToRem(12),
                      textDecoration: 'underline',
                      transform: 'translate(-8px,-0.5px)',
                      '&:hover': {background: 'none'},
                      color: '#9DA0A5',
                      lineHeight: pxToRem(18),
                    }}
                  >
                    보기
                  </Button> */}

                  {/* <Checkbox
                    disableRipple
                    sx={{ m: 0 }}
                    name="privacy"
                    icon={checkboxIcon}
                    checkedIcon={checkedIcon}
                    checked={
                      termssCheck.filter((c: any) => c.termsSid === terms.termsSid && c.agrmntYn === true).length > 0
                    }
                    onClick={(e: any) => {
                      if (e.nativeEvent.target.checked !== undefined) {
                        const tempArr: any = [];
                        let agrmntYn = false;
                        termssCheck.map((t: any) => {
                          t.termsSid === terms.termsSid
                          ? agrmntYn = e.nativeEvent.target.checked
                          : agrmntYn = t.agrmntYn

                          let obj = Object.create({}, {
                            termsSid: {value: t.termsSid},
                            agrmntYn: {value: agrmntYn}
                          });
                          tempArr.push(obj);
                        });
                        setTermssCheck(tempArr);
                        orderStore.orderItem.setProps({ termsAgreementList: tempArr });
                      }
                    }}
                  /> */}
                </Stack>
              )
            })}
          </Stack>
          <Box
            sx={{
              px: pxToRem(40.5),
              py: pxToRem(20),
              background: '#FAFAFA',
            }}
          >
            <Typography variant='Kor_14_b'>주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.</Typography>
          </Box>
        </Stack>

        <Dialog // 약관 내용이 있는 경우
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
              fontSize: pxToRem(18),
              fontWeight: 600,
            }}
          >
            {parse(termsStore.terms.termsNm)}
          </DialogTitle>
          <DialogContent sx={{ px: pxToRem(20) }}>
            <DialogContentText
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              {parse(termsStore.terms.termsConts)}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: '0 !important', mt: 'auto' }}>
            <Button
              size={'large'}
              sx={{ alignSelf: 'end', p: '0 !important', mr: pxToRem(8), mb: pxToRem(17), '&:hover': { background: 'none' } }}
              variant="text"
              onClick={() => { setOpenDialog(false); navigate(-1); }}
            >
              <Typography variant="Kor_18_b">확인</Typography>
            </Button>
          </DialogActions>
        </Dialog>

        <CAlert // 약관 내용이 없는 경우
          alertContent={'약관 준비중입니다.'}
          alertCategory='info'
          isAlertOpen={isAlertOpen}
          handleAlertClose={() => {
            setIsAlertOpen(false);
            navigate(-1);
          }}
        />
      </Stack>
    </>
  );
});

export default AgreeItem;