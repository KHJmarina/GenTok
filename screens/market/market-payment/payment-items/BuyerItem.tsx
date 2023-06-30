import { Box, Stack, Typography, Divider, TextField } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { CustomerHeader } from 'src/components/CustomerHeader';
import { HEADER } from 'src/config-global';
import { useNavigate, useParams } from 'react-router';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';

/**
 * ## BuyerItem 설명
 *
 */

export const BuyerItem = observer(() => {

  const phoneNumberOptions = [
    { label : '010' },  
    { label : '011' }, 
    { label : '016' },  
    { label : '019' }  
  ];

  const emailOptions = [
    { label : 'naver.com' },  
    { label : 'google.com' }
  ];

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const [openBuyer, setOpenBuyer] = useState(false);
  const [name, setName] = useState('홍길동');
  const [selectPhoneNo, setSelectPhoneNo] = useState('010');
  const [inputPhoneNo, setinputPhoneNo] = useState('12345678');
  const [inputEmail, setInputEmail] = useState('');
  const [selectEmail, setSelectEmail] = useState('');

  const handleToggle = () => {
    setOpenBuyer(!openBuyer);
  };

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSelectPhoneNo = (event: SelectChangeEvent) => {
    setSelectPhoneNo(event.target.value);
  };

  const handleInputPhoneNo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setinputPhoneNo(event.target.value);
  };

  const handleInputEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(event.target.value);
  };

  const handleSelectEmail = (event: SelectChangeEvent) => {
    setSelectEmail(event.target.value);
  };

  const methods = useForm({
  });

  const {
    reset,
    setError,
    handleSubmit,
    getValues,
  } = methods;

  return (
    <>
      <FormProvider methods={methods}>
       <Stack sx={{ m: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }} justifyContent='space-between' onClick={() => {handleToggle()}}>
            <Typography variant={'h5'} sx={{ fontWeight: 600 }}>주문자</Typography>
            <Typography sx={{ fontSize: theme.typography.pxToRem(14), color: '#9DA0A5', ml: 'auto', mr: 1 }}>{name},{selectPhoneNo}-{inputPhoneNo.substring(0,4)}-{inputPhoneNo.substring(4)}</Typography>
            <Box sx={{ color: '#9DA0A5', mt: 0.5 }}> 
              {openBuyer ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </Box>
          </Box>
          {openBuyer && (
            <Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant='subtitle2' sx={{ flex: '0 0 auto', width: 60, textAlign: 'left' }}>이름</Typography>
                <TextField 
                  variant="outlined" 
                  value={name}
                  placeholder={'이름을 입력해 주세요.'}
                  size="small"
                  onChange={handleName}
                  sx={{ fontSize: theme.typography.pxToRem(14), width: '100%' }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant='subtitle2' sx={{ flex: '0 0 auto', width: 60, textAlign: 'left' }}>연락처</Typography>
                <FormControl sx={{ minWidth: 100 }}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectPhoneNo}
                    onChange={handleSelectPhoneNo}
                    sx={{ maxHeight: 40 }}
                  >
                    {phoneNumberOptions.map((option) => (
                      <MenuItem key={option.label} value={option.label}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ width: '100%', mt: 1 }}>
                  <TextField 
                    variant="outlined" 
                    value={inputPhoneNo}
                    placeholder={'입력해 주세요.'}
                    size="small"
                    onChange={handleInputPhoneNo}
                    sx={{ fontSize: theme.typography.pxToRem(14), width: '100%' }}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  />
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant='subtitle2' sx={{ flex: '0 0 auto', width: 60, textAlign: 'left' }}>이메일</Typography>
                  <TextField 
                    variant="outlined" 
                    value={inputEmail}
                    placeholder={'이메일을 입력해 주세요.'}
                    size="small"
                    onChange={handleInputEmail}
                    sx={{ fontSize: theme.typography.pxToRem(14), width: '100%' }}
                  />
                  <Typography>@</Typography>
                </Box>
                <FormControl sx={{ ml: 9.5, width: 'calc(100% - 76px)' }}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectEmail}
                    onChange={handleSelectEmail}
                    sx={{ maxHeight: 40 }}
                  >
                    {emailOptions.map((option) => (
                      <MenuItem key={option.label} value={option.label}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          )}
        </Stack>
        <Divider sx={{ borderColor: '#FAFAFA' }}/>
      </FormProvider>
    </>
  );
});

export default BuyerItem;