import { Box, Stack, Typography, Divider, Checkbox, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Iconify from 'src/components/iconify';
import { ICodeItemModel } from 'src/models/code-list/CodeItem';
import { pxToRem } from 'src/theme/typography';

/**
 * ## MethodItem 설명
 *
 */
export const MethodItem = observer(() => {

  const rootStore = useStores();
  const { loadingStore, orderStore } = rootStore;
  const theme = useTheme();

  const navigate = useNavigate();
  const [openMethod, setOpenMethod] = useState(false);
  const [check, setCheck] = useState(false);
  const [paymentCode, setPaymentCode] = useState<ICodeItemModel[]>([]);
  const [method, setMethod] = useState('신용/체크카드');

  const handleToggle = () => {
    setOpenMethod(!openMethod);
  };

  const radioCheckedIcon = (
    <Iconify icon={'material-symbols:radio-button-checked'} />
  );

  const checkboxIcon = (
    <Iconify
      icon={'material-symbols:check-circle-outline-rounded'}
      color={theme.palette.grey[400]}
    />
  );
  const checkedIcon = (
    <Iconify icon={'material-symbols:check-circle-outline-rounded'} />
  );

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    const tempArr = paymentCode.filter((code) => code.code === Number(value));
    if(tempArr) {
      setMethod(tempArr[0].value); 
      orderStore.orderItem.setProps({
        paymentTypeCd: Number(value),
      })
    }
  }

  const getCode = () => {
    const code = rootStore.codeListStore.list.filter((code) => code.name === 'PAYMENT_TYPE_CD');
    if(code) {
      setPaymentCode(code[0].list);
    }
  };

  useEffect (() => {
    getCode();
    orderStore.orderItem.setProps({
      paymentTypeCd: 211001,
    })
  },[]);

  return (
    <>
      <Stack sx={{ m: pxToRem(20) }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }} justifyContent='space-between' onClick={() => {handleToggle()}}>
          <Typography variant={'Kor_18_b'} sx={{ fontWeight: 600 }}>결제수단</Typography>
          {!openMethod && <Typography sx={{ fontSize: pxToRem(14), color: '#9DA0A5', ml: 'auto', mr: pxToRem(14) }}>{method}</Typography>}
          <Box sx={{ color: '#9DA0A5', mt: 0.5 }}> 
            {openMethod ? <ArrowUpIcon style={{ cursor: 'pointer' }}/> : <ArrowDownIcon style={{ cursor: 'pointer' }}/>}
          </Box>
        </Box>

        { openMethod && (
          <Stack sx={{ mt: 2 }}>
            <RadioGroup sx={{ '& .MuiRadio-root': {color: '#BDBDBD'} }} onChange={handleRadioChange}>
              {paymentCode.map((code,index) => {
                return (
                  <Stack key={index}>
                    <FormControlLabel id={`btn-cart-payment-paymentMethod`} value={code.code} control={<Radio checkedIcon={radioCheckedIcon}/>} label={code.value} sx={{ mb: 1 }} checked={true}/>
                    {/* <Divider sx={{ borderColor: '#EEEEEE', borderWidth: 0.5, mb: 1 }}/> */}
                  </Stack>
                )
              })}
              {/* <FormControlLabel value="simple" control={<Radio checkedIcon={radioCheckedIcon}/>} label="간편결제" sx={{ mb: 1 }}/> */}
            </RadioGroup>

            
            {/* <Divider sx={{ borderColor: '#EEEEEE', borderWidth: 0.5 }}/>
            <Box sx={{ color: '#9DA0A5', mx: 2, my: 2 }}>
              <ul style={{ textAlign: 'left' }}>
                <li style={{ fontSize: pxToRem(12) }}>카카오톡 앱을 설치한 후, 최초 1회 카드정보를 등록하셔야 사용 가능합니다.</li>
                <li style={{ fontSize: pxToRem(12) }}>카카오머니로 결제 시, 현금영수증 발급은 (주)카카오페이에서 발급가능합니다.</li>
              </ul>
            </Box> */}

            {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                icon={checkboxIcon}
                checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
                onClick={(e: any) => {
                  if (e.nativeEvent.target.checked !== undefined) {
                    setCheck(!check);
                  }
                }}
                sx={{ p: 0, mr: 1 }}
              />
              <Typography sx={{ fontSize: pxToRem(14) }}>결제수단과 입력정보를 다음에도 사용</Typography>
            </Box> */}
          </Stack>
        )}
      </Stack>
      <Divider sx={{ borderColor: '#FAFAFA' }}/>
    </>
  );
});

export default MethodItem;