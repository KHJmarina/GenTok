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
import { useLocation, useNavigate } from 'react-router';
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
import { Slide } from '@mui/material';
import OrderItems from '../order-items/OrderItems';
import Image from 'src/components/image/Image';
import OrderItemImage from '../OrderItemImage';
import { numberComma } from 'src/utils/common';
import { PATH_ROOT } from 'src/routes/paths';
import OrderHistoryTimeline from '../../../order-history-timeline/OrderHistoryTimeline';
import OrderItemContent from '../OrderItemContent';
import { toJS } from 'mobx';

/**
 * ## OrderNoItems 설명
 *
 */
const useStyles = makeStyles(() => ({
  accordion: {
    '&.MuiAccordion-root.Mui-expanded': {
      mt: 0,
      margin: 0,
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

export const OrderNoItems = observer(() => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuthContext();
  const [accdnOpen, setAccdnOpen] = useState(false);

  const n = 10;

  const handleChange = (event: React.SyntheticEvent) => {
    setOpen(!open);
  };
  // const transition = {
  //   repeatType: 'loop',
  //   ease: 'linear',
  //   duration: 'none',
  //   repeat: Infinity,
  // } as const;

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
            p: 0,
          }}
        >
          <Stack>
            <Stack
              direction={'row'}
              // width="100%"
              justifyContent="space-between"
              sx={{ mb: pxToRem(21), mx: pxToRem(20) }}
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
                // height: pxToRem(100),
                background: '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: pxToRem(16),
                px: pxToRem(20),
                mx: pxToRem(20),
                textAlign: 'left',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  // ml: pxToRem(20),
                }}
              >
                <IconOrderBell style={{ marginRight: pxToRem(8) }} />
                <Typography variant={'Kor_14_r'}>
                  주문 확인 중이에요. 조금만 기다려 주세요~
                </Typography>
              </Box>

              {orderHistoryStore.orderHistory?.dlivryYn && ( //키트 배송 했을 경우에만
                <Box>
                  <Box
                    id={'btn-order-detail-change-address'}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: pxToRem(500),
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EEEEEE',
                      mt: pxToRem(22),
                      mb: pxToRem(6),
                      width: pxToRem(119),
                      height: pxToRem(30),
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      navigate(PATH_ROOT.market.address, { state: { from: 'order-history' } });
                    }}
                  >
                    <Typography variant={'Kor_12_r'} sx={{ fontSize: pxToRem(12) }}>
                      배송지 변경
                    </Typography>
                  </Box>  
                </Box>
              )}
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

export default OrderNoItems;
