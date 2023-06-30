import { Box, Stack, Typography, Button, Divider } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { PATH_ROOT } from 'src/routes/paths';
import { CallApiToStore } from 'src/utils/common';
import { CustomTextField } from 'src/components/custom-input';
import { pxToRem } from 'src/theme/typography';
import { useAuthContext } from 'src/auth/useAuthContext';

/**
 * ## AddressItem 설명
 *
 */

export const AddressItem = observer(() => {
  const rootStore = useStores();
  const { loadingStore, codeStore, addressStore, orderStore } = rootStore;
  const theme = useTheme();

  const navigate = useNavigate();
  const [openAddress, setOpenAddress] = useState(true);
  const [request, setRequest] = useState('none');
  const [inputRequest, setInputRequest] = useState('');
  const { user } = useAuthContext();

  const handleToggle = () => {
    setOpenAddress(!openAddress);
  };

  const handleAddress = () => {
    navigate(PATH_ROOT.market.address, {state: {from: 'payment'}});
  }

  const handleRequest = (event: SelectChangeEvent) => {
    setRequest(event.target.value);
    orderStore.orderItem.setProps({
      dlivryReqCd: Number(event.target.value),
    });
  };

  const onChangeInput = (e: any) => {
    setInputRequest(e.target.value);
    orderStore.orderItem.setProps({
      dlivryReqMemo: e.target.value,
    });
  };

  const getCode = async () => {
    await CallApiToStore(codeStore.getGlobalGroupCode(900502),'api', loadingStore)
      .then(() => {
      })
      .catch((e) => {
      });
  };

  const getAddrDefault = async () => {
    await CallApiToStore(addressStore.getAddrDefault(),'api', loadingStore)
      .then(() => {
        orderStore.orderItem.setProps({
          rcipntNm: addressStore.address.rcipntNm,
          phoneNo: addressStore.address.phonePrefix + '-' + addressStore.address.phoneNo,
          zoneCd: addressStore.address.zone,
          addr: addressStore.address.totAddr,
        })
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    getCode();
    if(orderStore.orderItem.dlivryReqMemo) {
      setInputRequest(orderStore.orderItem.dlivryReqMemo);
    }
    if(orderStore.orderItem.dlivryReqCd) {
      setRequest(orderStore.orderItem.dlivryReqCd.toString());
    }

    if(!addressStore.tempAddr || (addressStore.tempAddr && !addressStore.tempAddr.totAddr)) {
      getAddrDefault();
    }
  },[]);

  return (
    <>
      <Stack sx={{ m: pxToRem(20), mt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }} justifyContent='space-between' onClick={() => handleToggle()}>
          <Typography variant={'h5'} sx={{ fontWeight: 600 }}>배송지</Typography>
          <Box sx={{ color: '#9DA0A5' }}> 
            {openAddress ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </Box>
        </Box>
        { openAddress && 
          <>
            { addressStore.tempAddr && addressStore.tempAddr.totAddr
              ? (<Box sx={{ textAlign: 'left', mt: pxToRem(30) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(16) }}>
                    <Typography variant='subtitle1'>{addressStore.tempAddr.dlivryAddrNm}</Typography>
                    { addressStore.tempAddr.defaultYn && (
                      <Box
                        sx={{
                          backgroundColor: '#FFF0D9',
                          borderRadius: 10,
                          width: 60,
                          height: 18,
                          color: '#FF7F3F',
                          fontSize: pxToRem(10),
                          fontWeight: 600,
                          textAlign: 'center',
                          pt: pxToRem(1),
                          ml: pxToRem(4),
                        }}
                      >
                        기본배송지
                      </Box>
                    )}
                    <Box 
                      id={'btn-cart-payment-change-address'}
                      sx={{ color: '#FF7F3F', fontSize: pxToRem(12), fontWeight: 600, textDecoration: 'underline', ml: 'auto' }}
                      onClick={() => {handleAddress()}}
                    >
                      배송지 변경
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant='Kor_14_r'>{addressStore.tempAddr.rcipntNm}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='Kor_14_r'>
                      {addressStore.tempAddr.phonePrefix}-{addressStore.tempAddr.phoneNo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='Kor_14_r'>{addressStore.tempAddr.totAddr}</Typography>
                  </Box>
                </Box>
              )
              : ( addressStore.address.totAddr
                  ? (<Box sx={{ textAlign: 'left', mt: pxToRem(30) }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(16) }}>
                        <Typography variant='subtitle1'>{addressStore.address.dlivryAddrNm}</Typography>
                        <Box
                          sx={{
                            backgroundColor: '#FFF0D9',
                            borderRadius: pxToRem(999),
                            width: 60,
                            height: 18,
                            color: '#FF7F3F',
                            fontSize: pxToRem(10),
                            fontWeight: 600,
                            textAlign: 'center',
                            pt: pxToRem(1),
                            ml: pxToRem(4),
                          }}
                        >
                          기본배송지
                        </Box>
                        <Box 
                          id={'btn-cart-payment-change-address'}
                          sx={{ color: '#FF7F3F', fontSize: pxToRem(12), fontWeight: 600, textDecoration: 'underline', ml: 'auto' }}
                          onClick={() => {handleAddress()}}
                        >
                          배송지 변경
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant='Kor_14_r'>{addressStore.address.rcipntNm}</Typography>
                      </Box>
                      <Box>
                        <Typography variant='Kor_14_r'>
                        {addressStore.address.phonePrefix}-{addressStore.address.phoneNo}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant='Kor_14_r'>{addressStore.address.totAddr}</Typography>
                      </Box>
                    </Box>
                  )
                  : (<Box sx={{ mt: pxToRem(16), mb: pxToRem(40) }}>
                      <Box sx={{ mb: pxToRem(8) }}>
                        <Typography variant='Kor_14_r' sx={{ color: '#9DA0A5' }}>배송지를 등록해주세요.</Typography>
                      </Box>
                      <Button
                        id={'btn-cart-payment-addAddress'}
                        variant={'outlined'}
                        sx={{ 
                          borderRadius: pxToRem(500),
                          width: 154, 
                          height: 43, 
                          color: 'primary', 
                          fontSize: pxToRem(16), 
                          fontWeight: 500 
                        }}
                        onClick={() => {
                          navigate(PATH_ROOT.market.add);
                        }}
                      >
                        배송지 등록
                      </Button>
                    </Box>
                  )
              )
            }

            {String(request) === '13' &&
              <Stack sx={{ display: 'flex', flexDirection: 'column', position: 'relative', my: pxToRem(20) }}>
                <CustomTextField
                  id="outlined-textarea"
                  placeholder="배송 요청사항을 입력해주세요"
                  sx={{
                    minHeight: 50,
                    '& .MuiOutlinedInput-root': {
                      border:
                        inputRequest.length === 0
                          ? 'solid 1px #EEEEEE'
                          : 'solid 1px #FF7F3F',
                    },
                    '& .MuiInputBase-root': { p: 0, fontSize: pxToRem(14) },
                    '& .MuiInputBase-input': { p: pxToRem(8) },
                  }}
                  rows={5}
                  onChange={onChangeInput}
                  value={inputRequest}
                  multiline
                />
                <Box
                  sx={{
                    display: 'flex',
                    position: 'absolute',
                    bottom: '10%',
                    right: '3%',
                    fontWeight: theme.typography.fontWeightRegular,
                    ml: 'auto',
                  }}
                >
                  <Typography sx={{ color: inputRequest.length === 0 ? '#DFE0E2' : '#202123' }}> {inputRequest.length}&nbsp; </Typography>
                  <Typography sx={{ color: '#DFE0E2' }}> / 500 </Typography>
                </Box>
              </Stack>
            }

            <Select
              name={'request'}
              id="demo-simple-select"
              value={request}
              onChange={handleRequest}
              sx={{
                maxHeight: 40,
                textAlign: 'left',
                mt: String(request) === '13' ? null : pxToRem(16),
              }}
            >
              <MenuItem disabled value={'none'}>배송 시 요청사항을 선택해주세요</MenuItem>
              {codeStore.codeGroup.map((option) => (
                <MenuItem key={option.groupCdSid} value={option.groupCdSid}>{option.groupCdNm}</MenuItem>
              ))}
            </Select>
          </>
        }
      </Stack>
      <Divider sx={{ borderColor: '#FAFAFA' }}/>
    </>
  );
});

export default AddressItem;