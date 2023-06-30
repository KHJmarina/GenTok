// style
import { Box, Button, Checkbox, Stack, Typography, useTheme } from '@mui/material';
import { useStores } from 'src/models/root-store/root-store-context';
import { CallApiToStore } from 'src/utils/common';
import _, { isString } from 'lodash';
import { AnimatePresence } from 'framer-motion';
import { DropzoneOptions, DropEvent, FileRejection } from 'react-dropzone';
import 'yet-another-react-lightbox/styles.css';
import CHeader from 'src/components/CHeader';
import { HEADER } from 'src/config-global';
import { IOrderHistory } from 'src/models';
import InquiryOrderItem from './InquiryOrderItem';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { pxToRem } from 'src/theme/typography';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';
import OrderItemContent from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemContent';
import { toJS } from 'mobx';
import Iconify from 'src/components/iconify';
import IOrderItemContent from '../inquiry-view/IOrderItemContent';
/**
 * ## InquiryView 설명
 *
 */
interface Props {
  key?:any;
  data: any;
  select?: any;
}

/**
 * ## InquiryOrderHistory 설명
 *
 */
export const InquiryOrderHistoryItem = observer(({ key, data, select }: Props) => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore, marketStore } = rootStore;
  const theme = useTheme();

  const [check, setCheck] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectOrder, setSelectOrder] = useState({});
  const checkHandler = () => {
    setSelectOrder(data);
  };
  const sendSelectOrder = () => {
    select(selectOrder);
  };
  const makeDateFormat = (date: number) => {
    let tempDate = new Date(date);
    let year = tempDate.getFullYear();
    let month = ('0' + (1 + tempDate.getMonth())).slice(-2);
    let day = ('0' + tempDate.getDate()).slice(-2);

    return `${year}.${month}.${day}`;
  }; 

  useEffect(()=>{
    const temp: any = [];
    orderHistoryStore.orderHistorys.filter((t: any)=>{
      temp.push({ id: t.termsSid, checked: false, agrmntMustYn: t.agrmntMustYn, ver: t.ver })
    })
    setCheck(temp);
  },[])

  return (
    <>
      <Stack spacing={2.5} sx={{ borderBottom: 0,background: '#FFFFFF', pb:pxToRem(10), '&::-webkit-scrollbar': {display: 'none',},justifyContent: 'flex-start',}}>
      <Box sx={{ textAlign: 'left', bgcolor: '#fafafa', py:pxToRem(10), px: pxToRem(20), }}>
        <Typography sx={{ mr: 2 }} variant={'Kor_14_b'}>
          {makeDateFormat(data?.orderDt)}
        </Typography>
        <Typography variant={'Kor_12_r'} sx={{ color: '#9DA0A5' }}>
          {data?.orderNo}
        </Typography>
      </Box>
        <Stack sx={{alignItems:'center', px: pxToRem(20), pb: pxToRem(20), mx: pxToRem(20), display:'flex', flexDirection:'row', height:pxToRem(80) }}>
          <Box sx={{ width: pxToRem(20), height: pxToRem(20), mr: pxToRem(10) }}>
            <Checkbox
              icon={<Iconify icon={'gg:radio-check'} color={'#DFE0E2'}/>}
              checkedIcon={<Iconify icon={'mdi:record-circle'} />}
              sx={{ m: 0, p: 0 }}
              checked={
                check.length > 0 &&
                check.filter((c: any) => c.checked === true).length > 0
              }
              onClick={(e: any) => {
                if (e.nativeEvent.target.checked !== undefined) {
                  const temp: any = [];
                  check.map((t: any) =>
                  setCheck([{ ...t, checked: e.nativeEvent.target.checked }]),
                  );
                  checkHandler();
                }
              }}
              disableRipple
            />
          </Box>
          <Box sx={{ display: 'flex' }} borderRadius={2}>
            <OrderItemImage
              imgSrc={`${data?.goodsList[0]?.img1Path}`}
              listSize={Number(`${data?.goodsList.length}`)}
            />
            <IOrderItemContent order={data} />
          </Box>
        </Stack>
      </Stack>
    </>
  );
});

export default InquiryOrderHistoryItem;
