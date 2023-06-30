import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import { debounce, Tab, Typography, useTheme, TabProps, TabsProps, Tabs } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import { Icon } from '@iconify/react';
import { styled, textAlign } from '@mui/system';
import { CallApiToStore } from 'src/utils/common';
import { PATH_ROOT } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import { toJS } from 'mobx';
import Carousel from 'src/components/carousel';
import moment from 'moment';
import { ReactComponent as MegaPhone } from 'src/assets/icons/megaphone.svg';
import React from 'react';


/**
 * ## CustomerNotice 설명
 *
 */
const BoxTabs = styled((props: StyledTabsProps) => <Tabs {...props} />)(({ theme }) => ({
  display:'flex', flexDirection:'row', 
   p:pxToRem(10), pb:pxToRem(30), justifyContent:'center',
  '& .MuiTabs-indicator': {display:'none'},
  '& .MuiTabs-flexContainer': {
    display: 'block',
    justifyContent:`center !important`,
  },
})); 

const BoxTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    bgcolor:'#eeeeee', borderRadius:'50%', mx:pxToRem(2),
    width:`8px !important`,
    height:`8px !important`,
    minHeight: pxToRem(8),
    minWidth: pxToRem(8),
    '&.Mui-selected': {backgroundColor: `${theme.palette.primary.main} !important`},
  }),
);
interface StyledTabsProps extends TabsProps {}
interface StyledTabProps extends TabProps {}

export const CustomerNotice = observer(() => {
  const rootStore = useStores();
  const { loadingStore, noticeStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);


  const getData = async () => {
    CallApiToStore(noticeStore.gets(), 'api', loadingStore)
  };

  const getDetail = async (noticeSid: number) => {
    CallApiToStore(noticeStore.get(noticeSid), 'api', loadingStore)
      .then((e) => {
        navigate(PATH_ROOT.customer.notice, {state: noticeSid})
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const newNotice = noticeStore?.notices.slice(0, 3);

  useEffect(() => {
    getData();
  }, []);

  const contentRef = useRef<any>(null);
  const carouselRef = useRef<Carousel | null>(null);
  const carouselSettings = {
    dots: false,
    arrows: false,
    autoplay: false,
    draggable: true,
    slidesToShow: 1,
    initialSlide: 0,
    rtl: false,
    speed: 400,
    infinite: false,
    // easing: 'easeOut',
    centerMode: false,
    swipeToSlide: true,
    adaptiveHeight: true,
    beforeChange: (current: number, next: number) => {
      contentIndex.current = next;
      setTabValue((v) => {
        return (v = next);
      });
    },

  };

  const searchParams = new URLSearchParams(document.location.search);
  const tabName = searchParams.get('tab');
  let firstIndex = tabName === 'middle' ? 1 : tabName === 'last' ? 2 : 0;
  const [currentTab, setTab] = useState(tabName); 
  const switchTab = (_: any, newTab: string) => {
    setTab(newTab);
  };
  const [tabValue, setTabValue] = useState<number>(firstIndex);
  const contentIndex = useRef(firstIndex);
  const noticeBox = {
    bgcolor:'#eeeeee', width:'8px',height:'8px', borderRadius:'50%', mx:pxToRem(2),
    m:`3px !important`
  };

  const handleChange = debounce((event: React.SyntheticEvent, next: number) => {
    switchTab(null, next === 1 ? 'mbti' : next === 2 ? 'game' : 'main');
    carouselRef.current?.slickGoTo(next);
    contentIndex.current = next;
  }, 200);;


  return (
    <>
    {/* 공지사항 제목 */}
     <Box sx={{display:'flex', flexDirection:'row', px:pxToRem(20), pt:pxToRem(20), alignItems:'center', justifyContent:'space-between',}}>
       <Typography sx={{ mr: 1, textAlign: 'left',}} variant={'Kor_18_b'}>공지사항</Typography>
       <Box component={Icon} icon={'ep:arrow-right-bold'} sx={{cursor:'pointer',color: '#DFE0E2' }} onClick={() => {navigate(`${PATH_ROOT.customer.notice}`)}}></Box>
     </Box>

      {/* 공지사항 내용 */}

      <Box ref={contentRef} sx={{ mt: pxToRem(20) }}>
        <Carousel ref={carouselRef} {...carouselSettings}>
          {
            newNotice.length < 1 ?
              <>
                <Box sx={{ bgcolor: '#FAFAFA', borderRadius: pxToRem(10), mx: pxToRem(20), px: pxToRem(20), pt: pxToRem(20), pb: pxToRem(20), mb: pxToRem(20), textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <MegaPhone />
                    <Box><Typography variant='Kor_16_r' sx={{ ml: 1, color: theme.palette.action.disabled }}>데이터가 없습니다</Typography></Box>
                  </Box>
                </Box>
              </>
              :
              newNotice.map((item: any, i: number) => {
                return (
                  <Box key={`notice-${i}`} onClick={() => { getDetail(item.noticeSid) }} sx={{ bgcolor: '#FAFAFA', borderRadius: pxToRem(10), mx: pxToRem(20), px: pxToRem(20), pt: pxToRem(20), pb: pxToRem(20), textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <MegaPhone />
                      <Box><Typography variant='Kor_16_r' sx={{ ml: 1 }}>{item.noticeNm}</Typography></Box>
                    </Box>
                    <Box><Typography variant='Kor_12_r' sx={{ color: theme.palette.action.disabled }}> {moment(item.regDt).format('YYYY/MM/DD')}</Typography></Box>
                  </Box>
                )
              })
          }
        </Carousel>

    <BoxTabs 
      value={tabValue}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons={false}
      allowScrollButtonsMobile
      aria-label="customer-notice"
      sx={{display:'flex', flexDirection:'row', p:pxToRem(10), pb:pxToRem(30), justifyContent:'center'}} >
      <BoxTab key={'cutomer-notice-1'} sx={{...noticeBox}}></BoxTab>
      <BoxTab key={'cutomer-notice-2'} sx={{...noticeBox}}></BoxTab>
      <BoxTab key={'cutomer-notice-3'} sx={{...noticeBox}}></BoxTab>
    </BoxTabs>

    </Box>  
    </>
  );
});

export default CustomerNotice;
