import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../models/root-store/root-store-context';
import { useTheme, Stack, Divider, Typography, Card, Button } from '@mui/material';
import { ReactComponent as Lutein } from 'src/assets/images/lutein.svg';
import { ReactComponent as ArrowMore } from 'src/assets/icons/ico-arrow-more.svg';
import { ReactComponent as ReviewPointRelation } from 'src/assets/icons/review_point_relation.svg';
import { useNavigate } from 'react-router';
import { PATH_ROOT } from '../../../../../../../routes/paths';
import { pxToRem } from 'src/theme/typography';
import Image from 'src/components/image/Image';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OrderHistoryDetailButtons from '../../../order-history-buttons/OrderHistoryDetailButtons';
import { getImagePath, numberComma } from 'src/utils/common';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';
import { getOrderStateValue } from 'src/models';
import { makeStyles } from '@material-ui/core/styles';
import { toJS } from 'mobx'
/**
 * ## SinglePurchaseItems 설명
 * 단일 구매
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
}

export const SinglePurchaseItems = observer(({ data }: Props) => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();
  const makeDateFormat = (date: number)=>{
    let tempDate = new Date(date);
    let year = tempDate.getFullYear();
    let month = ("0" + (1 + tempDate.getMonth())).slice(-2);
    let day = ("0" + tempDate.getDate()).slice(-2);

    return `${year}.${month}.${day}`;
  }

  useEffect(() => {
    // console.log( data.goodsList, ": ", toJS(data.exchangeStateCd))  
    // console.log( data.goodsList, ": ", toJS(data.orderStateCd))  
  },[data.purchsConfirmYn])
  
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
            p: 2.5,
          }}
        >
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{
              width: '100%',
              pb: pxToRem(16),
              cursor:'pointer',
              textAlign:'left'
            }}
            onClick={() =>
              navigate(`${PATH_ROOT.user.mypage.orderHistoryDetail}/${data.orderNo}`)
            }
          >
            <Typography
              variant='Kor_18_b'
              color={theme.palette.primary.main}
              // onClick={() =>
              //   navigate(`${PATH_ROOT.user.mypage.orderHistoryDetail}/${data.orderNo}`)
              // }
            >
              {/* {data.orderStateCd?.value} */}
              {getOrderStateValue(data.orderStateCd?.code, data.orderStateCd?.value, data.exchangeStateCd?.code, data.cancelReqYn, data.takeBackYn)}
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
                  // color: '#red',
                  fill:theme.palette.primary.main
              },
              }}
              // onClick={() => navigate(`${PATH_ROOT.user.mypage.orderHistoryDetail}/${data.orderNo}`)}
            >
              <ArrowMore 
                fill='#DFE0E2'
                // className={classes.icon}
              />
            </Button>
          </Stack>
          <Stack direction={'row'} alignItems={'center'}>
            <OrderItemImage 
              getImageSrc={data.goodsList[0].img1Path} 
              listSize={Number(`${data.goodsList.length}`)}
            />

            <Stack
              direction={'column'}
              sx={{
                alignItems: 'flex-start',
                justifyContent: 'center',
                ml: pxToRem(10),
                // height: 90,
                // width: '100%',
                width: '66%',
                textAlign: 'left'
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#9DA0A5',
                }}
              >
                {makeDateFormat(data.orderDt)}
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
                  {data.goodsList[0].goodsNm}
                </Typography>
              </Stack>
              <Typography variant="subtitle2">
                {numberComma(Number(data.paymentAmt))}
                {data.goodsList[0].currencyCd.value || '원'}
              </Typography>
            </Stack>
          </Stack>
          
          <OrderHistoryDetailButtons 
            orderStateCd ={data.orderStateCd?.code || 0}
            exchangeStateCd ={data.exchangeStateCd}
            cancelReqYn ={data.cancelReqYn}
            takeBackYn= {data.takeBackYn}
            orderNo = {data.orderNo}
            dlivryYn={data.dlivryYn}
            goodsListLength={data.goodsList.length || 0}
            goodsList={data.goodsList}
            purchsConfirmYn={data.purchsConfirmYn}
          />
        </Box>
      </Card>
    </>
  );
});

export default SinglePurchaseItems;
