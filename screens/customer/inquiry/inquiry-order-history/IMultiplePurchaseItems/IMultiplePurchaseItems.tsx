import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTheme, Stack, Divider, Typography, Card, Button } from '@mui/material';
import { ReactComponent as Lutein } from 'src/assets/images/lutein.svg';
import { ReactComponent as ArrowMore } from 'src/assets/icons/ico-arrow-more.svg';
import { ReactComponent as ReviewPointRelation } from 'src/assets/icons/review_point_relation.svg';
import { useNavigate } from 'react-router';
import Image from 'src/components/image/Image';
import { pxToRem } from 'src/theme/typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { OrderHistoryStore, useStores } from 'src/models';
import { getImagePath, numberComma } from 'src/utils/common';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';
import { toJS } from 'mobx';
import ICloseStatusItems from './ICloseStatusItems';
import IOpenStatusItems from './IOpenStatusItems';
/**
 * ## MultiplePurcahseItems 설명
 *
 */
interface Props {
  data?: any;
}
export const IMultiplePurchaseItems = observer(({ data }: Props) => {
  const rootStore = useStores();
  const { myReviewStore, orderHistoryStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  // const navigate = useNavigate();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [testResultDialogOpen, setTestResultDialogOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const makeDateFormat = (date: number) => {
    let tempDate = new Date(date);
    let year = tempDate.getFullYear();
    let month = ('0' + (1 + tempDate.getMonth())).slice(-2);
    let day = ('0' + tempDate.getDate()).slice(-2);
    return `${year}.${month}.${day}`;
  };

  useEffect(() => {}, []);

  return (
    <>
      {isOpen == false ? (
        <ICloseStatusItems data={data} isOpen={isOpen} handleClick={handleClick} />
      ) : (
        <IOpenStatusItems data={data} isOpen={isOpen} handleClick={handleClick} />
      )}
    </>
  );
});
export default IMultiplePurchaseItems;

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
};
