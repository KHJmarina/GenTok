import Box from '@mui/material/Box';
import {
  Stack,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Button,
  List,
  ListItem,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { PATH_ROOT } from '../../../../../routes/paths';
import { pxToRem } from 'src/theme/typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CallApiToStore, getImagePath, numberComma } from 'src/utils/common';
import Image from 'src/components/image/Image';
import { IOrderHistory } from 'src/models/order-history/OrderHistory';
import OrderItemImage from '../order-history-detail/order-history-items/OrderItemImage';
import OrderItemContent from '../order-history-detail/order-history-items/OrderItemContent';
import { CHeader } from 'src/components/CHeader';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import { ReactComponent as IcoArrowUp } from 'src/assets/icons/ico-menu-arrow-up.svg';
import { ReactComponent as IcoArrowDown } from 'src/assets/icons/ico-menu-arrow-down.svg';
import { HEADER } from 'src/config-global';
import { toJS } from 'mobx';
import CAlert from 'src/components/CAlert';

/**
 * ## KitReturnRequest 설명
 *
 */
export const KitReturnRequest = observer(() => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore, addressStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { orderNo: orderNo } = useParams();

  const [orderHistoryDetail, setOrderHistoryDetail] = useState<IOrderHistory>();

  const [open, setOpen] = useState<boolean>(true);
  const [expandNotice, setExpandNotice] = useState<boolean>(true);

  const [paramAddr, setParamAddr] = useState<any>();
  const [isRender, setIsRender] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleAddress = () => {
    navigate(PATH_ROOT.market.address, { state: { from: 'order-history-return' } });
  };

  const btnRequestSampleReturn = () => {
    const orderNo = orderHistoryStore.orderHistory?.orderNo
      ? orderHistoryStore.orderHistory?.orderNo
      : '';
    const param = {
      returnRcipntNm: paramAddr.returnRcipntNm,
      returnPhoneNo: paramAddr.returnPhoneNo,
      returnZoneCd: paramAddr.returnZoneCd,
      returnAddr: paramAddr.returnAddr,
    };
    CallApiToStore(orderHistoryStore.requestSampleReturn(orderNo, param), 'api', loadingStore).then(
      () => {
        navigate(PATH_ROOT.user.mypage.kitReturnResult, {
          replace: true,
          state: {
            orderNo: orderHistoryStore.orderHistory?.orderNo,
            rcipntNm: param.returnRcipntNm,
            phoneNo: param.returnPhoneNo,
            addr: param.returnAddr,
            zoneCd: param.returnZoneCd,
          },
        });
      },
    ).catch((e) => {
      setAlertOpen(true);
    })
  };

  useEffect(() => {
    const param = orderNo || '0';
    CallApiToStore(orderHistoryStore.getOrderHistoryDetail(param), 'api', loadingStore).then(() => {
      setOrderHistoryDetail(
        orderHistoryStore.orderHistory ? orderHistoryStore.orderHistory : ({} as IOrderHistory),
      );
      setIsRender(true);
      setParamAddr({
        returnRcipntNm: addressStore.tempAddr?.rcipntNm
          ? addressStore.tempAddr?.rcipntNm
          : orderHistoryStore.orderHistory?.rcipntNm,
        returnPhoneNo:
          addressStore.tempAddr.phoneNo && addressStore.tempAddr.phonePrefix
            ? `${addressStore.tempAddr.phonePrefix}-${addressStore.tempAddr.phoneNo}`
            : orderHistoryStore.orderHistory?.phoneNo,
        returnZoneCd: addressStore.tempAddr.zone
          ? addressStore.tempAddr.zone
          : orderHistoryStore.orderHistory?.zoneCd,
        returnAddr: addressStore.tempAddr.addr
          ? addressStore.tempAddr.addr
          : orderHistoryStore.orderHistory?.addr,
      });
    });
  }, [orderNo]);

  const options: any = {
    showMainIcon: 'back',
  };

  return (
    <>
      {isRender && (
        <Stack sx={{ height: '100%', pb: `${HEADER.H_MOBILE}px` }}>
        <CHeader
            title="키트 반송 요청"
            {...options}
          />
          <Stack sx={{ mb: 8, mt: pxToRem(30) }}>
            <Stack
              direction={'row'}
              width="100%"
              justifyContent="space-between"
              sx={{ mb: pxToRem(16), px: pxToRem(20) }}
            >
              {orderHistoryDetail && (
                <Box sx={{ display: 'flex' }} borderRadius={2}>
                  <OrderItemImage
                    imgSrc={`${orderHistoryStore.orderHistory?.goodsList[0]?.img1Path}`}
                    listSize={Number(`${orderHistoryStore.orderHistory?.goodsList.length}`)}
                  />

                  <OrderItemContent data={orderHistoryStore.orderHistory} />
                </Box>
              )}
            </Stack>
            <Divider />
            <Accordion
              defaultExpanded={true}
              sx={{
                mt: `0 !important`,
                '&.MuiAccordion-root.Mui-expanded': {
                  boxShadow: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.action.disabled }} />}
                sx={{ mx: pxToRem(20), px: 0, py: 0, my: 0 }}
                // className={classes.deliveryInfo}
              >
                <Typography variant={'Kor_18_b'}>반송지 정보</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ mx: pxToRem(20), mt: pxToRem(16), p: 0 }}>
                <Stack>
                  <Box sx={{ textAlign: 'left', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant={'Kor_16_b'}
                        sx={{ fontSize: theme.typography.pxToRem(14), mb: 0.5 }}
                      >
                        {paramAddr?.returnRcipntNm}
                      </Typography>
                      <Box
                        sx={{
                          color: '#FF7F3F',
                          fontSize: theme.typography.pxToRem(12),
                          fontWeight: 600,
                          textDecoration: 'underline',
                          ml: 'auto',
                        }}
                        onClick={() => {
                          handleAddress();
                        }}
                      >
                        반송지 변경
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: theme.typography.pxToRem(14), mb: 0.5 }}>
                      {paramAddr?.returnPhoneNo}
                    </Typography>
                    <Typography sx={{ fontSize: theme.typography.pxToRem(14) }}>
                      {paramAddr?.returnAddr}
                    </Typography>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Divider />
            <Box
              sx={{ px: pxToRem(20), textAlign: 'left', mt: pxToRem(16) }}
              onClick={() => {
                setExpandNotice(!expandNotice);
              }}
            >
              <Typography variant={'Kor_12_b'} color={'#5D6066'} sx={{ my: pxToRem(16) }}>
                주의사항
              </Typography>
              {expandNotice == true ? (
                <>
                  <List
                    sx={{
                      listStyleType: 'disc',
                      pl: '1.25rem',
                      color: '#9DA0A5',
                      fontSize: pxToRem(12),
                    }}
                  >
                    <ListItem sx={{ display: 'list-item', p: 0, mb: '0.5rem' }}>
                      <Typography variant={'Kor_12_r'}>
                        키트 수령일로부터 최대 2주 이내 반송을 권장합니다. 다만, 반송기간 초과에
                        따른 서비스 자동취소과 같은 패널티는 없습니다.
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', p: 0 }}>
                      <Typography variant={'Kor_12_r'}>
                        (참고) 택배사별 운송장 번호 보관기간이 상이함. CJ대한통운 최대 3개월 이내
                        반송 가능. 우체국택배 최대 12개월 이내 반송 가능. 단, 계약 택배 유지되는
                        경우에 한함.
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', p: 0 }}>
                      <Typography variant={'Kor_12_r'}>
                        택배사 제한: 퀵, 특송으로 반송한 경우, 고객에게 왕복 비용 과금 청구가
                        불가하기에 수령 받지 않고 고객께 즉시 반송 처리됩니다. (반드시 고지 필요)
                      </Typography>
                    </ListItem>
                  </List>
                  <Typography
                    variant={'Kor_12_r'}
                    sx={{
                      color: '#9DA0A5',
                      mb: pxToRem(16),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    주의사항 접기 <IcoArrowUp />
                  </Typography>
                </>
              ) : (
                <Typography
                  variant={'Kor_12_r'}
                  sx={{
                    color: '#9DA0A5',
                    mb: pxToRem(16),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  주의사항 더보기 <IcoArrowDown />
                </Typography>
              )}
            </Box>

            <Button
              variant="outlined"
              size={'large'}
              sx={{
                width: '100%',
                borderRadius: '2rem 2rem 0 0 !important',
                position: 'fixed',
                bottom: 0,
                left: 0,
                border: 'none',
                boxShadow: 20,
                height: '60px',
                fontSize: '1.1rem',
                fontWeight: 600,
                backgroundColor: 'white',
                '&:hover': {
                  border: 'none',
                  boxShadow: 20,
                },
              }}
              onClick={() => {
                btnRequestSampleReturn();
              }}
            >
              신청하기
            </Button>
          </Stack>
        </Stack>
      )}
      
      {alertOpen && (
        <CAlert
          isAlertOpen={alertOpen}
          alertCategory={'f2d'}
          alertTitle={'키트 반송 신청에 실패했습니다.'}
          hasCancelButton={false}
          hasXbutton={false}
          handleAlertClose={() => {
            setAlertOpen(false);
            navigate(-1);
          }}
          callBack={() => {
            navigate(-1);
          }}
        />
      )}
    </>
  );
});

export default KitReturnRequest;

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
