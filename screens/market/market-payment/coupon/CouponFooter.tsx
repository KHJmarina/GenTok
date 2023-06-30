import { Button, Paper, Slide, Stack, Toolbar, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

export function CouponFooter(props: any) {
  const theme = useTheme();
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    setShowToolbar(true);
  });

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
              background: theme.palette.primary.main,
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
              sx={{
                fontWeight: 600,
                fontSize: theme.typography.pxToRem(18),
                color: '#FFFFFF',
                width: '100%',
              }}
              onClick={() => { props.applyCoupon() }}
            >
              적용하기
            </Button>
          </Toolbar>
        </Paper>
      </Slide>
    </Stack>
  );
}
