import Box from '@mui/material/Box';
import { Stack, Typography, Divider, List, ListItem } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Iconify from '../../../components/iconify';
import { pxToRem } from 'src/theme/typography'
import myMenuNavConfig  from './config-myMenu-navigation'
import { PATH_ROOT } from '../../../routes/paths';
import customerServiceNavConfig from './config-cs-navigation';
/**
 * ## MypageNavConfig 설명
 *
 */
export const MypageNavConfig = observer(() => {
 
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <>
      <Stack sx= {{ mt : pxToRem(50), px: pxToRem(20) }}>
        {/* 나의 메뉴 */}
        <Box sx= {{ display: 'flex', justifyContent :'space-between', alignItems:'center'}}>
          <Typography variant={'Kor_20_b'}> 나의 메뉴 </Typography>
          <Iconify
            width={16}
            icon={'eva:arrow-ios-forward-fill'}
            sx={{ ml: 1, color: '#DFE0E2' }}
            />
        </Box>
        <Divider sx= {{ border: '0.5px solid #EEEEEE', my: pxToRem(11)}} />
        <List sx= {{ py: 0 }}>
          {myMenuNavConfig.map((item : any, index: any) => (
            <ListItem key={index} sx= {{ px : 0, cursor:'pointer' }} onClick={() => { navigate(`${item.path}`) }} >
              <Typography variant={'Kor_16_r'} sx= {{ color : '#9DA0A5' }} >{item.title}</Typography>
            </ListItem>
          ))}
        </List>
        
        {/* 이벤트 */}
        <Box sx= {{ display: 'flex', justifyContent :'space-between', alignItems:'center', mt: pxToRem(26), cursor:'pointer' }} onClick = {() => { navigate(`${PATH_ROOT.event.root}`) }}>
          <Typography variant={'Kor_20_b'}> 이벤트 </Typography>
          <Iconify
            width={16}
            icon={'eva:arrow-ios-forward-fill'}
            sx={{ ml: 1, color: '#DFE0E2' }}
            />
        </Box>
        <Divider sx= {{ border: '0.5px solid #EEEEEE', my: pxToRem(11)}} />
        
        {/* 고객센터 */}
        <Box sx= {{ display: 'flex', justifyContent :'space-between', alignItems:'center', mt: pxToRem(23), cursor:'pointer' }} onClick={() => navigate(`${PATH_ROOT.customer.customer}`)}>
          <Typography variant={'Kor_20_b'}> 고객센터 </Typography>
          <Iconify
            width={16}
            icon={'eva:arrow-ios-forward-fill'}
            sx={{ ml: 1, color: '#DFE0E2' }}
            />
        </Box>
        <Divider sx= {{ border: '0.5px solid #EEEEEE', my: pxToRem(11)}} />
        <List sx= {{ py: 0 }}>
          {customerServiceNavConfig.map((item : any, index: any) => (
            <ListItem key={index} sx= {{ px : 0, cursor:'pointer' }} onClick={() => { navigate(`${item.path}`)}} >
              <Typography variant={'Kor_16_r'} sx= {{ color : '#9DA0A5' }} >{item.title}</Typography>
            </ListItem>
          ))}
        </List>
        
      </Stack>
    </>
  );
});
export default MypageNavConfig;
