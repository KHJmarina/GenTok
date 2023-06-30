import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import {
  Avatar,
  Dialog,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import avata_imm from '../../assets/images/profile_avata.png';
import { useTheme } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import Terms from '../common/terms/Terms';
import { Collect, Privacy } from 'src/routes/elements';
import Edit from './edit/Edit';
import { loadString } from 'src/utils/storage';
import { sendReactNativeMessage } from 'src/utils/common';
import Faq from '../customer/faq/Faq';
/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
export const User = observer(() => {
  const rootStore = useStores();
  const { userStore, loadingStore } = rootStore;

  const theme = useTheme();

  useEffect(() => {
    sendReactNativeMessage({
      type: 'topBackgroundChange',
      payload: {
        color: '#f5f5f5',
      },
    });

    // onDialog('report')

    return () => {
      sendReactNativeMessage({
        type: 'topBackgroundChange',
        payload: {
          color: '#FFFFFF',
        },
      });
    };
  }, []);

  const [dialogType, setDialogType] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);

  const onDialog = (type: string = '') => {
    setDialogType(type);
    setOpenDialog(true);
    sendReactNativeMessage({
      type: 'topBackgroundChange',
      payload: {
        color: type === 'edit' ? '#f5f5f5' : '#ffffff',
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
      case 'edit':
        return <Edit />;
        break;
      case 'terms':
        return <Terms />;
        break;
      case 'privacy':
        return <Privacy />;
        break;
      case 'collect':
        return <Collect />;
        break;
      case 'faq':
        return <Faq />;
        break;
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <Stack
        sx={{
          flex: 1,
          alignItems: 'flex-start',
          textAlign: 'left',
          overflowY: 'auto',
          background: '#f5f5f5',
        }}
      >
        <List
          sx={{
            width: '100%',
            bgcolor: '#f5f5f5',
            p: 2,
            pl: 1,
            mt: 4,
          }}
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar src={avata_imm} sx={{ width: 50, height: 50 }} />
            </ListItemAvatar>
            <Typography variant={'h5'} sx={{ fontWeight: 200 }}>
              {userStore.user.userNm}
            </Typography>
          </ListItem>
        </List>
        <Box sx={{ width: '100%', pl: 3, pb: 1, background: '#f5f5f5' }}>
          <Typography variant={'body2'} color={theme.palette.text.secondary}>
            내 정보
          </Typography>
        </Box>
        <List
          sx={{
            width: '100%',
            pl: 0,
            pb: 0,
          }}
        >
          <ListItem onClick={() => onDialog('edit')} sx={{ ...listStyle }}>
            <Typography variant={'body2'}>내 리포트 정보</Typography>
            <ListItemIcon>
              <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
            </ListItemIcon>
          </ListItem>
          <ListItem onClick={() => onDialog('edit')} sx={{ ...listStyle }}>
            <Typography variant={'body2'}>내 정보 수정</Typography>
            <ListItemIcon>
              <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
            </ListItemIcon>
          </ListItem>
        </List>
        <Box sx={{ width: '100%', pl: 3, pt: 3, pb: 1, background: '#f5f5f5' }}>
          <Typography variant={'body2'} color={theme.palette.text.secondary}>
            기타 정보
          </Typography>
        </Box>
        <List
          sx={{
            width: '100%',
            pl: 0,
            pb: 0,
          }}
        >
          <ListItem onClick={() => onDialog('terms')} sx={{ ...listStyle }}>
            <Typography variant={'body2'}>서비스 이용약관</Typography>
            <ListItemIcon>
              <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
            </ListItemIcon>
          </ListItem>
          <ListItem onClick={() => onDialog('privacy')} sx={{ ...listStyle }}>
            <Typography variant={'body2'}>개인정보 처리방침</Typography>
            <ListItemIcon>
              <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
            </ListItemIcon>
          </ListItem>
          <ListItem onClick={() => onDialog('collect')} sx={{ ...listStyle }}>
            <Typography variant={'body2'}>개인정보 수집 및 이용 목적</Typography>
            <ListItemIcon>
              <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
            </ListItemIcon>
          </ListItem>
          <ListItem sx={{ ...listStyle }}>
            <Typography variant={'body2'}>앱 정보</Typography>
            <ListItemIcon>ver 1.0.0</ListItemIcon>
          </ListItem>
          <ListItem onClick={() => onDialog('faq')} sx={{ ...listStyle }}>
            <Typography variant={'body2'}>자주 묻는 질문(FAQ)</Typography>
            <ListItemIcon>
              <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
            </ListItemIcon>
          </ListItem>
        </List>
        <Box sx={{ width: '100%', p: 3, pt: 2, background: '#f5f5f5' }}>
          <Typography
            variant={'body2'}
            color={theme.palette.text.secondary}
            sx={{ pt: 2, mb: 2, fontSize: '.9rem' }}
          >
            마크로젠
          </Typography>
          <Typography variant={'body2'} color={theme.palette.text.secondary}>
            서울특별시 금천구 벚꽃로 254 10층
          </Typography>
          <Typography variant={'body2'} color={theme.palette.text.secondary}>
            (가산동, 월드메르디앙1차))
          </Typography>
          <Typography variant={'body2'} color={theme.palette.text.secondary}>
            02-2180-7220
          </Typography>
        </Box>
      </Stack>
      // TODO CDialog로 만들것
      <Dialog
        fullWidth
        keepMounted
        maxWidth={'lg'}
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
          zIndex: 100,
          padding: 0,
          borderRadius: 0,
        }}
      >
        {dialogContent()}
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

export default User;
