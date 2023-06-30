import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { MotionContainer, varBounce } from 'src/components/animate';
import { ForbiddenIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export default function Page403() {
  return (
    <>
      <Helmet>
        <title>GenTok</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            No permission
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            The page you&apos;re trying access has restricted access.
            <br />
            Please refer to your system administrator
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration
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
