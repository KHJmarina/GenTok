import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { MotionContainer, varBounce } from 'src/components/animate';
import { SeverErrorIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <>
      <Helmet>
        <title>GenTok</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            500 Internal Server Error
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            There was an error, please try again later.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeverErrorIllustration
            sx={{
              height: { xs: 150, md: 260 },
              my: { xs: 20, sm: 15 },
            }}
          />
        </m.div>

        <Button component={RouterLink} to="/" size="large" variant="contained" sx={{ width: '100%', borderRadius: 5 }}>
          홈으로 이동
        </Button>
      </MotionContainer>
    </>
  );
}
