import Box from '@mui/material/Box';
import { Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import { PATH_ROOT } from '../../../../routes/paths';
import FirstOrderHistoryDetail from './order-history-detail/FirstOrderHistoryDetail';
import AdditionalOrderHistoryDetail from './order-history-detail/AdditionlOrderHistoryDetail';
import ArriveKitOrderHistoryDetail from './order-history-detail/ArrivedKitOrderHistoryDetail';
import DeliveredKitOrderHistoryDetail from './order-history-detail/DeliveredKitOrderHistoryDetail';
import ExchangedOrderHistoryDetail from './order-history-detail/ExchangedOrderHistoryDetail';
import ExchangingOrderHistoryDetail from './order-history-detail/ExchangingOrderHistoryDetail';
import MakingCandyOrderHistoryDetail from './order-history-detail/MakingCandyOrderHistoryDetail';
import MadeCandyOrderHistoryDetail from './order-history-detail/MadeCandyOrderHistoryDetail';
import ReadyOrderHistoryDetail from './order-history-detail/ReadyOrderHistoryDetail';
import RefundOrderHistoryDetail from './order-history-detail/RefundOrderHistoryDetail';
import RefundedOrderHistoryDetail from './order-history-detail/RefundedOrderHistoryDetail';
import ReturnRequestKitOrderHistoryDetail from './order-history-detail/ReturnRequestKitOrderHistoryDetail';
import CompleteReturnRequestKitOrderHistoryDetail from './order-history-detail/CompleteReturnRequestKitOrderHistoryDetail';
import ShippingKitOrderHistoryDetail from './order-history-detail/ShippingKitOrderHistoryDetail';
import CancelingOrderHistoryDetail from './order-history-detail/CancelingOrderHistoryDetail';
import CanceledOrderHistoryDetail from './order-history-detail/CanceledOrderHistoryDetail';
import DefaultOrderHistoryDetail from './order-history-detail/DefaultOrderHistoryDetail';
import { CallApiToStore } from 'src/utils/common';
import { toJS } from 'mobx';
import { IOrderHistory } from 'src/models/order-history/OrderHistory';
import { CHeader } from 'src/components/CHeader';
import { HEADER } from 'src/config-global';

/**
 * ## OrderHistoryDetail 설명
 *
 */
export const OrderHistoryDetail = observer(() => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { orderNo: orderNo } = useParams();
  const [render, setRender] = useState(false);

  const [orderHistoryDetail, setOrderHistoryDetail] = useState<IOrderHistory>();

  const renderOrderHistoryDetail = (
    orderStateCd: number,
    exchangeStateCd: number,
    cancelReqYn: boolean,
    takeBackYn: boolean,
  ) => {
    if (cancelReqYn && !takeBackYn) {
      /* 취소 중 */
      return <CancelingOrderHistoryDetail />;
    } else if (cancelReqYn && takeBackYn) {
      /* 반품 중 */
      return <RefundOrderHistoryDetail />;
    } else if (orderStateCd == 210114 && !takeBackYn) {
      /* 취소 완료 */
      return <CanceledOrderHistoryDetail />;
    } else if (orderStateCd == 210114 && takeBackYn) {
      /* 반품 완료 */
      return <RefundedOrderHistoryDetail />;
    } else if (orderStateCd == 210105 && exchangeStateCd == 210503) {
      /* 교환중 */
      return <ExchangingOrderHistoryDetail />;
    } else if (orderStateCd == 210106 && exchangeStateCd == 210505) {
      /* 교환 완료 */
      return <ExchangedOrderHistoryDetail />;
    } else {
      switch (orderStateCd) {
        /* 첫구매(결제 완료 / 인체유래물연구 비동의) */
        case 210103:
          return <FirstOrderHistoryDetail />;
        // case
        /* 추가구매(인체유래물연구 동의) - 결과 생성 완료와 동일*/
        // <AdditionalOrderHistoryDetail />
        /* 배송 준비중 (상품준비중)*/
        case 210104:
          return <ReadyOrderHistoryDetail />;

        /* 키트 배송중 (배송중) */
        case 210105:
          return <ShippingKitOrderHistoryDetail />;
        /* 키트 배송 완료 (배송완료)*/
        case 210106:
          return <DeliveredKitOrderHistoryDetail />;
        /* 키트 반송 신청 */
        // <ReturnRequestKitOrderHistoryDetail />

        /* 키트 반송 신청 완료 (반송요청)*/
        case 210107:
          return <CompleteReturnRequestKitOrderHistoryDetail />;

        /* 키트 도착(반송 이후) (반송완료) */
        case 210109:
          return <ArriveKitOrderHistoryDetail />;

        /* 결과 생성중(분석중)*/
        case 210111:
          return <MakingCandyOrderHistoryDetail />;

        /* 결과 생성완료 (분석완료) */
        case 210112:
          return <MadeCandyOrderHistoryDetail />;
        default:
          return <DefaultOrderHistoryDetail />;
      }
    }
  };

  useEffect(() => {
    const param = orderNo || '0';
    CallApiToStore(orderHistoryStore.getOrderHistoryDetail(param), 'api', loadingStore).then(() => {
      // console.log(toJS(orderHistoryStore.orderHistorys));
      setOrderHistoryDetail(
        orderHistoryStore.orderHistory ? orderHistoryStore.orderHistory : ({} as IOrderHistory),
      );
      setRender(true);
    });
  }, [orderNo]);

  const options: any = {
    showMainIcon: 'back',
    showHomeIcon: true,
    showCartIcon:true
  };

  return (
    <>
      {render && (
        <Stack pb={`${HEADER.H_MOBILE}px`}>
          <CHeader
            title={'주문 상세내역'}
            {...options}
          />

          {orderHistoryDetail &&
            renderOrderHistoryDetail(
              orderHistoryDetail?.orderStateCd?.code || 0,
              orderHistoryDetail?.exchangeStateCd?.code || 0,
              orderHistoryDetail?.cancelReqYn || false,
              orderHistoryDetail?.takeBackYn || false,
            )}
        </Stack>
      )}
    </>
  );
});

export default OrderHistoryDetail;
