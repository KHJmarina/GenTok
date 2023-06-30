import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { CallApiToStore } from 'src/utils/common';
import { useStores } from 'src/models/root-store/root-store-context';
import { useTheme, Tab, Tabs, Stack, Dialog, Slide } from '@mui/material';
import { InquiryDetail } from './InquiryDetail';
import { TransitionProps } from '@mui/material/transitions';
import _ from 'lodash';
import { toJS } from 'mobx';
import TabPanel from '@mui/lab/TabPanel';
import { TabContext } from '@mui/lab';
import InquiryView from 'src/screens/customer/inquiry/inquiry-view/InquiryView';
import InquiryList from 'src/screens/customer/inquiry/inquiry-list/InquiryList';
import { reset } from 'numeral';
import { pxToRem } from 'src/theme/typography';
import { useAuthContext } from 'src/auth/useAuthContext';
import CHeader from 'src/components/CHeader';
import { PATH_ROOT } from 'src/routes/paths';
/**
 * ## Inquiry 설명
 *
 */

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const Inquiry = observer(() => {
  const rootStore = useStores();
  const { inquiryStore, loadingStore } = rootStore;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<any>(null);
  const [open, setOpen] = useState(false);

  const { state } = useLocation();

  // url params 추가
  const searchParams = new URLSearchParams(document.location.search);
  const tabName = searchParams.get('tab') || 'inquiry';

  //tab
  const [tabValue, setTabValue] = useState(tabName);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      reset();
      setTabValue(newValue);
      if (typeof window !== 'undefined') {
        if (newValue !== tabValue) {
          window.history.pushState(null, '', `?tab=${newValue}`);
        }
      }
  };
  

  // 문의한 목록 리스트
  const getDatas = async () => {
    CallApiToStore(inquiryStore.gets(), 'api', loadingStore).then(()=>{
      if(state){
        setTabValue('inquiry')
      } else {
        if(inquiryStore.inquirys.length > 0 ){
          setTabValue('inquiryList');  
        } else{
          setTabValue('inquiry');
        }
      }
    })
  };

  // 수정할 문의 목록 불러오기
  const getData = async (inquirySid: number) => {
    scrollRef.current?.scrollIntoView();
    CallApiToStore(inquiryStore.get(inquirySid), 'api', loadingStore)
      .then(() => {
        setTabValue('inquiry');  
        scrollRef.current?.scrollIntoView();
      })
      .catch((e) => {
        console.log(e);
      });
    setLoading(false);
  };

  useEffect(() => {
    getDatas()
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        const params = new URLSearchParams(window.location.search);
        const newTab = params.get('tab');      
        if (newTab) {
          setTabValue(newTab);
        }
      });
    }
  }, []);

  // 주문 내역 call
  // useEffect(()=>{
  //   CallApiToStore(inquiryStore.getsOrder(), 'api', loadingStore)
  // },[inquiryStore.inquirysOrder])

  const options: any = { showMainIcon: 'back', showHomeIcon: true};
  
  return (
    <>
      <Stack
        sx={{
          overflowY: 'auto',
          scrollMarginTop: '100px',
        }}
        ref={scrollRef}
      >
        <CHeader title="문의하기" {...options} />

        <TabContext value={tabValue}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            onClick={() => {
              reset();
            }}
            aria-label="find id tabs"
            variant="fullWidth"
            sx={{ minHeight: pxToRem(44), height: pxToRem(44), borderBottom: `.3px solid #EEEEEE`, '& .MuiTab-root': { m: '0 !important'} }} >
            <Tab
              label="문의하기" value="inquiry"
              onClick={() => {reset()}}
              {...a11yProps(0)}
              sx={{ fontWeight: 600, lineHeight: 24 / 16, fontSize: pxToRem(16), letterSpacing: '-0.03em', '&:not(.Mui-selected)': { fontWeight: 400, color: '#BDBDBD', }, }}/>
            <Tab
              label="나의 문의 내역" value="inquiryList"
              onClick={() => {if (isAuthenticated) {reset();} else {navigate('/login');}}}
              {...a11yProps(1)}
              sx={{ fontWeight: 600, lineHeight: 24 / 16, fontSize: pxToRem(16), letterSpacing: '-0.03em', '&:not(.Mui-selected)': { fontWeight: 400, color: '#BDBDBD', },}} />
          </Tabs>

          <Stack sx={{maxWidth:'100%'}}>
              <TabPanel value="inquiry" sx={{ p: 0}}>
              <InquiryView
                onSave={() => {
                  reset();
                  setOpen(true);
                }}
                data={inquiryStore.inquiry}
              />
            </TabPanel>
       
              <TabPanel value="inquiryList" sx={{ p: 0 }}>
                <InquiryList getData={getData} />
              </TabPanel>
          </Stack>
        </TabContext>

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
                overflow: 'hidden',
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
              setOpen(false);
            }}
            sx={{
              margin: '0 !important',
              zIndex: 100,
              padding: 0,
              borderRadius: 0,
            }}
          >
            {true && (
              <InquiryDetail
                handleClose={() => {
                  setOpen(false);
                  setTabValue('inquiryList');
                  scrollRef.current?.scrollIntoView();
                  if (typeof window !== 'undefined') {
                    if ('inquiryList' !== tabValue) {
                      window.history.pushState(null, '', `?tab=${tabValue}`);
                    }
                  }
                }}
              />
            )}
          </Dialog>
        )}
      </Stack>
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
export default Inquiry;
