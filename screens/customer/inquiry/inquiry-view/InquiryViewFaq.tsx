import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';

// style
import { Button, IconButton, ListItem, Stack, Typography, useTheme, Select, MenuItem, Dialog, Divider, FormControl, FormHelperText, Slide, FormControlLabel, Checkbox, DialogTitle, DialogContentText, DialogActions, DialogContent } from '@mui/material';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import CTextField from 'src/components/forms/CTextField';
import FileUpload from '../FileIcon';
import { Icon } from '@iconify/react';

import FormProvider from 'src/components/hook-form/FormProvider';
import { Controller, useForm } from 'react-hook-form';
import { IInquirySnapshot } from 'src/models/inquiry/Inquiry';
import { useStores } from 'src/models/root-store/root-store-context';
import { CallApiToStore } from 'src/utils/common';
import _, { isString } from 'lodash';
import { AnimatePresence } from 'framer-motion';
import { DropzoneOptions, DropEvent, FileRejection } from 'react-dropzone';
import CAlert from 'src/components/CAlert';
import { selectOptions } from 'src/components/forms/CTextField';
import { useAuthContext } from 'src/auth/useAuthContext';
import { loadString } from 'src/utils/storage';
import { pxToRem } from 'src/theme/typography';
import parse from 'html-react-parser';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { toJS } from 'mobx';
import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import InquiryOrder from './InquiryOrder';
import { HEADER } from 'src/config-global';
import { useLocation, useNavigate } from 'react-router';
import FaqConnect from './FaqConnect';
import Iconify from 'src/components/iconify';
import CHeader from 'src/components/CHeader';
/**
 * ## InquiryView 설명
 *
 */
interface Props {
  onSave: VoidFunction;
  select?: any;
  data?: any;
}

export const InquiryViewFaq = observer(() => {
  const rootStore = useStores();
  const { inquiryStore, faqStore } = rootStore;
  const theme = useTheme();
  const [open, setOpen] = useState(true)
  const [popup, setPopup] = useState(false)

  const options: any = { showMainIcon: 'back', showHomeIcon: true };

  return (
    <>
      {open && (
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          hideBackdrop
          disableEscapeKeyDown
          open={open}
          TransitionComponent={Transition}
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
            setOpen(false);
          }}
          sx={{
            margin: '0 !important',
            zIndex: 100,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <CHeader title={'1:1문의'} {...options} />
          <Stack sx={{ p: pxToRem(20), pt: '30%' }}>
            <Stack sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Box><Typography variant='Kor_18_b' sx={{ textAlign: 'center' }}>문의 전 FAQ를 확인해 주세요!</Typography></Box>
              <Box><FaqConnect dailogYn={true} /></Box>
            </Stack>
          </Stack>
          <Button
            variant="contained"
            size={'large'}
            onClick={() => { setOpen(false); setPopup(true) }}
            disabled={false}
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
              문의하기
            </Typography>
          </Button>
        </Dialog>
      )}

      {popup && (
        <Dialog
          fullWidth
          keepMounted
          // maxWidth={'md'}
          hideBackdrop
          disableEscapeKeyDown
          open={popup}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              width: '90%',
              maxHeight: '70%',
              minHeight: '70%',
              borderRadius: pxToRem(20),
            },
          }}
          onClose={() => {
            setOpen(false);
          }}
          sx={{
            margin: '0 !important',
            zIndex: 100,
            padding: 0,
            borderRadius: 0,
            background: alpha(theme.palette.grey[900], 0.7),
          }}
        >
          <DialogTitle
            sx={{
              position: 'sticky',
              top: 0,
              textAlign: 'left',
              px: pxToRem(20),
              pt: pxToRem(20),
              pb: pxToRem(15),
              background: theme.palette.background.paper,
              fontVariant: 'Kor_18_b',
            }}
          >
            1:1 문의 전 확인해 주세요.
          </DialogTitle>
          <DialogContent sx={{ px: pxToRem(20), fontVariant: 'Kor_14_r', overflowY: 'auto' }}>
            <Typography sx={{ color: '#F93D40' }}>* 반품/교환 문의글 작성시 반드시 이미지 첨부가 필요합니다.</Typography>
            <Stack sx={{ pt: pxToRem(15) }}>
              <Typography variant='Kor_14_b' sx={{ py: pxToRem(8) }}>[반품 요청시]</Typography>
              <Typography>키트 비닐압축포장이 훼손된 경우 환불 및 반품이 불가합니다. 반품 문의 시, 키트 상태를 확인할 수 있도록 사진을 첨부해주세요.</Typography>
            </Stack>

            <Stack sx={{ pt: pxToRem(15) }}>
              <Typography variant='Kor_14_b' sx={{ py: pxToRem(8) }}>[교환 요청시]</Typography>
              <Typography>상품 불량(뚜껑, 튜브, 보존액 등 구성품 누락)의 경우, 키트 상태를 확인할 수 있도록 사진을 첨부해주세요.</Typography>
              <Typography sx={{ py: pxToRem(15) }}>등록해주신 문의사항은 담당자 확인 후 빠르게 안내드리겠습니다.</Typography>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: '0 !important' }}>
            <Button
              variant={'outlined'}
              size={'large'}
              sx={{ width: '100%', border: '1px solid #eeeeee', borderRadius: pxToRem(40), m: pxToRem(20), p: '0 !important', color: theme.palette.grey[500] }}
              onClick={() => { setPopup(false) }}
            >
              <Typography variant="Kor_18_b">확인</Typography>
            </Button>
          </DialogActions>
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
export default InquiryViewFaq;
