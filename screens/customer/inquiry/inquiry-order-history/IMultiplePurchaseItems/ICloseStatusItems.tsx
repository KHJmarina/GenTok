import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTheme, Stack, Divider, Typography, Card, Button, Checkbox } from '@mui/material';
import { ReactComponent as ArrowMore } from 'src/assets/icons/ico-arrow-more.svg';
import { useNavigate } from 'react-router';
import { pxToRem } from 'src/theme/typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { numberComma } from 'src/utils/common';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';
import { getOrderStateValue } from 'src/models';
import OrderItemContent from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemContent';
import { makeStyles } from '@material-ui/core/styles';
import { PATH_ROOT } from 'src/routes/paths';
import OrderHistoryDetailButtons from 'src/screens/user/mypage/order-history/order-history-buttons/OrderHistoryDetailButtons';
import Iconify from 'src/components/iconify';
/**
 * ## CloseStatusItems 설명
 *
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
  handleClick: () => void;
  isOpen?: any;
}
export const ICloseStatusItems = observer(({ data, handleClick, isOpen }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();

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
            pt: 2.5,
            px: 2.5,
            pb: 0,
            // bgcolor: '#999999',
          }}
        >
          <Box sx={{ width: pxToRem(20), height: pxToRem(20), mr: pxToRem(10) }}>
            <Checkbox
              icon={
                <Iconify icon={'material-symbols:check-circle-outline-rounded'} color={'#DFE0E2'} />
              }
              checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
              sx={{ m: 0, p: 0 }}
              // checked={goods.checkYn}
              onClick={() => {
                // checkGoods(goods, !goods.checkYn);
              }}
              disableRipple
              // disabled={marketStore.cartStore.isPending}
            />
          </Box>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{
              width: '100%',
              pb: pxToRem(16),
              cursor: 'pointer',
            }}
            onClick={() => navigate(`${PATH_ROOT.user.mypage.orderHistoryDetail}/${data.orderNo}`)}
          >
            <Typography
              variant="Kor_18_b"
              color={theme.palette.primary.main}
              // onClick={() => navigate(`${PATH_ROOT.user.mypage.orderHistoryDetail}/${data.orderNo}`)}
            >
              {/* {data.orderStateCd?.value} */}
              {getOrderStateValue(
                data.orderStateCd?.code,
                data.orderStateCd?.value,
                data.exchangeStateCd?.code,
                data.cancelReqYn,
                data.takeBackYn,
              )}
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
                  fill: theme.palette.primary.main,
                },
              }}
              // onClick={() =>
              //   navigate(`${PATH_ROOT.user.mypage.orderHistoryDetail}/${data.orderNo}`)
              // }
            >
              <ArrowMore
                fill="#DFE0E2"
                // className={classes.icon}
              />
            </Button>
          </Stack>
          <Stack direction={'row'} sx={{ mb: pxToRem(16) }}>
            <Box sx={{ display: 'flex' }} borderRadius={2}>
              <Box>
                <OrderItemImage
                  getImageSrc={data.goodsList[0].img1Path}
                  listSize={Number(`${data.goodsList.length}`)}
                />
              </Box>
              {/* <OrderItemContent data={data} /> */}

              <Stack
                direction={'column'}
                sx={{
                  alignItems: 'flex-start',
                  // justifyContent: 'center',
                  justifyContent: 'flex-start',
                  ml: pxToRem(10),
                  // height: 90,
                  width: '100%',
                  paddingTop: pxToRem(8),
                  textAlign: 'left',
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
                  <Box sx={{ display: 'flex' }}>
                    <Typography
                      variant={'Kor_18_r'}
                      display={'inline'}
                      sx={{
                        color: '#202123',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        maxWidth: '45%',
                      }}
                    >
                      {data.goodsList[0].goodsNm} &nbsp;
                    </Typography>
                    <Typography variant={'Kor_18_r'}>포함</Typography>
                    <Typography variant={'Kor_18_r'} sx={{ color: theme.palette.primary.main }}>
                      &nbsp;[총 {data.goodsList.length}개]
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="subtitle2">
                  {numberComma(Number(data.paymentAmt))}
                  {data.goodsList[0].currencyCd.value || '원'}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Box sx={{ px: 2.5, pb: 2.5 }}>
            <OrderHistoryDetailButtons
              orderStateCd={data.orderStateCd?.code || 0}
              exchangeStateCd={data.exchangeStateCd?.code || 0}
              cancelReqYn={data.cancelReqYn}
              takeBackYn={data.takeBackYn}
              orderNo={data.orderNo}
              dlivryYn={data.dlivryYn}
              goodsListLength={data.goodsList.length || 0}
            />
          </Box>
          <Divider sx={{ border: '1px dashed #EEEEEE' }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: pxToRem(13),
              cursor: 'pointer',
            }}
            onClick={handleClick}
          >
            <Typography variant={'Kor_14_b'}>
              총 &nbsp;
              <span style={{ color: theme.palette.primary.main }}>
                {data.goodsList.length}건 &nbsp;
              </span>
              전체보기
            </Typography>
            <KeyboardArrowDownIcon />
          </Box>
        </Box>
      </Card>
    </>
  );
});

export default ICloseStatusItems;
