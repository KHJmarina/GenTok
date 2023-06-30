import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Typography, Stack } from '@mui/material';
// assets
import { MaintenanceIllustration } from '../../assets/illustrations';

// ----------------------------------------------------------------------

export default function Maintenance() {
  return (
    <>
      <Helmet>
        <title> GenTok</title>
      </Helmet>

      <Stack sx={{ alignItems: 'center' }}>
        <Typography variant="h3" paragraph>
          Website currently under maintenance
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          We are currently working hard on this page!
        </Typography>

        <MaintenanceIllustration
          sx={{
            height: { xs: 150, md: 240 },
            my: { xs: 20, sm: 15 },
          }}
        />

        <Button component={RouterLink} to="/" size="large" variant="contained" sx={{ width: '100%', borderRadius: 5 }}>
          홈으로 이동
        </Button>
      </Stack>
    </>
  );
}
