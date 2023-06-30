import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../models/root-store/root-store-context';
import {
  useTheme,
  Stack,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Divider,
} from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';
import { CallApiToStore } from 'src/utils/common';
import { toJS } from 'mobx';
import { IDeliveryTracking } from 'src/models';
/**
 * ## DeliveryStatus 설명
 *
 */

export const DeliveryStatus = observer(() => {
  const rootStore = useStores();
  const { deliveryTrackingStore, loadingStore } = rootStore;
  const theme = useTheme();
  // const classes = useStyles();

  const { orderNo: orderNo } = useParams();
  const [deliveryTracking, setDeliveryTracking] = useState<IDeliveryTracking>();
  
  const getDeliveryData = (param : string) => {
    CallApiToStore(deliveryTrackingStore.getDeliveryStatus(param), 'api', loadingStore).then(() => {
      // console.log("toJS : " , toJS(deliveryTrackingStore.deliveryTracking));
      setDeliveryTracking(deliveryTrackingStore.deliveryTracking ? deliveryTrackingStore.deliveryTracking : {} as IDeliveryTracking)
    });
  }
  
  useEffect(() => {
    // setDliveryNo(orderHistoryStore.orderHistory?.dlivryNo!);
    // console.log(dliveryNo);  
    const param = orderNo || '0'
    getDeliveryData(param);
  },[orderNo])
  

  return (
    <>
      <Stack sx={{ mx: pxToRem(20), mb:pxToRem(20), alignItems: 'center' }}>
        {/* <TableContainer component={Paper}> */}
          <Table size="small" sx={{ textAlign: 'center' }} >
            <TableHead>
              <TableRow sx={tableRowStyle}>
                <TableCell sx={tableCellStyle}>처리 일시</TableCell>
                <TableCell sx={tableCellStyle}>현재 위치</TableCell>
                <TableCell sx={tableCellStyle}>상태</TableCell>
              </TableRow>
            </TableHead>
            
            {deliveryTrackingStore.deliveryTracking?.progress.slice().reverse().map((deliveryData: any, index: number) => {
              return (
                <TableBody key={index}>
                  <TableRow sx={tableRowStyle}>
                    <TableCell sx={cellFontStyle}>
                      <Typography variant={'Kor_12_r'} sx={ index === 0 ?recentTextStype : basicTextStyle }>
                        {moment(deliveryData?.locDt).format('MM/DD(dd) h:mm')}
                      </Typography>
                    </TableCell>
                    <TableCell sx={cellFontStyle}>
                      <Typography variant={'Kor_12_r'} sx={ index === 0 ?recentTextStype : basicTextStyle }>
                        {deliveryData?.locNm}
                      </Typography>
                    </TableCell>
                    <TableCell sx={cellFontStyle}>
                      <Typography variant={'Kor_12_r'} sx={ index === 0 ? statusTextStyle :basicTextStyle }>
                        {deliveryData?.state} 
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
          </Table>
        {/* </TableContainer> */}
      </Stack>
    </>
  );
});

export default DeliveryStatus;

const basicTextStyle ={
  color : '#9DA0A5'
}

const statusTextStyle ={
  color : '#FF7F3F'
}

const recentTextStype = {
  color: '#202123'
}


const tableRowStyle = {
  borderBottom: '1px solid #EEEEEE',
  borderTop: '1px solid #EEEEEE',
};

const tableCellStyle = {
  backgroundColor: '#FFFFFF',
  color: '#202123',
  fontWeight:400,
  fontSize:pxToRem(12),
  textAlign: 'center'
};

const cellFontStyle = {
  fontWeight:400,
  fontSize:pxToRem(12),
  color: '#9DA0A5',
  textAlign: 'center'
}
