import Box from '@mui/material/Box';
import {
  Stack,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Button,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useStores } from '../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
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
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { PATH_ROOT } from '../../../../../../../routes/paths';
import ExchangeAlert from '../../../../exchange-alert/ExchangeAlert';
import { IAddress } from 'src/models/address/Address';
import OrderHistoryTimeline from '../../../order-history-timeline/OrderHistoryTimeline';
import OrderItemImage from '../OrderItemImage';
import OrderItemContent from '../OrderItemContent';
import OrderItems from '../order-items/OrderItems';

/**
 * ## ExchangeOrderNoItems 설명
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

/**
 * ## ExchangeOrderNoItems 설명
 *
 */
export const ExchangeOrderNoItems = observer(() => {
  const rootStore = useStores();
  const { orderHistoryStore, loadingStore, addressStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(true);
  const [testOpen, setTestOpen] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuthContext();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const [openExchange, setOpenExchange] = useState(false);
  const { orderNo } = useParams();
  const [clickStatus, setClickStatus] = useState<string>('');


  const handleChange = (event: React.SyntheticEvent) => {
    setOpen(!open);
  };

  const handleClickTest = () => {
    setTestOpen(!testOpen);
  };

  const exchangeEvent = () => {
    setOpenExchange(false);
    navigate(PATH_ROOT.customer.inquiry, {replace:true,  state : {"orderNo" : orderNo , "clickStatus" : clickStatus} });
  };

  const exchangeAlertButtonSet = () => {
    return (
      <>
        <Button
          id={'btn-order-detail-dialog-exchange/cancle-cancel'}
          variant="outlined"
          size="large"
          onClick={() => {
            setOpenExchange(false);
          }}
          sx={{
            mr: 1.5,
            borderRadius: 5,
            minWidth: '40%',
            border: `1px solid ${theme.palette.primary.dark}`,
            color: theme.palette.primary.dark,
          }}
        >
          닫기
        </Button>
        <Button
          id={'btn-order-detail-dialog-exchange/cancle-inquiry'}
          variant="contained"
          size="large"
          onClick={exchangeEvent}
          sx={{ color: '#fff', borderRadius: 5, minWidth: '40%' }}
        >
          문의하기
        </Button>
      </>
    )
  }

  const openExchangeAlert = () => {
    setOpenExchange(true);
    window.history.pushState(null,'',window.location.href);
  };
  
  useEffect(() => {
    window.addEventListener('popstate', () => {
      setOpenExchange(false)
    })
    
  },[])
  
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
                      : `${orderHistoryStore.orderHistory?.goodsList[0]?.img1Path}`
                  }
                  listSize={Number(`${orderHistoryStore.orderHistory?.goodsList.length}`)}
                />

                <OrderItemContent data={orderHistoryStore.orderHistory} />
              </Box>
            </Stack>

            <Box
              sx={{
                borderRadius: pxToRem(10),
                // width: '100%',
                // height: pxToRem(220),
                background: '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: pxToRem(20),
                mx: pxToRem(20),
                textAlign: 'left',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  my: pxToRem(16),
                  alignSelf: 'flex-start',
                  // mx: pxToRem(20),
                }}
              >
                <IconOrderBell style={{ marginRight: pxToRem(8) }} />
                <Typography variant={'Kor_14_r'}>
                  키트가 배송 완료되었어요
                </Typography>
              </Box>

              <Box
                sx={{
                  width: '100%',
                  // height: pxToRem(104),
                  borderRadius: pxToRem(10),
                  backgroundColor: 'white',
                  // p: pxToRem(12),
                  textAlign: 'left',
                  mb: pxToRem(8),
                }}
              >
                <Typography
                  variant={'Kor_14_b'}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.primary.main,
                    px: pxToRem(16),
                    pt: pxToRem(12),
                    pb: pxToRem(4),
                  }}
                >
                  <ErrorOutlineIcon
                    sx={{ width: pxToRem(13.33), height: pxToRem(13.33), mr: pxToRem(4) }}
                  />
                  반송시 유의사항
                </Typography>

                <Typography
                  sx={{
                    color: '#5D6066',
                    fontSize: pxToRem(12),
                    fontWeight: 400,
                    lineHeight: pxToRem(18),
                    letterSpacing: pxToRem(-0.5),
                    px: pxToRem(16),
                    pb: pxToRem(16),
                  }}
                >
                  배송 받으신 택배사가 아닌 타 택배사, 퀵, 특송으로 반송하실 경우 왕복배송비가
                  과금되며 검사를 진행할 수 없습니다. 반드시 배송 받으신 택배사를 이용해
                  반송해주세요.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent:'space-between' }} width="100%">
                <Box
                    id={'btn-order-detail-dlivryTracking'}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: pxToRem(500),
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EEEEEE',
                      // my: pxToRem(8),
                      width: pxToRem(106),
                      height: pxToRem(30),
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      navigate(
                        `${PATH_ROOT.user.mypage.deliveryTracking}/${orderHistoryStore.orderHistory?.orderNo}`,
                      );
                    }}
                >
                  <Typography variant={'Kor_12_r'} sx={{ fontSize: pxToRem(12) }}>
                    배송조회
                  </Typography>
                </Box>
                
                <Box
                  id={'btn-order-detail-requestKitReturn'}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: pxToRem(500),
                    backgroundColor: theme.palette.primary.main,
                    border: '1px solid #EEEEEE',
                    mt: pxToRem(8),
                    width: '49%',
                    height: pxToRem(30),
                    cursor: 'pointer',
                    '&:hover': {
                      background: '#FF5D0C !important',
                    },
                  }}
                  onClick={() => {
                    addressStore.setProps({
                      tempAddr: {} as IAddress,
                    });

                    navigate(
                      `${PATH_ROOT.user.mypage.kitReturnRequest}/${orderHistoryStore.orderHistory?.orderNo}`,
                    );
                  }}
                >
                  <Typography variant={'Kor_12_r'} sx={{ fontSize: pxToRem(12), color: 'white' }}>
                    키트 반송 요청
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
                  
      {openExchange && (
        <ExchangeAlert
          isAlertOpen={openExchange}
          alertContent={
            '현재 제품이 출고된 상태로,<br/>교환/반품 요청은<br/>1:1문의를 이용해주세요.'
          }
          alertCategory={'question'}
          buttonSet={exchangeAlertButtonSet()}
          handleAlertClose={() => {
            setOpenExchange(false);
          }}
          alertTitle={' '}
        />
      )}
    </>
  );
});

export default ExchangeOrderNoItems;
