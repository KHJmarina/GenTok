// style
import { Box, Button, Card, Checkbox, Stack, Typography, useTheme } from '@mui/material';
import { useStores } from 'src/models/root-store/root-store-context';
import { CallApiToStore, numberComma } from 'src/utils/common';
import 'yet-another-react-lightbox/styles.css';
import CHeader from 'src/components/CHeader';
import { HEADER } from 'src/config-global';
import { getOrderStateValue } from 'src/models';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { pxToRem } from 'src/theme/typography';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';
import OrderItemContent from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemContent';
import { toJS } from 'mobx';
import Iconify from 'src/components/iconify';
import { PATH_ROOT } from 'src/routes/paths';
import { ReactComponent as ArrowMore } from 'src/assets/icons/ico-arrow-more.svg';
import { useNavigate } from 'react-router';
/**
 * ## InquiryView 설명
 *
 */
interface Props {
  handleClose: VoidFunction;
  data: any;
  select?: any;
}

/**
 * ## InquiryOrderHistory 설명
 *
 */
export const InquiryOrderHistorySingle = observer(({ handleClose, data, select }: Props) => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore, marketStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [check, setCheck] = useState(false);
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

  return (
    <>
      <Stack spacing={2.5} sx={{ overflowY: 'auto', width:'100%', pb:pxToRem(10),}}>
        <Box sx={{ textAlign: 'left', bgcolor: '#fafafa', py:pxToRem(10), px: pxToRem(20), }}>
          <Typography sx={{ mr: 2 }} variant={'Kor_14_b'}>
            {makeDateFormat(data?.orderDt)}
          </Typography>
          <Typography variant={'Kor_12_r'} sx={{ color: '#9DA0A5' }}>
            {data?.orderNo}
          </Typography>
        </Box>
        <Stack sx={{alignItems:'center', px: pxToRem(20), pb: pxToRem(20), mx: pxToRem(20), display:'flex', flexDirection:'row' }}>
          <Box sx={{ width: pxToRem(20), height: pxToRem(20), mr: pxToRem(10) }}>
            <Checkbox
                icon={<Iconify icon={'gg:radio-check'} color={'#DFE0E2'}/>}
                checkedIcon={<Iconify icon={'mdi:record-circle'} />}
                sx={{ m: 0, p: 0 }}
                checked={!!check}
                onClick={(e: any) => {
                  if (e.nativeEvent.target.checked !== undefined) {
                    setCheck(e.nativeEvent.target.checked);
                    checkHandler();
                  }
                }}
                disableRipple
              />
          </Box>

          <Stack direction={'row'} alignItems={'center'}>
            {/* 상품이미지 */}
            <OrderItemImage
              getImageSrc={data.goodsList[0].img1Path}
              listSize={Number(`${data.goodsList.length}`)}
            />
          {/* 상품명 & 가격 */}
            <Stack direction={'column'} sx={{alignItems: 'flex-start',justifyContent: 'center',ml: pxToRem(10),width: '66%',textAlign: 'left'}}>
              <Stack direction={'row'} width="100%">
                <Typography
                  variant={'Kor_16_b'}
                  display={'inline'}
                  sx={{color: '#202123',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis',}}>
                  {data.goodsList[0].goodsNm}
                </Typography>
              </Stack>
              <Typography variant="Kor_12_r">
                {numberComma(Number(data.paymentAmt))}
                {data.goodsList[0].currencyCd.value || '원'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        </Stack>
    </>
  );
});

export default InquiryOrderHistorySingle;
