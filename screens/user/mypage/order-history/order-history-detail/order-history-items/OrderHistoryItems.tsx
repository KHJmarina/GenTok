import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../models/root-store/root-store-context';
import { useTheme, Stack, Divider, Typography, Card, Button } from '@mui/material';
import { ReactComponent as Lutein } from 'src/assets/images/lutein.svg';
import { ReactComponent as ArrowMore } from 'src/assets/icons/ico-arrow-more.svg';
import { ReactComponent as ReviewPointRelation } from 'src/assets/icons/review_point_relation.svg';
import { useNavigate } from 'react-router';
import { PATH_ROOT } from '../../../../../../routes/paths';
import { pxToRem } from 'src/theme/typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OrderHistoryDetailButtons from '../../order-history-buttons/OrderHistoryDetailButtons';
import SinglePurchaseItems from '../../order-history-items/order-items/single-purchase-items/SinglePurchaseItems';
import MultiplePurchaseItems from '../../order-history-items/order-items/multiple-purchase-items/MultiplePurchaseItems';
/**
 * ## OrderItems 설명
 *
 */
interface Props {
  type?: string;
}
export const OrderHistoryItems = observer(({ type }: Props) => {
  const rootStore = useStores();
  const { orderHistoryStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(()=> {
  }, [])

  return (
    <>
    
    {
      orderHistoryStore.orderHistorys.map((item, index)=>{
        if(item?.goodsList.length > 1){
          return <MultiplePurchaseItems key={index} data={item} />;
        } else if (item?.goodsList.length == 1){
          return <SinglePurchaseItems key={index} data={item} />;
        }
      })
    }  
       
    
    </>
  );
});

export default OrderHistoryItems;

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
};
const highlightCardButtonStyle = {
  border: '1px solid #FF7F3F',
  borderRadius: 500,
  color: '#FF7F3F',
  textAlign: 'center',
  height: 30,
};
