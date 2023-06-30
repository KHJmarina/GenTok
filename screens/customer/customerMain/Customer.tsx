import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { Stack, Box, useTheme, Divider, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSettingsContext } from 'src/components/settings/SettingsContext';
import profile_avata from 'src/assets/images/profile_avata.svg';
import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import { useStores } from 'src/models/root-store/root-store-context';
import { observer } from 'mobx-react-lite';
import { pxToRem } from 'src/theme/typography';
import { toJS } from 'mobx';
import CHeader from 'src/components/CHeader';
import { PATH_AUTH, PATH_ROOT } from 'src/routes/paths';
import navConfig from 'src/layouts/mobile/nav/config-navigation';
import NavList from 'src/components/nav-section/mini/NavList';
import Scrollbar from 'src/components/scrollbar';
import { display } from '@mui/system';
import CustomerHelp from './CustomerHelp';
import CustomerNotice from './CustomerNotice';
import CustomerKakao from './CustomerKakao';
import CustomerCall from './CustomerCall';
import Footer from 'src/layouts/mobile/Footer';

/**
 * ## Customer 설명
 *
 */
export const Customer = observer(() => {

  const rootStore = useStores();
  const { loadingStore, marketStore } = rootStore;
  const theme = useTheme();

  const { pathname } = useLocation();

  const { user, isAuthenticated } = useAuthContext();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const scrollRef = useRef<any>(null);

  const navigate = useNavigate();

  const { themeMode } = useSettingsContext();

  const iconColor = themeMode === 'light' ? '#202123' : '#FFFFFF';

  const auth = useAuthContext();
  const logout = () => {
    auth.logout();
    marketStore.cartStore.reset();
    navigate(PATH_ROOT.root, { replace: true });
  };

  const getProfileImage = () => {
    if (user?.profileImgPath) {
      if (user?.profileImgPath.substr(0, 4) === 'http') {
        return user?.profileImgPath;
      } else {
        return REACT_APP_IMAGE_STORAGE + user?.profileImgPath;
      }
    } else {
      return profile_avata;
    }
  };

  useEffect(() => {
    getProfileImage();
  }, [user]);

  useEffect(() => {
    setOpen(localStorage.getItem('navOpen') === 'true');
  }, []);

  const removeNavOpen = () => {
    localStorage.removeItem('navOpen');
  };


  const options: any = {
    showMainIcon: 'back',
    showCartIcon: true,
  };
  return (
    <>
      <Paper
        sx={{
          p: 0,
          pb: 5,
          m: 0,
          maxHeight: '100%',
          minHeight: '100%',
          maxWidth: '786px',
          borderRadius: '0 !important',
          '@media (max-width: 600px)': {
            margin: 0,
          },
          boxShadow: 'none',
        }}
        ref={scrollRef}
      >
        <Stack
          direction={'column'}
          justifyContent={'space-between'}
          sx={{ flex: 1, height: '100%' }}
        >
          <Box>
            <Scrollbar sx={{ height: '100%' }}>
              <CHeader title="고객센터" {...options} />
              <Divider sx={{ borderWidth: '1px' }} />
              {/* 도와드릴까요? */}
              <CustomerHelp />
              <Divider />
              {/* 공지사항 */}
              <CustomerNotice />
              <Divider />
              {/* 카카오톡 상담. 현재는 닫아두기로 함. */}
              {/* <CustomerKakao /> */}
              {/* 전화상담 */}
              <CustomerCall />
            </Scrollbar>
          </Box>
        </Stack>
        <Footer />
      </Paper>
    </>
  );
});

export default Customer;