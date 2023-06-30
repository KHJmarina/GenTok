import React from 'react';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import {
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  Slide,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { CustomerHeader } from 'src/components/CustomerHeader';
import { useNavigate } from 'react-router';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { sendReactNativeMessage } from 'src/utils/common';
import SettingProfileEdit from './SettingProfileEdit';
import { TransitionProps } from '@mui/material/transitions';

/**
 * ## Profile 설명
 *
 */

export const SettingProfile = observer((props) => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  const [dialogType, setDialogType] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);

  const getData = async () => {
    // const res = await fetch(REACT_APP_API_URL + 'faq')
    //   .then(async (res: any) => {
    //     const json = await res.json();
    //     setList(json.faqList);
    //     setLoading(false);
    //   }).catch((e: any) => {
    //     setList(faqList);
    //     setLoading(false);
    //   });
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

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

  return (
    <>
      <List
        sx={{
          width: '100%',
          pl: 0,
          pb: 0,
          borderBottom: '1px solid #f3f3f3',
        }}
      >
        <Typography variant={'body2'} sx={{ ...listTitleStyle }}>
          닉네임
        </Typography>
        <ListItem onClick={() => onDialog('nickname')} sx={{ ...listStyle }}>
          <Typography variant={'body1'} sx={{ mb: 1 }}>
            홍길동
          </Typography>
          <ListItemIcon>
            <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
          </ListItemIcon>
        </ListItem>
      </List>

      <List
        sx={{
          width: '100%',
          pl: 0,
          pb: 0,
          borderBottom: '1px solid #f3f3f3',
        }}
      >
        <Typography variant={'body2'} sx={{ ...listTitleStyle }}>
          주소
        </Typography>
        <ListItem onClick={() => onDialog('address')} sx={{ ...listStyle }}>
          <Typography variant={'body1'} sx={{ mb: 1 }}>
            서울 강남구 강남대로 123 3층
          </Typography>
          <ListItemIcon>
            <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
          </ListItemIcon>
        </ListItem>
      </List>

      <List
        sx={{
          width: '100%',
          pl: 0,
          pb: 0,
          borderBottom: '1px solid #f3f3f3',
        }}
      >
        <Typography variant={'body2'} sx={{ ...listTitleStyle }}>
          휴대폰
        </Typography>
        <ListItem onClick={() => onDialog('phone')} sx={{ ...listStyle }}>
          <Typography variant={'body1'} sx={{ mb: 1 }}>
            010-1234-5678
          </Typography>
          <ListItemIcon>
            <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
          </ListItemIcon>
        </ListItem>
      </List>

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
        {/* <CustomerHeader
          title="닉네임 수정"
          handleClose={() => {
            setOpenDialog(false);
          }}
        /> */}
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
  background: '#FFFFFF',
};

const listTitleStyle = {
  pt: 1.5,
  pl: 3,
  color: '#919EAB',
};

export default SettingProfile;
