import Box from '@mui/material/Box';
import { Stack, Typography, Button, IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../../../models/root-store/root-store-context';
import { HEADER, SPACING } from 'src/config-global';
import { PATH_AUTH, PATH_PAGE, PATH_ROOT } from '../../../../routes/paths';
import { useTheme } from '@mui/material';
import AddressList from './address-list/AddressList';
import { CallApiToStore } from 'src/utils/common';
import { IAddressSnapshot, ICodeSnapshot } from 'src/models';
import { Props } from 'src/components/animate';
import { prefix } from 'stylis';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import { CHeader } from 'src/components/CHeader';
/**
 * ## Address 설명
 *
 */
export const Address = observer((props: any) => {
  const rootStore = useStores();
  const { codeStore, addressStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [render, setRender] = useState<boolean>(false);

  const getAddr = async () => {
    CallApiToStore(addressStore.getAddrList(), 'api', loadingStore).then(() => {
      setRender(true);
    });
  };

  const handleSelect = () => {
    navigate(PATH_ROOT.market.payment);
  };

  useEffect(() => {
    getAddr();

    // getPhonePrefix();
  }, []);

  const options: any = {
    showMainIcon: 'none',
    showXIcon: true,
  };

  return (
    <>
      {render && (
        <Stack
          sx={{
            pb: `${HEADER.H_MOBILE}px`,
          }}
        >
          <CHeader title="배송지 선택" {...options} />
          <AddressList getAddr={getAddr} />

          <Box
            id={'btn-cart-payment-addDeliveryAddress'}
            sx={{
              display:'flex',
              alignItems:'center',
              justifyContent:'space-around',
              position: 'fixed',
              bottom: 0,
              width: '100%',
              borderRadius: '2rem 2rem 0 0 !important',
              maxWidth: theme.breakpoints.values.md,
              boxShadow: 20,
              border: 'none',
              height: '60px',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              '&:hover': {
                border: 'none',
                boxShadow: 20,
                background: '#FFFFFF',
              },
            }}
            onClick={() => {
              navigate(PATH_ROOT.market.add);
            }}
          >
            <Typography variant='Eng_16_b' sx={{ color: theme.palette.primary.main }}>+&nbsp;&nbsp;배송지 추가</Typography>
          </Box>
        </Stack>
      )}
    </>
  );
});

export default Address;
