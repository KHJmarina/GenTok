import { Stack, Typography, useTheme, Dialog, Slide, Tabs, Tab, Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';
import NewPassword from './NewPassword';
import { TabContext, TabPanel } from '@mui/lab';
import FindPwByMobile from './FindPwByMobile';
import FindPwByEmail from './FindPwByEmail';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import BackHeader from 'src/components/BackHeader';
import { pxToRem } from 'src/theme/typography';

type Props = {
  handleClose: VoidFunction;
};

/**
 * ## 비밀번호 찾기_1.
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */

const FindPassword = observer(({ handleClose }: Props) => {
  const theme = useTheme();
  const [value, setValue] = useState('tab1');
  const [open, setOpen] = useState(false);
  const [certifyKey, setCertifyKey] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleNext = () => {
    setOpen(true);
  };

  return (
    <>
      <Stack
        justifyContent={'space-between'}
        sx={{ flex: 1, height: '100%', scrollMarginTop: '100px' }}
      >
        <BackHeader
          title={'비밀번호 찾기'}
          handleClose={() => {
            handleClose && handleClose();
            !handleClose && window.history.back();
          }}
        />

        <TabContext value={value}>
          <Stack
            display={'flex'}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              flex: 1,
              mb: pxToRem(40),
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              aria-label="find id tabs"
              sx={{
                fontVariant: 'Kor_16_b',
                '& .MuiTab-root': {
                  m: '0 !important',
                },
              }}
            >
              <Tab
                label="휴대폰 인증"
                sx={{
                  '&:not(.Mui-selected)': {
                    color: theme.palette.grey[400],
                  },
                }}
                value={'tab1'}
              />
              <Tab
                label="이메일 인증"
                sx={{
                  '&:not(.Mui-selected)': {
                    color: theme.palette.grey[400],
                  },
                }}
                value={'tab2'}
              />
            </Tabs>
          </Stack>

          <TabPanel
            value={'tab1'}
            sx={{ height: '100%', padding: `0 ${pxToRem(20)} ${pxToRem(40)} ${pxToRem(20)}` }}
          >
            <FindPwByMobile handleNext={handleNext} setCertifyKey={setCertifyKey} />
          </TabPanel>

          <TabPanel
            value={'tab2'}
            sx={{ height: '100%', padding: `0 ${pxToRem(20)} ${pxToRem(40)} ${pxToRem(20)}` }}
          >
            <FindPwByEmail handleNext={handleNext} setCertifyKey={setCertifyKey} />
          </TabPanel>
        </TabContext>
      </Stack>

      {open && (
        <Dialog
          fullWidth
          hideBackdrop
          keepMounted
          maxWidth={'md'}
          open={open}
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
              setOpen(false);
            }
          }}
          sx={{
            margin: '0 !important',
            zIndex: 101,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <NewPassword
            handleClose={() => {
              // if (value === 'tab1') {
              //   setValue('tab2');
              // } else if (value === 'tab2') {
              //   setValue('tab1');
              // }
              setOpen(false);
            }}
            defaultTab={value}
            certifyKey={certifyKey}
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

export default FindPassword;
