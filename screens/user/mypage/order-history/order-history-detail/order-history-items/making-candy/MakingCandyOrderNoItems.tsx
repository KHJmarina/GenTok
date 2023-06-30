import Box from '@mui/material/Box';
import {
  Stack,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useStores } from '../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import { pxToRem } from 'src/theme/typography';
import { makeStyles } from '@material-ui/core/styles';
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
import OrderHistoryTimeline from '../../../order-history-timeline/OrderHistoryTimeline';
import OrderItemImage from '../OrderItemImage';
import OrderItemContent from '../OrderItemContent';
import OrderItems from '../order-items/OrderItems';

/**
 * ## MakingCandy 설명
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

export const MakingCandyOrderNoItems = observer(() => {
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
  
  
  const handleChange = (event: React.SyntheticEvent) => {
    setOpen(!open);
  };

  const handleClickTest = () => {
    setTestOpen(!testOpen);
  };
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
        <AccordionDetails sx={{ 
          // m: pxToRem(20), 
          p: 0 }}>
          <Stack>
            <Stack
              direction={'row'}
              // width="100%"
              justifyContent="space-between"
              sx={{ mb: pxToRem(21),
                mx: pxToRem(20),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: (orderHistoryStore.orderHistory?.goodsList?.length! > 1 ? '' : 'center') }} borderRadius={2}>
                <OrderItemImage 
                  imgSrc={
                    orderHistoryStore.orderHistory?.goodsList[0]?.goodsSid == 74 // kit box가 첫번째 상품인 경우 다른 상품부터 노출 
                    ? `${orderHistoryStore.orderHistory?.goodsList[1]?.img1Path}`
                    : `${orderHistoryStore.orderHistory?.goodsList[0]?.img1Path}`} 
                  listSize={Number(`${orderHistoryStore.orderHistory?.goodsList.length}`)}
                />
                
                <OrderItemContent data={orderHistoryStore.orderHistory} />
              </Box>
            </Stack>

            <Box
              sx={{
                borderRadius: pxToRem(10),
                // width: '100%',
                height: pxToRem(76),
                background: '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mx: pxToRem(20),
                textAlign: 'left',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  ml: pxToRem(20),
                }}
              >
                <IconOrderBell style={{ marginRight: pxToRem(8) }} />
                <Typography
                  variant={'Kor_14_r'}
                  sx={{
                    textAlign: 'left',
                    mt: pxToRem(16),
                    pr: pxToRem(20),
                    lineHeight: pxToRem(22),
                  }}
                >
                  {`${user?.nickNm ? user?.nickNm : (user?.userNm || '')} 님의 유전자 분석 중이에요.`}<br />
                  조금만 기다려 주세요.
                </Typography>
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

export default MakingCandyOrderNoItems;
