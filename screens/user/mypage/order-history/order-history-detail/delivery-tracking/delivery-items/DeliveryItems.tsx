import Box from '@mui/material/Box';
import { useTheme, Stack, Typography, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../models/root-store/root-store-context';
import { pxToRem } from 'src/theme/typography';
import { copyToClipboard } from 'src/utils/copyToClipboard';
import CallIcon from '@mui/icons-material/Call';
import { useNavigate, useParams } from 'react-router';
import { getImagePath } from 'src/utils/common';
import Image from 'src/components/image/Image';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';
import { CallApiToStore } from 'src/utils/common';
import { toJS } from 'mobx';
import { IDeliveryTracking } from 'src/models';
import { IOrderHistory } from 'src/models/order-history/OrderHistory';
/**
 * ## DeliveryItems 설명
 *
 */
export const DeliveryItems = observer(() => {
  const rootStore = useStores();
  const { deliveryTrackingStore, orderHistoryStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [orderHistoryDetail, setOrderHistoryDetail] = useState<IOrderHistory>();
  const { orderNo: orderNo } = useParams();
  const [isRender, setIsRender] = useState<boolean>(false);

  useEffect(() => {
    const param = orderNo || '0';
    CallApiToStore(orderHistoryStore.getOrderHistoryDetail(param), 'api', loadingStore).then(() => {
      setIsRender(true);
      setOrderHistoryDetail(
        orderHistoryStore.orderHistory ? orderHistoryStore.orderHistory : ({} as IOrderHistory),
      );
    });
  }, [orderNo]);

  return (
    <>
      {isRender && (
        <Stack sx={{ mx: pxToRem(20), mt: pxToRem(20), mb: 0, alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex' }} borderRadius={2}>
            <Stack direction={'row'} sx={{ alignItems : orderHistoryStore?.orderHistory?.goodsList?.length! > 1 ? '' : 'center' }} >
              <OrderItemImage
                getImageSrc={orderHistoryStore.orderHistory?.goodsList[0].img1Path}
                listSize={Number(`${orderHistoryStore.orderHistory?.goodsList.length}`)}
              />
              <Stack
                direction={'column'}
                sx={{
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  ml: pxToRem(14),
                  height: 90,
                  width: '100%',
                }}
              >
                <Stack flexDirection={'column'} width="100%">
                  <Box
                    sx={{ display: 'flex', mb: pxToRem(8), textAlign: 'left', flexWrap: 'wrap' }}
                  >
                    <Typography
                      variant={'Kor_18_b'}
                      display={'inline'}
                      sx={{
                        color: '#202123',
                        overflow: 'hidden',
                        // whiteSpace: 'nowrap',
                        // textOverflow: 'ellipsis',
                        // maxWidth: '45%',
                      }}
                    >
                      {orderHistoryStore.orderHistory?.goodsList[0]?.goodsNm!}
                      {orderHistoryStore.orderHistory?.goodsList.length! > 1 ? (
                        <>
                          <span>&nbsp;포함&nbsp;</span>
                          <span style={{ color: theme.palette.primary.main }}>
                            [총 {orderHistoryStore.orderHistory?.goodsList?.length!}개]
                          </span>
                        </>
                      ) : null}
                    </Typography>
                    {/* {orderHistoryStore.orderHistory?.goodsList.length! ? ( */}
                    {/* //   <Box sx={{ display: 'flex' }}>
                    //     <Typography variant={'Kor_18_b'}>&nbsp;포함&nbsp;</Typography>
                    //     <Typography variant={'Kor_18_b'} sx={{ color: theme.palette.primary.main }}>
                    //       [총 {orderHistoryStore.orderHistory?.goodsList?.length!}개]
                    //     </Typography>
                    //   </Box>
                    // ) : null} */}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap:'wrap' }}>
                    <Typography variant={'Kor_14_r'}> 운송장 번호 &nbsp; </Typography>
                    <Typography sx={{ mr: pxToRem(8) }}>
                      {deliveryTrackingStore?.deliveryTracking?.dlivryNo}
                    </Typography>

                    <Box
                      id={`btn-order-delivery-tracking-copy`}
                      component={'button'}
                      sx={{
                        width: pxToRem(37),
                        minHeight: pxToRem(22),
                        border: '1px solid #FF7F3F',
                        borderRadius: pxToRem(100),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        background: '#FFFFFF',
                        // '&:hover': { background: '#FF7F3F', color: '#FFFFFF', cursor:'pointer' },
                        '&:hover': {
                          background: 'none',
                          color: '#FF5D0C',
                          border: '1px solid #FF5D0C',
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => copyToClipboard(orderHistoryStore.orderHistory?.dlivryNo!)}
                    >
                      <Typography
                        variant={'Kor_12_r'}
                        sx={{
                          color: theme.palette.primary.main,
                          // '&:hover': { background: '#FF7F3F', color: '#FFFFFF' },
                          '&:hover': { color: '#FF5D0C' },
                        }}
                      >
                        복사
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', width: '100%', justifyContent:'space-between' }}>
            <Box
              id={`btn-order-delivery-tracking-dlivryCompanyNumber`}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: pxToRem(500),
                backgroundColor: '#FFFFFF',
                border: '1px solid #EEEEEE',
                my: pxToRem(16),
                width: '49%',
                height: pxToRem(30),
                cursor: deliveryTrackingStore?.deliveryTracking?.companyPhoneNo ? 'pointer' : 'default'
              }}
              onClick={(e:any) => 
                deliveryTrackingStore?.deliveryTracking?.companyPhoneNo ?
                  window.location.href=`tel:${deliveryTrackingStore?.deliveryTracking?.companyPhoneNo}`
                : e.preventDefault()
              }
            >
              <CallIcon
                style={{ width: pxToRem(12), height: pxToRem(12), marginRight: pxToRem(4) }}
              />
              <Typography variant={'Kor_12_r'} sx={{ fontSize: pxToRem(12) }}>
                {orderHistoryStore.orderHistory?.dlivryCd?.value}
              </Typography>
            </Box>
            <Box
              id={`btn-order-delivery-tracking-dlivryDriverNumber`}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: pxToRem(500),
                backgroundColor: '#FFFFFF',
                border: '1px solid #EEEEEE',
                my: pxToRem(16),
                width: '49%',
                height: pxToRem(30),
                cursor: deliveryTrackingStore?.deliveryTracking?.driverPhoneNo ? 'pointer' : 'default'
              }}
              onClick={(e:any) => 
                deliveryTrackingStore?.deliveryTracking?.driverPhoneNo ?
                  window.location.href=`tel:${deliveryTrackingStore?.deliveryTracking?.driverPhoneNo}`
                : e.preventDefault()
              }
            >
              <CallIcon
                style={{ width: pxToRem(12), height: pxToRem(12), marginRight: pxToRem(4) }}
              />
              <Typography variant={'Kor_12_r'}>배송기사</Typography>
            </Box>
          </Box>
        </Stack>
      )}
    </>
  );
});

export default DeliveryItems;
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
