import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Button, Dialog, Slide, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { EventDetail } from 'src/routes/elements';
import { CallApiToStore } from 'src/utils/common';
import Carousel from 'src/components/carousel';
import AllEvent from './AllEvent';
import MyEvent from './MyEvent';
import { IEvent } from 'src/models';
import { pxToRem } from 'src/theme/typography';
import { useLocation, useNavigate } from 'react-router';
import BackHeader from 'src/components/BackHeader';
import Fcfs from './fcfs/Fcfs';
import Scratch from './scratch/Scratch';
import { useAuthContext } from 'src/auth/useAuthContext';
import { PATH_AUTH, PATH_ROOT } from 'src/routes/paths';
import { toJS } from 'mobx';

/**
 * ## Event 설명
 *
 */
export const Event = observer(() => {
  const rootStore = useStores();
  const { eventStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  // const anchorRef = useRef<HTMLDivElement>(null);

  // 탭 이동
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    carouselRef.current?.slickGoTo(newValue);
    setValue(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `test-tab-${index}`,
      'aria-controls': `test-tabpanel-${index}`,
    };
  }
  const contentRef = useRef<any>(null);
  const carouselRef = useRef<Carousel | null>(null);

  const carouselSettings = {
    dots: false,
    arrows: false,
    autoplay: false,
    draggable: true,
    slidesToShow: 1,
    // initialSlide: 2,
    rtl: false,
    speed: 400,
    infinite: false,
    // easing: 'easeOut',
    centerMode: false,
    swipeToSlide: true,
    adaptiveHeight: false,
    beforeChange: (current: number, next: number) => {
      setValue(next);
    },
  };

  // 정렬기준, 필터링  => 전체 이벤트 리스트, 내가참여한 이벤트 리스트
  const [orderingNum, setOrderingNum] = useState(100601);
  const [filter, setFilter] = useState<boolean | undefined>(undefined);

  const getEventList = async () => {
    CallApiToStore(eventStore.gets(orderingNum), 'api', loadingStore).then(() => {
      eventStore.pagination_all.setProps({ size: 10 });
    });
  };
  const getMyEventList = async () => {
    CallApiToStore(eventStore.getsMy(filter), 'api', loadingStore);
  };

  // 이벤트 상세
  const [openDetail, setOpenDetail] = useState(false);
  // 선착순 상세
  const [openFcfs, setFcfs] = useState(false);
  // 스크래치 상세
  const [openScratch, setScratch] = useState(false);

  const handleClick = async (item: IEvent) => {
    await CallApiToStore(
      eventStore.get(item.eventSid ? item.eventSid : 0),
      'api',
      loadingStore,
    ).then(() => {   
  
      switch (item.eventTypeCd.code) {
        case 410003:
          navigate(PATH_ROOT.event.fcfs)
          break;
        case 410004:
          navigate(PATH_ROOT.event.scratch)
          break;
        default:
          return setOpenDetail(true);
          break;
      }
    });
  };

  const getDialogDetail = () => {

    const handleClose = () => {
      setOpenDetail(false);
      getMyEventList();
    }

    switch (eventStore.event.eventTypeCd.code) {
      case 410003:
        navigate('/event/fcfs', );
        break;
      case 410004:
        navigate('/event/scratch')
        break;
      default:
        return <EventDetail handleClose={handleClose} getData={getMyEventList} />
        break;
    }
  }

  useEffect(() => {
    getMyEventList();

    // handleClick({ eventSid: 20 } as IEvent);
  }, [filter]);

  return (
    <>
      <Stack
        justifyContent={'space-between'}
        sx={{
          maxWidth: theme.breakpoints.only('md'),
          textAlign: 'center',
          justifyContent: 'space-between',
        }}
      >
        <BackHeader
          title={'이벤트'}
          handleClose={() => {
            navigate(-1);
          }}
        />

        {/* 탭 */}
        <Stack
          sx={{
            backgroundColor: theme.palette.common.white,
            borderBottom: 1,
            borderColor: 'divider',
            justifyContent: 'center',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="event tabs"
            sx={{
              '& .MuiTab-root': {
                m: '0 !important',
              },
            }}
          >
            <Tab
              label="전체 이벤트"
              {...a11yProps(0)}
              sx={{
                fontVariant: 'Kor_16_b',
                width: '50%',
                '&:not(.Mui-selected)': {
                  color: theme.palette.grey[400],
                },
              }}
            />
            <Tab
              label="내가 참여한 이벤트"
              {...a11yProps(1)}
              sx={{
                fontVariant: 'Kor_16_b',
                width: '50%',
                '&:not(.Mui-selected)': {
                  color: theme.palette.grey[400],
                },
              }}
            />
          </Tabs>
        </Stack>

        {/* 탭 내용 */}
        <Box sx={{ flex: 1, pt: pxToRem(20), scrollMarginTop: '130px' }} ref={contentRef}>
          <Carousel ref={carouselRef} {...carouselSettings}>
            <Stack sx={{ flexGrow: 1 }}>
              {/* 전체 이벤트 */}
              <AllEvent
                handleClick={handleClick}
                getData={getEventList}
                setOrderingNum={setOrderingNum}
                slickIndex={value}
              />
            </Stack>

            <Stack sx={{ flexGrow: 1 }}>
              {!isAuthenticated ? (
                <>
                  <Typography
                    variant="Kor_16_r"
                    component={'h5'}
                    color={theme.palette.grey[500]}
                    mt={`${pxToRem(40)} !important`}
                  >
                    로그인 후 이용 가능합니다.
                  </Typography>

                  <Button
                    fullWidth
                    variant={'contained'}
                    size={'large'}
                    onClick={() => {
                      navigate(PATH_AUTH.login, { state: { referrer: document.referrer } });
                    }}
                    sx={{
                      mt: 3,
                      width: '30%',
                      borderRadius: 3,
                      mx: 'auto',
                    }}
                  >
                    로그인
                  </Button>
                </>
              ) : (
                // {/* 내가 참여한 이벤트 */}
                <MyEvent
                  handleClick={handleClick}
                  getData={getMyEventList}
                  setFilter={setFilter}
                  slickIndex={value}
                />
              )}
            </Stack>
          </Carousel>
        </Box>
      </Stack>

      {/* 이벤트 상세 모달 */}
      {openDetail && (
        <Dialog
          fullWidth
          keepMounted
          maxWidth={'md'}
          open={openDetail}
          TransitionComponent={Transition}
          // hideBackdrop
          PaperProps={{
            sx: {
              p: 0,
              m: '0 !important',
              maxHeight: '100%',
              minHeight: '100%',
              borderRadius: '0 !important',
              boxShadow: 'none',
              overflowY: 'initial',
            },
          }}
          onClose={(e: any, reason: string) => {
            if (reason === 'backdropClick') {
              e.preventDefault();
              e.stopPropagation();
            } else {
              setOpenDetail(false);
            }
          }}
          sx={{
            '& .MuiDialog-container': {
              overflowY: 'auto',
            },
            margin: '0 !important',
            zIndex: theme.zIndex.modal,
            padding: 0,
            borderRadius: 0,
          }}
        >
          {
            getDialogDetail()
          }
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

export default Event;
