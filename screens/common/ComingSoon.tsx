import { Helmet } from 'react-helmet-async';
// @mui
import { Box, Stack, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { ComingSoonIllustration } from 'src/assets/illustrations';
import { CustomTextField } from 'src/components/custom-input';
import useCountdown from 'src/hooks/useCountdown';
import { Link as RouterLink } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ComingSoon() {
  const { days, hours, minutes, seconds } = useCountdown(new Date('3/25/2023 00:00'));

  return (
    <>
      <Helmet>
        <title> GenTok</title>
      </Helmet>

      <Typography variant="h3" paragraph>
        Coming Soon!
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        We are currently working hard on this page!
      </Typography>

      <ComingSoonIllustration
        sx={{
          height: { xs: 150, md: 260 },
          my: { xs: 10, sm: 10 },
        }}
      />

      {/* <Stack
        direction="row"
        justifyContent="center"
        divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}>:</Box>}
        sx={{ typography: 'h2' }}
      >
        <TimeBlock label="Days" value={days} />

        <TimeBlock label="Hours" value={hours} />

        <TimeBlock label="Minutes" value={minutes} />

        <TimeBlock label="Seconds" value={seconds} />
      </Stack> */}

      <Button component={RouterLink} to="/" size="large" variant="contained" sx={{ width: '100%', borderRadius: 5 }}>
        홈으로 이동
      </Button>
      {/* <CustomTextField
        fullWidth
        placeholder="Enter your email"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button variant="contained" size="large">
                Notify Me
              </Button>
            </InputAdornment>
          ),
          sx: { pr: 0.5 },
        }}
        sx={{ my: 5 }}
      /> */}

      <Stack spacing={1} alignItems="center" justifyContent="center" direction="row">
      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

type TimeBlockProps = {
  label: string;
  value: string;
};

function TimeBlock({ label, value }: TimeBlockProps) {
  return (
    <div>
      <Box> {value} </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body1' }}>{label}</Box>
    </div>
  );
}
