import { useNavigate } from 'react-router-dom';
import { Stack, Box, Typography, useTheme, Grid } from '@mui/material';
import { ReactComponent as FaqIcon } from 'src/assets/images/faq.svg';
import { ReactComponent as InquiryIcon } from 'src/assets/images/inquiry.svg';
import { ReactComponent as NoticeIcon } from 'src/assets/images/notice.svg';
import { ReactComponent as AalarmListIcon } from 'src/assets/images/alarmlist.svg';
import { ReactComponent as GuideIcon } from 'src/assets/images/guideMenu.svg';
import { ReactComponent as KitGuideIcon } from 'src/assets/images/kitguideMenu.svg';
import { ReactComponent as HelpIcon } from 'src/assets/icons/customerHelpIcon.svg';
import { useStores } from 'src/models/root-store/root-store-context';
import { observer } from 'mobx-react-lite';
import { PATH_ROOT } from 'src/routes/paths';
import { pxToRem } from 'src/theme/typography';
import Image from 'src/components/image/Image';


/**
 * ## CustomerHelp 설명
 *
 */
export const CustomerHelp = observer(() => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  const removeNavOpen = () => {
    localStorage.removeItem('navOpen');
  };

  return (
    <>
      {/* 무엇을 도와드릴까요 */}
      <Stack sx={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', p:pxToRem(5), pt:pxToRem(33)}}>
         <Typography variant='Kor_18_b' sx={{textAlign:'center', mr:1}}>무엇을 도와드릴까요?</Typography>
         <HelpIcon/>
       </Stack>
       <Grid container spacing={3} sx={{ p: 3, '& .MuiGrid-item': { textAlign: 'center' } }}>
         <Grid item xs={4} sm={4}>
           <Box
             onClick={() => {
               removeNavOpen();
               navigate(PATH_ROOT.customer.faq);
             }}
             sx={{ cursor: 'pointer' }}
           >
             <FaqIcon />
             <Typography sx={{ fontSize: '.85em', pt: 0.5 }}>FAQ</Typography>
           </Box>
         </Grid>
         <Grid item xs={4} sm={4}>
           <Box
             onClick={() => {
               navigate(PATH_ROOT.customer.inquiry);
             }}
             sx={{ cursor: 'pointer' }}
           >
             <InquiryIcon />
             <Typography sx={{ fontSize: '.85em', pt: 0.5 }}>1:1문의</Typography>
           </Box>
         </Grid>
         <Grid item xs={4} sm={4}>
           <Box
             onClick={() => {
               removeNavOpen();
               navigate(PATH_ROOT.customer.notice);
             }}
             sx={{ cursor: 'pointer' }}
           >
             <NoticeIcon />
             <Typography sx={{ fontSize: '.85em', pt: 0.5 }}>공지사항</Typography>
           </Box>
         </Grid>
         <Grid item xs={4} sm={4}>
           <Box
             onClick={() => {
               removeNavOpen();
               navigate(PATH_ROOT.customer.alarm);
             }}
             sx={{ cursor: 'pointer' }}
           >
             <AalarmListIcon />
             <Typography sx={{ fontSize: '.85em', pt: 0.5 }}>알림리스트</Typography>
           </Box>
         </Grid>
         <Grid item xs={4} sm={4}>
           <Box
             onClick={() => {
               navigate(PATH_ROOT.customer.guide);
             }}
             sx={{ cursor: 'pointer' }}
           >
             <GuideIcon />
             <Typography sx={{ fontSize: '.85em', pt: 0.5 }}>이용가이드</Typography>
           </Box>
         </Grid>
         <Grid item xs={4} sm={4}>
           <Box
             onClick={() => {
               navigate(PATH_ROOT.customer.kitGuide);
             }}
             sx={{ cursor: 'pointer' }}
           >
             <KitGuideIcon />
             <Typography sx={{ fontSize: '.85em', pt: 0.5 }}>키트 사용법</Typography>
           </Box>
         </Grid>
       </Grid>
    </>
  );
});

export default CustomerHelp;