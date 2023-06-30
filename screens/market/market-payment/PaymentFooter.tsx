 import { Badge, Box, Button, IconButton, Paper, Slide, Stack, Toolbar, Typography, useTheme } from '@mui/material';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close.svg';
import { PATH_ROOT } from 'src/routes/paths';
import { useStores } from "src/models/root-store/root-store-context"
import { numberComma } from 'src/utils/common';

export function PaymentFooter(props: any) {
  const theme = useTheme();
  const [showToolbar, setShowToolbar] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();
  const rootStore = useStores();
  const { loadingStore, orderStore } = rootStore;

  const onClickCart = useCallback(() => {
    navigate(PATH_ROOT.market.cart);
  }, [navigate]); 

  const onClickBuy = useCallback(() => {
    navigate(PATH_ROOT.market.payment);
  }, [navigate]);

  useEffect(() => {
    setShowToolbar(true);
  });

  const shadows = useMemo(
    () =>
      theme.shadows[24].replace(/0px (\d+)px/g, (match, p1) => {
        const value = Number(p1);
        return `0px ${value * -1}px`;
      }),
    [theme],
  );

  const onSubmit = () => {
    props.onSubmit();
  }

  return (
    <Stack>
      <Slide direction="up" in={showToolbar} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar,
            borderRadius: 4,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            background: 'transparent',
            display: 'flex',
            justifyContent: 'center',
          }}
          elevation={0}
          >
          <Toolbar
            sx={{
              width: '100%',
              maxWidth: theme.breakpoints.values.md,
              height: 60,
              background: orderStore.isPending ? '#C6C7CA' : theme.palette.primary.main,
              borderRadius: 4,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              justifyContent: 'space-between',
              '&:hover':{
                background:'#FF5D0C !important'
              } 
            }}
          >
            <Button
              id={'btn-cart-payment-pay'}
              sx={{
                fontWeight: 600,
                fontSize: theme.typography.pxToRem(18),
                color: '#FFFFFF',
                width: '100%',
              }}
              onClick={() => { onSubmit() }}
              disabled={orderStore.isPending}
            >
              <Box
                component='span'
                sx={{ fontSize: theme.typography.pxToRem(20), fontWeight: 600 }}
              >
                {numberComma(props.totPaymentAmt)}
              </Box> 
              {orderStore.amtInfo.payment.currencyCd?.value} 결제하기
            </Button>
          </Toolbar>
        </Paper>
      </Slide>
    </Stack>
  );
}
