import React from 'react';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStores } from 'src/models/root-store/root-store-context';
import { IconButton, useTheme } from '@mui/material';
import { Typography, Stack, Dialog, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import moment from 'moment';
import { Icon } from '@iconify/react';
import { CallApiToStore } from 'src/utils/common';
import { INoticeSnapshot } from 'src/models';
import NoticeDialog from './NoticeDetail';
import { HEADER } from 'src/config-global';
import parse from 'html-react-parser';
import { pxToRem } from 'src/theme/typography';
import BackHeader from 'src/components/BackHeader';
import { useScroll } from 'framer-motion';
import CHeader from 'src/components/CHeader';

/**
 * ## Notice 설명
 *
 */

export const Notice = observer(() => {
  const rootStore = useStores();
  const { noticeStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [open, setOpen] = useState(false);

  const getData = async () => {
    CallApiToStore(noticeStore.gets(), 'api', loadingStore);
  };

  const getDetail = async (noticeSid: number) => {
    CallApiToStore(noticeStore.get(noticeSid), 'api', loadingStore)
      .then((e) => {
        setOpen(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getData();
    if (state) {
      getDetail(state)
    }
  }, []);

  // infinite scroll
  const addPage = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!noticeStore.pagination.last) {
        noticeStore.pagination.setProps({
          page: noticeStore.pagination.page + 1,
        });
        resolve(noticeStore.pagination.page);
      } else {
        reject('last page'); // new Error('last page')
      }
    });
  };

  const { scrollYProgress, scrollY } = useScroll();
  useEffect(() => {
    scrollYProgress.on('change', (v) => {
      if (v > 0.8) {
        if (!loadingStore.loading) {
          addPage()
            .then(() => {
              getData();
            })
            .catch((e) => { });
        }
      }
    });
    return () => {
      noticeStore.pagination.setProps({ page: 1 });
    };
  }, [noticeStore, scrollYProgress]);

  const options: any = {
    showMainIcon: 'back',
    showHomeIcon: true,
  };

  return (
    <>
      <Stack
        sx={{
          flex: 1,
        }}
      >
        <CHeader title="공지사항" {...options} />
        <Stack
          sx={{
            position: 'sticky',
            scrollMarginTop: pxToRem(150),
            justifyContent: 'center',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Box
            sx={{
              flex: 1,
              m: 0,
              mt: pxToRem(15),
              pb: `${HEADER.H_MOBILE * 2}px`,
            }}
          >
            {noticeStore.notices.map((notice: INoticeSnapshot, i: number) => {
              return (
                <Stack
                  key={`notice` + i}
                  sx={{
                    display: 'flex',
                    verticalAlign: 'center',
                    textAlign: 'left',
                    minHeight: pxToRem(70),
                    borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    p: pxToRem(20),
                  }}
                >
                  <Stack onClick={() => getDetail(notice.noticeSid)} sx={{ minWidth: pxToRem(88) }}>
                    {/* 7일 지난 경우 N표시 삭제 */}
                    {moment().diff(notice.regDt, 'day') < 7 ? (
                      <Typography
                        key={`date` + notice.noticeSid}
                        variant={'Kor_16_b'}
                        onClick={() => getDetail(notice.noticeSid)}
                        display={'flex'}
                        fontWeight={600}
                        marginTop={pxToRem(3)}
                      >
                        <IconButton
                          sx={{
                            alignItems: 'start',
                            marginY: 'auto',
                            p: 0,
                            ml: 0,
                            mr: pxToRem(4),
                          }}
                        >
                          <Icon
                            icon="mdi:alpha-n-circle"
                            style={{
                              width: pxToRem(25),
                              height: pxToRem(25),
                              color: theme.palette.primary.main,
                            }}
                          />
                        </IconButton>
                        {parse(notice.noticeNm)}
                      </Typography>
                    ) : (
                      <>{parse(notice.noticeNm)}</>
                    )}
                  </Stack>
                  <Typography
                    variant={'Kor_12_r'}
                    color={theme.palette.grey[400]}
                    marginTop={pxToRem(5)}
                  >
                    {moment(notice.regDt).format('YYYY/MM/DD')}
                  </Typography>
                </Stack>
              );
            })}
            {
              noticeStore.notices.length < 1 &&
              <Typography sx={{ p: 4, m: 'auto' }}>데이터가 없습니다</Typography>
            }
          </Box>
        </Stack>
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
            {noticeStore.notice != null && (
              <NoticeDialog
                handleClose={() => {
                  setOpen(false);
                }}
              />
            )}
          </Dialog>
        )}
      </Stack>
    </>
  );
});

export default Notice;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});
