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
  Button,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useStores } from '../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { PATH_AUTH, PATH_PAGE, PATH_ROOT } from '../../../../../../../routes/paths';
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
import OrderItems from '../order-items/OrderItems';
import { getImagePath, numberComma } from 'src/utils/common';
import ExchangeAlert from '../../../../exchange-alert/ExchangeAlert';
import Image from 'src/components/image/Image';
import OrderHistoryTimeline from '../../../order-history-timeline/OrderHistoryTimeline';
/**
 * ## ShippingKit 설명
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

export const ShippingKitOrderNoItems = observer(() => {
  const rootStore = useStores();
  const { orderHistoryStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(true);
  const [testOpen, setTestOpen] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuthContext();
  const [accdnOpen, setAccdnOpen] = useState(false);
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
    navigate(-1);
    navigate(PATH_ROOT.customer.inquiry, { replace: true, state : {"orderNo" : orderNo , "clickStatus" : clickStatus} });
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
            navigate(-1);
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
    );
  };
  const openExchangeAlert = () => {
    setOpenExchange(true);
    window.history.pushState(null, '', window.location.href);
  };

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 'none',
    repeat: Infinity,
  } as const;

  const makeDateFormat = (date: number) => {
    let tempDate = new Date(date);
    let year = tempDate.getFullYear();
    let month = ('0' + (1 + tempDate.getMonth())).slice(-2);
    let day = ('0' + tempDate.getDate()).slice(-2);

    return `${year}.${month}.${day}`;
  };

  useEffect(() => {
    window.addEventListener('popstate', () => {
      setOpenExchange(false);
    });
  }, []);

  return (
    <>
      <Accordion expanded={open} className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.action.disabled }} />}
          sx={{ mx: pxToRem(20), px: 0 }}
          className={classes.deliveryInfo}
          onClick={handleChange}
        >
          <Typography>No. {orderHistoryStore.orderHistory?.orderNo!}</Typography>
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
                {(orderHistoryStore.orderHistory?.goodsList || []).length > 1 ? (
                  <>
                    <Box
                      position={'relative'}
                      // width={79}
                      // height={77}
                    >
                      <Box
                        sx={[
                          {
                            background: '#FAFAFA',
                            left: 7.09,
                            top: 0,
                          },
                          myOrderBackGroundCardStyle,
                        ]}
                      />
                      <Box
                        sx={[
                          {
                            background: '#FAFAFA',
                            left: 3.49,
                            top: 3.6,
                          },
                          myOrderBackGroundCardStyle,
                        ]}
                      />
                      <Box sx={myOrderCardImgStyle}>
                        <Image
                          src={getImagePath(
                            (orderHistoryStore.orderHistory?.goodsList[0]?.goodsSid == 74 // kit box가 첫번째 상품일 때 다른 상품부터 노출
                              ? `${orderHistoryStore.orderHistory?.goodsList[1]?.img1Path}`
                              : `${orderHistoryStore.orderHistory?.goodsList[0]?.img1Path}`) || '',
                          )}
                          ratio={'1/1'}
                          width={pxToRem(90)}
                          height={pxToRem(90)}
                          py={pxToRem(4)}
                          onError={(e: any) => {
                            e.target.src = '/assets/default-goods.svg';
                          }}
                        />
                      </Box>
                    </Box>
                    <Stack
                      direction={'column'}
                      sx={{
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        ml: pxToRem(88),
                        // height: 90,
                        width: '100%',
                        // mb: 1.5,
                      }}
                    >
                      <Stack direction={'row'} width="100%">
                        <Typography
                          variant={'Kor_18_b'}
                          display={'inline'}
                          sx={{
                            color: '#202123',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            maxWidth: '55%',
                            mb: pxToRem(8),
                          }}
                        >
                          {orderHistoryStore.orderHistory?.goodsList[0].goodsSid == 74 // kit box 가 0번 상품인 경우 다른 상품명으로 노출
                            ? orderHistoryStore.orderHistory?.goodsList[1].goodsNm
                            : orderHistoryStore.orderHistory?.goodsList[0]?.goodsNm!}
                        </Typography>
                        <Typography
                          variant={'Kor_18_b'}
                          display={'inline'}
                          sx={{ color: '#202123' }}
                        >
                          &nbsp;포함
                        </Typography>
                        <Typography
                          variant={'Kor_18_b'}
                          display={'inline'}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          &nbsp;[총 {orderHistoryStore.orderHistory?.goodsList.length}개]
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="subtitle2">
                          {numberComma(Number(orderHistoryStore.orderHistory?.paymentAmt))}
                          {(orderHistoryStore.orderHistory?.goodsList[0]?.currencyCd! &&
                            orderHistoryStore.orderHistory?.goodsList[0].currencyCd?.value!) ||
                            '원'}
                        </Typography>
                        <Box
                          sx={{
                            width: pxToRem(12),
                            height: pxToRem(1),
                            px: pxToRem(8),
                            backgroundColor: '#D9D9D9',
                            transform: 'rotate(90deg)',
                          }}
                        ></Box>
                        {/* <Divider orientation="vertical" flexItem variant={'middle'} sx={{ px:pxToRem(8) }} /> */}
                        <Typography variant={'Kor_14_r'}>
                          총 {orderHistoryStore.orderHistory?.goodsList.length}개
                        </Typography>
                      </Box>

                      <Typography variant={'Kor_14_r'}> 키트 배송 중</Typography>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Box position={'relative'}>
                      <Box sx={myOrderSingleCardImgStyle}>
                        <Image
                          src={getImagePath(
                            (orderHistoryStore.orderHistory?.goodsList[0]?.goodsSid == 74 // kit box가 0번 상품일 때 다른 상품부터 노출
                              ? `${orderHistoryStore.orderHistory?.goodsList[1]?.img1Path}`
                              : `${orderHistoryStore.orderHistory?.goodsList[0]?.img1Path}`) || '',
                          )}
                          ratio={'1/1'}
                          width={pxToRem(90)}
                          height={pxToRem(90)}
                          py={pxToRem(4)}
                          onError={(e: any) => {
                            e.target.src = '/assets/default-goods.svg';
                          }}
                        />
                      </Box>
                    </Box>
                    <Stack
                      direction={'column'}
                      sx={{
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        ml: pxToRem(96),
                        height: 90,
                        width: '100%',
                        mb: 1.5,
                      }}
                    >
                      {/* <Typography variant='caption' sx={{
                        color: '#9DA0A5',
                      }}>
                        {makeDateFormat(orderHistoryStore.orderHistory?.regDt! || 0)}
                      </Typography> */}
                      <Stack direction={'row'} width="100%">
                        <Typography
                          variant={'Kor_18_b'}
                          display={'inline'}
                          sx={{
                            color: '#202123',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            mb: pxToRem(8),
                          }}
                        >
                          {orderHistoryStore.orderHistory?.goodsList[0].goodsSid == 74 // kit box 가 0번 상품인 경우 다른 상품명으로 노출
                            ? orderHistoryStore.orderHistory?.goodsList[1].goodsNm
                            : orderHistoryStore.orderHistory?.goodsList[0]?.goodsNm!}
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="subtitle2">
                          {numberComma(Number(orderHistoryStore.orderHistory?.paymentAmt))}
                          {(orderHistoryStore.orderHistory?.goodsList[0]?.currencyCd! &&
                            orderHistoryStore.orderHistory?.goodsList[0].currencyCd?.value!) ||
                            '원'}
                        </Typography>
                        <Box
                          sx={{
                            width: pxToRem(12),
                            height: pxToRem(1),
                            px: pxToRem(8),
                            backgroundColor: '#D9D9D9',
                            transform: 'rotate(90deg)',
                          }}
                        ></Box>
                        {/* <Divider orientation="vertical" flexItem variant={'middle'} sx={{ px:pxToRem(8) }} /> */}
                        <Typography variant={'Kor_14_r'}>
                          총 {orderHistoryStore.orderHistory?.goodsList.length}개
                        </Typography>
                      </Box>

                      <Typography variant={'Kor_14_r'}> 키트 배송 중</Typography>
                    </Stack>
                  </>
                )}
              </Box>
            </Stack>

            <Box
              sx={{
                borderRadius: pxToRem(10),
                height: pxToRem(100),
                background: '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mx: pxToRem(20),
                py: pxToRem(20),
                px: pxToRem(16),
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
                <Typography variant={'Kor_14_r'} >
                  키트가 배송 중이에요
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
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
                    mt: pxToRem(16),
                    width: pxToRem(106),
                    height: pxToRem(30),
                    // mr: pxToRem(4),
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    navigate(
                      `${PATH_ROOT.user.mypage.deliveryTracking}/${orderHistoryStore.orderHistory?.orderNo}`,
                    )
                  }
                >
                  <Typography variant={'Kor_12_r'} sx={{ fontSize: pxToRem(12) }}>
                    배송조회
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
            navigate(-1);
          }}
          alertTitle={' '}
        />
      )}
    </>
  );
});

export default ShippingKitOrderNoItems;

const myOrderSingleCardImgStyle = {
  position: 'absolute',
  border: '1px solid #F5F5F5',
  background: '#FFFFFF',
  width: 90,
  height: 90,
  borderRadius: 1.25,
  left: 0,
  top: 0,
};
const myOrderCardImgStyle = {
  position: 'absolute',
  border: '1px solid #F5F5F5',
  background: '#FFFFFF',
  width: 71.91,
  height: 71.91,
  borderRadius: 1.25,
  left: 0,
  top: 8.09,
};
const myOrderBackGroundCardStyle = {
  position: 'absolute',
  borderWidth: '1px 1px 0 0',
  borderStyle: 'solid',
  borderColor: '#EEEEEE',
  width: 71.91,
  height: 71.91,
  borderRadius: 1.25,
};
