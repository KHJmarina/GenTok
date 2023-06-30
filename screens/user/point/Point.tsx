import Box from '@mui/material/Box';
import {
  useTheme,
  Stack,
  Typography,
  Tab,
  Tabs,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { CHeader } from 'src/components/CHeader';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { HEADER, SPACING } from 'src/config-global';
import { useNavigate } from 'react-router-dom';
import { useStores } from 'src/models/root-store/root-store-context';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactComponent as IconPoint } from 'src/assets/icons/ico-point.svg';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import SavedPointHistory from './point-list/SavedPointHistory';
import UsedPointHistory from './point-list/UsedPointHistory';
import { pxToRem } from 'src/theme/typography';
import { makeStyles } from '@material-ui/core/styles';
import { CallApiToStore, numberComma } from 'src/utils/common';
import { IPoint } from 'src/models';
import { toJS } from 'mobx';
import { PATH_ROOT } from 'src/routes/paths';
/**
 * ## Point 설명
 *
 */
export const Point = observer(() => {
  const rootStore = useStores();
  const { pointStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();
  const [render, setRender] = useState(false);
  
  const searchParams = new URLSearchParams(document.location.search);
  const tabName = searchParams.get('tab') || 'savedPoints';
  
  const [value, setValue] = useState(tabName);
  // const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  //   setValue(newValue);
  // };
  
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    // console.log(newValue)
    if (typeof window !== 'undefined') {
      if (newValue !== value) {
        window.history.pushState(null, '', `?tab=${newValue}`);
      }
    }
  };
  
  const getPoint = async () => {
    CallApiToStore(pointStore.getPoint(), 'api', loadingStore).then(() => {
      CallApiToStore(pointStore.getSavePointHistory(), 'api', loadingStore).then(() => {});
      CallApiToStore(pointStore.getUsePointHistory(), 'api', loadingStore).then(() => {
        // console.log(toJS(pointStore.usedPoints))
      });
      setRender(true);
    });
  };

  useEffect(() => {
    pointStore.pagination.setProps({ size: 100 });
    getPoint();
  }, []);
  
  useEffect(() => {
    window.history.pushState(null, '', `?tab=${'savedPoints'}`);

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        const params = new URLSearchParams(window.location.search);
        const newTab = params.get('tab');
        if (newTab) {
          setValue(newTab);
        }
        if (newTab == null){
          navigate(PATH_ROOT.user.mypage.main);
        }
      });
    }
  }, []);
  
  
  
  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: () => {
      navigate(PATH_ROOT.user.mypage.main);
    },
    showHomeIcon: true,
  };

  return (
    <>
      {render && (
        <Stack sx={{ height: '100%', pb: `${HEADER.H_MOBILE}px` }}>
          <CHeader title={'포인트 내역'} {...options} />

          <Box sx={{ backgroundColor: theme.palette.primary.main, p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconPoint fill={'white'}></IconPoint>
                <Typography variant={'h5'} color="white">
                  &nbsp;나의 포인트
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography color="white" sx={{ fontSize: '1.4rem', fontWeight: 900 }}>
                  {pointStore.point.pointBlncVal ? numberComma(pointStore.point?.pointBlncVal!) : 0}
                </Typography>
                <Typography color="white">&nbsp;P</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography color="white">당월 소멸예정 포인트</Typography>
              <Typography color="white" sx={{ display: 'flex' }}>
                {pointStore.point.expiringPointVal
                  ? numberComma(pointStore.point?.expiringPointVal!)
                  : 0}
                <span>&nbsp;P</span>
              </Typography>
            </Box>
          </Box>

          <TabContext value={value}>
            <Box sx={{ flex: 1 }}>
              <Stack>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="standard"
                  aria-label="point tabs"
                  TabIndicatorProps={{ style: { background: 'none' } }}
                  sx={{ m: 2.5, mb: 0 }}
                >
                  <Tab
                    label={'적립 내역'}
                    sx={{
                      width: '50%',
                      '&:not(.Mui-selected)': {
                        color: theme.palette.grey[400],
                        border: '1px solid #BDBDBD',
                        borderRight: '0px',
                      },
                      '&.Mui-selected': {
                        color: theme.palette.primary.main,
                        border: '1px solid #FF7F3F',
                      },
                      '&:not(:last-of-type)': {
                        mr: 0,
                      },
                    }}
                    value={'savedPoints'}
                  />
                  <Tab
                    label={'사용 내역'}
                    sx={{
                      width: '50%',
                      '&:not(.Mui-selected)': {
                        color: theme.palette.grey[400],
                        border: '1px solid #BDBDBD',
                        borderLeft: '0px',
                      },
                      '&.Mui-selected': {
                        color: theme.palette.primary.main,
                        border: '1px solid #FF7F3F',
                      },
                    }}
                    value={'usedPoints'}
                  />
                </Tabs>
              </Stack>

              <TabPanel value={'savedPoints'} sx={{ m: 0, textAlign: 'left', pt: 2, pb: 2 }}>
                <Stack>
                  {pointStore.savedPoints.length == 0 ? (
                    <Box
                      sx={{ m: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <IconPoint fill={theme.palette.grey[400]}></IconPoint>
                      <Typography color={theme.palette.grey[400]} sx={{ mt: 1.5 }}>
                        적립된 포인트가 없습니다.
                      </Typography>
                    </Box>
                  ) : (
                    <SavedPointHistory />
                  )}
                </Stack>
              </TabPanel>
              <TabPanel value={'usedPoints'} sx={{ m: 0, textAlign: 'left', pt: 2, pb: 2 }}>
                {pointStore.usedPoints.length == 0 ? (
                  <Box
                    sx={{ m: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <IconPoint fill={theme.palette.grey[400]}></IconPoint>
                    <Typography color={theme.palette.grey[400]} sx={{ mt: 1.5 }}>
                      포인트 사용내역이 없습니다.
                    </Typography>
                  </Box>
                ) : (
                  <UsedPointHistory />
                )}
              </TabPanel>
              <Divider sx={{ borderWidth: 6 }}></Divider>

              <Stack mt={'0 !important'}>
                <Accordion
                  sx={{ borderRadius: '0 !important', background: '#FFFFFF' }}
                  className={classes.pointInfo}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#9DA0A5' }} />}
                    // sx={{ mx: 0, pl: 3, pr: 3, width: '100%', backgroundColor: 'white' }}
                    // aria-controls="panel1a-content"
                    // id="panel1a-header"
                    sx={{
                      borderBottom: '1px solid #EEEEEE',
                      py: pxToRem(4),
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <Typography>포인트 이용안내</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ background: '#FAFAFA' }}>
                    {/* <List sx={{ listStyleType: 'disc', pl: 3 }}>
                  <ListItem sx={{ display: 'list-item', p: 0, fontSize: '0.85rem' }}>
                    리뷰, 이벤트 참여를 통해 포인트를 적립 받을 수 있습니다.
                  </ListItem>
                  <ListItem sx={{ display: 'list-item', p: 0, fontSize: '0.85rem' }}>
                    적립 기준은 참여 이벤트마다 상이합니다.
                  </ListItem>
                  <ListItem sx={{ display: 'list-item', p: 0, fontSize: '0.85rem' }}>
                    포인트는 유효기간 임박 순으로 사용됩니다.
                  </ListItem>
                  <ListItem sx={{ display: 'list-item', p: 0, fontSize: '0.85rem' }}>
                    이벤트 적립 포인트는 명시한 유효기간을 따르며 별도 명시가 없으면 지급일로부터
                    1년간 유효합니다.
                  </ListItem>
                </List> */}

                    <Box p={pxToRem(20)}>
                      <Typography variant="caption" display={'list-item'} textAlign={'left'}>
                        포인트는 추후 업그레이드 예정입니다.
                      </Typography>
                      {/*
                      <Typography variant="caption" display={'list-item'} textAlign={'left'}>
                        리뷰, 이벤트 참여를 통해 포인트를 적립 받을 수 있습니다.
                      </Typography>
                      <Typography variant="caption" display={'list-item'} textAlign={'left'}>
                        적립 기준은 참여 이벤트마다 상이합니다.
                      </Typography>
                      <Typography variant="caption" display={'list-item'} textAlign={'left'}>
                        포인트는 유효기간 임박 순으로 사용됩니다.
                      </Typography>
                      <Typography variant="caption" display={'list-item'} textAlign={'left'}>
                        이벤트 적립 포인트는 명시한 유효기간을 따르며 별도 명시가 없으면
                        지급일로부터 1년간 유효합니다.
                      </Typography>
                      */}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Box>
          </TabContext>
        </Stack>
      )}
    </>
  );
});

export default Point;

const useStyles = makeStyles(() => ({
  pointInfo: {
    '& .MuiAccordionSummary-content': {
      my: `${pxToRem(12)} !important`,
    },
    '& .MuiButtonBase-root': {
      height: `${pxToRem(56)} !important`,
      minHeight: `${pxToRem(56)} !important`,
    },
    '&.MuiAccordion-root.Mui-expanded': {
      mt: 0,
      backgroundColor: '#FAFAFA',
      boxShadow: 'none',
    },
    '&.MuiAccordion-root.Mui-expanded:before': {
      opacity: 1,
    },
  },
}));
