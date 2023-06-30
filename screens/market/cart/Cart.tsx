import { Stack, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useStores } from 'src/models/root-store/root-store-context';
import { CartItem } from './cart-items/CartItem';
import { EmptyCartItem } from './cart-items/EmptyCartItem';
import { CHeader } from 'src/components/CHeader';
import { CallApiToStore } from 'src/utils/common';
import { HEADER } from 'src/config-global';

/**
 * ## Cart 설명
 *
 */

export const Cart = observer(() => {
  const rootStore = useStores();
  const { loadingStore, marketStore } = rootStore;
  const navigate = useNavigate();
  const [isRender, setIsRender] = useState(false);
  
  useEffect(() => {
    // 장바구니 목록 조회
    CallApiToStore(marketStore.cartStore.getCart({ page: 1, size: 100 }), 'api', loadingStore)
      .then(() => {
        setIsRender(true);
      })
      .catch((e) => {
        console.log(e);
      });

  }, [marketStore]);

  const options: any = {
    showMainIcon: 'back',
    showHomeIcon: true,
  };

  return (
    <Stack
      spacing={2}
      sx={{
        flex: 1,
        pb: `${HEADER.H_MOBILE * 1.5}px`,
      }}
    >
      <Stack>
        <CHeader
          title="장바구니"
          {...options}
        />
      </Stack>
      
      {isRender && (
        marketStore.cartStore.list.length > 0
        ? <CartItem />
        : <EmptyCartItem />
      )}
    </Stack>
  );
});

export default Cart;
