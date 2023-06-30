import {
  Box,
  Divider,
  FormControl,
  MenuItem,
  Typography,
  Stack,
  Button,
  alpha,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { CHeader } from 'src/components/CHeader';
import { useNavigate } from 'react-router-dom';
import { pxToRem } from 'src/theme/typography';
import { CallApiToStore } from 'src/utils/common';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CustomTextField } from 'src/components/custom-input';
import { numberComma } from 'src/utils/common';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';
import { PATH_ROOT } from 'src/routes/paths';
import { HEADER } from 'src/config-global';
import CAlert from 'src/components/CAlert';

/**
 * ## OrderCancel 설명
 *
 */

export const OrderCancel = observer(() => {
  const rootStore = useStores();
  const { loadingStore, codeStore, orderHistoryStore, responseStore } = rootStore;
  const theme = useTheme();
  const [cancelReasonCd, setCancelReasonCd] = useState<any>('none');
  const [cancelReason, setCancelReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const navigate = useNavigate();

  const handleCancelReasonCd = (event: SelectChangeEvent) => {
    setCancelReasonCd(Number(event.target.value));
  };

  const onChangeInput = (e: any) => {
    setCancelReason(e.target.value);
  };

  const onSubmit = async () => {
    const orderNo = orderHistoryStore.orderHistory?.orderNo!;
    await CallApiToStore(
      orderHistoryStore.orderCancel(orderNo, cancelReasonCd, cancelReason),
      'api',
      loadingStore,
    )
      .then(() => {
        if (responseStore.responseInfo.resultCode === 'S') {
          navigate(PATH_ROOT.user.mypage.orderCancelResult);
        } else {
          setErrorMsg(responseStore.responseInfo.errorMessage || '');
          setIsAlertOpen(true);
          window.history.pushState(null,'',window.location.href);
        }
      })
      .catch((e) => {});
  };

  const getCode = async () => {
    await CallApiToStore(codeStore.getGlobalGroupCode(900503), 'api', loadingStore)
      .then(() => {})
      .catch((e) => {});
  };

  useEffect(() => {
    getCode();
    
    window.addEventListener('popstate', () => {
      setIsAlertOpen(false);
    })
  }, [codeStore]);

  const options: any = {
    showMainIcon: 'none',
    showXIcon: true
  };

  return (
    <>
      <Stack sx={{ height: '100%', pb: `${HEADER.H_MOBILE}px` }}>
        <CHeader
          title="주문취소"
          {...options}
        />

        <Stack direction={'row'} sx={{ mx: pxToRem(20), mt: pxToRem(30), mb: pxToRem(20) }}>
          <OrderItemImage
            imgSrc={`${orderHistoryStore.orderHistory?.goodsList[0]?.img1Path}`}
            listSize={Number(`${orderHistoryStore.orderHistory?.goodsList.length}`)}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              ml: pxToRem(20),
              mt: pxToRem(10)
            }}
          >
            <Typography variant="Kor_18_b">
              {orderHistoryStore.orderHistory?.goodsList[0]?.goodsNm!}
              {orderHistoryStore.orderHistory?.goodsList.length! > 1 ? (
                <span style={{ fontSize: pxToRem(18), fontWeight: 600 }}>
                  포함 &nbsp;
                  <span
                    style={{
                      color: theme.palette.primary.main,
                      fontSize: pxToRem(18),
                      fontWeight: 600,
                    }}
                  >
                    [총 {orderHistoryStore.orderHistory?.goodsList.length}개]
                  </span>
                </span>
              ) : null}
            </Typography>
            <Typography variant="Kor_14_b">
              {numberComma(Number(orderHistoryStore.orderHistory?.paymentAmt))}
              {orderHistoryStore.orderHistory?.currencyCd?.value}
            </Typography>
            <Typography variant="Kor_14_r">결제 완료</Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: pxToRem(16), mt: pxToRem(16) }} />

        <Stack sx={{ mx: pxToRem(20) }}>
          <Typography variant="Kor_18_b" sx={{ textAlign: 'left', mb: pxToRem(16) }}>
            취소 사유
          </Typography>
          <FormControl>
            <Select
              name={'cancelReasonCd'}
              id="demo-simple-select"
              value={cancelReasonCd}
              onChange={handleCancelReasonCd}
              sx={{
                maxHeight: 44,
                textAlign: 'left',
              }}
            >
              <MenuItem disabled value={'none'}>
                선택하세요
              </MenuItem>
              {codeStore.codeGroup.map((option) => (
                <MenuItem key={option.groupCdSid} value={option.groupCdSid}>
                  {option.groupCdNm}
                </MenuItem>
              ))}
            </Select>

            {cancelReasonCd === 14 && (
              <Stack sx={{ display: 'flex', flexDirection: 'column', position: 'relative', my: 2 }}>
                <CustomTextField
                  id="outlined-textarea"
                  placeholder="상세 사유를 입력하세요. (최소 10자이상)"
                  sx={{
                    minHeight: 150,
                    '& .MuiOutlinedInput-root': {
                      border:
                        cancelReason.length === 0
                          ? `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`
                          : 'solid 1px #FF7F3F',
                    },
                    '& .MuiInputBase-root': { p: 0, fontSize: theme.typography.pxToRem(14) },
                    '& .MuiInputBase-input': { p: 1 },
                  }}
                  rows={7}
                  onChange={onChangeInput}
                  value={cancelReason}
                  multiline
                />
                <Box
                  sx={{
                    display: 'flex',
                    position: 'absolute',
                    bottom: '5%',
                    right: '3%',
                    fontWeight: theme.typography.fontWeightRegular,
                    ml: 'auto',
                  }}
                >
                  <Typography sx={{ color: cancelReason.length === 0 ? '#DFE0E2' : '#202123' }}>
                    {' '}
                    {cancelReason.length}&nbsp;{' '}
                  </Typography>
                  <Typography sx={{ color: '#DFE0E2' }}> / 5,000 </Typography>
                </Box>
              </Stack>
            )}
          </FormControl>
        </Stack>

        <Stack sx={{ mx: pxToRem(20), mt: 'auto' }}>
          <Button
            id={'btn-order-cancel-requestCancel'}
            disabled={
              cancelReasonCd == 'none' || (cancelReasonCd === 14 && cancelReason.length < 10)
            }
            variant={'contained'}
            size={'large'}
            type={'submit'}
            sx={{ borderRadius: 5, mt: 5,'&:hover':{ background:'#FF5D0C !important' }  }}
            onClick={() => {
              onSubmit();
            }}
          >
            신청하기
          </Button>
        </Stack>
      </Stack>

      <CAlert
        alertContent={errorMsg}
        alertCategory="info"
        isAlertOpen={isAlertOpen}
        handleAlertClose={() => {
          setIsAlertOpen(false);
          navigate(-1);
        }}
      />
    </>
  );
});

export default OrderCancel;