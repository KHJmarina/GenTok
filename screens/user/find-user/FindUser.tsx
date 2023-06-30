import { Stack, useTheme, Dialog, Slide, Tabs, Tab } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import FindUserEnd from './FindUserEnd';
import FindIdByUserInfo from './FindIdByUserInfo';
import { TabContext, TabPanel } from '@mui/lab';
import FindIdByMobile from './FindIdByMobile';
import BackHeader from 'src/components/BackHeader';
import { pxToRem } from 'src/theme/typography';

type Props = {
  handleClose: VoidFunction;
};

/**
 * ## ID찾기_1.
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
const FindUser = observer(({ handleClose }: Props) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('tab1');

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
          title={'아이디 찾기'}
          handleClose={() => {
            handleClose && handleClose();
            !handleClose && window.history.back();
          }}
        />
        <TabContext value={value}>
          <Stack
            display={'flex'}
            sx={{
              flex: 1,
            }}
          >
            <Stack sx={{ borderBottom: 1, borderColor: 'divider', mb: pxToRem(56) }}>
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
                  label="본인인증 후 찾기"
                  sx={{
                    '&:not(.Mui-selected)': {
                      color: theme.palette.grey[400],
                    },
                  }}
                  value={'tab1'}
                />
                <Tab
                  label="회원 정보로 찾기"
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
              <FindIdByMobile handleNext={handleNext} />
            </TabPanel>

            <TabPanel
              value={'tab2'}
              sx={{ height: '100%', padding: `0 ${pxToRem(20)} ${pxToRem(40)} ${pxToRem(20)}` }}
            >
              <FindIdByUserInfo handleNext={handleNext} />
            </TabPanel>
          </Stack>
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
          <FindUserEnd
            handleClose={() => {
              if (value === 'tab1') {
                setValue('tab2');
              } else if (value === 'tab2') {
                setValue('tab1');
              }
              setOpen(false);
            }}
            defaultTab={value}
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

export default FindUser;
