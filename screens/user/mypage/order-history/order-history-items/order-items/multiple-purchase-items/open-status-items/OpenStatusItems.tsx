import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../../models/root-store/root-store-context';
import { useTheme, Stack, Divider, Typography, Card, Button } from '@mui/material';
import { ReactComponent as ArrowMore } from 'src/assets/icons/ico-arrow-more.svg';
import { useNavigate } from 'react-router';
import Image from 'src/components/image/Image';
import { PATH_ROOT } from '../../../../../../../../routes/paths';
import { pxToRem } from 'src/theme/typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OrderHistoryDetailButtons from '../../../../order-history-buttons/OrderHistoryDetailButtons';
import { getOrderStateValue } from 'src/models';
import { getImagePath, numberComma, CallApiToStore } from 'src/utils/common';
import { toJS } from 'mobx';
import CAlert from 'src/components/CAlert';
import { makeStyles } from '@material-ui/core/styles';
import { IGoodsModel } from 'src/models/market-store/Goods';

/**
 * ## OpenStatusItems 설명
 *
 */

const useStyles = makeStyles(() => ({
  icon: {
    '&:hover': {
      fill: '#FF7F3F',
      // stroke : '#FF7F3F'
    },
  },
}));

interface Props {
  data?: any;
  handleClick: () => void;
  isOpen?: any;
}
export const OpenStatusItems = observer(({ data, handleClick, isOpen }: Props) => {
  const rootStore = useStores();
  const { myReviewStore, loadingStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');

  const makeDateFormat = (date: number) => {
    let tempDate = new Date(date);
    let year = tempDate.getFullYear();
    let month = ('0' + (1 + tempDate.getMonth())).slice(-2);
    let day = ('0' + tempDate.getDate()).slice(-2);
    return `${year}.${month}.${day}`;
  };

  const reviewBtnEvent = (goodsSid: number, ctegryList: any) => {
    if (!ctegryList || ctegryList.length < 1) {
      setAlertContent('리뷰를 작성할 수 없는 상품입니다.');
      setOpenAlert(true);
      window.history.pushState(null,'',window.location.href);
    } else {
      const param = data?.orderNo || '0';
      CallApiToStore(myReviewStore.getPossiblesByOrderNo(param), 'api', loadingStore).then(() => {
        const filterPossibleReviews = myReviewStore.possibleReviews.filter(
          (item) => item?.goodsSid == goodsSid,
        );
        if (filterPossibleReviews.length === 0) {
          setAlertContent('이미 리뷰 작성이 완료된 상품입니다.');
          setOpenAlert(true);
          window.history.pushState(null,'',window.location.href);
        } else {
          //filterPossibleReviews.length === 1
          navigate(`/user/mypage/review-management/write`);

          myReviewStore.setProps({
            review: { ...toJS(filterPossibleReviews[0]) },
          });
        }
      });
    }
  };

  const getReviewButton = (goodsInfo: IGoodsModel) => { // 키트 상품 제외한 전체 상품 리뷰 작성 가능 (패키지 포함)
    let isDisabled = false;
    let title = '리뷰 작성';

    if(goodsInfo?.goodsTypeCd?.code === 230101 && (!goodsInfo.ctegryList || goodsInfo.ctegryList.length < 1)) {
      isDisabled = true;
      title = '작성 불가한 리뷰';
    } else if(!goodsInfo.reviewPossibleYn) {
      isDisabled = true;
      title = '이미 작성한 리뷰';
    }

    return (
      <Button
        id={'btn-order-main-writeReview'}
        sx={[
          {
            width: '49%',
            cursor:'pointer',
            border: isDisabled ? '#C6C7CA !important' : null,
          },
          cardButtonStyle,
        ]}
        onClick={() => {
          reviewBtnEvent(Number(goodsInfo.goodsSid), goodsInfo.ctegryList);
        }}
        disabled={isDisabled}
      >
        <Typography variant="caption">
          {title}
        </Typography>
      </Button>
    )
  };

  const getCandyButton = (goodsInfo: IGoodsModel) => {
    let isDisabled = false;
    let title = '결과 확인';

    if(goodsInfo.goodsTypeCd?.code === 230101 && (!goodsInfo.ctegryList || goodsInfo.ctegryList.length === 0)) {
      isDisabled = true;
      title = '확인 불가한 상품';
    }

    return (
      <Button
        disableRipple
        sx={[
          {
            color: 'white',
            backgroundColor: theme.palette.primary.main,
            width: '100%',
            cursor:'pointer',
            '&:hover':{
              background: `#FF5D0C !important`, 
            },
            border: isDisabled ? '#C6C7CA !important' : `1px solid ${theme.palette.primary.main} !important`,
          },
          cardButtonStyle,
        ]}
        onClick={() => {
          if (goodsInfo?.goodsTypeCd?.code === 230103) {  // 패키지 상품인 경우 주문내역 상세로 이동
            navigate(`/user/mypage/order-history/detail/${goodsInfo.orderNo}`);
          } else {
            if (goodsInfo.singleGoodsSid) {
              navigate(`${PATH_ROOT.user.mypage.dnaCard}/${goodsInfo.singleGoodsSid}`)
            } else if(goodsInfo.goodsSid) {
              navigate(`${PATH_ROOT.user.mypage.dnaCard}/${goodsInfo.goodsSid}`);
            }
          }
        }}
        disabled={isDisabled}
      >
        <Typography variant="caption" sx={{ color: 'white ' }}>
          {title}
        </Typography>
      </Button>
    )
  };

  useEffect(() => {
    window.addEventListener('popstate', () => {
      setOpenAlert(false)
    })
    
  },[])
  
  return (
    <>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          boxShadow: 'none',
          // p: 2.5,
          border: '1px solid #EEEEEE;',
        }}
      >
        <Box
          sx={{
            px: 2.5,
            pt: 2.5,
            pb: 0,
          }}
        >
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{
              width: '100%',
              pb: pxToRem(16),
              cursor: 'pointer',
              textAlign:'left'
            }}
            onClick={() => navigate(`${PATH_ROOT.user.mypage.orderHistoryDetail}/${data.orderNo}`)}
          >
            <Typography
              variant='Kor_18_b'
              color={theme.palette.primary.main}
              // onClick={() => navigate(`${PATH_ROOT.user.mypage.orderHistoryDetail}/${data.orderNo}`)}
            >
              {/* {data.orderStateCd?.value} */}
              {getOrderStateValue(
                data.orderStateCd?.code,
                data.orderStateCd?.value,
                data.exchangeStateCd?.code,
                data.cancelReqYn,
                data.takeBackYn,
              )}
            </Typography>
            <Button
              disableRipple
              sx={{
                width: 24,
                height: 24,
                justifyContent: 'flex-end',
                backgroundColor: '#fff',
                // color: '#DFE0E2',
                '&:hover': {
                  backgroundColor: '#fff',
                  fill: theme.palette.primary.main,
                },
              }}
              // onClick={() =>
              //   navigate(`${PATH_ROOT.user.mypage.orderHistoryDetail}/${data.orderNo}`)
              // }
            >
              <ArrowMore
                fill="#DFE0E2"
                // className={classes.icon}
              />
            </Button>
          </Stack>
          {data.goodsList.map((goodsInfo: any, index: number) => {
            return (
              <Box key={goodsInfo.goodsSid} sx={{ mt: 0, pt: 0 }}>
                <Stack direction={'row'} sx={{ alignItems: 'center' }}>
                  <Box
                    position={'relative'}
                    // width={79}K
                  >
                    {/* <Box
                      sx={[
                        {
                          background: '#EEEDFE',
                          left: 7.09,
                          top: 0,
                        },
                      ]}
                    />
                    <Box
                      sx={[
                        {
                          background: '#ECF8F1',
                          left: 3.49,
                          top: 3.6,
                        },
                      ]}
                    /> */}
                    {/* <Box position={'relative'}> */}
                    <Box sx={myOrderCardImgStyle}>
                      <Image
                        src={getImagePath(goodsInfo?.img1Path)}
                        ratio={'1/1'}
                        width={pxToRem(90)}
                        height={pxToRem(90)}
                        // py={pxToRem(4)}
                        onError={(e: any) => {
                          e.target.src = '/assets/default-goods.svg';
                        }}
                      />
                    </Box>
                    {/* </Box> */}
                  </Box>

                  <Stack
                    direction={'column'}
                    sx={{
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      ml: pxToRem(20),
                      // height: 90,
                      // mb:pxToRem(10),
                      width: '100%',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#9DA0A5',
                      }}
                    >
                      {makeDateFormat(data?.orderDt)}
                    </Typography>
                    <Stack direction={'row'} width="100%">
                      <Typography
                        variant={'Kor_18_r'}
                        display={'inline'}
                        sx={{
                          color: '#202123',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          maxWidth: '90%',
                        }}
                      >
                        {goodsInfo.goodsNm}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle2">
                      {numberComma(Number(goodsInfo.goodsAmt))}
                      {goodsInfo.currencyCd?.value}
                    </Typography>
                  </Stack>
                </Stack>

                {/* {index == data.goodsList.length -1 ? '' :  <Divider
                  key={index + `divider`}
                  orientation={'horizontal'}
                  sx={{ border: '1px dashed #EEEEEE',  my: pxToRem(20), }}
                />} */}

                {data.orderStateCd?.code === 210112 ? ( // 유전자 분석 완료 시 
                  
                  <Stack sx = {{ mt : 2 }}>
                    {getCandyButton(goodsInfo)}
                    <Stack
                      key={goodsInfo + `code`}
                      direction={'row'}
                      width="100%"
                      sx={{ pt: 1, justifyContent: 'center', alignItems: 'center' }}
                      spacing={'2%'}
                      >
                      {getReviewButton(goodsInfo)}
                      <Button
                        id={`btn-order-main-analysisGuide`}
                        sx={[
                          {
                            width: '49%',
                            cursor:'pointer',
                          },
                          cardButtonStyle,
                        ]}
                        onClick={() => {
                          navigate(`${PATH_ROOT.user.mypage.analysisGuide}/${data.orderNo}`);
                        }}
                      >
                        <Typography variant="caption"> 분석안내서 </Typography>
                      </Button>
                    </Stack>
                  </Stack>
                ) : null}

                {index == data.goodsList.length - 1 ? (
                  ''
                ) : (
                  <Divider
                    key={index + `divider`}
                    orientation={'horizontal'}
                    sx={{ border: '1px dashed #EEEEEE', my: pxToRem(20) }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        <Box>
          <Box sx={{ px: 2.5, pb: 2.5 }}>
            <OrderHistoryDetailButtons
              orderStateCd={data.orderStateCd?.code || 0}
              exchangeStateCd={data.exchangeStateCd}
              cancelReqYn={data.cancelReqYn}
              takeBackYn={data.takeBackYn}
              orderNo={data.orderNo}
              dlivryYn={data.dlivryYn}
              goodsListLength={data.goodsList.length || 0}
              purchsConfirmYn={data.purchsConfirmYn}
            />
          </Box>
          <Divider sx={{ border: '1px dashed #EEEEEE' }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: pxToRem(13),
              cursor:'pointer'
            }}
            onClick={handleClick}
          >
            <Typography variant={'Kor_14_b'}>
              총 &nbsp;
              <span style={{ color: theme.palette.primary.main }}>
                {' '}
                {data.goodsList.length}건 &nbsp;
              </span>
              전체보기
            </Typography>
            <KeyboardArrowUpIcon />
          </Box>
        </Box>
      </Card>

      {openAlert && (
        <CAlert
          isAlertOpen={openAlert}
          alertCategory={'f2d'}
          alertContent={alertContent}
          handleAlertClose={() => {
            setOpenAlert(false);
            navigate(-1);
            setAlertContent('');
            navigate(-1);
          }}
        />
      )}
    </>
  );
});

export default OpenStatusItems;
const myOrderCardImgStyle = {
  // position: 'absolute',
  border: '1px solid #F5F5F5',
  background: '#FFFFFF',
  width: 71.91,
  height: 71.91,
  borderRadius: 1.25,
  left: 0,
  top: 8.09,
};
const cardButtonStyle = {
  border: '1px solid #EEEEEE',
  borderRadius: 500,
  color: '#202123',
  textAlign: 'center',
  height: 30,
  '&:hover':{
    background:'transparent'
  }
};
