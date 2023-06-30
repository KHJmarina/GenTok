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
import OrderItems from '../order-items/OrderItems';
import ReviewDialog from '../../../../review-dialog/ReviewDialog';
import DnaResultDialog from '../../../../dna-result-dialog/DnaResultDialog';
import { CallApiToStore, getImagePath, numberComma } from 'src/utils/common';
import CAlert from 'src/components/CAlert';
import Image from 'src/components/image/Image';
import { PATH_ROOT } from 'src/routes/paths';
import { toJS } from 'mobx';
import { IOrderHistory } from 'src/models';
import OrderHistoryTimeline from '../../../order-history-timeline/OrderHistoryTimeline';
import OrderItemImage from '../OrderItemImage';
import OrderItemContent from '../OrderItemContent';

/**
 * ## MadeCandy 설명
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
export const MadeCandyOrderNoItems = observer(() => {
  const rootStore = useStores();
  const { loadingStore, myReviewStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(true);
  const [testOpen, setTestOpen] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuthContext();
  const [accdnOpen, setAccdnOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [testResultDialogOpen, setTestResultDialogOpen] = useState(false);

  const [orderHistoryItem, setOrderHistoryItem] = useState<IOrderHistory>();

  const handleChange = (event: React.SyntheticEvent) => {
    setOpen(!open);
  };

  const handleClickTest = () => {
    setTestOpen(!testOpen);
  };

  const reviewBtnEvent = () => {
    const param = orderHistoryStore.orderHistory?.orderNo
      ? orderHistoryStore.orderHistory?.orderNo
      : '0';
    CallApiToStore(myReviewStore.getPossiblesByOrderNo(param), 'api', loadingStore).then(() => {
      if (myReviewStore.possibleReviews.length === 0) {
        setAlertContent('작성 가능한 리뷰가 없습니다.');
        setOpenAlert(true);
        window.history.pushState(null, '', window.location.href);
      } else if (myReviewStore.possibleReviews.length === 1) {
        navigate(`/user/mypage/review-management/write`);

        myReviewStore.setProps({
          review: { ...toJS(myReviewStore.possibleReviews[0]) },
        });
      } else {
        setReviewDialogOpen(true);
        window.history.pushState(null, '', window.location.href);
        // navigate(-1);
      }
    });
  };

  const testResultBtnEvent = () => {
    const userTestResultList = orderHistoryStore.orderHistory?.userTestResultList || [];
    if (userTestResultList && userTestResultList.length > 0) {
      if (userTestResultList.length == 1) {
        // navigate(PATH_ROOT.user.mypage.dnaCard, { state:{ ctegryNm: goodsList[0].ctegryList[0]?.ctegryNm, ctegrySid: goodsList[0].ctegryList[0]?.ctegrySid, ordr: goodsList[0].ctegryList[0]?.ordr }})
        userTestResultList[0].singleGoodsSid
          ? navigate(`${PATH_ROOT.user.mypage.dnaCard}/${userTestResultList[0].singleGoodsSid}`)
          : navigate(`${PATH_ROOT.user.mypage.dnaCard}/${userTestResultList[0].goodsSid}`);
      } else {
        setTestResultDialogOpen(true);
        window.history.pushState(null, '', window.location.href);
      }
    } else {
      setAlertContent('확인 가능한 검사결과가 없습니다.');
      setOpenAlert(true);
      window.history.pushState(null, '', window.location.href);
    }
  };

  const makeDateFormat = (date: number) => {
    let tempDate = new Date(date);
    let year = tempDate.getFullYear();
    let month = ('0' + (1 + tempDate.getMonth())).slice(-2);
    let day = ('0' + tempDate.getDate()).slice(-2);

    return `${year}.${month}.${day}`;
  };

  const getReviewButton = () => {
    return (
      <Stack sx={{ width: '100%', mx: pxToRem(20), mt: pxToRem(16) }}>
        <Button
          id={'btn-order-detail-checkCandy'}
          disableRipple
          sx={[
            {
              color: 'white',
              backgroundColor: theme.palette.primary.main,
              width: '100%',
              cursor: 'pointer',
              '&:hover': {
                background: `#FF5D0C !important`,
              },
            },
            cardButtonStyle,
          ]}
          onClick={() => {
            testResultBtnEvent();
          }}
        >
          <Typography variant={'Kor_12_r'} sx={{ color: 'white' }}>
            결과카드 확인&nbsp;
            <span style={{ fontWeight: '600', fontSize: pxToRem(12), color: 'white' }}>
              {orderHistoryStore.orderHistory?.userTestResultList?.length}
            </span>
          </Typography>
        </Button>
        <Stack
          direction={'row'}
          width="100%"
          sx={{ pt: 1, justifyContent: 'center', alignItems: 'center' }}
          spacing={'2%'}
        >
          <Button
            id={'btn-order-detail-writeReview'}
            sx={[
              {
                width: '49%',
                cursor: 'pointer',
              },
              cardButtonStyle,
            ]}
            onClick={() => {
              reviewBtnEvent();
            }}
          >
            <Typography variant="caption">
              리뷰작성 &nbsp;
              <span
                style={{
                  fontWeight: '600',
                  fontSize: pxToRem(12),
                  color: theme.palette.primary.main,
                }}
              >
                {orderHistoryStore.orderHistory?.reviewPossibleCnt}
              </span>
            </Typography>
          </Button>
          <Button
            id={`btn-order-detail-analysisGuide`}
            sx={[
              {
                width: '49%',
                cursor: 'pointer',
              },
              cardButtonStyle,
            ]}
            onClick={() => {
              navigate(
                `${PATH_ROOT.user.mypage.analysisGuide}/${orderHistoryStore.orderHistory?.orderNo}`
              );
            }}
          >
            <Typography variant="caption"> 분석안내서 </Typography>
          </Button>
        </Stack>
      </Stack>
    );
  };

  const noReviewButton = () => {
    return (
      <Stack
        direction={'row'}
        spacing={'2%'}
        width="100%"
        sx={{ justifyContent: 'center', alignItems: 'center', mx: pxToRem(20), mt: pxToRem(16) }}
      >
        <Button
          id={'btn-order-detail-checkCandy'}
          disableRipple
          sx={[
            {
              color: 'white',
              backgroundColor: theme.palette.primary.main,
              width: '49%',
              cursor: 'pointer',
              '&:hover': {
                background: `#FF5D0C !important`,
              },
            },
            cardButtonStyle,
          ]}
          onClick={() => {
            testResultBtnEvent();
          }}
        >
          <Typography variant={'Kor_12_r'} sx={{ color: 'white' }}>
            결과카드 확인&nbsp;
            <span style={{ fontWeight: '600', fontSize: pxToRem(12), color: 'white' }}>
              {orderHistoryStore.orderHistory?.userTestResultList?.length}
            </span>
          </Typography>
        </Button>
        <Button
          id={`btn-order-detail-analysisGuide`}
          sx={[
            {
              width: '49%',
              cursor: 'pointer',
            },
            cardButtonStyle,
          ]}
          onClick={() => {
            navigate(
              `${PATH_ROOT.user.mypage.analysisGuide}/${orderHistoryStore.orderHistory?.orderNo}`
            );
          }}
        >
          <Typography variant="caption"> 분석안내서 </Typography>
        </Button>
      </Stack>
    );
  };

  useEffect(() => {
    window.addEventListener('popstate', () => {
      setTestResultDialogOpen(false);
      setReviewDialogOpen(false);
      setOpenAlert(false);
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems:
                    orderHistoryStore.orderHistory?.goodsList?.length! > 1 ? '' : 'center',
                }}
                borderRadius={2}
              >
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
                // height: pxToRem(102),
                background: '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mx: pxToRem(20),
                // ml: pxToRem(20),
                px: pxToRem(20),
                py: pxToRem(16),
                textAlign: 'left',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  // ml: pxToRem(20),
                  // mt: pxToRem(16),
                }}
              >
                <IconOrderBell style={{ marginRight: pxToRem(8) }} />
                <Typography variant={'Kor_14_r'}>
                  {`${
                    user?.nickNm ? user?.nickNm : user?.userNm || ''
                  } 님의 유전자 분석이 완료되었어요.`}
                </Typography>
              </Box>
              {orderHistoryStore.orderHistory?.reviewPossibleCnt
                ? getReviewButton()
                : noReviewButton()}
            </Box>

            <OrderHistoryTimeline data={orderHistoryStore.orderHistory} />
          </Stack>
          <OrderItems />
        </AccordionDetails>
      </Accordion>
      <Divider sx={{ borderWidth: pxToRem(4) }}></Divider>
      <CAlert
        isAlertOpen={openAlert}
        alertCategory={'f2d'}
        handleAlertClose={() => {
          setOpenAlert(false);
          navigate(-1);
        }}
        alertContent={alertContent}
      />
      {reviewDialogOpen && (
        <ReviewDialog
          handleClose={() => {
            setReviewDialogOpen(false);
            navigate(-1);
          }}
          open={reviewDialogOpen}
        />
      )}

      {testResultDialogOpen && (
        <DnaResultDialog
          handleClose={() => {
            setTestResultDialogOpen(false);
            navigate(-1);
          }}
          open={testResultDialogOpen}
        />
      )}
    </>
  );
});

export default MadeCandyOrderNoItems;

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
  top: 7.09,
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
const cardButtonStyle = {
  border: '1px solid #EEEEEE',
  borderRadius: 500,
  color: '#202123',
  textAlign: 'center',
  height: 30,
  '&:hover': {
    background: 'transparent',
  },
};
