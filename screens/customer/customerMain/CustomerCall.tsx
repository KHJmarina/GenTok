import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import { Button, Typography, useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import { Icon } from '@iconify/react';
import { textAlign } from '@mui/system';



/**
 * ## CustomerCall 설명
 *
 */
export const CustomerCall = observer(() => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  const handleCall = () => {
    const phoneNumber = '15224955'
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <>
      <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderRadius:pxToRem(4), px:pxToRem(20), pt:pxToRem(25), pb:pxToRem(60)}}>
        <Box><Typography variant='Kor_16_b' sx={{display:'inline-block'}}>전화 상담</Typography></Box>
        <Button onClick={handleCall} sx={{display:'flex', flexDirection:'row',color:'#DFE0E2', alignItems:'center'}}>
          <Box sx={{display:'flex', alignItems:'center'}}>
          <Box component={Icon} icon={'fa:phone'} sx={{cursor:'pointer'}} ></Box>
            <Typography sx={{mx:1}}>1522-4955</Typography>
          </Box>
          <Box component={Icon} icon={'ep:arrow-right-bold'} sx={{cursor:'pointer'}}></Box>
        </Button>
      </Box>
    </>
  );
});

export default CustomerCall;