import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import { Button, Typography, useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import { Icon } from '@iconify/react';
import { textAlign } from '@mui/system';
import kakao_imm from '../../../assets/images/kakao.svg';


/**
 * ## CustomerKakao 설명
 *
 */
export const CustomerKakao = observer(() => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  const iconColor = theme.palette.action.disabled

  const [color, setColor] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    try {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init('ee050318dc00d7e1a54075f958782cc4');
        }
      }
      document.body.appendChild(script);
      document.body.removeChild(script);
    } catch (err) { }
  }, [])

  const addChannel = () => {
    setColor(!color);
    window.Kakao.Channel.chat({
      channelPublicId: '_cTxgxmxj',
    });
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: pxToRem(4), px: pxToRem(20), pt: pxToRem(27) }}>
        <Box><Typography variant='Kor_16_b' sx={{ display: 'inline-block' }}>카카오톡 상담</Typography></Box>
        <Button id="add-channel-button" onClick={() => { addChannel() }} sx={{ display: 'flex', flexDirection: 'row', color: '#DFE0E2', alignItems: 'center' }} >
          <Box sx={{ display: 'flex', alignItems: 'center', }}>
            <Box component={Icon} icon={'bi:chat-fill'} ></Box>
            <Typography sx={{ mx: 1 }}>GenTok</Typography>
          </Box>
          <Box component={Icon} icon={'ep:arrow-right-bold'} sx={{ pointer: 'cursor' }}></Box>
        </Button>
      </Box>
    </>
  );
});

export default CustomerKakao;