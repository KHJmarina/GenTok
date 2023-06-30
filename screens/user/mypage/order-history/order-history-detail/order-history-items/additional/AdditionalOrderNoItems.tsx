import Box from '@mui/material/Box';
import {
  Stack,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
  Grid,
  ListItem,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useStores } from '../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import { pxToRem } from 'src/theme/typography';
import { useAuthContext } from 'src/auth/useAuthContext';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import { ReactComponent as IconDeliveryStatus } from 'src/assets/icons/ico-delivery-status.svg';
import { ReactComponent as IconOrderBell } from 'src/assets/icons/ico-order-bell.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Slide } from '@mui/material';
import OrderItems from '../order-items/OrderItems';
import { makeStyles } from '@material-ui/core/styles';
import OrderHistoryTimeline from '../../../order-history-timeline/OrderHistoryTimeline';
import { numberComma } from 'src/utils/common';
/**
 * ## Additional 설명
 *
 */

const useStyles = makeStyles(() => ({
  accordion: {
    '&.MuiAccordion-root.Mui-expanded': {
      mt: 0,
      margin:0,
      boxShadow: 'none',
    },
    overflowX: 'scroll',
    background: '#FFFFFF',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    justifyContent: 'center',
    '&.MuiAccordion-root.Mui-expanded:before': {
      opacity: 1,
    },
  },
  deliveryInfo: {
    '& .MuiAccordionSummary-content': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
}));

export const AdditionalOrderNoItems = observer(() => {
  const rootStore = useStores();
  const { orderHistoryStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(true);
  const [testOpen, setTestOpen] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuthContext();
  const [accdnOpen, setAccdnOpen] = useState(false);
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  const makeDateFormat = (date: number) => {
    let tempDate = new Date(date);
    let year = tempDate.getFullYear();
    let month = ('0' + (1 + tempDate.getMonth())).slice(-2);
    let day = ('0' + tempDate.getDate()).slice(-2);

    return `${year}.${month}.${day}`;
  };

  const handleChange = (event: React.SyntheticEvent) => {
    setOpen(!open);
  };

  const handleClickTest = () => {
    setTestOpen(!testOpen);
  };
  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 'none',
    repeat: Infinity,
  } as const;

  return (
    <>
      <Accordion expanded={open} className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.action.disabled }} />}
          sx={{ mx: pxToRem(20), px: 0 }}
          className={classes.deliveryInfo}
          onClick={handleChange}
        >
          <Typography>No. {orderHistoryStore.orderHistory?.orderNo}</Typography>
        </AccordionSummary>
        <AccordionDetails 
          sx={{ 
            // m: pxToRem(20), 
            p: 0 }}>
          <Stack>
            <Stack
              direction={'row'}
              // width="100%"
              justifyContent="space-between"
              sx={{ 
                mb: pxToRem(21), 
                mx: pxToRem(20),
              }}
            >
              <Box sx={{ display: 'flex' }} borderRadius={2}>
                <Box
                  component={'img'}
                  src={
                    orderHistoryStore.orderHistory?.goodsList[0].img1Path
                    ? REACT_APP_IMAGE_STORAGE + (orderHistoryStore.orderHistory?.goodsList[0]?.img1Path)
                    : '/assets/default-goods.svg'
                  }
                  sx={{
                    width: pxToRem(80),
                    border: '1px solid #F5F5F5',
                    borderRadius: pxToRem(10),
                  }}
                  onError={(e: any) => {
                    e.target.src = '/assets/default-goods.svg';
                  }}
                ></Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                  sx={{ display : 'flex'}}
                >
                <Typography
                  variant={'Kor_18_b'}
                  display={'inline'}
                  sx={{
                    color: '#202123',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: '45%',
                  }}
                  >
                  {orderHistoryStore.orderHistory?.goodsList[0].goodsNm} &nbsp;
                </Typography>
                  <Typography variant={'Kor_18_b'} >포함</Typography>
                  <Typography variant={'Kor_18_b'} sx={{ color: theme.palette.primary.main }}>&nbsp;[총 {orderHistoryStore.orderHistory?.goodsList.length}개]</Typography>
                  </Box>
                  <Typography variant={'Kor_14_r'}> 유전자 분석 중</Typography>
                </Box>
                
              </Box>
            </Stack>

            <Box
              sx={{
                borderRadius: pxToRem(10),
                // width: '100%',
                height: pxToRem(100),
                background: '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: pxToRem(20),
                py: pxToRem(16),
                mx: pxToRem(20),
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  
                }}
              >
                <IconOrderBell style={{ marginRight: pxToRem(8) }} />
                <Typography variant={'Kor_14_r'} sx={{ mt: pxToRem(16), pr: pxToRem(20) }}>
                  {user?.userNm ? user?.userNm : ''}님의 유전자 분석이 완료되었어요.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex' }}>
                <Box
                  id={'btn-order-detail-writeReview'}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: pxToRem(500),
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EEEEEE',
                    my: pxToRem(22),
                    width: pxToRem(145.5),
                    height: pxToRem(30),
                    mr: pxToRem(4),
                    cursor:'pointer'
                  }}
                >
                  <Typography variant={'Kor_12_r'} sx={{ fontSize: pxToRem(12) }}>
                    리뷰작성
                    <span
                      style={{
                        fontWeight: '600',
                        fontSize: pxToRem(12),
                        color: theme.palette.primary.main,
                      }}
                    >
                      {orderHistoryStore.orderHistory?.goodsList.length}
                    </span>
                  </Typography>
                </Box>
                <Box
                  id={'btn-order-detail-checkCandy'}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: pxToRem(500),
                    backgroundColor: theme.palette.primary.main,
                    my: pxToRem(22),
                    width: pxToRem(145.5),
                    height: pxToRem(30),
                    cursor:'pointer',
                    '&:hover':{
                      background:'#FF5D0C !important'
                    } 
                  }}
                >
                  <Typography variant={'Kor_12_r'} sx={{ color: 'white' }}>
                  결과카드 확인
                    <span style={{ fontWeight: '600', fontSize: pxToRem(12), color: 'white' }}>
                      {orderHistoryStore.orderHistory?.userTestResultList?.length}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </Box>

            <OrderHistoryTimeline data={orderHistoryStore.orderHistory} />
            <OrderItems />
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ borderWidth: pxToRem(4) }}></Divider>
    </>
  );
});

export default AdditionalOrderNoItems;
