import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTheme, Stack, Divider, Typography, Checkbox } from '@mui/material';
import { ReactComponent as Lutein } from 'src/assets/images/lutein.svg';
import { ReactComponent as ArrowMore } from 'src/assets/icons/ico-arrow-more.svg';
import { ReactComponent as ReviewPointRelation } from 'src/assets/icons/review_point_relation.svg';
import { useNavigate } from 'react-router';
import { useStores } from 'src/models';
import IMultiplePurchaseItems from './IMultiplePurchaseItems/IMultiplePurchaseItems';
import ISinglePurchaseItems from './ISinglePurchaseItems/ISinglePurchaseItems';
import { toJS } from 'mobx';
import { pxToRem } from 'src/theme/typography';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image/Image';
import { CallApiToStore, getImagePath, numberComma } from 'src/utils/common';
import CloseIcon from '@mui/icons-material/Close';
import ICloseStatusItems from './IMultiplePurchaseItems/ICloseStatusItems';
import IOpenStatusItems from './IMultiplePurchaseItems/IOpenStatusItems';
/**
 * ## OrderItems 설명
 *
 */
interface Props {
  type?: string;
}
export const InquiryOrderItem = observer(({ type }: Props) => {
  const rootStore = useStores();
  const { orderHistoryStore, marketStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [checkCnt, setCheckCnt] = useState(0);
  const [allCheck, setAllCheck] = useState(false);
  const [goodsSid, setGoodsSid] = useState(0);
  const [call, setCall] = useState('');
  const [totalCnt, setTotalCnt] = useState(0);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const checkGoods = (goods: any, check: boolean) => {
    // let cngGoodsAmt = marketStore.cartStore.payment.cngGoodsAmt; // 체크 박스 선택 후 총 상품 금액
    // let cngDscntAmt = marketStore.cartStore.payment.cngDscntAmt; // 체크 박스 선택 후 할인금액

    // if (check) {
    //   cngGoodsAmt = cngGoodsAmt + goods.price!;
    //   cngDscntAmt = cngDscntAmt + (goods.price! - goods.goodsAmt!);
    // } else {
    //   cngGoodsAmt = cngGoodsAmt - goods.price!;
    //   cngDscntAmt = cngDscntAmt - (goods.price! - goods.goodsAmt!);
    // }

    // marketStore.cartStore.payment.setProps({
    //   cngGoodsAmt: cngGoodsAmt,
    //   cngDscntAmt: cngDscntAmt,
    // });

    goods.setProps({ checkYn: check });
    const checkList = marketStore.cartStore.list.filter((goods) => goods.checkYn === false);
    setAllCheck(checkList.length > 0 ? false : true);
    setCheckCnt(marketStore.cartStore.list.length - checkList.length);

    if (goods.goodsSid === marketStore.cartStore.recentGoodsSid) {
      marketStore.cartStore.updateRecentGoodsSid(0);
    }
  };

  return (
    <>
      {orderHistoryStore.orderHistorys.map((item, index) => {
        if (item?.goodsList.length > 1) {
          return <IMultiplePurchaseItems key={index} data={item} />;
        } else if (item?.goodsList.length == 1) {
          return <ISinglePurchaseItems key={index} data={item} />;
        }
      })}
    </>
  );
});

export default InquiryOrderItem;
