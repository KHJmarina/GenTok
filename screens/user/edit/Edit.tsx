import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/models/root-store/root-store-context';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import React, { useState } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Withdrawal from '../withdrawal/Withdrawal';
import { CloseIcon } from 'yet-another-react-lightbox/core';
import { blue } from '@mui/material/colors';
import CTextField from 'src/components/forms/CTextField';
import * as Yup from 'yup';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form';
import { sendReactNativeMessage } from 'src/utils/common';
import { useNavigate } from 'react-router-dom';

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
export const Edit = observer(() => {
  const rootStore = useStores();
  const { userStore, loadingStore } = rootStore;

  const navigate = useNavigate();

  const [dialogType, setDialogType] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);

  const onDialog = (type: string = '') => {
    setDialogType(type);
    setOpenDialog(true);
    sendReactNativeMessage({
      type: 'topBackgroundChange',
      payload: {
        color: '#ffffff',
      },
    });
  };

  const closeDialog = () => {
    setOpenDialog(false);
    sendReactNativeMessage({
      type: 'topBackgroundChange',
      payload: {
        color: '#f5f5f5',
      },
    });
  };

  const dialogContent = () => {
    switch (dialogType) {
      case 'withdrawal':
        return <Withdrawal handleClose={closeDialog} />;
        break;
    }
  };

  const [openNick, setOpenNick] = useState(false);

  const valid = Yup.object({
    nick: Yup.string().min(1, '1자 이상 등록해주세요').max(12, '최대 12자 이내로 등록해주세요.'),
  });
  const methods = useForm<any>({
    resolver: yupResolver(valid),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      nick: userStore.user.userNm,
    },
  });

  const {
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async () => {
    if (_.isEmpty(errors)) {
      userStore.setUserName(getValues('nick'));
      setOpenNick(false);
    }
  };

  return (
    <>
      <Box sx={{ flex: 1, background: '#f5f5f5', alignContent: 'flex-start' }}>
        <Box
          sx={{
            position: 'relative',
            textAlign: 'center',
            p: 2,
          }}
        >
          <IconButton sx={{ position: 'absolute', left: 8, top: 11 }} onClick={() => navigate(-1)}>
            <ArrowBackIosIcon fontSize={'small'} />
          </IconButton>
          <Typography variant={'h5'}>내 정보 수정</Typography>
        </Box>

        <List sx={{ width: '100%', mt: 4 }}>
          <ListItem onClick={() => setOpenNick(true)} sx={{ ...listStyle }}>
            <Typography variant={'body2'}>닉네임 수정</Typography>
            <ListItemIcon>
              <Typography variant={'body1'} sx={{ mr: 2 }}>
                {userStore.user.userNm}
              </Typography>
              <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
            </ListItemIcon>
          </ListItem>
          <ListItem onClick={() => onDialog('withdrawal')} sx={{ ...listStyle }}>
            <Typography variant={'body2'}>
              {userStore.user.loginId !== '' ? '탈퇴하기' : '내 정보 삭제'}
            </Typography>
            <ListItemIcon>
              <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
            </ListItemIcon>
          </ListItem>
        </List>

        <Typography variant={'body2'} sx={{ p: 3 }} color={'GrayText'}>
          유전자검사 결과의 "완전 삭제"는 검사를 의뢰한 병원으로 문의해주세요. 완전 삭제 후에는
          복구할 수 없으므로 신중하게 선택해주세요.
        </Typography>
      </Box>

      <Dialog
        maxWidth={'lg'}
        fullWidth
        keepMounted
        open={openDialog}
        TransitionComponent={Transition}
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
          },
        }}
        onClose={() => {
          setOpenDialog(false);
          sendReactNativeMessage({
            type: 'topBackgroundChange',
            payload: {
              color: '#f5f5f5',
            },
          });
        }}
        sx={{
          margin: '0 !important',
          zIndex: 101,
          padding: 0,
          borderRadius: 0,
        }}
      >
        {dialogContent()}
      </Dialog>

      <Dialog
        open={openNick}
        onClose={() => setOpenNick(false)}
        maxWidth={'md'}
        sx={{ margin: '0 !important', zIndex: 101, width: '100%' }}
      >
        <DialogTitle sx={{ pl: 4 }}>
          닉네임 수정
          <IconButton
            aria-label="close"
            onClick={() => setOpenNick(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, minWidth: 340 }}>
          <Box sx={{ p: 4, pt: 0 }}>
            <DialogContentText sx={{ mt: 2, mb: 4 }}>
              원하시는 닉네임을 설정해주세요.
              <br />
              (최대 12자)
            </DialogContentText>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <CTextField
                name={'nick'}
                label={''}
                variant={'standard'}
                sx={{ fontSize: 20, paddingBottom: 12 }}
              />
            </FormProvider>
          </Box>
          <Stack direction={'row'} sx={{}}>
            <Button
              variant={'contained'}
              color={'inherit'}
              size={'large'}
              sx={{ flex: 0.5, borderRadius: 0 }}
              onClick={() => setOpenNick(false)}
            >
              취소
            </Button>
            <Button
              variant={'contained'}
              color={'secondary'}
              size={'large'}
              sx={{ flex: 0.5, borderRadius: 0, backgroundColor: blue[600] }}
              onClick={onSubmit}
            >
              저장
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
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

const listStyle = {
  pt: 1.5,
  pb: 1.5,
  pl: 3,
  justifyContent: 'space-between',
  borderBottom: '1px solid #f3f3f3',
  background: '#FFFFFF',
};

export default Edit;
