import { useTheme, Stack, Typography, Button, } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useNavigate } from 'react-router';
import { PATH_ROOT } from 'src/routes/paths';
import { IAddress } from 'src/models/address/Address';
import { CallApiToStore } from 'src/utils/common';
import ExchangeAlert from '../../exchange-alert/ExchangeAlert';
import { toJS } from 'mobx';
import DnaResultDialog from '../../dna-result-dialog/DnaResultDialog';
import ReviewDialog from '../../review-dialog/ReviewDialog';
import { IOrderHistory } from 'src/models/order-history/OrderHistory';
import { pxToRem } from 'src/theme/typography';
import CAlert from 'src/components/CAlert';
/**
 * ## OrderHistoryDetailButtons 설명
 *
 */
interface Props {
  // type?: number;
  // exchangeType? : string;

  orderStateCd: number;
  exchangeStateCd: number;
  cancelReqYn: boolean;
  takeBackYn: boolean;
  orderNo: string;
  dlivryYn: boolean;
  goodsListLength: number;
  goodsList? : any;
  purchsConfirmYn? : boolean;
}

export const OrderHistoryDetailButtons = observer(
  ({
    orderStateCd,
    exchangeStateCd,
    cancelReqYn,
    takeBackYn,
    orderNo,
    dlivryYn,
    goodsListLength,
    goodsList,
    purchsConfirmYn
  }: Props) => {
    const rootStore = useStores();
    const { orderHistoryStore, loadingStore, myReviewStore, addressStore } = rootStore;
    const theme = useTheme();
    const navigate = useNavigate();
    const [openExchange, setOpenExchange] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertContent, setAlertContent] = useState('');

    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [testResultDialogOpen, setTestResultDialogOpen] = useState(false);
    const [orderHistoryDetail, setOrderHistoryDetail] = useState<IOrderHistory>();
    const exchangeEvent = () => {
      setOpenExchange(false);
      navigate(PATH_ROOT.customer.inquiry);
    };
    
    const confirmPurchase = () => {
      const param = orderNo || '0';
      CallApiToStore(orderHistoryStore.confirmPurchase(param), 'api', loadingStore)
        .then(() => {
          // console.log("구매확정 완료");
        })
        .catch((e) => {
          console.log(e.errors);
        });
    };

    const exchangeAlertButtonSet = () => {
      return (
        <>
          <Button
            id={'btn-order-main-exchange/cancel-inquiry'}
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
              '&:hover':{ background:'none', color:'#FF5D0C', border:'1px solid #FF5D0C'}
            }}
          >
            닫기
          </Button>
          <Button
            id={'btn-order-main-exchange/cancel-inquiry'}
            variant="contained"
            size="large"
            onClick={exchangeEvent}
            sx={{ color: '#fff', borderRadius: 5, minWidth: '40%',
            '&:hover':{ background:'#FF5D0C !important' } 
            }}
          >
            문의하기
          </Button>
        </>
      );
    };

    const openExchangeAlert = () => {
      setOpenExchange(true);
      window.history.pushState(null,'',window.location.href);
    };

    const testResultBtnEvent = () => {
      if (goodsList && goodsList.length > 0) {
        if (goodsList.length == 1) {
          const goodsInfo = goodsList[0];
          if (goodsInfo.goodsTypeCd.code === 230103) {  // 패키지 상품인 경우 주문내역 상세로 이동
            navigate(`/user/mypage/order-history/detail/${goodsInfo.orderNo}`);
          } else {
            if(goodsInfo.singleGoodsSid) {
              navigate(`${PATH_ROOT.user.mypage.dnaCard}/${goodsInfo.singleGoodsSid}`);
            } else if(goodsInfo.goodsSid) {
              navigate(`${PATH_ROOT.user.mypage.dnaCard}/${goodsInfo.goodsSid}`);
            }
          }
        } else {
          setTestResultDialogOpen(true);
          window.history.pushState(null,'',window.location.href);
        }
      } else {
        setAlertContent('확인 가능한 검사결과가 없습니다.');
        setOpenAlert(true);
        window.history.pushState(null,'',window.location.href);
      }
    };

    const reviewBtnEvent = () => {
      CallApiToStore(myReviewStore.getPossiblesByOrderNo(orderNo), 'api', loadingStore).then(() => {
        if (myReviewStore.possibleReviews.length === 0) {
          setAlertContent('작성 가능한 리뷰가 없습니다.');
          setOpenAlert(true);
          window.history.pushState(null,'',window.location.href);
        } else if (myReviewStore.possibleReviews.length === 1) {
          navigate(`/user/mypage/review-management/write`);

          myReviewStore.setProps({
            review: { ...toJS(myReviewStore.possibleReviews[0]) },
          });
        } else {
          setReviewDialogOpen(true);
          window.history.pushState(null,'',window.location.href);
        }
      });
    };

    const getReviewButton = () => { // 키트 상품 제외한 전체 상품 리뷰 작성 가능 (패키지 포함)
      let isDisabled = false;
      let title = '리뷰 작성';

      if(goodsList) {
        const ctegryList = goodsList[0].ctegryList;
        if(goodsList[0].goodsTypeCd.code === 230101 && (!ctegryList || ctegryList.length === 0)) {
          isDisabled = true;
          title = '작성 불가한 리뷰';
        } else if(!goodsList[0].reviewPossibleYn) {
          isDisabled = true;
          title = '이미 작성한 리뷰';
        }
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
            reviewBtnEvent();
          }}
          disabled={isDisabled}
        >
          <Typography variant="caption">
            {title}
          </Typography>
        </Button>
      )
    };

    const getCandyButton = () => {
      let isDisabled = false;
      let title = '결과 확인';

      if(goodsList) {
        const ctegryList = goodsList[0].ctegryList;
        if(goodsList[0].goodsTypeCd?.code === 230101 && (!ctegryList || ctegryList.length === 0 )) {
          isDisabled = true;
          title = '확인 불가한 상품';
        }
      }
      
  
      
      return (
        <Button
          id={'btn-order-main-checkCandy'}
          sx={[
            {
              background: theme.palette.primary.main,
              width: '100%',
              '&:hover':{
                background:`#FF5D0C !important`
              },
              border: isDisabled ? '#C6C7CA !important' : `1px solid ${theme.palette.primary.main} !important`,
            },
            cardButtonStyle,
          ]}
          onClick={() => {
            testResultBtnEvent();
          }}
          disabled={isDisabled}
        >
          <Typography variant="caption" sx={{ color: 'white' }}>
            {title}
          </Typography>
        </Button>
      )
    };

    useEffect(() => {
      window.addEventListener('popstate', () => {
        setOpenExchange(false)
        setTestResultDialogOpen(false);
        setReviewDialogOpen(false);
        setOpenAlert(false);
      })
      
      // console.log('orderHistoryStore : ', toJS(orderHistoryStore.orderHistory));
      // console.log('myReviewStore : ', toJS(myReviewStore.possibleReviews));
      // console.log('>>>>>>>>>>> :', myReviewStore.possibleReviews.length);
    }, []);

    const createButton = () => {
      if (cancelReqYn && !takeBackYn) {
        /* 취소 중 */
        return;
      } else if (cancelReqYn && takeBackYn) {
        /* 반품 중 */
        return (
          <Stack
            direction={'row'}
            width="100%"
            sx={{ pt: 2, justifyContent: 'center', alignItems: 'center' }}
            spacing={'2%'}
          >
            <Button
              id={'btn-order-main-dlivryTracking'}
              sx={[
                {
                  width: '100%',
                },
                cardButtonStyle,
              ]}
              onClick={() => navigate(`${PATH_ROOT.user.mypage.deliveryTracking}/${orderNo}`)}
            >
              <Typography variant="caption">배송조회</Typography>
            </Button>
          </Stack>
        );
      } else if (orderStateCd == 210114 && !takeBackYn) {
        /* 취소 완료 */
        // return <CanceledOrderHistoryDetail />;
      } else if (orderStateCd == 210114 && takeBackYn) {
        /* 반품 완료 */
        // return <RefundedOrderHistoryDetail />;
      } else if (orderStateCd == 210105 && exchangeStateCd == 210503) {
        /* 교환중 */
        return (
          <Stack
            direction={'row'}
            width="100%"
            sx={{ pt: 2, justifyContent: 'center', alignItems: 'center' }}
            spacing={'2%'}
          >
            <Button
              id={'btn-order-main-dlivryTracking'}
              sx={[
                {
                  width: '100%',
                },
                cardButtonStyle,
              ]}
              onClick={() =>
                navigate(
                  `${PATH_ROOT.user.mypage.deliveryTracking}/${orderHistoryStore.orderHistory?.orderNo}`,
                )
              }
            >
              <Typography variant="caption">배송조회</Typography>
            </Button>
          </Stack>
        );
      } else if (orderStateCd == 210106 && exchangeStateCd == 210505) {
        /* 교환 완료 */
        return (
                <Stack
                  direction={'row'}
                  width="100%"
                  spacing={'2%'}
                  sx={{ pt: pxToRem(16), justifyContent: 'center', alignItems: 'center' }}
                >
                  <Button
                    id={'btn-order-main-dlivryTracking'}
                    sx={[
                      {
                        // width: '32%',
                        width: '49%',
                      },
                      cardButtonStyle,
                    ]}
                    onClick={() => navigate(`${PATH_ROOT.user.mypage.deliveryTracking}/${orderNo}`)}
                    >
                    <Typography variant="caption">배송조회</Typography>
                  </Button>
                  <Button
                    id={'btn-order-main-requestKitReturn'}
                    variant='contained'
                    sx={[
                      {
                        width: '49%',
                        '&:hover':{
                          background:'#FF5D0C !important'
                        } 
                      },
                      highlightCardButtonStyle,
                    ]}
                    onClick={() => {
                      addressStore.setProps({
                        tempAddr: {} as IAddress,
                      });

                      navigate(`${PATH_ROOT.user.mypage.kitReturnRequest}/${orderNo}`);
                    }}
                  >
                    <Typography variant="caption" color="white">키트 반송 요청 </Typography>
                  </Button>
                  
                </Stack>
        );
        // return (
        //   <Stack>
        //     <Stack
        //       direction={'row'}
        //       width="100%"
        //       sx={{ pt: pxToRem(16), justifyContent: 'center', alignItems: 'center' }}
        //     >
        //       <Button
        //         variant='contained'
        //         sx={[
        //           {
        //             width: '100%',
                    
        //           },
        //           highlightCardButtonStyle,
        //         ]}
        //         onClick={() => {
        //           addressStore.setProps({
        //             tempAddr: {} as IAddress,
        //           });

        //           navigate(`${PATH_ROOT.user.mypage.kitReturnRequest}/${orderNo}`);
        //         }}
        //       >
        //         <Typography variant="caption" color="white">키트 반송 요청</Typography>
        //       </Button>
        //     </Stack>
        //     <Stack
        //       direction={'row'}
        //       width="100%"
        //       sx={{ /*pt: pxToRem(8)*/ pt: pxToRem(16), justifyContent: 'center', alignItems: 'center' }}
               
        //       spacing={'2%'}
        //     >
        //       <Button
        //         sx={[
        //           {
        //             // width: '32%',
        //             width: '49%',
        //           },
        //           cardButtonStyle,
        //         ]}
        //         onClick={() => {
        //           navigate(`${PATH_ROOT.user.mypage.deliveryTracking}/${orderNo}`);
        //         }}
        //       >
        //         <Typography variant="caption">배송조회</Typography>
        //       </Button>
        //       <Button
        //         sx={[
        //           {
        //             // width: '32%',
        //             width: '49%',
        //           },
        //           cardButtonStyle,
        //         ]}
        //         onClick={() => {
        //           openExchangeAlert();
        //         }}
        //       >
        //         <Typography variant="caption">교환/반품요청</Typography>
        //       </Button>
        //     </Stack>
        //   </Stack>
        // );
      } else {
        switch (orderStateCd) {
          /* 주문 완료 - 원래는 없는 상태이기 때문에 버튼 X */
          case 210101:
            return;
          // return (
          //   <Stack
          //     direction={'row'}
          //     width="100%"
          //     sx={{ pt: 2, justifyContent: 'center', alignItems: 'center' }}
          //     spacing={'2%'}
          //   >
          //     <Button
          //       sx={[
          //         {
          //           width: '100%',
          //         },
          //         cardButtonStyle,
          //       ]}
          //       onClick={() => {
          //         navigate(PATH_ROOT.market.address, { state: { from: 'order-history' } });
          //       }}
          //     >
          //       <Typography variant="caption">배송지 변경</Typography>
          //     </Button>
          //   </Stack>
          // );
          /* 첫구매(결제 완료 / 인체유래물연구 비동의) */
          case 210103:
            return dlivryYn ? (
              <Stack
                direction={'row'}
                width="100%"
                sx={{ pt: 2, justifyContent: 'center', alignItems: 'center' }}
                spacing={'2%'}
              >
                <Button
                  id={'btn-order-main-change-address'}
                  sx={[
                    {
                      width: '100%',
                    },
                    cardButtonStyle,
                  ]}
                  onClick={() => {
                    navigate(PATH_ROOT.market.address, { state: { from: 'order-history', orderNo: orderNo } });
                  }}
                >
                  <Typography variant="caption">배송지 변경</Typography>
                </Button>
              </Stack>
            ) : (
              ''
            );
          // case
          /* 추가구매(인체유래물연구 동의) */
          // <AdditionalOrderHistoryDetail />
          /* 배송 준비중 */
          case 210104:
            return;

          /* 키트 배송중 */
          case 210105:
            return (
            //   <Stack
            //     direction={'row'}
            //     width="100%"
            //     sx={{ pt: 2, justifyContent: 'center', alignItems: 'center' }}
            //     spacing={'2%'}
            //   >
            //     <Button
            //       sx={[
            //         {
            //           width: '49%',
            //         },
            //         cardButtonStyle,
            //       ]}
            //       onClick={() => navigate(`${PATH_ROOT.user.mypage.deliveryTracking}/${orderNo}`)}
            //     >
            //       <Typography variant="caption">배송조회</Typography>
            //     </Button>
            //     <Button
            //       sx={[
            //         {
            //           width: '49%',
            //         },
            //         cardButtonStyle,
            //       ]}
            //       onClick={() => {
            //         openExchangeAlert();
            //       }}
            //     >
            //       <Typography variant="caption">교환/반품요청</Typography>
            //     </Button>
            //   </Stack>
              
              <Stack
                direction={'row'}
                width="100%"
                sx={{ pt: 2, justifyContent: 'center', alignItems: 'center' }}
                spacing={'2%'}
              >
                <Button
                  id={'btn-order-main-dlivryTracking'}
                  sx={[
                    {
                      width: '100%',
                    },
                    cardButtonStyle,
                  ]}
                  onClick={() => navigate(`${PATH_ROOT.user.mypage.deliveryTracking}/${orderNo}`)}
                >
                  <Typography variant="caption">배송조회</Typography>
                </Button>
              </Stack>
              
            );
          /* 키트 배송 완료 */
          case 210106:
            return (
              <>
              { purchsConfirmYn ?
                <Stack
                  direction={'row'}
                  width="100%"
                  spacing={'2%'}
                  sx={{ pt: pxToRem(16), justifyContent: 'center', alignItems: 'center' }}
                >
                  <Button
                    id={'btn-order-main-dlivryTracking'}
                    sx={[
                      {
                        width: '100%',
                      },
                      cardButtonStyle,
                    ]}
                    onClick={() => navigate(`${PATH_ROOT.user.mypage.deliveryTracking}/${orderNo}`)}
                  >
                    <Typography variant="caption">배송조회</Typography>
                  </Button>
                  {/* <Button
                  variant='contained'
                  sx={[
                    {
                      width: '49%',
                      mt: pxToRem(16),
                      mb: pxToRem(8),
                      '&:hover':{
                        background:'#FF5D0C !important'
                      } 
                    },
                    highlightCardButtonStyle,
                  ]}
                  onClick={() => {
                    navigate(``);
                  }}
                >
                  <Typography variant="caption" color="white"> 검사 동의서 작성 </Typography>
                </Button> */}
                </Stack>  
                : /* <Button
                  variant='contained'
                  sx={[
                    {
                      width: '100%',
                      mt: pxToRem(16),
                      mb: pxToRem(8),
                      '&:hover':{
                        background:'#FF5D0C !important'
                      } 
                    },
                    highlightCardButtonStyle,
                  ]}
                  onClick={() => {
                    navigate(``);
                  }}
                >
                  <Typography variant="caption" color="white"> 검사 동의서 작성 </Typography>
                </Button> */
                <Stack
                  direction={'row'}
                  width="100%"
                  spacing={'2%'}
                  sx={{ pt: pxToRem(16), justifyContent: 'center', alignItems: 'center' }}
                >
                  <Button
                    id={'btn-order-main-dlivryTracking'}
                    sx={[
                      {
                        // width: '32%',
                        width: '49%',
                      },
                      cardButtonStyle,
                    ]}
                    onClick={() => navigate(`${PATH_ROOT.user.mypage.deliveryTracking}/${orderNo}`)}
                    >
                    <Typography variant="caption">배송조회</Typography>
                  </Button>
                  <Button
                    id={'btn-order-main-purchsConfirm'}
                    sx={[
                      {
                        // width: '32%',
                        width: '49%',
                      },
                      cardButtonStyle,
                    ]}
                    onClick={confirmPurchase}
                    >
                    <Typography variant="caption">구매확정</Typography>
                  </Button>
                  
                  
                </Stack>
              }
              </>
            );
          /* 키트 반송 신청 */
          // <ReturnRequestKitOrderHistoryDetail />

          /* 키트 반송 신청 완료 */
          case 210107:
            return (
              <Stack
                direction={'row'}
                width="100%"
                sx={{ pt: 2, justifyContent: 'center', alignItems: 'center' }}
                spacing={'2%'}
              >
                <Button
                  id={`btn-order-main-dlivryTracking`}
                  sx={[
                    {
                      width: '100%',
                    },
                    cardButtonStyle,
                  ]}
                  onClick={() => navigate(`${PATH_ROOT.user.mypage.deliveryTracking}/${orderNo}`)}
                >
                  <Typography variant="caption">배송조회</Typography>
                </Button>
              </Stack>
            );

          /* 키트 도착(반송 이후) */
          case 210109:
            return;

          /* 결과 생성중 */
          case 210111:
            return;

          /* 결과 생성완료 */
          case 210112:
            if (goodsListLength == 1) {
              return (
                <Stack sx={{ mt: 2}} >
                    {getCandyButton()}
                  <Stack
                    direction={'row'}
                    width="100%"
                    sx={{ pt: 1, justifyContent: 'center', alignItems: 'center' }}
                    spacing={'2%'}
                    >
                    {getReviewButton()}
                    <Button
                      id={`btn-order-main-analysisGuide`}
                      sx={[
                        {
                          width: '49%',
                          cursor:'pointer',
                          // border: isDisabled ? '#C6C7CA !important' : null,
                        },
                        cardButtonStyle,
                      ]}
                      onClick={() => {
                        navigate(`${PATH_ROOT.user.mypage.analysisGuide}/${orderNo}`);
                      }}
                    >
                      <Typography variant="caption">분석안내서</Typography>
                    </Button>
                  </Stack>
                </Stack>
                
                // <Stack
                //   direction={'row'}
                //   width="100%"
                //   spacing={'2%'}
                //   sx={{ pt: pxToRem(16), justifyContent: 'center', alignItems: 'center' }}
                // >
                //   <Button
                //     sx={[
                //       {
                //         // width: '32%',
                //         width: '49%',
                //       },
                //       cardButtonStyle,
                //     ]}
                //     onClick={() => navigate(`${PATH_ROOT.user.mypage.deliveryTracking}/${orderNo}`)}
                //     >
                //     <Typography variant="caption">배송조회</Typography>
                //   </Button>
                //   <Button
                //     variant='contained'
                //     sx={[
                //       {
                //         width: '49%',
                //         '&:hover':{
                //           background:'#FF5D0C !important'
                //         } 
                //       },
                //       highlightCardButtonStyle,
                //     ]}
                //     onClick={() => {
                //       addressStore.setProps({
                //         tempAddr: {} as IAddress,
                //       });

                //       navigate(`${PATH_ROOT.user.mypage.kitReturnRequest}/${orderNo}`);
                //     }}
                //   >
                //     <Typography variant="caption" color="white">키트 반송 요청 </Typography>
                //   </Button>
                  
                // </Stack>
              );
            } else {
              return null;
            }

          default:
            return;
        }
      }
    };

    return (
      <>
        {/* <Box> */}
        {createButton()}
        {/* </Box> */}

        {reviewDialogOpen && (
          <ReviewDialog
            handleClose={() => {
              setReviewDialogOpen(false);
            }}
            open={reviewDialogOpen}
          />
        )}

        {testResultDialogOpen && (
          <DnaResultDialog
            handleClose={() => {
              setTestResultDialogOpen(false);
            }}
            open={testResultDialogOpen}
          />
        )}
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

        {openAlert && (
          <CAlert
            isAlertOpen={openAlert}
            alertCategory={'f2d'}
            alertContent={alertContent}
            handleAlertClose={() => {
              setOpenAlert(false);
              setAlertContent('');
              navigate(-1);
            }}
          />
        )}
      </>
    );
  },
);

export default OrderHistoryDetailButtons;

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
// const  = {
//   position: 'absolute',
//   borderWidth: '1px 1px 0 0',
//   borderStyle: 'solid',
//   borderColor: '#FFFFFF',
//   width: 71.91,
//   height: 71.91,
//   borderRadius: 1.25,
// };
const cardButtonStyle = {
  border: '1px solid #EEEEEE',
  borderRadius: 500,
  color: '#202123',
  textAlign: 'center',
  height: 30,
  '&:hover':{
    background:'none'
  }
};
const highlightCardButtonStyle = {
  border: '1px solid #FF7F3F',
  borderRadius: 500,
  color: '#FF7F3F',
  textAlign: 'center',
  height: 30,
  // '&:hover':{
  //   background:'none'
  // }
};
